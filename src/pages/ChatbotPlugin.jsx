import { useEffect, useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { Loading } from "../components/Loading";
import { useI18n } from "../context/I18nContext";
import { useChatbot } from "../context/ChatbotContext";
import { ChatbotPreview } from "../components/ChatbotPreview";

const createCodePreview = (snippet = "") => {
  const lines = String(snippet || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return "";
  if (lines.length === 1) {
    return lines[0].length > 140 ? `${lines[0].slice(0, 140)}...` : lines[0];
  }

  if (lines.length === 2) {
    return lines.join("\n");
  }

  return [lines[0], lines[1], "...", lines[lines.length - 1]].join("\n");
};

const InstallMethodCard = ({ title, body, previewCode, ctaLabel, onCopy }) => (
  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Heading level={4} className="font-display text-base">
            {title}
          </Heading>
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">
            {body}
          </Text>
        </div>
        <Button outline onClick={onCopy} aria-label={ctaLabel} title={ctaLabel}>
          <ClipboardDocumentIcon data-slot="icon" />
          {ctaLabel}
        </Button>
      </div>
      {previewCode ? (
        <div className="space-y-2">
          <Text className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Code preview
          </Text>
          <pre className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
            {previewCode}
          </pre>
          <Text className="text-xs text-zinc-500 dark:text-zinc-400">
            The preview shows only the important part. The button copies the
            full code.
          </Text>
        </div>
      ) : null}
    </div>
  </div>
);

const LockedInstallCard = ({ title, body, ctaLabel, href }) => (
  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <Heading level={4} className="font-display text-base">
          {title}
        </Heading>
        <Text className="text-sm text-zinc-600 dark:text-zinc-300">
          {body}
        </Text>
      </div>
      <Button outline href={href}>
        {ctaLabel}
      </Button>
    </div>
  </div>
);

export const ChatbotPlugin = () => {
  const { chatbotId } = useParams();
  const { t } = useI18n();
  const { chatbot } = useChatbot();
  const [install, setInstall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await api.chatbots.install(chatbotId);
      setInstall(data);
      setLoading(false);
    };
    load();
  }, [chatbotId]);

  const copy = async (value) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  if (loading) return <Loading />;

  const dashboardInstallEnabled =
    install?.dashboardInstallEnabled ??
    chatbot?.featureAccess?.authenticatedWidget ??
    false;
  const authSnippet = chatbot?.settings?.auth
    ? `<script>
window.MOMICRO_ASSIST_CONFIG = {
  ${JSON.stringify(chatbotId)}: {
    authClient: window.websiteSession.userId
  }
}
</script>`
    : "";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Heading level={3} className="font-display text-lg">
          {t("embedTitle")}
        </Heading>
        <Text className="text-sm text-zinc-600 dark:text-zinc-300">
          {t("embedBody")}
        </Text>
      </div>
      {chatbot?.settings?.auth ? (
        <InstallMethodCard
          title={t("authEnabledLabel")}
          body={t("pluginAuthBody")}
          ctaLabel={t("copyCode")}
          previewCode={createCodePreview(authSnippet)}
          onCopy={() => copy(authSnippet)}
        />
      ) : null}
      <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4">
          <InstallMethodCard
            title={t("scriptEmbed")}
            body={t("pluginScriptBody")}
            ctaLabel={t("copyCode")}
            previewCode={createCodePreview(install?.scriptSnippet)}
            onCopy={() => copy(install?.scriptSnippet)}
          />
          <InstallMethodCard
            title={t("iframeEmbed")}
            body={t("pluginIframeBody")}
            ctaLabel={t("copyCode")}
            previewCode={createCodePreview(install?.iframeSnippet)}
            onCopy={() => copy(install?.iframeSnippet)}
          />
          {dashboardInstallEnabled ? (
            <>
              <InstallMethodCard
                title={t("dashboardScriptEmbed")}
                body={t("dashboardScriptBody")}
                ctaLabel={t("copyCode")}
                previewCode={createCodePreview(install?.dashboardScriptSnippet)}
                onCopy={() => copy(install?.dashboardScriptSnippet)}
              />
              <InstallMethodCard
                title={t("dashboardIframeEmbed")}
                body={t("dashboardIframeBody")}
                ctaLabel={t("copyCode")}
                previewCode={createCodePreview(install?.dashboardIframeSnippet)}
                onCopy={() => copy(install?.dashboardIframeSnippet)}
              />
            </>
          ) : (
            <LockedInstallCard
              title={t("dashboardInstallLockedTitle")}
              body={t("dashboardInstallLockedBody")}
              ctaLabel={t("openBilling")}
              href={`/chatbots/${chatbotId}/billing`}
            />
          )}
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <Heading level={4} className="font-display text-base">
            {t("preview")}
          </Heading>
          <div className="mt-4">
            <ChatbotPreview settings={chatbot?.settings} />
          </div>
        </div>
      </div>
    </div>
  );
};
