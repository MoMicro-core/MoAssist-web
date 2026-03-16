import { useEffect, useState } from 'react'
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
  const { user, refreshSession } = useAuth()
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhotoUrl(user.photoUrl || '')
    }
    setLoading(false)
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await api.auth.updateProfile({ name, photoUrl })
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
            <Label>Name</Label>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field>
            <Label>Photo URL</Label>
            <Input value={photoUrl} onChange={(event) => setPhotoUrl(event.target.value)} />
          </Field>
          <Field>
            <Label>Email</Label>
            <Input value={user?.email || ''} disabled />
          </Field>
        </FieldGroup>
        <Button color="teal" onClick={handleSave} disabled={saving}>
          {saving ? t('saving') : t('saveChanges')}
        </Button>
      </section>
    </div>
  )
}
