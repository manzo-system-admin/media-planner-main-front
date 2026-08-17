"use client";

import { createPortal } from "react-dom";
import styles from "./AdminConfirmModal.module.css";

export default function AdminConfirmModal({
  open,
  message,
  tone = "danger",
  confirmLabel = "ลบ",
  cancelLabel = "ยกเลิก",
  busyLabel = "กำลังดำเนินการ...",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  message: string;
  tone?: "danger" | "info";
  confirmLabel?: string;
  cancelLabel?: string;
  busyLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  const icon =
    tone === "info" ? (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 7h10a5 5 0 0 1 0 10H8m0 0 3-3m-3 3 3 3M20 17H10a5 5 0 0 1 0-10h6m0 0-3-3m3 3-3 3"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 9v4m0 3.5h.01M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  return createPortal(
    <div className={styles.overlay} role="alertdialog" aria-modal="true">
      <div className={`${styles.modal} ${tone === "info" ? styles.modalInfo : ""}`}>
        <div className={styles.iconWrap}>{icon}</div>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button type="button" className={styles.confirmButton} onClick={onConfirm} disabled={busy}>
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
