"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import styles from "./page.module.css";
import type { Dictionary, PortfolioCategory, PortfolioFilter, PortfolioItem } from "@/lib/dictionaries/types";
import type { Locale } from "@/lib/i18n/config";

const PAGE_SIZE = 6;

export default function PortfolioExplorer({
  locale,
  homeLabel,
  portfolio,
  filters,
  categoryLabels,
  items: allItems,
}: {
  locale: Locale;
  homeLabel: string;
  portfolio: Dictionary["portfolio"];
  filters: PortfolioFilter[];
  categoryLabels: Record<PortfolioCategory, string>;
  items: PortfolioItem[];
}) {
  const [active, setActive] = useState<PortfolioCategory | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const filteredItems = active === "ALL" ? allItems : allItems.filter((item) => item.category === active);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const items = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterClick = (key: PortfolioCategory | "ALL") => {
    setActive(key);
    setPage(1);
  };

  return (
    <>
      <div className={styles.intro}>
        <div className={styles.breadcrumb}>
          <Breadcrumb items={[{ label: homeLabel, href: `/${locale}` }, { label: portfolio.title }]} />
        </div>
        <h1 className={styles.title}>{portfolio.title}</h1>
        <div className={styles.filters}>
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => handleFilterClick(filter.key)}
              className={`${styles.filterPill} ${active === filter.key ? styles.filterPillActive : ""}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {items.length === 0 && <p className={styles.empty}>{portfolio.empty}</p>}
        {items.map((item) => (
          <Link key={item.slug} href={`/${locale}/portfolio/${item.slug}`} className={styles.card}>
            <div className={styles.cardImage}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardCategory}>{categoryLabels[item.category]}</div>
              <div className={styles.cardTitle}>{item.title}</div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
}
