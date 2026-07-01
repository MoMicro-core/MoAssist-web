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

const MobileInstallCard = ({
  title,
  body,
  url,
  urlLabel,
  copyLabel,
  onCopyUrl,
  snippets,
  onCopySnippet,
}) => (
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
        <Button
          outline
          onClick={onCopyUrl}
          aria-label={copyLabel}
          title={copyLabel}
        >
          <ClipboardDocumentIcon data-slot="icon" />
          {copyLabel}
        </Button>
      </div>
      <div className="space-y-2">
        <Text className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          {urlLabel}
        </Text>
        <pre className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
          {url}
        </pre>
      </div>
      <div className="space-y-3">
        {snippets.map((snippet) => (
          <div key={snippet.label} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <Text className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                {snippet.label}
              </Text>
              <Button
                outline
                onClick={() => onCopySnippet(snippet.code)}
                aria-label={copyLabel}
                title={copyLabel}
              >
                <ClipboardDocumentIcon data-slot="icon" />
                {copyLabel}
              </Button>
            </div>
            <pre className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
              {snippet.code}
            </pre>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const buildMobileSnippets = (url) => {
  if (!url) return [];
  return [
    {
      label: "iOS — Swift (WKWebView)",
      code: `let webView = WKWebView(frame: view.bounds)
webView.isOpaque = false // transparent so the launcher floats
webView.load(URLRequest(url: URL(string: "${url}")!))
view.addSubview(webView)`,
    },
    {
      label: "Android — Kotlin (WebView)",
      code: `val webView = WebView(this)
webView.settings.javaScriptEnabled = true
webView.settings.domStorageEnabled = true
webView.setBackgroundColor(Color.TRANSPARENT)
webView.loadUrl("${url}")
setContentView(webView)`,
    },
    {
      label: "React Native (react-native-webview)",
      code: `import { WebView } from 'react-native-webview';

<WebView
  source={{ uri: '${url}' }}
  style={{ backgroundColor: 'transparent' }}
/>;`,
    },
    {
      label: "Flutter (webview_flutter)",
      code: `final controller = WebViewController()
  ..setJavaScriptMode(JavaScriptMode.unrestricted)
  ..setBackgroundColor(Colors.transparent)
  ..loadRequest(Uri.parse('${url}'));`,
    },
  ];
};

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
      <div className="space-y-4">
        <InstallMethodCard
          title={t("scriptEmbed")}
          body={t("pluginScriptBody")}
          ctaLabel={t("copyCode")}
          previewCode={createCodePreview(install?.scriptSnippet)}
          onCopy={() => copy(install?.scriptSnippet)}
        />
        <MobileInstallCard
          title={t("mobileEmbed")}
          body={t("pluginMobileBody")}
          url={install?.mobileUrl || ""}
          urlLabel={t("mobileUrlLabel")}
          copyLabel={t("copyCode")}
          onCopyUrl={() => copy(install?.mobileUrl)}
          snippets={buildMobileSnippets(install?.mobileUrl || "")}
          onCopySnippet={(code) => copy(code)}
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
    </div>
  );
};
