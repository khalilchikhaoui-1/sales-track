import { getLocales } from "expo-localization";
import { I18n, TranslateOptions } from "i18n-js";

import de from "./locales/de.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

export const i18n = new I18n({
  en,
  de,
  fr,
});

// Safety: fall back to English if a key is missing
i18n.enableFallback = true;
i18n.defaultLocale = "fr";

// Choose a sensible locale from device settings
const deviceTag = getLocales()[0]?.languageTag ?? "en-US";
const normalized = deviceTag.split("-")[0];
i18n.locale = normalized;

//  helper to change language at runtime 
export function setLocale(locale: string) {
  i18n.locale = locale;
}

export function t(key: string, options?: TranslateOptions): string {
  return i18n.t(key, options);
}