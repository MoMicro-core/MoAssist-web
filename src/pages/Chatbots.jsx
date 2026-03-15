import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Dialog, DialogBody, DialogActions, DialogTitle } from '../ui/dialog'
import { Field, FieldGroup, Label } from '../ui/fieldset'
import { Input } from '../ui/input'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { Loading } from '../components/Loading'
import { EmptyState } from '../components/EmptyState'

export const Chatbots = () => {
  const navigate = useNavigate()
  const [chatbots, setChatbots] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')

  const loadChatbots = async () => {
    setLoading(true)
    const data = await api.chatbots.list()
    setChatbots(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadChatbots()
  }, [])

  const statusColor = useMemo(
    () => (status) => (status === 'published' ? 'emerald' : 'zinc'),
    [],
  )

  const openCreate = () => {
    setTitle('')
    setDialogOpen(true)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setCreating(true)
    const settings = title ? { title } : undefined
    const created = await api.chatbots.create(settings || {})
    setCreating(false)
    setDialogOpen(false)
    navigate(`/chatbots/${created.id}/settings`)
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Heading level={2} className="font-display text-2xl">
            Chatbots
          </Heading>
          <Text className="text-sm text-zinc-600">
            Create, publish, and monitor assistants.
          </Text>
        </div>
        <Button color="teal" onClick={openCreate}>
          New chatbot
        </Button>
      </div>
      {chatbots.length === 0 ? (
        <EmptyState
          title="No chatbots yet"
          description="Create your first chatbot to start collecting conversations."
          actionLabel="Create chatbot"
          onAction={openCreate}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {chatbots.map((chatbot) => (
            <button
              key={chatbot.id}
              onClick={() => navigate(`/chatbots/${chatbot.id}/dashboard`)}
              className="text-left"
            >
              <div className="group flex h-full flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Heading level={3} className="font-display text-lg">
                      {chatbot.settings?.title || 'MoAssist Bot'}
                    </Heading>
                    <Badge color={statusColor(chatbot.settings?.status)}>
                      {chatbot.settings?.status || 'draft'}
                    </Badge>
                  </div>
                  <Text className="text-sm text-zinc-600">
                    {chatbot.settings?.botName || 'MoAssist'}
                  </Text>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-zinc-600">
                  <div className="rounded-xl bg-zinc-50 px-3 py-2">
                    <div className="text-zinc-900">
                      {chatbot.metrics?.conversationsCount || 0}
                    </div>
                    <div>Conversations</div>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-3 py-2">
                    <div className="text-zinc-900">
                      {chatbot.metrics?.unreadCount || 0}
                    </div>
                    <div>Unread</div>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-3 py-2">
                    <div className="text-zinc-900">
                      {chatbot.metrics?.filesCount || 0}
                    </div>
                    <div>Files</div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} size="md">
        <DialogTitle>Create a new chatbot</DialogTitle>
        <DialogBody>
          <form onSubmit={handleCreate} className="space-y-6">
            <FieldGroup>
              <Field>
                <Label>Chatbot name</Label>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="MoAssist Bot"
                />
              </Field>
            </FieldGroup>
            <DialogActions>
              <Button outline type="button" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button color="teal" type="submit" disabled={creating}>
                {creating ? 'Creating' : 'Create chatbot'}
              </Button>
            </DialogActions>
          </form>
        </DialogBody>
      </Dialog>
    </div>
  )
}
