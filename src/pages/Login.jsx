import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../ui/button'
import { Field, FieldGroup, Label } from '../ui/fieldset'
import { Input } from '../ui/input'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { useI18n } from '../context/I18nContext'
import { PublicHeader } from '../components/PublicHeader'

export const Login = () => {
  const { user, signIn, register } = useAuth()
  const navigate = useNavigate()
  const { t } = useI18n()
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
    <div className="min-h-screen">
      <PublicHeader showActions={false} />
      <div className="mx-auto flex w-full max-w-lg items-center px-6 py-10 sm:py-12">
        <div className="glass-panel fade-up w-full rounded-3xl p-8">
          <div className="space-y-2">
            <Heading level={1} className="font-display text-3xl">
              {mode === 'signin' ? t('signIn') : t('register')}
            </Heading>
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">
              {t('loginBody')}
            </Text>
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

            <Button color="teal" type="submit" disabled={loading} className="w-full">
              {loading ? 'Please wait' : mode === 'signin' ? t('signIn') : t('register')}
            </Button>

            <button
              type="button"
              onClick={() => setMode((prev) => (prev === 'signin' ? 'register' : 'signin'))}
              className="ui-pressable w-full rounded-xl border border-zinc-200/80 px-4 py-2.5 text-sm text-zinc-700 hover:border-teal-200 dark:border-white/10 dark:text-zinc-200 dark:hover:border-teal-400/40"
            >
              {mode === 'signin' ? t('switchToRegister') : t('switchToSignIn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
