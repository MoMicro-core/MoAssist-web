import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../context/I18nContext";
import { buildLocalizedPath } from "../lib/siteLocales";

// Canonical (locale-less) path for every public route key used across the site.
export const SITE_ROUTES = {
  home: "/",
  how: "/how-it-works",
  chatbot: "/ai-chatbot",
  platform: "/platform",
  pricing: "/pricing",
  news: "/news",
  docs: "/docs",
  contact: "/contact",
  login: "/login",
  privacy: "/privacy-policy",
  terms: "/terms-and-conditions",
  imprint: "/imprint",
};

// The top-nav order (left cluster). Footer/CTA links reference keys directly.
export const NAV_KEYS = ["home", "how", "chatbot", "platform", "pricing", "news", "docs"];

// Returns helpers that keep the active locale prefix on every internal link.
export const useSiteNav = () => {
  const navigate = useNavigate();
  const { language } = useI18n();

  const path = useCallback(
    (key) => buildLocalizedPath(SITE_ROUTES[key] || key, language),
    [language],
  );

  const go = useCallback(
    (key) => {
      navigate(path(key));
      window.scrollTo(0, 0);
    },
    [navigate, path],
  );

  return { path, go };
};
