import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Field, Label } from '../ui/fieldset'
import { Select } from '../ui/select'
import { Loading } from '../components/Loading'
import { useI18n } from '../context/I18nContext'

export const Billings = () => {
  const { t } = useI18n()
  const [chatbots, setChatbots] = useState([])
  const [selectedChatbotId, setSelectedChatbotId] = useState('')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [billingLoading, setBillingLoading] = useState(false)
  const [billingAction, setBillingAction] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const bots = await api.chatbots.list()
        if (!active) return
        const next = bots || []
        setChatbots(next)
        setSelectedChatbotId(next[0]?.id || '')
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Unable to load billing data')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!selectedChatbotId) {
      setSummary(null)
      return
    }

    let active = true
    const loadSummary = async () => {
      setBillingLoading(true)
      setError('')
      try {
        const data = await api.billing.summary(selectedChatbotId)
        if (active) setSummary(data)
      } catch (err) {
        if (active) setError(err?.message || 'Unable to load billing summary')
      } finally {
        if (active) setBillingLoading(false)
      }
    }

    loadSummary()
    return () => {
      active = false
    }
  }, [selectedChatbotId])

  const selectedChatbot = useMemo(
    () => chatbots.find((item) => item.id === selectedChatbotId),
    [chatbots, selectedChatbotId],
  )

  const runAction = async (request) => {
    if (!selectedChatbotId || billingAction) return
    setBillingAction(true)
    setError('')
    try {
      const data = await request()
      if (data?.url) window.location.href = data.url
    } catch (err) {
      setError(err?.message || 'Billing request failed')
    } finally {
      setBillingAction(false)
    }
  }

  const openCheckout = async () => {
    await runAction(() => api.billing.checkout({ chatbotId: selectedChatbotId }))
  }

  const openPortal = async () => {
    await runAction(() => api.billing.portal({ chatbotId: selectedChatbotId }))
  }

  const startTrial = async () => {
    await runAction(async () => {
      await api.billing.trial({ chatbotId: selectedChatbotId })
      const refreshed = await api.billing.summary(selectedChatbotId)
      setSummary(refreshed)
      return null
    })
  }

  if (loading) return <Loading />

  const premiumStatus = summary?.premiumStatus || 'free'
  const periodEnd = summary?.premiumCurrentPeriodEnd
    ? new Date(summary.premiumCurrentPeriodEnd).toLocaleDateString()
    : 'N/A'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Heading level={2} className="font-display text-2xl">
            {t('billings')}
          </Heading>
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">
            {t('billingPerChatbotBody')}
          </Text>
        </div>
        <Badge color={premiumStatus === 'free' ? 'zinc' : 'emerald'}>{premiumStatus}</Badge>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="glass-panel space-y-5 p-6">
        <Field>
          <Label>{t('billingChatbot')}</Label>
          <Select
            value={selectedChatbotId}
            onChange={(event) => setSelectedChatbotId(event.target.value)}
            disabled={!chatbots.length}
          >
            {chatbots.map((chatbot) => (
              <option key={chatbot.id} value={chatbot.id}>
                {chatbot.settings?.title || chatbot.id}
              </option>
            ))}
          </Select>
        </Field>

        {!chatbots.length ? (
          <Text className="text-sm text-zinc-500">{t('noChatbotsForBilling')}</Text>
        ) : (
          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <div>
              {t('selectedChatbot')}: {selectedChatbot?.settings?.title || selectedChatbot?.id}
            </div>
            <div>
              {t('planLabel')}: {summary?.premiumPlan || 'free'}
            </div>
            <div>
              {t('billingStatusLabel')}: {premiumStatus}
            </div>
            <div>
              {t('currentPeriodEndLabel')}: {periodEnd}
            </div>
            {billingLoading ? <div>{t('loadingBilling')}</div> : null}
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-3">
          <Button
            color="teal"
            onClick={openCheckout}
            disabled={!selectedChatbotId || billingAction}
          >
            {t('upgrade')}
          </Button>
          <Button
            outline
            onClick={startTrial}
            disabled={!selectedChatbotId || billingAction}
          >
            {t('startTrial')}
          </Button>
          <Button
            outline
            onClick={openPortal}
            disabled={!selectedChatbotId || billingAction}
          >
            {t('manageBilling')}
          </Button>
        </div>
      </section>
    </div>
  )
}
