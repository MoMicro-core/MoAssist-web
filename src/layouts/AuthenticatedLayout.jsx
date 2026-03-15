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
  SidebarDivider,
} from '../ui/sidebar'
import { Navbar, NavbarSection, NavbarItem, NavbarLabel, NavbarSpacer } from '../ui/navbar'
import { Avatar } from '../ui/avatar'
import { Button } from '../ui/button'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Chatbots', path: '/chatbots', icon: ChatBubbleLeftRightIcon },
  { label: 'Profile', path: '/profile', icon: UserCircleIcon },
  { label: 'Support', path: '/support', icon: LifebuoyIcon },
]

export const AuthenticatedLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const sidebar = (
    <Sidebar className="bg-white">
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
            M
          </div>
          <div>
            <div className="font-display text-base font-semibold">MoAssist</div>
            <div className="text-xs text-zinc-500">Dashboard</div>
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
        <SidebarDivider />
        <SidebarSection>
          <SidebarItem href="/chatbots" current={false}>
            <span className="text-sm text-zinc-500">Active workspace</span>
            <SidebarLabel className="ml-auto text-sm font-medium text-zinc-700">
              {user?.name || user?.email || 'Account'}
            </SidebarLabel>
          </SidebarItem>
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
        </SidebarSection>
      </SidebarFooter>
    </Sidebar>
  )

  const navbar = (
    <Navbar>
      <NavbarSection>
        <NavbarItem onClick={() => navigate('/chatbots')}>
          <NavbarLabel className="font-display">MoAssist</NavbarLabel>
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
          Sign out
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
