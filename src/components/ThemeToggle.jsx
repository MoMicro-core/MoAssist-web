import clsx from 'clsx'
import { useTheme } from '../context/ThemeContext'
import { useI18n } from '../context/I18nContext'

export const ThemeToggle = ({ className }) => {
  const { theme, setTheme } = useTheme()
  const { t } = useI18n()

  return (
    <div
      className={clsx(
        className,
        'inline-flex items-center rounded-xl border border-zinc-300/70 bg-white/80 p-1 shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-zinc-900/80',
      )}
      role="group"
      aria-label={t('theme')}
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={clsx(
          'ui-pressable rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
          theme === 'light'
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
            : 'text-zinc-600 dark:text-zinc-300',
        )}
        aria-pressed={theme === 'light'}
      >
        {t('light')}
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={clsx(
          'ui-pressable rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
          theme === 'dark'
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
            : 'text-zinc-600 dark:text-zinc-300',
        )}
        aria-pressed={theme === 'dark'}
      >
        {t('dark')}
      </button>
    </div>
  )
}
