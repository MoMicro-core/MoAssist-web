import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Field, Label } from '../ui/fieldset'
import { Select } from '../ui/select'
import { Loading } from '../components/Loading'
import { useI18n } from '../context/I18nContext'

const capabilityLabels = {
  authenticated_widget: 'Signed-in customer support',
  ai_responder: 'AI answers',
  knowledge_files: 'Knowledge uploads',
}

const humanizeLimitKey = (key = '') =>
  String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())

export const Billings = () => {
  const { t } = useI18n()
  const { chatbotId: routeChatbotId } = useParams()
  const [chatbots, setChatbots] = useState([])
  const [selectedChatbotId, setSelectedChatbotId] = useState(routeChatbotId || '')
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
        setSelectedChatbotId(routeChatbotId || next[0]?.id || '')
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
  }, [routeChatbotId])

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
  const isChatbotBilling = Boolean(routeChatbotId)
  const sortedTiers = useMemo(
    () =>
      [...(summary?.availableTiers || [])].sort(
        (left, right) => left.monthlyPriceUsd - right.monthlyPriceUsd,
      ),
    [summary?.availableTiers],
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

  const openCheckout = async (tierId) => {
    await runAction(() =>
      api.billing.checkout({ chatbotId: selectedChatbotId, tierId }),
    )
  }

  const openPortal = async () => {
    await runAction(() => api.billing.portal({ chatbotId: selectedChatbotId }))
  }

  const startTrial = async () => {
    await runAction(() => api.billing.trial({ chatbotId: selectedChatbotId }))
  }

  if (loading) return <Loading />

  const premiumStatus = summary?.premiumStatus || 'free'
  const currentTierId = summary?.currentTier?.id || 'free'
  const periodEnd = summary?.premiumCurrentPeriodEnd
    ? new Date(summary.premiumCurrentPeriodEnd).toLocaleDateString()
    : 'N/A'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Heading level={2} className="font-display text-2xl">
            {isChatbotBilling ? t('billingTab') : t('billings')}
          </Heading>
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">
            {isChatbotBilling ? t('billingAccessBody') : t('billingPerChatbotBody')}
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
        {!isChatbotBilling ? (
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
        ) : null}

        {!chatbots.length ? (
          <Text className="text-sm text-zinc-500">{t('noChatbotsForBilling')}</Text>
        ) : (
          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <div>
              {t('selectedChatbot')}: {selectedChatbot?.settings?.title || selectedChatbot?.id}
            </div>
            <div>
              {t('planLabel')}: {summary?.currentTier?.name || summary?.premiumPlan || 'free'}
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

        <div className="grid gap-4 lg:grid-cols-3">
          {sortedTiers.map((tier) => {
            const isCurrent = tier.id === currentTierId
            const capabilities =
              tier.capabilities?.length
                ? tier.capabilities
                : ['Live visitor chat']
            const limits = Object.entries(tier.limits || {})

            return (
              <div
                key={tier.id}
                className={`rounded-2xl border p-5 ${
                  isCurrent
                    ? 'border-sky-300 bg-sky-50/80 dark:border-cyan-400/40 dark:bg-sky-950/20'
                    : 'border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900/70'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Heading level={3} className="font-display text-lg">
                      {tier.name}
                    </Heading>
                    <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                      {tier.metadata?.description || t('tierDescriptionFallback')}
                    </Text>
                  </div>
                  <Badge color={isCurrent ? 'sky' : 'zinc'}>
                    {tier.monthlyPriceUsd > 0
                      ? `$${tier.monthlyPriceUsd}/mo`
                      : t('freePlanLabel')}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {capabilities.map((capability) => (
                    <div key={capability}>
                      {capabilityLabels[capability] || capability}
                    </div>
                  ))}
                  {limits.map(([key, value]) => (
                    <div key={key}>
                      {humanizeLimitKey(key)}: {value}
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  {isCurrent ? (
                    <Button outline disabled className="w-full">
                      {t('currentPlanCta')}
                    </Button>
                  ) : tier.checkoutEnabled ? (
                    <Button
                      color="teal"
                      className="w-full"
                      onClick={() => openCheckout(tier.id)}
                      disabled={!selectedChatbotId || billingAction}
                    >
                      {t('upgradeToPlan')}
                    </Button>
                  ) : (
                    <Button outline disabled className="w-full">
                      {t('freePlanLabel')}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            outline
            onClick={startTrial}
            disabled={!selectedChatbotId || billingAction || premiumStatus !== 'free'}
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
