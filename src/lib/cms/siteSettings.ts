import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { toText } from "./types";
import type { SocialLink } from "@/lib/dictionaries/types";

const DOC_ID = "config";

export type SiteSettingsDoc = {
  address: string;
  phone: string;
  email: string;
  socialLinks: SocialLink[];
  mapLat?: number;
  mapLng?: number;
};

export type SiteSettings = {
  address: string;
  phone: string;
  email: string;
  socialLinks: SocialLink[];
  mapLat?: number;
  mapLng?: number;
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const snapshot = await getAdminDb().collection("siteSettings").doc(DOC_ID).get();
  if (!snapshot.exists) return null;
  const data = snapshot.data() as SiteSettingsDoc;
  return {
    address: toText(data.address),
    phone: data.phone,
    email: data.email,
    socialLinks: data.socialLinks ?? [],
    mapLat: data.mapLat,
    mapLng: data.mapLng,
  };
}

export { DOC_ID as SITE_SETTINGS_DOC_ID };
