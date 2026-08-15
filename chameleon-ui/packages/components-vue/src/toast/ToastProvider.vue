<script lang="ts">
export type { ToastPlacement } from './store'

export interface ToastProviderProps {
  duration?: number
  placement?: import('./store').ToastPlacement
  closeLabel?: string
}
</script>

<script setup lang="ts">
import { provide } from 'vue'
import Toaster from './Toaster.vue'
import { createToaster, toastStoreKey, type ToastPlacement, type ToastPushInput } from './store'

const props = withDefaults(defineProps<ToastProviderProps>(), {
  duration: 4000,
  placement: 'bottom-end' satisfies ToastPlacement,
  closeLabel: 'Close',
})

const toaster = createToaster({
  duration: props.duration,
  placement: props.placement,
  overlap: true,
})

provide(toastStoreKey, {
  push(input: ToastPushInput) {
    return toaster.create({
      title: input.title,
      description: input.description,
      type: input.status ?? 'info',
      duration: input.duration,
    })
  },
  dismiss(id?: string) {
    toaster.remove(id)
  },
})
</script>

<template>
  <slot />
  <Toaster :toaster="toaster" :close-label="closeLabel" />
</template>
