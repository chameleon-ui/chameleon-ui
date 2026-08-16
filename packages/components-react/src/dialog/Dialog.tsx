import { DialogPrimitive } from '@chameleon-ui/primitives'
import type { ReactNode } from 'react'
import '../button/styles.css'
import './styles.css'

export interface DialogProps {
  triggerLabel: string
  title: string
  description: string
  closeLabel: string
  children?: ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Dialog({
  triggerLabel,
  title,
  description,
  closeLabel,
  children,
  defaultOpen,
  open,
  onOpenChange,
}: DialogProps) {
  return (
    <DialogPrimitive.Root
      defaultOpen={defaultOpen}
      lazyMount
      open={open}
      restoreFocus
      unmountOnExit
      onOpenChange={(details) => onOpenChange?.(details.open)}
    >
      <DialogPrimitive.Trigger className="cu-button cu-button--solid cu-button--md cu-dialog__trigger">
        {triggerLabel}
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="cu-dialog__backdrop" />
        <DialogPrimitive.Positioner className="cu-dialog__positioner">
          <DialogPrimitive.Content
        className="cu-dialog__content"
        data-ai-role="dialog" data-ai-intent="confirm-decision"
        data-ai-state="open"
        dir={typeof document === 'undefined' ? undefined : document.documentElement.dir || undefined}
      >
            <DialogPrimitive.Title className="cu-dialog__title">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="cu-dialog__description">
              {description}
            </DialogPrimitive.Description>
            {children ? <div className="cu-dialog__body">{children}</div> : null}
            <div className="cu-dialog__actions">
              <DialogPrimitive.CloseTrigger className="cu-button cu-button--outline cu-button--md">
                {closeLabel}
              </DialogPrimitive.CloseTrigger>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Positioner>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
