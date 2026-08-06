import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { toText } from "./types";

const DOC_ID = "config";

export type AboutContentDoc = {
  visionBody: string;
  missionBody: string;
  historyBody: string;
  historyImage: string;
};

export type AboutContent = {
  visionBody: string;
  missionBody: string;
  historyBody: string;
  historyImage: string;
};

export async function getAboutContent(): Promise<AboutContent | null> {
  const snapshot = await getAdminDb().collection("aboutContent").doc(DOC_ID).get();
  if (!snapshot.exists) return null;
  const data = snapshot.data() as AboutContentDoc;
  return {
    visionBody: toText(data.visionBody),
    missionBody: toText(data.missionBody),
    historyBody: toText(data.historyBody),
    historyImage: data.historyImage,
  };
}

export { DOC_ID as ABOUT_CONTENT_DOC_ID };
