import clsx from 'clsx'
import { useTheme } from '../context/ThemeContext'
import { useI18n } from '../context/I18nContext'

export const ThemeToggle = ({ className }) => {
  const { theme, setTheme } = useTheme()
  const { t } = useI18n()
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={`${t('theme')}: ${dark ? t('light') : t('dark')}`}
      className={clsx(
        className,
        'ui-pressable relative inline-flex h-10 w-[5.25rem] items-center rounded-full border border-zinc-300/70 bg-white/80 p-1 text-xs font-medium text-zinc-700 shadow-sm dark:border-white/15 dark:bg-zinc-900/80 dark:text-zinc-200',
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          'absolute left-1 top-1 h-8 w-[2.35rem] rounded-full bg-zinc-900 transition-transform duration-300 ease-out dark:bg-white',
          dark ? 'translate-x-[2rem]' : 'translate-x-0',
        )}
      />
      <span className="relative z-10 grid w-full grid-cols-2 text-[11px] leading-none">
        <span
          className={clsx(
            'text-center transition-colors duration-300',
            dark ? 'text-zinc-500 dark:text-zinc-500' : 'text-white',
          )}
        >
          {t('light')}
        </span>
        <span
          className={clsx(
            'text-center transition-colors duration-300',
            dark ? 'text-zinc-900' : 'text-zinc-500',
          )}
        >
          {t('dark')}
        </span>
      </span>
    </button>
  )
}
