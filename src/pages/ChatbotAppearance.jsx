import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useChatbot } from "../context/ChatbotContext";
import { Button } from "../ui/button";
import { Field, FieldGroup, Label } from "../ui/fieldset";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Loading } from "../components/Loading";
import { ChatbotPreview } from "../components/ChatbotPreview";
import { useI18n } from "../context/I18nContext";
import {
  ColorField,
  PartButton,
  PreviewHint,
  SettingsCard,
  WidgetLocationButtonGroup,
  previewTargets,
  themeFallbacks,
} from "../components/chatbot-settings/shared";

const splitList = (value) =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

const listToText = (value) => (value || []).join("\n");

const widgetLocationOptions = [
  { value: "right", label: "Bottom right" },
  { value: "left", label: "Bottom left" },
  { value: "top-left", label: "Top left" },
  { value: "top-right", label: "Top right" },
];

export const ChatbotAppearance = () => {
  const { chatbotId } = useParams();
  const { chatbot, loading, reload } = useChatbot();
  const { t } = useI18n();
  const logoInputRef = useRef(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState("light");
  const [selectedPreviewPart, setSelectedPreviewPart] = useState("launcher");

  useEffect(() => {
    if (chatbot?.settings) {
      setDraft(chatbot.settings);
    }
  }, [chatbot]);

  const update = (field) => (event) => {
    setDraft((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const updateBoolean = (field) => (value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const updateBrand = (field) => (event) => {
    setDraft((prev) => ({
      ...prev,
      brand: { ...(prev.brand || {}), [field]: event.target.value },
    }));
  };

  const setWidgetLocation = (value) => {
    setDraft((prev) => ({ ...prev, widgetLocation: value }));
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

  const updateSuggested = (event) => {
    setDraft((prev) => ({
      ...prev,
      suggestedMessages: splitList(event.target.value),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await api.chatbots.update(chatbotId, draft);
      await reload();
    } catch (err) {
      setError(err?.message || "Unable to save appearance");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event) => {
    const [file] = Array.from(event.target.files || []);
    if (!file) return;
    setLogoUploading(true);
    setError("");
    try {
      const updatedChatbot = await api.chatbots.uploadLogo(chatbotId, file);
      if (updatedChatbot?.settings) {
        setDraft(updatedChatbot.settings);
      }
      await reload();
    } catch (err) {
      setError(err?.message || "Unable to upload logo");
    } finally {
      setLogoUploading(false);
      event.target.value = "";
    }
  };

  const featureAccess = chatbot?.featureAccess || {
    customBranding: false,
  };
  const canCustomizeBranding = featureAccess.customBranding === true;
  const currentTier = chatbot?.currentTier || null;
  const paletteFallback = themeFallbacks[previewMode];
  const logoBackgroundFallback =
    draft?.theme?.[previewMode]?.surfaceColor || paletteFallback.surfaceColor;
  const suggestedText = useMemo(
    () => listToText(draft?.suggestedMessages),
    [draft?.suggestedMessages],
  );

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
              <Label>{t("initialMessageLabel")}</Label>
              <Textarea
                rows={3}
                value={draft.initialMessage || ""}
                onChange={update("initialMessage")}
              />
            </Field>
            <ColorField
              label="Header background"
              value={draft.theme?.[previewMode]?.backgroundColor || ""}
              onTextChange={updateTheme(previewMode, "backgroundColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "backgroundColor", value)
              }
              fallback={paletteFallback.backgroundColor}
            />
            <ColorField
              label="Header text"
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
              <WidgetLocationButtonGroup
                options={widgetLocationOptions}
                value={draft.widgetLocation || "right"}
                onChange={setWidgetLocation}
              />
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
          </FieldGroup>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Heading level={3} className="font-display text-lg">
            UI customization
          </Heading>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            Control launcher placement, brand assets, and the full light and
            dark chat palette in one dedicated workspace.
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
        title="Launcher and branding"
        description="Pick the launcher corner, upload the chatbot logo, and control the visual mark people see before they open the conversation."
        actions={
          <Button outline href={`/chatbots/${chatbotId}/billing`}>
            {currentTier?.name || chatbot?.premiumPlan || t("openBilling")}
          </Button>
        }
      >
        <FieldGroup>
          <Field>
            <Label>{t("widgetLocationLabel")}</Label>
            <WidgetLocationButtonGroup
              options={widgetLocationOptions}
              value={draft.widgetLocation || "right"}
              onChange={setWidgetLocation}
            />
            <PreviewHint>
              Bottom left and bottom right work like a classic floating chat.
              Top positions keep the launcher pinned to the upper corners.
            </PreviewHint>
          </Field>
          <Field>
            <Label>{t("uploadLogoLabel")}</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border"
                  style={{
                    backgroundColor:
                      draft.brand?.logoBackgroundColor ||
                      logoBackgroundFallback,
                    borderColor:
                      draft.theme?.[previewMode]?.borderColor ||
                      paletteFallback.borderColor,
                  }}
                >
                  {draft.brand?.logoUrl ? (
                    <img
                      src={draft.brand.logoUrl}
                      alt={draft.botName || "Chatbot logo"}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-200">
                      {(draft.botName || "M").slice(0, 1)}
                    </span>
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={!canCustomizeBranding || logoUploading}
                />
                <Button
                  type="button"
                  color="sky"
                  disabled={!canCustomizeBranding || logoUploading}
                  onClick={() => logoInputRef.current?.click()}
                >
                  {logoUploading
                    ? t("uploadingLogo")
                    : draft.brand?.logoUrl
                      ? t("replaceLogoAction")
                      : t("uploadLogoAction")}
                </Button>
              </div>
              <PreviewHint>
                {canCustomizeBranding
                  ? t("logoUploadHelp")
                  : t("customBrandingUpgradeHint")}
              </PreviewHint>
            </div>
          </Field>
          <ColorField
            label={t("logoBackgroundColorLabel")}
            value={draft.brand?.logoBackgroundColor || ""}
            onTextChange={updateBrand("logoBackgroundColor")}
            onColorChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                brand: {
                  ...(prev.brand || {}),
                  logoBackgroundColor: value,
                },
              }))
            }
            fallback={logoBackgroundFallback}
            disabled={!canCustomizeBranding}
          />
          <Field>
            <Label>{t("bubbleIconUrlLabel")}</Label>
            <Input
              value={draft.brand?.bubbleIconUrl || ""}
              onChange={updateBrand("bubbleIconUrl")}
            />
            <PreviewHint>
              Use a custom launcher image URL if you want a different icon than
              the main logo.
            </PreviewHint>
          </Field>
          <Field>
            <Label>{t("roundedCornersLabel")}</Label>
            <Switch
              checked={Boolean(draft.rounded)}
              onChange={updateBoolean("rounded")}
              color="sky"
            />
          </Field>
        </FieldGroup>
      </SettingsCard>

      <SettingsCard
        title="Interactive UI studio"
        description="Click any visible part of the chat preview to focus the matching controls, then fine-tune the full light and dark theme tokens."
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
                launcher, or canvas to jump straight to the matching design
                controls.
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
    </div>
  );
};
