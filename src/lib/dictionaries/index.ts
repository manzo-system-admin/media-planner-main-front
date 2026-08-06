import "server-only";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "./types";
import th from "./th";

const dictionaries: Record<Locale, Dictionary> = { th };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary } from "./types";
export * from "./types";
