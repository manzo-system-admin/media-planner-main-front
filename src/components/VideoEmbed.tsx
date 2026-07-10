import type { VideoSource } from "@/lib/cms/types";
import styles from "./VideoEmbed.module.css";

export default function VideoEmbed({
  source,
  autoPlay = false,
  title = "video",
  onAspectRatio,
}: {
  source: VideoSource;
  autoPlay?: boolean;
  title?: string;
  onAspectRatio?: (ratio: number) => void;
}) {
  if (source.kind === "upload") {
    return (
      <div className={styles.frame}>
        <video
          className={styles.video}
          src={source.url}
          controls
          autoPlay={autoPlay}
          muted={autoPlay}
          playsInline
          onLoadedMetadata={(e) => {
            const video = e.currentTarget;
            if (video.videoWidth && video.videoHeight) {
              onAspectRatio?.(video.videoWidth / video.videoHeight);
            }
          }}
        />
      </div>
    );
  }

  if (source.kind === "youtube") {
    const params = new URLSearchParams({
      autoplay: autoPlay ? "1" : "0",
      mute: autoPlay ? "1" : "0",
      rel: "0",
    });
    return (
      <div className={styles.frame}>
        <iframe
          className={styles.iframe}
          src={`https://www.youtube.com/embed/${source.videoId}?${params.toString()}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (source.kind === "facebook") {
    const href = encodeURIComponent(source.url);
    // Reels aren't reliably handled by the classic Video Plugin (built for
    // /videos/ and watch/?v= links); the Post Plugin embeds them correctly.
    const embedSrc = source.isReel
      ? `https://www.facebook.com/plugins/post.php?href=${href}&show_text=false`
      : `https://www.facebook.com/plugins/video.php?href=${href}&show_text=0&autoplay=${autoPlay ? "1" : "0"}`;
    return (
      <div className={styles.frame}>
        <iframe
          className={styles.iframe}
          src={embedSrc}
          title={title}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
        <a
          className={styles.fallbackLink}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          เปิดดูใน Facebook ↗
        </a>
      </div>
    );
  }

  // tiktok
  return (
    <div className={styles.frame}>
      <iframe
        className={styles.iframe}
        src={`https://www.tiktok.com/embed/v2/${source.videoId}`}
        title={title}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
