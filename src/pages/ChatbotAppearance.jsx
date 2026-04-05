import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useChatbot } from "../context/ChatbotContext";
import { Button } from "../ui/button";
import { Field, FieldGroup, Label } from "../ui/fieldset";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Loading } from "../components/Loading";
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
  const previewFrameRef = useRef(null);
  const previewRequestRef = useRef(0);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewMode, setPreviewMode] = useState("light");
  const [selectedPreviewPart, setSelectedPreviewPart] = useState("launcher");

  const postPreviewHighlight = (part = selectedPreviewPart) => {
    const target = previewFrameRef.current?.contentWindow;
    if (!target || !chatbotId) return;
    target.postMessage(
      {
        type: "momicro-assist-preview",
        action: "highlight",
        chatbotId,
        part,
      },
      "*",
    );
  };

  useEffect(() => {
    if (chatbot?.settings) {
      setDraft(chatbot.settings);
    }
  }, [chatbot]);

  useEffect(() => {
    if (!chatbotId || !draft) return undefined;

    const requestId = previewRequestRef.current + 1;
    previewRequestRef.current = requestId;

    const timeoutId = window.setTimeout(async () => {
      setPreviewLoading(true);
      try {
        const response = await api.chatbots.preview(
          chatbotId,
          draft,
          previewMode,
          selectedPreviewPart,
        );
        if (previewRequestRef.current !== requestId) return;
        setPreviewHtml(response?.html || "");
        setPreviewError("");
      } catch (err) {
        if (previewRequestRef.current !== requestId) return;
        setPreviewError(err?.message || "Unable to render live widget preview");
      } finally {
        if (previewRequestRef.current === requestId) {
          setPreviewLoading(false);
        }
      }
    }, 180);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [chatbotId, draft, previewMode]);

  useEffect(() => {
    const handleMessage = (event) => {
      const data = event.data || {};
      if (
        data.type !== "momicro-assist-preview" ||
        data.chatbotId !== chatbotId
      ) {
        return;
      }

      if (data.action === "select" && data.part) {
        setSelectedPreviewPart(data.part);
        return;
      }

      if (data.action !== "change" || !data.field) {
        return;
      }

      setDraft((prev) => {
        if (!prev) return prev;

        if (data.field === "suggestedMessages") {
          const nextItems = Array.isArray(prev.suggestedMessages)
            ? [...prev.suggestedMessages]
            : [];
          const index = Number.isInteger(data.index)
            ? data.index
            : Number.parseInt(data.index, 10);

          if (!Number.isNaN(index) && index >= 0) {
            if (data.value) {
              nextItems[index] = data.value;
            } else {
              nextItems.splice(index, 1);
            }
          }

          return {
            ...prev,
            suggestedMessages: nextItems.filter(Boolean),
          };
        }

        return {
          ...prev,
          [data.field]: data.value,
        };
      });
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [chatbotId]);

  useEffect(() => {
    if (!previewHtml) return undefined;
    const timeoutId = window.setTimeout(() => {
      postPreviewHighlight(selectedPreviewPart);
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [previewHtml, selectedPreviewPart]);

  const updateBoolean = (field) => (value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const setBrandValue = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      brand: { ...(prev.brand || {}), [field]: value },
    }));
  };

  const updateBrand = (field) => (event) => {
    setBrandValue(field, event.target.value);
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

  if (loading || !draft) return <Loading />;

  const selectedPreviewLabel =
    previewTargets.find((part) => part.id === selectedPreviewPart)?.label ||
    "Launcher";

  const renderFocusedUiControls = () => {
    switch (selectedPreviewPart) {
      case "header":
        return (
          <FieldGroup>
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
            Edit the exact widget your visitors receive, not a mock. The center
            preview is rendered by the backend widget template and updates from
            your local draft settings before you save.
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

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <SettingsCard
            title="Preview controls"
            description="Switch the visual mode first, then place the launcher in the same corner your visitors will see on the website."
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
            <FieldGroup>
              <Field>
                <Label>{t("widgetLocationLabel")}</Label>
                <WidgetLocationButtonGroup
                  options={widgetLocationOptions}
                  value={draft.widgetLocation || "right"}
                  onChange={setWidgetLocation}
                />
                <PreviewHint>
                  Bottom positions behave like a classic floating chat. Top
                  positions keep the launcher pinned to the upper corners.
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
            title="Brand and launcher"
            description="Control the logo, the background behind it, and the launcher artwork people see before the chat opens."
            actions={
              <Button outline href={`/chatbots/${chatbotId}/billing`}>
                {currentTier?.name || chatbot?.premiumPlan || t("openBilling")}
              </Button>
            }
          >
            <FieldGroup>
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
                  setBrandValue("logoBackgroundColor", value)
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
                  Use a different image here if you want the launcher button to
                  use another icon than the main chatbot logo.
                </PreviewHint>
              </Field>
            </FieldGroup>
          </SettingsCard>

        </div>

        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <Text className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Live widget studio
                </Text>
                <PreviewHint>
                  Click any part of the chat to focus its colors. Edit visible
                  text directly inside the preview: bot name, welcome message,
                  quick replies, and the composer text.
                </PreviewHint>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                <span>{selectedPreviewLabel}</span>
                {previewLoading ? (
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-100">
                    Refreshing
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex min-h-[760px] items-center justify-center">
            {previewError ? (
              <div className="flex min-h-[560px] w-full items-center justify-center rounded-[1.75rem] border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                {previewError}
              </div>
            ) : previewHtml ? (
              <iframe
                ref={previewFrameRef}
                title="Live chatbot preview"
                srcDoc={previewHtml}
                className="h-[760px] w-full max-w-[520px] border-0 bg-transparent"
                onLoad={() => {
                  window.setTimeout(
                    () => postPreviewHighlight(selectedPreviewPart),
                    0,
                  );
                }}
              />
            ) : (
              <div className="flex min-h-[560px] w-full items-center justify-center text-center text-sm text-zinc-500 dark:text-zinc-400">
                Loading live widget preview...
              </div>
            )}
          </div>
        </section>

        <div className="space-y-6">
          <SettingsCard
            title="Focused editor"
            description="Use the live preview to pick a part, then adjust only the colors and visual controls that belong to that area."
          >
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {previewTargets.map((part) => (
                  <PartButton
                    key={part.id}
                    active={selectedPreviewPart === part.id}
                    label={part.label}
                    onClick={() => {
                      setSelectedPreviewPart(part.id);
                      window.setTimeout(() => {
                        postPreviewHighlight(part.id);
                      }, 0);
                    }}
                  />
                ))}
              </div>
              {renderFocusedUiControls()}
            </div>
          </SettingsCard>

          <SettingsCard
            title={`Full ${previewMode} theme tokens`}
            description="Fine-tune the complete palette once the selected preview part already looks right."
          >
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
          </SettingsCard>
        </div>
      </div>
    </div>
  );
};
