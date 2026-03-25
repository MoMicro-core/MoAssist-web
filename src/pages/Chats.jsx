import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Loading } from "../components/Loading";
import { useI18n } from "../context/I18nContext";

const formatTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString();
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

export const Chats = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [conversations, setConversations] = useState([]);
  const [chatbots, setChatbots] = useState([]);
  const [status, setStatus] = useState("active");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [allConversations, allChatbots] = await Promise.all([
          api.conversations.list(status === "all" ? undefined : { status }),
          api.chatbots.list(),
        ]);
        if (!active) return;
        setConversations(allConversations || []);
        setChatbots(allChatbots || []);
      } catch (err) {
        if (!active) return;
        setError(err?.message || "Unable to load active chats");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [status]);

  const chatbotLookup = useMemo(
    () => new Map(chatbots.map((bot) => [bot.id, bot])),
    [chatbots],
  );

  const filteredConversations = useMemo(() => {
    if (!search.trim()) return conversations;
    const query = search.trim().toLowerCase();
    return conversations.filter((item) => {
      const visitorName = item.visitor?.name?.toLowerCase() || "";
      const visitorEmail = item.visitor?.email?.toLowerCase() || "";
      const botName =
        chatbotLookup.get(item.chatbotId)?.settings?.title?.toLowerCase() || "";
      return (
        visitorName.includes(query) ||
        visitorEmail.includes(query) ||
        botName.includes(query)
      );
    });
  }, [conversations, search, chatbotLookup]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <Heading level={2} className="font-display text-2xl">
          {t("chatsMenu")}
        </Heading>
        <Text className="text-sm text-zinc-600 dark:text-zinc-300">
          {t("allConversationsBody")}
        </Text>
      </div>

      <div className="glass-panel p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("searchConversations")}
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
                onClick={() => setStatus(tab.id)}
                className={`chip-control ${status === tab.id ? "chip-control-active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          {filteredConversations.map((conversation) => {
            const chatbot = chatbotLookup.get(conversation.chatbotId);
            const chatbotTitle = chatbot?.settings?.title || "Chatbot";
            const statusMeta = getStatusMeta(conversation.status, t);
            return (
              <button
                key={conversation.id}
                onClick={() =>
                  navigate(
                    `/chatbots/${conversation.chatbotId}/chats?conversation=${conversation.id}`,
                  )
                }
                className="ui-pressable surface-card w-full px-4 py-3 text-left"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium text-zinc-900 dark:text-white">
                      {conversation.visitor?.name || t("newVisitor")}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {chatbotTitle}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {conversation.unreadForOwner ? (
                      <Badge color="teal">{conversation.unreadForOwner}</Badge>
                    ) : null}
                    <Badge color={statusMeta.color}>{statusMeta.label}</Badge>
                  </div>
                </div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {conversation.lastMessagePreview || t("noMessagesYet")}
                </div>
                <div className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
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
    </div>
  );
};
