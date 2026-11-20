// Regenerate the short, silent motion loops used on the public homepage.
// Run: node scripts/generate-brand-motion.mjs
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
import sharp from "sharp";

const width = 960;
const height = 540;
const fps = 24;
const frames = 120;
const videoDir = path.resolve("public/videos");
const imageDir = path.resolve("public/images");
fs.mkdirSync(videoDir, { recursive: true });
fs.mkdirSync(imageDir, { recursive: true });

const colors = { cream: "#f3f0e8", ink: "#172726", orange: "#df7952", peach: "#efb596", sage: "#a9b6a6" };
const smooth = (n) => (Math.sin(n) + 1) / 2;
const line = (points, color, width = 2, opacity = 1) =>
  `<path d="${points}" fill="none" stroke="${color}" stroke-width="${width}" opacity="${opacity}" stroke-linecap="round"/>`;
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
const text = (x, y, value, size, fill, extra = "") =>
  `<text x="${x}" y="${y}" fill="${fill}" font-family="Arial, sans-serif" font-size="${size}" font-weight="700" letter-spacing="-5" ${extra}>${value}</text>`;
const serif = (x, y, value, size, fill, extra = "") =>
  `<text x="${x}" y="${y}" fill="${fill}" font-family="Georgia, serif" font-style="italic" font-size="${size}" ${extra}>${value}</text>`;

function signal(t) {
  const a = t * Math.PI * 2;
  let waves = "";
  for (let j = 0; j < 9; j++) {
    let d = "";
    for (let x = -10; x <= width + 10; x += 12) {
      const y = 282 + j * 16 + Math.sin(x / 72 + a + j * .38) * (31 + j * 2);
      d += `${x === -10 ? "M" : "L"}${x} ${y.toFixed(1)} `;
    }
    waves += line(d, j % 3 === 0 ? colors.orange : colors.ink, j % 3 === 0 ? 2.4 : 1.1, .15 + j * .025);
  }
  const circleX = 780 + Math.cos(a) * 85;
  const circleY = 142 + Math.sin(a) * 58;
  return svg(`
    <rect width="960" height="540" fill="${colors.cream}"/>
    <circle cx="${circleX}" cy="${circleY}" r="115" fill="${colors.peach}" opacity=".7"/>
    <circle cx="770" cy="148" r="164" fill="none" stroke="${colors.ink}" stroke-width="1" opacity=".28"/>
    <circle cx="770" cy="148" r="104" fill="none" stroke="${colors.ink}" stroke-width="1" opacity=".28"/>
    ${waves}
    <rect x="50" y="44" width="7" height="7" rx="4" fill="${colors.orange}"/>
    <text x="70" y="53" fill="${colors.ink}" font-family="Arial" font-size="15" letter-spacing="4">MEDIA PLANNER / BANGKOK</text>
    ${text(48, 225 + Math.sin(a) * 5, "IDEAS", 144, colors.ink)}
    ${serif(52, 434 - Math.sin(a) * 4, "move.", 149, colors.orange)}
    <line x1="52" y1="482" x2="908" y2="482" stroke="${colors.ink}" stroke-width="1" opacity=".5"/>
    <text x="52" y="510" fill="${colors.ink}" font-family="Arial" font-size="16" letter-spacing="3">STRATEGY  /  CREATIVITY  /  CONNECTION</text>
    <text x="847" y="510" fill="${colors.ink}" font-family="Arial" font-size="16" letter-spacing="2">01 / 03</text>
  `);
}

function story(t) {
  const a = t * Math.PI * 2;
  const orbitX = 721 + Math.cos(a) * 145;
  const orbitY = 260 + Math.sin(a) * 145;
  let spokes = "";
  for (let j = 0; j < 14; j++) {
    const angle = a * .5 + j * Math.PI * 2 / 14;
    const x1 = 721 + Math.cos(angle) * 185;
    const y1 = 260 + Math.sin(angle) * 185;
    const x2 = 721 + Math.cos(angle) * 236;
    const y2 = 260 + Math.sin(angle) * 236;
    spokes += line(`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`, colors.cream, 1, .28);
  }
  return svg(`
    <rect width="960" height="540" fill="${colors.ink}"/>
    <circle cx="721" cy="260" r="236" fill="none" stroke="${colors.cream}" stroke-width="1" opacity=".25"/>
    <circle cx="721" cy="260" r="145" fill="none" stroke="${colors.orange}" stroke-width="2" opacity=".7"/>
    <circle cx="721" cy="260" r="86" fill="none" stroke="${colors.cream}" stroke-width="1" opacity=".4"/>
    ${spokes}
    <circle cx="${orbitX}" cy="${orbitY}" r="24" fill="${colors.orange}"/>
    <circle cx="721" cy="260" r="${32 + smooth(a) * 22}" fill="${colors.peach}" opacity=".6"/>
    <text x="52" y="55" fill="${colors.peach}" font-family="Arial" font-size="15" letter-spacing="4">MEDIA PLANNER / BANGKOK</text>
    ${text(47, 224 + Math.sin(a) * 4, "STORIES", 113, colors.cream)}
    ${serif(55, 356, "connect.", 121, colors.peach)}
    <line x1="52" y1="482" x2="908" y2="482" stroke="${colors.cream}" stroke-width="1" opacity=".5"/>
    <text x="52" y="510" fill="${colors.cream}" font-family="Arial" font-size="16" letter-spacing="3">PEOPLE  /  BRANDS  /  WHAT MATTERS</text>
    <text x="847" y="510" fill="${colors.cream}" font-family="Arial" font-size="16" letter-spacing="2">02 / 03</text>
  `);
}

function matter(t) {
  const a = t * Math.PI * 2;
  let bars = "";
  const labels = ["PR", "IR", "CONTENT", "MEDIA"];
  for (let j = 0; j < 4; j++) {
    const y = 97 + j * 93;
    const w = 205 + smooth(a + j * .9) * 132;
    bars += `<rect x="579" y="${y}" width="${w}" height="64" rx="32" fill="${j % 2 ? colors.sage : colors.orange}" opacity="${.78 + smooth(a + j) * .16}"/>`;
    bars += `<text x="604" y="${y + 44}" fill="${colors.ink}" font-family="Arial" font-size="32" font-weight="700" letter-spacing="2">${labels[j]}</text>`;
  }
  return svg(`
    <rect width="960" height="540" fill="#e8dfd2"/>
    <path d="M0 540 C240 ${460 + Math.sin(a) * 42} 425 ${610 + Math.sin(a + 1) * 46} 960 400 L960 540Z" fill="${colors.peach}" opacity=".62"/>
    <circle cx="${485 + Math.cos(a) * 30}" cy="${273 + Math.sin(a) * 40}" r="200" fill="none" stroke="${colors.ink}" stroke-width="1" opacity=".25"/>
    ${bars}
    <text x="52" y="55" fill="${colors.ink}" font-family="Arial" font-size="15" letter-spacing="4">MEDIA PLANNER / BANGKOK</text>
    ${text(47, 222, "MAKE IT", 98, colors.ink)}
    ${serif(50, 365 + Math.sin(a) * 5, "matter.", 113, colors.orange)}
    <line x1="52" y1="482" x2="908" y2="482" stroke="${colors.ink}" stroke-width="1" opacity=".5"/>
    <text x="52" y="510" fill="${colors.ink}" font-family="Arial" font-size="16" letter-spacing="3">IDEAS BUILT TO MOVE PEOPLE</text>
    <text x="847" y="510" fill="${colors.ink}" font-family="Arial" font-size="16" letter-spacing="2">03 / 03</text>
  `);
}

async function render(name, scene) {
  const poster = await sharp(Buffer.from(scene(0))).webp({ quality: 88 }).toBuffer();
  fs.writeFileSync(path.join(imageDir, `motion-${name}.webp`), poster);
  const output = path.join(videoDir, `motion-${name}.mp4`);
  const ffmpeg = spawn("ffmpeg", [
    "-y", "-hide_banner", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(fps), "-vcodec", "png", "-i", "pipe:0",
    "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", output,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const exited = once(ffmpeg, "exit");
  for (let frame = 0; frame < frames; frame++) {
    const png = await sharp(Buffer.from(scene(frame / frames))).png().toBuffer();
    if (!ffmpeg.stdin.write(png)) await once(ffmpeg.stdin, "drain");
  }
  ffmpeg.stdin.end();
  const [code] = await exited;
  if (code !== 0) throw new Error(`ffmpeg failed for ${name}: ${code}`);
  console.log(output);
}

for (const [name, scene] of [["signal", signal], ["story", story], ["matter", matter]]) {
  await render(name, scene);
}
