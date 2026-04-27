import * as Headless from "@headlessui/react";
import clsx from "clsx";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import { ThemeToggle } from "./ThemeToggle";
import { useI18n } from "../context/I18nContext";
import {
  SITE_LOCALES,
  buildLocalizedPath,
  stripLocalePrefix,
} from "../lib/siteLocales";

export const PublicHeader = ({ showActions = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, languageOptions, t } = useI18n();
  const location = useLocation();
  const activePath = stripLocalePrefix(location.pathname) || "/";
  const pricingPath = buildLocalizedPath("/pricing", language);
  const contactsPath = buildLocalizedPath("/contacts", language);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 pt-3 pt-safe sm:gap-3 sm:px-8 sm:pt-6">
        <a href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <picture>
            <source srcSet="/preview/logo.webp" type="image/webp" />
            <img
              src="/preview/logo-opt.png"
              alt="MoAssist"
              width="56"
              height="56"
              className="h-10 w-10 rounded-xl bg-white/80 object-contain p-1 shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl dark:bg-white/10"
              decoding="async"
              fetchpriority="high"
            />
          </picture>
          <div className="min-w-0">
            <div className="truncate font-display text-[15px] font-semibold text-zinc-900 sm:text-lg dark:text-white">
              MoAssist
            </div>
            <div className="truncate text-[10.5px] text-zinc-500 sm:text-xs dark:text-zinc-400">
              {t("marketingTagline")}
            </div>
            <div className="hidden text-[11px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500 sm:block">
              {t("brandRelationshipShort")}
            </div>
          </div>
        </a>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <Button
            outline
            href={pricingPath}
            className={clsx(
              "hidden sm:inline-flex",
              activePath === "/pricing" &&
                "border-sky-300 bg-sky-50/80 text-sky-900 dark:border-cyan-300/40 dark:bg-cyan-300/10 dark:text-cyan-100",
            )}
          >
            {t("pricingNav")}
          </Button>

          <div className="hidden w-[6.25rem] sm:block">
            <Select
              className="[&_select]:text-[1.7rem] [&_select]:leading-none"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label="Language"
            >
              {languageOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
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

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="ui-pressable inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--ui-accent-border)] bg-[color:var(--ui-accent-surface)] text-[color:var(--ui-accent-text)] shadow-[0_18px_34px_-24px_var(--ui-accent-shadow)] sm:hidden"
            aria-label="Open menu"
          >
            <Bars3Icon className="size-6" />
          </button>
        </div>
      </header>

      <Headless.Dialog
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        className="sm:hidden"
      >
        <Headless.DialogBackdrop className="fixed inset-0 z-40 bg-zinc-950/55 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-start justify-end p-3 pt-safe pb-safe">
          <Headless.DialogPanel className="glass-panel w-full max-w-sm rounded-[1.75rem] p-5 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-display text-base font-semibold text-zinc-900 dark:text-white">
                  MoAssist
                </div>
                <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {t("marketingTagline")}
                </div>
              </div>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="ui-pressable inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/80 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/80 dark:text-zinc-200"
                aria-label="Close menu"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>

            <div className="mt-5 space-y-1.5">
              <Button
                plain
                href={pricingPath}
                className={clsx(
                  "w-full justify-start py-3 text-base",
                  activePath === "/pricing" &&
                    "bg-zinc-950/5 dark:bg-white/10",
                )}
                onClick={closeMobileMenu}
              >
                {t("pricingNav")}
              </Button>
              <Button
                plain
                href={contactsPath}
                className="w-full justify-start py-3 text-base"
                onClick={closeMobileMenu}
              >
                {t("contactsNav")}
              </Button>
            </div>

            <div className="mt-5 border-t border-zinc-200/80 pt-5 dark:border-white/10">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                {t("languageLabel") || "Language"}
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {languageOptions.map((option) => {
                  const locale = SITE_LOCALES.find((item) => item.key === option.key);
                  const isActive = option.key === language;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setLanguage(option.key)}
                      aria-label={locale?.languageName || option.key}
                      aria-pressed={isActive}
                      className={clsx(
                        "ui-pressable flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border text-2xl leading-none transition",
                        isActive
                          ? "border-sky-300 bg-sky-50/80 shadow-[0_10px_24px_-18px_rgba(9,154,217,0.6)] dark:border-cyan-300/40 dark:bg-cyan-300/10"
                          : "border-zinc-200/80 bg-white/70 dark:border-white/10 dark:bg-white/5",
                      )}
                    >
                      <span className="text-3xl leading-none">{option.label}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                        {option.key}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 border-t border-zinc-200/80 pt-5 dark:border-white/10">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                {t("theme")}
              </div>
              <ThemeToggle className="mt-3 w-full justify-center" />
            </div>

            {showActions ? (
              <div className="mt-5 grid gap-3">
                <Button outline href="/login" onClick={closeMobileMenu} className="justify-center">
                  {t("signIn")}
                </Button>
                <Button color="teal" href="/chatbots" onClick={closeMobileMenu} className="justify-center">
                  {t("tryNow")}
                </Button>
              </div>
            ) : null}
          </Headless.DialogPanel>
        </div>
      </Headless.Dialog>
    </>
  );
};
