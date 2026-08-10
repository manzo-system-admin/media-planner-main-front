const fs = require("fs");
const path = require("path");
const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldPath } = require("firebase-admin/firestore");

const DRY_RUN = process.argv.includes("--dry-run");
const COLLECTION = "clients";
const TARGET_CATEGORY = "pr";
const PRESERVED_CATEGORY = "ipo";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Set it in .env.local or the shell environment.`);
  }
  return value;
}

function initializeFirebaseAdmin() {
  loadEnvFile(path.join(process.cwd(), ".env.local"));
  loadEnvFile(path.join(process.cwd(), ".env"));

  const projectId = requiredEnv("FIREBASE_PROJECT_ID");
  const clientEmail = requiredEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

  if (!getApps().length) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }

  return getFirestore();
}

async function commitInBatches(db, docs) {
  let updated = 0;

  for (let index = 0; index < docs.length; index += 500) {
    const batch = db.batch();
    const chunk = docs.slice(index, index + 500);

    for (const clientDoc of chunk) {
      batch.update(clientDoc.ref, { category: TARGET_CATEGORY });
    }

    await batch.commit();
    updated += chunk.length;
    console.log(`Updated ${updated}/${docs.length} clients...`);
  }
}

async function main() {
  const db = initializeFirebaseAdmin();
  const snapshot = await db.collection(COLLECTION).orderBy(FieldPath.documentId()).get();

  const docsToUpdate = snapshot.docs.filter((clientDoc) => {
    const category = clientDoc.get("category");
    return category !== PRESERVED_CATEGORY && category !== TARGET_CATEGORY;
  });

  console.log(`Found ${snapshot.size} clients.`);
  console.log(`Clients already IPO will be left unchanged.`);
  console.log(`Clients to set to PR: ${docsToUpdate.length}`);

  if (docsToUpdate.length === 0) return;

  if (DRY_RUN) {
    console.log("Dry run only. Re-run without --dry-run to update Firestore.");
    for (const clientDoc of docsToUpdate) {
      const name = clientDoc.get("name") || "(no name)";
      const category = clientDoc.get("category");
      console.log(`- ${clientDoc.id}: ${name} (${category || "no category"} -> ${TARGET_CATEGORY})`);
    }
    return;
  }

  await commitInBatches(db, docsToUpdate);
  console.log("Done. Non-IPO clients are now PR.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
