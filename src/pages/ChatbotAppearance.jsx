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
  { value: "right" },
  { value: "left" },
  { value: "top-left" },
  { value: "top-right" },
];

export const ChatbotAppearance = () => {
  const { chatbotId } = useParams();
  const { chatbot, loading, reload } = useChatbot();
  const { t, language } = useI18n();
  const copy =
    {
      de: {
        uiTitle: "UI-Anpassung",
        uiBody:
          "Bearbeiten Sie das exakte Widget, das Ihre Besucher sehen, nicht nur ein Mockup. Die mittlere Vorschau wird vom Backend-Widget gerendert und aktualisiert sich aus Ihrem lokalen Entwurf, bevor Sie speichern.",
        bottomRight: "Unten rechts",
        bottomLeft: "Unten links",
        topLeft: "Oben links",
        topRight: "Oben rechts",
        headerBg: "Header-Hintergrund",
        headerText: "Header-Text",
        bubbleSurface: "Blasenfläche",
        bubbleText: "Blasentext",
        bubbleBorder: "Blasenrand",
        accent: "Akzent",
        accentText: "Akzenttext",
        chipSurface: "Chip-Fläche",
        chipBorder: "Chip-Rand",
        composerBorder: "Composer-Rand",
        composerInput: "Eingabe-Hintergrund",
        sendAccent: "Sende-Akzent",
        sendText: "Sende-Text",
        launcherAccent: "Launcher-Hintergrund",
        canvasBg: "Canvas-Hintergrund",
        panelSurface: "Panel-Fläche",
        border: "Rand",
        cornerRadius: "Eckenradius",
        previewControls: "Vorschau-Steuerung",
        previewControlsBody:
          "Wechseln Sie zuerst den Darstellungsmodus und platzieren Sie den Launcher dann in derselben Ecke, die Ihre Besucher auf der Website sehen.",
        previewControlsHint:
          "Positionen unten verhalten sich wie ein klassischer schwebender Chat. Positionen oben halten den Launcher an den oberen Ecken.",
        brandLauncher: "Branding und Launcher",
        brandLauncherBody:
          "Steuern Sie das Logo, den Hintergrund dahinter und das Launcher-Icon, das vor dem Öffnen des Chats sichtbar ist.",
        logoAlt: "Chatbot-Logo",
        bubbleIconHint:
          "Nutzen Sie optional einen direkten Bild-Link, wenn der Launcher ein anderes Icon als das Hauptlogo verwenden soll.",
        launcherIconAlt: "Launcher-Icon",
        studioTitle: "Live-Widget-Studio",
        studioBody:
          "Klicken Sie auf einen Bereich des Chats, um dessen Farben zu fokussieren. Sichtbare Texte wie Bot-Name, Begrüßung, Schnellantworten und Composer-Text lassen sich direkt in der Vorschau bearbeiten.",
        refreshing: "Aktualisiert",
        livePreviewTitle: "Live-Chatbot-Vorschau",
        loadingPreview: "Live-Widget-Vorschau wird geladen...",
        focusedEditor: "Fokussierter Editor",
        focusedEditorBody:
          "Wählen Sie in der Live-Vorschau einen Bereich aus und passen Sie dann nur die Farben und visuellen Einstellungen an, die zu diesem Bereich gehören.",
        fullThemeTitle: "Vollständige Theme-Tokens",
        fullThemeBody:
          "Feinabstimmung der gesamten Palette, sobald der ausgewählte Vorschau-Bereich bereits richtig aussieht.",
        unableRender: "Live-Widget-Vorschau konnte nicht gerendert werden",
        unableSave: "Appearance konnte nicht gespeichert werden",
        unableUpload: "Logo konnte nicht hochgeladen werden",
        unableUploadBubbleIcon:
          "Launcher-Icon konnte nicht hochgeladen werden",
        parts: {
          header: "Header",
          assistantBubble: "Assistentenblase",
          visitorBubble: "Besucherblase",
          suggested: "Vorschlags-Chips",
          composer: "Composer",
          launcher: "Launcher",
          canvas: "Canvas",
        },
      },
      es: {
        uiTitle: "Personalización UI",
        uiBody:
          "Edita el widget exacto que verán tus visitantes, no una maqueta. La vista previa central se renderiza con la plantilla real del backend y se actualiza desde tu borrador local antes de guardar.",
        bottomRight: "Abajo a la derecha",
        bottomLeft: "Abajo a la izquierda",
        topLeft: "Arriba a la izquierda",
        topRight: "Arriba a la derecha",
        headerBg: "Fondo del encabezado",
        headerText: "Texto del encabezado",
        bubbleSurface: "Superficie del globo",
        bubbleText: "Texto del globo",
        bubbleBorder: "Borde del globo",
        accent: "Acento",
        accentText: "Texto de acento",
        chipSurface: "Superficie del chip",
        chipBorder: "Borde del chip",
        composerBorder: "Borde del composer",
        composerInput: "Fondo del campo",
        sendAccent: "Acento de enviar",
        sendText: "Texto de enviar",
        launcherAccent: "Fondo del launcher",
        canvasBg: "Fondo del canvas",
        panelSurface: "Superficie del panel",
        border: "Borde",
        cornerRadius: "Radio de esquina",
        previewControls: "Controles de vista previa",
        previewControlsBody:
          "Primero cambia el modo visual y luego coloca el launcher en la misma esquina en la que tus visitantes lo verán en el sitio web.",
        previewControlsHint:
          "Las posiciones inferiores se comportan como un chat flotante clásico. Las superiores mantienen el launcher fijado en las esquinas de arriba.",
        brandLauncher: "Branding y launcher",
        brandLauncherBody:
          "Controla el logo, el fondo detrás de él y el icono del launcher que la gente ve antes de abrir el chat.",
        logoAlt: "Logo del chatbot",
        bubbleIconHint:
          "Usa aquí un enlace de imagen si quieres que el botón launcher use otro icono distinto al logo principal del chatbot.",
        launcherIconAlt: "Icono del launcher",
        studioTitle: "Estudio del widget en vivo",
        studioBody:
          "Haz clic en cualquier parte del chat para centrarte en sus colores. El texto visible como nombre del bot, bienvenida, respuestas rápidas y composer se puede editar directamente dentro de la vista previa.",
        refreshing: "Actualizando",
        livePreviewTitle: "Vista previa en vivo del chatbot",
        loadingPreview: "Cargando la vista previa del widget en vivo...",
        focusedEditor: "Editor enfocado",
        focusedEditorBody:
          "Usa la vista previa en vivo para elegir una parte y ajusta solo los colores y controles visuales que pertenecen a esa zona.",
        fullThemeTitle: "Tokens completos del tema",
        fullThemeBody:
          "Ajusta toda la paleta cuando la parte seleccionada ya se vea correcta.",
        unableRender: "No se pudo renderizar la vista previa en vivo",
        unableSave: "No se pudo guardar la apariencia",
        unableUpload: "No se pudo subir el logo",
        unableUploadBubbleIcon:
          "No se pudo subir el icono del launcher",
        parts: {
          header: "Encabezado",
          assistantBubble: "Globo del asistente",
          visitorBubble: "Globo del visitante",
          suggested: "Chips sugeridos",
          composer: "Composer",
          launcher: "Launcher",
          canvas: "Canvas",
        },
      },
    }[language] || {
      uiTitle: "UI customization",
      uiBody:
        "Edit the exact widget your visitors receive, not a mock. The center preview is rendered by the backend widget template and updates from your local draft settings before you save.",
      bottomRight: "Bottom right",
      bottomLeft: "Bottom left",
      topLeft: "Top left",
      topRight: "Top right",
      headerBg: "Header background",
      headerText: "Header text",
      bubbleSurface: "Bubble surface",
      bubbleText: "Bubble text",
      bubbleBorder: "Bubble border",
      accent: "Accent",
      accentText: "Accent text",
      chipSurface: "Chip surface",
      chipBorder: "Chip border",
      composerBorder: "Composer border",
      composerInput: "Input background",
      sendAccent: "Send accent",
      sendText: "Send text",
      launcherAccent: "Launcher background",
      canvasBg: "Canvas background",
      panelSurface: "Panel surface",
      border: "Border",
      cornerRadius: "Corner radius",
      previewControls: "Preview controls",
      previewControlsBody:
        "Switch the visual mode first, then place the launcher in the same corner your visitors will see on the website.",
      previewControlsHint:
        "Bottom positions behave like a classic floating chat. Top positions keep the launcher pinned to the upper corners.",
      brandLauncher: "Brand and launcher",
      brandLauncherBody:
        "Control the logo, the background behind it, and the launcher icon people see before the chat opens.",
      logoAlt: "Chatbot logo",
      bubbleIconHint:
        "Use a direct image link here if you want the launcher button to use another icon than the main chatbot logo.",
      launcherIconAlt: "Launcher icon",
      studioTitle: "Live widget studio",
      studioBody:
        "Click any part of the chat to focus its colors. Edit visible text directly inside the preview: bot name, welcome message, quick replies, and the composer text.",
      refreshing: "Refreshing",
      livePreviewTitle: "Live chatbot preview",
      loadingPreview: "Loading live widget preview...",
      focusedEditor: "Focused editor",
      focusedEditorBody:
        "Use the live preview to pick a part, then adjust only the colors and visual controls that belong to that area.",
      fullThemeTitle: "Full theme tokens",
      fullThemeBody:
        "Fine-tune the complete palette once the selected preview part already looks right.",
      unableRender: "Unable to render live widget preview",
      unableSave: "Unable to save appearance",
      unableUpload: "Unable to upload logo",
      unableUploadBubbleIcon: "Unable to upload launcher icon",
      parts: {
        header: "Header",
        assistantBubble: "Assistant bubble",
        visitorBubble: "Visitor bubble",
        suggested: "Suggested chips",
        composer: "Composer",
        launcher: "Launcher",
        canvas: "Canvas",
      },
    };
  const localizedWidgetLocationOptions = widgetLocationOptions.map((option) => ({
    value: option.value,
    label:
      option.value === "right"
        ? copy.bottomRight
        : option.value === "left"
          ? copy.bottomLeft
          : option.value === "top-left"
            ? copy.topLeft
            : copy.topRight,
  }));
  const logoInputRef = useRef(null);
  const bubbleIconInputRef = useRef(null);
  const previewFrameRef = useRef(null);
  const previewRequestRef = useRef(0);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [bubbleIconUploading, setBubbleIconUploading] = useState(false);
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
        setPreviewError(err?.message || copy.unableRender);
      } finally {
        if (previewRequestRef.current === requestId) {
          setPreviewLoading(false);
        }
      }
    }, 180);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [chatbotId, copy.unableRender, draft, previewMode]);

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

  const setCornerRadius = (value) => {
    const numeric = Number.parseInt(value, 10);
    const nextValue = Number.isNaN(numeric)
      ? 0
      : Math.min(40, Math.max(0, numeric));
    setDraft((prev) => ({ ...prev, cornerRadius: nextValue }));
  };

  const updateCornerRadius = (event) => {
    setCornerRadius(event.target.value);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await api.chatbots.update(chatbotId, draft);
      await reload();
    } catch (err) {
      setError(err?.message || copy.unableSave);
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
      setError(err?.message || copy.unableUpload);
    } finally {
      setLogoUploading(false);
      event.target.value = "";
    }
  };

  const handleBubbleIconUpload = async (event) => {
    const [file] = Array.from(event.target.files || []);
    if (!file) return;
    setBubbleIconUploading(true);
    setError("");
    try {
      const updatedChatbot = await api.chatbots.uploadBubbleIcon(chatbotId, file);
      if (updatedChatbot?.settings) {
        setDraft(updatedChatbot.settings);
      }
      await reload();
    } catch (err) {
      setError(err?.message || copy.unableUploadBubbleIcon);
    } finally {
      setBubbleIconUploading(false);
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
  const launcherIconPreview =
    draft?.brand?.bubbleIconUrl || draft?.brand?.logoUrl || "";

  if (loading || !draft) return <Loading />;

  const selectedPreviewLabel = copy.parts[selectedPreviewPart] || copy.parts.launcher;

  const renderFocusedUiControls = () => {
    switch (selectedPreviewPart) {
      case "header":
        return (
          <FieldGroup>
            <ColorField
              label={copy.headerBg}
              value={draft.theme?.[previewMode]?.surfaceColor || ""}
              onTextChange={updateTheme(previewMode, "surfaceColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "surfaceColor", value)
              }
              fallback={paletteFallback.surfaceColor}
            />
            <ColorField
              label={copy.headerText}
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
              label={copy.bubbleSurface}
              value={draft.theme?.[previewMode]?.surfaceColor || ""}
              onTextChange={updateTheme(previewMode, "surfaceColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "surfaceColor", value)
              }
              fallback={paletteFallback.surfaceColor}
            />
            <ColorField
              label={copy.bubbleText}
              value={draft.theme?.[previewMode]?.textColor || ""}
              onTextChange={updateTheme(previewMode, "textColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "textColor", value)
              }
              fallback={paletteFallback.textColor}
            />
            <ColorField
              label={copy.bubbleBorder}
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
              label={copy.accent}
              value={draft.theme?.[previewMode]?.accentColor || ""}
              onTextChange={updateTheme(previewMode, "accentColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "accentColor", value)
              }
              fallback={paletteFallback.accentColor}
            />
            <ColorField
              label={copy.accentText}
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
              label={copy.chipSurface}
              value={draft.theme?.[previewMode]?.surfaceColor || ""}
              onTextChange={updateTheme(previewMode, "surfaceColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "surfaceColor", value)
              }
              fallback={paletteFallback.surfaceColor}
            />
            <ColorField
              label={copy.chipBorder}
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
              label={copy.composerBorder}
              value={draft.theme?.[previewMode]?.borderColor || ""}
              onTextChange={updateTheme(previewMode, "borderColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "borderColor", value)
              }
              fallback={paletteFallback.borderColor}
            />
            <ColorField
              label={copy.composerInput}
              value={draft.theme?.[previewMode]?.inputBackgroundColor || ""}
              onTextChange={updateTheme(previewMode, "inputBackgroundColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "inputBackgroundColor", value)
              }
              fallback={paletteFallback.surfaceColor}
            />
            <ColorField
              label={copy.sendAccent}
              value={draft.theme?.[previewMode]?.accentColor || ""}
              onTextChange={updateTheme(previewMode, "accentColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "accentColor", value)
              }
              fallback={paletteFallback.accentColor}
            />
            <ColorField
              label={copy.sendText}
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
                options={localizedWidgetLocationOptions}
                value={draft.widgetLocation || "right"}
                onChange={setWidgetLocation}
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
            <Field>
              <Label>{t("cornerRadiusLabel")}</Label>
              <Input
                type="number"
                min="0"
                max="40"
                value={draft.cornerRadius ?? 24}
                onChange={updateCornerRadius}
                disabled={!draft.rounded}
              />
            </Field>
            <ColorField
              label={copy.launcherAccent}
              value={draft.theme?.[previewMode]?.launcherBackgroundColor || ""}
              onTextChange={updateTheme(
                previewMode,
                "launcherBackgroundColor",
              )}
              onColorChange={(value) =>
                setThemeValue(previewMode, "launcherBackgroundColor", value)
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
              label={copy.canvasBg}
              value={draft.theme?.[previewMode]?.backgroundColor || ""}
              onTextChange={updateTheme(previewMode, "backgroundColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "backgroundColor", value)
              }
              fallback={paletteFallback.backgroundColor}
            />
            <ColorField
              label={copy.panelSurface}
              value={draft.theme?.[previewMode]?.surfaceColor || ""}
              onTextChange={updateTheme(previewMode, "surfaceColor")}
              onColorChange={(value) =>
                setThemeValue(previewMode, "surfaceColor", value)
              }
              fallback={paletteFallback.surfaceColor}
            />
            <ColorField
              label={copy.border}
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
            {copy.uiTitle}
          </Heading>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            {copy.uiBody}
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
            title={copy.previewControls}
            description={copy.previewControlsBody}
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
                  options={localizedWidgetLocationOptions}
                  value={draft.widgetLocation || "right"}
                  onChange={setWidgetLocation}
                />
                <PreviewHint>{copy.previewControlsHint}</PreviewHint>
              </Field>
              <Field>
                <Label>{t("roundedCornersLabel")}</Label>
                <Switch
                  checked={Boolean(draft.rounded)}
                  onChange={updateBoolean("rounded")}
                  color="sky"
                />
              </Field>
              <Field>
                <Label>{t("cornerRadiusLabel")}</Label>
                <Input
                  type="number"
                  min="0"
                  max="40"
                  value={draft.cornerRadius ?? 24}
                  onChange={updateCornerRadius}
                  disabled={!draft.rounded}
                />
              </Field>
            </FieldGroup>
          </SettingsCard>

          <SettingsCard
            title={copy.brandLauncher}
            description={copy.brandLauncherBody}
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
                          alt={draft.botName || copy.logoAlt}
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
                <Label>{t("uploadBubbleIconLabel")}</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border"
                      style={{
                        backgroundColor:
                          draft.theme?.[previewMode]?.launcherBackgroundColor ||
                          paletteFallback.accentColor,
                        borderColor:
                          draft.theme?.[previewMode]?.borderColor ||
                          paletteFallback.borderColor,
                      }}
                    >
                      {launcherIconPreview ? (
                        <img
                          src={launcherIconPreview}
                          alt={copy.launcherIconAlt}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-white">
                          {(draft.botName || "M").slice(0, 1)}
                        </span>
                      )}
                    </div>
                    <input
                      ref={bubbleIconInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={handleBubbleIconUpload}
                      disabled={!canCustomizeBranding || bubbleIconUploading}
                    />
                    <Button
                      type="button"
                      color="sky"
                      disabled={!canCustomizeBranding || bubbleIconUploading}
                      onClick={() => bubbleIconInputRef.current?.click()}
                    >
                      {bubbleIconUploading
                        ? t("uploadingBubbleIcon")
                        : draft.brand?.bubbleIconUrl
                          ? t("replaceBubbleIconAction")
                          : t("uploadBubbleIconAction")}
                    </Button>
                  </div>
                  <PreviewHint>
                    {canCustomizeBranding
                      ? t("bubbleIconUploadHelp")
                      : t("customBrandingUpgradeHint")}
                  </PreviewHint>
                </div>
              </Field>
              <Field>
                <Label>{t("bubbleIconUrlLabel")}</Label>
                <Input
                  value={draft.brand?.bubbleIconUrl || ""}
                  onChange={updateBrand("bubbleIconUrl")}
                  disabled={!canCustomizeBranding}
                />
                <PreviewHint>{copy.bubbleIconHint}</PreviewHint>
              </Field>
            </FieldGroup>
          </SettingsCard>

        </div>

        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <Text className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {copy.studioTitle}
                </Text>
                <PreviewHint>{copy.studioBody}</PreviewHint>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                <span>{selectedPreviewLabel}</span>
                {previewLoading ? (
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-100">
                    {copy.refreshing}
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
                title={copy.livePreviewTitle}
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
                {copy.loadingPreview}
              </div>
            )}
          </div>
        </section>

        <div className="space-y-6">
          <SettingsCard
            title={copy.focusedEditor}
            description={copy.focusedEditorBody}
          >
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {previewTargets.map((part) => (
                  <PartButton
                    key={part.id}
                    active={selectedPreviewPart === part.id}
                    label={copy.parts[part.id] || part.label}
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
            title={`${copy.fullThemeTitle} (${previewMode})`}
            description={copy.fullThemeBody}
          >
            <div className="grid gap-4">
              <ColorField
                label={copy.accent}
                value={draft.theme?.[previewMode]?.accentColor || ""}
                onTextChange={updateTheme(previewMode, "accentColor")}
                onColorChange={(value) =>
                  setThemeValue(previewMode, "accentColor", value)
                }
                fallback={paletteFallback.accentColor}
              />
              <ColorField
                label={t("launcherBackgroundColorLabel")}
                value={draft.theme?.[previewMode]?.launcherBackgroundColor || ""}
                onTextChange={updateTheme(
                  previewMode,
                  "launcherBackgroundColor",
                )}
                onColorChange={(value) =>
                  setThemeValue(previewMode, "launcherBackgroundColor", value)
                }
                fallback={paletteFallback.accentColor}
              />
              <ColorField
                label={copy.accentText}
                value={draft.theme?.[previewMode]?.accentTextColor || ""}
                onTextChange={updateTheme(previewMode, "accentTextColor")}
                onColorChange={(value) =>
                  setThemeValue(previewMode, "accentTextColor", value)
                }
                fallback={paletteFallback.accentTextColor}
              />
              <ColorField
                label={copy.canvasBg}
                value={draft.theme?.[previewMode]?.backgroundColor || ""}
                onTextChange={updateTheme(previewMode, "backgroundColor")}
                onColorChange={(value) =>
                  setThemeValue(previewMode, "backgroundColor", value)
                }
                fallback={paletteFallback.backgroundColor}
              />
              <ColorField
                label={copy.panelSurface}
                value={draft.theme?.[previewMode]?.surfaceColor || ""}
                onTextChange={updateTheme(previewMode, "surfaceColor")}
                onColorChange={(value) =>
                  setThemeValue(previewMode, "surfaceColor", value)
                }
                fallback={paletteFallback.surfaceColor}
              />
              <ColorField
                label={t("inputBackgroundColorLabel")}
                value={draft.theme?.[previewMode]?.inputBackgroundColor || ""}
                onTextChange={updateTheme(previewMode, "inputBackgroundColor")}
                onColorChange={(value) =>
                  setThemeValue(previewMode, "inputBackgroundColor", value)
                }
                fallback={paletteFallback.surfaceColor}
              />
              <ColorField
                label={copy.headerText}
                value={draft.theme?.[previewMode]?.textColor || ""}
                onTextChange={updateTheme(previewMode, "textColor")}
                onColorChange={(value) =>
                  setThemeValue(previewMode, "textColor", value)
                }
                fallback={paletteFallback.textColor}
              />
              <ColorField
                label={copy.border}
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
