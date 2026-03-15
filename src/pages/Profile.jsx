import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Button } from '../ui/button'
import { Field, FieldGroup, Label } from '../ui/fieldset'
import { Input } from '../ui/input'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { Badge } from '../ui/badge'
import { Loading } from '../components/Loading'
import { useI18n } from '../context/I18nContext'

export const Profile = () => {
  const { user, refreshSession } = useAuth()
  const { t } = useI18n()
  const [summary, setSummary] = useState(null)
  const [name, setName] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhotoUrl(user.photoUrl || '')
    }
  }, [user])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await api.billing.summary()
      setSummary(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await api.auth.updateProfile({ name, photoUrl })
    await refreshSession()
    setSaving(false)
  }

  const openCheckout = async () => {
    const data = await api.billing.checkout({})
    if (data?.url) window.location.href = data.url
  }

  const openPortal = async () => {
    const data = await api.billing.portal({})
    if (data?.url) window.location.href = data.url
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Heading level={2} className="font-display text-2xl">
            {t('profile')}
          </Heading>
          <Text className="text-sm text-zinc-600">
            {t('accountDetails')}
          </Text>
        </div>
        <Badge color={summary?.premiumStatus === 'free' ? 'zinc' : 'emerald'}>
          {summary?.premiumStatus || 'free'}
        </Badge>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
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
        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <Heading level={3} className="font-display text-lg">
            {t('subscription')}
          </Heading>
          <div className="space-y-2 text-sm text-zinc-600">
            <div>Plan: {summary?.premiumPlan || 'free'}</div>
            <div>
              Current period end:{' '}
              {summary?.premiumCurrentPeriodEnd
                ? new Date(summary.premiumCurrentPeriodEnd).toLocaleDateString()
                : 'N/A'}
            </div>
          </div>
          <div className="grid gap-2">
            <Button color="teal" onClick={openCheckout}>
              {t('upgrade')}
            </Button>
            <Button outline onClick={openPortal}>
              {t('manageBilling')}
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
