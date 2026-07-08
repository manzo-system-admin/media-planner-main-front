import type { ReactNode } from "react";
import styles from "./AwardBadge.module.css";

// One distinct badge glyph per award, cycled by index.
const MARKS: ReactNode[] = [
  // Agency of the Year — trophy
  <g key="trophy" fill="none" stroke="var(--grad-orange)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4z" />
    <path d="M7 5H4v2a3 3 0 0 0 3 3" />
    <path d="M17 5h3v2a3 3 0 0 1-3 3" />
    <path d="M12 13v3" />
    <path d="M9 20h6" />
    <path d="M10 16h4l.5 4h-5z" />
  </g>,
  // Best Digital Campaign — lightning bolt
  <path
    key="bolt"
    d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"
    fill="var(--grad-blue)"
  />,
  // Creative Excellence Award — ribbon medal
  <g key="ribbon" fill="none" stroke="var(--grad-purple)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="5" />
    <path d="M9 13.5 7 21l5-3 5 3-2-7.5" />
  </g>,
  // ISO 9001 Certified — check shield
  <g key="shield" fill="none" stroke="var(--grad-green)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6l-8-3z" />
    <path d="M9 12l2 2 4-4" />
  </g>,
];

export default function AwardBadge({ name, index }: { name: string; index: number }) {
  return (
    <span className={styles.badge}>
      <svg width="22" height="22" viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
        {MARKS[index % MARKS.length]}
      </svg>
      <span className={styles.name}>{name}</span>
    </span>
  );
}
