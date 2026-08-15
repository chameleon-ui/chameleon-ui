import { AppShell, Button, Navigation, NavigationBar, Stack, Typography } from '@chameleon-ui/components'
import { PHASE_2_LOCALES, type Phase2Locale } from '@chameleon-ui/i18n'
import { themeIds, type ThemeId } from '@chameleon-ui/themes'
import { useEffect, useMemo, useState } from 'react'
import { BlindTestView } from './BlindTestView'
import { BlocksGallery } from './BlocksGallery'
import { ComponentGallery } from './ComponentGallery'
import { LabPreview } from './LabPreview'
import { ProductStudio, type StreetExit } from './ProductStudio'
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

/** Product-facing map entries (suite/lab stay VR-clean; lab stays URL-only). */
const MAP_VIEWS = ['street', 'three-end', 'gallery', 'blocks', 'suite', 'blind'] as const
type MapView = (typeof MAP_VIEWS)[number]

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
  if (next.view !== 'street') params.set('view', next.view)
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

function isMapView(value: string): value is MapView {
  return (MAP_VIEWS as readonly string[]).includes(value)
}

export function App() {
  const initial = useMemo(() => new URLSearchParams(window.location.search), [])
  const [locale, setLocale] = useState<Phase2Locale>(() => readLocaleParam(initial.get('locale')))
  const [theme, setTheme] = useState<ThemeId>(() => readThemeParam(initial.get('theme')))
  const [view, setView] = useState<DemoView>(() => readViewParam(initial.get('view')))
  const [labCase] = useState<LabCase>(() => readLabParam(initial.get('lab')))
  const [end] = useState<ThreeEndKind>(() => readEndParam(initial.get('end')))
  const { t, dir } = useDemoMessages(locale)

  // Legacy alias: inspector used to open `live` (stage-only). Product path is three-end.
  useEffect(() => {
    if (view === 'live') setView('three-end')
  }, [view])

  document.documentElement.lang = locale
  document.documentElement.dir = dir
  document.documentElement.classList.toggle('cu-demo-vr', view === 'suite')
  document.documentElement.classList.toggle('cu-demo-lab', view === 'lab')
  document.documentElement.classList.toggle('cu-demo-blind', view === 'blind')
  document.documentElement.classList.toggle('cu-demo-three-end', view === 'three-end')
  document.documentElement.classList.toggle('cu-demo-three-end-stage', view === 'three-end-stage')
  document.documentElement.classList.toggle(
    'cu-demo-adaptive',
    view === 'gallery' || view === 'blocks' || view === 'street',
  )
  if (view !== 'blind') document.documentElement.dataset.theme = theme
  if (view === 'lab') document.documentElement.dataset.labCase = labCase
  else delete document.documentElement.dataset.labCase
  if (view === 'three-end-stage') document.documentElement.dataset.end = end
  else delete document.documentElement.dataset.end

  useEffect(() => {
    writeQuery({ locale, theme, view, lab: labCase, end })
  }, [locale, theme, view, labCase, end])

  const galleryNav = [
    { value: 'street', label: t('demo.streetNav') },
    { value: 'three-end', label: t('demo.threeEndNav') },
    { value: 'gallery', label: t('demo.overview') },
    { value: 'blocks', label: t('demo.blocksNav') },
    { value: 'suite', label: t('demo.suiteNav') },
  ]

  function goNav(value: string) {
    if (
      value === 'street' ||
      value === 'three-end' ||
      value === 'suite' ||
      value === 'gallery' ||
      value === 'blocks' ||
      value === 'blind'
    ) {
      setView(value)
    }
  }

  function onStreetExit(exit: StreetExit) {
    setView(exit)
  }

  const mapValue: MapView = isMapView(view) ? view : 'street'

  const header = (
    <Stack align="center" direction="row" gap="2" justify="between">
      <div>
        <p className="cu-demo-kicker">{t('demo.kicker')}</p>
        <Typography variant="heading-2">{t('demo.title')}</Typography>
      </div>
      <Stack align="center" direction="row" gap="2">
        <label className="cu-demo-field">
          {t('demo.mapLabel')}
          <select
            data-demo="map"
            value={mapValue}
            onChange={(event) => {
              const next = event.currentTarget.value
              if (isMapView(next)) setView(next)
            }}
          >
            <option value="street">{t('demo.streetNav')}</option>
            <option value="three-end">{t('demo.threeEndNav')}</option>
            <option value="gallery">{t('demo.overview')}</option>
            <option value="blocks">{t('demo.blocksNav')}</option>
            <option value="suite">{t('demo.suiteNav')}</option>
            <option value="blind">{t('demo.blindNav')}</option>
          </select>
        </label>
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
    return (
      <div data-demo="blind-shell">
        <div className="cu-demo-escape" role="region" aria-label={t('demo.mapLabel')}>
          <Button size="sm" variant="outline" onClick={() => setView('street')} data-demo="back-studio">
            {t('demo.backToStudio')}
          </Button>
        </div>
        <BlindTestView t={t} />
      </div>
    )
  }

  if (view === 'three-end' || view === 'live') {
    return (
      <ThreeEndPlayground
        t={t}
        locale={locale}
        theme={theme}
        onLocale={setLocale}
        onTheme={setTheme}
        onBack={() => setView('street')}
      />
    )
  }

  if (view === 'three-end-stage') {
    return <ThreeEndStage t={t} end={end} />
  }

  if (view === 'gallery') {
    return (
      <div className="cu-demo-adaptive" data-demo="adaptive">
        <div className="cu-demo-inspector" role="region" aria-label={t('demo.overview')}>
          {header}
        </div>
        <AppShell
          header={<NavigationBar title={t('demo.overview')} />}
          navigation={
            <Navigation
              label={t('navigation.label')}
              items={galleryNav}
              collapseLabel={t('navigation.collapse')}
              expandLabel={t('navigation.expand')}
              moreLabel={t('navigation.more')}
              activeValue="gallery"
              onSelect={goNav}
            />
          }
        >
          <div id="gallery">
            <p className="cu-demo-adaptive-hint">{t('demo.adaptiveHint')}</p>
            <ComponentGallery t={t} />
          </div>
        </AppShell>
      </div>
    )
  }

  if (view === 'blocks') {
    return (
      <div className="cu-demo-adaptive" data-demo="blocks">
        <div className="cu-demo-inspector" role="region" aria-label={t('demo.blocksNav')}>
          {header}
        </div>
        <BlocksGallery locale={locale} />
      </div>
    )
  }

  return (
    <div className="cu-demo-adaptive" data-demo="adaptive" data-cu-shell>
      <div className="cu-demo-inspector" role="region" aria-label={t('demo.overview')}>
        {header}
      </div>
      <ProductStudio t={t} onNavigate={onStreetExit} />
    </div>
  )
}
