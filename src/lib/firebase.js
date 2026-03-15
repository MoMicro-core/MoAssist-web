import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export const initFirebase = (config) => {
  if (!config || !config.apiKey) return null
  const app = getApps().length ? getApps()[0] : initializeApp(config)
  return getAuth(app)
}
