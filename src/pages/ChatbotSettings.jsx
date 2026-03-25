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

export const ChatbotSettings = () => {
  const { chatbotId } = useParams();
  const { chatbot, loading, reload } = useChatbot();
  const { t } = useI18n();
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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

  const update = (field) => (event) => {
    setDraft((prev) => ({ ...prev, [field]: event.target.value }));
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

  const domainText = useMemo(
    () => listToText(draft?.domains),
    [draft?.domains],
  );
  const suggestedText = useMemo(
    () => listToText(draft?.suggestedMessages),
    [draft?.suggestedMessages],
  );

  if (loading || !draft) return <Loading />;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),360px]">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Heading level={3} className="font-display text-lg">
            {t("chatbotSettings")}
          </Heading>
          <Button color="teal" onClick={handleSave} disabled={saving}>
            {saving ? t("saving") : t("saveChanges")}
          </Button>
        </div>
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <Heading level={4} className="font-display text-base">
            {t("basics")}
          </Heading>
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
              <Select
                value={draft.status || "draft"}
                onChange={update("status")}
              >
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
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <Heading level={4} className="font-display text-base">
            {t("conversationBehavior")}
          </Heading>
          <FieldGroup>
            <Field>
              <Label>{t("authEnabledLabel")}</Label>
              <Switch
                checked={Boolean(draft.auth)}
                onChange={updateBoolean("auth")}
              />
              <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                {t("authClientHelp")}
              </Text>
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
              <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                Use 1 to 24 hours. Standard chats close after this timeout,
                authenticated chats move to pending.
              </Text>
            </Field>
          </FieldGroup>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <Heading level={4} className="font-display text-base">
            {t("appearance")}
          </Heading>
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
              <Label>{t("roundedCornersLabel")}</Label>
              <Switch
                checked={Boolean(draft.rounded)}
                onChange={updateBoolean("rounded")}
              />
            </Field>
            <Field>
              <Label>{t("logoUrlLabel")}</Label>
              <Input
                value={draft.brand?.logoUrl || ""}
                onChange={updateBrand("logoUrl")}
              />
            </Field>
            <Field>
              <Label>{t("bubbleIconUrlLabel")}</Label>
              <Input
                value={draft.brand?.bubbleIconUrl || ""}
                onChange={updateBrand("bubbleIconUrl")}
              />
            </Field>
          </FieldGroup>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-white/5 dark:bg-zinc-800/60">
              <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Light theme
              </Text>
              <FieldGroup>
                <ColorField
                  label="Accent"
                  value={draft.theme?.light?.accentColor || ""}
                  onTextChange={updateTheme("light", "accentColor")}
                  onColorChange={(value) =>
                    setThemeValue("light", "accentColor", value)
                  }
                  fallback="#099ad9"
                />
                <ColorField
                  label="Background"
                  value={draft.theme?.light?.backgroundColor || ""}
                  onTextChange={updateTheme("light", "backgroundColor")}
                  onColorChange={(value) =>
                    setThemeValue("light", "backgroundColor", value)
                  }
                  fallback="#fcfff8"
                />
                <ColorField
                  label="Surface"
                  value={draft.theme?.light?.surfaceColor || ""}
                  onTextChange={updateTheme("light", "surfaceColor")}
                  onColorChange={(value) =>
                    setThemeValue("light", "surfaceColor", value)
                  }
                  fallback="#ffffff"
                />
                <ColorField
                  label="Text"
                  value={draft.theme?.light?.textColor || ""}
                  onTextChange={updateTheme("light", "textColor")}
                  onColorChange={(value) =>
                    setThemeValue("light", "textColor", value)
                  }
                  fallback="#173a55"
                />
                <ColorField
                  label="Border"
                  value={draft.theme?.light?.borderColor || ""}
                  onTextChange={updateTheme("light", "borderColor")}
                  onColorChange={(value) =>
                    setThemeValue("light", "borderColor", value)
                  }
                  fallback="#beebf0"
                />
              </FieldGroup>
            </div>
            <div className="space-y-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-white/5 dark:bg-zinc-800/60">
              <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Dark theme
              </Text>
              <FieldGroup>
                <ColorField
                  label="Accent"
                  value={draft.theme?.dark?.accentColor || ""}
                  onTextChange={updateTheme("dark", "accentColor")}
                  onColorChange={(value) =>
                    setThemeValue("dark", "accentColor", value)
                  }
                  fallback="#5cd7d3"
                />
                <ColorField
                  label="Background"
                  value={draft.theme?.dark?.backgroundColor || ""}
                  onTextChange={updateTheme("dark", "backgroundColor")}
                  onColorChange={(value) =>
                    setThemeValue("dark", "backgroundColor", value)
                  }
                  fallback="#0b1c2a"
                />
                <ColorField
                  label="Surface"
                  value={draft.theme?.dark?.surfaceColor || ""}
                  onTextChange={updateTheme("dark", "surfaceColor")}
                  onColorChange={(value) =>
                    setThemeValue("dark", "surfaceColor", value)
                  }
                  fallback="#102536"
                />
                <ColorField
                  label="Text"
                  value={draft.theme?.dark?.textColor || ""}
                  onTextChange={updateTheme("dark", "textColor")}
                  onColorChange={(value) =>
                    setThemeValue("dark", "textColor", value)
                  }
                  fallback="#ecfdff"
                />
                <ColorField
                  label="Border"
                  value={draft.theme?.dark?.borderColor || ""}
                  onTextChange={updateTheme("dark", "borderColor")}
                  onColorChange={(value) =>
                    setThemeValue("dark", "borderColor", value)
                  }
                  fallback="#214d6f"
                />
              </FieldGroup>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <Heading level={4} className="font-display text-base">
            {t("domains")}
          </Heading>
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
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <Heading level={4} className="font-display text-base">
            {t("leadForm")}
          </Heading>
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
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <Heading level={4} className="font-display text-base">
            {t("aiConfig")}
          </Heading>
          <FieldGroup>
            <Field>
              <Label>{t("enableAiLabel")}</Label>
              <Switch
                checked={Boolean(draft.ai?.enabled)}
                onChange={updateAiBoolean("enabled")}
              />
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
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <Heading level={4} className="font-display text-base">
              {t("knowledgeFiles")}
            </Heading>
            <label className="flex items-center gap-2">
              <Button outline disabled={uploading}>
                {uploading ? t("uploading") : t("uploadFiles")}
              </Button>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.txt,.json"
              />
            </label>
          </div>
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
                      <Badge
                        color={file.status === "ready" ? "emerald" : "zinc"}
                      >
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
        </section>
      </div>
      <aside className="space-y-4 lg:sticky lg:top-6">
        <Heading level={4} className="font-display text-base">
          {t("preview")}
        </Heading>
        <ChatbotPreview settings={draft} />
      </aside>
    </div>
  );
};
