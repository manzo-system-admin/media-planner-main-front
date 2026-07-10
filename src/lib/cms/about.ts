import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { pick, type Localized } from "./types";
import type { Locale } from "@/lib/i18n/config";

const DOC_ID = "config";

export type AboutContentDoc = {
  visionBody: Localized;
  missionBody: Localized;
  historyBody: Localized;
  historyImage: string;
};

export type AboutContent = {
  visionBody: string;
  missionBody: string;
  historyBody: string;
  historyImage: string;
};

export async function getAboutContent(locale: Locale): Promise<AboutContent | null> {
  const snapshot = await getAdminDb().collection("aboutContent").doc(DOC_ID).get();
  if (!snapshot.exists) return null;
  const data = snapshot.data() as AboutContentDoc;
  return {
    visionBody: pick(data.visionBody, locale),
    missionBody: pick(data.missionBody, locale),
    historyBody: pick(data.historyBody, locale),
    historyImage: data.historyImage,
  };
}

export { DOC_ID as ABOUT_CONTENT_DOC_ID };
