import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { Badge } from '../ui/badge'
import { Loading } from '../components/Loading'

export const ChatbotDashboard = () => {
  const { chatbotId } = useParams()
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
          { label: 'Total conversations', value: analytics?.totalConversations || 0 },
          { label: 'Open conversations', value: analytics?.openConversations || 0 },
          { label: 'Unread conversations', value: analytics?.unreadConversations || 0 },
          { label: 'Total messages', value: analytics?.totalMessages || 0 },
          { label: 'Leads captured', value: analytics?.totalLeads || 0 },
          { label: 'Knowledge files', value: filesCount || 0 },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="text-2xl font-semibold text-zinc-900">{item.value}</div>
            <Text className="text-sm text-zinc-600">{item.label}</Text>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <Heading level={3} className="font-display text-lg">
          Recent conversations
        </Heading>
        <div className="mt-4 space-y-3">
          {conversations.slice(0, 5).map((conversation) => (
            <div
              key={conversation.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
            >
              <div className="space-y-1">
                <div className="text-sm font-medium text-zinc-900">
                  {conversation.visitor?.name || 'New visitor'}
                </div>
                <div className="text-xs text-zinc-500">
                  {conversation.lastMessagePreview || 'No messages yet'}
                </div>
              </div>
              <Badge color={conversation.status === 'open' ? 'emerald' : 'zinc'}>
                {conversation.status}
              </Badge>
            </div>
          ))}
          {conversations.length === 0 ? (
            <Text className="text-sm text-zinc-500">No conversations yet.</Text>
          ) : null}
        </div>
      </div>
    </div>
  )
}
