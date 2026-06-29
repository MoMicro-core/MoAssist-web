// Locale-independent tokens for the public site: brand names, product/integration
// names, code snippets, prices, demo identifiers, dates. These read the same in
// every language, so they live here once instead of being duplicated per locale.

export const BRAND = {
  name: "MoMicro",
  badge: "AI AGENT",
  logo: "/preview/logo-opt.png",
  logoWebp: "/preview/logo.webp",
};

// Plan prices (currency-neutral, shown verbatim everywhere).
export const PRICES = {
  free: "$0",
  connected: "$20",
  ai: "$50",
};

// Pre-built connectors shown on the Platform page.
export const INTEGRATIONS = [
  "Shopify",
  "WooCommerce",
  "Order DB (SQL)",
  "Shipping APIs",
  "Stripe",
  "HubSpot CRM",
  "Custom ERP",
  "Zendesk",
  "Any REST API",
];

// Systems the agent can reach (Platform "any API" diagram + home diff card).
export const API_NODES = [
  "Order DB",
  "Shipping API",
  "ERP",
  "CRM",
  "Payments",
  "Email",
];

// Uploaded knowledge files shown in the AI Chatbot upload mock.
export const CHATBOT_FILES = [
  { name: "returns-policy.pdf", indexed: true },
  { name: "shipping-faq.docx", indexed: true },
  { name: "product-guide.pdf", indexed: true },
  { name: "store-hours.txt", indexed: false },
];

export const HOME_TAB_FILES = [
  "returns-policy.pdf",
  "shipping-faq.docx",
  "product-guide.pdf",
  "store-hours.txt",
];

// News posts — category, date and cover image are universal; titles/excerpts
// are localized and merged in by locale (matched on `id`).
const UNSPLASH = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

export const NEWS_POSTS = [
  { id: "email-e2e", cat: "Product", date: "Jun 24, 2026", read: "4 min", image: UNSPLASH("1596526131083-e8c633c948d2") },
  { id: "rest-api", cat: "Product", date: "Jun 18, 2026", read: "3 min", image: UNSPLASH("1555066931-4365d14bab8c") },
  // Product Hunt brand mark — shown "contain" on a tinted backdrop so the logo isn't cropped.
  { id: "producthunt", cat: "Company", date: "Jun 12, 2026", read: "2 min", image: "/preview/producthunt.png", fit: "contain", bg: "#fff3ee" },
];

// Category accent colors (used on News cards).
export const NEWS_CAT_TONE = {
  Product: { tagColor: "#0a7bb5", tagBg: "#eaf7fa" },
  Engineering: { tagColor: "#1f8a5b", tagBg: "#e6f6ee" },
  Company: { tagColor: "#9a5b1f", tagBg: "#fbf0e2" },
};

// Build the real widget embed snippets shown on the Docs page. `apiBaseUrl` is
// the backend origin; `chatbotId` is a placeholder the user swaps for their own.
export const buildWidgetSnippets = (apiBaseUrl, chatbotId = "YOUR_CHATBOT_ID", lang = "en") => {
  const base = (apiBaseUrl || "https://api.momicro.com").replace(/\/$/, "");
  return {
    script: `<script src="${base}/chat/script/${chatbotId}?lang=${lang}" defer></script>`,
    iframe: `<iframe src="${base}/chat/iframe/${chatbotId}?lang=${lang}" title="MoMicro Agent" style="width:420px;height:680px;border:0;"></iframe>`,
    auth: `<script>
window.MOMICRO_ASSIST_CONFIG = {
  "${chatbotId}": { authClient: window.websiteSession.userId }
};
</script>`,
    dashboardScript: `<script src="${base}/chat/dashboard/script/${chatbotId}" defer></script>`,
    dashboardIframe: `<iframe src="${base}/chat/dashboard/iframe/${chatbotId}" title="MoMicro Dashboard" style="width:100%;height:760px;border:0;"></iframe>`,
  };
};
