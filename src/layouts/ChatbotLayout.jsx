import { Outlet, useLocation, useParams } from 'react-router-dom'
import { ChatbotProvider, useChatbot } from '../context/ChatbotContext'
import { Badge } from '../ui/badge'
import { Heading } from '../ui/heading'
import { Navbar, NavbarSection, NavbarItem, NavbarLabel } from '../ui/navbar'
import { Loading } from '../components/Loading'

const tabs = [
  { label: 'Dashboard', path: 'dashboard' },
  { label: 'Chats', path: 'chats' },
  { label: 'Settings', path: 'settings' },
  { label: 'Plugin', path: 'plugin' },
]

const ChatbotShell = () => {
  const { chatbotId } = useParams()
  const location = useLocation()
  const { chatbot, loading } = useChatbot()

  if (loading) return <Loading />

  const status = chatbot?.settings?.status || 'draft'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="space-y-1">
          <Heading level={2} className="font-display text-2xl">
            {chatbot?.settings?.title || 'Chatbot'}
          </Heading>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span>{chatbotId}</span>
            <Badge color={status === 'published' ? 'emerald' : 'zinc'}>
              {status}
            </Badge>
          </div>
        </div>
      </div>
      <Navbar className="rounded-2xl border border-zinc-200 bg-white px-3">
        <NavbarSection>
          {tabs.map((tab) => {
            const href = `/chatbots/${chatbotId}/${tab.path}`
            const current = location.pathname === href
            return (
              <NavbarItem key={tab.path} href={href} current={current}>
                <NavbarLabel>{tab.label}</NavbarLabel>
              </NavbarItem>
            )
          })}
        </NavbarSection>
      </Navbar>
      <Outlet />
    </div>
  )
}

export const ChatbotLayout = () => (
  <ChatbotProvider>
    <ChatbotShell />
  </ChatbotProvider>
)
