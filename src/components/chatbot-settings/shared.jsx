import { Button } from "../../ui/button";
import { Field, Label } from "../../ui/fieldset";
import { Input } from "../../ui/input";
import { Heading } from "../../ui/heading";
import { Text } from "../../ui/text";

export const themeFallbacks = {
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

export const previewTargets = [
  { id: "header", label: "Header" },
  { id: "assistantBubble", label: "Assistant bubble" },
  { id: "visitorBubble", label: "Visitor bubble" },
  { id: "suggested", label: "Suggested chips" },
  { id: "composer", label: "Composer" },
  { id: "launcher", label: "Launcher" },
  { id: "canvas", label: "Canvas" },
];

export const normalizeColor = (value, fallback = "#099ad9") => {
  if (typeof value !== "string") return fallback;
  const input = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(input)) return input;
  if (/^#[0-9a-fA-F]{3}$/.test(input)) {
    const [r, g, b] = input.slice(1);
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return fallback;
};

export const SettingsCard = ({ id, title, description, actions, children }) => (
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

export const PartButton = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={active ? "chip-control chip-control-active" : "chip-control"}
  >
    {label}
  </button>
);

export const PreviewHint = ({ children }) => (
  <Text className="text-xs text-zinc-500 dark:text-zinc-400">{children}</Text>
);

export const ColorField = ({
  label,
  value,
  onTextChange,
  onColorChange,
  fallback = "#099ad9",
  disabled = false,
}) => (
  <Field>
    <Label>{label}</Label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={normalizeColor(value, fallback)}
        onChange={(event) => onColorChange(event.target.value)}
        disabled={disabled}
        className="h-10 w-12 cursor-pointer rounded-lg border border-zinc-300 bg-white p-1 dark:border-white/20 dark:bg-zinc-900"
      />
      <Input
        value={value || ""}
        onChange={onTextChange}
        placeholder={normalizeColor(value, fallback).toUpperCase()}
        disabled={disabled}
      />
    </div>
  </Field>
);

export const WidgetLocationButtonGroup = ({
  options,
  value,
  onChange,
  className = "",
}) => (
  <div className={`flex flex-wrap gap-2 ${className}`.trim()}>
    {options.map((option) => (
      <Button
        key={option.value}
        type="button"
        outline={value !== option.value}
        color={value === option.value ? "sky" : "zinc"}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </Button>
    ))}
  </div>
);
