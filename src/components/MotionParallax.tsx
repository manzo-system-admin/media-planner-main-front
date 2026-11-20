"use client";

import { useEffect } from "react";

const QUERY = "(min-width: 901px) and (prefers-reduced-motion: no-preference)";

export default function MotionParallax() {
  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const getElements = () => Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      if (!media.matches) {
        getElements().forEach((element) => { element.style.translate = ""; });
        return;
      }
      frame = requestAnimationFrame(() => {
        getElements().forEach((element) => {
          const rect = element.getBoundingClientRect();
          const distance = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
          const offset = Math.max(-34, Math.min(34, distance * -32));
          element.style.translate = `0 ${offset.toFixed(1)}px`;
        });
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    media.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      media.removeEventListener("change", update);
      getElements().forEach((element) => { element.style.translate = ""; });
    };
  }, []);

  return null;
}
