import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { Badge } from '../ui/badge'
import { Loading } from '../components/Loading'
import { useI18n } from '../context/I18nContext'

export const ChatbotDashboard = () => {
  const { chatbotId } = useParams()
  const { t } = useI18n()
  const [analytics, setAnalytics] = useState(null)
  const [conversations, setConversations] = useState([])
  const [filesCount, setFilesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [stats, chats, files] = await Promise.all([
        api.chatbots.analytics(chatbotId),
        api.chatbots.conversations(chatbotId),
        api.chatbots.files(chatbotId),
      ])
      setAnalytics(stats)
      setConversations(chats || [])
      setFilesCount((files || []).length)
      setLoading(false)
    }
    load()
  }, [chatbotId])

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: t('totalConversations'), value: analytics?.totalConversations || 0 },
          { label: t('openConversations'), value: analytics?.openConversations || 0 },
          { label: t('unreadConversations'), value: analytics?.unreadConversations || 0 },
          { label: t('totalMessages'), value: analytics?.totalMessages || 0 },
          { label: t('leadsCaptured'), value: analytics?.totalLeads || 0 },
          { label: t('knowledgeFiles'), value: filesCount || 0 },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900"
          >
            <div className="text-2xl font-semibold text-zinc-900 dark:text-white">{item.value}</div>
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">{item.label}</Text>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <Heading level={3} className="font-display text-lg">
            {t('recentConversations')}
          </Heading>
          <div className="mt-4 space-y-3">
            {conversations.slice(0, 5).map((conversation) => (
              <div
                key={conversation.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-white/5 dark:bg-zinc-800/60"
            >
              <div className="space-y-1">
                  <div className="text-sm font-medium text-zinc-900 dark:text-white">
                    {conversation.visitor?.name || t('newVisitor')}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {conversation.lastMessagePreview || t('noMessagesYet')}
                  </div>
                </div>
                <Badge color={conversation.status === 'open' ? 'emerald' : 'zinc'}>
                  {conversation.status}
                </Badge>
              </div>
            ))}
            {conversations.length === 0 ? (
              <Text className="text-sm text-zinc-500">{t('noConversationsYet')}</Text>
            ) : null}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <Heading level={3} className="font-display text-lg">
            {t('insights')}
          </Heading>
          <div className="mt-4 space-y-4">
            {[
              { label: 'Engagement', value: analytics?.totalMessages || 0 },
              { label: 'Response load', value: analytics?.openConversations || 0 },
              { label: 'Leads velocity', value: analytics?.totalLeads || 0 },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-white/10">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${Math.min(100, (item.value || 0) * 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
