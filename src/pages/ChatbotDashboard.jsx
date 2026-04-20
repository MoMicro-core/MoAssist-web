import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AdjustmentsHorizontalIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../lib/api";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Loading } from "../components/Loading";
import { useI18n } from "../context/I18nContext";

const DASHBOARD_PREFS_PREFIX = "moassist-dashboard-prefs";

const defaultPreferences = {
  showMetrics: true,
  showRecent: true,
  showInsights: true,
  compactMode: false,
};

const readPreferences = (chatbotId) => {
  if (!chatbotId) return defaultPreferences;
  try {
    const raw = localStorage.getItem(`${DASHBOARD_PREFS_PREFIX}:${chatbotId}`);
    if (!raw) return defaultPreferences;
    const parsed = JSON.parse(raw);
    return {
      ...defaultPreferences,
      ...parsed,
    };
  } catch {
    return defaultPreferences;
  }
};

const savePreferences = (chatbotId, value) => {
  if (!chatbotId) return;
  try {
    localStorage.setItem(
      `${DASHBOARD_PREFS_PREFIX}:${chatbotId}`,
      JSON.stringify(value),
    );
  } catch {
    // ignore storage errors
  }
};

const getStatusMeta = (status, t) => {
  if (status === "pending") {
    return { color: "amber", label: t("pendingLabel") };
  }
  if (status === "closed") {
    return { color: "zinc", label: t("closedLabel") };
  }
  return { color: "sky", label: t("activeLabel") };
};

export const ChatbotDashboard = () => {
  const { chatbotId } = useParams();
  const { t } = useI18n();
  const [analytics, setAnalytics] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [filesCount, setFilesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [preferences, setPreferences] = useState(() =>
    readPreferences(chatbotId),
  );

  useEffect(() => {
    setPreferences(readPreferences(chatbotId));
  }, [chatbotId]);

  useEffect(() => {
    savePreferences(chatbotId, preferences);
  }, [chatbotId, preferences]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [stats, chats, files] = await Promise.all([
        api.chatbots.analytics(chatbotId),
        api.chatbots.conversations(chatbotId),
        api.chatbots.files(chatbotId),
      ]);
      setAnalytics(stats);
      setConversations(chats || []);
      setFilesCount((files || []).length);
      setLoading(false);
    };
    load();
  }, [chatbotId]);

  const metrics = useMemo(
    () => [
      {
        label: t("totalConversations"),
        value: analytics?.totalConversations || 0,
      },
      { label: t("activeLabel"), value: analytics?.activeConversations || 0 },
      { label: t("pendingLabel"), value: analytics?.pendingConversations || 0 },
      { label: t("closedLabel"), value: analytics?.closedConversations || 0 },
      {
        label: t("unreadConversations"),
        value: analytics?.unreadConversations || 0,
      },
      { label: t("totalMessages"), value: analytics?.totalMessages || 0 },
      { label: t("leadsCaptured"), value: analytics?.totalLeads || 0 },
      { label: t("knowledgeFiles"), value: filesCount || 0 },
    ],
    [analytics, filesCount, t],
  );

  const maxMetric = Math.max(
    ...metrics.map((item) => Number(item.value) || 0),
    1,
  );

  const insights = useMemo(
    () => [
      { label: t("totalMessages"), value: analytics?.totalMessages || 0 },
      { label: t("openConversations"), value: analytics?.openConversations || 0 },
      {
        label: t("pendingLabel"),
        value: analytics?.pendingConversations || 0,
      },
      { label: t("leadsCaptured"), value: analytics?.totalLeads || 0 },
    ],
    [analytics, t],
  );

  if (loading) return <Loading />;

  const hiddenEverything =
    !preferences.showMetrics &&
    !preferences.showRecent &&
    !preferences.showInsights;

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="glass-panel fade-up p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <Badge color="teal" className="w-fit uppercase tracking-wide">
              {t("dashboard")}
            </Badge>
            <Heading level={3} className="font-display text-xl sm:text-2xl">
              {t("dashboardOverview")}
            </Heading>
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">
              {t("dashboardOverviewBody")}
            </Text>
          </div>
          <Button
            outline
            onClick={() => setCustomizerOpen((prev) => !prev)}
            className="w-full sm:w-auto"
          >
            <AdjustmentsHorizontalIcon data-slot="icon" />
            {t("customizeDashboard")}
          </Button>
        </div>

        <AnimatePresence initial={false}>
          {customizerOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
              <label className="surface-card flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  {t("showMetrics")}
                </span>
                <Switch
                  color="teal"
                  checked={preferences.showMetrics}
                  onChange={(value) =>
                    setPreferences((prev) => ({ ...prev, showMetrics: value }))
                  }
                />
              </label>
              <label className="surface-card flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  {t("showRecentDashboard")}
                </span>
                <Switch
                  color="teal"
                  checked={preferences.showRecent}
                  onChange={(value) =>
                    setPreferences((prev) => ({ ...prev, showRecent: value }))
                  }
                />
              </label>
              <label className="surface-card flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  {t("showInsightsDashboard")}
                </span>
                <Switch
                  color="teal"
                  checked={preferences.showInsights}
                  onChange={(value) =>
                    setPreferences((prev) => ({ ...prev, showInsights: value }))
                  }
                />
              </label>
              <label className="surface-card flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  {t("compactMode")}
                </span>
                <Switch
                  color="teal"
                  checked={preferences.compactMode}
                  onChange={(value) =>
                    setPreferences((prev) => ({ ...prev, compactMode: value }))
                  }
                />
              </label>
              <Button
                outline
                className="sm:col-span-2 lg:col-span-4"
                onClick={() => setPreferences(defaultPreferences)}
              >
                {t("resetLayout")}
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <AnimatePresence initial={false}>
        {preferences.showMetrics ? (
          <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`grid gap-3 ${
              preferences.compactMode
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
                : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {metrics.map((item, index) => {
              const percent = Math.max(
                14,
                ((Number(item.value) || 0) / maxMetric) * 100,
              );
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="surface-card overflow-hidden p-4"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    <span>{item.label}</span>
                    <SparklesIcon className="size-4" />
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">
                    {item.value}
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-zinc-100 dark:bg-white/10">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.05 + index * 0.04,
                      }}
                      style={{
                        width: `${Math.min(100, percent)}%`,
                        transformOrigin: "left center",
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div
        className={`grid gap-4 ${
          preferences.showRecent && preferences.showInsights
            ? "grid-cols-1 xl:grid-cols-[1.2fr,0.8fr]"
            : "grid-cols-1"
        }`}
      >
        <AnimatePresence initial={false}>
          {preferences.showRecent ? (
            <motion.section
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="glass-panel p-5"
            >
              <Heading level={3} className="font-display text-lg">
                {t("recentConversations")}
              </Heading>
              <div className="mt-4 space-y-3">
                {conversations.slice(0, 5).map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.04 * index }}
                    className="surface-card flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">
                        {conversation.visitor?.name || t("newVisitor")}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {conversation.lastMessagePreview || t("noMessagesYet")}
                      </div>
                    </div>
                    <Badge color={getStatusMeta(conversation.status, t).color}>
                      {getStatusMeta(conversation.status, t).label}
                    </Badge>
                  </motion.div>
                ))}
                {conversations.length === 0 ? (
                  <Text className="text-sm text-zinc-500">
                    {t("noConversationsYet")}
                  </Text>
                ) : null}
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {preferences.showInsights ? (
            <motion.section
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="glass-panel p-5"
            >
              <Heading level={3} className="font-display text-lg">
                {t("insights")}
              </Heading>
              <div className="mt-4 space-y-4">
                {insights.map((item, index) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100 dark:bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(100, (item.value || 0) * 5)}%`,
                        }}
                        transition={{ duration: 0.45, delay: index * 0.05 }}
                        className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </div>

      {hiddenEverything ? (
        <div className="glass-panel p-6 text-center">
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">
            {t("dashboardHiddenState")}
          </Text>
        </div>
      ) : null}
    </div>
  );
};
