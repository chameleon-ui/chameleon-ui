import { DialogPrimitive } from '@chameleon-ui/primitives'
import type { ReactNode } from 'react'
import './styles.css'

export interface DrawerProps {
  triggerLabel: string
  title: string
  closeLabel: string
  children?: ReactNode
  position?: 'start' | 'end'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function Drawer({ triggerLabel, title, closeLabel, children, position = 'end', open, onOpenChange, className }: DrawerProps) {
  const classes = ['cu-drawer', 'cu-drawer--' + position, className].filter(Boolean).join(' ')
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(details) => onOpenChange?.(details.open)}
    >
      <DialogPrimitive.Trigger className="cu-drawer__trigger">{triggerLabel}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="cu-drawer__backdrop" />
        <DialogPrimitive.Positioner>
          <DialogPrimitive.Content className={classes} data-ai-role="drawer" data-ai-intent="reveal-detail" data-ai-state={open ? 'open' : 'closed'}>
            <DialogPrimitive.Title className="cu-drawer__title">{title}</DialogPrimitive.Title>
            <div className="cu-drawer__body">{children}</div>
            <DialogPrimitive.CloseTrigger className="cu-drawer__close">{closeLabel}</DialogPrimitive.CloseTrigger>
          </DialogPrimitive.Content>
        </DialogPrimitive.Positioner>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
