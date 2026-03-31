import { Suspense, useState } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { ChatbotProvider, useChatbot } from '../context/ChatbotContext'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Heading } from '../ui/heading'
import { Navbar, NavbarSection, NavbarItem, NavbarLabel } from '../ui/navbar'
import { Text } from '../ui/text'
import { Loading } from '../components/Loading'
import { useI18n } from '../context/I18nContext'
import { api } from '../lib/api'

const ChatbotShell = () => {
  const { chatbotId } = useParams()
  const location = useLocation()
  const { chatbot, loading, error, reload } = useChatbot()
  const { t } = useI18n()
  const [savingStatus, setSavingStatus] = useState(false)
  const [statusError, setStatusError] = useState('')

  const tabs = [
    { label: t('dashboard'), path: 'dashboard' },
    { label: t('conversations'), path: 'chats' },
    { label: t('chatbotSettings'), path: 'settings' },
    { label: t('billingTab'), path: 'billing' },
    { label: 'Plugin', path: 'plugin' },
  ]

  if (loading) return <Loading />

  if (error || !chatbot) {
    return (
      <div className="glass-panel space-y-4 rounded-3xl p-6">
        <div>
          <Heading level={3} className="font-display text-lg">
            Unable to load chatbot
          </Heading>
          <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {error || 'The requested chatbot could not be loaded.'}
          </Text>
        </div>
        <div>
          <Button outline onClick={reload}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const status = chatbot?.settings?.status || 'draft'
  const statusLabel = status === 'published' ? t('statusPublished') : t('statusDraft')

  const toggleStatus = async () => {
    if (!chatbot || savingStatus) return
    const nextStatus = status === 'published' ? 'draft' : 'published'
    setSavingStatus(true)
    setStatusError('')
    try {
      await api.chatbots.update(chatbot.id, { status: nextStatus })
      await reload()
    } catch (err) {
      setStatusError(err?.message || 'Unable to update chatbot status')
    } finally {
      setSavingStatus(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="glass-panel fade-up flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
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
      {statusError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {statusError}
        </div>
      ) : null}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <Navbar className="glass-panel min-w-max rounded-2xl border-zinc-200/70 px-3 py-1.5 dark:border-white/10">
          <NavbarSection className="flex-nowrap">
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
      </div>
      <Suspense fallback={<Loading label="Loading tab" />}>
        <Outlet />
      </Suspense>
    </div>
  )
}

export const ChatbotLayout = () => (
  <ChatbotProvider>
    <ChatbotShell />
  </ChatbotProvider>
)
