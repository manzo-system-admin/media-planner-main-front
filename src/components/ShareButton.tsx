"use client";

import { useState } from "react";
import styles from "./ShareButton.module.css";

export default function ShareButton({ title, label = "แชร์บทความ" }: { title: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className={styles.button} onClick={handleShare}>
      <span className={styles.icon} aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 8a3 3 0 1 0-2.84-4H15a3 3 0 0 0 1.16 2.37l-7.02 3.51a3 3 0 1 0 0 4.24l7.02 3.51A3 3 0 1 0 17 16.2l-7.02-3.51a3.24 3.24 0 0 0 0-1.38L17 7.8c.31.13.65.2 1 .2Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span>{copied ? "คัดลอกลิงก์แล้ว" : label}</span>
    </button>
  );
}
