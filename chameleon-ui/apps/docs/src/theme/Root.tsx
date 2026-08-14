import { type ReactNode, useEffect } from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import '@chameleon-ui/tokens/css'
import '@chameleon-ui/tokens/density.css'
import { isThemeId } from '@chameleon-ui/themes'
import { isAuthoredChrome } from '../messages'
import { installThemeStyles, readThemeQuery } from '../theme'

export default function Root({ children }: { children: ReactNode }) {
  const { i18n } = useDocusaurusContext()
  const locale = i18n.currentLocale
  const authored = isAuthoredChrome(locale)

  useEffect(() => {
    installThemeStyles()
    const fromQuery = readThemeQuery()
    const saved = window.localStorage.getItem('cu-docs-theme')
    const theme = fromQuery ?? (saved && isThemeId(saved) ? saved : 'line')
    document.documentElement.dataset.theme = theme
  }, [])

  return (
    <>
      {!authored ? (
        <p className="cu-docs-banner" data-docs="skeleton">
          Docs chrome for this locale is an English ICU skeleton, not a translation. See the locale gap table
          (LEGACY-2026-004).
        </p>
      ) : null}
      {children}
    </>
  )
}
