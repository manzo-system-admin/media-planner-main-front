"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
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
  const triggerRef = useRef<HTMLButtonElement>(null);

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
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); triggerRef.current?.focus(); }
    };
    const closeOnMove = () => setOpen(false);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", closeOnMove);
    window.addEventListener("scroll", closeOnMove, true);
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", closeOnMove);
      window.removeEventListener("scroll", closeOnMove, true);
    };
  }, [open]);

  const toggleOpen = () => {
    if (!open && wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      const openUpward = window.innerHeight - rect.bottom < MENU_HEIGHT_ESTIMATE;
      setMenuPos({
        top: openUpward ? rect.top - MENU_HEIGHT_ESTIMATE : rect.bottom + 4,
        left: Math.max(8, Math.min(window.innerWidth - 138, rect.right - 130)),
      });
    }
    setOpen((v) => !v);
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        ref={triggerRef}
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
            <Link href={editHref} className={styles.menuItem} onClick={() => setOpen(false)}>
              {editLabel}
            </Link>
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
