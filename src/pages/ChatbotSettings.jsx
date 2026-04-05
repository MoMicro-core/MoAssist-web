import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useChatbot } from "../context/ChatbotContext";
import { Button } from "../ui/button";
import { Field, FieldGroup, Label } from "../ui/fieldset";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import { Switch } from "../ui/switch";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Loading } from "../components/Loading";
import { useI18n } from "../context/I18nContext";
import {
  PreviewHint,
  SettingsCard,
} from "../components/chatbot-settings/shared";

const splitList = (value) =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

const listToText = (value) => (value || []).join("\n");

const normalizeLanguageSelection = (defaultLanguage, languages = []) => {
  const next = [
    defaultLanguage,
    ...(Array.isArray(languages) ? languages : []).filter(Boolean),
  ].filter(Boolean);
  return [...new Set(next)];
};

const SimpleSwitchRow = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  hint,
}) => (
  <div className="flex items-start justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-zinc-950/50">
    <div className="space-y-1">
      <div className="text-sm font-semibold text-zinc-900 dark:text-white">
        {label}
      </div>
      {description ? (
        <Text className="text-sm text-zinc-600 dark:text-zinc-300">
          {description}
        </Text>
      ) : null}
      {hint ? <PreviewHint>{hint}</PreviewHint> : null}
    </div>
    <Switch checked={checked} onChange={onChange} color="sky" disabled={disabled} />
  </div>
);

export const ChatbotSettings = () => {
  const { chatbotId } = useParams();
  const { chatbot, loading, reload } = useChatbot();
  const { t } = useI18n();
  const fileInputRef = useRef(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [languageOptions, setLanguageOptions] = useState({
    defaultLanguage: "english",
    allowedLanguages: ["english"],
  });

  useEffect(() => {
    if (chatbot?.settings) {
      setDraft(chatbot.settings);
    }
  }, [chatbot]);

  useEffect(() => {
    let active = true;
    const loadFiles = async () => {
      setError("");
      try {
        const data = await api.chatbots.files(chatbotId);
        if (active) setFiles(data || []);
      } catch (err) {
        if (!active) return;
        setFiles([]);
        setError(err?.message || "Unable to load files");
      }
    };
    loadFiles();
    return () => {
      active = false;
    };
  }, [chatbotId]);

  useEffect(() => {
    let active = true;
    const loadLanguageOptions = async () => {
      try {
        const data = await api.chatbots.languages();
        if (!active || !data) return;
        setLanguageOptions({
          defaultLanguage: data.defaultLanguage || "english",
          allowedLanguages:
            data.allowedLanguages && data.allowedLanguages.length
              ? data.allowedLanguages
              : ["english"],
        });
      } catch {
        // keep local fallback if the endpoint is unavailable
      }
    };
    loadLanguageOptions();
    return () => {
      active = false;
    };
  }, []);

  const update = (field) => (event) => {
    setDraft((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const updateDefaultLanguage = (event) => {
    const nextDefaultLanguage = event.target.value;
    setDraft((prev) => ({
      ...prev,
      defaultLanguage: nextDefaultLanguage,
      enabledLanguages: normalizeLanguageSelection(
        nextDefaultLanguage,
        prev.enabledLanguages,
      ),
    }));
  };

  const toggleEnabledLanguage = (language) => {
    setDraft((prev) => {
      const defaultLanguage =
        prev.defaultLanguage || languageOptions.defaultLanguage || "english";
      if (language === defaultLanguage) return prev;
      const current = normalizeLanguageSelection(
        defaultLanguage,
        prev.enabledLanguages,
      );
      const next = current.includes(language)
        ? current.filter((item) => item !== language)
        : [...current, language];
      return {
        ...prev,
        enabledLanguages: normalizeLanguageSelection(defaultLanguage, next),
      };
    });
  };

  const updateBoolean = (field) => (value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const updateNumber =
    (field, fallback = 0) =>
    (event) => {
      const rawValue = event.target.value;
      const value = rawValue === "" ? fallback : Number(rawValue);
      setDraft((prev) => ({
        ...prev,
        [field]: Number.isFinite(value) ? value : fallback,
      }));
    };

  const updateAi = (field) => (event) => {
    setDraft((prev) => ({
      ...prev,
      ai: { ...(prev.ai || {}), [field]: event.target.value },
    }));
  };

  const updateAiBoolean = (field) => (value) => {
    setDraft((prev) => ({
      ...prev,
      ai: { ...(prev.ai || {}), [field]: value },
    }));
  };

  const updateDomains = (event) => {
    setDraft((prev) => ({ ...prev, domains: splitList(event.target.value) }));
  };

  const updateSuggested = (event) => {
    setDraft((prev) => ({
      ...prev,
      suggestedMessages: splitList(event.target.value),
    }));
  };

  const updateLeadsField = (index, field, value) => {
    setDraft((prev) => {
      const next = [...(prev.leadsForm || [])];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, leadsForm: next };
    });
  };

  const addLeadField = () => {
    setDraft((prev) => ({
      ...prev,
      leadsForm: [
        ...(prev.leadsForm || []),
        { key: "", label: "", type: "text", required: false },
      ],
    }));
  };

  const removeLeadField = (index) => {
    setDraft((prev) => ({
      ...prev,
      leadsForm: (prev.leadsForm || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await api.chatbots.update(chatbotId, draft);
      await reload();
    } catch (err) {
      setError(err?.message || "Unable to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (event) => {
    const selection = Array.from(event.target.files || []);
    if (!selection.length) return;
    setUploading(true);
    setError("");
    try {
      await api.chatbots.uploadFiles(chatbotId, selection);
      const data = await api.chatbots.files(chatbotId);
      setFiles(data || []);
    } catch (err) {
      setError(err?.message || "Unable to upload files");
    } finally {
      setUploading(false);
    }
    event.target.value = "";
  };

  const handleFileDelete = async (fileId) => {
    setError("");
    try {
      await api.chatbots.deleteFile(chatbotId, fileId);
      setFiles((prev) => prev.filter((file) => file.id !== fileId));
    } catch (err) {
      setError(err?.message || "Unable to delete file");
    }
  };

  const scrollToSection = (sectionId) => {
    const node = document.getElementById(sectionId);
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const domainText = useMemo(
    () => listToText(draft?.domains),
    [draft?.domains],
  );
  const suggestedText = useMemo(
    () => listToText(draft?.suggestedMessages),
    [draft?.suggestedMessages],
  );
  const availableLanguages = useMemo(
    () =>
      languageOptions.allowedLanguages?.length
        ? languageOptions.allowedLanguages
        : [languageOptions.defaultLanguage || "english"],
    [languageOptions],
  );
  const enabledLanguages = useMemo(
    () =>
      normalizeLanguageSelection(
        draft?.defaultLanguage || languageOptions.defaultLanguage || "english",
        draft?.enabledLanguages,
      ),
    [draft?.defaultLanguage, draft?.enabledLanguages, languageOptions],
  );
  const featureAccess = chatbot?.featureAccess || {
    authenticatedWidget: false,
    aiResponder: false,
    knowledgeFiles: false,
    customBranding: false,
  };
  const currentTier = chatbot?.currentTier || null;
  const isPublished = (draft?.status || "draft") === "published";
  const extraLanguages = enabledLanguages.filter(
    (language) =>
      language !==
      (draft?.defaultLanguage || languageOptions.defaultLanguage || "english"),
  );
  const sectionChips = [
    { id: "settings-quick", label: "Quick controls" },
    { id: "settings-basics", label: t("basics") },
    { id: "settings-widget", label: "Website & chat" },
    { id: "settings-localization", label: "Languages" },
    { id: "settings-leads", label: t("leadForm") },
    { id: "settings-ai", label: t("aiConfig") },
    { id: "settings-files", label: t("knowledgeFiles") },
  ];

  if (loading || !draft) return <Loading />;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Heading level={3} className="font-display text-lg">
            {t("chatbotSettings")}
          </Heading>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            Keep this page for the main chatbot behavior only. Design and visual
            customization live in the separate appearance tab.
          </Text>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button outline href={`/chatbots/${chatbotId}/appearance`}>
            {t("appearance")}
          </Button>
          <Button color="sky" onClick={handleSave} disabled={saving}>
            {saving ? t("saving") : t("saveChanges")}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <SettingsCard
        title={t("billingAccessTitle")}
        description={t("billingAccessBody")}
        actions={
          <Button outline href={`/chatbots/${chatbotId}/billing`}>
            {t("openBilling")}
          </Button>
        }
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-zinc-950/50">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              {t("planLabel")}
            </div>
            <div className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
              {currentTier?.name || chatbot?.premiumPlan || "Free"}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-zinc-950/50">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              Signed-in support
            </div>
            <div className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
              {featureAccess.authenticatedWidget ? "Included" : "Upgrade required"}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-zinc-950/50">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              AI replies
            </div>
            <div className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
              {featureAccess.aiResponder ? "Included" : "Upgrade required"}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-zinc-950/50">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              Knowledge files
            </div>
            <div className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
              {featureAccess.knowledgeFiles ? "Included" : "Upgrade required"}
            </div>
          </div>
        </div>
      </SettingsCard>

      <div className="flex flex-wrap gap-2">
        {sectionChips.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            className="chip-control"
          >
            {section.label}
          </button>
        ))}
      </div>

      <SettingsCard
        id="settings-quick"
        title="Quick controls"
        description="Use simple switches for the main chatbot behavior."
      >
        <div className="space-y-3">
          <SimpleSwitchRow
            label={t("statusPublished")}
            description="Turn the chatbot live on your allowed domains when you are ready."
            checked={isPublished}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                status: value ? "published" : "draft",
              }))
            }
          />
          <SimpleSwitchRow
            label={t("authEnabledLabel")}
            description="Connect conversations to signed-in website customers."
            checked={Boolean(draft.auth)}
            onChange={updateBoolean("auth")}
            disabled={!featureAccess.authenticatedWidget}
            hint={
              featureAccess.authenticatedWidget
                ? t("authClientHelp")
                : t("authUpgradeHint")
            }
          />
          <SimpleSwitchRow
            label={t("enableAiLabel")}
            description="Let AI answer routine questions from your uploaded business knowledge."
            checked={Boolean(draft.ai?.enabled)}
            onChange={updateAiBoolean("enabled")}
            disabled={!featureAccess.aiResponder}
            hint={
              featureAccess.aiResponder ? t("aiPlanHint") : t("aiUpgradeHint")
            }
          />
        </div>
      </SettingsCard>

      <SettingsCard
        id="settings-basics"
        title={t("basics")}
        description="Set the name and the basic text customers see when the chat opens."
      >
        <FieldGroup>
          <Field>
            <Label>{t("titleLabel")}</Label>
            <Input value={draft.title || ""} onChange={update("title")} />
          </Field>
          <Field>
            <Label>{t("botNameLabel")}</Label>
            <Input value={draft.botName || ""} onChange={update("botName")} />
          </Field>
          <Field>
            <Label>{t("initialMessageLabel")}</Label>
            <Textarea
              value={draft.initialMessage || ""}
              onChange={update("initialMessage")}
              rows={3}
            />
          </Field>
          <Field>
            <Label>{t("inputPlaceholderLabel")}</Label>
            <Input
              value={draft.inputPlaceholder || ""}
              onChange={update("inputPlaceholder")}
            />
          </Field>
        </FieldGroup>
      </SettingsCard>

      <SettingsCard
        id="settings-widget"
        title="Website & chat flow"
        description="Choose where the widget can run and what customers see first when the conversation starts."
      >
        <FieldGroup>
          <Field>
            <Label>{t("inactivityHoursLabel")}</Label>
            <Input
              type="number"
              min={1}
              max={24}
              value={draft.inactivityHours ?? 3}
              onChange={updateNumber("inactivityHours", 3)}
            />
            <PreviewHint>
              Use 1 to 24 hours. After this timeout, regular chats close and
              authenticated chats move to pending.
            </PreviewHint>
          </Field>
          <Field>
            <Label>{t("allowedDomainsLabel")}</Label>
            <Textarea
              value={domainText}
              onChange={updateDomains}
              rows={4}
              placeholder={"app.example.com\nwww.example.com"}
            />
            <PreviewHint>
              Add one domain per line. The chatbot will load only on these
              websites.
            </PreviewHint>
          </Field>
          <Field>
            <Label>{t("suggestedMessagesLabel")}</Label>
            <Textarea
              value={suggestedText}
              onChange={updateSuggested}
              rows={4}
              placeholder={
                "What are your prices?\nHow can I contact support?"
              }
            />
            <PreviewHint>
              These are the starter questions shown to customers before they
              type their own message.
            </PreviewHint>
          </Field>
        </FieldGroup>
      </SettingsCard>

      <SettingsCard
        id="settings-localization"
        title="Languages"
        description="Choose one main language and only the extra languages you want to publish."
      >
        <FieldGroup>
          <Field>
            <Label>{t("defaultLanguageSetting")}</Label>
            <Select
              value={draft.defaultLanguage || languageOptions.defaultLanguage}
              onChange={updateDefaultLanguage}
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
            <div className="space-y-3">
              {availableLanguages.map((language) => {
                const selected = enabledLanguages.includes(language);
                const isDefault =
                  language ===
                  (draft.defaultLanguage || languageOptions.defaultLanguage);
                return (
                  <div
                    key={language}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-zinc-950/50"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {language}
                        {isDefault ? ` • ${t("defaultLanguageShort")}` : ""}
                      </div>
                      <Text className="text-sm text-zinc-600 dark:text-zinc-300">
                        {isDefault
                          ? "This language stays on because it is the main language."
                          : "Turn this on if you want the chatbot available in this language."}
                      </Text>
                    </div>
                    <Switch
                      checked={selected}
                      onChange={() => toggleEnabledLanguage(language)}
                      color="sky"
                      disabled={isDefault}
                    />
                  </div>
                );
              })}
            </div>
            <PreviewHint>{t("enabledLanguagesHelp")}</PreviewHint>
          </Field>
        </FieldGroup>
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-zinc-950/50">
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">
            Extra languages selected:{" "}
            {extraLanguages.length ? extraLanguages.join(", ") : "none"}
          </Text>
        </div>
      </SettingsCard>

      <SettingsCard
        id="settings-leads"
        title={t("leadForm")}
        description="Choose the customer details you want to collect before your team follows up."
      >
        <FieldGroup>
          <Field>
            <Label>{t("formTitleLabel")}</Label>
            <Input
              value={draft.leadsFormTitle || ""}
              onChange={update("leadsFormTitle")}
            />
          </Field>
        </FieldGroup>
        <div className="space-y-3">
          {(draft.leadsForm || []).map((field, index) => (
            <div
              key={`${field.key}-${index}`}
              className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-zinc-950/50"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <Label>{t("keyLabel")}</Label>
                  <Input
                    value={field.key}
                    onChange={(event) =>
                      updateLeadsField(index, "key", event.target.value)
                    }
                  />
                </Field>
                <Field>
                  <Label>{t("labelLabel")}</Label>
                  <Input
                    value={field.label}
                    onChange={(event) =>
                      updateLeadsField(index, "label", event.target.value)
                    }
                  />
                </Field>
                <Field>
                  <Label>{t("typeLabel")}</Label>
                  <Select
                    value={field.type}
                    onChange={(event) =>
                      updateLeadsField(index, "type", event.target.value)
                    }
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </Select>
                </Field>
                <Field>
                  <Label>{t("requiredLabel")}</Label>
                  <div className="pt-2">
                    <Switch
                      checked={Boolean(field.required)}
                      onChange={(value) =>
                        updateLeadsField(index, "required", value)
                      }
                      color="sky"
                    />
                  </div>
                </Field>
              </div>
              <div className="mt-4 flex justify-end">
                <Button outline onClick={() => removeLeadField(index)}>
                  {t("remove")}
                </Button>
              </div>
            </div>
          ))}
          {!(draft.leadsForm || []).length ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
              No lead fields yet. Add the first field you want to collect.
            </div>
          ) : null}
        </div>
        <Button outline onClick={addLeadField}>
          {t("addField")}
        </Button>
      </SettingsCard>

      <SettingsCard
        id="settings-ai"
        title={t("aiConfig")}
        description="Choose whether AI should reply, how long replies should be, and which guidelines it should follow."
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-zinc-950/50">
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">
              AI replies are currently{" "}
              <span className="font-semibold text-zinc-900 dark:text-white">
                {draft.ai?.enabled ? "enabled" : "disabled"}
              </span>
              . Use Quick controls above to switch them on or off.
            </Text>
          </div>
          <FieldGroup>
            <Field>
              <Label>{t("responseLengthLabel")}</Label>
              <Select
                value={draft.ai?.responseLength || "medium"}
                onChange={updateAi("responseLength")}
                disabled={!featureAccess.aiResponder || !draft.ai?.enabled}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </Select>
            </Field>
            <Field>
              <Label>{t("guidelinesLabel")}</Label>
              <Textarea
                value={draft.ai?.guidelines || ""}
                onChange={updateAi("guidelines")}
                rows={4}
                disabled={!featureAccess.aiResponder || !draft.ai?.enabled}
              />
            </Field>
            <Field>
              <Label>{t("templateLabel")}</Label>
              <Input
                value={draft.ai?.template || ""}
                onChange={updateAi("template")}
                disabled={!featureAccess.aiResponder || !draft.ai?.enabled}
              />
              <PreviewHint>
                Keep this empty unless you need a custom AI template.
              </PreviewHint>
            </Field>
          </FieldGroup>
        </div>
      </SettingsCard>

      <SettingsCard
        id="settings-files"
        title={t("knowledgeFiles")}
        description="Upload the source material the assistant should use when it answers customer questions."
        actions={
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.txt,.json"
              disabled={uploading || !featureAccess.knowledgeFiles}
            />
            <Button
              type="button"
              outline
              disabled={uploading || !featureAccess.knowledgeFiles}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? t("uploading") : t("uploadFiles")}
            </Button>
          </div>
        }
      >
        {!featureAccess.knowledgeFiles ? (
          <PreviewHint>{t("knowledgeUpgradeHint")}</PreviewHint>
        ) : null}
        <div className="overflow-hidden rounded-xl border border-zinc-100 dark:border-white/5">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Size</TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>
                    <Badge color={file.status === "ready" ? "emerald" : "zinc"}>
                      {file.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{Math.round(file.size / 1024)} KB</TableCell>
                  <TableCell>
                    <Button outline onClick={() => handleFileDelete(file.id)}>
                      {t("delete")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {files.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Text className="text-sm text-zinc-500">
                      {t("noFiles")}
                    </Text>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </SettingsCard>
    </div>
  );
};
