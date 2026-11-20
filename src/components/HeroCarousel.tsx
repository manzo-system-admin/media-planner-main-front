"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./HeroCarousel.module.css";
import type { Dictionary, HeroSlide } from "@/lib/dictionaries/types";

const AUTOPLAY_MS = 6000;

function HeroVideo({ src, poster, single, onEnded }: { src: string; poster: string; single: boolean; onEnded?: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      if (visible && !motion.matches) void video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: .15 });
    observer.observe(video);
    motion.addEventListener("change", update);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", update);
      video.pause();
    };
  }, []);

  return <video ref={ref} className={styles.slideMedia} src={src} poster={poster} loop={single} muted playsInline preload="metadata" onEnded={onEnded} />;
}

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
  const singleVideoSlide = slides.length === 1 && activeIsVideo;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (paused || activeIsVideo || slides.length < 2 || motion.matches) return;
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
                <HeroVideo src={slide.src} poster={slide.poster} single={singleVideoSlide} onEnded={singleVideoSlide ? undefined : () => goTo(active + 1)} />
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

      {/* <button
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
      </button> */}

      {slides.length > 1 && (
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
      )}
    </>
  );
}
