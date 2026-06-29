// Resolves the localized public-site content for the active language.
// Each locale mirrors the shape of en.js; any missing key deep-falls back to
// English so the page never renders an empty string.

import en from "./en";
import de from "./de";
import es from "./es";
import fr from "./fr";
import it from "./it";
import ru from "./ru";
import ua from "./ua";

const LOCALES = { en, de, es, fr, it, ru, ua };

const isObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value);

// Deep-merge base (English) with the override (locale). Objects merge key by
// key; arrays and primitives are taken whole from the override when present.
const deepMerge = (base, override) => {
  if (override === undefined) return base;
  if (!isObject(base) || !isObject(override)) return override;
  const out = { ...base };
  for (const key of Object.keys(override)) {
    out[key] = deepMerge(base[key], override[key]);
  }
  return out;
};

const cache = {};

export const getSiteContent = (language = "en") => {
  const key = LOCALES[language] ? language : "en";
  if (!cache[key]) {
    cache[key] = key === "en" ? en : deepMerge(en, LOCALES[key]);
  }
  return cache[key];
};
