<script lang="ts">
export interface GridProps {
  columns?: number
  gap?: 'none' | 'sm' | 'md' | 'lg'
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<GridProps>(), {
  columns: 1,
  gap: 'md',
})

const classes = computed(() =>
  ['cu-grid', `cu-grid--gap-${props.gap}`, props.class].filter(Boolean).join(' '),
)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`,
}))
</script>

<template>
  <div
    :class="classes"
    data-ai-role="grid"
    data-ai-state="default"
    data-ai-intent="layout-columns"
    :style="gridStyle"
  >
    <slot />
  </div>
</template>

<style scoped src="./styles.css"></style>
