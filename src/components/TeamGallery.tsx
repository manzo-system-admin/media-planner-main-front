"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "./TeamGallery.module.css";
import type { TeamGalleryPhoto } from "@/lib/dictionaries/types";

// Rotating aspect ratios give the grid a masonry rhythm regardless of the
// source images' actual dimensions (uploads aren't guaranteed to share a
// ratio, and we don't store intrinsic width/height per photo).
const RATIOS = ["4 / 5", "1 / 1", "3 / 4", "1 / 1", "4 / 5", "5 / 4"];
const SHOWCASE_RATIOS = ["16 / 10", "4 / 3", "3 / 2", "5 / 4", "1 / 1", "16 / 10"];

function ratioHeightUnit(ratio: string): number {
  const [w, h] = ratio.split("/").map((n) => parseFloat(n.trim()));
  return h / w;
}

function useColumnCount(maxColumns = 4): number {
  const [count, setCount] = useState(maxColumns);
  useEffect(() => {
    const queries = [window.matchMedia("(max-width: 640px)"), window.matchMedia("(max-width: 960px)")];
    const update = () => setCount(queries[0].matches ? 2 : Math.min(maxColumns, queries[1].matches ? 3 : 4));
    update();
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, [maxColumns]);
  return count;
}

export default function TeamGallery({
  photos,
  altFallback,
  variant = "masonry",
  revealOnScroll = false,
}: {
  photos: TeamGalleryPhoto[];
  altFallback: string;
  variant?: "masonry" | "showcase";
  revealOnScroll?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const pointerStart = useRef<{ x: number; y: number; id: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const columnCount = useColumnCount(variant === "showcase" ? 3 : 4);

  useEffect(() => {
    const grid = gridRef.current;
    if (!revealOnScroll || !grid || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    grid.dataset.scrollRevealReady = "true";
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle(styles.revealed, entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    grid.querySelectorAll<HTMLElement>("[data-gallery-reveal]").forEach((tile) => observer.observe(tile));
    return () => {
      observer.disconnect();
      delete grid.dataset.scrollRevealReady;
    };
  }, [columnCount, photos.length, revealOnScroll]);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );
  const showNext = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, close, showPrev, showNext]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (photos.length < 2) return;
      pointerStart.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [photos.length]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const start = pointerStart.current;
      if (!start || start.id !== e.pointerId) return;
      pointerStart.current = null;

      const deltaX = e.clientX - start.x;
      const deltaY = e.clientY - start.y;
      const horizontalSwipe = Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25;

      if (!horizontalSwipe) return;
      if (deltaX > 0) showPrev();
      else showNext();
    },
    [showPrev, showNext]
  );

  const handlePointerCancel = useCallback(() => {
    pointerStart.current = null;
  }, []);

  const handleLightboxClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const image = e.currentTarget.querySelector("img");
      if (!image || image.naturalWidth === 0 || image.naturalHeight === 0) {
        close();
        return;
      }

      const rect = image.getBoundingClientRect();
      const imageRatio = image.naturalWidth / image.naturalHeight;
      const boxRatio = rect.width / rect.height;
      const renderedWidth = imageRatio > boxRatio ? rect.width : rect.height * imageRatio;
      const renderedHeight = imageRatio > boxRatio ? rect.width / imageRatio : rect.height;
      const renderedLeft = rect.left + (rect.width - renderedWidth) / 2;
      const renderedTop = rect.top + (rect.height - renderedHeight) / 2;
      const insideRenderedImage =
        e.clientX >= renderedLeft &&
        e.clientX <= renderedLeft + renderedWidth &&
        e.clientY >= renderedTop &&
        e.clientY <= renderedTop + renderedHeight;

      if (insideRenderedImage) {
        e.stopPropagation();
        return;
      }
      close();
    },
    [close]
  );

  // Distribute photos into columns greedily by running height, so every
  // column bottoms out at roughly the same point instead of the ragged edge
  // that plain CSS multi-column masonry produces.
  const columns = useMemo(() => {
    const cols: { photo: TeamGalleryPhoto; index: number; ratio: string }[][] = Array.from(
      { length: columnCount },
      () => []
    );
    const heights = new Array(columnCount).fill(0);
    const ratios = variant === "showcase" ? SHOWCASE_RATIOS : RATIOS;
    photos.forEach((photo, index) => {
      const ratio = ratios[index % ratios.length];
      const shortest = heights.indexOf(Math.min(...heights));
      cols[shortest].push({ photo, index, ratio });
      heights[shortest] += ratioHeightUnit(ratio);
    });
    return cols;
  }, [photos, columnCount, variant]);

  if (photos.length === 0) return null;

  const active = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <div ref={gridRef} className={`${styles.grid} ${variant === "showcase" ? styles.showcaseGrid : ""}`}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.column}>
            {column.map(({ photo, index, ratio }) => (
              <button
                key={photo.id}
                type="button"
                className={styles.tile}
                data-gallery-reveal={revealOnScroll ? "" : undefined}
                style={{ "--ratio": ratio, "--stagger": `${(index % 8) * 50}ms` } as React.CSSProperties}
                onClick={() => setOpenIndex(index)}
              >
                <Image
                  src={photo.image}
                  alt={photo.caption || altFallback}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
                {variant === "showcase" && (
                  <Image
                    src={photo.image}
                    alt=""
                    aria-hidden="true"
                    width={1}
                    height={1}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className={styles.reflection}
                    style={{ objectFit: "cover" }}
                  />
                )}
                <span className={styles.veil} />
                {photo.caption && <span className={styles.caption}>{photo.caption}</span>}
                <span className={styles.expandIcon} aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {active && (
        <div className={styles.overlay} onClick={close}>
          <button type="button" className={styles.closeButton} aria-label="ปิด" onClick={close}>
            ✕
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.navButton} ${styles.navPrev}`}
                aria-label="ก่อนหน้า"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
              >
                ‹
              </button>
              <button
                type="button"
                className={`${styles.navButton} ${styles.navNext}`}
                aria-label="ถัดไป"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
              >
                ›
              </button>
            </>
          )}

          <div
            className={styles.lightboxImage}
            onClick={handleLightboxClick}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            {photos.length > 1 && (
              <div className={styles.swipeHint} aria-hidden="true">
                <span className={`${styles.swipeTrack} ${styles.swipeTrackLeft}`} />
                <span className={styles.swipeText}>ปัดเพื่อดูรูปถัดไป</span>
                <span className={`${styles.swipeTrack} ${styles.swipeTrackRight}`} />
              </div>
            )}
            <Image
              src={active.image}
              alt={active.caption || altFallback}
              fill
              sizes="90vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {active.caption && (
            <p className={styles.lightboxCaption} onClick={(e) => e.stopPropagation()}>
              {active.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
