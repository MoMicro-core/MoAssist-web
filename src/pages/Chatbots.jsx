import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { api } from "../lib/api";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogBody, DialogActions, DialogTitle } from "../ui/dialog";
import { Field, FieldGroup, Label } from "../ui/fieldset";
import { Input } from "../ui/input";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Select } from "../ui/select";
import { Loading } from "../components/Loading";
import { EmptyState } from "../components/EmptyState";
import { useI18n } from "../context/I18nContext";
import { readEnumParam, updateSearchParams } from "../lib/urlState";

const CHATBOT_ORDER_KEY = "moassist-chatbots-order";
const CHATBOT_PINNED_KEY = "moassist-chatbots-pinned";

const readStoredIds = (key) => {
  try {
    const value = localStorage.getItem(key);
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};

const writeStoredIds = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
};

const normalizeOrderedIds = (orderedIds, existingIds) => {
  const existingSet = new Set(existingIds);
  const cleaned = orderedIds.filter((id) => existingSet.has(id));
  const missing = existingIds.filter((id) => !cleaned.includes(id));
  return [...cleaned, ...missing];
};

const moveId = (ids, sourceId, targetId) => {
  if (!sourceId || !targetId || sourceId === targetId) return ids;
  const list = [...ids];
  const sourceIndex = list.indexOf(sourceId);
  const targetIndex = list.indexOf(targetId);
  if (sourceIndex < 0 || targetIndex < 0) return ids;
  const [item] = list.splice(sourceIndex, 1);
  list.splice(targetIndex, 0, item);
  return list;
};

const normalizeLanguageSelection = (defaultLanguage, languages = []) => {
  const next = [
    defaultLanguage,
    ...(Array.isArray(languages) ? languages : []).filter(Boolean),
  ].filter(Boolean);
  return [...new Set(next)];
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

const conversationStatusOptions = ["all", "active", "pending", "closed"];

export const Chatbots = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useI18n();
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [title, setTitle] = useState("");
  const [languageOptions, setLanguageOptions] = useState({
    defaultLanguage: "english",
    allowedLanguages: ["english"],
  });
  const [createDefaultLanguage, setCreateDefaultLanguage] = useState("english");
  const [createEnabledLanguages, setCreateEnabledLanguages] = useState([
    "english",
  ]);
  const [orderIds, setOrderIds] = useState(() =>
    readStoredIds(CHATBOT_ORDER_KEY),
  );
  const [pinnedIds, setPinnedIds] = useState(() =>
    readStoredIds(CHATBOT_PINNED_KEY),
  );
  const [draggingId, setDraggingId] = useState("");
  const [dragOverId, setDragOverId] = useState("");
  const [allConversations, setAllConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [conversationStatus, setConversationStatus] = useState(() =>
    readEnumParam(
      searchParams,
      "conversationStatus",
      conversationStatusOptions,
      "all",
    ),
  );

  const loadChatbots = async () => {
    setLoading(true);
    setPageError("");
    try {
      const items = await api.chatbots.list();
      const existingIds = items.map((item) => item.id);
      setChatbots(items);
      setOrderIds((prev) => normalizeOrderedIds(prev, existingIds));
      setPinnedIds((prev) => prev.filter((id) => existingIds.includes(id)));
    } catch (err) {
      setChatbots([]);
      setPageError(err?.message || "Unable to load chatbots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChatbots();
  }, []);

  useEffect(() => {
    let active = true;
    const loadLanguageOptions = async () => {
      try {
        const data = await api.chatbots.languages();
        if (!active || !data) return;
        const nextDefault = data.defaultLanguage || "english";
        const nextAllowed =
          data.allowedLanguages && data.allowedLanguages.length
            ? data.allowedLanguages
            : [nextDefault];
        setLanguageOptions({
          defaultLanguage: nextDefault,
          allowedLanguages: nextAllowed,
        });
        setCreateDefaultLanguage(nextDefault);
        setCreateEnabledLanguages([nextDefault]);
      } catch {
        // keep fallback values
      }
    };
    loadLanguageOptions();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    writeStoredIds(CHATBOT_ORDER_KEY, orderIds);
  }, [orderIds]);

  useEffect(() => {
    writeStoredIds(CHATBOT_PINNED_KEY, pinnedIds);
  }, [pinnedIds]);

  useEffect(() => {
    const nextStatus = readEnumParam(
      searchParams,
      "conversationStatus",
      conversationStatusOptions,
      "all",
    );
    setConversationStatus((prev) =>
      prev === nextStatus ? prev : nextStatus,
    );
  }, [searchParams]);

  useEffect(() => {
    const next = updateSearchParams(
      searchParams,
      { conversationStatus },
      { conversationStatus: "all" },
    );
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [conversationStatus, searchParams, setSearchParams]);

  useEffect(() => {
    const loadConversations = async () => {
      setLoadingConversations(true);
      try {
        const params =
          conversationStatus === "all"
            ? undefined
            : { status: conversationStatus };
        const data = await api.conversations.list(params);
        setAllConversations(data || []);
      } catch {
        setAllConversations([]);
      } finally {
        setLoadingConversations(false);
      }
    };
    loadConversations();
  }, [conversationStatus]);

  const statusColor = useMemo(
    () => (status) => (status === "published" ? "emerald" : "zinc"),
    [],
  );

  const chatbotLookup = useMemo(
    () => new Map(chatbots.map((bot) => [bot.id, bot])),
    [chatbots],
  );

  const orderedChatbots = useMemo(() => {
    const ids = normalizeOrderedIds(
      orderIds,
      chatbots.map((bot) => bot.id),
    );
    return ids.map((id) => chatbotLookup.get(id)).filter(Boolean);
  }, [orderIds, chatbots, chatbotLookup]);

  const pinnedSet = useMemo(() => new Set(pinnedIds), [pinnedIds]);

  const openCreate = () => {
    setTitle("");
    setCreateError("");
    const nextDefault = languageOptions.defaultLanguage || "english";
    setCreateDefaultLanguage(nextDefault);
    setCreateEnabledLanguages([nextDefault]);
    setDialogOpen(true);
  };

  const closeCreate = () => {
    if (creating) return;
    setDialogOpen(false);
    setCreateError("");
  };

  const togglePin = (chatbotId) => {
    setPinnedIds((prev) => {
      if (prev.includes(chatbotId)) {
        return prev.filter((id) => id !== chatbotId);
      }
      return [chatbotId, ...prev.filter((id) => id !== chatbotId)];
    });
    setOrderIds((prev) => [
      chatbotId,
      ...prev.filter((id) => id !== chatbotId),
    ]);
  };

  const clearDragState = () => {
    setDraggingId("");
    setDragOverId("");
  };

  const handleDragStart = (chatbotId) => (event) => {
    setDraggingId(chatbotId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", chatbotId);
  };

  const handleDragOver = (chatbotId) => (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragOverId !== chatbotId) {
      setDragOverId(chatbotId);
    }
  };

  const handleDrop = (chatbotId) => (event) => {
    event.preventDefault();
    const sourceId = draggingId || event.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === chatbotId) {
      clearDragState();
      return;
    }
    const existingIds = chatbots.map((item) => item.id);
    setOrderIds((prev) =>
      moveId(normalizeOrderedIds(prev, existingIds), sourceId, chatbotId),
    );
    clearDragState();
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (creating) return;
    setCreateError("");
    setCreating(true);
    try {
      const trimmedTitle = title.trim();
      const defaultLanguage =
        createDefaultLanguage || languageOptions.defaultLanguage || "english";
      const enabledLanguages = normalizeLanguageSelection(
        defaultLanguage,
        createEnabledLanguages,
      );
      const created = await api.chatbots.create({
        ...(trimmedTitle ? { title: trimmedTitle } : {}),
        defaultLanguage,
        enabledLanguages,
      });
      const chatbotId = created?.id;
      if (!chatbotId) {
        throw new Error("Chatbot created but no chatbot ID was returned");
      }
      setDialogOpen(false);
      navigate(`/chatbots/${chatbotId}/settings`);
    } catch (err) {
      setCreateError(err?.message || "Unable to create chatbot");
    } finally {
      setCreating(false);
    }
  };

  const availableLanguages = useMemo(
    () =>
      languageOptions.allowedLanguages?.length
        ? languageOptions.allowedLanguages
        : [languageOptions.defaultLanguage || "english"],
    [languageOptions],
  );

  const handleCreateDefaultLanguageChange = (event) => {
    const nextDefaultLanguage = event.target.value;
    setCreateDefaultLanguage(nextDefaultLanguage);
    setCreateEnabledLanguages((prev) =>
      normalizeLanguageSelection(nextDefaultLanguage, prev),
    );
  };

  const toggleCreateLanguage = (language) => {
    if (language === createDefaultLanguage) return;
    setCreateEnabledLanguages((prev) => {
      const current = normalizeLanguageSelection(createDefaultLanguage, prev);
      if (current.includes(language)) {
        return current.filter((item) => item !== language);
      }
      return [...current, language];
    });
  };

  if (loading) return <Loading />;

  const activeChatbotsCount = chatbots.filter(
    (bot) => bot.settings?.status === "published",
  ).length;
  const draftChatbotsCount = chatbots.filter(
    (bot) => bot.settings?.status !== "published",
  ).length;
  const totalConversations = chatbots.reduce(
    (sum, bot) => sum + (bot.metrics?.conversationsCount || 0),
    0,
  );
  const totalUnread = chatbots.reduce(
    (sum, bot) => sum + (bot.metrics?.unreadCount || 0),
    0,
  );
  const totalFiles = chatbots.reduce(
    (sum, bot) => sum + (bot.metrics?.filesCount || 0),
    0,
  );
  const recentBots = [...chatbots]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.6fr,1fr]">
        <div className="glass-panel rounded-2xl border-sky-200/60 bg-gradient-to-br from-sky-50 via-white/90 to-cyan-50 p-5 sm:rounded-3xl sm:p-8 dark:border-sky-900/30 dark:from-sky-950/35 dark:via-zinc-950 dark:to-cyan-950/15">
          <div className="flex flex-wrap items-start justify-between gap-4 sm:gap-6">
            <div className="min-w-0 space-y-2.5 sm:space-y-3">
              <Badge color="sky" className="uppercase tracking-wide">
                {t("dashboard")}
              </Badge>
              <Heading level={2} className="font-display text-2xl sm:text-3xl">
                {t("chatbots")}
              </Heading>
              <Text className="text-sm text-zinc-600 dark:text-zinc-300">
                Create, publish, and monitor assistants with one steady control
                surface.
              </Text>
            </div>
            <Button color="sky" onClick={openCreate} className="w-full sm:w-auto justify-center">
              {t("newChatbot")}
            </Button>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
            <div className="rounded-xl border border-white/60 bg-white/70 p-3 shadow-sm sm:rounded-2xl sm:p-4 dark:border-white/10 dark:bg-zinc-900/80">
              <div className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-white">
                {activeChatbotsCount}
              </div>
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">
                {t("activeChatbots")}
              </Text>
            </div>
            <div className="rounded-xl border border-white/60 bg-white/70 p-3 shadow-sm sm:rounded-2xl sm:p-4 dark:border-white/10 dark:bg-zinc-900/80">
              <div className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-white">
                {totalConversations}
              </div>
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">
                {t("totalConversations")}
              </Text>
            </div>
            <div className="rounded-xl border border-white/60 bg-white/70 p-3 shadow-sm sm:rounded-2xl sm:p-4 dark:border-white/10 dark:bg-zinc-900/80">
              <div className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-white">
                {totalUnread}
              </div>
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">
                {t("unreadConversations")}
              </Text>
            </div>
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-5 sm:rounded-3xl sm:p-6">
          <Heading level={3} className="font-display text-lg">
            {t("recentChatbotUpdates")}
          </Heading>
          <div className="mt-4 space-y-3">
            {recentBots.map((bot) => (
              <div
                key={bot.id}
                className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-white/5 dark:bg-zinc-800/60"
              >
                <div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-white">
                    {bot.settings?.title || "MoAssist Bot"}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {new Date(bot.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <Badge color={statusColor(bot.settings?.status)}>
                  {bot.settings?.status || "draft"}
                </Badge>
              </div>
            ))}
            {recentBots.length === 0 ? (
              <Text className="text-sm text-zinc-500">{t("noChatbots")}</Text>
            ) : null}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-center dark:border-white/5 dark:bg-zinc-800/60">
              <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                {totalFiles}
              </div>
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">
                {t("knowledgeFiles")}
              </Text>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-center dark:border-white/5 dark:bg-zinc-800/60">
              <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                {draftChatbotsCount}
              </div>
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">
                {t("draftChatbots")}
              </Text>
            </div>
          </div>
        </div>
      </div>
      {pageError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pageError}
        </div>
      ) : null}
      {chatbots.length === 0 ? (
        <EmptyState
          title={t("noChatbots")}
          description={t("noChatbotsBody")}
          actionLabel={t("createChatbot")}
          onAction={openCreate}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orderedChatbots.map((chatbot) => (
            <div
              key={chatbot.id}
              onClick={() => navigate(`/chatbots/${chatbot.id}/dashboard`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(`/chatbots/${chatbot.id}/dashboard`);
                }
              }}
              role="button"
              tabIndex={0}
              draggable
              onDragStart={handleDragStart(chatbot.id)}
              onDragOver={handleDragOver(chatbot.id)}
              onDrop={handleDrop(chatbot.id)}
              onDragEnd={clearDragState}
              className={`ui-pressable text-left ${
                draggingId === chatbot.id ? "opacity-45" : ""
              } ${dragOverId === chatbot.id ? "ring-2 ring-sky-400" : ""}`}
            >
              <div
                className={`surface-card group flex h-full flex-col justify-between p-5 hover:bg-zinc-100/80 dark:hover:bg-zinc-800 ${
                  pinnedSet.has(chatbot.id)
                    ? "border-sky-300/80 dark:border-cyan-400/50"
                    : ""
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Heading level={3} className="font-display text-lg">
                      {chatbot.settings?.title || "MoAssist Bot"}
                    </Heading>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          togglePin(chatbot.id);
                        }}
                        className={`ui-pressable inline-flex h-9 w-9 items-center justify-center rounded-full sm:h-8 sm:w-8 ${
                          pinnedSet.has(chatbot.id)
                            ? "bg-sky-500 text-white"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                        aria-label={
                          pinnedSet.has(chatbot.id)
                            ? "Unpin chatbot"
                            : "Pin chatbot"
                        }
                        title={
                          pinnedSet.has(chatbot.id)
                            ? "Unpin chatbot"
                            : "Pin chatbot"
                        }
                      >
                        <StarIcon className="size-4" />
                      </button>
                      {chatbot.currentTier?.name ? (
                        <Badge color="amber">{chatbot.currentTier.name}</Badge>
                      ) : null}
                      <Badge color={statusColor(chatbot.settings?.status)}>
                        {chatbot.settings?.status || "draft"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Text className="text-sm text-zinc-600">
                      {chatbot.settings?.botName || "MoAssist"}
                    </Text>
                    <div className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                      <ArrowsUpDownIcon className="size-3.5" />
                      <span>Drag</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-zinc-600">
                  <div className="rounded-xl bg-zinc-50 px-3 py-2">
                    <div className="text-zinc-900">
                      {chatbot.metrics?.conversationsCount || 0}
                    </div>
                    <div>{t("totalConversations")}</div>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-3 py-2">
                    <div className="text-zinc-900">
                      {chatbot.metrics?.unreadCount || 0}
                    </div>
                    <div>{t("unreadConversations")}</div>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-3 py-2">
                    <div className="text-zinc-900">
                      {chatbot.metrics?.filesCount || 0}
                    </div>
                    <div>{t("knowledgeFiles")}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="glass-panel rounded-2xl p-5 sm:rounded-3xl sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Heading level={3} className="font-display text-lg">
              {t("allConversations")}
            </Heading>
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">
              {t("allConversationsBody")}
            </Text>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button outline href="/chats">
              {t("viewAllChats")}
            </Button>
            {[
              { id: "all", label: t("allLabel") },
              { id: "active", label: t("activeLabel") },
              { id: "pending", label: t("pendingLabel") },
              { id: "closed", label: t("closedLabel") },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setConversationStatus(tab.id)}
                className={`chip-control ${
                  conversationStatus === tab.id ? "chip-control-active" : ""
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {loadingConversations ? (
            <Text className="text-sm text-zinc-500">
              {t("loadingConversations")}
            </Text>
          ) : (
            allConversations.slice(0, 6).map((conversation) => {
              const bot = chatbotLookup.get(conversation.chatbotId);
              const title = bot?.settings?.title || "Chatbot";
              const time =
                conversation.lastMessageAt ||
                conversation.updatedAt ||
                conversation.createdAt;
              const statusMeta = getStatusMeta(conversation.status, t);
              return (
                <button
                  key={conversation.id}
                  onClick={() =>
                    navigate(
                      `/chatbots/${conversation.chatbotId}/chats?conversation=${conversation.id}`,
                    )
                  }
                  className="ui-pressable w-full text-left"
                >
                  <div className="surface-card px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-zinc-900 dark:text-white">
                          {conversation.visitor?.name || t("newVisitor")}
                        </div>
                        <div className="text-xs text-zinc-500">{title}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge color={statusMeta.color}>
                          {statusMeta.label}
                        </Badge>
                        <div className="text-xs text-zinc-500">
                          {time ? new Date(time).toLocaleString() : ""}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                      {conversation.lastMessagePreview || t("noMessagesYet")}
                    </div>
                  </div>
                </button>
              );
            })
          )}
          {!loadingConversations && allConversations.length === 0 ? (
            <Text className="text-sm text-zinc-500">
              {t("noConversationsYet")}
            </Text>
          ) : null}
        </div>
      </div>
      <Dialog open={dialogOpen} onClose={closeCreate} size="md">
        <div className="rounded-2xl bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-5 dark:from-sky-950/30 dark:via-zinc-900 dark:to-cyan-950/20">
          <DialogTitle>{t("createChatbot")}</DialogTitle>
          <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Start with a clean assistant shell, then configure auth, branding,
            and live chat behavior.
          </Text>
        </div>
        <DialogBody>
          <form onSubmit={handleCreate} className="space-y-6">
            <FieldGroup>
              <Field>
                <Label>{t("chatbotName")}</Label>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="MoAssist Bot"
                  autoFocus
                />
              </Field>
              <Field>
                <Label>{t("defaultLanguageSetting")}</Label>
                <Select
                  value={createDefaultLanguage}
                  onChange={handleCreateDefaultLanguageChange}
                >
                  {availableLanguages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label>{t("enabledLanguagesLabel")}</Label>
                <div className="flex flex-wrap gap-2">
                  {availableLanguages.map((language) => {
                    const selected = createEnabledLanguages.includes(language);
                    const isDefault = language === createDefaultLanguage;
                    return (
                      <button
                        key={language}
                        type="button"
                        onClick={() => toggleCreateLanguage(language)}
                        className={`chip-control ${
                          selected ? "chip-control-active" : ""
                        }`}
                        disabled={isDefault}
                        title={
                          isDefault
                            ? t("defaultLanguagePinnedHelp")
                            : undefined
                        }
                      >
                        {language}
                        {isDefault ? ` • ${t("defaultLanguageShort")}` : ""}
                      </button>
                    );
                  })}
                </div>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t("createLanguagesHelp")}
                </Text>
              </Field>
            </FieldGroup>
            {createError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {createError}
              </div>
            ) : null}
            <DialogActions>
              <Button outline type="button" onClick={closeCreate}>
                {t("cancel")}
              </Button>
              <Button color="sky" type="submit" disabled={creating}>
                {creating ? t("creating") : t("createChatbot")}
              </Button>
            </DialogActions>
          </form>
        </DialogBody>
      </Dialog>
    </div>
  );
};
