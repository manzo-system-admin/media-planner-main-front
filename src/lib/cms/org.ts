import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { pick, type Localized } from "./types";
import type { Locale } from "@/lib/i18n/config";
import type { TeamMember } from "@/lib/dictionaries/types";

export type TeamMemberDoc = {
  id: string;
  name: Localized;
  role: Localized;
  avatar: string;
  order?: number;
  deleted?: boolean;
};

export type AwardDoc = {
  id: string;
  name: Localized;
  order?: number;
  deleted?: boolean;
};

export type ClientDoc = {
  id: string;
  name: string;
  logoUrl?: string;
  order?: number;
  deleted?: boolean;
};

export async function getTeamMembers(locale: Locale): Promise<TeamMember[]> {
  const snapshot = await getAdminDb().collection("team").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<TeamMemberDoc, "id">;
      return { name: pick(data.name, locale), role: pick(data.role, locale), avatar: data.avatar };
    });
}

export async function getAwards(locale: Locale): Promise<string[]> {
  const snapshot = await getAdminDb().collection("awards").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => pick((doc.data() as Omit<AwardDoc, "id">).name, locale));
}

export async function getClients(): Promise<{ name: string; logoUrl?: string }[]> {
  const snapshot = await getAdminDb().collection("clients").orderBy("order", "asc").get();
  return snapshot.docs
    .filter((doc) => !doc.data().deleted)
    .map((doc) => {
      const data = doc.data() as Omit<ClientDoc, "id">;
      return { name: data.name, logoUrl: data.logoUrl };
    });
}
