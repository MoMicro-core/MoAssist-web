import { useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Text } from '../ui/text'
import { useI18n } from '../context/I18nContext'

const fallbackTheme = {
  light: {
    accentColor: '#0f766e',
    backgroundColor: '#f8fafc',
    surfaceColor: '#ffffff',
    textColor: '#0f172a',
    accentTextColor: '#ffffff',
    borderColor: '#cbd5e1',
  },
  dark: {
    accentColor: '#14b8a6',
    backgroundColor: '#0f172a',
    surfaceColor: '#111827',
    textColor: '#e5e7eb',
    accentTextColor: '#042f2e',
    borderColor: '#1f2937',
  },
}

export const ChatbotPreview = ({ settings }) => {
  const [mode, setMode] = useState('light')
  const { t } = useI18n()
  const theme = settings?.theme || fallbackTheme
  const palette = theme?.[mode] || fallbackTheme[mode]
  const initialMessage =
    settings?.initialMessage || 'Hi. How can I help you today?'
  const suggested = settings?.suggestedMessages || []
  const userPrompt =
    suggested[0] || 'How can I reset my password?'
  const botName = settings?.botName || 'MoAssist'
  const logoUrl = settings?.brand?.logoUrl
  const borderRadius = settings?.rounded ? '20px' : '6px'
  const containerRadius = settings?.rounded ? 'rounded-3xl' : 'rounded-xl'

  const bubbleStyle = useMemo(
    () => ({
      backgroundColor: palette.surfaceColor,
      color: palette.textColor,
      borderColor: palette.borderColor,
      borderRadius,
    }),
    [palette, borderRadius],
  )

  const userBubbleStyle = useMemo(
    () => ({
      backgroundColor: palette.accentColor,
      color: palette.accentTextColor,
      borderRadius,
    }),
    [palette, borderRadius],
  )

  return (
    <div
      className={`flex w-full flex-col gap-3 overflow-hidden border shadow-sm ${containerRadius}`}
      style={{ backgroundColor: palette.surfaceColor, borderColor: palette.borderColor }}
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-3"
        style={{ backgroundColor: palette.backgroundColor }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-sm font-semibold"
            style={{ backgroundColor: palette.accentColor, color: palette.accentTextColor }}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={botName} className="h-full w-full object-cover" />
            ) : (
              botName.slice(0, 1)
            )}
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: palette.textColor }}>
              {botName}
            </div>
            <div className="text-xs" style={{ color: palette.textColor, opacity: 0.7 }}>
              {t('online')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge color={mode === 'light' ? 'teal' : 'zinc'}>{t('light')}</Badge>
          <Button outline onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
            {mode === 'light' ? t('dark') : t('light')}
          </Button>
        </div>
      </div>
      <div className="flex min-h-[320px] flex-1 flex-col gap-3 px-4 py-4">
        <div className="max-w-[85%] rounded-2xl border px-3 py-2 text-sm" style={bubbleStyle}>
          {initialMessage}
        </div>
        <div
          className="ml-auto max-w-[85%] rounded-2xl px-3 py-2 text-sm"
          style={userBubbleStyle}
        >
          {userPrompt}
        </div>
        {suggested.length > 1 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {suggested.slice(1, 4).map((msg) => (
              <span
                key={msg}
                className="rounded-full border px-3 py-1 text-xs"
                style={{ borderColor: palette.borderColor, color: palette.textColor }}
              >
                {msg}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div
        className="border-t px-4 py-3"
        style={{ borderColor: palette.borderColor, backgroundColor: palette.backgroundColor }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex-1 rounded-2xl border px-3 py-2 text-xs"
            style={{ borderColor: palette.borderColor, color: palette.textColor }}
          >
            {settings?.inputPlaceholder || 'Write a message...'}
          </div>
          <Button color="teal">{t('send')}</Button>
        </div>
        <Text className="mt-2 text-xs" style={{ color: palette.textColor, opacity: 0.6 }}>
          Powered by MoAssist
        </Text>
      </div>
    </div>
  )
}
