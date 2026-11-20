import Image from "next/image";
import type { ReactNode } from "react";
import Breadcrumb, { type BreadcrumbItem } from "./Breadcrumb";
import MotionLoop from "./MotionLoop";
import styles from "./PageHero.module.css";
import { getHeroSlides } from "@/lib/cms/homepage";

export default async function PageHero({
  title,
  accent,
  eyebrow,
  subtitle,
  image,
  poster,
  breadcrumb,
  children,
  compact = false,
  dense = false,
}: {
  title: string;
  accent?: string;
  eyebrow?: string;
  subtitle?: string;
  image?: string;
  poster?: string;
  breadcrumb?: BreadcrumbItem[];
  children?: ReactNode;
  compact?: boolean;
  dense?: boolean;
}) {
  const slides = await getHeroSlides();
  const homeVideo = slides.find((slide) => slide.type === "video");
  const backgroundVideo = homeVideo?.src || "/videos/motion-signal.mp4";
  const backgroundPoster = poster || image || homeVideo?.poster || "/images/motion-signal.webp";

  return (
    <section data-page-hero className={`${styles.hero} ${compact ? styles.compact : ""} ${dense ? styles.dense : ""}`}>
      <div className={styles.media} aria-hidden="true">
        <Image src={backgroundPoster} alt="" fill priority sizes="100vw" />
        <MotionLoop src={backgroundVideo} poster={backgroundPoster} label="" />
      </div>
      <div className={styles.content}>
        {breadcrumb ? <div className={styles.eyebrow} data-reveal><Breadcrumb items={breadcrumb} /></div> : eyebrow ? <p className={styles.eyebrow} data-reveal>{eyebrow}</p> : null}
        <h1 className={styles.title} data-reveal>{title}{accent && <><br /><em>{accent}</em></>}</h1>
        {subtitle && <p className={styles.subtitle} data-reveal>{subtitle}</p>}
        {children}
      </div>
      <span className={styles.index} aria-hidden="true">MEDIA PLANNER / BANGKOK</span>
    </section>
  );
}
