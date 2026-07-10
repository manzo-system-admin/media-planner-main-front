import type { Locale } from "@/lib/i18n/config";

export type Localized = { th: string; en: string };

export function pick(field: Localized, locale: Locale): string {
  return field[locale] ?? field.th ?? field.en ?? "";
}

export type VideoSource =
  | { kind: "upload"; url: string }
  | { kind: "youtube"; videoId: string }
  | { kind: "facebook"; url: string; isReel?: boolean }
  | { kind: "tiktok"; videoId: string; url: string };

export type NewsDoc = {
  id: string;
  slug: string;
  date: string;
  title: Localized;
  image: string;
  excerpt: Localized;
  body: Localized; // rich text editor HTML, sanitized before render
  createdAt?: number;
  deleted?: boolean;
};

// Shape handed to the public news pages after picking a locale.
export type CmsNewsItem = {
  id: string;
  slug: string;
  date: string;
  title: string;
  image: string;
  excerpt: string;
  bodyHtml: string;
};
