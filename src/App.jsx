import { Fragment, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Loading } from "./components/Loading";
import { PUBLIC_LOCALE_KEYS } from "./lib/siteLocales";

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
const Landing = lazy(() =>
  import("./pages/Landing").then((module) => ({ default: module.Landing })),
);
const Pricing = lazy(() =>
  import("./pages/Pricing").then((module) => ({ default: module.Pricing })),
);
const Contacts = lazy(() =>
  import("./pages/Contacts").then((module) => ({ default: module.Contacts })),
);
const MoMicro = lazy(() =>
  import("./pages/MoMicro").then((module) => ({ default: module.MoMicro })),
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

const RequireAuth = ({ children }) => {
  const { user, ready } = useAuth();
  if (!ready) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/contants" element={<Navigate to="/contacts" replace />} />
        <Route path="/momicro" element={<MoMicro />} />
        {PUBLIC_LOCALE_KEYS.map((locale) => (
          <Fragment key={locale}>
            <Route path={`/${locale}`} element={<Landing />} />
            <Route path={`/${locale}/pricing`} element={<Pricing />} />
            <Route path={`/${locale}/contacts`} element={<Contacts />} />
            <Route
              path={`/${locale}/privacy-policy`}
              element={<PrivacyPolicy />}
            />
            <Route path={`/${locale}/imprint`} element={<Imprint />} />
            <Route
              path={`/${locale}/terms-and-conditions`}
              element={<TermsConditions />}
            />
            <Route
              path={`/${locale}/contants`}
              element={<Navigate to={`/${locale}/contacts`} replace />}
            />
            <Route path={`/${locale}/momicro`} element={<MoMicro />} />
          </Fragment>
        ))}
        <Route path="/at" element={<Navigate to="/de" replace />} />
        <Route path="/gr" element={<Navigate to="/" replace />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/imprint" element={<Imprint />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/login" element={<Login />} />
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
    </Suspense>
  );
}
