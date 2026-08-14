import './styles.css'

export interface DividerProps {
  className?: string
}

export function Divider({ className }: DividerProps) {
  const classes = ['cu-divider', className].filter(Boolean).join(' ')
  return <hr className={classes} data-ai-role="divider" data-ai-state="default" data-ai-intent="separate-sections" />
}
