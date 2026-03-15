const SESSION_KEY = 'momicro-assist-session'

export const getSessionToken = () => localStorage.getItem(SESSION_KEY) || ''

export const setSessionToken = (token) => {
  if (token) {
    localStorage.setItem(SESSION_KEY, token)
    return
  }
  localStorage.removeItem(SESSION_KEY)
}
