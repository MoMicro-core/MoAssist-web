import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useWebSocket } from '../context/WebSocketContext'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { Loading } from '../components/Loading'
import { useI18n } from '../context/I18nContext'

const formatTime = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleString()
}

export const ChatbotChats = () => {
  const { chatbotId } = useParams()
  const [searchParams] = useSearchParams()
  const { connected, on, subscribeConversation, sendOwnerMessage, markConversationRead } = useWebSocket()
  const { t } = useI18n()
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState('')
  const [activeConversation, setActiveConversation] = useState(null)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const requestedId = searchParams.get('conversation')

  const loadConversations = async () => {
    setLoading(true)
    const data = await api.chatbots.conversations(chatbotId)
    setConversations(data || [])
    if (data?.length) {
      const initial =
        requestedId && data.some((item) => item.id === requestedId)
          ? requestedId
          : data[0].id
      if (!activeId || requestedId) {
        setActiveId(initial)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    loadConversations()
  }, [chatbotId, requestedId])

  useEffect(() => {
    if (!activeId) {
      setActiveConversation(null)
      return
    }
    const loadConversation = async () => {
      const data = await api.conversations.get(activeId)
      setActiveConversation(data)
      subscribeConversation(activeId)
      markConversationRead(activeId)
      setConversations((prev) =>
        prev.map((item) =>
          item.id === activeId ? { ...item, unreadForOwner: 0 } : item,
        ),
      )
    }
    loadConversation()
  }, [activeId, subscribeConversation, markConversationRead])

  useEffect(() => {
    const offMessage = on('message.created', (payload) => {
      if (!payload || payload.chatbotId !== chatbotId) return
      setConversations((prev) =>
        prev.map((item) =>
          item.id === payload.conversationId
            ? {
                ...item,
                lastMessagePreview: payload.message.content,
                lastMessageAt: payload.message.createdAt,
                unreadForOwner:
                  payload.message.authorType === 'visitor'
                    ? (item.unreadForOwner || 0) + 1
                    : item.unreadForOwner,
              }
            : item,
        ),
      )
      if (payload.conversationId === activeId) {
        setActiveConversation((prev) =>
          prev
            ? {
                ...prev,
                messages: [...(prev.messages || []), payload.message],
              }
            : prev,
        )
        if (payload.message.authorType === 'visitor') {
          markConversationRead(activeId)
        }
      }
    })
    const offCreated = on('conversation.created', (payload) => {
      if (!payload?.conversation || payload.conversation.chatbotId !== chatbotId) return
      setConversations((prev) => [payload.conversation, ...prev])
    })
    const offRead = on('conversation.read', (payload) => {
      if (!payload || payload.chatbotId !== chatbotId) return
      setConversations((prev) =>
        prev.map((item) =>
          item.id === payload.conversationId ? { ...item, unreadForOwner: 0 } : item,
        ),
      )
    })
    return () => {
      offMessage()
      offCreated()
      offRead()
    }
  }, [on, chatbotId, activeId])

  const handleSend = async () => {
    if (!message.trim() || !activeId) return
    const content = message.trim()
    setMessage('')
    if (connected) {
      sendOwnerMessage(activeId, content)
    } else {
      await api.conversations.sendMessage(activeId, content)
    }
  }

  const activeMessages = useMemo(
    () => activeConversation?.messages || [],
    [activeConversation],
  )

  const filteredConversations = useMemo(() => {
    return conversations.filter((item) => {
      if (filter !== 'all' && item.status !== filter) return false
      if (!search) return true
      const query = search.toLowerCase()
      const name = item.visitor?.name?.toLowerCase() || ''
      const email = item.visitor?.email?.toLowerCase() || ''
      return name.includes(query) || email.includes(query)
    })
  }, [conversations, filter, search])

  if (loading) return <Loading />

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      <div className="space-y-4">
        <Heading level={3} className="font-display text-lg">
          {t('conversations')}
        </Heading>
        <Input
          placeholder={t('searchConversations')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="flex gap-2">
          {[
            { id: 'all', label: t('allLabel') },
            { id: 'open', label: t('openLabel') },
            { id: 'closed', label: t('closedLabel') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                filter === tab.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setActiveId(conversation.id)}
            className={`w-full rounded-2xl border px-4 py-3 text-left transition dark:border-white/10 ${
              activeId === conversation.id
                  ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-900/20'
                  : 'border-zinc-200 bg-white hover:border-emerald-100 dark:bg-zinc-900'
              }`}
          >
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium text-zinc-900 dark:text-white">
                  {conversation.visitor?.name || t('newVisitor')}
                </div>
                {conversation.unreadForOwner ? (
                  <Badge color="teal">{conversation.unreadForOwner}</Badge>
                ) : null}
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                {conversation.lastMessagePreview || t('noMessagesYet')}
              </div>
              <div className="mt-2 text-[11px] text-zinc-400">
                {formatTime(conversation.lastMessageAt)}
              </div>
            </button>
          ))}
          {filteredConversations.length === 0 ? (
            <Text className="text-sm text-zinc-500">{t('noConversationsFound')}</Text>
          ) : null}
        </div>
      </div>
      <div className="flex min-h-[420px] flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
        {activeConversation ? (
          <>
            <div className="border-b border-zinc-100 px-6 py-4 dark:border-white/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {activeConversation.visitor?.name || 'New visitor'}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {activeConversation.visitor?.email || 'No email'}
                  </div>
                </div>
                <Badge color={activeConversation.status === 'open' ? 'emerald' : 'zinc'}>
                  {activeConversation.status}
                </Badge>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.authorType === 'owner'
                      ? 'ml-auto bg-emerald-500 text-white'
                      : msg.authorType === 'assistant'
                      ? 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100'
                      : 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white'
                  }`}
                >
                  <div>{msg.content}</div>
                  <div className="mt-1 text-[11px] opacity-70">{formatTime(msg.createdAt)}</div>
                </div>
              ))}
              {activeMessages.length === 0 ? (
                <Text className="text-sm text-zinc-500">No messages yet.</Text>
              ) : null}
            </div>
            <div className="border-t border-zinc-100 px-6 py-4">
              <div className="flex items-end gap-3">
                <Textarea
                  rows={2}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={t('messagesPlaceholder')}
                />
                <Button color="teal" onClick={handleSend}>
                  {t('send')}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
                <Text className="text-sm text-zinc-500">{t('selectConversation')}</Text>
            </div>
          )}
      </div>
    </div>
  )
}
