import { isThemeId, type ThemeId } from '@chameleon-ui/themes'
import { useEffect, useMemo, useState } from 'react'
import { EditorPage } from './EditorPage'
import { ExportPage } from './ExportPage'
import { installThemeStyles } from './theme'
import './App.css'

type StudioRoute = '/editor' | '/export'

function readThemeParam(value: string | null): ThemeId {
  return value && isThemeId(value) ? value : 'line'
}

function readRoute(pathname: string): StudioRoute {
  return pathname.startsWith('/export') ? '/export' : '/editor'
}

export function App() {
  const initial = useMemo(() => new URLSearchParams(window.location.search), [])
  const [themeId, setThemeId] = useState<ThemeId>(() => readThemeParam(initial.get('theme')))
  const [route, setRoute] = useState<StudioRoute>(() => readRoute(window.location.pathname))
  const [rulesOverride, setRulesOverride] = useState<string | null>(null)

  useEffect(() => {
    installThemeStyles()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams({ theme: themeId })
    const nextPath = route === '/export' ? '/export' : '/editor'
    window.history.replaceState(null, '', `${nextPath}?${params.toString()}`)
  }, [route, themeId])

  function navigate(nextRoute: StudioRoute, nextRulesText?: string | null) {
    if (typeof nextRulesText === 'string') {
      setRulesOverride(nextRulesText)
    }
    setRoute(nextRoute)
  }

  if (route === '/export') {
    return (
      <ExportPage
        rulesOverride={rulesOverride}
        themeId={themeId}
        onNavigateEditor={() => navigate('/editor')}
      />
    )
  }

  return (
    <EditorPage
      themeId={themeId}
      onThemeChange={setThemeId}
      onNavigateExport={() => {
        const editor = document.querySelector<HTMLTextAreaElement>('textarea[aria-label="Design rules JSON"]')
        navigate('/export', editor?.value ?? null)
      }}
    />
  )
}
