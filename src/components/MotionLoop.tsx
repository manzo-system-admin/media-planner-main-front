"use client";

import { useEffect, useRef } from "react";

export default function MotionLoop({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      if (visible && !reducedMotion.matches) {
        void video.play().catch(() => {});
      } else {
        video.pause();
        if (reducedMotion.matches) video.currentTime = 0;
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: 0.15 });
    observer.observe(video);
    reducedMotion.addEventListener("change", update);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", update);
      video.pause();
    };
  }, []);

  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} />;
}
