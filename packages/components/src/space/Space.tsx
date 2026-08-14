import './styles.css'

export type SpaceSize = 'none' | 'sm' | 'md' | 'lg'
export type SpaceAxis = 'block' | 'inline' | 'both'

export interface SpaceProps {
  size?: SpaceSize
  axis?: SpaceAxis
  className?: string
}

export function Space({ size = 'md', axis = 'block', className }: SpaceProps) {
  const classes = ['cu-space', 'cu-space--' + size, className].filter(Boolean).join(' ')
  return (
    <div
      className={classes}
      data-ai-role="space"
      data-ai-intent="layout-flow"
      data-ai-state={axis}
      data-axis={axis}
      aria-hidden="true"
    />
  )
}
