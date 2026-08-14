import './styles.css'

export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rectangle'
  width?: string
  height?: string
  className?: string
}

export function Skeleton({ variant = 'text', width = '100%', height = '1rem', className }: SkeletonProps) {
  const classes = ['cu-skeleton', 'cu-skeleton--' + variant, className].filter(Boolean).join(' ')
  const style = { width, height }
  return <div aria-hidden="true" className={classes} data-ai-role="skeleton" data-ai-intent="indicate-loading" data-ai-state="loading" style={style} />
}
