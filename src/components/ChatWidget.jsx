import { useEffect } from "react";
import { useI18n } from "../context/I18nContext";
import { resolveLocale } from "../lib/siteLocales";

// The MoMicro chat widget, shown across the whole app — public marketing
// pages as well as the authenticated dashboard (chatbots, chats, settings, …).
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
  const { language } = useI18n();

  useEffect(() => {
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
  }, [language]);

  // Full teardown if the app unmounts.
  useEffect(() => removeWidget, []);

  return null;
};
