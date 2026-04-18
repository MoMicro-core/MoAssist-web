import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../ui/button";
import { Field, FieldGroup, Label } from "../ui/fieldset";
import { Input } from "../ui/input";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { useI18n } from "../context/I18nContext";
import { PublicHeader } from "../components/PublicHeader";
import { readEnumParam, updateSearchParams } from "../lib/urlState";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.3-1.9 3.1l3.1 2.4c1.8-1.7 2.9-4.1 2.9-6.9 0-.7-.1-1.4-.2-2.1H12Z"
    />
    <path
      fill="#34A853"
      d="M12 21.5c2.6 0 4.8-.9 6.4-2.4l-3.1-2.4c-.9.6-2 .9-3.3.9-2.5 0-4.6-1.7-5.4-4l-3.2 2.5c1.6 3.1 4.8 5.4 8.6 5.4Z"
    />
    <path
      fill="#4A90E2"
      d="M6.6 13.6c-.2-.6-.3-1.1-.3-1.8 0-.6.1-1.2.3-1.8L3.4 7.5C2.8 8.8 2.5 10.3 2.5 11.8c0 1.6.4 3 1 4.3l3.1-2.5Z"
    />
    <path
      fill="#FBBC05"
      d="M12 6c1.4 0 2.7.5 3.7 1.4l2.8-2.8C16.8 3 14.6 2.1 12 2.1c-3.8 0-7 2.2-8.6 5.4l3.2 2.5c.8-2.4 2.9-4 5.4-4Z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
    <path d="M16.9 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.5-.2-2.8.9-3.5.9-.8 0-1.9-.9-3.2-.9-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.7.8 1.2 1.8 2.5 3.1 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.3 1.2-2.6 1.2-2.6 0-.1-2.7-1-2.8-4.2ZM14.6 5.8c.7-.8 1.1-1.9 1-3-.9 0-2 .6-2.6 1.3-.6.7-1.1 1.9-.9 3 .9.1 1.8-.5 2.5-1.3Z" />
  </svg>
);

const SocialButton = ({ icon, label, dark = false, ...props }) => (
  <button
    type="button"
    {...props}
    className={`ui-pressable flex w-full items-center justify-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
      dark
        ? "border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-900 dark:border-white/10 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
        : "border-zinc-200 bg-white text-zinc-900 hover:border-sky-200 hover:bg-sky-50/70 dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:hover:border-cyan-400/40 dark:hover:bg-zinc-900"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export const Login = () => {
  const { user, authReady, signIn, register, signInWithGoogle, signInWithApple } =
    useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useI18n();
  const [mode, setMode] = useState(() =>
    readEnumParam(searchParams, "mode", ["signin", "register"], "signin"),
  );
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loadingAction, setLoadingAction] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/chatbots");
  }, [user, navigate]);

  useEffect(() => {
    const nextMode = readEnumParam(
      searchParams,
      "mode",
      ["signin", "register"],
      "signin",
    );
    setMode((prev) => (prev === nextMode ? prev : nextMode));
  }, [searchParams]);

  useEffect(() => {
    const next = updateSearchParams(
      searchParams,
      { mode },
      { mode: "signin" },
    );
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [mode, searchParams, setSearchParams]);

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const runAuthAction = async (action, callback) => {
    setError("");
    setLoadingAction(action);
    try {
      await callback();
      navigate("/chatbots");
    } catch (err) {
      setError(err?.message || "Unable to authenticate");
    } finally {
      setLoadingAction("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await runAuthAction(mode === "signin" ? "signin" : "register", () =>
      mode === "signin"
        ? signIn(form.email, form.password)
        : register(form.name, form.email, form.password),
    );
  };

  const handleSocial = async (provider) => {
    await runAuthAction(provider, () =>
      provider === "google" ? signInWithGoogle() : signInWithApple(),
    );
  };

  const loading = Boolean(loadingAction);
  const authLoading = !authReady;
  const disabled = loading || authLoading;

  return (
    <div className="min-h-screen">
      <PublicHeader showActions={false} />
      <div className="mx-auto flex w-full max-w-lg items-center px-6 py-10 sm:py-12">
        <div className="glass-panel fade-up w-full rounded-3xl p-8">
          <div className="space-y-2">
            <Heading level={1} className="font-display text-3xl">
              {mode === "signin" ? t("signIn") : t("register")}
            </Heading>
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">
              {t("loginBody")}
            </Text>
          </div>

          <div className="mt-6 space-y-3">
            <SocialButton
              icon={<GoogleIcon />}
              label={t("continueWithGoogle")}
              onClick={() => handleSocial("google")}
              disabled={disabled}
            />
            {/* Apple Sign-In temporarily disabled — pending Firebase + Apple Developer Portal configuration
            <SocialButton
              icon={<AppleIcon />}
              label={t("continueWithApple")}
              onClick={() => handleSocial("apple")}
              disabled={disabled}
              dark
            />
            */}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
            <Text className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              {t("orUseEmail")}
            </Text>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <FieldGroup>
              {mode === "register" ? (
                <Field>
                  <Label>{t("fullNameLabel")}</Label>
                  <Input
                    value={form.name}
                    onChange={update("name")}
                    disabled={disabled}
                    required
                  />
                </Field>
              ) : null}
              <Field>
                <Label>{t("emailLabel")}</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  disabled={disabled}
                  required
                />
              </Field>
              <Field>
                <Label>{t("passwordLabel")}</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={update("password")}
                  disabled={disabled}
                  required
                />
              </Field>
            </FieldGroup>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <Button
              color="sky"
              type="submit"
              disabled={disabled}
              className="w-full"
            >
              {authLoading
                ? t("pleaseWait")
                : loadingAction === "signin" || loadingAction === "register"
                ? t("pleaseWait")
                : mode === "signin"
                  ? t("signIn")
                  : t("register")}
            </Button>

            <button
              type="button"
              disabled={disabled}
              onClick={() =>
                setMode((prev) => (prev === "signin" ? "register" : "signin"))
              }
              className="ui-pressable w-full rounded-xl border border-zinc-200/80 px-4 py-2.5 text-sm text-zinc-700 hover:border-sky-200 dark:border-white/10 dark:text-zinc-200 dark:hover:border-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mode === "signin" ? t("switchToRegister") : t("switchToSignIn")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
