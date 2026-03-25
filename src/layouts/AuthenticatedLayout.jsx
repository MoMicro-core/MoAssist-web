import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
import { ThemeToggle } from "../components/ThemeToggle";

const SIDEBAR_PREF_KEY = "moassist-sidebar-hidden";

export const AuthenticatedLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t, language, setLanguage, languages } = useI18n();
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
        <div className="flex items-center gap-3">
          <img
            src="/preview/logo.svg"
            alt={t("appName")}
            className="h-10 w-10 rounded-xl bg-white/80 object-contain p-1 shadow-sm dark:bg-white/10"
          />
          <div>
            <div className="font-display text-base font-semibold">
              {t("appName")}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("dashboard")}
            </div>
          </div>
        </div>
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
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </Select>
            <div className="flex items-center justify-between rounded-xl border border-zinc-200/70 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-zinc-900/70">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                {t("theme")}
              </span>
              <ThemeToggle />
            </div>
            <Button
              outline
              onClick={() => setSidebarHidden(true)}
              className="w-full"
            >
              {t("hideMenu")}
            </Button>
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
              className="h-8 w-8 rounded-lg bg-white/80 object-contain p-1 shadow-sm dark:bg-white/10"
            />
            <NavbarLabel className="font-display">{t("appName")}</NavbarLabel>
          </div>
        </NavbarItem>
        <Button
          outline
          className="hidden lg:inline-flex"
          onClick={() => setSidebarHidden((prev) => !prev)}
        >
          <Bars3BottomLeftIcon data-slot="icon" />
          {sidebarHidden ? t("showMenu") : t("hideMenu")}
        </Button>
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
        <Button color="teal" onClick={signOut}>
          {t("signOut")}
        </Button>
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
      <Outlet />
    </SidebarLayout>
  );
};
