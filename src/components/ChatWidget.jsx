import { useEffect } from "react";
import { useI18n } from "../context/I18nContext";
import { resolveLocale } from "../lib/siteLocales";

// The widget itself is bootstrapped from index.html, before and independently
// of this bundle, so it appears even if React is slow or fails to mount. This
// component's only job is to keep its language in sync with client-side
// navigation between locale-prefixed routes.
const CHATBOT_ID = "f5a65979-17c3-4935-8b6d-1c6e794a8aed";
const WIDGET_ELEMENT_ID = `momicro-assist-${CHATBOT_ID}`;
const SCRIPT_ID = `momicro-assist-script-${CHATBOT_ID}`;

const apiHost = () =>
  window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://api.momicro.com";

export const ChatWidget = () => {
  const { language } = useI18n();

  useEffect(() => {
    const langName = resolveLocale(language).languageName.toLowerCase();
    const existing = document.getElementById(SCRIPT_ID);

    // Already correct — the common case, since index.html reads the locale from
    // the URL on first load.
    if (existing && existing.dataset.lang === langName) return;

    // The widget bakes its language into the iframe at load time and its loader
    // bails out if the container already exists, so a language change means
    // removing both and re-injecting.
    document.getElementById(WIDGET_ELEMENT_ID)?.remove();
    existing?.remove();

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.defer = true;
    script.dataset.lang = langName;
    script.src = `${apiHost()}/chat/script/${CHATBOT_ID}?lang=${encodeURIComponent(
      langName,
    )}`;
    document.head.appendChild(script);
  }, [language]);

  return null;
};
