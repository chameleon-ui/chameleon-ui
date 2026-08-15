<script lang="ts">
export type { ToastPlacement } from './store'

export interface ToastProviderProps {
  duration?: number
  placement?: import('./store').ToastPlacement
  closeLabel?: string
}
</script>

<script setup lang="ts">
import { provide, ref } from 'vue'
import Toast from './Toast.vue'
import { toastStoreKey, type ToastPlacement, type ToastPushInput, type ToastStatus } from './store'

interface QueuedToast {
  id: string
  title: string
  description: string
  status: ToastStatus
  duration: number
  open: boolean
}

const props = withDefaults(defineProps<ToastProviderProps>(), {
  duration: 4000,
  placement: 'bottom-end' satisfies ToastPlacement,
  closeLabel: 'Close',
})

const items = ref<QueuedToast[]>([])

function nextId() {
  return `cu-toast-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function push(input: ToastPushInput) {
  const id = nextId()
  items.value = [
    ...items.value,
    {
      id,
      title: input.title,
      description: input.description ?? '',
      status: input.status ?? 'info',
      duration: input.duration ?? props.duration,
      open: true,
    },
  ]
  return id
}

function dismiss(id?: string) {
  if (!id) {
    items.value = []
    return
  }
  items.value = items.value.filter((item) => item.id !== id)
}

provide(toastStoreKey, { push, dismiss })

function onOpenChange(id: string, open: boolean) {
  if (open) return
  dismiss(id)
}
</script>

<template>
  <slot />
  <div class="cu-toaster" :data-placement="placement">
    <Toast
      v-for="item in items"
      :key="item.id"
      :open="item.open"
      :title="item.title"
      :description="item.description"
      :status="item.status"
      :close-label="closeLabel"
      :duration="item.duration"
      @update:open="(open) => onOpenChange(item.id, open)"
    />
  </div>
</template>
