import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { api } from "../lib/api";
import { initFirebase } from "../lib/firebase";
import { getRuntime } from "../lib/runtime";
import { getSessionToken, setSessionToken } from "../lib/session";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [sessionToken, setSessionTokenState] = useState(getSessionToken());
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const runtime = getRuntime();
    const auth = initFirebase(runtime.firebase);
    setAuthClient(auth);
  }, []);

  const refreshSession = useCallback(async () => {
    const token = getSessionToken();
    setSessionTokenState(token);
    if (!token) {
      setUser(null);
      setReady(true);
      return;
    }
    try {
      const me = await api.auth.me();
      setUser(me);
    } catch {
      setSessionToken("");
      setSessionTokenState("");
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const getFirebaseAuth = useCallback(() => {
    const auth = authClient || initFirebase(getRuntime().firebase);
    if (!auth) throw new Error("Auth is not configured");
    return auth;
  }, [authClient]);

  const exchangeFirebaseSession = useCallback(async (firebaseUser) => {
    const idToken = await firebaseUser.getIdToken(true);
    const session = await api.auth.createSession({ idToken });
    setSessionToken(session.token);
    setSessionTokenState(session.token);
    const me = await api.auth.me();
    setUser(me);
    return me;
  }, []);

  const signIn = useCallback(
    async (email, password) => {
      const auth = getFirebaseAuth();
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return exchangeFirebaseSession(credential.user);
    },
    [exchangeFirebaseSession, getFirebaseAuth],
  );

  const register = useCallback(
    async (name, email, password) => {
      const auth = getFirebaseAuth();
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(credential.user, { displayName: name });
      return exchangeFirebaseSession(credential.user);
    },
    [exchangeFirebaseSession, getFirebaseAuth],
  );

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const credential = await signInWithPopup(auth, provider);
    return exchangeFirebaseSession(credential.user);
  }, [exchangeFirebaseSession, getFirebaseAuth]);

  const signInWithApple = useCallback(async () => {
    const auth = getFirebaseAuth();
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");
    const credential = await signInWithPopup(auth, provider);
    return exchangeFirebaseSession(credential.user);
  }, [exchangeFirebaseSession, getFirebaseAuth]);

  const signOut = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {}
    setSessionToken("");
    setSessionTokenState("");
    setUser(null);
    if (authClient) {
      try {
        await firebaseSignOut(authClient);
      } catch {}
    }
  }, [authClient]);

  const value = useMemo(
    () => ({
      user,
      sessionToken,
      ready,
      signIn,
      register,
      signInWithGoogle,
      signInWithApple,
      signOut,
      refreshSession,
    }),
    [
      user,
      sessionToken,
      ready,
      signIn,
      register,
      signInWithGoogle,
      signInWithApple,
      signOut,
      refreshSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
