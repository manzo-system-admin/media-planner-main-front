import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { pick, type Localized } from "./types";
import type { Locale } from "@/lib/i18n/config";
import type { SocialLink } from "@/lib/dictionaries/types";

const DOC_ID = "config";

export type SiteSettingsDoc = {
  address: Localized;
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

export async function getSiteSettings(locale: Locale): Promise<SiteSettings | null> {
  const snapshot = await getAdminDb().collection("siteSettings").doc(DOC_ID).get();
  if (!snapshot.exists) return null;
  const data = snapshot.data() as SiteSettingsDoc;
  return {
    address: pick(data.address, locale),
    phone: data.phone,
    email: data.email,
    socialLinks: data.socialLinks ?? [],
    mapLat: data.mapLat,
    mapLng: data.mapLng,
  };
}

export { DOC_ID as SITE_SETTINGS_DOC_ID };
