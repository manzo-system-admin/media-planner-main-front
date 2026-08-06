"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import styles from "./NewsHeroImage.module.css";

export default function NewsHeroImage({ src, alt }: { src: string; alt: string }) {
  const [ratio, setRatio] = useState<number | null>(null);

  return (
    <div className={styles.wrap} style={ratio ? ({ "--ratio": ratio } as CSSProperties) : undefined}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        priority
        style={{ objectFit: "cover" }}
        ref={(img) => {
          // Cached images can already be complete by the time this ref
          // attaches, in which case onLoad never fires — check directly.
          if (img?.complete && img.naturalWidth && img.naturalHeight) {
            setRatio(img.naturalWidth / img.naturalHeight);
          }
        }}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            setRatio(img.naturalWidth / img.naturalHeight);
          }
        }}
      />
    </div>
  );
}
