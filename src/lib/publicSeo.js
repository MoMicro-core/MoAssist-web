import { useEffect } from "react";
import { COMPANY_INFO } from "./companyInfo";
import {
  DEFAULT_LOCALE_KEY,
  SITE_LOCALES,
  buildLocaleUrl,
} from "./siteLocales";

const upsertMeta = (attribute, key, content) => {
  if (!content) {
    return;
  }

  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const upsertLink = (rel, href) => {
  let link = document.head.querySelector(`link[rel="${rel}"]`);

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
};

const replaceAlternateLinks = (origin, pathname = "/") => {
  document.head
    .querySelectorAll('link[rel="alternate"][data-moassist-locale="true"]')
    .forEach((node) => node.remove());

  const xDefaultLink = document.createElement("link");
  xDefaultLink.setAttribute("rel", "alternate");
  xDefaultLink.setAttribute("hreflang", "x-default");
  xDefaultLink.setAttribute(
    "href",
    buildLocaleUrl(origin, pathname, DEFAULT_LOCALE_KEY),
  );
  xDefaultLink.dataset.moassistLocale = "true";
  document.head.appendChild(xDefaultLink);

  SITE_LOCALES.forEach((locale) => {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", locale.hreflang);
    link.setAttribute("href", buildLocaleUrl(origin, pathname, locale.key));
    link.dataset.moassistLocale = "true";
    document.head.appendChild(link);
  });
};

const replaceAlternateOgLocales = (activeLocale) => {
  document.head
    .querySelectorAll(
      'meta[property="og:locale:alternate"][data-moassist-locale="true"]',
    )
    .forEach((node) => node.remove());

  SITE_LOCALES.filter((locale) => locale.key !== activeLocale.key).forEach(
    (locale) => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:locale:alternate");
      meta.setAttribute("content", locale.ogLocale);
      meta.dataset.moassistLocale = "true";
      document.head.appendChild(meta);
    },
  );
};

const replacePreloadImages = (sources = []) => {
  document.head
    .querySelectorAll('link[rel="preload"][data-moassist-preload="image"]')
    .forEach((node) => node.remove());

  sources
    .filter((src) => typeof src === "string" && src.length > 0)
    .forEach((src) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "preload");
      link.setAttribute("as", "image");
      link.setAttribute("href", src);
      link.setAttribute("fetchpriority", "high");
      link.dataset.moassistPreload = "image";
      document.head.appendChild(link);
    });
};

export const usePublicSeo = ({
  localeConfig,
  seo,
  pathname = "/",
  siteName = "MoAssist",
  ogImagePath = "/preview/logo.svg",
  preloadImages = [],
}) => {
  useEffect(() => {
    if (!localeConfig || !seo) {
      return;
    }

    document.documentElement.lang = localeConfig.htmlLang;
    document.title = seo.title;
    replacePreloadImages(preloadImages);

    upsertMeta("name", "description", seo.description);
    upsertMeta("name", "keywords", seo.keywords);
    upsertMeta("name", "application-name", siteName);
    upsertMeta("name", "language", localeConfig.languageName);
    upsertMeta("name", "author", COMPANY_INFO.organizationName);
    upsertMeta("name", "publisher", COMPANY_INFO.organizationName);
    upsertMeta("name", "creator", COMPANY_INFO.organizationName);
    upsertMeta("name", "theme-color", "#f4fbff");
    upsertMeta("name", "apple-mobile-web-app-title", siteName);
    upsertMeta("name", "referrer", "strict-origin-when-cross-origin");
    upsertMeta("name", "robots", seo.robots || "index,follow");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta(
      "name",
      "twitter:description",
      seo.twitterDescription || seo.description,
    );
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.ogDescription || seo.description);
    upsertMeta("property", "og:type", seo.ogType || "website");
    upsertMeta("property", "og:locale", localeConfig.ogLocale);
    upsertMeta("property", "og:site_name", siteName);

    if (window.location?.origin) {
      const canonicalUrl = buildLocaleUrl(
        window.location.origin,
        pathname,
        localeConfig.key,
      );
      const imageUrl = new URL(ogImagePath, window.location.origin).toString();

      upsertMeta("property", "og:url", canonicalUrl);
      upsertMeta("property", "og:image", imageUrl);
      upsertMeta("property", "og:image:alt", seo.imageAlt || `${siteName} logo`);
      upsertMeta("property", "og:image:type", "image/svg+xml");
      upsertMeta("name", "twitter:image", imageUrl);
      upsertLink("canonical", canonicalUrl);
      replaceAlternateLinks(window.location.origin, pathname);
      replaceAlternateOgLocales(localeConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localeConfig, ogImagePath, pathname, seo, siteName, preloadImages.join("|")]);
};
