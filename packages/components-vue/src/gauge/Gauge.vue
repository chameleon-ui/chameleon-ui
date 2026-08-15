<script lang="ts">
export interface GaugeProps {
  value: number
  max?: number
  label: string
  valueLabel?: string
  class?: string
}

const RADIUS = 70
const CENTER = 80
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<GaugeProps>(), { max: 100 })
const classes = computed(() => ['cu-gauge', props.class].filter(Boolean).join(' '))
const clamped = computed(() => Math.min(props.max, Math.max(0, props.value)))
const percent = computed(() => (props.max > 0 ? (clamped.value / props.max) * 100 : 0))
const startX = CENTER - RADIUS
const endX = CENTER + RADIUS
const arc = `M ${startX} ${CENTER} A ${RADIUS} ${RADIUS} 0 0 1 ${endX} ${CENTER}`
</script>

<template>
  <div :class="classes" data-ai-role="gauge" data-ai-intent="visualize-data" data-ai-state="default">
    <svg class="cu-gauge__svg" :viewBox="'0 0 ' + CENTER * 2 + ' ' + (CENTER + 12)" role="meter" :aria-label="label" :aria-valuemin="0" :aria-valuemax="max" :aria-valuenow="clamped">
      <path class="cu-gauge__track" :d="arc" :pathLength="100" />
      <path class="cu-gauge__fill" :d="arc" :pathLength="100" :stroke-dasharray="percent + ' 100'" />
      <text class="cu-gauge__value" :x="CENTER" :y="CENTER - 8" text-anchor="middle">{{ valueLabel ?? String(clamped) }}</text>
    </svg>
  </div>
</template>

<style scoped src="./styles.css"></style>
