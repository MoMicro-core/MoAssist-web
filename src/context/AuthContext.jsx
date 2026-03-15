import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { api } from '../lib/api'
import { initFirebase } from '../lib/firebase'
import { getRuntime } from '../lib/runtime'
import { getSessionToken, setSessionToken } from '../lib/session'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null)
  const [sessionToken, setSessionTokenState] = useState(getSessionToken())
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const runtime = getRuntime()
    const auth = initFirebase(runtime.firebase)
    setAuthClient(auth)
  }, [])

  const refreshSession = useCallback(async () => {
    const token = getSessionToken()
    setSessionTokenState(token)
    if (!token) {
      setUser(null)
      setReady(true)
      return
    }
    try {
      const me = await api.auth.me()
      setUser(me)
    } catch {
      setSessionToken('')
      setSessionTokenState('')
      setUser(null)
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const signIn = useCallback(
    async (email, password) => {
      const auth = authClient || initFirebase(getRuntime().firebase)
      if (!auth) throw new Error('Auth is not configured')
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await credential.user.getIdToken(true)
      const session = await api.auth.createSession({ idToken })
      setSessionToken(session.token)
      setSessionTokenState(session.token)
      const me = await api.auth.me()
      setUser(me)
      return me
    },
    [authClient],
  )

  const register = useCallback(
    async (name, email, password) => {
      const auth = authClient || initFirebase(getRuntime().firebase)
      if (!auth) throw new Error('Auth is not configured')
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credential.user, { displayName: name })
      const idToken = await credential.user.getIdToken(true)
      const session = await api.auth.createSession({ idToken })
      setSessionToken(session.token)
      setSessionTokenState(session.token)
      const me = await api.auth.me()
      setUser(me)
      return me
    },
    [authClient],
  )

  const signOut = useCallback(async () => {
    try {
      await api.auth.logout()
    } catch {
    }
    setSessionToken('')
    setSessionTokenState('')
    setUser(null)
    if (authClient) {
      try {
        await firebaseSignOut(authClient)
      } catch {
      }
    }
  }, [authClient])

  const value = useMemo(
    () => ({
      user,
      sessionToken,
      ready,
      signIn,
      register,
      signOut,
      refreshSession,
    }),
    [user, sessionToken, ready, signIn, register, signOut, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
