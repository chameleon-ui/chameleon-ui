<script lang="ts">
export interface StatisticProps {
  label: string
  value: string
  trend?: 'up' | 'down' | 'flat'
  trendLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<StatisticProps>(), {
  trend: 'flat'
})
const TREND_GLYPH = { up: '▲', down: '▼', flat: '→' } as const
const classes = computed(() => ["cu-statistic", props.class].filter(Boolean).join(' '))
</script>

<template>
  <div :class="classes" data-ai-role="statistic" data-ai-intent="highlight-count" :data-ai-state="trend">
    <span class="cu-statistic__label">{{ label }}</span>
    <span class="cu-statistic__value">{{ value }}</span>
    <span :class="'cu-statistic__trend cu-statistic__trend--' + trend" :aria-label="trendLabel">
      <span aria-hidden="true">{{ TREND_GLYPH[trend] }}</span>
    </span>
  </div>
</template>

<style scoped src="./styles.css"></style>
