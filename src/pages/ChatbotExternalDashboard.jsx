import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { api } from "../lib/api";
import { useChatbot } from "../context/ChatbotContext";
import { useI18n } from "../context/I18nContext";
import { Button } from "../ui/button";
import { Field, FieldGroup, Label } from "../ui/fieldset";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Loading } from "../components/Loading";
import { SettingsCard, PreviewHint } from "../components/chatbot-settings/shared";

export const ChatbotExternalDashboard = () => {
  const { chatbotId } = useParams();
  const { t } = useI18n();
  const { chatbot } = useChatbot();
  const [loading, setLoading] = useState(true);
  const [install, setInstall] = useState(null);
  const [form, setForm] = useState({
    enabled: false,
    username: "",
    password: "",
  });
  const [hasPassword, setHasPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const unlocked = chatbot?.featureAccess?.authenticatedWidget ?? false;

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const [status, installData] = await Promise.all([
          api.chatbots.externalDashboard(chatbotId),
          api.chatbots.install(chatbotId),
        ]);
        if (!active) return;
        setForm({
          enabled: Boolean(status?.enabled),
          username: status?.username || "",
          password: "",
        });
        setHasPassword(Boolean(status?.hasPassword));
        setInstall(installData);
      } catch {
        // Locked tiers return 403; the locked card is shown instead.
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [chatbotId]);

  const copy = async (value) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  const save = async () => {
    setFeedback({ type: "", message: "" });
    setSaving(true);
    try {
      const payload = {
        enabled: form.enabled,
        username: form.username.trim(),
      };
      if (form.password) payload.password = form.password;
      const status = await api.chatbots.setExternalDashboard(chatbotId, payload);
      setForm({
        enabled: Boolean(status?.enabled),
        username: status?.username || "",
        password: "",
      });
      setHasPassword(Boolean(status?.hasPassword));
      setShowPassword(false);
      setFeedback({ type: "success", message: t("externalDashboardSaved") });
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Heading level={3} className="font-display text-lg">
          {t("externalDashboardTitle")}
        </Heading>
        <Text className="text-sm text-zinc-600 dark:text-zinc-300">
          {t("externalDashboardBody")}
        </Text>
      </div>

      {!unlocked ? (
        <SettingsCard
          title={t("dashboardInstallLockedTitle")}
          description={t("dashboardInstallLockedBody")}
          actions={
            <Button outline href={`/chatbots/${chatbotId}/billing`}>
              {t("openBilling")}
            </Button>
          }
        />
      ) : (
        <>
          <SettingsCard title={t("externalDashboardTitle")}>
            <FieldGroup>
              <div className="flex items-start justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-zinc-950/50">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {t("externalDashboardEnableLabel")}
                  </div>
                  <Text className="text-sm text-zinc-600 dark:text-zinc-300">
                    {t("externalDashboardEnableDesc")}
                  </Text>
                </div>
                <Switch
                  checked={form.enabled}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, enabled: value }))
                  }
                  color="sky"
                />
              </div>

              <Field>
                <Label>{t("externalDashboardUsername")}</Label>
                <Input
                  value={form.username}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      username: event.target.value,
                    }))
                  }
                />
              </Field>

              <Field>
                <Label>{t("externalDashboardPassword")}</Label>
                <div className="flex items-stretch gap-2">
                  <div className="min-w-0 flex-1">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      autoComplete="new-password"
                      placeholder={
                        hasPassword ? t("externalDashboardPasswordKeep") : ""
                      }
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          password: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="shrink-0 rounded-lg border border-zinc-950/10 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/5"
                  >
                    {showPassword
                      ? t("externalDashboardHide")
                      : t("externalDashboardShow")}
                  </button>
                </div>
                <PreviewHint>
                  {hasPassword
                    ? t("externalDashboardPasswordKeep")
                    : t("externalDashboardPasswordSet")}
                </PreviewHint>
              </Field>

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={save} disabled={saving}>
                  {saving
                    ? t("externalDashboardSaving")
                    : t("externalDashboardSave")}
                </Button>
                {feedback.message ? (
                  <Text
                    role="status"
                    aria-live="polite"
                    className={
                      feedback.type === "error"
                        ? "text-sm text-red-600 dark:text-red-400"
                        : "text-sm text-emerald-600 dark:text-emerald-400"
                    }
                  >
                    {feedback.message}
                  </Text>
                ) : null}
              </div>
            </FieldGroup>
          </SettingsCard>

          {install?.dashboardScriptSnippet ? (
            <SettingsCard
              title={t("externalDashboardEmbedTitle")}
              description={t("externalDashboardEmbedBody")}
              actions={
                <Button
                  outline
                  onClick={() => copy(install.dashboardScriptSnippet)}
                >
                  <ClipboardDocumentIcon data-slot="icon" />
                  {t("copyCode")}
                </Button>
              }
            >
              <pre className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
                {install.dashboardScriptSnippet}
              </pre>
              <PreviewHint>{t("externalDashboardEmbedHint")}</PreviewHint>
            </SettingsCard>
          ) : null}
        </>
      )}
    </div>
  );
};
