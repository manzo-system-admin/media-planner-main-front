import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { toText, type CmsNewsItem, type NewsCategoryDoc, type NewsDoc } from "./types";
import type { Locale } from "@/lib/i18n/config";

function formatNewsDate(value: string, locale: Locale): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH-u-ca-buddhist" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function toCmsItem(id: string, data: FirebaseFirestore.DocumentData, locale: Locale): CmsNewsItem {
  const doc = data as Omit<NewsDoc, "id">;
  return {
    id,
    date: formatNewsDate(doc.date, locale),
    category: doc.category ?? "",
    title: toText(doc.title),
    image: doc.image,
    bodyHtml: toText(doc.body),
  };
}

export async function getNewsList(locale: Locale, max = 50): Promise<CmsNewsItem[]> {
  const snapshot = await getAdminDb()
    .collection("news")
    .orderBy("date", "desc")
    .limit(max)
    .get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .sort((a, b) => {
      // Firestore's orderBy leaves same-date articles in an arbitrary order —
      // break ties by creation time (newest first) for a stable, predictable list.
      const dateDiff = (b.data().date ?? "").localeCompare(a.data().date ?? "");
      if (dateDiff !== 0) return dateDiff;
      const aCreated = a.data().createdAt?.toMillis?.() ?? 0;
      const bCreated = b.data().createdAt?.toMillis?.() ?? 0;
      return bCreated - aCreated;
    })
    .map((doc) => toCmsItem(doc.id, doc.data(), locale));
}

export async function getNewsById(locale: Locale, id: string): Promise<CmsNewsItem | null> {
  const doc = await getAdminDb().collection("news").doc(id).get();
  if (!doc.exists || doc.data()?.deleted) return null;
  return toCmsItem(doc.id, doc.data()!, locale);
}

export async function getNewsCategories(): Promise<{ key: string; label: string }[]> {
  const snapshot = await getAdminDb().collection("newsCategories").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<NewsCategoryDoc, "id">;
      return { key: data.key, label: toText(data.label) };
    });
}

export async function getNewsCategoryLabels(): Promise<Record<string, string>> {
  const snapshot = await getAdminDb().collection("newsCategories").orderBy("order", "asc").get();
  const labels: Record<string, string> = {};
  snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .forEach((doc) => {
      const data = doc.data() as Omit<NewsCategoryDoc, "id">;
      labels[data.key] = toText(data.label);
    });
  return labels;
}
