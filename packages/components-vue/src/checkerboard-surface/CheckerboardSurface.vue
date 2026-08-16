<script lang="ts">
export type CheckerboardCellSize = 'sm' | 'md' | 'lg'
/** `default` is readable for transparent edges; `strong` for mask / inpaint editors. */
export type CheckerboardContrast = 'default' | 'strong'

export interface CheckerboardSurfaceProps {
  cellSize?: CheckerboardCellSize
  /** Checker A/B contrast. Prefer `strong` for mask / inpaint stages. */
  contrast?: CheckerboardContrast
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<CheckerboardSurfaceProps>(), {
  cellSize: 'md',
  contrast: 'default',
})

const CELL: Record<CheckerboardCellSize, string> = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
}

const classes = computed(() => ['cu-checkerboard-surface', props.class].filter(Boolean).join(' '))
const style = computed(() => ({ '--cu-checkerboard-cell': CELL[props.cellSize] }))
</script>

<template>
  <div
    :class="classes"
    data-ai-role="checkerboard-surface"
    data-ai-intent="show-transparency"
    data-ai-state="default"
    :data-cell-size="cellSize"
    :data-contrast="contrast"
    :style="style"
  >
    <slot />
  </div>
</template>

<style src="./styles.css"></style>
