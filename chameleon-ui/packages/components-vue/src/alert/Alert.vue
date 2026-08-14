<script lang="ts">
export type AlertStatus = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps {
  status?: AlertStatus
  title: string
  description: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<AlertProps>(), {
  status: 'info',
})

const classes = computed(() =>
  ['cu-alert', `cu-alert--${props.status}`, props.class].filter(Boolean).join(' '),
)
const role = computed(() => (props.status === 'error' ? 'alert' : 'status'))
const live = computed(() => (props.status === 'error' ? 'assertive' : 'polite'))
</script>

<template>
  <div
    :aria-label="title"
    :class="classes"
    data-ai-role="alert"
    data-ai-intent="notify-status"
    :data-ai-state="status"
    :role="role"
    :aria-live="live"
  >
    <div class="cu-alert__title">{{ title }}</div>
    <div class="cu-alert__description">{{ description }}</div>
  </div>
</template>

<style scoped src="./styles.css"></style>
