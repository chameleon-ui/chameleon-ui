<script lang="ts">
export interface TickerItem {
  id: string
  label: string
  value: string
  trend?: 'up' | 'down' | 'flat'
}

export interface TickerProps {
  items: TickerItem[]
  label?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<TickerProps>(), { label: 'Ticker' })
const TREND_GLYPH = { up: '▲', down: '▼', flat: '→' } as const
const classes = computed(() => ['cu-ticker', props.class].filter(Boolean).join(' '))
</script>

<template>
  <section :class="classes" :aria-label="label" data-ai-role="ticker" data-ai-intent="notify-status" :data-ai-state="items.length === 0 ? 'empty' : 'default'">
    <ul class="cu-ticker__strip">
      <li v-for="item in items" :key="item.id" class="cu-ticker__item">
        <span class="cu-ticker__label">{{ item.label }}</span>
        <span class="cu-ticker__value">{{ item.value }}</span>
        <span v-if="item.trend" :class="'cu-ticker__trend cu-ticker__trend--' + item.trend">
          <span aria-hidden="true">{{ TREND_GLYPH[item.trend] }}</span>
          <span class="cu-ticker__trend-text">{{ item.trend }}</span>
        </span>
      </li>
    </ul>
  </section>
</template>

<style scoped src="./styles.css"></style>
