import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Loading } from "../components/Loading";
import { EmptyState } from "../components/EmptyState";
import { useI18n } from "../context/I18nContext";

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

const getStatusMeta = (status, t) => {
  if (status === "pending") {
    return { color: "amber", label: t("pendingLabel") };
  }
  if (status === "closed") {
    return { color: "zinc", label: t("closedLabel") };
  }
  return { color: "sky", label: t("activeLabel") };
};

export const Chatbots = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [title, setTitle] = useState("");
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
  const [conversationStatus, setConversationStatus] = useState("all");

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
    writeStoredIds(CHATBOT_ORDER_KEY, orderIds);
  }, [orderIds]);

  useEffect(() => {
    writeStoredIds(CHATBOT_PINNED_KEY, pinnedIds);
  }, [pinnedIds]);

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
      const created = await api.chatbots.create(
        trimmedTitle ? { title: trimmedTitle } : {},
      );
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

  if (loading) return <Loading />;

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
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
        <div className="glass-panel rounded-3xl border-sky-200/60 bg-gradient-to-br from-sky-50 via-white/90 to-cyan-50 p-8 dark:border-sky-900/30 dark:from-sky-950/35 dark:via-zinc-950 dark:to-cyan-950/15">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <Badge color="sky" className="uppercase tracking-wide">
                {t("dashboard")}
              </Badge>
              <Heading level={2} className="font-display text-3xl">
                {t("chatbots")}
              </Heading>
              <Text className="text-sm text-zinc-600 dark:text-zinc-300">
                Create, publish, and monitor assistants with one steady control
                surface.
              </Text>
            </div>
            <Button color="sky" onClick={openCreate}>
              {t("newChatbot")}
            </Button>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
              <div className="text-xl font-semibold text-zinc-900 dark:text-white">
                {chatbots.length}
              </div>
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">
                {t("activeChatbots")}
              </Text>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
              <div className="text-xl font-semibold text-zinc-900 dark:text-white">
                {totalConversations}
              </div>
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">
                {t("totalConversations")}
              </Text>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
              <div className="text-xl font-semibold text-zinc-900 dark:text-white">
                {totalUnread}
              </div>
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">
                {t("unreadConversations")}
              </Text>
            </div>
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <Heading level={3} className="font-display text-lg">
            {t("activity")}
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
                {totalUnread}
              </div>
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">
                {t("needsReply")}
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
                className={`surface-card group flex h-full flex-col justify-between p-5 ${
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
                        className={`ui-pressable rounded-full p-1.5 ${
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
                    <div>Conversations</div>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-3 py-2">
                    <div className="text-zinc-900">
                      {chatbot.metrics?.unreadCount || 0}
                    </div>
                    <div>Unread</div>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-3 py-2">
                    <div className="text-zinc-900">
                      {chatbot.metrics?.filesCount || 0}
                    </div>
                    <div>Files</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="glass-panel rounded-3xl p-6">
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
