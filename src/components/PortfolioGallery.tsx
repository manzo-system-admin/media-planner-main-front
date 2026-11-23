"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./PortfolioGallery.module.css";

export default function PortfolioGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startScrollLeft: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);

  // Track mouse movement on the document so dragging keeps working if the
  // pointer leaves the thumbnail strip while the button is held.
  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      const drag = dragRef.current;
      const thumbs = thumbsRef.current;
      if (!drag || !thumbs) return;

      const distance = event.clientX - drag.startX;
      // Ignore the small hand movement that naturally happens during a click.
      if (Math.abs(distance) > 8) {
        drag.moved = true;
        thumbs.scrollLeft = drag.startScrollLeft - distance;
      }
    };

    const handleMouseUp = () => {
      const drag = dragRef.current;
      if (!drag) return;
      suppressClickRef.current = drag.moved;
      dragRef.current = null;
      setDragging(false);
      if (drag.moved) {
        window.setTimeout(() => { suppressClickRef.current = false; }, 250);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  if (images.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.hero}>
        <Image src={images[active]} alt={alt} fill sizes="100vw" style={{ objectFit: "cover" }} priority />
      </div>

      {images.length > 1 && (
        <div
          ref={thumbsRef}
          className={`${styles.thumbs} ${dragging ? styles.thumbsDragging : ""}`}
          role="group"
          aria-label="รูปภาพเพิ่มเติม"
          onMouseDown={(event) => {
            if (event.button !== 0) return;
            dragRef.current = {
              startX: event.clientX,
              startScrollLeft: event.currentTarget.scrollLeft,
              moved: false,
            };
            setDragging(true);
          }}
          onDragStart={(event) => event.preventDefault()}
          onClickCapture={(event) => {
            if (!suppressClickRef.current) return;
            event.preventDefault();
            event.stopPropagation();
            suppressClickRef.current = false;
          }}
          onWheel={(event) => {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
              event.currentTarget.scrollLeft += event.deltaY;
            }
          }}
        >
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              className={`${styles.thumb} ${index === active ? styles.thumbActive : ""}`}
              aria-current={index === active ? "true" : undefined}
              draggable={false}
              onClick={() => {
                if (!suppressClickRef.current) setActive(index);
              }}
              aria-label={`${alt} ${index + 1}`}
            >
              <Image src={src} alt="" fill sizes="140px" draggable={false} style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
