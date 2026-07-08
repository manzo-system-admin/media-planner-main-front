"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./HeroCarousel.module.css";
import type { Dictionary, HeroSlide } from "@/lib/dictionaries/types";

const AUTOPLAY_MS = 6000;

export default function HeroCarousel({
  slides,
  labels,
}: {
  slides: HeroSlide[];
  labels: Dictionary["home"]["carousel"];
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (index: number) => setActive((index + slides.length) % slides.length),
    [slides.length]
  );

  // Video slides advance on their own "ended" event instead of the timer,
  // so a long video is never cut off mid-play.
  const activeIsVideo = slides[active]?.type === "video";

  useEffect(() => {
    if (paused || activeIsVideo || slides.length < 2) return;
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, activeIsVideo, slides.length]);

  return (
    <>
      <div
        className={styles.backdrop}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-hidden="true"
      >
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`${styles.slide} ${index === active ? styles.slideActive : ""}`}
          >
            {slide.type === "video" ? (
              index === active ? (
                <video
                  className={styles.slideMedia}
                  src={slide.src}
                  poster={slide.poster}
                  autoPlay
                  muted
                  playsInline
                  onEnded={() => goTo(active + 1)}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.slideMedia} src={slide.poster} alt="" />
              )
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img className={styles.slideMedia} src={slide.src} alt={slide.alt} />
            )}
          </div>
        ))}
        <div className={styles.overlay} />
      </div>

      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowPrev}`}
        aria-label={labels.prevLabel}
        onClick={() => goTo(active - 1)}
      >
        ‹
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowNext}`}
        aria-label={labels.nextLabel}
        onClick={() => goTo(active + 1)}
      >
        ›
      </button>

      <div className={styles.dots}>
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            className={`${styles.dot} ${index === active ? styles.dotActive : ""}`}
            aria-label={`${labels.goToLabel} ${index + 1}`}
            aria-current={index === active}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </>
  );
}
