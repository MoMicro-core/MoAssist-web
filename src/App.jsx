import { lazy, Suspense } from "react";
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
        {PUBLIC_LOCALE_KEYS.map((locale) => (
          <Route key={locale} path={`/${locale}`} element={<Landing />} />
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
            <Route path="billing" element={<Billings />} />
            <Route path="plugin" element={<ChatbotPlugin />} />
          </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/support" element={<Support />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
