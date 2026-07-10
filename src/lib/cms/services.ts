import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { pick, type Localized } from "./types";
import type { Locale } from "@/lib/i18n/config";
import type { Service, GradientKey } from "@/lib/dictionaries/types";

// Services created before the `icon` field existed have no stored icon;
// map their known slugs to a sensible icon so they don't all fall back to the default.
const LEGACY_SLUG_ICONS: Record<string, string> = {
  "media-planning-buying": "target",
  "digital-social-media": "network",
  "creative-content-production": "play",
  "pr-event": "megaphone",
};

export type ServiceDoc = {
  id: string;
  slug: string;
  gradient: GradientKey;
  icon?: string;
  image: string;
  order?: number;
  title: Localized;
  summary: Localized;
  description: Localized;
  highlights: { th: string[]; en: string[] };
  deleted?: boolean;
};

function toService(id: string, data: FirebaseFirestore.DocumentData, locale: Locale): Service {
  const doc = data as Omit<ServiceDoc, "id">;
  return {
    slug: doc.slug,
    title: pick(doc.title, locale),
    summary: pick(doc.summary, locale),
    description: pick(doc.description, locale),
    gradient: doc.gradient,
    icon: doc.icon ?? LEGACY_SLUG_ICONS[doc.slug] ?? "star",
    image: doc.image,
    highlights: doc.highlights?.[locale] ?? [],
  };
}

export async function getServiceList(locale: Locale): Promise<Service[]> {
  const snapshot = await getAdminDb().collection("services").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => toService(doc.id, doc.data(), locale));
}

export async function getServiceBySlug(locale: Locale, slug: string): Promise<Service | null> {
  const snapshot = await getAdminDb().collection("services").where("slug", "==", slug).limit(1).get();
  const doc = snapshot.docs[0];
  if (!doc || doc.data().deleted) return null;
  return toService(doc.id, doc.data(), locale);
}
