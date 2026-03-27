import { Button } from "../ui/button";
import { Select } from "../ui/select";
import { ThemeToggle } from "./ThemeToggle";
import { useI18n } from "../context/I18nContext";
import { buildLocalizedPath } from "../lib/siteLocales";

export const PublicHeader = ({ showActions = true }) => {
  const { language, setLanguage, languageOptions, t } = useI18n();

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 pt-6 sm:px-8">
      <a href={buildLocalizedPath("/", language)} className="flex items-center gap-3">
        <img
          src="/preview/logo.svg"
          alt="MoAssist"
          className="h-10 w-10 rounded-xl bg-white/80 object-contain p-1 shadow-sm dark:bg-white/10"
        />
        <div>
          <div className="font-display text-lg font-semibold text-zinc-900 dark:text-white">
            MoAssist
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {t("marketingTagline")}
          </div>
        </div>
      </a>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-[5.5rem] sm:w-[6.25rem]">
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
        </div>

        <ThemeToggle />

        {showActions ? (
          <div className="hidden items-center gap-2 sm:flex">
            <Button outline href="/login">
              {t("signIn")}
            </Button>
            <Button color="teal" href="/chatbots">
              {t("tryNow")}
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
};
