<script lang="ts">
export type MasonryGap = 'sm' | 'md' | 'lg'

export interface MasonryProps {
  columns?: 2 | 3 | 4
  gap?: MasonryGap
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<MasonryProps>(), {
  columns: 3,
  gap: 'md'
})
const classes = computed(() =>
  ['cu-masonry', 'cu-masonry--columns-' + props.columns, 'cu-masonry--gap-' + props.gap, props.class].filter(Boolean).join(' '),
)
</script>

<template>
  <div :class="classes" data-ai-role="masonry" data-ai-intent="layout-columns" data-ai-state="default" :data-columns="columns">
    <div class="cu-masonry__track"><slot /></div>
  </div>
</template>

<style scoped src="./styles.css"></style>
