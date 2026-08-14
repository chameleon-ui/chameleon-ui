import type { ReactNode } from 'react'
import './styles.css'

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
  sidebarLabel?: string
  className?: string
}

export function AppShell({
  header,
  sidebar,
  children,
  navigation,
  tabBar,
  sidebarLabel = 'Sidebar',
  className,
}: AppShellProps) {
  const classes = ['cu-app-shell', className].filter(Boolean).join(' ')

  return (
    <div className={classes} data-ai-role="app-shell" data-ai-intent="layout-shell" data-ai-state="default">
      <div className="cu-app-shell__frame">
        <header className="cu-app-shell__header">{header}</header>
        {navigation ? <div className="cu-app-shell__nav">{navigation}</div> : null}
        {sidebar ? (
          <aside aria-label={sidebarLabel} className="cu-app-shell__sidebar">
            {sidebar}
          </aside>
        ) : null}
        <main className="cu-app-shell__main">{children}</main>
        {tabBar ? <div className="cu-app-shell__tab-bar">{tabBar}</div> : null}
      </div>
    </div>
  )
}
