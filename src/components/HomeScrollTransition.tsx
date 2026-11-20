"use client";

import { useEffect } from "react";

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export default function HomeScrollTransition() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-home-scroll-root]");
    const hero = root?.querySelector<HTMLElement>("[data-home-collapse]");
    const nextSection = root?.querySelector<HTMLElement>("[data-home-next-section]");
    const nextContent = root?.querySelector<HTMLElement>("[data-home-next]");
    const nextClients = root?.querySelector<HTMLElement>("[data-home-next-clients]");
    const thirdSection = root?.querySelector<HTMLElement>("[data-home-third-section]");
    const thirdContent = root?.querySelector<HTMLElement>("[data-home-third-content]");
    if (!hero || !nextSection || !nextContent) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const clearStyles = () => {
      hero.style.removeProperty("--home-hero-opacity");
      hero.style.removeProperty("--home-hero-y");
      nextContent.style.removeProperty("--home-next-opacity");
      nextContent.style.removeProperty("--home-next-y");
      nextClients?.style.removeProperty("--home-next-opacity");
      nextClients?.style.removeProperty("--home-next-y");
      nextContent?.removeAttribute("data-home-portfolio-visible");
      thirdContent?.classList.remove("service-items-visible");
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (reducedMotion.matches) {
          clearStyles();
          nextContent?.setAttribute("data-home-portfolio-visible", "");
          thirdContent?.classList.add("service-items-visible");
          return;
        }

        const viewportHeight = Math.max(window.innerHeight, 1);
        const travel = Math.max(360, viewportHeight * 0.68);
        // Drive the transitions from the page's scroll distance. Using only
        // viewport intersections made later sections visible on first load
        // whenever the hero was shorter than the viewport (common on mobile).
        const scrollDistance = window.scrollY;
        const collapse = clamp(scrollDistance / travel);
        const nextTop = nextSection.getBoundingClientRect().top;
        // Bring the portfolio intro fully into view early, while it is
        // approaching the viewport, then keep it readable as the user passes.
        const reveal = clamp((viewportHeight * 0.82 - nextTop) / (viewportHeight * 0.28));
        const thirdTop = thirdSection?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
        const revealThird = clamp((viewportHeight - thirdTop) / travel);
        const opacity = String(1 - collapse);
        const nextOpacity = String(reveal);
        const nextY = `${(1 - reveal) * 30}px`;

        hero.style.setProperty("--home-hero-opacity", opacity);
        hero.style.setProperty("--home-hero-y", `${-26 * collapse}px`);
        nextContent.style.setProperty("--home-next-opacity", nextOpacity);
        nextContent.style.setProperty("--home-next-y", nextY);
        nextClients?.style.setProperty("--home-next-opacity", nextOpacity);
        nextClients?.style.setProperty("--home-next-y", nextY);
        nextContent?.toggleAttribute("data-home-portfolio-visible", reveal > 0.08);
        thirdContent?.classList.toggle("service-items-visible", revealThird > 0.08);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("pageshow", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("pageshow", update);
      reducedMotion.removeEventListener("change", update);
      clearStyles();
    };
  }, []);

  return null;
}
