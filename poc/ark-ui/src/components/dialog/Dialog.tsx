import { Dialog as ArkDialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import type { ReactNode } from 'react'

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

// @phase-1 migrate → packages/components after O1 is signed off.
// Focus trapping, Escape dismissal, and trigger restoration are delegated to Ark UI / Zag.js.
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
    <ArkDialog.Root
      defaultOpen={defaultOpen}
      lazyMount
      open={open}
      restoreFocus
      unmountOnExit
      onOpenChange={(details) => onOpenChange?.(details.open)}
    >
      <ArkDialog.Trigger className="cu-button cu-button--solid cu-button--md cu-dialog__trigger">
        {triggerLabel}
      </ArkDialog.Trigger>
      <Portal>
        <ArkDialog.Backdrop className="cu-dialog__backdrop" />
        <ArkDialog.Positioner className="cu-dialog__positioner">
          <ArkDialog.Content className="cu-dialog__content">
            <ArkDialog.Title className="cu-dialog__title">{title}</ArkDialog.Title>
            <ArkDialog.Description className="cu-dialog__description">{description}</ArkDialog.Description>
            {children ? <div className="cu-dialog__body">{children}</div> : null}
            <div className="cu-dialog__actions">
              <ArkDialog.CloseTrigger className="cu-button cu-button--outline cu-button--md">
                {closeLabel}
              </ArkDialog.CloseTrigger>
            </div>
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.Root>
  )
}
