import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const sourcePath = resolve("public/landing-pages/kage.html");
const outputPath = resolve("public/landing-pages/media-planner.html");
const source = await readFile(sourcePath);
const hash = createHash("sha256").update(source).digest("hex");
if (hash !== "c8e06b90397ac246baf0ab6f32f5f6b570acc6fe03c7009f711b579fb72d9f49") {
  throw new Error(`Unexpected Kage source revision: ${hash}`);
}

const html = source.toString("utf8");
const wordAnchor = "const word = 'KAGE', gl = [];";
if (!html.includes(wordAnchor)) throw new Error("Kage 3D word anchor changed");

const adapted = html
  .replace(wordAnchor, "const word = 'MEDIA', gl = [];")
  .replace("<title>Kage — Where stillness reveals the unseen</title>", "<title>Media Planner — Kage experience</title>")
  .replace('<div class="word-fb" aria-hidden="true">KAGE</div>', '<div class="word-fb" aria-hidden="true">MEDIA</div>');

await writeFile(outputPath, adapted, "utf8");
console.log(`Generated ${outputPath} from verified Kage source`);
