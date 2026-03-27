import { useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Text } from "../ui/text";
import { useI18n } from "../context/I18nContext";

const fallbackTheme = {
  light: {
    accentColor: "#099ad9",
    backgroundColor: "#fcfff8",
    surfaceColor: "#ffffff",
    textColor: "#173a55",
    accentTextColor: "#fcfff8",
    borderColor: "#beebf0",
  },
  dark: {
    accentColor: "#5cd7d3",
    backgroundColor: "#0b1c2a",
    surfaceColor: "#102536",
    textColor: "#ecfdff",
    accentTextColor: "#0b1c2a",
    borderColor: "#214d6f",
  },
};

const interactiveProps = (part, interactive, onSelectPart) => {
  if (!interactive || !onSelectPart) return {};
  return {
    role: "button",
    tabIndex: 0,
    onClick: (event) => {
      event.stopPropagation();
      onSelectPart(part);
    },
    onKeyDown: (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelectPart(part);
      }
    },
  };
};

const getPartStyle = (part, selectedPart, interactive, palette) => ({
  cursor: interactive ? "pointer" : "default",
  transition: "box-shadow 180ms ease, transform 180ms ease, opacity 180ms ease",
  boxShadow:
    selectedPart === part
      ? `0 0 0 2px ${palette.accentColor}, 0 18px 32px -24px ${palette.accentColor}`
      : undefined,
});

export const ChatbotPreview = ({
  settings,
  interactive = false,
  selectedPart = "",
  onSelectPart,
  mode,
  onModeChange,
}) => {
  const [internalMode, setInternalMode] = useState("light");
  const currentMode = mode || internalMode;
  const setMode = onModeChange || setInternalMode;
  const { t } = useI18n();
  const theme = settings?.theme || fallbackTheme;
  const palette = theme?.[currentMode] || fallbackTheme[currentMode];
  const initialMessage =
    settings?.initialMessage || "Hi. How can I help you today?";
  const suggested = settings?.suggestedMessages || [];
  const userPrompt = suggested[0] || "How can I reset my password?";
  const botName = settings?.botName || "MoAssist";
  const logoUrl = settings?.brand?.logoUrl || "/preview/logo.svg";
  const launcherIconUrl =
    settings?.brand?.bubbleIconUrl ||
    settings?.brand?.logoUrl ||
    "/preview/logo.svg";
  const borderRadius = settings?.rounded ? "20px" : "8px";
  const containerRadius = settings?.rounded ? "rounded-[2rem]" : "rounded-xl";
  const widgetLocation = settings?.widgetLocation || "right";

  const bubbleStyle = useMemo(
    () => ({
      backgroundColor: palette.surfaceColor,
      color: palette.textColor,
      borderColor: palette.borderColor,
      borderRadius,
    }),
    [palette, borderRadius],
  );

  const accentBubbleStyle = useMemo(
    () => ({
      backgroundColor: palette.accentColor,
      color: palette.accentTextColor,
      borderRadius,
    }),
    [palette, borderRadius],
  );

  return (
    <div
      className={`flex w-full flex-col overflow-hidden border shadow-sm ${containerRadius}`}
      style={{
        backgroundColor: palette.backgroundColor,
        borderColor: palette.borderColor,
      }}
    >
      <div
        className="flex items-center justify-between gap-3 border-b px-4 py-3"
        style={{
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
          ...getPartStyle("header", selectedPart, interactive, palette),
        }}
        {...interactiveProps("header", interactive, onSelectPart)}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-sm font-semibold"
            style={{
              backgroundColor: palette.accentColor,
              color: palette.accentTextColor,
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={botName}
                className="h-full w-full object-contain p-1"
              />
            ) : (
              botName.slice(0, 1)
            )}
          </div>
          <div>
            <div
              className="text-sm font-semibold"
              style={{ color: palette.textColor }}
            >
              {botName}
            </div>
            <div
              className="text-xs"
              style={{ color: palette.textColor, opacity: 0.7 }}
            >
              {t("online")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge color={currentMode === "light" ? "sky" : "zinc"}>
            {currentMode === "light" ? t("light") : t("dark")}
          </Badge>
          <button
            type="button"
            onClick={() => setMode(currentMode === "light" ? "dark" : "light")}
            className="rounded-full border px-3 py-1 text-xs font-medium transition"
            style={{
              borderColor: palette.borderColor,
              color: palette.textColor,
              backgroundColor: "transparent",
            }}
          >
            {currentMode === "light" ? t("dark") : t("light")}
          </button>
        </div>
      </div>

      <div
        className="flex min-h-[320px] flex-1 flex-col gap-3 px-4 py-4"
        style={{
          backgroundColor: palette.backgroundColor,
          ...getPartStyle("canvas", selectedPart, interactive, palette),
        }}
        {...interactiveProps("canvas", interactive, onSelectPart)}
      >
        <div
          className="max-w-[85%] rounded-2xl border px-3 py-2 text-sm"
          style={{
            ...bubbleStyle,
            ...getPartStyle(
              "assistantBubble",
              selectedPart,
              interactive,
              palette,
            ),
          }}
          {...interactiveProps("assistantBubble", interactive, onSelectPart)}
        >
          {initialMessage}
        </div>

        <div
          className="ml-auto max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm"
          style={{
            ...accentBubbleStyle,
            ...getPartStyle(
              "visitorBubble",
              selectedPart,
              interactive,
              palette,
            ),
          }}
          {...interactiveProps("visitorBubble", interactive, onSelectPart)}
        >
          {userPrompt}
        </div>

        {suggested.length > 1 ? (
          <div
            className="mt-2 flex flex-wrap gap-2"
            style={getPartStyle(
              "suggested",
              selectedPart,
              interactive,
              palette,
            )}
            {...interactiveProps("suggested", interactive, onSelectPart)}
          >
            {suggested.slice(1, 4).map((msg) => (
              <span
                key={msg}
                className="rounded-full border px-3 py-1 text-xs"
                style={{
                  borderColor: palette.borderColor,
                  color: palette.textColor,
                  backgroundColor: palette.surfaceColor,
                }}
              >
                {msg}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div
        className="border-t px-4 py-3"
        style={{
          borderColor: palette.borderColor,
          backgroundColor: palette.surfaceColor,
          ...getPartStyle("composer", selectedPart, interactive, palette),
        }}
        {...interactiveProps("composer", interactive, onSelectPart)}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex-1 rounded-2xl border px-3 py-2 text-xs"
            style={{
              borderColor: palette.borderColor,
              color: palette.textColor,
              backgroundColor: palette.backgroundColor,
            }}
          >
            {settings?.inputPlaceholder || "Write a message..."}
          </div>
          <button
            type="button"
            className="rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm"
            style={{
              backgroundColor: palette.accentColor,
              color: palette.accentTextColor,
            }}
          >
            {t("send")}
          </button>
        </div>
        <Text
          className="mt-2 text-xs"
          style={{ color: palette.textColor, opacity: 0.6 }}
        >
          Powered by MoAssist
        </Text>
      </div>

      <div
        className={`flex border-t px-4 py-4 ${
          widgetLocation === "left" ? "justify-start" : "justify-end"
        }`}
        style={{
          borderColor: palette.borderColor,
          backgroundColor: palette.backgroundColor,
        }}
      >
        <button
          type="button"
          className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border shadow-lg"
          style={{
            backgroundColor: palette.accentColor,
            color: palette.accentTextColor,
            borderColor: palette.borderColor,
            ...getPartStyle("launcher", selectedPart, interactive, palette),
          }}
          {...interactiveProps("launcher", interactive, onSelectPart)}
        >
          {launcherIconUrl ? (
            <img
              src={launcherIconUrl}
              alt={`${botName} launcher`}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            botName.slice(0, 1)
          )}
        </button>
      </div>
    </div>
  );
};
