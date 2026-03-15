import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { Button } from '../ui/button'
import { Loading } from '../components/Loading'

export const ChatbotPlugin = () => {
  const { chatbotId } = useParams()
  const [install, setInstall] = useState(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Heading level={3} className="font-display text-lg">
          Embed your chatbot
        </Heading>
        <Text className="text-sm text-zinc-600">
          Use the snippets below to install the widget on your website.
        </Text>
      </div>
      <div className="grid gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Heading level={4} className="font-display text-base">
              Script embed
            </Heading>
            <Button outline onClick={() => copy(install?.scriptSnippet)}>
              Copy
            </Button>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-zinc-100">
            {install?.scriptSnippet}
          </pre>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Heading level={4} className="font-display text-base">
              Iframe embed
            </Heading>
            <Button outline onClick={() => copy(install?.iframeSnippet)}>
              Copy
            </Button>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-zinc-100">
            {install?.iframeSnippet}
          </pre>
        </div>
      </div>
    </div>
  )
}
