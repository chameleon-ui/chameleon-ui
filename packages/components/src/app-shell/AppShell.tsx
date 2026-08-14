import type { ReactNode } from 'react'
import './styles.css'

export interface AppShellProps {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
  /** Compact/tablet Navigation morph. Hidden by container query at desktop (80rem). */
  tabBar?: ReactNode
  sidebarLabel?: string
  className?: string
}

export function AppShell({
  header,
  sidebar,
  children,
  tabBar,
  sidebarLabel = 'Sidebar',
  className,
}: AppShellProps) {
  const classes = ['cu-app-shell', className].filter(Boolean).join(' ')

  return (
    <div className={classes} data-ai-role="app-shell" data-ai-intent="layout-shell" data-ai-state="default">
      <div className="cu-app-shell__frame">
        <header className="cu-app-shell__header">{header}</header>
        <aside aria-label={sidebarLabel} className="cu-app-shell__sidebar">
          {sidebar}
        </aside>
        <main className="cu-app-shell__main">{children}</main>
        {tabBar ? <div className="cu-app-shell__tab-bar">{tabBar}</div> : null}
      </div>
    </div>
  )
}
