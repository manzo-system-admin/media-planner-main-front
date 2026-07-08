"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./AdminAlertModal.module.css";

export type AdminAlertTone = "success" | "error";

export default function AdminAlertModal({
  open,
  message,
  tone = "success",
  onClose,
  autoCloseMs = 1400,
}: {
  open: boolean;
  message: string;
  tone?: AdminAlertTone;
  onClose: () => void;
  autoCloseMs?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(timer);
  }, [open, autoCloseMs, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} role="alertdialog" aria-live="assertive">
      <div className={`${styles.modal} ${tone === "error" ? styles.modalError : styles.modalSuccess}`}>
        <div className={styles.iconWrap}>
          {tone === "success" ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.5 9.5 18 20 6"
                stroke="#fff"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6 6 18" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <p className={styles.message}>{message}</p>
      </div>
    </div>,
    document.body
  );
}
