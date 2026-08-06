"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./PortfolioGallery.module.css";

export default function PortfolioGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.hero}>
        <Image src={images[active]} alt={alt} fill sizes="100vw" style={{ objectFit: "cover" }} priority />
      </div>

      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              className={`${styles.thumb} ${index === active ? styles.thumbActive : ""}`}
              onClick={() => setActive(index)}
              aria-label={`${alt} ${index + 1}`}
            >
              <Image src={src} alt="" fill sizes="100px" style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
