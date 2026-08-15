<script lang="ts">
export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rectangle'
  width?: string
  height?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<SkeletonProps>(), {
  variant: 'text',
  width: '100%',
  height: '1rem'
})
const classes = computed(() => ["cu-skeleton", 'cu-skeleton--' + props.variant, props.class].filter(Boolean).join(' '))
const style = computed(() => ({ width: props.width, height: props.height }))
</script>

<template>
  <div aria-hidden="true" :class="classes" data-ai-role="skeleton" data-ai-intent="indicate-loading" data-ai-state="loading" :style="style" />
</template>

<style scoped src="./styles.css"></style>
