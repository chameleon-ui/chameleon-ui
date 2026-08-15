<script lang="ts">
export interface SparklineProps {
  data: number[]
  label: string
  width?: number
  height?: number
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { downsample } from '../virtual/downsample.js'

const props = withDefaults(defineProps<SparklineProps>(), { width: 96, height: 28 })
const classes = computed(() => ['cu-sparkline', props.class].filter(Boolean).join(' '))
const samples = computed(() => downsample(props.data, Math.max(2, Math.floor(props.width))))
const empty = computed(() => samples.value.length < 2)
const points = computed(() => {
  const values = samples.value
  if (values.length < 2) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const step = props.width / (values.length - 1)
  return values.map((value, index) => `${index * step},${props.height - ((value - min) / span) * props.height}`).join(' ')
})
</script>

<template>
  <span v-if="empty" :class="classes" data-ai-role="sparkline" data-ai-intent="visualize-data" data-ai-state="empty" :aria-label="label" role="img" />
  <svg
    v-else
    :class="classes"
    data-ai-role="sparkline"
    data-ai-intent="visualize-data"
    data-ai-state="default"
    :viewBox="'0 0 ' + width + ' ' + height"
    :width="width"
    :height="height"
    role="img"
    :aria-label="label"
  >
    <polyline class="cu-sparkline__line" :points="points" />
  </svg>
</template>

<style scoped src="./styles.css"></style>
