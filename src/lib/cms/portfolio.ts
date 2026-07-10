import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { pick, type Localized } from "./types";
import type { Locale } from "@/lib/i18n/config";
import type { PortfolioCategory, PortfolioItem, PortfolioStat } from "@/lib/dictionaries/types";

export type PortfolioStatDoc = { label: Localized; value: Localized };

export type PortfolioDoc = {
  id: string;
  slug: string;
  category: PortfolioCategory;
  image: string;
  order?: number;
  client: Localized;
  title: Localized;
  challenge: Localized;
  approach: Localized;
  result: Localized;
  stats: PortfolioStatDoc[];
  deleted?: boolean;
};

export type PortfolioCategoryDoc = {
  id: string;
  key: PortfolioCategory;
  label: Localized;
  order?: number;
  deleted?: boolean;
};

function toItem(id: string, data: FirebaseFirestore.DocumentData, locale: Locale): PortfolioItem {
  const doc = data as Omit<PortfolioDoc, "id">;
  const stats: PortfolioStat[] = (doc.stats ?? []).map((stat) => ({
    label: pick(stat.label, locale),
    value: pick(stat.value, locale),
  }));
  return {
    slug: doc.slug,
    category: doc.category,
    title: pick(doc.title, locale),
    image: doc.image,
    client: pick(doc.client, locale),
    challenge: pick(doc.challenge, locale),
    approach: pick(doc.approach, locale),
    result: pick(doc.result, locale),
    stats,
  };
}

export async function getPortfolioList(locale: Locale): Promise<PortfolioItem[]> {
  const snapshot = await getAdminDb().collection("portfolio").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => toItem(doc.id, doc.data(), locale));
}

export async function getPortfolioBySlug(locale: Locale, slug: string): Promise<PortfolioItem | null> {
  const snapshot = await getAdminDb().collection("portfolio").where("slug", "==", slug).limit(1).get();
  const doc = snapshot.docs[0];
  if (!doc || doc.data().deleted) return null;
  return toItem(doc.id, doc.data(), locale);
}

export async function getPortfolioCategoryLabels(
  locale: Locale
): Promise<Record<PortfolioCategory, string>> {
  const snapshot = await getAdminDb().collection("portfolioCategories").orderBy("order", "asc").get();
  const labels = {} as Record<PortfolioCategory, string>;
  snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .forEach((doc) => {
      const data = doc.data() as Omit<PortfolioCategoryDoc, "id">;
      labels[data.key] = pick(data.label, locale);
    });
  return labels;
}

export async function getPortfolioCategories(
  locale: Locale
): Promise<{ key: string; label: string }[]> {
  const snapshot = await getAdminDb().collection("portfolioCategories").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<PortfolioCategoryDoc, "id">;
      return { key: data.key, label: pick(data.label, locale) };
    });
}
