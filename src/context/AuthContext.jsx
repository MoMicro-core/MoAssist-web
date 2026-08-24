import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { api } from "../lib/api";
import { initFirebase } from "../lib/firebase";
import { loadFirebaseConfig } from "../lib/runtime";
import { getSessionToken, setSessionToken } from "../lib/session";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [sessionToken, setSessionTokenState] = useState(getSessionToken());
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [authError, setAuthError] = useState("");
  // A ref so refreshSession can reach the Firebase client without taking it as
  // a dependency and re-running on every client change.
  const authClientRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    loadFirebaseConfig()
      .then((runtime) => {
        if (cancelled) return;
        setAuthClient(initFirebase(runtime.firebase));
      })
      .finally(() => {
        if (!cancelled) setAuthReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    authClientRef.current = authClient;
  }, [authClient]);

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
      // The backend session expired, but Firebase usually still holds the
      // credential. Exchange it for a fresh session instead of dumping the user
      // on the login screen while they are still signed in.
      try {
        const firebaseUser = authClientRef.current?.currentUser;
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken(true);
          const session = await api.auth.createSession({ idToken });
          setSessionToken(session.token);
          setSessionTokenState(session.token);
          setUser(await api.auth.me());
          return;
        }
      } catch {
        // Fall through to a clean sign-out below.
      }
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
    if (!authReady) throw new Error("Auth is still loading");
    if (!authClient) throw new Error("Auth is not configured");
    return authClient;
  }, [authClient, authReady]);

  const exchangeFirebaseSession = useCallback(async (firebaseUser) => {
    const idToken = await firebaseUser.getIdToken(true);
    const session = await api.auth.createSession({ idToken });
    setSessionToken(session.token);
    setSessionTokenState(session.token);
    const me = await api.auth.me();
    setUser(me);
    return me;
  }, []);

  useEffect(() => {
    if (!authClient) return;
    getRedirectResult(authClient)
      .then(async (result) => {
        if (result?.user) {
          await exchangeFirebaseSession(result.user);
        }
      })
      .catch((error) => {
        // A silently swallowed failure here meant the visitor came back from a
        // Google or Apple redirect simply not signed in, with no explanation.
        if (error?.code === "auth/no-auth-event") return;
        console.error("[auth] redirect sign-in failed", error);
        setAuthError(
          "We could not complete that sign-in. Please try again, or use email and password.",
        );
      });
  }, [authClient, exchangeFirebaseSession]);

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
    try {
      const credential = await signInWithPopup(auth, provider);
      return exchangeFirebaseSession(credential.user);
    } catch (err) {
      if (
        err.code === "auth/popup-blocked" ||
        err.code === "auth/popup-closed-by-user"
      ) {
        await signInWithRedirect(auth, provider);
        return;
      }
      throw err;
    }
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
      authReady,
      signIn,
      register,
      signInWithGoogle,
      signInWithApple,
      signOut,
      refreshSession,
      authError,
      clearAuthError: () => setAuthError(""),
    }),
    [
      user,
      sessionToken,
      ready,
      authReady,
      authError,
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
