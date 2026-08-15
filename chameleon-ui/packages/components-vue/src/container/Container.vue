<script lang="ts">
export type ContainerSize = 'sm' | 'md' | 'lg'

export interface ContainerProps {
  size?: ContainerSize
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<ContainerProps>(), {
  size: 'md'
})
const classes = computed(() => ["cu-container", 'cu-container--' + props.size, props.class].filter(Boolean).join(' '))
</script>

<template>
  <div :class="classes" data-ai-role="container" data-ai-intent="group-content" :data-ai-state="size">
    <div class="cu-container__body"><slot /></div>
  </div>
</template>

<style scoped src="./styles.css"></style>
