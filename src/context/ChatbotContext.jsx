import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useWebSocket } from './WebSocketContext'

const ChatbotContext = createContext(null)

export const ChatbotProvider = ({ children }) => {
  const { chatbotId } = useParams()
  const [chatbot, setChatbot] = useState(null)
  const [loading, setLoading] = useState(true)
  const { subscribeChatbot } = useWebSocket()

  const loadChatbot = useCallback(async () => {
    if (!chatbotId) return
    setLoading(true)
    const data = await api.chatbots.get(chatbotId)
    setChatbot(data)
    setLoading(false)
  }, [chatbotId])

  useEffect(() => {
    loadChatbot()
  }, [loadChatbot])

  useEffect(() => {
    if (chatbotId) subscribeChatbot(chatbotId)
  }, [chatbotId, subscribeChatbot])

  return (
    <ChatbotContext.Provider value={{ chatbot, loading, reload: loadChatbot }}>
      {children}
    </ChatbotContext.Provider>
  )
}

export const useChatbot = () => useContext(ChatbotContext)
