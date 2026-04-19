import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getRuntime } from '../lib/runtime'
import { useAuth } from './AuthContext'

const WebSocketContext = createContext(null)

const getWsUrl = () => {
  const base = getRuntime().apiBaseUrl || window.location.origin
  const wsBase = base.replace(/^http/, 'ws').replace(/\/$/, '')
  return `${wsBase}/ws`
}

export const WebSocketProvider = ({ children }) => {
  const { sessionToken } = useAuth()
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)
  const listenersRef = useRef(new Map())
  const reconnectTimeoutRef = useRef(null)
  const shouldReconnectRef = useRef(true)
  const sessionTokenRef = useRef(sessionToken)

  useEffect(() => {
    sessionTokenRef.current = sessionToken
  }, [sessionToken])

  const sendAction = useCallback((action, payload) => {
    const socket = socketRef.current
    if (!socket || socket.readyState !== 1) return
    socket.send(JSON.stringify({ action, payload }))
  }, [])

  const connect = useCallback(() => {
    const existingSocket = socketRef.current
    if (
      existingSocket &&
      (existingSocket.readyState === WebSocket.OPEN ||
        existingSocket.readyState === WebSocket.CONNECTING)
    ) {
      return
    }

    const socket = new WebSocket(getWsUrl())
    socketRef.current = socket

    socket.onopen = () => {
      if (socketRef.current !== socket) {
        socket.close()
        return
      }
      setConnected(true)
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
      if (sessionTokenRef.current) {
        socket.send(
          JSON.stringify({
            action: 'user.authenticate',
            payload: { token: sessionTokenRef.current },
          }),
        )
      }
    }

    socket.onclose = () => {
      if (socketRef.current === socket) {
        socketRef.current = null
      }
      setConnected(false)
      if (
        shouldReconnectRef.current &&
        !reconnectTimeoutRef.current
      ) {
        reconnectTimeoutRef.current = window.setTimeout(() => {
          reconnectTimeoutRef.current = null
          connect()
        }, 1500)
      }
    }

    socket.onerror = () => {
      setConnected(false)
    }

    socket.onmessage = (event) => {
      let data = {}
      try {
        data = JSON.parse(event.data || '{}')
      } catch {
        return
      }
      const eventName = data.event
      const payload = data.payload
      if (!eventName) return
      const handlers = listenersRef.current.get(eventName)
      if (!handlers) return
      handlers.forEach((handler) => handler(payload))
    }
  }, [])

  useEffect(() => {
    shouldReconnectRef.current = true
    connect()
    return () => {
      shouldReconnectRef.current = false
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
      if (socketRef.current) {
        const socket = socketRef.current
        socketRef.current = null
        socket.close()
      }
    }
  }, [connect])

  useEffect(() => {
    if (connected && sessionToken) {
      sendAction('user.authenticate', { token: sessionToken })
    }
  }, [connected, sessionToken, sendAction])

  const on = useCallback((eventName, handler) => {
    const map = listenersRef.current
    if (!map.has(eventName)) map.set(eventName, new Set())
    const handlers = map.get(eventName)
    handlers.add(handler)
    return () => {
      handlers.delete(handler)
    }
  }, [])

  const value = useMemo(
    () => ({
      connected,
      sendAction,
      on,
      subscribeChatbot: (chatbotId) =>
        sendAction('chatbot.subscribe', { chatbotId }),
      subscribeConversation: (conversationId) =>
        sendAction('conversation.subscribe', { conversationId }),
      sendOwnerMessage: (conversationId, content) =>
        sendAction('owner.message', { conversationId, content }),
      markConversationRead: (conversationId) =>
        sendAction('conversation.read', { conversationId }),
    }),
    [connected, sendAction, on],
  )

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}

export const useWebSocket = () => useContext(WebSocketContext)
