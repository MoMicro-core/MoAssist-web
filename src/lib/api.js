import { getRuntime } from './runtime'
import { getSessionToken } from './session'

const getBaseUrl = () => {
  const base = getRuntime().apiBaseUrl || ''
  return base.replace(/\/$/, '')
}

const withQuery = (path, params) => {
  if (!params) return path
  const search = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value === undefined || value === null || value === '') return acc
      acc[key] = value
      return acc
    }, {}),
  ).toString()
  if (!search) return path
  return `${path}?${search}`
}

export const apiRequest = async (
  path,
  { method = 'GET', body, headers, isForm } = {},
) => {
  const url = `${getBaseUrl()}${path}`
  const token = getSessionToken()
  const finalHeaders = { ...(headers || {}) }
  if (token) finalHeaders.Authorization = `Bearer ${token}`
  if (!isForm && body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json'
  }
  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  })
  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text }
    }
  }
  if (!response.ok) {
    const message = data?.message || 'Request failed'
    const error = new Error(message)
    error.status = response.status
    throw error
  }
  return data
}

export const api = {
  auth: {
    createSession: (payload) =>
      apiRequest('/v1/auth/session', { method: 'POST', body: payload }),
    me: () => apiRequest('/v1/auth/me'),
    logout: () => apiRequest('/v1/auth/logout', { method: 'POST' }),
    updateProfile: (payload) =>
      apiRequest('/v1/users/me', { method: 'PATCH', body: payload }),
  },
  chatbots: {
    list: () => apiRequest('/v1/chatbots'),
    create: (settings) =>
      apiRequest('/v1/chatbots', { method: 'POST', body: { settings } }),
    get: (chatbotId) => apiRequest(`/v1/chatbots/${chatbotId}`),
    update: (chatbotId, settings) =>
      apiRequest(`/v1/chatbots/${chatbotId}`, {
        method: 'PATCH',
        body: { settings },
      }),
    remove: (chatbotId) =>
      apiRequest(`/v1/chatbots/${chatbotId}`, { method: 'DELETE' }),
    install: (chatbotId) =>
      apiRequest(`/v1/chatbots/${chatbotId}/install`),
    analytics: (chatbotId) =>
      apiRequest(`/v1/chatbots/${chatbotId}/analytics`),
    files: (chatbotId) => apiRequest(`/v1/chatbots/${chatbotId}/files`),
    uploadFiles: (chatbotId, files) => {
      const form = new FormData()
      files.forEach((file) => form.append('file', file))
      return apiRequest(`/v1/chatbots/${chatbotId}/files`, {
        method: 'POST',
        body: form,
        isForm: true,
      })
    },
    deleteFile: (chatbotId, fileId) =>
      apiRequest(`/v1/chatbots/${chatbotId}/files/${fileId}`, {
        method: 'DELETE',
      }),
    conversations: (chatbotId) =>
      apiRequest(`/v1/chatbots/${chatbotId}/conversations`),
  },
  conversations: {
    list: (params) => apiRequest(withQuery('/v1/conversations', params)),
    get: (conversationId) =>
      apiRequest(`/v1/conversations/${conversationId}`),
    sendMessage: (conversationId, content) =>
      apiRequest(`/v1/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: { content },
      }),
    markRead: (conversationId) =>
      apiRequest(`/v1/conversations/${conversationId}/read`, {
        method: 'POST',
      }),
  },
  billing: {
    summary: (chatbotId) =>
      apiRequest(withQuery('/v1/subscription', { chatbotId })),
    checkout: (payload) =>
      apiRequest('/v1/subscription/checkout', {
        method: 'POST',
        body: payload,
      }),
    portal: (payload) =>
      apiRequest('/v1/subscription/portal', {
        method: 'POST',
        body: payload,
      }),
    trial: (payload) =>
      apiRequest('/v1/subscription/trial', {
        method: 'POST',
        body: payload,
      }),
  },
  public: {
    widgetConfig: (chatbotId) =>
      apiRequest(`/v1/public/chatbots/${chatbotId}/widget`),
  },
  withQuery,
}
