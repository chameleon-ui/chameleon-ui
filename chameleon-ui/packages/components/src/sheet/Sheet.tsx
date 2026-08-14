import { DialogPrimitive } from '@chameleon-ui/primitives'
import type { ReactNode } from 'react'
import './styles.css'

export interface SheetProps {
  triggerLabel: string
  title: string
  closeLabel: string
  children?: ReactNode
  position?: 'start' | 'end' | 'bottom'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function Sheet({ triggerLabel, title, closeLabel, children, position = 'bottom', open, onOpenChange, className }: SheetProps) {
  const classes = ['cu-sheet', 'cu-sheet--' + position, className].filter(Boolean).join(' ')
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(details) => onOpenChange?.(details.open)}>
      <DialogPrimitive.Trigger className="cu-sheet__trigger">{triggerLabel}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="cu-sheet__backdrop" />
        <DialogPrimitive.Positioner>
          <DialogPrimitive.Content className={classes} data-ai-role="sheet" data-ai-intent="present-overlay" data-ai-state={open ? 'open' : 'closed'}>
            <DialogPrimitive.Title className="cu-sheet__title">{title}</DialogPrimitive.Title>
            <div className="cu-sheet__body">{children}</div>
            <DialogPrimitive.CloseTrigger className="cu-sheet__close">{closeLabel}</DialogPrimitive.CloseTrigger>
          </DialogPrimitive.Content>
        </DialogPrimitive.Positioner>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
