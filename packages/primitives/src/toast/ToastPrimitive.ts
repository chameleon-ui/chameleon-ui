import { Toast, Toaster, createToaster } from '@ark-ui/react/toast'
import type { ComponentProps } from 'react'

/**
 * Thin Toast primitive from Ark UI.
 * Components assemble this; they must not import `@ark-ui/react/toast`.
 */
export const ToastPrimitive = {
  createToaster,
  Root: Toast.Root,
  Title: Toast.Title,
  Description: Toast.Description,
  CloseTrigger: Toast.CloseTrigger,
  ActionTrigger: Toast.ActionTrigger,
  Toaster,
}

export type ToastPrimitiveRootProps = ComponentProps<typeof Toast.Root>
