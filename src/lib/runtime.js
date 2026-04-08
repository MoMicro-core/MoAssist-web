const trimTrailingSlash = (value = '') => value.replace(/\/$/, '')

const baseRuntime = {
  apiBaseUrl: trimTrailingSlash(import.meta.env.VITE_API_URL || window.location.origin),
}

let firebaseConfigPromise = null

export const getRuntime = () => baseRuntime

export const loadFirebaseConfig = async () => {
  if (!firebaseConfigPromise) {
    firebaseConfigPromise = fetch(
      `${baseRuntime.apiBaseUrl}/v1/public/firebase-config`,
    )
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(payload.message || 'Failed to load Firebase config')
        }
        return payload
      })
      .catch(() => ({ firebase: {}, vapidKey: '' }))
  }
  return firebaseConfigPromise
}
