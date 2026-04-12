import { useEffect, useState } from 'react'
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Button } from '../ui/button'
import { Field, FieldGroup, Label } from '../ui/fieldset'
import { Input } from '../ui/input'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { Loading } from '../components/Loading'
import { useI18n } from '../context/I18nContext'

export const Profile = () => {
  const { user, refreshSession, signOut } = useAuth()
  const { t, language } = useI18n()
  const copy =
    {
      de: {
        nameLabel: 'Name',
        emailLabel: 'E-Mail',
        signOutBody: 'Melden Sie sich von Ihrer aktuellen Dashboard-Sitzung ab.',
      },
      es: {
        nameLabel: 'Nombre',
        emailLabel: 'Correo electrónico',
        signOutBody: 'Cierra la sesión actual de tu panel.',
      },
    }[language] || {
      nameLabel: 'Name',
      emailLabel: 'Email',
      signOutBody: 'Sign out from your current dashboard session.',
    }
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name || '')
    }
    setLoading(false)
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await api.auth.updateProfile({ name })
      await refreshSession()
    } catch (err) {
      setError(err?.message || 'Unable to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div>
        <Heading level={2} className="font-display text-2xl">
          {t('profile')}
        </Heading>
        <Text className="text-sm text-zinc-600 dark:text-zinc-300">
          {t('accountDetails')}
        </Text>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="glass-panel space-y-4 p-6">
        <Heading level={3} className="font-display text-lg">
          {t('accountDetails')}
        </Heading>
        <FieldGroup>
          <Field>
            <Label>{copy.nameLabel}</Label>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field>
            <Label>{copy.emailLabel}</Label>
            <Input value={user?.email || ''} disabled />
          </Field>
        </FieldGroup>
        <Button color="teal" onClick={handleSave} disabled={saving}>
          {saving ? t('saving') : t('saveChanges')}
        </Button>
      </section>

      <section className="glass-panel space-y-4 p-6">
        <Heading level={3} className="font-display text-lg">
          {t('profile')}
        </Heading>
        <Text className="text-sm text-zinc-600 dark:text-zinc-300">
          {copy.signOutBody}
        </Text>
        <Button
          color="sky"
          onClick={signOut}
          className="justify-center shadow-[0_18px_34px_-24px_rgba(9,154,217,0.46)] dark:shadow-[0_18px_34px_-24px_rgba(27,177,212,0.54)]"
        >
          <ArrowLeftOnRectangleIcon data-slot="icon" />
          {t('signOut')}
        </Button>
      </section>
    </div>
  )
}
