import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "../context/I18nContext";
import { isPublicLandingPath, resolveLocale } from "../lib/siteLocales";

// The MoAssist chat widget that greets visitors on the public marketing site.
// It is intentionally NOT shown inside the authenticated app (dashboard, chats,
// settings, …) — only on public landing pages.
const CHATBOT_ID = "f5a65979-17c3-4935-8b6d-1c6e794a8aed";
const WIDGET_ELEMENT_ID = `momicro-assist-${CHATBOT_ID}`;
const SCRIPT_ID = `momicro-assist-script-${CHATBOT_ID}`;

// The widget bakes its language into the iframe at load time via the script's
// `?lang=` query param, and its loader is idempotent (it bails out if its
// container already exists). So to change language we must remove both the
// container and the script, then re-inject with the new language.
const removeWidget = () => {
  document.getElementById(WIDGET_ELEMENT_ID)?.remove();
  document.getElementById(SCRIPT_ID)?.remove();
};

export const ChatWidget = () => {
  const location = useLocation();
  const { language } = useI18n();

  useEffect(() => {
    // Hide the widget everywhere except the public marketing pages.
    if (!isPublicLandingPath(location.pathname)) {
      removeWidget();
      return;
    }

    // The active language is derived from the URL by I18nProvider; map the
    // locale to the language name the widget expects (e.g. "english").
    const langName = resolveLocale(language).languageName.toLowerCase();

    // Already showing the widget in the correct language — nothing to do.
    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript && existingScript.dataset.lang === langName) {
      return;
    }

    // (Re)inject with the current language.
    removeWidget();

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://api.momicro.com/chat/script/${CHATBOT_ID}?lang=${encodeURIComponent(
      langName,
    )}`;
    script.defer = true;
    script.dataset.lang = langName;
    document.body.appendChild(script);
  }, [location.pathname, language]);

  // Full teardown if the app unmounts.
  useEffect(() => removeWidget, []);

  return null;
};
