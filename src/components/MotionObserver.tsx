"use client";

import { useEffect } from "react";

export default function MotionObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | null = null;
    const observeReveals = (scope: ParentNode = document) => {
      if (!observer) return;
      if (scope instanceof Element && scope.matches("[data-reveal]")) observer.observe(scope);
      scope.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => observer?.observe(element));
    };
    const enable = () => {
      if (reducedMotion.matches || !("IntersectionObserver" in window)) {
        root.removeAttribute("data-motion-ready");
        observer?.disconnect();
        observer = null;
        document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
        return;
      }
      if (observer) return;
      observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.hasAttribute("data-reveal-repeat")) {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
          return;
        }
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        }
      });
      }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
      observeReveals();
      root.setAttribute("data-motion-ready", "true");
    };
    enable();
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof Element) observeReveals(node);
      }));
    });
    mutations.observe(document.querySelector("main") ?? document.body, { childList: true, subtree: true });
    reducedMotion.addEventListener("change", enable);
    return () => {
      mutations.disconnect();
      reducedMotion.removeEventListener("change", enable);
      observer?.disconnect();
      root.removeAttribute("data-motion-ready");
    };
  }, []);
  return null;
}
