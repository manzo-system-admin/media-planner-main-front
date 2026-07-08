"use client";

import { createPortal } from "react-dom";
import styles from "./AdminConfirmModal.module.css";

export default function AdminConfirmModal({
  open,
  message,
  confirmLabel = "ลบ",
  cancelLabel = "ยกเลิก",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} role="alertdialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.iconWrap}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4m0 3.5h.01M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button type="button" className={styles.confirmButton} onClick={onConfirm} disabled={busy}>
            {busy ? "กำลังลบ..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
