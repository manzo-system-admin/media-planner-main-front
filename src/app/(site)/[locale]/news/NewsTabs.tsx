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
  allLabel,
  newsItems,
  videoLibrary,
  eventGallery,
  categories,
  categoryLabels,
}: {
  locale: Locale;
  homeLabel: string;
  news: Dictionary["news"];
  allLabel: string;
  newsItems: CmsNewsItem[];
  videoLibrary: CmsVideoItem[];
  eventGallery: CmsGalleryItem[];
  categories: { key: string; label: string }[];
  categoryLabels: Record<string, string>;
}) {
  const [active, setActive] = useState<Tab>("articles");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [openVideo, setOpenVideo] = useState<CmsVideoItem | null>(null);
  const [uploadRatio, setUploadRatio] = useState<number | null>(null);
  const [openGalleryIndex, setOpenGalleryIndex] = useState<number | null>(null);
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

  const handleCategoryClick = (key: string) => {
    setActiveCategory(key);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const searchQuery = search.trim().toLowerCase();
  const filteredNewsItems = newsItems
    .filter((item) => activeCategory === "ALL" || item.category === activeCategory)
    .filter(
      (item) =>
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery) ||
        item.excerpt.toLowerCase().includes(searchQuery)
    );
  const articlesTotalPages = Math.max(1, Math.ceil(filteredNewsItems.length / PAGE_SIZE));
  const pagedNewsItems = filteredNewsItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={news.searchPlaceholder}
            className={styles.searchInput}
          />
          {categories.length > 0 && (
            <div className={styles.filters}>
              <button
                type="button"
                onClick={() => handleCategoryClick("ALL")}
                className={`${styles.filterPill} ${activeCategory === "ALL" ? styles.filterPillActive : ""}`}
              >
                {allLabel}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleCategoryClick(cat.key)}
                  className={`${styles.filterPill} ${activeCategory === cat.key ? styles.filterPillActive : ""}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
          {filteredNewsItems.length === 0 && <p className={styles.searchEmpty}>{news.searchEmpty}</p>}
          <div className={styles.articleGrid}>
            {pagedNewsItems.map((item) => (
              <Link key={item.id} href={`/${locale}/news/${item.id}`} className={styles.articleCard}>
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
                  {item.category && categoryLabels[item.category] && (
                    <span className={styles.articleCategory}>{categoryLabels[item.category]}</span>
                  )}
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
          <div className={styles.galleryGrid}>
            {pagedEventGallery.map((item, localIndex) => (
              <button
                key={item.id}
                type="button"
                className={styles.galleryImage}
                onClick={() => setOpenGalleryIndex((page - 1) * PAGE_SIZE + localIndex)}
              >
                <Image
                  src={item.image}
                  alt={item.caption || news.galleryImageAlt}
                  fill
                  sizes="(max-width: 2000px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
              </button>
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

      {openGalleryIndex !== null && (
        <div className={lightboxStyles.overlay} onClick={() => setOpenGalleryIndex(null)}>
          <div className={styles.galleryModal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={lightboxStyles.closeButton}
              onClick={() => setOpenGalleryIndex(null)}
            >
              ✕
            </button>
            {eventGallery.length > 1 && (
              <button
                type="button"
                className={`${styles.galleryNav} ${styles.galleryNavPrev}`}
                aria-label="ก่อนหน้า"
                onClick={() =>
                  setOpenGalleryIndex((i) => ((i ?? 0) - 1 + eventGallery.length) % eventGallery.length)
                }
              >
                ‹
              </button>
            )}
            <div className={styles.galleryModalImage}>
              <Image
                src={eventGallery[openGalleryIndex].image}
                alt={eventGallery[openGalleryIndex].caption || news.galleryImageAlt}
                fill
                sizes="92vw"
                style={{ objectFit: "contain" }}
              />
            </div>
            {eventGallery.length > 1 && (
              <button
                type="button"
                className={`${styles.galleryNav} ${styles.galleryNavNext}`}
                aria-label="ถัดไป"
                onClick={() => setOpenGalleryIndex((i) => ((i ?? 0) + 1) % eventGallery.length)}
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
