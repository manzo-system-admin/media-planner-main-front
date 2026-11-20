"use client";

import styles from "./Pagination.module.css";

function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((number) => pages.add(number));
  if (page >= totalPages - 2) {
    [totalPages - 3, totalPages - 2, totalPages - 1].forEach((number) => pages.add(number));
  }

  return [...pages].filter((number) => number >= 1 && number <= totalPages).sort((a, b) => a - b);
}

export default function Pagination({
  page,
  totalPages,
  onChange,
  className,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav className={`${styles.pagination} ${className ?? ""}`} aria-label="เลือกหน้า">
      <button
        type="button"
        className={styles.navButton}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="หน้าก่อนหน้า"
      >
        ‹
      </button>
      {visiblePages.map((pageNum, index) => {
        const previous = visiblePages[index - 1];
        const gap = previous ? pageNum - previous : 1;
        return (
          <span className={styles.pageGroup} key={pageNum}>
            {gap > 2 && <span className={styles.ellipsis} aria-hidden="true">…</span>}
            {gap === 2 && (
              <button type="button" className={styles.pageButton} onClick={() => onChange(previous + 1)} aria-label={`หน้า ${previous + 1}`}>
                {previous + 1}
              </button>
            )}
            <button
              type="button"
              className={`${styles.pageButton} ${pageNum === page ? styles.pageButtonActive : ""}`}
              onClick={() => onChange(pageNum)}
              aria-label={`หน้า ${pageNum}`}
              aria-current={pageNum === page ? "page" : undefined}
            >
              {pageNum}
            </button>
          </span>
        );
      })}
      <button
        type="button"
        className={styles.navButton}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="หน้าถัดไป"
      >
        ›
      </button>
    </nav>
  );
}
