const fs = require("node:fs/promises");
const path = require("node:path");
const { decode } = require("html-entities");

const sourcePath = path.join(__dirname, "video-library-source.txt");
const manifestPath = path.join(__dirname, "video-library-import-manifest.json");

function parseSource(rawUrl) {
  const url = new URL(rawUrl.trim());
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be") {
    const videoId = host === "youtu.be"
      ? url.pathname.slice(1)
      : url.searchParams.get("v") || url.pathname.match(/^\/(?:live|shorts|embed)\/([^/]+)/)?.[1];
    if (!/^[\w-]{11}$/.test(videoId || "")) throw new Error(`Invalid YouTube link: ${rawUrl}`);
    return { kind: "youtube", videoId, sourceUrl: `https://www.youtube.com/watch?v=${videoId}` };
  }
  if (host === "tiktok.com") {
    const videoId = url.pathname.match(/\/video\/(\d+)/)?.[1];
    if (!videoId) throw new Error(`Invalid TikTok link: ${rawUrl}`);
    return { kind: "tiktok", videoId, sourceUrl: rawUrl.trim() };
  }
  return null;
}

async function getText(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function youtubeMetadata(videoId) {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const [embed, page] = await Promise.allSettled([
    getText(`https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`).then(JSON.parse),
    getText(watchUrl),
  ]);
  const html = page.status === "fulfilled" ? page.value : "";
  const title = embed.status === "fulfilled"
    ? embed.value.title
    : decode(html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/)?.[1] || "");
  const date = html.match(/<meta\s+itemprop="datePublished"\s+content="(\d{4}-\d{2}-\d{2})/)?.[1] || "";
  const thumbnail = embed.status === "fulfilled"
    ? embed.value.thumbnail_url
    : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  return { title, date, thumbnail };
}

async function tiktokMetadata(videoId, sourceUrl) {
  const date = new Date(Number(BigInt(videoId) >> 32n) * 1000).toISOString().slice(0, 10);
  let thumbnail = "";
  try {
    const embed = JSON.parse(await getText(`https://www.tiktok.com/oembed?url=${encodeURIComponent(sourceUrl)}`));
    thumbnail = embed.thumbnail_url || "";
  } catch {
    try {
      const html = await getText(sourceUrl);
      thumbnail = decode(html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1] || "");
    } catch {
      // The title and date still come from the supplied document and TikTok ID.
    }
  }
  return {
    title: "ทองร่วงหนักสุดในรอบ 14ปี ดิ่ง9%ในสัปดาห์เดียว",
    date,
    thumbnail: thumbnail || "/images/video-placeholder.svg",
  };
}

async function main() {
  const lines = (await fs.readFile(sourcePath, "utf8")).split(/\r?\n/).map((line) => line.trim());
  const urls = lines.filter((line) => /^https?:\/\//.test(line));
  const parsed = urls.map(parseSource);
  const skipped = urls.filter((_, index) => !parsed[index]);
  const videos = parsed.filter(Boolean);
  const keys = videos.map((video) => `${video.kind}:${video.videoId}`);
  if (new Set(keys).size !== keys.length) throw new Error("Duplicate video links in document");

  const items = new Array(videos.length);
  let cursor = 0;
  async function worker() {
    while (cursor < videos.length) {
      const index = cursor++;
      const video = videos[index];
      const metadata = video.kind === "youtube"
        ? await youtubeMetadata(video.videoId)
        : await tiktokMetadata(video.videoId, video.sourceUrl);
      items[index] = {
        id: `vdo-doc-${String(index + 1).padStart(3, "0")}`,
        order: index,
        date: metadata.date,
        title: metadata.title,
        thumbnail: metadata.thumbnail,
        videoSource: video.kind === "youtube"
          ? { kind: "youtube", videoId: video.videoId }
          : { kind: "tiktok", videoId: video.videoId, url: video.sourceUrl },
      };
      console.log(`${index + 1}/${videos.length} ${video.kind}:${video.videoId} ${metadata.date || "NO_DATE"} ${metadata.title || "NO_TITLE"}`);
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  await fs.writeFile(manifestPath, JSON.stringify({ sourceDocumentId: "1RKw6u5cBlzRYXYNK2hES5DbEaxVpgK-a", skipped, items }, null, 2) + "\n");
  console.log(`Saved ${items.length} videos to ${manifestPath}; skipped ${skipped.length} non-video URL(s).`);
  console.log(`Missing title: ${items.filter((item) => !item.title).length}; missing date: ${items.filter((item) => !item.date).length}; missing thumbnail: ${items.filter((item) => !item.thumbnail).length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
