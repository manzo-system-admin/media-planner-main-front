const fs = require("node:fs");
const path = require("node:path");
const { loadEnvConfig } = require("@next/env");
const { cert, initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const apply = process.argv.includes("--apply");
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "video-library-import-manifest.json"), "utf8"));
const importedIds = new Set(manifest.items.map((item) => item.id));

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function validateManifest() {
  if (manifest.sourceDocumentId !== "1RKw6u5cBlzRYXYNK2hES5DbEaxVpgK-a") {
    throw new Error("Unexpected source document");
  }
  if (manifest.items.length !== 47 || importedIds.size !== manifest.items.length) {
    throw new Error("Unexpected video count or duplicate IDs");
  }
  for (const item of manifest.items) {
    if (!item.title || !/^\d{4}-\d{2}-\d{2}$/.test(item.date) || !item.thumbnail) {
      throw new Error(`Incomplete video: ${item.id}`);
    }
    if (item.videoSource.kind !== "youtube" && item.videoSource.kind !== "tiktok") {
      throw new Error(`Unsupported video source: ${item.id}`);
    }
  }
}

async function main() {
  validateManifest();
  loadEnvConfig(process.cwd());
  const app = initializeApp({
    credential: cert({
      projectId: requiredEnv("FIREBASE_PROJECT_ID"),
      clientEmail: requiredEnv("FIREBASE_CLIENT_EMAIL"),
      privateKey: requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
  });
  const db = getFirestore(app);
  const snapshot = await db.collection("videoLibrary").get();
  const existing = new Map(snapshot.docs.map((doc) => [doc.id, doc]));
  const oldActive = snapshot.docs.filter((doc) => !importedIds.has(doc.id) && !doc.data().deleted);
  const missing = manifest.items.filter((item) => !existing.has(item.id));
  const present = manifest.items.filter((item) => existing.has(item.id));
  for (const item of present) {
    const data = existing.get(item.id).data();
    if (
      data.title !== item.title || data.date !== item.date || data.thumbnail !== item.thumbnail ||
      JSON.stringify(data.videoSource) !== JSON.stringify(item.videoSource)
    ) {
      throw new Error(`Existing imported record differs: ${item.id}`);
    }
  }
  if (present.length > 0 && missing.length > 0) {
    throw new Error("Partial import detected; review before applying again");
  }

  console.log(`Existing records: ${snapshot.size}; old active: ${oldActive.length}`);
  console.log(`New video records: ${manifest.items.length}; present: ${present.length}; to create: ${missing.length}`);
  console.log(`Excluded non-video URL: ${manifest.skipped.length}`);
  if (!apply) {
    console.log("Dry run only. Add --apply to replace the video library.");
    return;
  }
  if (oldActive.length === 0 && missing.length === 0) {
    console.log("Already replaced; no changes made.");
    return;
  }

  const batch = db.batch();
  for (const old of oldActive) batch.update(old.ref, { deleted: true });
  for (const item of missing) {
    batch.create(db.collection("videoLibrary").doc(item.id), { ...item, deleted: false });
  }
  batch.create(db.collection("activityLogs").doc(), {
    action: "update",
    section: "คลังวิดีโอ",
    label: `แทนที่รายการเดิมด้วยวิดีโอ ${manifest.items.length} รายการจาก VDO.docx`,
    actorEmail: "",
    createdAt: FieldValue.serverTimestamp(),
  });
  await batch.commit();
  console.log(`Replaced library: archived ${oldActive.length} old active records; added ${missing.length} videos.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
