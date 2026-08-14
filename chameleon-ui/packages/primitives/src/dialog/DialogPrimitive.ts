import { Dialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'

/**
 * Thin Dialog primitive. Focus trap, Escape, and restoreFocus stay in Zag.
 * Compact vs modal layout is a components-layer CSS concern.
 */
export const DialogPrimitive = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Backdrop: Dialog.Backdrop,
  Positioner: Dialog.Positioner,
  Content: Dialog.Content,
  Title: Dialog.Title,
  Description: Dialog.Description,
  CloseTrigger: Dialog.CloseTrigger,
  Portal,
}
