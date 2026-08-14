import {
  AppShell,
  Button,
  Card,
  Collapse,
  Dialog,
  Heading,
  HoverCard,
  Input,
  Navigation,
  NavigationBar,
  Popover,
  Stack,
  Typography,
  useTabStacks,
} from '@chameleon-ui/components'
import { PHASE_2_LOCALES, type Phase2Locale } from '@chameleon-ui/i18n'
import { themeIds, type ThemeId } from '@chameleon-ui/themes'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { readLocaleParam, readThemeParam } from './messages'

export type ThreeEndKind = 'phone' | 'tablet' | 'desktop'

export const THREE_END_VIEWPORTS = [
  { end: 'phone' as const, width: 390, height: 720, label: '手机' },
  { end: 'tablet' as const, width: 768, height: 720, label: '平板' },
  { end: 'desktop' as const, width: 1280, height: 720, label: '桌面' },
] as const

export function readEndParam(value: string | null): ThreeEndKind {
  if (value === 'tablet' || value === 'desktop') return value
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
    { value: 'library', label: t('demo.threeEndNavLibrary') },
    { value: 'messages', label: t('demo.threeEndNavMessages') },
    { value: 'orders', label: t('demo.threeEndNavOrders') },
    { value: 'wallet', label: t('demo.threeEndNavWallet') },
    { value: 'activity', label: t('demo.threeEndNavActivity') },
    { value: 'favorites', label: t('demo.threeEndNavFavorites') },
    { value: 'notifications', label: t('demo.threeEndNavNotifications') },
    { value: 'settings', label: t('demo.threeEndNavSettings') },
    { value: 'help', label: t('demo.threeEndNavHelp') },
    { value: 'me', label: t('demo.threeEndNavMe') },
  ]
}

function DemoNavigation({
  t,
  items,
  active,
  onSelect,
}: {
  t: DemoT
  items: ReturnType<typeof navItems>
  active?: string
  onSelect?: (value: string) => void
}) {
  return (
    <Navigation
      label={t('navigation.label')}
      items={items}
      activeValue={active}
      onSelect={onSelect}
      moreLabel={t('navigation.more')}
      collapseLabel={t('navigation.collapse')}
      expandLabel={t('navigation.expand')}
    />
  )
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

function OverlayBlock({ t }: { t: DemoT }) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="cu-three-end-overlay-well" data-three-end="overlay-well">
      <Stack gap="2">
        <Typography variant="caption">{t('demo.threeEndOverlayHint')}</Typography>
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
      </Stack>
    </div>
  )
}

function ShellMain({
  t,
  stack,
}: {
  t: DemoT
  stack: ReturnType<typeof useTabStacks>
}) {
  const [draft, setDraft] = useState('')

  if (stack.canPop) {
    return (
      <Stack gap="3">
        <Typography variant="body">{t('demo.threeEndNavDetailBody', { label: stack.current.title })}</Typography>
      </Stack>
    )
  }

  if (stack.tab !== 'home') {
    return (
      <Stack gap="3">
        <Typography variant="body">{t('demo.threeEndNavPage', { label: stack.current.title })}</Typography>
        <Button
          onClick={() =>
            stack.push({
              id: `${stack.tab}-detail`,
              title: t('demo.threeEndNavDetail', { label: stack.current.title }),
            })
          }
        >
          {t('demo.threeEndOpenDetail')}
        </Button>
      </Stack>
    )
  }

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
    </Stack>
  )
}

function MorphShell({ t, toolbar }: { t: DemoT; toolbar?: ReactNode }) {
  const items = navItems(t)
  const stack = useTabStacks(
    items.map((item) => ({ value: item.value, title: String(item.label) })),
    'home',
  )

  return (
    <>
      {toolbar ? <div className="cu-demo-inspector">{toolbar}</div> : null}
      <AppShell
        className="cu-three-end-shell"
        header={
          <NavigationBar
            title={stack.current.title}
            backLabel={stack.previous?.title ?? t('navigationBar.back')}
            onBack={stack.canPop ? stack.pop : undefined}
          />
        }
        navigation={<DemoNavigation t={t} items={items} active={stack.tab} onSelect={stack.selectTab} />}
      >
        <ShellMain t={t} stack={stack} />
      </AppShell>
    </>
  )
}

export function ThreeEndStage({ t, end, toolbar }: { t: DemoT; end: ThreeEndKind; toolbar?: ReactNode }) {
  return (
    <div className="cu-three-end-stage" data-three-end="stage" data-three-end-end={end} data-cu-shell>
      <MorphShell t={t} toolbar={toolbar} />
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
        </div>
      </details>
    </div>
  )
}
