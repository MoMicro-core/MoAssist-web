import { useState } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { ChatbotProvider, useChatbot } from '../context/ChatbotContext'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Heading } from '../ui/heading'
import { Navbar, NavbarSection, NavbarItem, NavbarLabel } from '../ui/navbar'
import { Loading } from '../components/Loading'
import { useI18n } from '../context/I18nContext'
import { api } from '../lib/api'

const ChatbotShell = () => {
  const { chatbotId } = useParams()
  const location = useLocation()
  const { chatbot, loading, reload } = useChatbot()
  const { t } = useI18n()
  const [savingStatus, setSavingStatus] = useState(false)

  const tabs = [
    { label: t('dashboard'), path: 'dashboard' },
    { label: t('conversations'), path: 'chats' },
    { label: t('chatbotSettings'), path: 'settings' },
    { label: 'Plugin', path: 'plugin' },
  ]

  if (loading) return <Loading />

  const status = chatbot?.settings?.status || 'draft'
  const statusLabel = status === 'published' ? t('statusPublished') : t('statusDraft')

  const toggleStatus = async () => {
    if (!chatbot || savingStatus) return
    const nextStatus = status === 'published' ? 'draft' : 'published'
    setSavingStatus(true)
    try {
      await api.chatbots.update(chatbot.id, { status: nextStatus })
      await reload()
    } finally {
      setSavingStatus(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Heading level={2} className="font-display text-2xl">
            {chatbot?.settings?.title || 'Chatbot'}
          </Heading>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <span>{chatbotId}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge color={status === 'published' ? 'emerald' : 'zinc'}>
            {statusLabel}
          </Badge>
          <Button
            color={status === 'published' ? 'zinc' : 'teal'}
            onClick={toggleStatus}
            disabled={savingStatus}
          >
            {savingStatus ? t('saving') : status === 'published' ? t('setDraft') : t('publish')}
          </Button>
        </div>
      </div>
      <Navbar className="rounded-2xl border border-zinc-200 bg-white px-3 dark:border-white/10 dark:bg-zinc-900">
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
