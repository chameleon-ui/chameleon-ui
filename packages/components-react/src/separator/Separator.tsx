import './styles.css'

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Separator({ orientation = 'horizontal', className }: SeparatorProps) {
  const classes = ['cu-separator', 'cu-separator--' + orientation, className].filter(Boolean).join(' ')
  return <hr className={classes} data-ai-role="separator" data-ai-intent="separate-items" data-ai-state={orientation} aria-orientation={orientation} />
}
