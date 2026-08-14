import {
  ActionSheet,
  AppShell,
  Button,
  Card,
  Collapse,
  Dialog,
  Heading,
  HoverCard,
  Input,
  Popover,
  Sidebar,
  Stack,
  TabBar,
  Typography,
} from '@chameleon-ui/components'
import { PHASE_2_LOCALES, type Phase2Locale } from '@chameleon-ui/i18n'
import { themeIds, type ThemeId } from '@chameleon-ui/themes'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { readLocaleParam, readThemeParam } from './messages'

export type ThreeEndKind = 'phone' | 'tablet' | 'desktop' | 'proof'

export const THREE_END_VIEWPORTS = [
  { end: 'phone' as const, width: 390, height: 720, label: '手机' },
  { end: 'tablet' as const, width: 768, height: 720, label: '平板' },
  { end: 'desktop' as const, width: 1280, height: 720, label: '桌面' },
] as const

export function readEndParam(value: string | null): ThreeEndKind {
  if (value === 'tablet' || value === 'desktop' || value === 'proof') return value
  return 'phone'
}

type DemoT = (key: string, values?: Record<string, string | number>) => string

function stageSrc(end: ThreeEndKind, locale: Phase2Locale, theme: ThemeId) {
  const params = new URLSearchParams({
    view: 'three-end-stage',
    end,
    locale,
    theme,
  })
  return `/?${params.toString()}`
}

function navItems(t: DemoT) {
  return [
    { value: 'home', label: t('demo.threeEndNavHome') },
    { value: 'search', label: t('demo.threeEndNavSearch') },
    { value: 'me', label: t('demo.threeEndNavMe') },
  ]
}

function readMedia(query: string) {
  return typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : false
}

function AdaptiveBanners({ t }: { t: DemoT }) {
  return (
    <div data-three-end="banners">
      <p className="cu-three-end-banner cu-three-end-banner--phone">{t('demo.threeEndBannerPhone')}</p>
      <p className="cu-three-end-banner cu-three-end-banner--tablet">{t('demo.threeEndBannerTablet')}</p>
      <p className="cu-three-end-banner cu-three-end-banner--desktop">{t('demo.threeEndBannerDesktop')}</p>
    </div>
  )
}

function DensityPanel({ t }: { t: DemoT }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [stats, setStats] = useState({ control: '—', density: '—', touch: '—' })

  useLayoutEffect(() => {
    const node = hostRef.current
    if (!node) return
    const read = () => {
      const style = getComputedStyle(node)
      setStats({
        control: style.getPropertyValue('--cu-control-size-active').trim() || '—',
        density: style.getPropertyValue('--cu-density-active').trim() || '—',
        touch: style.getPropertyValue('--cu-touch-target-min').trim() || '—',
      })
    }
    read()
    const observer = new ResizeObserver(read)
    observer.observe(node)
    window.addEventListener('resize', read)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', read)
    }
  }, [])

  return (
    <div data-three-end="density">
      <Card padding="md" variant="outlined">
        <Stack gap="2">
          <Typography variant="heading-2">{t('demo.threeEndDensityTitle')}</Typography>
          <Typography variant="caption">
            {t('demo.threeEndDensityValue', { control: stats.control, density: stats.density })}
          </Typography>
          <div className="cu-three-end-meters" ref={hostRef}>
            <div className="cu-three-end-meter">
              <span>{t('demo.threeEndDensityControl')}</span>
              <span className="cu-three-end-bar cu-three-end-bar--control" />
              <code>{stats.control}</code>
            </div>
            <div className="cu-three-end-meter">
              <span>{t('demo.threeEndDensityTouch')}</span>
              <span className="cu-three-end-bar cu-three-end-bar--touch" />
              <code>{stats.touch}</code>
            </div>
          </div>
          <Stack align="center" direction="row" gap="2">
            <Button size="sm">{t('demo.threeEndSmButton')}</Button>
            <Button>{t('button.submit')}</Button>
          </Stack>
        </Stack>
      </Card>
    </div>
  )
}

function PointerNote({ t }: { t: DemoT }) {
  const hover = readMedia('(hover: hover)')
  const fine = readMedia('(pointer: fine)')
  return (
    <div data-three-end="pointer">
      <Typography variant="caption">
        {t('demo.threeEndPointerNote', { hover: hover ? 'true' : 'false', fine: fine ? 'true' : 'false' })}
      </Typography>
    </div>
  )
}

function RevealPair({ t }: { t: DemoT }) {
  return (
    <div data-three-end="reveal">
      <div className="cu-three-end-phone-only">
        <Stack gap="2">
          <Popover
            closeLabel={t('popover.close')}
            description={t('demo.threeEndCollapseBody')}
            title={t('demo.threeEndPopoverClick')}
            trigger={<Button variant="outline">{t('demo.threeEndPopoverClick')}</Button>}
          />
          <Collapse title={t('demo.threeEndCollapseTitle')}>
            <Typography variant="body">{t('demo.threeEndCollapseBody')}</Typography>
          </Collapse>
        </Stack>
      </div>
      <div className="cu-three-end-wide-only">
        <HoverCard trigger={<Button variant="outline">{t('demo.threeEndPopoverHover')}</Button>}>
          <Typography variant="body">{t('demo.threeEndPopoverHover')}</Typography>
        </HoverCard>
      </div>
    </div>
  )
}

function OverlayBlock({ t, defaultDialog = false }: { t: DemoT; defaultDialog?: boolean }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(defaultDialog)

  return (
    <div className="cu-three-end-overlay-well" data-three-end="overlay-well">
      <Stack gap="2">
        <div className="cu-three-end-phone-only">
          <Typography variant="caption">{t('demo.threeEndOverlayHintPhone')}</Typography>
        </div>
        <div className="cu-three-end-wide-only">
          <Typography variant="caption">{t('demo.threeEndOverlayHintWide')}</Typography>
        </div>
        <Stack direction="row" gap="2">
          <div className="cu-three-end-wide-only">
            <Dialog
              closeLabel={t('dialog.close')}
              description={t('dialog.description')}
              title={t('dialog.title')}
              triggerLabel={t('dialog.trigger')}
              open={dialogOpen}
              onOpenChange={setDialogOpen}
            >
              <p>{t('dialog.body')}</p>
            </Dialog>
          </div>
          <div className="cu-three-end-phone-only">
            <ActionSheet
              triggerLabel={t('actionSheet.label')}
              title={t('actionSheet.label')}
              cancelLabel={t('actionSheet.cancel')}
              open={sheetOpen}
              onOpenChange={setSheetOpen}
              actions={[
                { value: 'share', label: t('demo.selectOptionA') },
                { value: 'delete', label: t('demo.selectOptionB') },
              ]}
            />
          </div>
        </Stack>
      </Stack>
    </div>
  )
}

function InlineContainerProof({ t }: { t: DemoT }) {
  const items = navItems(t)
  return (
    <div className="cu-three-end-inline-proof" data-three-end="proof-inline">
      <Stack gap="2">
        <Typography variant="heading-2">{t('demo.threeEndProofTitle')}</Typography>
        <Typography variant="body">{t('demo.threeEndProofLead')}</Typography>
        <section className="cu-three-end-proof-narrow" data-three-end-container="narrow">
          <Typography variant="caption">{t('demo.threeEndProofNarrow')}</Typography>
          <AppShell
            className="cu-three-end-shell cu-three-end-shell--proof-narrow"
            header={<Typography variant="heading-2">{t('demo.threeEndProofNarrow')}</Typography>}
            sidebar={<Sidebar label={t('sidebar.label')} items={items} />}
            sidebarLabel={t('appShell.sidebar')}
            tabBar={<TabBar label={t('tabBar.label')} items={items} />}
          >
            <Typography variant="body">{t('appShell.main')}</Typography>
          </AppShell>
        </section>
      </Stack>
    </div>
  )
}

function ShellMain({ t }: { t: DemoT }) {
  const [draft, setDraft] = useState('')
  return (
    <Stack gap="3">
      <Heading level="level-1">{t('demo.threeEndTitle')}</Heading>
      <Typography variant="body">{t('demo.threeEndResizeHint')}</Typography>
      <AdaptiveBanners t={t} />
      <DensityPanel t={t} />
      <Card padding="md" variant="outlined">
        <Stack gap="2">
          <Typography variant="heading-2">{t('demo.threeEndOverlayTitle')}</Typography>
          <RevealPair t={t} />
          <div className="cu-three-end-phone-only">
            <Input label={t('demo.threeEndVkbd')} value={draft} onChange={setDraft} />
          </div>
          <PointerNote t={t} />
          <OverlayBlock t={t} />
        </Stack>
      </Card>
      <InlineContainerProof t={t} />
    </Stack>
  )
}

function MorphShell({ t, toolbar }: { t: DemoT; toolbar?: ReactNode }) {
  const items = navItems(t)

  return (
    <>
      <AppShell
        className="cu-three-end-shell"
        header={
          <>
            {toolbar}
            <AdaptiveBanners t={t} />
          </>
        }
        sidebar={
          <Sidebar
            label={t('sidebar.label')}
            items={items}
            collapsible
            collapseLabel={t('sidebar.collapse')}
            expandLabel={t('sidebar.expand')}
          />
        }
        sidebarLabel={t('appShell.sidebar')}
        tabBar={<TabBar label={t('tabBar.label')} items={items} />}
      >
        <ShellMain t={t} />
      </AppShell>
    </>
  )
}

function ProofStage({ t }: { t: DemoT }) {
  const items = navItems(t)
  return (
    <div className="cu-three-end-proof" data-three-end="proof">
      <Stack gap="3">
        <Heading level="level-2">{t('demo.threeEndProofTitle')}</Heading>
        <Typography variant="body">{t('demo.threeEndProofLead')}</Typography>
        <div className="cu-three-end-rulers" aria-hidden="true">
          <div className="cu-three-end-ruler-line cu-three-end-ruler-line--viewport">
            <span>viewport 1280px</span>
          </div>
          <div className="cu-three-end-ruler-line cu-three-end-ruler-line--container">
            <span>container 320px</span>
          </div>
        </div>
        <div className="cu-three-end-proof-grid">
          <section className="cu-three-end-proof-narrow" data-three-end-container="narrow">
            <Typography variant="caption">{t('demo.threeEndProofNarrow')}</Typography>
            <AppShell
              className="cu-three-end-shell cu-three-end-shell--proof-narrow"
              header={<Typography variant="heading-2">{t('demo.threeEndProofNarrow')}</Typography>}
              sidebar={<Sidebar label={t('sidebar.label')} items={items} />}
              sidebarLabel={t('appShell.sidebar')}
              tabBar={<TabBar label={t('tabBar.label')} items={items} />}
            >
              <Typography variant="body">{t('appShell.main')}</Typography>
            </AppShell>
            <OverlayBlock t={t} defaultDialog />
          </section>
          <section className="cu-three-end-proof-wide" data-three-end-container="wide">
            <Typography variant="caption">{t('demo.threeEndProofWide')}</Typography>
            <AppShell
              className="cu-three-end-shell cu-three-end-shell--proof-wide"
              header={<Typography variant="heading-2">{t('demo.threeEndProofWide')}</Typography>}
              sidebar={<Sidebar label={t('sidebar.label')} items={items} />}
              sidebarLabel={t('appShell.sidebar')}
            >
              <Typography variant="body">{t('appShell.main')}</Typography>
            </AppShell>
          </section>
        </div>
      </Stack>
    </div>
  )
}

export function ThreeEndStage({ t, end, toolbar }: { t: DemoT; end: ThreeEndKind; toolbar?: ReactNode }) {
  return (
    <div className="cu-three-end-stage" data-three-end="stage" data-three-end-end={end} data-cu-shell>
      {end === 'proof' ? <ProofStage t={t} /> : <MorphShell t={t} toolbar={toolbar} />}
    </div>
  )
}

interface PlaygroundProps {
  t: DemoT
  locale: Phase2Locale
  theme: ThemeId
  onLocale: (locale: Phase2Locale) => void
  onTheme: (theme: ThemeId) => void
  onBack: () => void
}

export function ThreeEndPlayground({ t, locale, theme, onLocale, onTheme, onBack }: PlaygroundProps) {
  return (
    <div className="cu-three-end-playground" data-three-end="playground">
      <header className="cu-three-end-chrome">
        <Stack gap="2">
          <Stack align="center" direction="row" gap="2" justify="between">
            <div>
              <p className="cu-demo-kicker">{t('demo.kicker')}</p>
              <Heading level="level-2">{t('demo.threeEndTitle')}</Heading>
            </div>
            <Stack align="center" direction="row" gap="2">
              <label className="cu-demo-field">
                {t('demo.themeLabel')}
                <select
                  data-demo="theme"
                  value={theme}
                  onChange={(event) => onTheme(readThemeParam(event.currentTarget.value))}
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
                  onChange={(event) => onLocale(readLocaleParam(event.currentTarget.value))}
                >
                  {PHASE_2_LOCALES.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </label>
              <Button size="sm" variant="outline" onClick={onBack}>
                {t('demo.threeEndBack')}
              </Button>
            </Stack>
          </Stack>
          <Typography variant="body">{t('demo.threeEndLead')}</Typography>
          {theme === 'cupertino' ? (
            <Typography variant="caption">
              <span data-three-end="cupertino-frost">{t('demo.threeEndCupertinoFrost')}</span>
            </Typography>
          ) : null}
        </Stack>
      </header>

      <div className="cu-three-end-live" data-three-end="live">
        <ThreeEndStage t={t} end="phone" />
      </div>

      <details className="cu-three-end-freeze" data-three-end="freeze-lab">
        <summary>{t('demo.threeEndFreezeSummary')}</summary>
        <Typography variant="body">{t('demo.threeEndFreezeLead')}</Typography>
        <div className="cu-three-end-frames" data-three-end="frames">
          {THREE_END_VIEWPORTS.map((item) => (
            <figure className="cu-three-end-col" data-three-end="frame" data-end={item.end} key={item.end}>
              <figcaption>
                {item.label} · {item.width}×{item.height}
              </figcaption>
              <iframe
                title={`${item.label} ${item.width}`}
                src={stageSrc(item.end, locale, theme)}
                width={item.width}
                height={item.height}
                className="cu-three-end-iframe"
              />
            </figure>
          ))}
          <figure className="cu-three-end-col" data-three-end="frame" data-end="proof">
            <figcaption>桌面 1280 · 内嵌 320px 容器</figcaption>
            <iframe
              title="容器查询实证 1280"
              src={stageSrc('proof', locale, theme)}
              width={1280}
              height={920}
              className="cu-three-end-iframe"
            />
          </figure>
        </div>
      </details>
    </div>
  )
}
