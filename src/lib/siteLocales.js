export const DEFAULT_LOCALE_KEY = "en";

export const SITE_LOCALES = [
  {
    key: "en",
    label: "🇬🇧",
    dictionaryKey: "en",
    htmlLang: "en",
    hreflang: "en",
    ogLocale: "en_US",
    languageName: "English",
    aliases: ["en", "en-us", "en-gb", "english"],
  },
  {
    key: "de",
    label: "🇩🇪",
    dictionaryKey: "de",
    htmlLang: "de-DE",
    hreflang: "de-DE",
    ogLocale: "de_DE",
    languageName: "German",
    aliases: ["de", "at", "de-de", "de-at", "german"],
  },
  {
    key: "es",
    label: "🇪🇸",
    dictionaryKey: "es",
    htmlLang: "es-ES",
    hreflang: "es-ES",
    ogLocale: "es_ES",
    languageName: "Spanish",
    aliases: ["es", "es-es", "spanish"],
  },
  {
    key: "fr",
    label: "🇫🇷",
    dictionaryKey: "fr",
    htmlLang: "fr-FR",
    hreflang: "fr-FR",
    ogLocale: "fr_FR",
    languageName: "French",
    aliases: ["fr", "fr-fr", "french"],
  },
  {
    key: "it",
    label: "🇮🇹",
    dictionaryKey: "it",
    htmlLang: "it-IT",
    hreflang: "it-IT",
    ogLocale: "it_IT",
    languageName: "Italian",
    aliases: ["it", "it-it", "italian"],
  },
  {
    key: "ru",
    label: "🇷🇺",
    dictionaryKey: "ru",
    htmlLang: "ru-RU",
    hreflang: "ru-RU",
    ogLocale: "ru_RU",
    languageName: "Russian",
    aliases: ["ru", "ru-ru", "russian"],
  },
  {
    key: "ua",
    label: "🇺🇦",
    dictionaryKey: "ua",
    htmlLang: "uk-UA",
    hreflang: "uk-UA",
    ogLocale: "uk_UA",
    languageName: "Ukrainian",
    aliases: ["ua", "uk", "uk-ua", "ukrainian"],
  },
];

const localeLookup = new Map();

SITE_LOCALES.forEach((locale) => {
  localeLookup.set(locale.key, locale);
  locale.aliases.forEach((alias) => localeLookup.set(alias, locale));
});

export const LANGUAGE_OPTIONS = SITE_LOCALES.map(({ key, label }) => ({
  key,
  label,
}));

export const PUBLIC_LOCALE_KEYS = SITE_LOCALES.map(({ key }) => key).filter(
  (key) => key !== DEFAULT_LOCALE_KEY,
);

export const resolveLocale = (value) => {
  if (!value) {
    return SITE_LOCALES[0];
  }

  return localeLookup.get(String(value).trim().toLowerCase()) || SITE_LOCALES[0];
};

export const readLocaleFromSearch = (search = "") => {
  const params = new URLSearchParams(search);
  return resolveLocale(params.get("lang"));
};

export const readLocaleFromPathname = (pathname = "/") => {
  const [firstSegment] = String(pathname)
    .split("/")
    .filter(Boolean);

  if (!firstSegment) {
    return resolveLocale(DEFAULT_LOCALE_KEY);
  }

  const locale = resolveLocale(firstSegment);

  return locale.key === firstSegment ? locale : null;
};

export const stripLocalePrefix = (pathname = "/") => {
  const locale = readLocaleFromPathname(pathname);

  if (!locale || locale.key === DEFAULT_LOCALE_KEY) {
    return pathname || "/";
  }

  const segments = String(pathname)
    .split("/")
    .filter(Boolean)
    .slice(1);

  return segments.length ? `/${segments.join("/")}` : "/";
};

export const buildLocalizedPath = (pathname = "/", key = DEFAULT_LOCALE_KEY) => {
  const cleanPath = stripLocalePrefix(pathname) || "/";

  if (key === DEFAULT_LOCALE_KEY) {
    return cleanPath;
  }

  return cleanPath === "/" ? `/${key}` : `/${key}${cleanPath}`;
};

export const buildLocaleUrl = (
  origin,
  pathname = "/",
  key = DEFAULT_LOCALE_KEY,
) => new URL(buildLocalizedPath(pathname, key), origin).toString();

export const isPublicLandingPath = (pathname = "/") =>
  ["/", ...PUBLIC_LOCALE_KEYS.map((key) => `/${key}`)].includes(pathname);
