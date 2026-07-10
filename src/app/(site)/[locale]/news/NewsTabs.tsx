"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import styles from "./page.module.css";
import lightboxStyles from "@/components/VideoPopupCard.module.css";
import VideoEmbed from "@/components/VideoEmbed";
import type { Dictionary } from "@/lib/dictionaries/types";
import type { CmsNewsItem } from "@/lib/cms/types";
import type { CmsGalleryItem, CmsVideoItem } from "@/lib/cms/media";
import type { Locale } from "@/lib/i18n/config";

type Tab = "articles" | "videos" | "gallery";

const PAGE_SIZE = 6;
const DEFAULT_LANDSCAPE_RATIO = 16 / 9;
const TIKTOK_PORTRAIT_RATIO = 9 / 16;

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
  const [uploadRatio, setUploadRatio] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const openVideoRatio =
    openVideo?.videoSource.kind === "tiktok" ||
    (openVideo?.videoSource.kind === "facebook" && openVideo.videoSource.isReel)
      ? TIKTOK_PORTRAIT_RATIO
      : openVideo?.videoSource.kind === "upload" && uploadRatio
        ? uploadRatio
        : DEFAULT_LANDSCAPE_RATIO;

  const handleTabClick = (tab: Tab) => {
    setActive(tab);
    setPage(1);
  };

  const articlesTotalPages = Math.max(1, Math.ceil(newsItems.length / PAGE_SIZE));
  const pagedNewsItems = newsItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const videosTotalPages = Math.max(1, Math.ceil(videoLibrary.length / PAGE_SIZE));
  const pagedVideoLibrary = videoLibrary.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const galleryTotalPages = Math.max(1, Math.ceil(eventGallery.length / PAGE_SIZE));
  const pagedEventGallery = eventGallery.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
              onClick={() => handleTabClick(tab.key)}
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
            {pagedNewsItems.map((item) => (
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
          <Pagination page={page} totalPages={articlesTotalPages} onChange={setPage} />
        </section>
      )}

      {active === "videos" && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>{news.videosLabel}</div>
          <div className={styles.articleGrid}>
            {pagedVideoLibrary.map((video) => (
              <button
                key={video.id}
                type="button"
                className={styles.videoThumb}
                onClick={() => {
                  setUploadRatio(null);
                  setOpenVideo(video);
                }}
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
          <Pagination page={page} totalPages={videosTotalPages} onChange={setPage} />
        </section>
      )}

      {active === "gallery" && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>{news.galleryLabel}</div>
          <div className={styles.galleryGrid}>
            {pagedEventGallery.map((item) => (
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
          <Pagination page={page} totalPages={galleryTotalPages} onChange={setPage} />
        </section>
      )}

      {openVideo && (
        <div className={lightboxStyles.overlay} onClick={() => setOpenVideo(null)}>
          <div
            className={lightboxStyles.modal}
            style={{ "--ratio": openVideoRatio } as CSSProperties}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={lightboxStyles.closeButton}
              onClick={() => setOpenVideo(null)}
            >
              ✕
            </button>
            <VideoEmbed
              source={openVideo.videoSource}
              autoPlay
              title={openVideo.title}
              onAspectRatio={setUploadRatio}
            />
          </div>
        </div>
      )}
    </>
  );
}
