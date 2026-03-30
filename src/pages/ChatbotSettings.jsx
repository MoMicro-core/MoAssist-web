import { useEffect, useMemo, useState } from "react";
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
import { ChatbotPreview } from "../components/ChatbotPreview";
import { useI18n } from "../context/I18nContext";

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

const normalizeColor = (value, fallback = "#099ad9") => {
  if (typeof value !== "string") return fallback;
  const input = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(input)) return input;
  if (/^#[0-9a-fA-F]{3}$/.test(input)) {
    const [r, g, b] = input.slice(1);
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return fallback;
};

const ColorField = ({
  label,
  value,
  onTextChange,
  onColorChange,
  fallback = "#099ad9",
}) => (
  <Field>
    <Label>{label}</Label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={normalizeColor(value, fallback)}
        onChange={(event) => onColorChange(event.target.value)}
        className="h-10 w-12 cursor-pointer rounded-lg border border-zinc-300 bg-white p-1 dark:border-white/20 dark:bg-zinc-900"
      />
      <Input
        value={value || ""}
        onChange={onTextChange}
        placeholder={normalizeColor(value, fallback).toUpperCase()}
      />
    </div>
  </Field>
);

const SettingsCard = ({ id, title, description, actions, children }) => (
  <section
    id={id}
    className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900"
  >
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="space-y-1">
        <Heading level={4} className="font-display text-base">
          {title}
        </Heading>
        {description ? (
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </Text>
        ) : null}
      </div>
      {actions}
    </div>
    {children}
  </section>
);

const PartButton = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={active ? "chip-control chip-control-active" : "chip-control"}
  >
    {label}
  </button>
);

const PreviewHint = ({ children }) => (
  <Text className="text-xs text-zinc-500 dark:text-zinc-400">{children}</Text>
);

const themeFallbacks = {
  light: {
    accentColor: "#099ad9",
    accentTextColor: "#fcfff8",
    backgroundColor: "#fcfff8",
    surfaceColor: "#ffffff",
    textColor: "#173a55",
    borderColor: "#beebf0",
  },
  dark: {
    accentColor: "#5cd7d3",
    accentTextColor: "#0b1c2a",
    backgroundColor: "#0b1c2a",
    surfaceColor: "#102536",
    textColor: "#ecfdff",
    borderColor: "#214d6f",
  },
};

const previewTargets = [
  { id: "header", label: "Header" },
  { id: "assistantBubble", label: "Assistant bubble" },
  { id: "visitorBubble", label: "Visitor bubble" },
  { id: "suggested", label: "Suggested chips" },
  { id: "composer", label: "Composer" },
  { id: "launcher", label: "Launcher" },
  { id: "canvas", label: "Canvas" },
];

export const ChatbotSettings = () => {
  const { chatbotId } = useParams();
  const { chatbot, loading, reload } = useChatbot();
  const { t } = useI18n();
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState("light");
  const [selectedPreviewPart, setSelectedPreviewPart] = useState("header");
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

  const updateBrand = (field) => (event) => {
    setDraft((prev) => ({
      ...prev,
      brand: { ...(prev.brand || {}), [field]: event.target.value },
    }));
  };

  const setThemeValue = (mode, field, value) => {
    setDraft((prev) => ({
      ...prev,
      theme: {
        ...(prev.theme || {}),
        [mode]: { ...(prev.theme?.[mode] || {}), [field]: value },
      },
    }));
  };

  const updateTheme = (mode, field) => (event) => {
    setThemeValue(mode, field, event.target.value);
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
  const translationCoverage = useMemo(
    () =>
      enabledLanguages.filter(
        (language) =>
          draft?.translations?.[language] &&
          typeof draft.translations[language] === "object",
      ).length,
    [draft?.translations, enabledLanguages],
  );
  const featureAccess = chatbot?.featureAccess || {
    authenticatedWidget: false,
    aiResponder: false,
    knowledgeFiles: false,
  };
  const currentTier = chatbot?.currentTier || null;
  const paletteFallback = themeFallbacks[previewMode];
  const sectionChips = [
    { id: "settings-basics", label: t("basics") },
    { id: "settings-ui", label: "UI studio" },
    { id: "settings-conversation", label: t("conversationBehavior") },
    { id: "settings-localization", label: "Localization" },
    { id: "settings-domains", label: t("domains") },
    { id: "settings-leads", label: t("leadForm") },
    { id: "settings-ai", label: t("aiConfig") },
    { id: "settings-files", label: t("knowledgeFiles") },
  ];

  if (loading || !draft) return <Loading />;

  const renderFocusedUiControls = () => {
    switch (selectedPreviewPart) {
      case "header":
        return (
          <FieldGroup>
            <Field>
              <Label>{t("botNameLabel")}</Label>
              <Input value={draft.botName || ""} onChange={update("botName")} />
            </Field>
            <Field>
              <Label>{t("logoUrlLabel")}</Label>
              <Input
                value={draft.brand?.logoUrl || ""}
                onChange={updateBrand("logoUrl")}
              />
            </Field>
            <ColorField
              label={`${previewMode === "light" ? "Light" : "Dark"} background`}
              value={draft.theme?.[previewMode]?.backgroundColor || ""}
              onTextChange={updateTheme(previewMode, "backgroundColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "backgroundColor", value)
              }
              fallback={paletteFallback.backgroundColor}
            />
            <ColorField
              label={`${previewMode === "light" ? "Light" : "Dark"} text`}
              value={draft.theme?.[previewMode]?.textColor || ""}
              onTextChange={updateTheme(previewMode, "textColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "textColor", value)
              }
              fallback={paletteFallback.textColor}
            />
          </FieldGroup>
        );
      case "assistantBubble":
        return (
          <FieldGroup>
            <Field>
              <Label>{t("initialMessageLabel")}</Label>
              <Textarea
                rows={3}
                value={draft.initialMessage || ""}
                onChange={update("initialMessage")}
              />
            </Field>
            <ColorField
              label="Bubble surface"
              value={draft.theme?.[previewMode]?.surfaceColor || ""}
              onTextChange={updateTheme(previewMode, "surfaceColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "surfaceColor", value)
              }
              fallback={paletteFallback.surfaceColor}
            />
            <ColorField
              label="Bubble text"
              value={draft.theme?.[previewMode]?.textColor || ""}
              onTextChange={updateTheme(previewMode, "textColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "textColor", value)
              }
              fallback={paletteFallback.textColor}
            />
            <ColorField
              label="Bubble border"
              value={draft.theme?.[previewMode]?.borderColor || ""}
              onTextChange={updateTheme(previewMode, "borderColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "borderColor", value)
              }
              fallback={paletteFallback.borderColor}
            />
          </FieldGroup>
        );
      case "visitorBubble":
        return (
          <FieldGroup>
            <Field>
              <Label>{t("suggestedMessagesLabel")}</Label>
              <Textarea
                value={suggestedText}
                onChange={updateSuggested}
                rows={3}
              />
            </Field>
            <ColorField
              label="Accent"
              value={draft.theme?.[previewMode]?.accentColor || ""}
              onTextChange={updateTheme(previewMode, "accentColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "accentColor", value)
              }
              fallback={paletteFallback.accentColor}
            />
            <ColorField
              label="Accent text"
              value={draft.theme?.[previewMode]?.accentTextColor || ""}
              onTextChange={updateTheme(previewMode, "accentTextColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "accentTextColor", value)
              }
              fallback={paletteFallback.accentTextColor}
            />
          </FieldGroup>
        );
      case "suggested":
        return (
          <FieldGroup>
            <Field>
              <Label>{t("suggestedMessagesLabel")}</Label>
              <Textarea
                value={suggestedText}
                onChange={updateSuggested}
                rows={4}
              />
            </Field>
            <ColorField
              label="Chip surface"
              value={draft.theme?.[previewMode]?.surfaceColor || ""}
              onTextChange={updateTheme(previewMode, "surfaceColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "surfaceColor", value)
              }
              fallback={paletteFallback.surfaceColor}
            />
            <ColorField
              label="Chip border"
              value={draft.theme?.[previewMode]?.borderColor || ""}
              onTextChange={updateTheme(previewMode, "borderColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "borderColor", value)
              }
              fallback={paletteFallback.borderColor}
            />
          </FieldGroup>
        );
      case "composer":
        return (
          <FieldGroup>
            <Field>
              <Label>{t("inputPlaceholderLabel")}</Label>
              <Input
                value={draft.inputPlaceholder || ""}
                onChange={update("inputPlaceholder")}
              />
            </Field>
            <ColorField
              label="Composer border"
              value={draft.theme?.[previewMode]?.borderColor || ""}
              onTextChange={updateTheme(previewMode, "borderColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "borderColor", value)
              }
              fallback={paletteFallback.borderColor}
            />
            <ColorField
              label="Send accent"
              value={draft.theme?.[previewMode]?.accentColor || ""}
              onTextChange={updateTheme(previewMode, "accentColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "accentColor", value)
              }
              fallback={paletteFallback.accentColor}
            />
            <ColorField
              label="Send text"
              value={draft.theme?.[previewMode]?.accentTextColor || ""}
              onTextChange={updateTheme(previewMode, "accentTextColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "accentTextColor", value)
              }
              fallback={paletteFallback.accentTextColor}
            />
          </FieldGroup>
        );
      case "launcher":
        return (
          <FieldGroup>
            <Field>
              <Label>{t("widgetLocationLabel")}</Label>
              <Select
                value={draft.widgetLocation || "right"}
                onChange={update("widgetLocation")}
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
              </Select>
            </Field>
            <Field>
              <Label>{t("bubbleIconUrlLabel")}</Label>
              <Input
                value={draft.brand?.bubbleIconUrl || ""}
                onChange={updateBrand("bubbleIconUrl")}
              />
            </Field>
            <Field>
              <Label>{t("roundedCornersLabel")}</Label>
              <Switch
                checked={Boolean(draft.rounded)}
                onChange={updateBoolean("rounded")}
                color="sky"
              />
            </Field>
            <ColorField
              label="Launcher accent"
              value={draft.theme?.[previewMode]?.accentColor || ""}
              onTextChange={updateTheme(previewMode, "accentColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "accentColor", value)
              }
              fallback={paletteFallback.accentColor}
            />
          </FieldGroup>
        );
      case "canvas":
      default:
        return (
          <FieldGroup>
            <ColorField
              label="Canvas background"
              value={draft.theme?.[previewMode]?.backgroundColor || ""}
              onTextChange={updateTheme(previewMode, "backgroundColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "backgroundColor", value)
              }
              fallback={paletteFallback.backgroundColor}
            />
            <ColorField
              label="Panel surface"
              value={draft.theme?.[previewMode]?.surfaceColor || ""}
              onTextChange={updateTheme(previewMode, "surfaceColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "surfaceColor", value)
              }
              fallback={paletteFallback.surfaceColor}
            />
            <ColorField
              label="Border"
              value={draft.theme?.[previewMode]?.borderColor || ""}
              onTextChange={updateTheme(previewMode, "borderColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "borderColor", value)
              }
              fallback={paletteFallback.borderColor}
            />
            <Field>
              <Label>{t("roundedCornersLabel")}</Label>
              <Switch
                checked={Boolean(draft.rounded)}
                onChange={updateBoolean("rounded")}
                color="sky"
              />
            </Field>
          </FieldGroup>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Heading level={3} className="font-display text-lg">
            {t("chatbotSettings")}
          </Heading>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            Server-backed settings editor with a dedicated visual UI studio.
          </Text>
        </div>
        <Button color="sky" onClick={handleSave} disabled={saving}>
          {saving ? t("saving") : t("saveChanges")}
        </Button>
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
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color="sky">
              {t("planLabel")}: {currentTier?.name || chatbot?.premiumPlan || "Free"}
            </Badge>
            <Badge
              color={featureAccess.authenticatedWidget ? "emerald" : "zinc"}
            >
              {t("authEnabledLabel")}
            </Badge>
            <Badge color={featureAccess.aiResponder ? "emerald" : "zinc"}>
              {t("aiConfig")}
            </Badge>
            <Badge color={featureAccess.knowledgeFiles ? "emerald" : "zinc"}>
              {t("knowledgeFiles")}
            </Badge>
          </div>
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">
            {featureAccess.aiResponder &&
            featureAccess.authenticatedWidget &&
            featureAccess.knowledgeFiles
              ? t("billingAccessFullHint")
              : t("billingAccessUpgradeHint")}
          </Text>
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
        id="settings-basics"
        title={t("basics")}
        description="Core chatbot copy and publishing state."
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
            <Label>{t("statusLabel")}</Label>
            <Select value={draft.status || "draft"} onChange={update("status")}>
              <option value="draft">{t("statusDraft")}</option>
              <option value="published">{t("statusPublished")}</option>
            </Select>
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
        id="settings-ui"
        title="UI studio"
        description="Click any visible part of the mock chat to focus the right settings, then fine-tune the full light and dark palettes below."
        actions={
          <div className="flex items-center gap-2">
            <PartButton
              active={previewMode === "light"}
              label={t("light")}
              onClick={() => setPreviewMode("light")}
            />
            <PartButton
              active={previewMode === "dark"}
              label={t("dark")}
              onClick={() => setPreviewMode("dark")}
            />
          </div>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr),360px]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-white/5 dark:bg-zinc-950/60">
              <PreviewHint>
                Click the header, message bubbles, suggestion chips, composer,
                launcher, or the canvas to jump straight to the matching design
                settings.
              </PreviewHint>
            </div>
            <ChatbotPreview
              settings={draft}
              mode={previewMode}
              onModeChange={setPreviewMode}
              interactive
              selectedPart={selectedPreviewPart}
              onSelectPart={setSelectedPreviewPart}
            />
          </div>

          <div className="space-y-4">
            <div className="surface-card space-y-4 p-5">
              <div className="space-y-2">
                <Text className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  Focused editor
                </Text>
                <div className="flex flex-wrap gap-2">
                  {previewTargets.map((part) => (
                    <PartButton
                      key={part.id}
                      active={selectedPreviewPart === part.id}
                      label={part.label}
                      onClick={() => setSelectedPreviewPart(part.id)}
                    />
                  ))}
                </div>
              </div>
              {renderFocusedUiControls()}
            </div>

            <div className="surface-card space-y-4 p-5">
              <Text className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                Full {previewMode} theme tokens
              </Text>
              <div className="grid gap-4">
                <ColorField
                  label="Accent"
                  value={draft.theme?.[previewMode]?.accentColor || ""}
                  onTextChange={updateTheme(previewMode, "accentColor")}
                  onColorChange={(value) =>
                    setThemeValue(previewMode, "accentColor", value)
                  }
                  fallback={paletteFallback.accentColor}
                />
                <ColorField
                  label="Accent text"
                  value={draft.theme?.[previewMode]?.accentTextColor || ""}
                  onTextChange={updateTheme(previewMode, "accentTextColor")}
                  onColorChange={(value) =>
                    setThemeValue(previewMode, "accentTextColor", value)
                  }
                  fallback={paletteFallback.accentTextColor}
                />
                <ColorField
                  label="Background"
                  value={draft.theme?.[previewMode]?.backgroundColor || ""}
                  onTextChange={updateTheme(previewMode, "backgroundColor")}
                  onColorChange={(value) =>
                    setThemeValue(previewMode, "backgroundColor", value)
                  }
                  fallback={paletteFallback.backgroundColor}
                />
                <ColorField
                  label="Surface"
                  value={draft.theme?.[previewMode]?.surfaceColor || ""}
                  onTextChange={updateTheme(previewMode, "surfaceColor")}
                  onColorChange={(value) =>
                    setThemeValue(previewMode, "surfaceColor", value)
                  }
                  fallback={paletteFallback.surfaceColor}
                />
                <ColorField
                  label="Text"
                  value={draft.theme?.[previewMode]?.textColor || ""}
                  onTextChange={updateTheme(previewMode, "textColor")}
                  onColorChange={(value) =>
                    setThemeValue(previewMode, "textColor", value)
                  }
                  fallback={paletteFallback.textColor}
                />
                <ColorField
                  label="Border"
                  value={draft.theme?.[previewMode]?.borderColor || ""}
                  onTextChange={updateTheme(previewMode, "borderColor")}
                  onColorChange={(value) =>
                    setThemeValue(previewMode, "borderColor", value)
                  }
                  fallback={paletteFallback.borderColor}
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        id="settings-conversation"
        title={t("conversationBehavior")}
        description="Conversation lifecycle, auth-aware sessions, and inactivity handling from the server model."
      >
        <FieldGroup>
          <Field>
            <Label>{t("authEnabledLabel")}</Label>
            <Switch
              checked={Boolean(draft.auth)}
              onChange={updateBoolean("auth")}
              color="sky"
              disabled={!featureAccess.authenticatedWidget}
            />
            <PreviewHint>
              {featureAccess.authenticatedWidget
                ? t("authClientHelp")
                : t("authUpgradeHint")}
            </PreviewHint>
          </Field>
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
              Use 1 to 24 hours. Standard chats close after this timeout,
              authenticated chats move to pending.
            </PreviewHint>
          </Field>
        </FieldGroup>
      </SettingsCard>

      <SettingsCard
        id="settings-localization"
        title="Localization"
        description="This section exposes the server-side language settings so the web editor stays aligned with the chatbot service."
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
            <div className="flex flex-wrap gap-2">
              {availableLanguages.map((language) => {
                const selected = enabledLanguages.includes(language);
                const isDefault =
                  language ===
                  (draft.defaultLanguage || languageOptions.defaultLanguage);
                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() => toggleEnabledLanguage(language)}
                    className={`chip-control ${
                      selected ? "chip-control-active" : ""
                    }`}
                    disabled={isDefault}
                    title={
                      isDefault ? t("defaultLanguagePinnedHelp") : undefined
                    }
                  >
                    {language}
                    {isDefault ? ` • ${t("defaultLanguageShort")}` : ""}
                  </button>
                );
              })}
            </div>
            <PreviewHint>{t("enabledLanguagesHelp")}</PreviewHint>
          </Field>
        </FieldGroup>

        <div className="flex flex-wrap gap-2">
          <Badge color="sky">
            Translation packs: {translationCoverage}/{enabledLanguages.length}
          </Badge>
          <Badge color="zinc">
            Source hash: {draft.translationSourceHash || "not generated yet"}
          </Badge>
        </div>

        <details className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-white/5 dark:bg-zinc-950/60">
          <summary className="cursor-pointer text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            Server translation payload
          </summary>
          <pre className="mt-3 max-h-72 overflow-auto rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200">
            {JSON.stringify(
              {
                defaultLanguage: draft.defaultLanguage,
                enabledLanguages,
                translations: draft.translations || {},
                translationSourceHash: draft.translationSourceHash || "",
              },
              null,
              2,
            )}
          </pre>
        </details>
      </SettingsCard>

      <SettingsCard
        id="settings-domains"
        title={t("domains")}
        description="Origin control and prompt shortcuts."
      >
        <FieldGroup>
          <Field>
            <Label>{t("allowedDomainsLabel")}</Label>
            <Textarea value={domainText} onChange={updateDomains} rows={3} />
          </Field>
          <Field>
            <Label>{t("suggestedMessagesLabel")}</Label>
            <Textarea
              value={suggestedText}
              onChange={updateSuggested}
              rows={3}
            />
          </Field>
        </FieldGroup>
      </SettingsCard>

      <SettingsCard
        id="settings-leads"
        title={t("leadForm")}
        description="Lead capture fields as stored by the server schema."
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
        <div className="overflow-hidden rounded-xl border border-zinc-100 dark:border-white/5">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>{t("keyLabel")}</TableHeader>
                <TableHeader>{t("labelLabel")}</TableHeader>
                <TableHeader>{t("typeLabel")}</TableHeader>
                <TableHeader>{t("requiredLabel")}</TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {(draft.leadsForm || []).map((field, index) => (
                <TableRow key={`${field.key}-${index}`}>
                  <TableCell>
                    <Input
                      value={field.key}
                      onChange={(event) =>
                        updateLeadsField(index, "key", event.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={field.label}
                      onChange={(event) =>
                        updateLeadsField(index, "label", event.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={Boolean(field.required)}
                      onChange={(value) =>
                        updateLeadsField(index, "required", value)
                      }
                      color="sky"
                    />
                  </TableCell>
                  <TableCell>
                    <Button outline onClick={() => removeLeadField(index)}>
                      {t("remove")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button outline onClick={addLeadField}>
          {t("addField")}
        </Button>
      </SettingsCard>

      <SettingsCard
        id="settings-ai"
        title={t("aiConfig")}
        description="AI response configuration from the server-side `ai` settings object."
      >
        <FieldGroup>
          <Field>
            <Label>{t("enableAiLabel")}</Label>
            <Switch
              checked={Boolean(draft.ai?.enabled)}
              onChange={updateAiBoolean("enabled")}
              color="sky"
              disabled={!featureAccess.aiResponder}
            />
            <PreviewHint>
              {featureAccess.aiResponder
                ? t("aiPlanHint")
                : t("aiUpgradeHint")}
            </PreviewHint>
          </Field>
          <Field>
            <Label>{t("templateLabel")}</Label>
            <Input
              value={draft.ai?.template || ""}
              onChange={updateAi("template")}
            />
          </Field>
          <Field>
            <Label>{t("responseLengthLabel")}</Label>
            <Select
              value={draft.ai?.responseLength || "medium"}
              onChange={updateAi("responseLength")}
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
            />
          </Field>
        </FieldGroup>
      </SettingsCard>

      <SettingsCard
        id="settings-files"
        title={t("knowledgeFiles")}
        description="Knowledge uploads stay separate from the visual UI editor."
        actions={
          <label className="flex items-center gap-2">
            <Button outline disabled={uploading || !featureAccess.knowledgeFiles}>
              {uploading ? t("uploading") : t("uploadFiles")}
            </Button>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.txt,.json"
              disabled={!featureAccess.knowledgeFiles}
            />
          </label>
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
