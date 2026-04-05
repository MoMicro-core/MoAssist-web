import { useI18n } from "../context/I18nContext";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Select } from "../ui/select";
import { Field, FieldGroup, Label } from "../ui/fieldset";

export const Settings = () => {
  const { t, language, setLanguage, languageOptions } = useI18n();
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <Heading level={2} className="font-display text-2xl">
          {t("settings")}
        </Heading>
        <Text className="text-sm text-zinc-600 dark:text-zinc-300">
          {t("settingsPageBody")}
        </Text>
      </div>

      <section className="glass-panel space-y-4 p-6">
        <div className="space-y-1">
          <Heading level={3} className="font-display text-lg">
            {t("language")}
          </Heading>
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">
            {t("settingsLanguageBody")}
          </Text>
        </div>

        <FieldGroup>
          <Field>
            <Label>{t("language")}</Label>
            <Select
              className="[&_select]:text-[1.45rem] [&_select]:leading-none [&_select]:sm:text-[1.7rem]"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              {languageOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
        </FieldGroup>
      </section>

      <section className="glass-panel space-y-4 p-6">
        <div className="space-y-1">
          <Heading level={3} className="font-display text-lg">
            {t("theme")}
          </Heading>
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">
            {t("settingsThemeBody")}
          </Text>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/70 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">
              {t("currentThemeLabel")}
            </div>
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">
              {theme === "dark" ? t("dark") : t("light")}
            </Text>
          </div>
          <ThemeToggle />
        </div>
      </section>
    </div>
  );
};
