<script lang="ts">
export type SpaceSize = 'none' | 'sm' | 'md' | 'lg'
export type SpaceAxis = 'block' | 'inline' | 'both'

export interface SpaceProps {
  size?: SpaceSize
  axis?: SpaceAxis
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<SpaceProps>(), {
  size: 'md',
  axis: 'block'
})
const classes = computed(() => ["cu-space", 'cu-space--' + props.size, props.class].filter(Boolean).join(' '))
</script>

<template>
  <div
    :class="classes"
    data-ai-role="space"
    data-ai-intent="layout-flow"
    :data-ai-state="axis"
    :data-axis="axis"
    aria-hidden="true"
  />
</template>

<style scoped src="./styles.css"></style>
