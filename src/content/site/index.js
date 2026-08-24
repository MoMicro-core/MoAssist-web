// Resolves the localized public-site content for the active language.
// Each locale mirrors the shape of en.js; any missing key deep-falls back to
// English so the page never renders an empty string.
//
// English is bundled with the app because it is the default and the fallback
// for every other locale. The other six are dynamic imports, so an English
// visitor no longer downloads ~250KB of Russian, Ukrainian, German, Spanish,
// French and Italian copy inside the main chunk.

import en from "./en";

const LOADERS = {
  de: () => import("./de"),
  es: () => import("./es"),
  fr: () => import("./fr"),
  it: () => import("./it"),
  ru: () => import("./ru"),
  ua: () => import("./ua"),
};

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

const cache = { en };
const inFlight = {};

// Async: fetches the locale chunk and caches the merged result. Call this
// before rendering so `getSiteContent` below can stay synchronous.
export const loadSiteContent = async (language = "en") => {
  const key = LOADERS[language] ? language : "en";
  if (cache[key]) return cache[key];
  if (!inFlight[key]) {
    inFlight[key] = LOADERS[key]()
      .then((module) => {
        cache[key] = deepMerge(en, module.default);
        return cache[key];
      })
      .catch(() => en);
  }
  return inFlight[key];
};

// Sync: returns the locale if it has been loaded, English otherwise. Callers
// render immediately and re-render once the chunk lands.
export const getSiteContent = (language = "en") => cache[language] || en;
