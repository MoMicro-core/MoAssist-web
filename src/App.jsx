import { Fragment, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Loading } from "./components/Loading";
import { CookieBanner } from "./components/CookieBanner";
import { ChatWidget } from "./components/ChatWidget";
import { PUBLIC_LOCALE_KEYS } from "./lib/siteLocales";
// Home is eager (above-the-fold, LCP). Every other public page is lazy-loaded.
import { SiteHome } from "./pages/SiteHome";

const SiteHow = lazy(() => import("./pages/SiteHow").then((m) => ({ default: m.SiteHow })));
const SiteChatbot = lazy(() => import("./pages/SiteChatbot").then((m) => ({ default: m.SiteChatbot })));
const SitePlatform = lazy(() => import("./pages/SitePlatform").then((m) => ({ default: m.SitePlatform })));
const SitePricing = lazy(() => import("./pages/SitePricing").then((m) => ({ default: m.SitePricing })));
const SiteNews = lazy(() => import("./pages/SiteNews").then((m) => ({ default: m.SiteNews })));
const SiteDocs = lazy(() => import("./pages/SiteDocs").then((m) => ({ default: m.SiteDocs })));
const SiteContact = lazy(() => import("./pages/SiteContact").then((m) => ({ default: m.SiteContact })));

const AuthenticatedLayout = lazy(() =>
  import("./layouts/AuthenticatedLayout").then((module) => ({
    default: module.AuthenticatedLayout,
  })),
);
const ChatbotLayout = lazy(() =>
  import("./layouts/ChatbotLayout").then((module) => ({
    default: module.ChatbotLayout,
  })),
);
const Chatbots = lazy(() =>
  import("./pages/Chatbots").then((module) => ({ default: module.Chatbots })),
);
const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login })),
);
const Profile = lazy(() =>
  import("./pages/Profile").then((module) => ({ default: module.Profile })),
);
const Settings = lazy(() =>
  import("./pages/Settings").then((module) => ({ default: module.Settings })),
);
const Support = lazy(() =>
  import("./pages/Support").then((module) => ({ default: module.Support })),
);
const ChatbotDashboard = lazy(() =>
  import("./pages/ChatbotDashboard").then((module) => ({
    default: module.ChatbotDashboard,
  })),
);
const ChatbotChats = lazy(() =>
  import("./pages/ChatbotChats").then((module) => ({
    default: module.ChatbotChats,
  })),
);
const ChatbotSettings = lazy(() =>
  import("./pages/ChatbotSettings").then((module) => ({
    default: module.ChatbotSettings,
  })),
);
const ChatbotAppearance = lazy(() =>
  import("./pages/ChatbotAppearance").then((module) => ({
    default: module.ChatbotAppearance,
  })),
);
const ChatbotPlugin = lazy(() =>
  import("./pages/ChatbotPlugin").then((module) => ({
    default: module.ChatbotPlugin,
  })),
);
const NotFound = lazy(() =>
  import("./pages/NotFound").then((module) => ({ default: module.NotFound })),
);
const Chats = lazy(() =>
  import("./pages/Chats").then((module) => ({ default: module.Chats })),
);
const Billings = lazy(() =>
  import("./pages/Billings").then((module) => ({ default: module.Billings })),
);
const PrivacyPolicy = lazy(() =>
  import("./pages/PrivacyPolicy").then((module) => ({
    default: module.PrivacyPolicy,
  })),
);
const Imprint = lazy(() =>
  import("./pages/Imprint").then((module) => ({ default: module.Imprint })),
);
const TermsConditions = lazy(() =>
  import("./pages/TermsConditions").then((module) => ({
    default: module.TermsConditions,
  })),
);
const BillingSuccess = lazy(() =>
  import("./pages/BillingSuccess").then((module) => ({
    default: module.BillingSuccess,
  })),
);
const BillingFailure = lazy(() =>
  import("./pages/BillingFailure").then((module) => ({
    default: module.BillingFailure,
  })),
);

const RequireAuth = ({ children }) => {
  const { user, ready } = useAuth();
  if (!ready) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Public marketing pages, rendered once for the default locale and again under
// every locale prefix (/de, /es, …). Legal pages stay locale-prefixed too.
const PUBLIC_PAGES = [
  { path: "", element: <SiteHome /> },
  { path: "how-it-works", element: <SiteHow /> },
  { path: "ai-chatbot", element: <SiteChatbot /> },
  { path: "platform", element: <SitePlatform /> },
  { path: "pricing", element: <SitePricing /> },
  { path: "news", element: <SiteNews /> },
  { path: "docs", element: <SiteDocs /> },
  { path: "contact", element: <SiteContact /> },
  { path: "privacy-policy", element: <PrivacyPolicy /> },
  { path: "imprint", element: <Imprint /> },
  { path: "terms-and-conditions", element: <TermsConditions /> },
];

const renderPublicRoutes = (prefix = "") =>
  PUBLIC_PAGES.map(({ path, element }) => {
    const full = prefix ? `/${prefix}${path ? `/${path}` : ""}` : `/${path}`;
    return <Route key={full || "/"} path={full || "/"} element={element} />;
  });

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {renderPublicRoutes()}
        {PUBLIC_LOCALE_KEYS.map((locale) => (
          <Fragment key={locale}>{renderPublicRoutes(locale)}</Fragment>
        ))}

        {/* Legacy URL redirects → preserve any inbound links/SEO. */}
        <Route path="/contacts" element={<Navigate to="/contact" replace />} />
        <Route path="/momicro" element={<Navigate to="/platform" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/billing/success" element={<BillingSuccess />} />
        <Route path="/billing/failure" element={<BillingFailure />} />
        <Route
          element={
            <RequireAuth>
              <AuthenticatedLayout />
            </RequireAuth>
          }
        >
          <Route path="/chatbots" element={<Chatbots />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/billings" element={<Billings />} />
          <Route path="/chatbots/:chatbotId" element={<ChatbotLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ChatbotDashboard />} />
            <Route path="chats" element={<ChatbotChats />} />
            <Route path="settings" element={<ChatbotSettings />} />
            <Route path="appearance" element={<ChatbotAppearance />} />
            <Route path="billing" element={<Billings />} />
            <Route path="plugin" element={<ChatbotPlugin />} />
          </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieBanner />
      <ChatWidget />
    </Suspense>
  );
}
