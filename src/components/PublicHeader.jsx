import { Button } from '../ui/button'
import { Select } from '../ui/select'
import { ThemeToggle } from './ThemeToggle'
import { useI18n } from '../context/I18nContext'

export const PublicHeader = ({ showActions = true }) => {
  const { language, setLanguage, languages } = useI18n()

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 pt-6 sm:px-8">
      <a href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-sm font-bold text-white">
          M
        </div>
        <div>
          <div className="font-display text-lg font-semibold text-zinc-900 dark:text-white">MoAssist</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">AI chat concierge</div>
        </div>
      </a>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-[4.6rem] sm:w-24">
          <Select value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </Select>
        </div>

        <ThemeToggle />

        {showActions ? (
          <div className="hidden items-center gap-2 sm:flex">
            <Button outline href="/login">
              Login
            </Button>
            <Button color="teal" href="/chatbots">
              Try now
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  )
}
