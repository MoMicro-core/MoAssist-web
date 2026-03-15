import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Dialog, DialogBody, DialogActions, DialogTitle } from '../ui/dialog'
import { Field, FieldGroup, Label } from '../ui/fieldset'
import { Input } from '../ui/input'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { Loading } from '../components/Loading'
import { EmptyState } from '../components/EmptyState'
import { useI18n } from '../context/I18nContext'

export const Chatbots = () => {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [chatbots, setChatbots] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [allConversations, setAllConversations] = useState([])
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [conversationStatus, setConversationStatus] = useState('open')

  const loadChatbots = async () => {
    setLoading(true)
    const data = await api.chatbots.list()
    setChatbots(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadChatbots()
  }, [])

  useEffect(() => {
    const loadConversations = async () => {
      setLoadingConversations(true)
      try {
        const params = conversationStatus === 'all' ? undefined : { status: conversationStatus }
        const data = await api.conversations.list(params)
        setAllConversations(data || [])
      } catch {
        setAllConversations([])
      } finally {
        setLoadingConversations(false)
      }
    }
    loadConversations()
  }, [conversationStatus])

  const statusColor = useMemo(
    () => (status) => (status === 'published' ? 'emerald' : 'zinc'),
    [],
  )

  const chatbotLookup = useMemo(
    () => new Map(chatbots.map((bot) => [bot.id, bot])),
    [chatbots],
  )

  const openCreate = () => {
    setTitle('')
    setDialogOpen(true)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setCreating(true)
    const settings = title ? { title } : undefined
    const created = await api.chatbots.create(settings || {})
    setCreating(false)
    setDialogOpen(false)
    navigate(`/chatbots/${created.id}/settings`)
  }

  if (loading) return <Loading />

  const totalConversations = chatbots.reduce(
    (sum, bot) => sum + (bot.metrics?.conversationsCount || 0),
    0,
  )
  const totalUnread = chatbots.reduce(
    (sum, bot) => sum + (bot.metrics?.unreadCount || 0),
    0,
  )
  const totalFiles = chatbots.reduce(
    (sum, bot) => sum + (bot.metrics?.filesCount || 0),
    0,
  )
  const recentBots = [...chatbots]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3)

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
        <div className="rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/60 dark:via-zinc-950 dark:to-zinc-900">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <Badge color="teal" className="uppercase tracking-wide">
                {t('dashboard')}
              </Badge>
              <Heading level={2} className="font-display text-3xl">
                {t('chatbots')}
              </Heading>
              <Text className="text-sm text-zinc-600 dark:text-zinc-300">
                Create, publish, and monitor assistants with one steady control surface.
              </Text>
            </div>
            <Button color="teal" onClick={openCreate}>
              {t('newChatbot')}
            </Button>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
              <div className="text-xl font-semibold text-zinc-900 dark:text-white">{chatbots.length}</div>
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">{t('activeChatbots')}</Text>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
              <div className="text-xl font-semibold text-zinc-900 dark:text-white">{totalConversations}</div>
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">{t('totalConversations')}</Text>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
              <div className="text-xl font-semibold text-zinc-900 dark:text-white">{totalUnread}</div>
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">{t('unreadConversations')}</Text>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <Heading level={3} className="font-display text-lg">
            {t('activity')}
          </Heading>
          <div className="mt-4 space-y-3">
            {recentBots.map((bot) => (
              <div
                key={bot.id}
                className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-white/5 dark:bg-zinc-800/60"
              >
                <div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-white">
                    {bot.settings?.title || 'MoAssist Bot'}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {new Date(bot.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <Badge color={statusColor(bot.settings?.status)}>
                  {bot.settings?.status || 'draft'}
                </Badge>
              </div>
            ))}
            {recentBots.length === 0 ? (
              <Text className="text-sm text-zinc-500">{t('noChatbots')}</Text>
            ) : null}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-center dark:border-white/5 dark:bg-zinc-800/60">
              <div className="text-lg font-semibold text-zinc-900 dark:text-white">{totalFiles}</div>
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">{t('knowledgeFiles')}</Text>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-center dark:border-white/5 dark:bg-zinc-800/60">
              <div className="text-lg font-semibold text-zinc-900 dark:text-white">{totalUnread}</div>
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">{t('needsReply')}</Text>
            </div>
          </div>
        </div>
      </div>
      {chatbots.length === 0 ? (
        <EmptyState
          title={t('noChatbots')}
          description={t('noChatbotsBody')}
          actionLabel={t('createChatbot')}
          onAction={openCreate}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {chatbots.map((chatbot) => (
            <button
              key={chatbot.id}
              onClick={() => navigate(`/chatbots/${chatbot.id}/dashboard`)}
              className="text-left"
            >
              <div className="group flex h-full flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-900">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Heading level={3} className="font-display text-lg">
                      {chatbot.settings?.title || 'MoAssist Bot'}
                    </Heading>
                    <Badge color={statusColor(chatbot.settings?.status)}>
                      {chatbot.settings?.status || 'draft'}
                    </Badge>
                  </div>
                  <Text className="text-sm text-zinc-600">
                    {chatbot.settings?.botName || 'MoAssist'}
                  </Text>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-zinc-600">
                  <div className="rounded-xl bg-zinc-50 px-3 py-2">
                    <div className="text-zinc-900">
                      {chatbot.metrics?.conversationsCount || 0}
                    </div>
                    <div>Conversations</div>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-3 py-2">
                    <div className="text-zinc-900">
                      {chatbot.metrics?.unreadCount || 0}
                    </div>
                    <div>Unread</div>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-3 py-2">
                    <div className="text-zinc-900">
                      {chatbot.metrics?.filesCount || 0}
                    </div>
                    <div>Files</div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Heading level={3} className="font-display text-lg">
              {t('allConversations')}
            </Heading>
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">
              {t('allConversationsBody')}
            </Text>
          </div>
          <div className="flex gap-2">
            {[
              { id: 'all', label: t('allLabel') },
              { id: 'open', label: t('openLabel') },
              { id: 'closed', label: t('closedLabel') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setConversationStatus(tab.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  conversationStatus === tab.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {loadingConversations ? (
            <Text className="text-sm text-zinc-500">{t('loadingConversations')}</Text>
          ) : (
            allConversations.map((conversation) => {
              const bot = chatbotLookup.get(conversation.chatbotId)
              const title = bot?.settings?.title || 'Chatbot'
              const time = conversation.lastMessageAt || conversation.updatedAt || conversation.createdAt
              return (
                <button
                  key={conversation.id}
                  onClick={() =>
                    navigate(
                      `/chatbots/${conversation.chatbotId}/chats?conversation=${conversation.id}`,
                    )
                  }
                  className="w-full text-left"
                >
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-white/5 dark:bg-zinc-800/60">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-zinc-900 dark:text-white">
                          {conversation.visitor?.name || t('newVisitor')}
                        </div>
                        <div className="text-xs text-zinc-500">{title}</div>
                      </div>
                      <div className="text-xs text-zinc-500">
                        {time ? new Date(time).toLocaleString() : ''}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                      {conversation.lastMessagePreview || t('noMessagesYet')}
                    </div>
                  </div>
                </button>
              )
            })
          )}
          {!loadingConversations && allConversations.length === 0 ? (
            <Text className="text-sm text-zinc-500">{t('noConversationsYet')}</Text>
          ) : null}
        </div>
      </div>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} size="md">
        <DialogTitle>{t('createChatbot')}</DialogTitle>
        <DialogBody>
          <form onSubmit={handleCreate} className="space-y-6">
            <FieldGroup>
              <Field>
                <Label>{t('chatbotName')}</Label>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="MoAssist Bot"
                />
              </Field>
            </FieldGroup>
            <DialogActions>
              <Button outline type="button" onClick={() => setDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button color="teal" type="submit" disabled={creating}>
                {creating ? t('creating') : t('createChatbot')}
              </Button>
            </DialogActions>
          </form>
        </DialogBody>
      </Dialog>
    </div>
  )
}
