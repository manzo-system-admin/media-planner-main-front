import type { VideoSource } from "@/lib/cms/types";
import styles from "./VideoEmbed.module.css";

export default function VideoEmbed({
  source,
  autoPlay = false,
  title = "video",
}: {
  source: VideoSource;
  autoPlay?: boolean;
  title?: string;
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
    return (
      <div className={styles.frame}>
        <iframe
          className={styles.iframe}
          src={`https://www.facebook.com/plugins/video.php?href=${href}&show_text=0&autoplay=${autoPlay ? "1" : "0"}`}
          title={title}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
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
