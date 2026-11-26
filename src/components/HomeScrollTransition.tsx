"use client";

import { useEffect } from "react";

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export default function HomeScrollTransition() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-home-scroll-root]");
    const sections = Array.from(root?.querySelectorAll<HTMLElement>("[data-home-snap-section]") ?? []);
    if (sections.length < 2) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const header = document.querySelector<HTMLElement>("header");
    let locked = false;
    let unlockTimer = 0;
    let touchStart: { x: number; y: number } | null = null;
    let touchDirection: -1 | 1 | null = null;

    const snapTop = (section: HTMLElement) => {
      const headerOffset = header?.getBoundingClientRect().height ?? 0;
      return Math.max(0, section.getBoundingClientRect().top + window.scrollY - headerOffset);
    };

    const currentSectionIndex = () => {
      const visibleTop = window.scrollY + (header?.getBoundingClientRect().height ?? 0) + 1;
      const sectionUnderViewportTop = sections.findIndex((section) => {
        const top = section.getBoundingClientRect().top + window.scrollY;
        return visibleTop >= top && visibleTop < top + section.offsetHeight;
      });
      if (sectionUnderViewportTop >= 0) return sectionUnderViewportTop;

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      sections.forEach((section, index) => {
        const distance = Math.abs(window.scrollY - snapTop(section));
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      return closestIndex;
    };

    const canAdvance = (direction: -1 | 1, index: number) => {
      if (index < 0 || index >= sections.length) return false;
      const section = sections[index];
      const headerOffset = header?.getBoundingClientRect().height ?? 0;
      const availableHeight = Math.max(1, window.innerHeight - headerOffset);
      const sectionStart = snapTop(section);

      // Keep the section-by-section lock for viewport-sized sections. If a
      // responsive layout makes a section taller than the visible area, let
      // the browser scroll through its content before snapping onward.
      if (section.offsetHeight > availableHeight + 24) {
        const lastScrollPosition = sectionStart + section.offsetHeight - availableHeight;
        if (direction > 0 && window.scrollY < lastScrollPosition - 24) return false;
        if (direction < 0 && window.scrollY > sectionStart + 24) return false;
      }

      // Let the final, tall gallery scroll naturally once its top has passed.
      if (index === sections.length - 1 && direction > 0) return false;
      if (index === sections.length - 1 && direction < 0 && window.scrollY > sectionStart + 96) return false;
      return true;
    };

    const advance = (direction: -1 | 1) => {
      if (locked) return;
      const index = currentSectionIndex();
      const next = index + direction;
      if (next < 0 || next >= sections.length) return;

      locked = true;
      sections[next].scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        locked = false;
      }, reducedMotion.matches ? 220 : 900);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX) * 1.2 || Math.abs(event.deltaY) < 18) return;
      const direction: -1 | 1 = event.deltaY > 0 ? 1 : -1;
      const index = currentSectionIndex();
      if (!canAdvance(direction, index)) return;
      event.preventDefault();
      if (!locked) advance(direction);
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStart = { x: touch.clientX, y: touch.clientY };
      touchDirection = null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!touchStart) return;
      const touch = event.touches[0];
      if (!touch) return;
      const deltaY = touch.clientY - touchStart.y;
      const deltaX = touch.clientX - touchStart.x;
      if (Math.abs(deltaY) < 12 || Math.abs(deltaY) < Math.abs(deltaX) * 1.2) return;

      const direction: -1 | 1 = deltaY < 0 ? 1 : -1;
      if (!canAdvance(direction, currentSectionIndex())) return;
      touchDirection = direction;
      if (event.cancelable) event.preventDefault();
    };

    const onTouchEnd = () => {
      if (touchDirection !== null) advance(touchDirection);
      touchStart = null;
      touchDirection = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      window.clearTimeout(unlockTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

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
