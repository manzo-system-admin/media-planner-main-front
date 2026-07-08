"use client";

import { useMemo, useState, type ReactNode } from "react";
import styles from "./DataTable.module.css";

export type DataTableColumn<T> = {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
};

const PAGE_SIZE = 10;

/**
 * Fully client-side table: search and pagination both run over the `items`
 * array the caller loaded. Adequate at this content scale (dozens of items
 * per collection) — see ADMIN_SETUP.md / the plan notes for the upgrade path
 * (Algolia/Typesense) if a collection ever grows into the thousands.
 */
export default function DataTable<T>({
  columns,
  items,
  getRowId,
  searchPlaceholder = "ค้นหา...",
  searchableText,
  onNewClick,
  newLabel = "+ เพิ่มใหม่",
  renderActions,
  loading = false,
}: {
  columns: DataTableColumn<T>[];
  items: T[];
  getRowId: (item: T) => string;
  searchPlaceholder?: string;
  searchableText: (item: T) => string;
  onNewClick?: () => void;
  newLabel?: string;
  renderActions?: (item: T) => ReactNode;
  loading?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter((item) => searchableText(item).toLowerCase().includes(q));
  }, [items, query, searchableText]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.search}
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        {onNewClick && (
          <button type="button" className={styles.newButton} onClick={onNewClick}>
            {newLabel}
          </button>
        )}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {renderActions && <th className={styles.actionsHeader} />}
          </tr>
        </thead>
        <tbody>
          {pageItems.map((item) => (
            <tr key={getRowId(item)}>
              {columns.map((col) => (
                <td key={col.key}>{col.render(item)}</td>
              ))}
              {renderActions && <td className={styles.actionsCell}>{renderActions(item)}</td>}
            </tr>
          ))}
        </tbody>
      </table>

      {!loading && filtered.length === 0 && <div className={styles.empty}>ไม่พบข้อมูล</div>}
      {loading && <div className={styles.empty}>กำลังโหลด...</div>}

      {pageCount > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageButton}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            ก่อนหน้า
          </button>
          <span>
            หน้า {currentPage} / {pageCount}
          </span>
          <button
            type="button"
            className={styles.pageButton}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={currentPage >= pageCount}
          >
            ถัดไป
          </button>
        </div>
      )}
    </div>
  );
}
