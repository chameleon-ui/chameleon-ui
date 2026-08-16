import { DialogPrimitive } from '@chameleon-ui/primitives'
import '../button/styles.css'
import '../dialog/styles.css'
import './styles.css'

export interface ConfirmDialogProps {
  triggerLabel: string
  title: string
  description: string
  confirmLabel: string
  cancelLabel: string
  onConfirm?: () => void
  className?: string
}

export function ConfirmDialog({
  triggerLabel,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  className,
}: ConfirmDialogProps) {
  return (
    <DialogPrimitive.Root lazyMount restoreFocus unmountOnExit>
      <DialogPrimitive.Trigger className="cu-button cu-button--solid cu-button--md cu-confirm-dialog__trigger">
        {triggerLabel}
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="cu-dialog__backdrop" />
        <DialogPrimitive.Positioner className="cu-dialog__positioner">
          <DialogPrimitive.Content
            className={['cu-dialog__content', 'cu-confirm-dialog__content', className].filter(Boolean).join(' ')}
            data-ai-role="confirm-dialog" data-ai-intent="confirm-decision"
            data-ai-state="open"
            dir={typeof document === 'undefined' ? undefined : document.documentElement.dir || undefined}
          >
            <DialogPrimitive.Title className="cu-dialog__title">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="cu-dialog__description">
              {description}
            </DialogPrimitive.Description>
            <div className="cu-dialog__actions cu-confirm-dialog__actions">
              <DialogPrimitive.CloseTrigger className="cu-button cu-button--outline cu-button--md">
                {cancelLabel}
              </DialogPrimitive.CloseTrigger>
              <DialogPrimitive.CloseTrigger
                className="cu-button cu-button--solid cu-button--md"
                onClick={() => onConfirm?.()}
              >
                {confirmLabel}
              </DialogPrimitive.CloseTrigger>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Positioner>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
