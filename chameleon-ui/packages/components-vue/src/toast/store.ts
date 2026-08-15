import { inject, type InjectionKey } from 'vue'

export type ToastStatus = 'info' | 'success' | 'warning' | 'error'
export type ToastPlacement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'

export interface ToastPushInput {
  title: string
  description?: string
  status?: ToastStatus
  duration?: number
}

export interface ToastApi {
  push(input: ToastPushInput): string
  dismiss(id?: string): void
}

export const toastStoreKey: InjectionKey<ToastApi> = Symbol('cu-toast')

export function useToast(): ToastApi {
  const toaster = inject(toastStoreKey)
  if (!toaster) {
    throw new Error('useToast() requires <ToastProvider> in the tree.')
  }
  return toaster
}
