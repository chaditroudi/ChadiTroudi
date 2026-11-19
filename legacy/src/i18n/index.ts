export { default as en, type TranslationKeys } from "./en";
export { default as ar } from "./ar";
export { default as tn } from "./tn";
export { default as fr } from "./fr";

export const LANGS = ["en", "fr", "ar", "tn"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_META: Record<Lang, { label: string; flag: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", flag: "🇬🇧", dir: "ltr" },
  fr: { label: "Français", flag: "🇫🇷", dir: "ltr" },
  ar: { label: "العربية", flag: "🇸🇦", dir: "rtl" },
  tn: { label: "تونسي", flag: "🇹🇳", dir: "rtl" },
};
