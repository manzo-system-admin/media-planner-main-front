import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { pick, type Localized } from "./types";
import type { Locale } from "@/lib/i18n/config";

export type FaqDoc = {
  id: string;
  question: Localized;
  answer: Localized;
  tags?: string[];
  deleted?: boolean;
};

export async function getFaqList(locale: Locale): Promise<{ question: string; answer: string }[]> {
  const snapshot = await getAdminDb().collection("faq").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<FaqDoc, "id">;
      return { question: pick(data.question, locale), answer: pick(data.answer, locale) };
    });
}
