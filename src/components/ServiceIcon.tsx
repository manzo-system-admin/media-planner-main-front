import type { ReactNode } from "react";
import { GRADIENTS, type GradientKey } from "@/lib/dictionaries/types";

export const SERVICE_ICON_KEYS = [
  "target",
  "network",
  "play",
  "megaphone",
  "star",
  "chart",
  "camera",
  "bulb",
] as const;

export type ServiceIconKey = (typeof SERVICE_ICON_KEYS)[number];

const DEFAULT_ICON: ServiceIconKey = "star";

const ICON_PATHS: Record<ServiceIconKey, ReactNode> = {
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="#fff" stroke="none" />
    </>
  ),
  network: (
    <>
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="17" cy="6" r="2.2" />
      <circle cx="17" cy="18" r="2.2" />
      <line x1="8" y1="11" x2="15" y2="7.2" />
      <line x1="8" y1="13" x2="15" y2="16.8" />
    </>
  ),
  play: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M10 8.5 L16 12 L10 15.5 Z" fill="#fff" stroke="none" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 10v4a1 1 0 0 0 1 1h2l7 4V5l-7 4H4a1 1 0 0 0-1 1z" />
      <path d="M16 9a4 4 0 0 1 0 6" />
      <path d="M9 15v3a1.5 1.5 0 0 0 3 0v-2" />
    </>
  ),
  star: (
    <path d="M12 3.5 14.4 9.6 21 10.1 16 14.3 17.5 20.7 12 17.2 6.5 20.7 8 14.3 3 10.1 9.6 9.6z" />
  ),
  chart: (
    <>
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M3 20h18" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.45 1 1.2 1 2.1h5c0-.9.4-1.65 1-2.1A6 6 0 0 0 12 3z" />
    </>
  ),
};

export default function ServiceIcon({
  icon,
  gradient,
  className,
  size = 22,
}: {
  icon: string;
  gradient: GradientKey;
  className?: string;
  size?: number;
}) {
  const glyph = ICON_PATHS[icon as ServiceIconKey] ?? ICON_PATHS[DEFAULT_ICON];
  return (
    <span className={className} style={{ background: GRADIENTS[gradient] }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {glyph}
      </svg>
    </span>
  );
}
