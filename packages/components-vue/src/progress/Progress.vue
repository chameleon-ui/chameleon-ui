<script lang="ts">
export interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md'
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<ProgressProps>(), {
  max: 100,
  size: 'md',
})

const classes = computed(() =>
  ['cu-progress', `cu-progress--${props.size}`, props.class].filter(Boolean).join(' '),
)
</script>

<template>
  <progress :class="classes" data-ai-role="progress" data-ai-state="default" data-ai-intent="show-progress" :max="max" :value="value">
    {{ value }}%
  </progress>
</template>

<style scoped src="./styles.css"></style>
