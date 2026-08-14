<script lang="ts">
export type ToastStatus = 'info' | 'success' | 'warning' | 'error'

export interface ToastProps {
  title: string
  description: string
  status?: ToastStatus
  closeLabel: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<ToastProps>(), {
  status: 'info',
})

const open = defineModel<boolean>('open', { required: true })

const classes = computed(() =>
  ['cu-toast', `cu-toast--${props.status}`, props.class].filter(Boolean).join(' '),
)
const live = computed(() => (props.status === 'error' ? 'assertive' : 'polite'))

function close() {
  open.value = false
}
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
    <div class="cu-toast__description">{{ description }}</div>
    <button class="cu-toast__close" type="button" @click="close">{{ closeLabel }}</button>
  </div>
</template>

<style scoped src="./styles.css"></style>
