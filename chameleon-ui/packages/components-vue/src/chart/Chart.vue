<script lang="ts">
export interface ChartSeries {
  name: string
  data: number[]
}

export interface ChartProps {
  type?: 'bar' | 'line' | 'area'
  series: ChartSeries[]
  labels?: string[]
  label: string
  emptyLabel?: string
  class?: string
}

const WIDTH = 320
const HEIGHT = 160
const PADDING = 8
const MAX_POINTS = 96
const SERIES_CLASSES = ['cu-chart__series--0', 'cu-chart__series--1', 'cu-chart__series--2', 'cu-chart__series--3']

function extent(series: ChartSeries[]) {
  let min = 0
  let max = 0
  for (const entry of series) {
    for (const value of entry.data) {
      if (value < min) min = value
      if (value > max) max = value
    }
  }
  if (max === min) max = min + 1
  return { min, max }
}

function linePoints(data: number[], min: number, max: number) {
  const innerW = WIDTH - PADDING * 2
  const innerH = HEIGHT - PADDING * 2
  const step = data.length > 1 ? innerW / (data.length - 1) : 0
  return data
    .map((value, index) => {
      const x = PADDING + index * step
      const y = PADDING + innerH - ((value - min) / (max - min)) * innerH
      return `${x},${y}`
    })
    .join(' ')
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { downsample, downsampleLabels } from '../virtual/downsample.js'

const props = withDefaults(defineProps<ChartProps>(), { type: 'line', emptyLabel: 'No data' })
const classes = computed(() => ['cu-chart', props.class].filter(Boolean).join(' '))
const hasData = computed(() => props.series.some((entry) => entry.data.length > 0))
const painted = computed(() => props.series.map((entry) => ({ ...entry, data: downsample(entry.data, MAX_POINTS) })))
const range = computed(() => extent(painted.value))
const slotCount = computed(() => Math.max(0, ...painted.value.map((entry) => entry.data.length)))
const slotWidth = computed(() => (WIDTH - PADDING * 2) / Math.max(1, slotCount.value))
const paintedLabels = computed(() =>
  downsampleLabels(props.labels, props.labels?.length ?? slotCount.value, MAX_POINTS),
)

function barRect(entry: ChartSeries, seriesIndex: number, value: number, index: number) {
  const barWidth = (slotWidth.value * 0.7) / props.series.length
  const height = ((value - range.value.min) / (range.value.max - range.value.min)) * (HEIGHT - PADDING * 2)
  const x =
    PADDING +
    index * slotWidth.value +
    (slotWidth.value - barWidth * props.series.length) / 2 +
    seriesIndex * barWidth
  const y = HEIGHT - PADDING - height
  return { x, y, width: barWidth, height: Math.max(0, height) }
}

function pointsFor(entry: ChartSeries) {
  return linePoints(entry.data, range.value.min, range.value.max)
}

function areaPoints(entry: ChartSeries) {
  const points = pointsFor(entry)
  const baseline = HEIGHT - PADDING
  const lastX = PADDING + (entry.data.length - 1) * ((WIDTH - PADDING * 2) / Math.max(1, entry.data.length - 1))
  return `${PADDING},${baseline} ${points} ${lastX},${baseline}`
}
</script>

<template>
  <div v-if="!hasData" :class="classes" data-ai-role="chart" data-ai-intent="visualize-data" data-ai-state="empty">
    <p class="cu-chart__empty">{{ emptyLabel }}</p>
  </div>
  <figure v-else :class="classes" data-ai-role="chart" data-ai-intent="visualize-data" :data-ai-state="type">
    <svg class="cu-chart__svg" :viewBox="'0 0 ' + WIDTH + ' ' + HEIGHT" role="img" :aria-label="label" preserveAspectRatio="xMidYMid meet">
      <g v-for="(entry, seriesIndex) in painted" :key="entry.name" :class="SERIES_CLASSES[seriesIndex % SERIES_CLASSES.length]">
        <template v-if="type === 'bar'">
          <rect
            v-for="(value, index) in entry.data"
            :key="entry.name + '-' + index"
            :x="barRect(entry, seriesIndex, value, index).x"
            :y="barRect(entry, seriesIndex, value, index).y"
            :width="barRect(entry, seriesIndex, value, index).width"
            :height="barRect(entry, seriesIndex, value, index).height"
          />
        </template>
        <template v-else>
          <polygon v-if="type === 'area'" class="cu-chart__area" :points="areaPoints(entry)" />
          <polyline class="cu-chart__line" :points="pointsFor(entry)" />
        </template>
      </g>
    </svg>
    <figcaption v-if="paintedLabels && paintedLabels.length > 0" class="cu-chart__labels">
      <span v-for="(item, index) in paintedLabels" :key="item + '-' + index" class="cu-chart__label">{{ item }}</span>
    </figcaption>
    <ul class="cu-chart__legend">
      <li v-for="(entry, seriesIndex) in series" :key="entry.name" :class="'cu-chart__legend-item ' + SERIES_CLASSES[seriesIndex % SERIES_CLASSES.length]">
        {{ entry.name }}
      </li>
    </ul>
  </figure>
</template>

<style scoped src="./styles.css"></style>
