"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./RowActionsMenu.module.css";

const MENU_HEIGHT_ESTIMATE = 90;

export default function RowActionsMenu({
  editHref,
  onDelete,
  editLabel = "แก้ไข",
  deleteLabel = "ลบ",
}: {
  editHref: string;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapRef.current &&
        !wrapRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const toggleOpen = () => {
    if (!open && wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      const openUpward = window.innerHeight - rect.bottom < MENU_HEIGHT_ESTIMATE;
      setMenuPos({
        top: openUpward ? rect.top - MENU_HEIGHT_ESTIMATE : rect.bottom + 4,
        left: rect.right - 130,
      });
    }
    setOpen((v) => !v);
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="เปิดเมนู"
        aria-expanded={open}
        onClick={toggleOpen}
      >
        ⋯
      </button>
      {open &&
        menuPos &&
        createPortal(
          <div
            className={styles.menu}
            ref={menuRef}
            style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
          >
            <a href={editHref} className={styles.menuItem}>
              {editLabel}
            </a>
            <button
              type="button"
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
            >
              {deleteLabel}
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
