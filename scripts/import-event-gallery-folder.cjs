const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { loadEnvConfig } = require("@next/env");
const { cert, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const sharp = require("sharp");

const sourceDir = process.argv[2];
const apply = process.argv.includes("--apply");
const collectionName = "eventGallery";
const importName = "archive-2026";

if (!sourceDir) {
  console.error("Usage: node scripts/import-event-gallery-folder.cjs <folder> [--apply]");
  process.exit(1);
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function listFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  }));
  return nested.flat();
}

function parseFile(filePath) {
  const name = path.basename(filePath);
  const match = /^(\d{3})\s*-\s*(\d{2})\.(\d{2})\.(\d{4})\s+(.+)\.(jpe?g|png|webp)$/i.exec(name);
  if (!match) throw new Error(`Unexpected filename: ${name}`);

  const order = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const year = Number(match[4]) - 543;
  const parsedDate = new Date(Date.UTC(year, month - 1, day));
  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() + 1 !== month ||
    parsedDate.getUTCDate() !== day
  ) {
    throw new Error(`Invalid date: ${name}`);
  }

  return {
    filePath,
    name,
    order,
    date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    caption: match[5].replace(/_+$/, "").trim(),
    extension: match[6].toLowerCase().replace("jpeg", "jpg"),
    id: `${importName}-${match[1]}`,
  };
}

async function prepareImage(item) {
  const original = await fs.readFile(item.filePath);
  const dimensions = await sharp(original).metadata();
  const shouldResize = Math.max(dimensions.width ?? 0, dimensions.height ?? 0) > 1920 ||
    original.length > 1_500_000;
  if (shouldResize) {
    const resized = await sharp(original)
      .rotate()
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 82 })
      .toBuffer();
    if (resized.length < original.length) {
      return { bytes: resized, extension: "jpg", contentType: "image/jpeg" };
    }
  }
  const contentType = item.extension === "jpg" ? "image/jpeg" : `image/${item.extension}`;
  return { bytes: original, extension: item.extension, contentType };
}

async function main() {
  loadEnvConfig(process.cwd());
  const projectId = requiredEnv("FIREBASE_PROJECT_ID");
  const bucketName = requiredEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  const app = initializeApp({
    credential: cert({
      projectId,
      clientEmail: requiredEnv("FIREBASE_CLIENT_EMAIL"),
      privateKey: requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
    storageBucket: bucketName,
  });
  const db = getFirestore(app);
  const bucket = getStorage(app).bucket();

  const files = await listFiles(sourceDir);
  const items = files.map(parseFile).sort((a, b) => a.order - b.order);
  if (items.length === 0) throw new Error("No images found");
  for (let index = 0; index < items.length; index++) {
    if (items[index].order !== index + 1) throw new Error("File sequence must be unique and continuous");
  }

  const snapshot = await db.collection(collectionName).get();
  const existing = new Map(snapshot.docs.map((doc) => [doc.id, doc.data()]));
  const pending = items.filter((item) => {
    const doc = existing.get(item.id);
    if (!doc) return true;
    if (doc.date !== item.date || doc.order !== item.order || doc.caption !== item.caption) {
      throw new Error(`Existing document differs: ${item.id}`);
    }
    return false;
  });

  console.log(`Project: ${projectId}; bucket: ${bucketName}`);
  console.log(`Source images: ${items.length}; existing gallery records: ${snapshot.size}`);
  console.log(`Already imported: ${items.length - pending.length}; pending: ${pending.length}`);
  for (const item of pending) console.log(`${item.id} | ${item.date} | ${item.caption}`);
  if (!apply) {
    console.log("Dry run only. Add --apply to upload and create gallery records.");
    return;
  }

  for (const [index, item] of pending.entries()) {
    const image = await prepareImage(item);
    const objectPath = `uploads/event-gallery/${importName}/${String(item.order).padStart(3, "0")}.${image.extension}`;
    const token = randomUUID();
    await bucket.file(objectPath).save(image.bytes, {
      resumable: false,
      metadata: {
        contentType: image.contentType,
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
    await db.collection(collectionName).doc(item.id).create({
      image: imageUrl,
      caption: item.caption,
      date: item.date,
      order: item.order,
    });
    console.log(`Imported ${index + 1}/${pending.length}: ${item.id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
