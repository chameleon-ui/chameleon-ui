<script lang="ts">
export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  size?: SpinnerSize
  label?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: 'md',
  label: 'Loading',
})

const classes = computed(() =>
  ['cu-spinner', `cu-spinner--${props.size}`, props.class].filter(Boolean).join(' '),
)
</script>

<template>
  <span
    :class="classes"
    data-ai-role="spinner"
    data-ai-intent="indicate-busy"
    data-ai-state="loading"
    :data-size="size"
    role="status"
    aria-live="polite"
    :aria-label="label"
  >
    <svg aria-hidden="true" class="cu-spinner__svg" viewBox="0 0 24 24">
      <circle class="cu-spinner__track" cx="12" cy="12" r="10" />
      <circle class="cu-spinner__lead" cx="12" cy="12" r="10" />
    </svg>
  </span>
</template>

<style scoped src="./styles.css"></style>
