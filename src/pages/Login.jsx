import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../ui/button'
import { Field, FieldGroup, Label } from '../ui/fieldset'
import { Input } from '../ui/input'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { Badge } from '../ui/badge'
import { useI18n } from '../context/I18nContext'
import { useTheme } from '../context/ThemeContext'
import { Select } from '../ui/select'

export const Login = () => {
  const { user, signIn, register } = useAuth()
  const navigate = useNavigate()
  const { t, language, setLanguage, languages } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) navigate('/chatbots')
  }, [user, navigate])

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signIn(form.email, form.password)
      } else {
        await register(form.name, form.email, form.password)
      }
      navigate('/chatbots')
    } catch (err) {
      setError(err?.message || 'Unable to authenticate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-5xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.2fr,1fr]">
      <div className="space-y-6">
        <Badge color="teal" className="w-fit uppercase tracking-wide">
          {t('appName')}
        </Badge>
        <Heading level={1} className="font-display text-4xl sm:text-5xl">
          {t('loginTitle')}
        </Heading>
        <Text className="text-base text-zinc-600">
          {t('loginBody')}
        </Text>
        <div className="grid gap-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-sm dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
            {t('featureA')}
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-sm dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
            {t('featureB')}
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="flex justify-end gap-3">
          <Select value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </Select>
          <Button outline onClick={toggleTheme}>
            {theme === 'dark' ? t('light') : t('dark')}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            color={mode === 'signin' ? 'teal' : 'light'}
            onClick={() => setMode('signin')}
          >
            {t('signIn')}
          </Button>
          <Button
            color={mode === 'register' ? 'teal' : 'light'}
            onClick={() => setMode('register')}
          >
            {t('register')}
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <FieldGroup>
            {mode === 'register' ? (
              <Field>
                <Label>Full name</Label>
                <Input value={form.name} onChange={update('name')} required />
              </Field>
            ) : null}
            <Field>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={update('email')} required />
            </Field>
            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={update('password')}
                required
              />
            </Field>
          </FieldGroup>
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <Button color="teal" type="submit" disabled={loading}>
            {loading ? 'Please wait' : mode === 'signin' ? t('signIn') : t('register')}
          </Button>
        </form>
      </div>
    </div>
  )
}
