import { inject, reactive, type InjectionKey } from 'vue'

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

export interface ToasterCreateInput {
  title: string
  description?: string
  type?: string
  duration?: number
}

export interface QueuedToast {
  id: string
  title: string
  description: string
  status: ToastStatus
  duration: number
  open: boolean
}

export interface ToasterStore {
  items: QueuedToast[]
  placement: ToastPlacement
  duration: number
  create(input: ToasterCreateInput): string
  remove(id?: string): void
}

export interface ToasterProps {
  toaster: ToasterStore
  closeLabel?: string
  class?: string
}

export const toastStoreKey: InjectionKey<ToastApi> = Symbol('cu-toast')

function nextId() {
  return `cu-toast-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeStatus(value: unknown): ToastStatus {
  if (value === 'success' || value === 'warning' || value === 'error' || value === 'info') {
    return value
  }
  return 'info'
}

export function createToaster(options?: {
  placement?: ToastPlacement
  duration?: number
  overlap?: boolean
}): ToasterStore {
  const store = reactive({
    items: [] as QueuedToast[],
    placement: options?.placement ?? ('bottom-end' satisfies ToastPlacement),
    duration: options?.duration ?? 4000,
    create(input: ToasterCreateInput) {
      const id = nextId()
      store.items.push({
        id,
        title: input.title,
        description: input.description ?? '',
        status: normalizeStatus(input.type),
        duration: input.duration ?? store.duration,
        open: true,
      })
      return id
    },
    remove(id?: string) {
      if (!id) {
        store.items.splice(0, store.items.length)
        return
      }
      const index = store.items.findIndex((item) => item.id === id)
      if (index >= 0) store.items.splice(index, 1)
    },
  }) satisfies ToasterStore
  return store
}

export function useToast(): ToastApi {
  const toaster = inject(toastStoreKey)
  if (!toaster) {
    throw new Error('useToast() requires <ToastProvider> in the tree.')
  }
  return toaster
}
