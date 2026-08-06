import type { ReactNode } from "react";
import styles from "./ClientLogo.module.css";

// Placeholder brand marks — one distinct shape per client, cycled by index.
const MARKS: ReactNode[] = [
  // Aurora Retail — layered arcs
  <g key="arcs" fill="none" strokeWidth="2.5" strokeLinecap="round">
    <path d="M4 16a8 8 0 0 1 16 0" stroke="var(--grad-purple)" />
    <path d="M8 16a4 4 0 0 1 8 0" stroke="var(--grad-blue)" />
  </g>,
  // Sabai Foods — leaf
  <g key="leaf">
    <path
      d="M12 3C7 7 5 12 6.5 17.5 12 19 17 17 19 11.5 17.5 6.5 15 4 12 3z"
      fill="var(--grad-green)"
    />
    <path d="M8 16c2.5-3.5 6-6.5 9-8" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </g>,
  // NextGen Finance — rising bars
  <g key="bars" fill="var(--grad-blue)">
    <rect x="4" y="13" width="4" height="7" rx="1" opacity="0.55" />
    <rect x="10" y="9" width="4" height="11" rx="1" opacity="0.8" />
    <rect x="16" y="4" width="4" height="16" rx="1" />
  </g>,
  // Bluewave Auto — waves
  <g key="waves" fill="none" strokeWidth="2.5" strokeLinecap="round">
    <path d="M3 9c3-3 6-3 9 0s6 3 9 0" stroke="var(--grad-cyan)" />
    <path d="M3 15c3-3 6-3 9 0s6 3 9 0" stroke="var(--grad-blue)" opacity="0.6" />
  </g>,
  // Glow Beauty Co. — sparkle
  <g key="sparkle">
    <path
      d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"
      fill="var(--grad-orange)"
    />
    <circle cx="12" cy="12" r="2.4" fill="#fff" />
  </g>,
  // Metro Living — building blocks
  <g key="blocks" fill="var(--grad-red)">
    <rect x="4" y="10" width="7" height="10" rx="1" opacity="0.7" />
    <rect x="13" y="4" width="7" height="16" rx="1" />
    <rect x="6.5" y="12.5" width="2" height="2" fill="#fff" />
    <rect x="6.5" y="16" width="2" height="2" fill="#fff" />
    <rect x="15.5" y="7" width="2" height="2" fill="#fff" />
    <rect x="15.5" y="10.5" width="2" height="2" fill="#fff" />
    <rect x="15.5" y="14" width="2" height="2" fill="#fff" />
  </g>,
];

export default function ClientLogo({
  name,
  index,
  logoUrl,
}: {
  name: string;
  index: number;
  logoUrl?: string;
}) {
  if (logoUrl) {
    return (
      <span className={styles.logo}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt="" style={{ maxHeight: 28, maxWidth: 40, objectFit: "contain" }} />
        {/* <span className={styles.name}>{name}</span> */}
      </span>
    );
  }

  return (
    <span className={styles.logo}>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        {MARKS[index % MARKS.length]}
      </svg>
      <span className={styles.name}>{name}</span>
    </span>
  );
}
