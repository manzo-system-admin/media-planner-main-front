"use client";

import { useState } from "react";
import Image from "next/image";
import DraggableVideoCard from "./DraggableVideoCard";
import VideoEmbed from "./VideoEmbed";
import styles from "./VideoPopupCard.module.css";
import type { VideoSource } from "@/lib/cms/types";

export default function VideoPopupCard({
  thumbnail,
  caption,
  videoAlt,
  videoSource,
  className,
}: {
  thumbnail: string;
  caption: string;
  videoAlt: string;
  videoSource: VideoSource | null;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DraggableVideoCard className={className} onClick={() => videoSource && setOpen(true)}>
        <div className={styles.videoThumb}>
          <Image src={thumbnail} alt={videoAlt} fill sizes="340px" style={{ objectFit: "cover" }} />
          <span className={styles.playIcon} />
        </div>
        <div className={styles.videoCaption}>
          <span className={styles.videoCaptionTitle}>{caption}</span>
        </div>
      </DraggableVideoCard>

      {open && videoSource && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.closeButton} onClick={() => setOpen(false)}>
              ✕
            </button>
            <VideoEmbed source={videoSource} autoPlay title={caption} />
          </div>
        </div>
      )}
    </>
  );
}
