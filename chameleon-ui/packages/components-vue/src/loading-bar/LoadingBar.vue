<script lang="ts">
export interface LoadingBarProps {
  value?: number
  label?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<LoadingBarProps>(), {
  label: 'Loading'
})
const determinate = computed(() => typeof props.value === 'number')
const classes = computed(() => ['cu-loading-bar', determinate.value ? '' : 'cu-loading-bar--indeterminate', props.class].filter(Boolean).join(' '))
const fillStyle = computed(() =>
  determinate.value && typeof props.value === 'number'
    ? { inlineSize: `${Math.min(100, Math.max(0, props.value))}%` }
    : undefined,
)
</script>

<template>
  <div
    :class="classes"
    role="progressbar"
    :aria-label="label"
    :aria-valuemin="determinate ? 0 : undefined"
    :aria-valuemax="determinate ? 100 : undefined"
    :aria-valuenow="determinate ? value : undefined"
    data-ai-role="loading-bar"
    data-ai-intent="show-progress"
    :data-ai-state="determinate ? 'default' : 'indeterminate'"
  >
    <div class="cu-loading-bar__fill" :style="fillStyle" />
  </div>
</template>

<style scoped src="./styles.css"></style>
