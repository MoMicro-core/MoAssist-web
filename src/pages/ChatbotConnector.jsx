import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import { Button } from "../ui/button";
import { Field, FieldGroup, Label } from "../ui/fieldset";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Loading } from "../components/Loading";
import {
  SettingsCard,
  PreviewHint,
} from "../components/chatbot-settings/shared";

const EMPTY_FORM = {
  enabled: false,
  baseUrl: "",
  allowedHosts: "",
  source: "",
  intentsText: "[]",
  secretsText: "",
  routerThreshold: "0.35",
  routerMargin: "0.05",
};

const textareaClassName =
  "w-full rounded-xl border border-zinc-200 bg-white p-3 font-mono text-xs leading-5 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200";

export const ChatbotConnector = () => {
  const { chatbotId } = useParams();
  const { t } = useI18n();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [meta, setMeta] = useState({ version: "", hasSecrets: false });
  const [saving, setSaving] = useState(false);
  const [resyncing, setResyncing] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return undefined;
    }
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const status = await api.chatbots.connector(chatbotId);
        if (!active) return;
        setForm({
          enabled: Boolean(status?.enabled),
          baseUrl: status?.baseUrl || "",
          allowedHosts: (status?.allowedHosts || []).join(", "),
          source: status?.source || "",
          intentsText: JSON.stringify(status?.intents || [], null, 2),
          secretsText: "",
          routerThreshold: String(status?.routerThreshold ?? 0.35),
          routerMargin: String(status?.routerMargin ?? 0.05),
        });
        setMeta({
          version: status?.version || "",
          hasSecrets: Boolean(status?.hasSecrets),
        });
      } catch {
        // 404 means no connector yet; start from the empty form.
        if (active) setForm(EMPTY_FORM);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [chatbotId, isAdmin]);

  const setField = (key) => (value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const parseJsonField = (text, label) => {
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`${t("connectorInvalidJson")} ${label}`);
    }
  };

  const save = async () => {
    setFeedback({ type: "", message: "" });
    setSaving(true);
    try {
      const intents = parseJsonField(
        form.intentsText || "[]",
        t("connectorIntents"),
      );
      const payload = {
        source: form.source,
        enabled: form.enabled,
        baseUrl: form.baseUrl.trim(),
        allowedHosts: form.allowedHosts
          .split(",")
          .map((host) => host.trim())
          .filter(Boolean),
        intents,
        routerThreshold: Number(form.routerThreshold),
        routerMargin: Number(form.routerMargin),
      };
      if (form.secretsText.trim()) {
        payload.secrets = parseJsonField(
          form.secretsText,
          t("connectorSecrets"),
        );
      }
      const status = await api.chatbots.setConnector(chatbotId, payload);
      setMeta({
        version: status?.version || "",
        hasSecrets: Boolean(status?.hasSecrets),
      });
      setForm((prev) => ({ ...prev, secretsText: "" }));
      setFeedback({ type: "success", message: t("connectorSaved") });
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const resync = async () => {
    setFeedback({ type: "", message: "" });
    setResyncing(true);
    try {
      await api.chatbots.resyncConnector(chatbotId);
      setFeedback({ type: "success", message: t("connectorResynced") });
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setResyncing(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Heading level={3} className="font-display text-lg">
          {t("connectorTitle")}
        </Heading>
        <Text className="text-sm text-zinc-600 dark:text-zinc-300">
          {t("connectorBody")}
        </Text>
      </div>

      {!isAdmin ? (
        <SettingsCard title={t("connectorTitle")}>
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">
            {t("connectorAdminOnly")}
          </Text>
        </SettingsCard>
      ) : (
        <>
          <SettingsCard title={t("connectorTitle")}>
            <FieldGroup>
              <div className="flex items-start justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-zinc-950/50">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {t("connectorEnableLabel")}
                  </div>
                  <Text className="text-sm text-zinc-600 dark:text-zinc-300">
                    {t("connectorEnableDesc")}
                  </Text>
                </div>
                <Switch
                  checked={form.enabled}
                  onChange={setField("enabled")}
                  color="sky"
                />
              </div>

              {meta.version ? (
                <PreviewHint>
                  {t("connectorVersion")}: {meta.version.slice(0, 12)}…
                </PreviewHint>
              ) : (
                <PreviewHint>{t("connectorNotConfigured")}</PreviewHint>
              )}

              <Field>
                <Label>{t("connectorBaseUrl")}</Label>
                <Input
                  value={form.baseUrl}
                  placeholder="https://api.merchant.com"
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(event) => setField("baseUrl")(event.target.value)}
                />
              </Field>

              <Field>
                <Label>{t("connectorAllowedHosts")}</Label>
                <Input
                  value={form.allowedHosts}
                  placeholder="api.merchant.com, auth.merchant.com"
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(event) =>
                    setField("allowedHosts")(event.target.value)
                  }
                />
                <PreviewHint>{t("connectorAllowedHostsHint")}</PreviewHint>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label>{t("connectorThreshold")}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={form.routerThreshold}
                    onChange={(event) =>
                      setField("routerThreshold")(event.target.value)
                    }
                  />
                </Field>
                <Field>
                  <Label>{t("connectorMargin")}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={form.routerMargin}
                    onChange={(event) =>
                      setField("routerMargin")(event.target.value)
                    }
                  />
                </Field>
              </div>

              <Field>
                <Label>{t("connectorSecrets")}</Label>
                <textarea
                  rows={4}
                  className={textareaClassName}
                  value={form.secretsText}
                  placeholder={
                    meta.hasSecrets
                      ? t("connectorSecretsSet")
                      : '{ "apiKey": "..." }'
                  }
                  spellCheck={false}
                  onChange={(event) =>
                    setField("secretsText")(event.target.value)
                  }
                />
                <PreviewHint>{t("connectorSecretsHint")}</PreviewHint>
              </Field>
            </FieldGroup>
          </SettingsCard>

          <SettingsCard title={t("connectorIntents")}>
            <FieldGroup>
              <Field>
                <textarea
                  rows={10}
                  className={textareaClassName}
                  value={form.intentsText}
                  spellCheck={false}
                  onChange={(event) =>
                    setField("intentsText")(event.target.value)
                  }
                />
                <PreviewHint>{t("connectorIntentsHint")}</PreviewHint>
              </Field>
            </FieldGroup>
          </SettingsCard>

          <SettingsCard title={t("connectorSource")}>
            <FieldGroup>
              <Field>
                <textarea
                  rows={18}
                  className={textareaClassName}
                  value={form.source}
                  placeholder="module.exports = { verifyIdentity, loadSnapshot, fetchContext };"
                  spellCheck={false}
                  onChange={(event) => setField("source")(event.target.value)}
                />
                <PreviewHint>{t("connectorSourceHint")}</PreviewHint>
              </Field>

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={save} disabled={saving || !form.source.trim()}>
                  {saving ? t("connectorSaving") : t("connectorSave")}
                </Button>
                <Button
                  outline
                  onClick={resync}
                  disabled={resyncing || !meta.version}
                >
                  {resyncing ? t("connectorSaving") : t("connectorResync")}
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
        </>
      )}
    </div>
  );
};
