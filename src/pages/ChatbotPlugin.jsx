import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { Button } from '../ui/button'
import { Loading } from '../components/Loading'
import { useI18n } from '../context/I18nContext'
import { useChatbot } from '../context/ChatbotContext'
import { ChatbotPreview } from '../components/ChatbotPreview'

export const ChatbotPlugin = () => {
  const { chatbotId } = useParams()
  const { t } = useI18n()
  const { chatbot } = useChatbot()
  const [install, setInstall] = useState(null)
  const [loading, setLoading] = useState(true)

  const getPath = (value) => {
    if (!value) return ''
    try {
      return new URL(value).pathname
    } catch {
      return value.replace(/^https?:\/\/[^/]+/, '')
    }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await api.chatbots.install(chatbotId)
      setInstall(data)
      setLoading(false)
    }
    load()
  }, [chatbotId])

  const copy = async (value) => {
    if (!value) return
    await navigator.clipboard.writeText(value)
  }

  if (loading) return <Loading />

  const scriptPath = getPath(install?.scriptUrl)
  const iframePath = getPath(install?.iframeUrl)
  const displayScriptSnippet =
    install?.scriptSnippet && install?.scriptUrl
      ? install.scriptSnippet.replace(install.scriptUrl, scriptPath)
      : install?.scriptSnippet
  const displayIframeSnippet =
    install?.iframeSnippet && install?.iframeUrl
      ? install.iframeSnippet.replace(install.iframeUrl, iframePath)
      : install?.iframeSnippet

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Heading level={3} className="font-display text-lg">
          {t('embedTitle')}
        </Heading>
        <Text className="text-sm text-zinc-600 dark:text-zinc-300">
          {t('embedBody')}
        </Text>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <Heading level={4} className="font-display text-base">
                {t('scriptEmbed')}
              </Heading>
              <Button outline onClick={() => copy(install?.scriptSnippet)}>
                {t('copy')}
              </Button>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-zinc-100">
              {displayScriptSnippet}
            </pre>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <Heading level={4} className="font-display text-base">
                {t('iframeEmbed')}
              </Heading>
              <Button outline onClick={() => copy(install?.iframeSnippet)}>
                {t('copy')}
              </Button>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-zinc-100">
              {displayIframeSnippet}
            </pre>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <Heading level={4} className="font-display text-base">
            {t('preview')}
          </Heading>
          <div className="mt-4">
            <ChatbotPreview settings={chatbot?.settings} />
          </div>
        </div>
      </div>
    </div>
  )
}
