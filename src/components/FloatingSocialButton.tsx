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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="6" cy="12" r="2.4" />
            <circle cx="17.5" cy="5.5" r="2.4" />
            <circle cx="17.5" cy="18.5" r="2.4" />
            <path d="M8.1 10.9 15.4 6.9M8.1 13.1 15.4 17.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
