import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { pick, type CmsNewsItem, type NewsDoc } from "./types";
import type { Locale } from "@/lib/i18n/config";

function toCmsItem(id: string, data: FirebaseFirestore.DocumentData, locale: Locale): CmsNewsItem {
  const doc = data as Omit<NewsDoc, "id">;
  return {
    id,
    slug: doc.slug,
    date: doc.date,
    title: pick(doc.title, locale),
    image: doc.image,
    excerpt: pick(doc.excerpt, locale),
    bodyHtml: pick(doc.body, locale),
  };
}

export async function getNewsList(locale: Locale, max = 50): Promise<CmsNewsItem[]> {
  const snapshot = await getAdminDb()
    .collection("news")
    .orderBy("createdAt", "desc")
    .limit(max)
    .get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => toCmsItem(doc.id, doc.data(), locale));
}

export async function getNewsBySlug(locale: Locale, slug: string): Promise<CmsNewsItem | null> {
  const snapshot = await getAdminDb().collection("news").where("slug", "==", slug).limit(1).get();
  const doc = snapshot.docs[0];
  if (!doc || doc.data().deleted) return null;
  return toCmsItem(doc.id, doc.data(), locale);
}
