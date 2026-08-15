<script lang="ts">
export interface EdgeProps {
  x1: number
  y1: number
  x2: number
  y2: number
  variant?: 'bezier' | 'straight'
  label?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<EdgeProps>(), { variant: 'bezier' })
const classes = computed(() => ['cu-edge', props.class].filter(Boolean).join(' '))
const left = computed(() => Math.min(props.x1, props.x2))
const top = computed(() => Math.min(props.y1, props.y2))
const width = computed(() => Math.max(1, Math.abs(props.x2 - props.x1)))
const height = computed(() => Math.max(1, Math.abs(props.y2 - props.y1)))
const path = computed(() => {
  const sx = props.x1 - left.value
  const sy = props.y1 - top.value
  const ex = props.x2 - left.value
  const ey = props.y2 - top.value
  return props.variant === 'straight'
    ? `M ${sx} ${sy} L ${ex} ${ey}`
    : `M ${sx} ${sy} C ${sx + (ex - sx) / 2} ${sy}, ${sx + (ex - sx) / 2} ${ey}, ${ex} ${ey}`
})
const svgStyle = computed(() => ({ insetInlineStart: left.value + 'px', insetBlockStart: top.value + 'px' }))
</script>

<template>
  <svg
    :class="classes"
    data-ai-role="edge"
    data-ai-intent="connect-nodes"
    data-ai-state="default"
    :style="svgStyle"
    :width="width"
    :height="height"
    :viewBox="'0 0 ' + width + ' ' + height"
    role="img"
    :aria-label="label"
    :aria-hidden="label ? undefined : true"
  >
    <path class="cu-edge__path" :d="path" />
    <text v-if="label" class="cu-edge__label" :x="width / 2" :y="height / 2" text-anchor="middle">{{ label }}</text>
  </svg>
</template>

<style scoped src="./styles.css"></style>
