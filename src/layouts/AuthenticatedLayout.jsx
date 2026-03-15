import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ChatBubbleLeftRightIcon,
  LifebuoyIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { SidebarLayout } from '../ui/sidebar-layout'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '../ui/sidebar'
import { Navbar, NavbarSection, NavbarItem, NavbarLabel, NavbarSpacer } from '../ui/navbar'
import { Avatar } from '../ui/avatar'
import { Button } from '../ui/button'
import { Select } from '../ui/select'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useI18n } from '../context/I18nContext'

export const AuthenticatedLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t, language, setLanguage, languages } = useI18n()

  const navItems = [
    { label: t('chatbots'), path: '/chatbots', icon: ChatBubbleLeftRightIcon },
    { label: t('profile'), path: '/profile', icon: UserCircleIcon },
    { label: t('support'), path: '/support', icon: LifebuoyIcon },
  ]

  const sidebar = (
    <Sidebar className="bg-white dark:bg-zinc-900">
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
            M
          </div>
          <div>
            <div className="font-display text-base font-semibold">{t('appName')}</div>
            <div className="text-xs text-zinc-500">{t('dashboard')}</div>
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
              initials={(user?.name || user?.email || 'M')[0]}
            />
            <SidebarLabel>{user?.name || user?.email || 'Account'}</SidebarLabel>
          </SidebarItem>
          <div className="mt-4 space-y-2">
            <Select value={language} onChange={(event) => setLanguage(event.target.value)}>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </Select>
            <Button outline onClick={toggleTheme}>
              {theme === 'dark' ? t('light') : t('dark')}
            </Button>
          </div>
        </SidebarSection>
      </SidebarFooter>
    </Sidebar>
  )

  const navbar = (
    <Navbar>
      <NavbarSection>
        <NavbarItem onClick={() => navigate('/chatbots')}>
          <NavbarLabel className="font-display">{t('appName')}</NavbarLabel>
        </NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem>
          <Avatar
            data-slot="avatar"
            initials={(user?.name || user?.email || 'M')[0]}
          />
          <NavbarLabel className="text-sm">{user?.email}</NavbarLabel>
        </NavbarItem>
        <Button color="teal" onClick={signOut}>
          {t('signOut')}
        </Button>
      </NavbarSection>
    </Navbar>
  )

  return (
    <SidebarLayout navbar={navbar} sidebar={sidebar}>
      <Outlet />
    </SidebarLayout>
  )
}
