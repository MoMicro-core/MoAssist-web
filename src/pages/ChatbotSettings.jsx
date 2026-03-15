import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useChatbot } from '../context/ChatbotContext'
import { Button } from '../ui/button'
import { Field, FieldGroup, Label } from '../ui/fieldset'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select } from '../ui/select'
import { Switch } from '../ui/switch'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Loading } from '../components/Loading'

const splitList = (value) =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)

const listToText = (value) => (value || []).join('\n')

export const ChatbotSettings = () => {
  const { chatbotId } = useParams()
  const { chatbot, loading, reload } = useChatbot()
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (chatbot?.settings) {
      setDraft(chatbot.settings)
    }
  }, [chatbot])

  useEffect(() => {
    const loadFiles = async () => {
      const data = await api.chatbots.files(chatbotId)
      setFiles(data || [])
    }
    loadFiles()
  }, [chatbotId])

  const update = (field) => (event) => {
    setDraft((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const updateBoolean = (field) => (value) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  const updateBrand = (field) => (event) => {
    setDraft((prev) => ({
      ...prev,
      brand: { ...(prev.brand || {}), [field]: event.target.value },
    }))
  }

  const updateTheme = (mode, field) => (event) => {
    setDraft((prev) => ({
      ...prev,
      theme: {
        ...(prev.theme || {}),
        [mode]: { ...(prev.theme?.[mode] || {}), [field]: event.target.value },
      },
    }))
  }

  const updateAi = (field) => (event) => {
    setDraft((prev) => ({
      ...prev,
      ai: { ...(prev.ai || {}), [field]: event.target.value },
    }))
  }

  const updateAiBoolean = (field) => (value) => {
    setDraft((prev) => ({
      ...prev,
      ai: { ...(prev.ai || {}), [field]: value },
    }))
  }

  const updateDomains = (event) => {
    setDraft((prev) => ({ ...prev, domains: splitList(event.target.value) }))
  }

  const updateSuggested = (event) => {
    setDraft((prev) => ({
      ...prev,
      suggestedMessages: splitList(event.target.value),
    }))
  }

  const updateLeadsField = (index, field, value) => {
    setDraft((prev) => {
      const next = [...(prev.leadsForm || [])]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, leadsForm: next }
    })
  }

  const addLeadField = () => {
    setDraft((prev) => ({
      ...prev,
      leadsForm: [
        ...(prev.leadsForm || []),
        { key: '', label: '', type: 'text', required: false },
      ],
    }))
  }

  const removeLeadField = (index) => {
    setDraft((prev) => ({
      ...prev,
      leadsForm: (prev.leadsForm || []).filter((_, idx) => idx !== index),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await api.chatbots.update(chatbotId, draft)
      await reload()
    } catch (err) {
      setError(err?.message || 'Unable to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (event) => {
    const selection = Array.from(event.target.files || [])
    if (!selection.length) return
    setUploading(true)
    setError('')
    try {
      await api.chatbots.uploadFiles(chatbotId, selection)
      const data = await api.chatbots.files(chatbotId)
      setFiles(data || [])
    } catch (err) {
      setError(err?.message || 'Unable to upload files')
    } finally {
      setUploading(false)
    }
    event.target.value = ''
  }

  const handleFileDelete = async (fileId) => {
    setError('')
    try {
      await api.chatbots.deleteFile(chatbotId, fileId)
      setFiles((prev) => prev.filter((file) => file.id !== fileId))
    } catch (err) {
      setError(err?.message || 'Unable to delete file')
    }
  }

  const domainText = useMemo(() => listToText(draft?.domains), [draft?.domains])
  const suggestedText = useMemo(
    () => listToText(draft?.suggestedMessages),
    [draft?.suggestedMessages],
  )

  if (loading || !draft) return <Loading />

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Heading level={3} className="font-display text-lg">
          Chatbot settings
        </Heading>
        <Button color="teal" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving' : 'Save changes'}
        </Button>
      </div>
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <Heading level={4} className="font-display text-base">
          Basics
        </Heading>
        <FieldGroup>
          <Field>
            <Label>Title</Label>
            <Input value={draft.title || ''} onChange={update('title')} />
          </Field>
          <Field>
            <Label>Bot name</Label>
            <Input value={draft.botName || ''} onChange={update('botName')} />
          </Field>
          <Field>
            <Label>Status</Label>
            <Select value={draft.status || 'draft'} onChange={update('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </Field>
          <Field>
            <Label>Initial message</Label>
            <Textarea value={draft.initialMessage || ''} onChange={update('initialMessage')} rows={3} />
          </Field>
          <Field>
            <Label>Input placeholder</Label>
            <Input value={draft.inputPlaceholder || ''} onChange={update('inputPlaceholder')} />
          </Field>
        </FieldGroup>
      </section>

      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <Heading level={4} className="font-display text-base">
          Appearance
        </Heading>
        <FieldGroup>
          <Field>
            <Label>Widget location</Label>
            <Select value={draft.widgetLocation || 'right'} onChange={update('widgetLocation')}>
              <option value="right">Right</option>
              <option value="left">Left</option>
            </Select>
          </Field>
          <Field>
            <Label>Rounded corners</Label>
            <Switch checked={Boolean(draft.rounded)} onChange={updateBoolean('rounded')} />
          </Field>
          <Field>
            <Label>Logo URL</Label>
            <Input value={draft.brand?.logoUrl || ''} onChange={updateBrand('logoUrl')} />
          </Field>
          <Field>
            <Label>Bubble icon URL</Label>
            <Input value={draft.brand?.bubbleIconUrl || ''} onChange={updateBrand('bubbleIconUrl')} />
          </Field>
        </FieldGroup>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
            <Text className="text-sm font-medium text-zinc-700">Light theme</Text>
            <FieldGroup>
              <Field>
                <Label>Accent</Label>
                <Input value={draft.theme?.light?.accentColor || ''} onChange={updateTheme('light', 'accentColor')} />
              </Field>
              <Field>
                <Label>Background</Label>
                <Input value={draft.theme?.light?.backgroundColor || ''} onChange={updateTheme('light', 'backgroundColor')} />
              </Field>
              <Field>
                <Label>Surface</Label>
                <Input value={draft.theme?.light?.surfaceColor || ''} onChange={updateTheme('light', 'surfaceColor')} />
              </Field>
              <Field>
                <Label>Text</Label>
                <Input value={draft.theme?.light?.textColor || ''} onChange={updateTheme('light', 'textColor')} />
              </Field>
              <Field>
                <Label>Border</Label>
                <Input value={draft.theme?.light?.borderColor || ''} onChange={updateTheme('light', 'borderColor')} />
              </Field>
            </FieldGroup>
          </div>
          <div className="space-y-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
            <Text className="text-sm font-medium text-zinc-700">Dark theme</Text>
            <FieldGroup>
              <Field>
                <Label>Accent</Label>
                <Input value={draft.theme?.dark?.accentColor || ''} onChange={updateTheme('dark', 'accentColor')} />
              </Field>
              <Field>
                <Label>Background</Label>
                <Input value={draft.theme?.dark?.backgroundColor || ''} onChange={updateTheme('dark', 'backgroundColor')} />
              </Field>
              <Field>
                <Label>Surface</Label>
                <Input value={draft.theme?.dark?.surfaceColor || ''} onChange={updateTheme('dark', 'surfaceColor')} />
              </Field>
              <Field>
                <Label>Text</Label>
                <Input value={draft.theme?.dark?.textColor || ''} onChange={updateTheme('dark', 'textColor')} />
              </Field>
              <Field>
                <Label>Border</Label>
                <Input value={draft.theme?.dark?.borderColor || ''} onChange={updateTheme('dark', 'borderColor')} />
              </Field>
            </FieldGroup>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <Heading level={4} className="font-display text-base">
          Domains and prompts
        </Heading>
        <FieldGroup>
          <Field>
            <Label>Allowed domains</Label>
            <Textarea value={domainText} onChange={updateDomains} rows={3} />
          </Field>
          <Field>
            <Label>Suggested messages</Label>
            <Textarea value={suggestedText} onChange={updateSuggested} rows={3} />
          </Field>
        </FieldGroup>
      </section>

      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <Heading level={4} className="font-display text-base">
          Lead capture form
        </Heading>
        <FieldGroup>
          <Field>
            <Label>Form title</Label>
            <Input value={draft.leadsFormTitle || ''} onChange={update('leadsFormTitle')} />
          </Field>
        </FieldGroup>
        <div className="overflow-hidden rounded-xl border border-zinc-100">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Key</TableHeader>
                <TableHeader>Label</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Required</TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {(draft.leadsForm || []).map((field, index) => (
                <TableRow key={`${field.key}-${index}`}>
                  <TableCell>
                    <Input
                      value={field.key}
                      onChange={(event) => updateLeadsField(index, 'key', event.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={field.label}
                      onChange={(event) => updateLeadsField(index, 'label', event.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={field.type}
                      onChange={(event) => updateLeadsField(index, 'type', event.target.value)}
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={Boolean(field.required)}
                      onChange={(value) => updateLeadsField(index, 'required', value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button outline onClick={() => removeLeadField(index)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button outline onClick={addLeadField}>
          Add field
        </Button>
      </section>

      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <Heading level={4} className="font-display text-base">
          AI configuration
        </Heading>
        <FieldGroup>
          <Field>
            <Label>Enable AI replies</Label>
            <Switch checked={Boolean(draft.ai?.enabled)} onChange={updateAiBoolean('enabled')} />
          </Field>
          <Field>
            <Label>Template</Label>
            <Input value={draft.ai?.template || ''} onChange={updateAi('template')} />
          </Field>
          <Field>
            <Label>Response length</Label>
            <Select value={draft.ai?.responseLength || 'medium'} onChange={updateAi('responseLength')}>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </Select>
          </Field>
          <Field>
            <Label>Guidelines</Label>
            <Textarea value={draft.ai?.guidelines || ''} onChange={updateAi('guidelines')} rows={4} />
          </Field>
        </FieldGroup>
      </section>

      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <Heading level={4} className="font-display text-base">
            Knowledge files
          </Heading>
          <label className="flex items-center gap-2">
            <Button outline disabled={uploading}>
              {uploading ? 'Uploading' : 'Upload files'}
            </Button>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.txt,.json"
            />
          </label>
        </div>
        <div className="overflow-hidden rounded-xl border border-zinc-100">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Size</TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>
                    <Badge color={file.status === 'ready' ? 'emerald' : 'zinc'}>
                      {file.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{Math.round(file.size / 1024)} KB</TableCell>
                  <TableCell>
                    <Button outline onClick={() => handleFileDelete(file.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {files.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Text className="text-sm text-zinc-500">No files uploaded.</Text>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
