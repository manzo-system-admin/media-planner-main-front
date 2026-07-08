import type { ReactNode } from "react";
import { GRADIENTS, type GradientKey } from "@/lib/dictionaries/types";

const ICON_PATHS: Record<string, ReactNode> = {
  "media-planning-buying": (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="#fff" stroke="none" />
    </>
  ),
  "digital-social-media": (
    <>
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="17" cy="6" r="2.2" />
      <circle cx="17" cy="18" r="2.2" />
      <line x1="8" y1="11" x2="15" y2="7.2" />
      <line x1="8" y1="13" x2="15" y2="16.8" />
    </>
  ),
  "creative-content-production": (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M10 8.5 L16 12 L10 15.5 Z" fill="#fff" stroke="none" />
    </>
  ),
  "pr-event": (
    <>
      <path d="M3 10v4a1 1 0 0 0 1 1h2l7 4V5l-7 4H4a1 1 0 0 0-1 1z" />
      <path d="M16 9a4 4 0 0 1 0 6" />
      <path d="M9 15v3a1.5 1.5 0 0 0 3 0v-2" />
    </>
  ),
};

export default function ServiceIcon({
  slug,
  gradient,
  className,
  size = 22,
}: {
  slug: string;
  gradient: GradientKey;
  className?: string;
  size?: number;
}) {
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
        {ICON_PATHS[slug]}
      </svg>
    </span>
  );
}
