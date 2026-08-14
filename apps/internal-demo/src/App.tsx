import { AppShell, Button, Sidebar, Stack, TabBar, Typography } from '@chameleon-ui/components'
import { PHASE_2_LOCALES, type Phase2Locale } from '@chameleon-ui/i18n'
import { themeIds, type ThemeId } from '@chameleon-ui/themes'
import { useEffect, useMemo, useState } from 'react'
import { BlindTestView } from './BlindTestView'
import { ComponentGallery } from './ComponentGallery'
import { LabPreview } from './LabPreview'
import { SuitePreview } from './SuitePreview'
import { ThreeEndPlayground, ThreeEndStage, readEndParam, type ThreeEndKind } from './ThreeEndView'
import {
  readLabParam,
  readLocaleParam,
  readThemeParam,
  readViewParam,
  useDemoMessages,
  type DemoView,
  type LabCase,
} from './messages'
import './App.css'

function writeQuery(next: {
  locale: Phase2Locale
  theme: ThemeId
  view: DemoView
  lab: LabCase
  end: ThreeEndKind
}) {
  if (next.view === 'blind') {
    const params = new URLSearchParams({ view: 'blind', locale: next.locale })
    window.history.replaceState(null, '', `/?${params.toString()}`)
    return
  }

  const params = new URLSearchParams({
    locale: next.locale,
    theme: next.theme,
  })
  if (next.view !== 'live') params.set('view', next.view)
  if (next.view === 'lab') {
    params.set('lab', next.lab)
    const overlay = new URLSearchParams(window.location.search).get('overlay')
    if (overlay === 'dialog' || overlay === 'sheet') params.set('overlay', overlay)
  }
  if (next.view === 'three-end-stage') {
    params.set('end', next.end)
  }
  window.history.replaceState(null, '', `/?${params.toString()}`)
}

export function App() {
  const initial = useMemo(() => new URLSearchParams(window.location.search), [])
  const [locale, setLocale] = useState<Phase2Locale>(() => readLocaleParam(initial.get('locale')))
  const [theme, setTheme] = useState<ThemeId>(() => readThemeParam(initial.get('theme')))
  const [view, setView] = useState<DemoView>(() => readViewParam(initial.get('view')))
  const [labCase] = useState<LabCase>(() => readLabParam(initial.get('lab')))
  const [end] = useState<ThreeEndKind>(() => readEndParam(initial.get('end')))
  const { t, dir } = useDemoMessages(locale)

  document.documentElement.lang = locale
  document.documentElement.dir = dir
  document.documentElement.classList.toggle('cu-demo-vr', view === 'suite')
  document.documentElement.classList.toggle('cu-demo-lab', view === 'lab')
  document.documentElement.classList.toggle('cu-demo-blind', view === 'blind')
  document.documentElement.classList.toggle('cu-demo-three-end', view === 'three-end')
  document.documentElement.classList.toggle('cu-demo-three-end-stage', view === 'three-end-stage')
  document.documentElement.classList.toggle('cu-demo-adaptive', view === 'gallery' || view === 'live')
  if (view !== 'blind') document.documentElement.dataset.theme = theme
  if (view === 'lab') document.documentElement.dataset.labCase = labCase
  else delete document.documentElement.dataset.labCase
  if (view === 'three-end-stage') document.documentElement.dataset.end = end
  else delete document.documentElement.dataset.end

  useEffect(() => {
    writeQuery({ locale, theme, view, lab: labCase, end })
  }, [locale, theme, view, labCase, end])

  const galleryNav = [
    { value: 'live', label: t('demo.threeEndNav') },
    { value: 'gallery', label: t('demo.overview') },
    { value: 'suite', label: t('demo.suiteNav') },
  ]

  function goNav(value: string) {
    if (value === 'live' || value === 'three-end' || value === 'suite' || value === 'gallery') setView(value)
  }

  const header = (
    <Stack align="center" direction="row" gap="2" justify="between">
      <div>
        <p className="cu-demo-kicker">{t('demo.kicker')}</p>
        <Typography variant="heading-2">{t('demo.title')}</Typography>
      </div>
      <Stack align="center" direction="row" gap="2">
        <label className="cu-demo-field">
          {t('demo.themeLabel')}
          <select
            data-demo="theme"
            value={theme}
            onChange={(event) => setTheme(readThemeParam(event.currentTarget.value))}
          >
            {themeIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <label className="cu-demo-field">
          {t('demo.localeLabel')}
          <select
            data-demo="locale"
            value={locale}
            onChange={(event) => setLocale(readLocaleParam(event.currentTarget.value))}
          >
            {PHASE_2_LOCALES.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <Button size="sm" variant="outline" onClick={() => setView(view === 'live' ? 'gallery' : 'live')}>
          {view === 'live' ? t('demo.overview') : t('demo.threeEndNav')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setView((current) => (current === 'suite' ? 'live' : 'suite'))}
        >
          {view === 'suite' ? t('demo.overview') : t('demo.suiteNav')}
        </Button>
      </Stack>
    </Stack>
  )

  if (view === 'suite') {
    return <SuitePreview t={t} />
  }

  if (view === 'lab') {
    return <LabPreview t={t} labCase={labCase} />
  }

  if (view === 'blind') {
    return <BlindTestView t={t} />
  }

  if (view === 'three-end') {
    return (
      <ThreeEndPlayground
        t={t}
        locale={locale}
        theme={theme}
        onLocale={setLocale}
        onTheme={setTheme}
        onBack={() => setView('live')}
      />
    )
  }

  if (view === 'three-end-stage') {
    return <ThreeEndStage t={t} end={end} />
  }

  if (view === 'gallery') {
    return (
      <div className="cu-demo-adaptive" data-demo="adaptive">
        <AppShell
          header={header}
          sidebar={
            <Sidebar
              label={t('appShell.sidebar')}
              items={galleryNav}
              collapsible
              collapseLabel={t('sidebar.collapse')}
              expandLabel={t('sidebar.expand')}
              activeValue="gallery"
              onSelect={goNav}
            />
          }
          sidebarLabel={t('appShell.sidebar')}
          tabBar={<TabBar label={t('tabBar.label')} items={galleryNav} value="gallery" onChange={goNav} />}
        >
          <div id="gallery">
            <p className="cu-demo-adaptive-hint">{t('demo.adaptiveHint')}</p>
            <ComponentGallery t={t} />
          </div>
        </AppShell>
      </div>
    )
  }

  return (
    <div className="cu-demo-adaptive" data-demo="adaptive" data-cu-shell>
      <ThreeEndStage t={t} end="phone" toolbar={header} />
    </div>
  )
}
