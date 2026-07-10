"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import DraggableVideoCard from "./DraggableVideoCard";
import VideoEmbed from "./VideoEmbed";
import styles from "./VideoPopupCard.module.css";
import type { VideoSource } from "@/lib/cms/types";

const DEFAULT_LANDSCAPE_RATIO = 16 / 9;
const TIKTOK_PORTRAIT_RATIO = 9 / 16;

export default function VideoPopupCard({
  thumbnail,
  caption,
  videoAlt,
  videoSource,
  orientation,
  className,
}: {
  thumbnail: string;
  caption: string;
  videoAlt: string;
  videoSource: VideoSource | null;
  orientation?: "landscape" | "portrait";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [uploadRatio, setUploadRatio] = useState<number | null>(null);
  const [thumbRatio, setThumbRatio] = useState<number | null>(null);

  const aspectRatio = orientation
    ? orientation === "portrait"
      ? TIKTOK_PORTRAIT_RATIO
      : DEFAULT_LANDSCAPE_RATIO
    : videoSource?.kind === "tiktok" || (videoSource?.kind === "facebook" && videoSource.isReel)
      ? TIKTOK_PORTRAIT_RATIO
      : videoSource?.kind === "upload" && uploadRatio
        ? uploadRatio
        : DEFAULT_LANDSCAPE_RATIO;

  return (
    <>
      <DraggableVideoCard className={className} onClick={() => videoSource && setOpen(true)}>
        <div
          className={styles.videoThumb}
          style={thumbRatio ? ({ "--thumb-ratio": thumbRatio } as CSSProperties) : undefined}
        >
          <Image
            src={thumbnail}
            alt={videoAlt}
            fill
            priority
            sizes="340px"
            style={{ objectFit: "cover" }}
            ref={(img) => {
              // Cached images can already be complete by the time this ref
              // attaches, in which case onLoad never fires — check directly.
              if (img?.complete && img.naturalWidth && img.naturalHeight) {
                setThumbRatio(img.naturalWidth / img.naturalHeight);
              }
            }}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth && img.naturalHeight) {
                setThumbRatio(img.naturalWidth / img.naturalHeight);
              }
            }}
          />
          <span className={styles.playIcon} />
        </div>
        <div className={styles.videoCaption}>
          <span className={styles.videoCaptionTitle}>{caption}</span>
        </div>
      </DraggableVideoCard>

      {open && videoSource && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div
            className={styles.modal}
            style={{ "--ratio": aspectRatio } as CSSProperties}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.closeButton} onClick={() => setOpen(false)}>
              ✕
            </button>
            <VideoEmbed source={videoSource} autoPlay title={caption} onAspectRatio={setUploadRatio} />
          </div>
        </div>
      )}
    </>
  );
}
