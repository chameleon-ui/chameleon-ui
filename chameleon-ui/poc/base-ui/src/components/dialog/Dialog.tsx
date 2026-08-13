import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import type { ReactNode } from 'react'
import '../button/styles.css'
import './styles.css'

export interface DialogProps {
  direction?: 'ltr' | 'rtl'
  triggerLabel: string
  title: string
  description: string
  closeLabel: string
  children?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

// @phase-1 migrate → packages/components/src/dialog/Dialog.tsx
export function Dialog({
  triggerLabel,
  title,
  description,
  closeLabel,
  children,
  open,
  defaultOpen,
  onOpenChange,
  direction,
}: DialogProps) {
  return (
    <BaseDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <BaseDialog.Trigger className="cu-button cu-button--solid cu-button--md">
        {triggerLabel}
      </BaseDialog.Trigger>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="cu-dialog__backdrop" dir={direction} />
        <BaseDialog.Viewport className="cu-dialog__viewport" dir={direction}>
          <BaseDialog.Popup className="cu-dialog" dir={direction}>
            <div className="cu-dialog__content">
              <BaseDialog.Title className="cu-dialog__title">
                {title}
              </BaseDialog.Title>
              <BaseDialog.Description className="cu-dialog__description">
                {description}
              </BaseDialog.Description>
              {children ? <div className="cu-dialog__body">{children}</div> : null}
            </div>
            <div className="cu-dialog__actions">
              <BaseDialog.Close className="cu-button cu-button--outline cu-button--md">
                {closeLabel}
              </BaseDialog.Close>
            </div>
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
