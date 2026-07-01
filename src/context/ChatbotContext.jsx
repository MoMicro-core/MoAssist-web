import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useWebSocket } from './WebSocketContext'

const ChatbotContext = createContext(null)

export const ChatbotProvider = ({ children }) => {
  const { chatbotId } = useParams()
  const [chatbot, setChatbot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { subscribeChatbot } = useWebSocket()

  const loadChatbot = useCallback(async () => {
    if (!chatbotId) {
      setChatbot(null)
      setError('')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await api.chatbots.get(chatbotId)
      setChatbot(data)
    } catch (err) {
      setChatbot(null)
      setError(err?.message || 'Unable to load chatbot')
    } finally {
      setLoading(false)
    }
  }, [chatbotId])

  useEffect(() => {
    loadChatbot()
  }, [loadChatbot])

  useEffect(() => {
    if (chatbotId) subscribeChatbot(chatbotId)
  }, [chatbotId, subscribeChatbot])

  // Refresh the cached chatbot from a server response (e.g. after an autosave)
  // without a refetch, so sibling tabs stay current but an in-progress draft is
  // never reset. Guards against a stale response for a different chatbot.
  const applyChatbot = useCallback(
    (next) => {
      if (next?.id && next.id === chatbotId) setChatbot(next)
    },
    [chatbotId],
  )

  return (
    <ChatbotContext.Provider
      value={{ chatbot, loading, error, reload: loadChatbot, applyChatbot }}
    >
      {children}
    </ChatbotContext.Provider>
  )
}

export const useChatbot = () => useContext(ChatbotContext)
