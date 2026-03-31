import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  Bars3BottomLeftIcon,
  CreditCardIcon,
  InboxStackIcon,
  ChatBubbleLeftRightIcon,
  LifebuoyIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { SidebarLayout } from "../ui/sidebar-layout";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "../ui/sidebar";
import {
  Navbar,
  NavbarSection,
  NavbarItem,
  NavbarLabel,
  NavbarSpacer,
} from "../ui/navbar";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import { Loading } from "../components/Loading";
import { ThemeToggle } from "../components/ThemeToggle";

const SIDEBAR_PREF_KEY = "moassist-sidebar-hidden";
const menuButtonClasses =
  "menu-toggle ui-pressable inline-flex items-center justify-center gap-2 rounded-2xl border border-[color:var(--ui-accent-border)] bg-[color:var(--ui-accent-surface)] px-4 py-3 text-sm font-semibold text-[color:var(--ui-accent-text)] shadow-[0_18px_34px_-24px_var(--ui-accent-shadow)] backdrop-blur-sm transition hover:border-[color:var(--ui-accent-border-strong)] hover:shadow-[0_22px_42px_-28px_var(--ui-accent-shadow)]";

export const AuthenticatedLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language, setLanguage, languageOptions } = useI18n();
  const [sidebarHidden, setSidebarHidden] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_PREF_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_PREF_KEY, sidebarHidden ? "1" : "0");
    } catch {
      // ignore storage errors
    }
  }, [sidebarHidden]);

  const navItems = [
    { label: t("chatbots"), path: "/chatbots", icon: ChatBubbleLeftRightIcon },
    { label: t("chatsMenu"), path: "/chats", icon: InboxStackIcon },
    { label: t("billings"), path: "/billings", icon: CreditCardIcon },
    { label: t("profile"), path: "/profile", icon: UserCircleIcon },
    { label: t("support"), path: "/support", icon: LifebuoyIcon },
  ];

  const sidebar = (
    <Sidebar className="glass-panel overflow-hidden">
      <SidebarHeader>
        <button
          type="button"
          onClick={() => navigate("/chatbots")}
          className="flex items-center gap-3 text-left"
        >
          <img
            src="/preview/logo.svg"
            alt={t("appName")}
            className="h-12 w-12 rounded-2xl bg-white/80 object-contain p-1.5 shadow-sm dark:bg-white/10"
          />
          <div>
            <div className="font-display text-base font-semibold">
              {t("appName")}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("dashboard")}
            </div>
          </div>
        </button>
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              href={item.path}
              current={location.pathname.startsWith(item.path)}
            >
              <item.icon data-slot="icon" />
              <SidebarLabel>{item.label}</SidebarLabel>
            </SidebarItem>
          ))}
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        <SidebarSection>
          <SidebarItem href="/profile">
            <Avatar
              data-slot="avatar"
              initials={(user?.name || user?.email || "M")[0]}
            />
            <SidebarLabel>
              {user?.name || user?.email || "Account"}
            </SidebarLabel>
          </SidebarItem>
          <div className="mt-4 space-y-3">
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
            <div className="flex items-center justify-between rounded-xl border border-zinc-200/70 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-zinc-900/70">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                {t("theme")}
              </span>
              <ThemeToggle />
            </div>
            <button
              type="button"
              onClick={() => setSidebarHidden(true)}
              className={clsx(menuButtonClasses, "w-full")}
            >
              <Bars3BottomLeftIcon className="size-5" />
              {t("hideMenu")}
            </button>
          </div>
        </SidebarSection>
      </SidebarFooter>
    </Sidebar>
  );

  const navbar = (
    <Navbar className="rounded-2xl border border-zinc-200/70 bg-white/75 px-3 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70">
      <NavbarSection>
        <NavbarItem onClick={() => navigate("/chatbots")}>
          <div className="flex items-center gap-2">
            <img
              src="/preview/logo.svg"
              alt={t("appName")}
              className="h-10 w-10 rounded-xl bg-white/80 object-contain p-1.5 shadow-sm dark:bg-white/10"
            />
            <NavbarLabel className="font-display">{t("appName")}</NavbarLabel>
          </div>
        </NavbarItem>
        <button
          type="button"
          className={clsx(menuButtonClasses, "hidden lg:inline-flex")}
          onClick={() => setSidebarHidden((prev) => !prev)}
        >
          <Bars3BottomLeftIcon className="size-5" />
          {sidebarHidden ? t("showMenu") : t("hideMenu")}
        </button>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem>
          <Avatar
            data-slot="avatar"
            initials={(user?.name || user?.email || "M")[0]}
          />
          <NavbarLabel className="hidden text-sm sm:inline">
            {user?.email}
          </NavbarLabel>
        </NavbarItem>
        <ThemeToggle className="hidden sm:inline-flex" />
      </NavbarSection>
    </Navbar>
  );

  return (
    <SidebarLayout
      navbar={navbar}
      sidebar={sidebar}
      sidebarHidden={sidebarHidden}
      onToggleSidebar={() => setSidebarHidden((prev) => !prev)}
    >
      <Suspense fallback={<Loading label="Loading dashboard" />}>
        <Outlet />
      </Suspense>
    </SidebarLayout>
  );
};
