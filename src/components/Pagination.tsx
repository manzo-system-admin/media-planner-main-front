"use client";

import styles from "./Pagination.module.css";

export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={styles.navButton}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="หน้าก่อนหน้า"
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          type="button"
          className={`${styles.pageButton} ${pageNum === page ? styles.pageButtonActive : ""}`}
          onClick={() => onChange(pageNum)}
        >
          {pageNum}
        </button>
      ))}
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
