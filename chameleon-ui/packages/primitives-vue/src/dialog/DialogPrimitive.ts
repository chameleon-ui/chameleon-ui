import { Dialog } from '@ark-ui/vue/dialog'

/**
 * Thin Dialog primitive. Focus trap, Escape, and restoreFocus stay in Zag.
 * Compact vs modal layout is a components-layer CSS concern.
 * Vue portals with `<Teleport>` in `@chameleon-ui/components-vue`.
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
}
