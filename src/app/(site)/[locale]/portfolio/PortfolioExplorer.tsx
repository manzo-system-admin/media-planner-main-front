"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import styles from "./page.module.css";
import type { Dictionary, PortfolioCategory, PortfolioItem } from "@/lib/dictionaries/types";
import type { Locale } from "@/lib/i18n/config";

export default function PortfolioExplorer({
  locale,
  homeLabel,
  portfolio,
  categoryLabels,
  items: allItems,
}: {
  locale: Locale;
  homeLabel: string;
  portfolio: Dictionary["portfolio"];
  categoryLabels: Record<PortfolioCategory, string>;
  items: PortfolioItem[];
}) {
  const [active, setActive] = useState<PortfolioCategory | "ALL">("ALL");

  const items = active === "ALL" ? allItems : allItems.filter((item) => item.category === active);

  return (
    <>
      <div className={styles.intro}>
        <div className={styles.breadcrumb}>
          <Breadcrumb items={[{ label: homeLabel, href: `/${locale}` }, { label: portfolio.title }]} />
        </div>
        <h1 className={styles.title}>{portfolio.title}</h1>
        <div className={styles.filters}>
          {portfolio.filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActive(filter.key)}
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
    </>
  );
}
