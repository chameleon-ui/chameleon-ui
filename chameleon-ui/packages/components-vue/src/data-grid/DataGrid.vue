<script lang="ts">
export interface DataGridColumn<T = Record<string, unknown>> {
  key: string
  header: string
  width?: number
  render?: (row: T) => string
}

export interface DataGridProps<T = Record<string, unknown>> {
  columns: DataGridColumn<T>[]
  rows: T[]
  rowHeight?: number
  height?: number
  width?: number
  overscan?: number
  label: string
  emptyLabel?: string
  getRowId?: (row: T, index: number) => string
  class?: string
}

export interface GridWindow {
  row: import('../virtual/window.js').VirtualWindow
  column: import('../virtual/window.js').VirtualWindow
}

const DEFAULT_COLUMN_WIDTH = 160
const COLUMN_OVERSCAN = 2
</script>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, onMounted, ref, watch } from 'vue'
import {
  computeVariableWindow,
  computeWindow,
  prefixOffsets,
  windowsEqual,
  type VirtualWindow,
} from '../virtual/window.js'
import { useRafScroll } from '../virtual/use-raf-scroll.js'

const props = withDefaults(defineProps<DataGridProps<T>>(), {
  rowHeight: 36,
  height: 420,
  width: 960,
  overscan: 6,
  emptyLabel: 'No data',
})

const classes = computed(() => ['cu-data-grid', props.class].filter(Boolean).join(' '))
const columnWidths = computed(() => props.columns.map((column) => column.width ?? DEFAULT_COLUMN_WIDTH))
const columnLayout = computed(() => prefixOffsets(columnWidths.value))
const gridWindow = ref<GridWindow>({
  row: computeWindow(0, props.height, props.rows.length, props.rowHeight, props.overscan),
  column: computeVariableWindow(0, props.width, columnWidths.value, COLUMN_OVERSCAN),
})

function gridWindowsEqual(a: GridWindow, b: GridWindow) {
  return windowsEqual(a.row, b.row) && windowsEqual(a.column, b.column)
}

function readGridWindow(node: HTMLElement): GridWindow {
  const viewportHeight = node.clientHeight || props.height
  const viewportWidth = node.clientWidth || props.width
  return {
    row: computeWindow(node.scrollTop, viewportHeight, props.rows.length, props.rowHeight, props.overscan),
    column: computeVariableWindow(node.scrollLeft, viewportWidth, columnWidths.value, COLUMN_OVERSCAN),
  }
}

function onFrame(node: HTMLElement) {
  const next = readGridWindow(node)
  if (!gridWindowsEqual(gridWindow.value, next)) gridWindow.value = next
}

const viewportRef = useRafScroll(onFrame)

onMounted(() => {
  if (viewportRef.value) onFrame(viewportRef.value)
})

watch(
  () => [props.rows.length, props.rowHeight, props.overscan, columnWidths.value, props.height, props.width],
  () => {
    if (viewportRef.value) onFrame(viewportRef.value)
  },
)

const visibleColumns = computed(() =>
  props.columns.slice(gridWindow.value.column.start, gridWindow.value.column.end).map((column, offsetIndex) => ({
    column,
    columnIndex: gridWindow.value.column.start + offsetIndex,
  })),
)
const visibleRows = computed(() =>
  props.rows.slice(gridWindow.value.row.start, gridWindow.value.row.end).map((row, offsetIndex) => ({
    row,
    rowIndex: gridWindow.value.row.start + offsetIndex,
  })),
)

function cellText(column: DataGridColumn<T>, row: T) {
  return column.render ? column.render(row) : String(row[column.key] ?? '')
}

function rowKey(row: T, rowIndex: number) {
  return props.getRowId ? props.getRowId(row, rowIndex) : String(rowIndex)
}
</script>

<template>
  <div :class="classes" data-ai-role="data-grid" data-ai-intent="inspect-tabular-data" :data-ai-state="rows.length === 0 ? 'empty' : 'default'">
    <div
      ref="viewportRef"
      class="cu-data-grid__viewport"
      role="grid"
      :aria-label="label"
      :aria-rowcount="rows.length + 1"
      :aria-colcount="columns.length"
      :style="{ blockSize: height + 'px', inlineSize: '100%', maxInlineSize: width + 'px' }"
    >
      <p v-if="rows.length === 0" class="cu-data-grid__empty">{{ emptyLabel }}</p>
      <div
        v-else
        class="cu-data-grid__canvas"
        :style="{ blockSize: (rows.length + 1) * rowHeight + 'px', inlineSize: columnLayout.total + 'px' }"
      >
        <div
          class="cu-data-grid__row cu-data-grid__row--head"
          role="row"
          :aria-rowindex="1"
          :style="{ blockSize: rowHeight + 'px', inlineSize: columnLayout.total + 'px' }"
        >
          <div
            v-for="entry in visibleColumns"
            :key="entry.column.key"
            class="cu-data-grid__cell cu-data-grid__cell--head"
            role="columnheader"
            :aria-colindex="entry.columnIndex + 1"
            :style="{ insetInlineStart: columnLayout.offsets[entry.columnIndex] + 'px', inlineSize: columnWidths[entry.columnIndex] + 'px' }"
          >
            {{ entry.column.header }}
          </div>
        </div>
        <div
          v-for="entry in visibleRows"
          :key="rowKey(entry.row, entry.rowIndex)"
          class="cu-data-grid__row"
          role="row"
          :aria-rowindex="entry.rowIndex + 2"
          :style="{ transform: 'translateY(' + (entry.rowIndex + 1) * rowHeight + 'px)', blockSize: rowHeight + 'px' }"
        >
          <div
            v-for="col in visibleColumns"
            :key="col.column.key"
            class="cu-data-grid__cell"
            role="gridcell"
            :aria-colindex="col.columnIndex + 1"
            :style="{ insetInlineStart: columnLayout.offsets[col.columnIndex] + 'px', inlineSize: columnWidths[col.columnIndex] + 'px' }"
          >
            {{ cellText(col.column, entry.row) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./styles.css"></style>
