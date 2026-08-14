<script lang="ts">
export interface TableColumn {
  key: string
  header: string
}

export interface TableProps {
  columns: TableColumn[]
  rows: Record<string, unknown>[]
  caption?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<TableProps>()

const classes = computed(() => ['cu-table', props.class].filter(Boolean).join(' '))
const dataAiState = computed(() => (props.rows.length === 0 ? 'empty' : 'default'))

function cellValue(row: Record<string, unknown>, key: string) {
  const value = row[key]
  return value == null ? '' : String(value)
}
</script>

<template>
  <div :class="classes" data-ai-role="table" data-ai-intent="inspect-tabular-data" :data-ai-state="dataAiState">
    <table class="cu-table__table">
      <caption v-if="caption" class="cu-table__caption">{{ caption }}</caption>
      <thead class="cu-table__head">
        <tr>
          <th v-for="column in columns" :key="column.key" class="cu-table__header" scope="col">
            {{ column.header }}
          </th>
        </tr>
      </thead>
      <tbody class="cu-table__body">
        <tr v-for="(row, index) in rows" :key="index" class="cu-table__row">
          <td v-for="column in columns" :key="column.key" class="cu-table__cell">
            {{ cellValue(row, column.key) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped src="./styles.css"></style>
