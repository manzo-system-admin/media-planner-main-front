import "server-only";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "./types";
import th from "./th";
import en from "./en";

const dictionaries: Record<Locale, Dictionary> = { th, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary } from "./types";
export * from "./types";
