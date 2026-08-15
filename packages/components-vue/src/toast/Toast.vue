<script lang="ts">
export type { ToastStatus } from './store'

export interface ToastProps {
  title: string
  description?: string
  status?: import('./store').ToastStatus
  closeLabel: string
  duration?: number
  class?: string
}
</script>

<script setup lang="ts">
import { computed, watch } from 'vue'

const props = withDefaults(defineProps<ToastProps>(), {
  status: 'info',
  duration: 0,
  description: '',
})

const open = defineModel<boolean>('open', { required: true })

const classes = computed(() =>
  ['cu-toast', `cu-toast--${props.status}`, props.class].filter(Boolean).join(' '),
)
const live = computed(() => (props.status === 'error' ? 'assertive' : 'polite'))

function close() {
  open.value = false
}

watch(
  () => [open.value, props.duration] as const,
  ([isOpen, duration], _prev, onCleanup) => {
    if (!isOpen || duration <= 0) return
    const timer = window.setTimeout(() => {
      open.value = false
    }, duration)
    onCleanup(() => window.clearTimeout(timer))
  },
  { immediate: true },
)
</script>

<template>
  <div
    v-if="open"
    :aria-label="title"
    :class="classes"
    data-ai-role="toast"
    data-ai-intent="notify-transient"
    :data-ai-state="status"
    role="status"
    :aria-live="live"
  >
    <div class="cu-toast__title">{{ title }}</div>
    <div v-if="description" class="cu-toast__description">{{ description }}</div>
    <button class="cu-toast__close" type="button" @click="close">{{ closeLabel }}</button>
  </div>
</template>

<style src="./styles.css"></style>
