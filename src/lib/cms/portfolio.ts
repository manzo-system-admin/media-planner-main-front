import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { toText } from "./types";
import type { PortfolioItem, PortfolioStat } from "@/lib/dictionaries/types";

export type PortfolioStatDoc = { label: string; value: string };

export type PortfolioDoc = {
  id: string;
  clientId?: string;
  /** First entry is the cover image shown on list cards. */
  images: string[];
  order?: number;
  title: string;
  /** Thai-only rich-text HTML; no English counterpart by design. */
  description?: string;
  stats: PortfolioStatDoc[];
  deleted?: boolean;
};

async function getClientNamesById(): Promise<Record<string, string>> {
  const snapshot = await getAdminDb().collection("clients").get();
  const map: Record<string, string> = {};
  snapshot.docs.forEach((doc) => {
    if (!doc.data().deleted) map[doc.id] = doc.data().name ?? "";
  });
  return map;
}

function toItem(
  id: string,
  data: FirebaseFirestore.DocumentData,
  clientNamesById: Record<string, string>
): PortfolioItem {
  const doc = data as Omit<PortfolioDoc, "id">;
  const stats: PortfolioStat[] = (doc.stats ?? []).map((stat) => ({
    label: toText(stat.label),
    value: toText(stat.value),
  }));
  const images = doc.images ?? [];
  return {
    id,
    clientId: doc.clientId ?? "",
    client: doc.clientId ? (clientNamesById[doc.clientId] ?? "") : "",
    title: toText(doc.title),
    image: images[0] ?? "",
    images,
    description: doc.description ?? "",
    stats,
  };
}

export async function getPortfolioList(): Promise<PortfolioItem[]> {
  const [snapshot, clientNamesById] = await Promise.all([
    getAdminDb().collection("portfolio").orderBy("order", "asc").get(),
    getClientNamesById(),
  ]);
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => toItem(doc.id, doc.data(), clientNamesById));
}

export async function getPortfolioById(id: string): Promise<PortfolioItem | null> {
  const [doc, clientNamesById] = await Promise.all([
    getAdminDb().collection("portfolio").doc(id).get(),
    getClientNamesById(),
  ]);
  if (!doc.exists || doc.data()?.deleted) return null;
  return toItem(doc.id, doc.data()!, clientNamesById);
}
