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

export const Profile = () => {
  const { user, refreshSession } = useAuth()
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
            Profile
          </Heading>
          <Text className="text-sm text-zinc-600">
            Manage your account and subscription.
          </Text>
        </div>
        <Badge color={summary?.premiumStatus === 'free' ? 'zinc' : 'emerald'}>
          {summary?.premiumStatus || 'free'}
        </Badge>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <Heading level={3} className="font-display text-lg">
            Account details
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
            {saving ? 'Saving' : 'Save profile'}
          </Button>
        </section>
        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <Heading level={3} className="font-display text-lg">
            Subscription
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
              Upgrade plan
            </Button>
            <Button outline onClick={openPortal}>
              Manage billing
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
