"use client";

import { useState } from "react";
import { parseVideoUrl, VIDEO_URL_HELP } from "@/lib/video/parseVideoUrl";
import type { VideoSource } from "@/lib/cms/types";
import VideoEmbed from "@/components/VideoEmbed";
import MediaUploader from "./MediaUploader";
import styles from "./VideoLinkInput.module.css";

export default function VideoLinkInput({
  value,
  onChange,
  folder,
}: {
  value: VideoSource | null;
  onChange: (source: VideoSource | null) => void;
  folder: string;
}) {
  const [mode, setMode] = useState<"link" | "upload">(value?.kind === "upload" ? "upload" : "link");
  const [rawUrl, setRawUrl] = useState(() => {
    if (!value) return "";
    if (value.kind === "youtube") return `https://www.youtube.com/watch?v=${value.videoId}`;
    if (value.kind === "facebook" || value.kind === "tiktok") return value.url;
    return "";
  });
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${mode === "link" ? styles.tabActive : ""}`}
          onClick={() => setMode("link")}
        >
          วางลิงก์
        </button>
        <button
          type="button"
          className={`${styles.tab} ${mode === "upload" ? styles.tabActive : ""}`}
          onClick={() => setMode("upload")}
        >
          อัปโหลดไฟล์
        </button>
      </div>

      {mode === "link" ? (
        <>
          <input
            type="url"
            className={styles.input}
            placeholder="https://www.youtube.com/watch?v=..."
            value={rawUrl}
            onChange={(e) => {
              const next = e.target.value;
              setRawUrl(next);
              setError(null);
              if (!next.trim()) {
                onChange(null);
                return;
              }
              const parsed = parseVideoUrl(next);
              if (!parsed) {
                setError("ไม่รู้จักลิงก์นี้");
                onChange(null);
                return;
              }
              onChange(parsed);
            }}
          />
          <span className={styles.hint}>{VIDEO_URL_HELP}</span>
          {error && <span className={styles.error}>{error}</span>}
        </>
      ) : (
        <MediaUploader
          value={value?.kind === "upload" ? value.url : ""}
          onChange={(url) => onChange(url ? { kind: "upload", url } : null)}
          folder={folder}
          accept="video/*"
          label="อัปโหลดไฟล์วิดีโอ"
        />
      )}

      {value && (
        <div className={styles.preview}>
          <VideoEmbed source={value} />
        </div>
      )}
    </div>
  );
}
