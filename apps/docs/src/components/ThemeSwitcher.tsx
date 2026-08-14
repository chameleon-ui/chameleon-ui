import { themeIds, type ThemeId, isThemeId } from '@chameleon-ui/themes'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useEffect, useState } from 'react'
import { getTranslator } from '../messages'
import { readThemeQuery, writeThemeQuery } from '../theme'

const STORAGE_KEY = 'cu-docs-theme'

function initialTheme(): ThemeId {
  if (typeof window === 'undefined') return 'line'
  const fromQuery = readThemeQuery()
  if (fromQuery) return fromQuery
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved && isThemeId(saved) ? saved : 'line'
}

export default function ThemeSwitcher(_props: Record<string, unknown>) {
  const { i18n } = useDocusaurusContext()
  const { t } = getTranslator(i18n?.currentLocale ?? 'zh-CN')
  const [theme, setTheme] = useState<ThemeId>(initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(STORAGE_KEY, theme)
    writeThemeQuery(theme)
  }, [theme])

  return (
    <label className="cu-docs-field cu-docs-theme-switcher">
      {t('docs.themeLabel')}
      <select
        data-docs="theme"
        value={theme}
        onChange={(event) => setTheme(readTheme(event.currentTarget.value))}
      >
        {themeIds.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
    </label>
  )
}

function readTheme(value: string): ThemeId {
  return isThemeId(value) ? value : 'line'
}
