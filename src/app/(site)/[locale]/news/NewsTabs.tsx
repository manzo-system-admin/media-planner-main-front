"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import styles from "./page.module.css";
import lightboxStyles from "@/components/VideoPopupCard.module.css";
import VideoEmbed from "@/components/VideoEmbed";
import type { Dictionary } from "@/lib/dictionaries/types";
import type { CmsNewsItem } from "@/lib/cms/types";
import type { CmsGalleryItem, CmsVideoItem } from "@/lib/cms/media";
import type { Locale } from "@/lib/i18n/config";

type Tab = "articles" | "videos" | "gallery";

export default function NewsTabs({
  locale,
  homeLabel,
  news,
  newsItems,
  videoLibrary,
  eventGallery,
}: {
  locale: Locale;
  homeLabel: string;
  news: Dictionary["news"];
  newsItems: CmsNewsItem[];
  videoLibrary: CmsVideoItem[];
  eventGallery: CmsGalleryItem[];
}) {
  const [active, setActive] = useState<Tab>("articles");
  const [openVideo, setOpenVideo] = useState<CmsVideoItem | null>(null);

  return (
    <>
      <div className={styles.intro}>
        <div className={styles.breadcrumb}>
          <Breadcrumb items={[{ label: homeLabel, href: `/${locale}` }, { label: news.title }]} />
        </div>
        <h1 className={styles.title}>{news.title}</h1>
        <div className={styles.tabs}>
          {news.tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`${styles.tab} ${active === tab.key ? styles.tabActive : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {active === "articles" && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>{news.articlesLabel}</div>
          <div className={styles.articleGrid}>
            {newsItems.map((item) => (
              <Link key={item.slug} href={`/${locale}/news/${item.slug}`} className={styles.articleCard}>
                <div className={styles.articleThumb}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.articleBody}>
                  <span className={styles.articleDate}>{item.date}</span>
                  <span className={styles.articleTitle}>{item.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {active === "videos" && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>{news.videosLabel}</div>
          <div className={styles.articleGrid}>
            {videoLibrary.map((video) => (
              <button
                key={video.id}
                type="button"
                className={styles.videoThumb}
                onClick={() => setOpenVideo(video)}
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
                <span className={styles.playIcon} />
              </button>
            ))}
          </div>
        </section>
      )}

      {active === "gallery" && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>{news.galleryLabel}</div>
          <div className={styles.galleryGrid}>
            {eventGallery.map((item) => (
              <div key={item.id} className={styles.galleryImage}>
                <Image
                  src={item.image}
                  alt={item.caption || news.galleryImageAlt}
                  fill
                  sizes="(max-width: 720px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {openVideo && (
        <div className={lightboxStyles.overlay} onClick={() => setOpenVideo(null)}>
          <div className={lightboxStyles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={lightboxStyles.closeButton}
              onClick={() => setOpenVideo(null)}
            >
              ✕
            </button>
            <VideoEmbed source={openVideo.videoSource} autoPlay title={openVideo.title} />
          </div>
        </div>
      )}
    </>
  );
}
