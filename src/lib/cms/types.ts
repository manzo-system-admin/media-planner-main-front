// Thai-only now, but reads stay defensive: documents saved before English was
// removed may still literally hold a `{ th, en }` object for these fields.
export function toText(field: unknown): string {
  if (typeof field === "string") return field;
  if (field && typeof field === "object") {
    const obj = field as { th?: string; en?: string };
    return obj.th ?? obj.en ?? "";
  }
  return "";
}

export function toStringArray(field: unknown): string[] {
  if (Array.isArray(field)) return field;
  if (field && typeof field === "object") {
    const obj = field as { th?: string[]; en?: string[] };
    return obj.th ?? obj.en ?? [];
  }
  return [];
}

export type VideoSource =
  | { kind: "upload"; url: string }
  | { kind: "youtube"; videoId: string }
  | { kind: "facebook"; url: string; isReel?: boolean }
  | { kind: "tiktok"; videoId: string; url: string };

export type NewsDoc = {
  id: string;
  date: string; // stored as ISO "yyyy-mm-dd"; formatted on read
  category?: string; // key referencing a newsCategories doc
  title: string;
  image: string;
  body: string; // rich text editor HTML, sanitized before render
  createdAt?: number;
  deleted?: boolean;
};

export type NewsCategoryDoc = {
  id: string;
  key: string;
  label: string;
  order?: number;
  deleted?: boolean;
};

// Shape handed to the public news pages after picking a locale.
export type CmsNewsItem = {
  id: string;
  date: string;
  category: string;
  title: string;
  image: string;
  bodyHtml: string;
};
