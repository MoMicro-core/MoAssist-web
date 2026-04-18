import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useWebSocket } from "../context/WebSocketContext";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Loading } from "../components/Loading";
import { useI18n } from "../context/I18nContext";
import {
  readEnumParam,
  readTextParam,
  updateSearchParams,
} from "../lib/urlState";

const formatTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString();
};

const sortConversations = (items) =>
  [...items].sort((left, right) => {
    const leftTime = new Date(
      left.lastMessageAt || left.updatedAt || left.createdAt || 0,
    );
    const rightTime = new Date(
      right.lastMessageAt || right.updatedAt || right.createdAt || 0,
    );
    return rightTime - leftTime;
  });

const getStatusMeta = (status, t) => {
  if (status === "pending") {
    return { color: "amber", label: t("pendingLabel") };
  }
  if (status === "closed") {
    return { color: "zinc", label: t("closedLabel") };
  }
  return { color: "sky", label: t("activeLabel") };
};

const markMessagesRead = (messages = [], actorType) =>
  messages.map((message) => {
    if (actorType === "owner" && message.authorType === "visitor") {
      return { ...message, readByOwner: true, read: true };
    }
    if (actorType === "visitor" && message.authorType !== "visitor") {
      return { ...message, readByVisitor: true, read: true };
    }
    return message;
  });

const describeMessageAuthor = (message, t) => {
  if (message.authorType === "visitor") return t("visitorLabel");
  if (message.author === "ai") return `${t("aiLabel")} ${t("agentLabel")}`;
  return `${t("humanLabel")} ${t("agentLabel")}`;
};

const describeReadState = (message, t) => {
  if (message.authorType === "visitor") {
    return message.readByOwner
      ? t("messageReadByTeam")
      : t("messageUnreadByTeam");
  }
  return message.readByVisitor
    ? t("messageReadByVisitor")
    : t("messageUnreadByVisitor");
};

const mergeConversationList = (items, incoming) => {
  const exists = items.some((item) => item.id === incoming.id);
  const next = exists
    ? items.map((item) =>
        item.id === incoming.id ? { ...item, ...incoming } : item,
      )
    : [incoming, ...items];
  return sortConversations(next);
};

const filterOptions = ["all", "active", "pending", "closed"];

export const ChatbotChats = () => {
  const { chatbotId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    connected,
    on,
    subscribeConversation,
    sendOwnerMessage,
    markConversationRead,
  } = useWebSocket();
  const { t } = useI18n();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState(() =>
    readEnumParam(searchParams, "filter", filterOptions, "all"),
  );
  const [search, setSearch] = useState(() => readTextParam(searchParams, "q"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [closing, setClosing] = useState(false);
  const requestedId = searchParams.get("conversation");

  const mergeConversation = (incomingConversation) => {
    if (!incomingConversation) return;
    setConversations((prev) =>
      mergeConversationList(prev, incomingConversation),
    );
    if (incomingConversation.id === activeId) {
      setActiveConversation((prev) => ({
        ...(prev || {}),
        ...incomingConversation,
        messages: incomingConversation.messages || prev?.messages || [],
      }));
    }
  };

  useEffect(() => {
    const nextFilter = readEnumParam(
      searchParams,
      "filter",
      filterOptions,
      "all",
    );
    const nextSearch = readTextParam(searchParams, "q");
    setFilter((prev) => (prev === nextFilter ? prev : nextFilter));
    setSearch((prev) => (prev === nextSearch ? prev : nextSearch));
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    const loadConversations = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.chatbots.conversations(chatbotId);
        if (!active) return;

        const items = sortConversations(data || []);
        setConversations(items);
      } catch (err) {
        if (!active) return;
        setError(err?.message || "Unable to load conversations");
        setConversations([]);
        setActiveId("");
        setActiveConversation(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadConversations();
    return () => {
      active = false;
    };
  }, [chatbotId]);

  useEffect(() => {
    if (!conversations.length) {
      setActiveId("");
      setActiveConversation(null);
      return;
    }

    if (requestedId && conversations.some((item) => item.id === requestedId)) {
      setActiveId((prev) => (prev === requestedId ? prev : requestedId));
      return;
    }

    setActiveId((prev) =>
      prev && conversations.some((item) => item.id === prev)
        ? prev
        : conversations[0].id,
    );
  }, [conversations, requestedId]);

  useEffect(() => {
    const next = updateSearchParams(
      searchParams,
      {
        conversation: activeId,
        filter,
        q: search.trim(),
      },
      {
        conversation: "",
        filter: "all",
        q: "",
      },
    );
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [activeId, filter, search, searchParams, setSearchParams]);

  useEffect(() => {
    if (!activeId) {
      setActiveConversation(null);
      return;
    }

    let active = true;

    const loadConversation = async () => {
      setActionError("");
      try {
        const data = await api.conversations.get(activeId);
        if (!active) return;

        setActiveConversation(data);
        subscribeConversation(activeId);
        if (connected) {
          markConversationRead(activeId);
        } else {
          await api.conversations.markRead(activeId);
        }
        setConversations((prev) =>
          prev.map((item) =>
            item.id === activeId ? { ...item, unreadForOwner: 0 } : item,
          ),
        );
      } catch (err) {
        if (!active) return;
        setActionError(err?.message || "Unable to load the conversation");
      }
    };

    loadConversation();
    return () => {
      active = false;
    };
  }, [activeId, connected, markConversationRead, subscribeConversation]);

  useEffect(() => {
    const applyReadUpdate = (payload) => {
      if (!payload || payload.chatbotId !== chatbotId) return;

      if (payload.actorType === "owner") {
        setConversations((prev) =>
          prev.map((item) =>
            item.id === payload.conversationId
              ? { ...item, unreadForOwner: 0 }
              : item,
          ),
        );
      }

      if (payload.conversationId === activeId) {
        setActiveConversation((prev) =>
          prev
            ? {
                ...prev,
                unreadForOwner:
                  payload.actorType === "owner" ? 0 : prev.unreadForOwner,
                messages: markMessagesRead(
                  prev.messages || [],
                  payload.actorType,
                ),
              }
            : prev,
        );
      }
    };

    const offMessage = on("message.created", (payload) => {
      if (!payload || payload.chatbotId !== chatbotId) return;

      setConversations((prev) =>
        mergeConversationList(
          prev.map((item) =>
            item.id === payload.conversationId
              ? {
                  ...item,
                  lastMessagePreview: payload.message.content,
                  lastMessageAt: payload.message.createdAt,
                  unreadForOwner:
                    payload.message.authorType === "visitor"
                      ? (item.unreadForOwner || 0) + 1
                      : item.unreadForOwner,
                }
              : item,
          ),
          {
            id: payload.conversationId,
            chatbotId: payload.chatbotId,
            lastMessagePreview: payload.message.content,
            lastMessageAt: payload.message.createdAt,
            unreadForOwner: payload.message.authorType === "visitor" ? 1 : 0,
          },
        ),
      );

      if (payload.conversationId === activeId) {
        setActiveConversation((prev) =>
          prev
            ? {
                ...prev,
                lastMessagePreview: payload.message.content,
                lastMessageAt: payload.message.createdAt,
                messages: (prev.messages || []).some((m) => m.id === payload.message.id)
                  ? prev.messages
                  : [...(prev.messages || []), payload.message],
              }
            : prev,
        );
        if (payload.message.authorType === "visitor") {
          markConversationRead(activeId);
        }
      }
    });

    const offCreated = on("conversation.created", (payload) => {
      if (
        !payload?.conversation ||
        payload.conversation.chatbotId !== chatbotId
      )
        return;
      setConversations((prev) =>
        mergeConversationList(prev, payload.conversation),
      );
    });

    const offUpdated = on("conversation.updated", (payload) => {
      if (
        !payload?.conversation ||
        payload.conversation.chatbotId !== chatbotId
      )
        return;
      mergeConversation(payload.conversation);
    });

    const offClosed = on("conversation.closed", (payload) => {
      if (
        !payload?.conversation ||
        payload.conversation.chatbotId !== chatbotId
      )
        return;
      mergeConversation(payload.conversation);
    });

    const offRead = on("conversation.read", applyReadUpdate);

    return () => {
      offMessage();
      offCreated();
      offUpdated();
      offClosed();
      offRead();
    };
  }, [activeId, chatbotId, markConversationRead, on]);

  const handleSend = async () => {
    if (!message.trim() || !activeId || activeConversation?.status === "closed")
      return;

    const content = message.trim();
    setMessage("");
    setActionError("");

    try {
      if (connected) {
        sendOwnerMessage(activeId, content);
        return;
      }

      const result = await api.conversations.sendMessage(activeId, content);
      if (result?.message) {
        setConversations((prev) =>
          mergeConversationList(
            prev.map((item) =>
              item.id === activeId
                ? {
                    ...item,
                    lastMessagePreview: result.message.content,
                    lastMessageAt: result.message.createdAt,
                  }
                : item,
            ),
            {
              id: activeId,
              chatbotId,
              lastMessagePreview: result.message.content,
              lastMessageAt: result.message.createdAt,
            },
          ),
        );
        setActiveConversation((prev) =>
          prev
            ? {
                ...prev,
                lastMessagePreview: result.message.content,
                lastMessageAt: result.message.createdAt,
                messages: [...(prev.messages || []), result.message],
              }
            : prev,
        );
      }
    } catch (err) {
      setMessage(content);
      setActionError(err?.message || "Unable to send the reply");
    }
  };

  const handleCloseConversation = async () => {
    if (!activeConversation || activeConversation.authClient || closing) return;

    setClosing(true);
    setActionError("");
    try {
      const result = await api.conversations.close(activeConversation.id);
      mergeConversation(
        result?.conversation || { ...activeConversation, status: "closed" },
      );
    } catch (err) {
      setActionError(err?.message || "Unable to close the conversation");
    } finally {
      setClosing(false);
    }
  };

  const activeMessages = useMemo(
    () => activeConversation?.messages || [],
    [activeConversation],
  );

  const filteredConversations = useMemo(() => {
    return conversations.filter((item) => {
      if (filter !== "all" && item.status !== filter) return false;
      if (!search) return true;
      const query = search.toLowerCase();
      const name = item.visitor?.name?.toLowerCase() || "";
      const email = item.visitor?.email?.toLowerCase() || "";
      const authClient = item.authClient?.toLowerCase() || "";
      return (
        name.includes(query) ||
        email.includes(query) ||
        authClient.includes(query)
      );
    });
  }, [conversations, filter, search]);

  if (loading) return <Loading />;

  const activeStatus = getStatusMeta(activeConversation?.status, t);
  const composerLocked = activeConversation?.status === "closed";

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      <div className="space-y-4">
        <Heading level={3} className="font-display text-lg">
          {t("conversations")}
        </Heading>
        <Input
          placeholder={t("searchConversations")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: t("allLabel") },
            { id: "active", label: t("activeLabel") },
            { id: "pending", label: t("pendingLabel") },
            { id: "closed", label: t("closedLabel") },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`chip-control ${filter === tab.id ? "chip-control-active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <div className="space-y-3">
          {filteredConversations.map((conversation) => {
            const statusMeta = getStatusMeta(conversation.status, t);
            return (
              <button
                key={conversation.id}
                onClick={() => setActiveId(conversation.id)}
                className={`ui-pressable w-full rounded-2xl border px-4 py-3 text-left transition dark:border-white/10 ${
                  activeId === conversation.id
                    ? "border-sky-200 bg-sky-50/90 dark:border-sky-500/40 dark:bg-sky-900/20"
                    : "border-zinc-200 bg-white/90 hover:border-sky-100 dark:bg-zinc-900/85"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium text-zinc-900 dark:text-white">
                    {conversation.visitor?.name || t("newVisitor")}
                  </div>
                  <div className="flex items-center gap-2">
                    {conversation.unreadForOwner ? (
                      <Badge color="sky">{conversation.unreadForOwner}</Badge>
                    ) : null}
                    <Badge color={statusMeta.color}>{statusMeta.label}</Badge>
                  </div>
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {conversation.visitor?.email ||
                    conversation.authClient ||
                    t("noMessagesYet")}
                </div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {conversation.lastMessagePreview || t("noMessagesYet")}
                </div>
                <div className="mt-2 text-[11px] text-zinc-400">
                  {formatTime(
                    conversation.lastMessageAt || conversation.updatedAt,
                  )}
                </div>
              </button>
            );
          })}
          {filteredConversations.length === 0 ? (
            <Text className="text-sm text-zinc-500">
              {t("noConversationsFound")}
            </Text>
          ) : null}
        </div>
      </div>

      <div className="glass-panel flex min-h-[520px] flex-col rounded-3xl">
        {activeConversation ? (
          <>
            <div className="border-b border-zinc-100 px-6 py-5 dark:border-white/10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {activeConversation.visitor?.name || t("newVisitor")}
                    </div>
                    <Badge color={activeStatus.color}>
                      {activeStatus.label}
                    </Badge>
                    {activeConversation.authClient ? (
                      <Badge color="cyan">{t("authenticatedLabel")}</Badge>
                    ) : null}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {activeConversation.visitor?.email || "No email"}
                  </div>
                  {activeConversation.authClient ? (
                    <div className="text-xs text-zinc-500">
                      authClient: {activeConversation.authClient}
                    </div>
                  ) : null}
                  {activeConversation.authClient ? (
                    <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                      {t("authenticatedChatHelp")}
                    </Text>
                  ) : null}
                </div>
                {!activeConversation.authClient ? (
                  <Button
                    outline
                    onClick={handleCloseConversation}
                    disabled={closing || activeConversation.status === "closed"}
                  >
                    {closing ? t("closingChat") : t("closeChat")}
                  </Button>
                ) : null}
              </div>
            </div>

            {actionError ? (
              <div className="mx-6 mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {actionError}
              </div>
            ) : null}

            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
              {activeMessages.map((msg) => {
                const isVisitor = msg.authorType === "visitor";
                const isAi = msg.author === "ai";

                return (
                  <div
                    key={msg.id}
                    className={`max-w-[85%] rounded-[1.4rem] border px-4 py-3 text-sm shadow-sm ${
                      isVisitor
                        ? "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
                        : isAi
                          ? "ml-auto border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-500/30 dark:bg-sky-950/30 dark:text-sky-100"
                          : "ml-auto border-transparent bg-gradient-to-br from-sky-600 to-cyan-500 text-white"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] opacity-80">
                      <Badge color={isVisitor ? "zinc" : isAi ? "cyan" : "sky"}>
                        {describeMessageAuthor(msg, t)}
                      </Badge>
                      <span>{describeReadState(msg, t)}</span>
                      <span>{formatTime(msg.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
              {activeMessages.length === 0 ? (
                <Text className="text-sm text-zinc-500">
                  {t("noMessagesYet")}
                </Text>
              ) : null}
            </div>

            <div className="border-t border-zinc-100 px-4 py-4 dark:border-white/10 sm:px-6">
              <div
                className={`flex flex-col items-stretch gap-3 sm:flex-row sm:items-end ${composerLocked ? "opacity-70" : ""}`}
              >
                <Textarea
                  rows={2}
                  value={message}
                  disabled={composerLocked}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={
                    composerLocked
                      ? "This conversation is closed"
                      : t("messagesPlaceholder")
                  }
                />
                <Button
                  color="sky"
                  onClick={handleSend}
                  disabled={composerLocked || !message.trim()}
                  className="w-full sm:w-auto"
                >
                  {t("send")}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <Text className="text-sm text-zinc-500">
              {t("selectConversation")}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
