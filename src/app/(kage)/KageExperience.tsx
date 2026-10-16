"use client";

import { useEffect, useRef } from "react";
import { KageLandingPage } from "@designcodeio/threeui/components/KageLandingPage";
import "@designcodeio/threeui/style.css";

type Entry = { title: string; href: string; summary?: string; client?: string };

export type MediaPlannerContent = {
  locale: "th";
  heroTitle: string;
  heroSubtitle: string;
  about: string;
  mission: string;
  services: Entry[];
  projects: Entry[];
};

function setText(doc: Document, selector: string, text: string) {
  const node = doc.querySelector(selector);
  if (node) {
    node.textContent = text;
    if (node.hasAttribute("aria-label")) node.setAttribute("aria-label", text);
  }
}

function setSiteLink(doc: Document, selector: string, href: string) {
  const link = doc.querySelector<HTMLAnchorElement>(selector);
  if (link) {
    link.href = href;
    link.dataset.siteLink = "true";
  }
}

function excerpt(text: string, maxLength: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= maxLength ? clean : `${clean.slice(0, maxLength).trimEnd()}…`;
}

function applyMediaPlannerContent(frame: HTMLIFrameElement, content: MediaPlannerContent) {
  const doc = frame.contentDocument;
  if (!doc) return;

  doc.title = "Media Planner — Kage experience";
  doc.documentElement.lang = "th";
  setText(doc, ".brand-tx b", "MEDIA PLANNER");
  setText(doc, ".brand-tx i", "CREATIVE COMMUNICATIONS · BANGKOK");
  setText(doc, ".word-fb", "MEDIA PLANNER");
  setText(doc, ".pre .jp", "MEDIA PLANNER");
  setText(doc, ".hero .eyebrow", "MEDIA PLANNER — CREATIVE COMMUNICATIONS");
  const heroLines = doc.querySelectorAll(".h-hero .mask-line");
  ["Ideas move.", "Stories", "connect."].forEach((line, index) => {
    const maskLine = heroLines[index];
    if (!maskLine) return;
    maskLine.setAttribute("aria-label", line);
    maskLine.replaceChildren();
    const mask = doc.createElement("span");
    mask.className = "word-mask";
    mask.setAttribute("aria-hidden", "true");
    const word = doc.createElement("span");
    word.className = "word";
    word.textContent = line;
    mask.append(word);
    maskLine.append(mask);
  });
  setText(doc, ".hero-sub", excerpt(content.heroTitle, 100));
  setText(doc, ".hero-cue > span:first-child", "เลื่อนเพื่อสำรวจ");

  const chips = [
    ["เกี่ยวกับเรา", "ประสบการณ์งานสื่อและการสื่อสารองค์กร"],
    ["ผลงาน", "เรื่องราวที่สร้างร่วมกับลูกค้า"],
    ["บริการ", "งานประชาสัมพันธ์และนักลงทุนสัมพันธ์"],
    ["ติดต่อ", "เริ่มต้นวางแผนงานไปด้วยกัน"],
  ];
  doc.querySelectorAll(".chip").forEach((chip, index) => {
    if (!chips[index]) return;
    const title = chip.querySelector(".tx b");
    const summary = chip.querySelector(".tx p");
    if (title) title.textContent = chips[index][0];
    if (summary) summary.textContent = chips[index][1];
  });
  setText(doc, ".peek-cap b", "MP");
  setText(doc, ".peek-cap i", "สำรวจผลงานของเรา");
  doc.querySelector(".peek")?.setAttribute("aria-label", "สำรวจผลงานของเรา");

  const navigation = [
    ["บริการ", "SERVICES"], ["ผลงาน", "WORK"],
    ["เกี่ยวกับเรา", "ABOUT"], ["ติดต่อ", "CONTACT"],
  ];
  doc.querySelectorAll(".nav-link").forEach((link, index) => {
    const label = navigation[index];
    if (!label) return;
    const spans = link.querySelectorAll("span");
    if (spans[0]) spans[0].textContent = label[0];
    if (spans[1]) spans[1].textContent = label[1];
  });
  ["#lessons", "#pathways", "#gate", "#eternity"].forEach((href, index) => {
    doc.querySelectorAll(".nav-link")[index]?.setAttribute("href", href);
  });

  setText(doc, "#gate .sec-head .k:first-child", "01 — ABOUT US");
  setText(doc, "#gate .h-sec", "ทุกเรื่องราวที่ดี เริ่มจากความเข้าใจ");
  setText(doc, "#gate .lead", excerpt(content.about, 310));
  setText(doc, "#gate .gate-copy .body", excerpt(content.mission, 260));
  setText(doc, "#gate .arrowlink > span:first-child", "รู้จักเราเพิ่มเติม");
  setSiteLink(doc, "#gate .arrowlink", `/${content.locale}/about`);
  const stats = [
    ["2010", "ก่อตั้ง"], ["20+", "ปีประสบการณ์"],
    [String(content.services.length).padStart(2, "0"), "บริการ"], ["∞", "ไอเดีย"],
  ];
  doc.querySelectorAll(".gate-stats > div").forEach((stat, index) => {
    if (!stats[index]) return;
    const number = stat.querySelector("b");
    const label = stat.querySelector("span");
    if (number) number.textContent = stats[index][0];
    if (label) label.textContent = stats[index][1];
  });

  setText(doc, "#pathways .sec-head .k:first-child", "02 — SELECTED WORK");
  doc.querySelectorAll("#pathways .card").forEach((card, index) => {
    const project = content.projects[index];
    if (!project) return;
    const title = card.querySelector(".card-lab b");
    const client = card.querySelector(".card-meta span:first-child");
    if (title) title.textContent = project.title;
    if (client) client.textContent = project.client || "MEDIA PLANNER";
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `ดูผลงาน ${project.title}`);
    (card as HTMLElement).dataset.siteHref = project.href;
  });

  setText(doc, "#lessons .sec-head .k:first-child", "03 — WHAT WE DO");
  setText(doc, "#lessons .h-sec", "Ideas move. Stories connect.");
  setText(doc, "#lessons .cur-head .body-lg", content.heroSubtitle);
  doc.querySelectorAll("#lessons .les").forEach((row, index) => {
    const service = content.services[index];
    if (!service) return;
    const heading = row.querySelector("h3");
    if (heading) heading.textContent = service.title;
    const summary = row.querySelector("p");
    if (summary) summary.textContent = service.summary || "";
    const time = row.querySelector(".t");
    if (time) time.textContent = "ดูบริการ";
    row.setAttribute("role", "link");
    row.setAttribute("tabindex", "0");
    row.setAttribute("aria-label", `ดูบริการ ${service.title}`);
    (row as HTMLElement).dataset.siteHref = service.href;
  });

  setText(doc, "#eternity .eyebrow", "04 — LET'S CONNECT");
  setText(doc, "#eternity h2", "Make it matter.");
  setText(doc, "#eternity .body-lg", "มีไอเดียที่อยากให้เกิดขึ้นจริง? มาสร้างเรื่องราวที่ขับเคลื่อนผู้คนไปด้วยกัน");
  setText(doc, "#eternity .cta span", "ติดต่อเรา");
  setSiteLink(doc, "#eternity .cta", `/${content.locale}/contact`);
  setText(doc, ".foot-brand p", "Media Planner Consultant — บริการสื่อสารการตลาดและสร้างสรรค์ผลงานที่เชื่อมแบรนด์กับผู้คน");
  setText(doc, ".foot-base span:first-child", "© 2026 Media Planner Consultant");
  setText(doc, ".foot-base span.jp", "BANGKOK · THAILAND");
  setText(doc, ".foot-base span:last-child", "CREATIVE · PR · INVESTOR RELATIONS");
  const footerColumns = doc.querySelectorAll(".foot-grid > div:not(.foot-brand)");
  const footerContent = [
    ["สำรวจ", ["เกี่ยวกับเรา", "ผลงาน", "บริการ", "ติดต่อ"]],
    ["บริการ", content.services.slice(0, 4).map((service) => service.title)],
    ["เพิ่มเติม", ["ข่าวสาร", "วิดีโอ", "ติดต่อเรา"]],
  ] as const;
  footerColumns.forEach((column, index) => {
    const info = footerContent[index];
    if (!info) return;
    const heading = column.querySelector("h4");
    if (heading) heading.textContent = info[0];
    column.querySelectorAll("li a").forEach((link, itemIndex) => {
      const label = info[1][itemIndex];
      if (label) link.textContent = label;
    });
  });
  [
    [".foot-grid > div:last-child li:nth-child(1) a", `/${content.locale}/news`],
    [".foot-grid > div:last-child li:nth-child(2) a", `/${content.locale}/news`],
    [".foot-grid > div:last-child li:nth-child(3) a", `/${content.locale}/contact`],
  ].forEach(([selector, href]) => setSiteLink(doc, selector, href));
  const customStyle = doc.createElement("style");
  customStyle.textContent = ".hero-side,.rail,.sec-head .jp,.card-lab .jp,.peek-cap .jp{display:none!important}.brand-tx b{font-size:1.1em}.h-hero{max-width:750px}.hero-sub{max-width:480px}";
  doc.head.append(customStyle);

  // Keep the authored scroll and camera behavior. Route links leave the iframe through the host.
  if (!doc.documentElement.dataset.mediaPlannerLinks) {
    doc.documentElement.dataset.mediaPlannerLinks = "true";
    doc.addEventListener("click", (event) => {
      const target = event.target as Element | null;
      const link = target?.closest<HTMLAnchorElement>("a[data-site-link]");
      const card = target?.closest<HTMLElement>("[data-site-href]");
      const href = link?.getAttribute("href") || card?.dataset.siteHref;
      if (!href) return;
      event.preventDefault();
      event.stopPropagation();
      frame.contentWindow?.parent.postMessage({ type: "media-planner-route", href }, location.origin);
    }, true);
    doc.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const target = event.target as HTMLElement | null;
      const href = target?.dataset.siteHref;
      if (href) {
        event.preventDefault();
        frame.contentWindow?.parent.postMessage({ type: "media-planner-route", href }, location.origin);
      }
    }, true);
  }
}

export default function KageExperience({ content }: { content?: MediaPlannerContent }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!content) return;
    const frame = containerRef.current?.querySelector("iframe");
    if (!frame) return;
    const apply = () => applyMediaPlannerContent(frame, content);
    frame.addEventListener("load", apply);
    if (frame.contentDocument?.readyState === "complete") apply();
    return () => frame.removeEventListener("load", apply);
  }, [content]);

  useEffect(() => {
    if (!content) return;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.data?.type !== "media-planner-route") return;
      const href = event.data.href;
      if (typeof href === "string" && href.startsWith(`/${content.locale}/`)) location.assign(href);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [content]);

  return (
    <div ref={containerRef} className="shader-frame" style={{ width: "100%", height: "100dvh", minHeight: 480 }}>
      {content ? (
        <iframe
          title="Media Planner — Kage experience"
          src="/landing-pages/media-planner.html"
          sandbox="allow-downloads allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
          style={{ display: "block", width: "100%", height: "100%", border: 0, background: "#080808" }}
        />
      ) : (
        <KageLandingPage
          headingFont="onest"
          bodyFont="onest"
          headingWeight="400"
          bodyWeight="300"
          primaryColor="#e0231c"
          headingSize={46}
          bodySize={17}
          headingLetterSpacing={-0.012}
        />
      )}
    </div>
  );
}
