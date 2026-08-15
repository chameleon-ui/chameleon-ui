<script lang="ts">
export interface HeatmapProps {
  rows: string[]
  columns: string[]
  values: number[][]
  label: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<HeatmapProps>()
const classes = computed(() => ['cu-heatmap', props.class].filter(Boolean).join(' '))
const flat = computed(() => props.values.flat())
const max = computed(() => (flat.value.length > 0 ? Math.max(...flat.value) : 0))
const empty = computed(() => props.rows.length === 0 || props.columns.length === 0 || flat.value.length === 0)
const gridStyle = computed(() => ({ gridTemplateColumns: `auto repeat(${props.columns.length}, minmax(var(--cu-space-3), 1fr))` }))

function intensity(value: number) {
  return max.value > 0 ? Math.round((value / max.value) * 90) : 0
}
</script>

<template>
  <div :class="classes" data-ai-role="heatmap" data-ai-intent="visualize-data" :data-ai-state="empty ? 'empty' : 'default'">
    <div class="cu-heatmap__grid" role="grid" :aria-label="label" :style="gridStyle">
      <span class="cu-heatmap__corner" />
      <span v-for="column in columns" :key="column" class="cu-heatmap__column" role="columnheader">{{ column }}</span>
      <template v-for="(row, rowIndex) in rows" :key="row">
        <span class="cu-heatmap__row-wrap" role="row">
          <span class="cu-heatmap__row" role="rowheader">{{ row }}</span>
          <span
            v-for="(column, columnIndex) in columns"
            :key="row + '-' + column"
            class="cu-heatmap__cell"
            role="gridcell"
            :aria-label="row + ' ' + column + ': ' + (values[rowIndex]?.[columnIndex] ?? 0)"
            :style="{ background: 'color-mix(in srgb, var(--cu-color-palette-brand) ' + intensity(values[rowIndex]?.[columnIndex] ?? 0) + '%, var(--cu-color-background-default))' }"
          >
            <span class="cu-heatmap__value">{{ values[rowIndex]?.[columnIndex] ?? 0 }}</span>
          </span>
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped src="./styles.css"></style>
