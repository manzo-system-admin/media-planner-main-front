"use client";

import { useState } from "react";
import SocialIcon from "./SocialIcon";
import styles from "./FloatingSocialButton.module.css";
import type { SocialLink } from "@/lib/dictionaries/types";

export default function FloatingSocialButton({ socialLinks }: { socialLinks: SocialLink[] }) {
  const [open, setOpen] = useState(false);

  if (socialLinks.length === 0) return null;

  return (
    <div className={styles.wrap}>
      {socialLinks.map((social, index) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className={`${styles.item} ${open ? styles.itemOpen : ""}`}
          style={{
            transitionDelay: open ? `${index * 40}ms` : "0ms",
            // Stack upward from the main button; index 0 sits closest.
            "--offset": `${(index + 1) * 58}px`,
          } as React.CSSProperties}
          tabIndex={open ? 0 : -1}
        >
          <SocialIcon name={social.name} size={18} />
        </a>
      ))}

      <button
        type="button"
        className={styles.button}
        aria-label={open ? "ปิดเมนูโซเชียล" : "เปิดเมนูโซเชียล"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4.5 11.2c0-4.1 3.35-7.2 7.5-7.2s7.5 3.1 7.5 7.2-3.35 7.2-7.5 7.2c-.82 0-1.6-.12-2.33-.36L5.6 20.1c-.75.38-1.56-.36-1.25-1.14l1.23-3.06A7.05 7.05 0 0 1 4.5 11.2Z"
              fill="currentColor"
            />
            <circle cx="9" cy="11.4" r="1.05" fill="var(--grad-blue)" />
            <circle cx="12" cy="11.4" r="1.05" fill="var(--grad-blue)" />
            <circle cx="15" cy="11.4" r="1.05" fill="var(--grad-blue)" />
          </svg>
        )}
      </button>
    </div>
  );
}
