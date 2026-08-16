import type { ReactNode } from 'react'
import './styles.css'

export type AppShellFooterPlacement = 'shell' | 'main' | 'auto'

export interface AppShellProps {
  header: ReactNode
  children: ReactNode
  /**
   * Three-end Navigation. One node; the named app-shell container moves it
   * from the block-end tab bar to the side column. Prefer this over composing
   * `sidebar` + `tabBar`.
   */
  navigation?: ReactNode
  /** Specialized side chrome that does not morph. Prefer `navigation`. */
  sidebar?: ReactNode
  /** Specialized compact chrome that does not morph. Prefer `navigation`. */
  tabBar?: ReactNode
  /**
   * Shell attribution (credits, legal). Prefer wrapping content in `Footer`.
   * Placement is controlled by `footerPlacement`.
   */
  footer?: ReactNode
  /**
   * Where footer lives relative to the main scrollport.
   * - `auto` (default): compact → end of main scroll; ≥48rem → shell-bottom chrome
   * - `shell`: always a dedicated grid row outside main scroll
   * - `main`: always flows at the end of main content
   */
  footerPlacement?: AppShellFooterPlacement
  sidebarLabel?: string
  /**
   * When false, chrome regions are plain divs (nested demos / embeds).
   * Default true — exposes one banner header + one main landmark.
   */
  landmarks?: boolean
  className?: string
}

export function AppShell({
  header,
  sidebar,
  children,
  navigation,
  tabBar,
  footer,
  footerPlacement = 'auto',
  sidebarLabel = 'Sidebar',
  landmarks = true,
  className,
}: AppShellProps) {
  const classes = ['cu-app-shell', className].filter(Boolean).join(' ')
  const HeaderTag = landmarks ? 'header' : 'div'
  const MainTag = landmarks ? 'main' : 'div'
  const FooterTag = landmarks ? 'footer' : 'div'
  const showFlow = Boolean(footer) && (footerPlacement === 'main' || footerPlacement === 'auto')
  const showChrome = Boolean(footer) && (footerPlacement === 'shell' || footerPlacement === 'auto')

  return (
    <div
      className={classes}
      data-cu-shell=""
      data-footer-placement={footer ? footerPlacement : undefined}
      data-ai-role="app-shell"
      data-ai-intent="layout-shell"
      data-ai-state="default"
    >
      <div className="cu-app-shell__frame">
        <HeaderTag className="cu-app-shell__header">{header}</HeaderTag>
        {navigation ? <div className="cu-app-shell__nav">{navigation}</div> : null}
        {sidebar ? (
          <aside aria-label={sidebarLabel} className="cu-app-shell__sidebar">
            {sidebar}
          </aside>
        ) : null}
        <MainTag className="cu-app-shell__main">
          {children}
          {showFlow ? (
            <div className="cu-app-shell__footer cu-app-shell__footer--flow" data-footer-host="main">
              {footer}
            </div>
          ) : null}
        </MainTag>
        {showChrome ? (
          <FooterTag className="cu-app-shell__footer cu-app-shell__footer--chrome" data-footer-host="shell">
            {footer}
          </FooterTag>
        ) : null}
        {tabBar ? <div className="cu-app-shell__tab-bar">{tabBar}</div> : null}
      </div>
    </div>
  )
}
