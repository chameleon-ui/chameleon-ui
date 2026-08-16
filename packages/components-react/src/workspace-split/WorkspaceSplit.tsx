import type { CSSProperties, ReactNode } from 'react'
import './styles.css'

/**
 * Who owns overflow when WorkspaceSplit sits in AppShell `__main`.
 * - `shell` (default): panes do not scroll; `__main` grows/scrolls. Safe for
 *   short / EmptyState content — no nested scrollbars.
 * - `panes`: fill the main scrollport; each pane scrolls (dashboard / fixed
 *   viewport). AppShell `__main` stops scrolling when the split is a direct child.
 * - `none`: neither default pane scroll nor shell fill-for-panes; use
 *   `ScrollPane` / per-pane `*Scroll` for any overflow.
 */
export type WorkspaceSplitScrollMode = 'shell' | 'panes' | 'none'

export interface WorkspaceSplitProps {
  master: ReactNode
  detail: ReactNode
  /** Optional third pane (tools / inspector). Stacks on compact; side column at desktop. */
  tools?: ReactNode
  masterWidth?: string
  toolsWidth?: string
  /**
   * Documented collapse threshold. Morph uses token-aligned breakpoints
   * (48rem master|detail, 80rem three-pane) via `@container` — custom lengths
   * are not applied (container queries cannot safely consume arbitrary CSS
   * variables as query bounds across browsers).
   */
  collapseBelow?: string
  /**
   * Scroll owner strategy. Default `shell` — do not nest pane `overflow: auto`
   * under AppShell `__main`. Use `panes` for fixed-viewport dashboards.
   */
  scrollMode?: WorkspaceSplitScrollMode
  /** Per-pane override. When omitted/null, follows `scrollMode` (`panes` → true). */
  masterScroll?: boolean | null
  detailScroll?: boolean | null
  toolsScroll?: boolean | null
  className?: string
}

function resolvePaneScroll(
  mode: WorkspaceSplitScrollMode,
  override?: boolean | null,
): boolean {
  // null/undefined = follow scrollMode. Explicit true/false wins.
  // (Vue Boolean props coerce absent → false unless defaulted to null.)
  if (override === true) return true
  if (override === false) return false
  return mode === 'panes'
}

export function WorkspaceSplit({
  master,
  detail,
  tools,
  masterWidth = '16rem',
  toolsWidth = '16rem',
  collapseBelow = '48rem',
  scrollMode = 'shell',
  masterScroll,
  detailScroll,
  toolsScroll,
  className,
}: WorkspaceSplitProps) {
  const classes = ['cu-workspace-split', className].filter(Boolean).join(' ')
  const style = {
    ['--cu-workspace-master-width' as string]: masterWidth,
    ['--cu-workspace-tools-width' as string]: toolsWidth,
    ['--cu-workspace-collapse-below' as string]: collapseBelow,
  } satisfies CSSProperties
  const masterScrollOn = resolvePaneScroll(scrollMode, masterScroll)
  const detailScrollOn = resolvePaneScroll(scrollMode, detailScroll)
  const toolsScrollOn = resolvePaneScroll(scrollMode, toolsScroll)

  return (
    <div
      className={classes}
      data-ai-role="workspace-split"
      data-ai-intent="layout-split"
      data-ai-state="default"
      data-scroll-mode={scrollMode}
      style={style}
    >
      <div className="cu-workspace-split__frame">
        <div
          className={[
            'cu-workspace-split__master',
            masterScrollOn ? 'cu-workspace-split__pane--scroll' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {master}
        </div>
        <div
          className={[
            'cu-workspace-split__detail',
            detailScrollOn ? 'cu-workspace-split__pane--scroll' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {detail}
        </div>
        {tools != null ? (
          <div
            className={[
              'cu-workspace-split__tools',
              toolsScrollOn ? 'cu-workspace-split__pane--scroll' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {tools}
          </div>
        ) : null}
      </div>
    </div>
  )
}
