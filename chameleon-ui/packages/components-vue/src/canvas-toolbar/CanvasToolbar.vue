<script lang="ts">
export type CanvasToolbarAction = 'zoom-in' | 'zoom-out' | 'reset' | 'fit'

export interface CanvasToolbarProps {
  label: string
  zoomInLabel: string
  zoomOutLabel: string
  resetLabel: string
  fitLabel: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<CanvasToolbarProps>()
const emit = defineEmits<{ action: [action: CanvasToolbarAction] }>()
const classes = computed(() => ['cu-canvas-toolbar', props.class].filter(Boolean).join(' '))
</script>

<template>
  <div :class="classes" role="toolbar" :aria-label="label" data-ai-role="canvas-toolbar" data-ai-intent="choose-action" data-ai-state="default">
    <button type="button" class="cu-canvas-toolbar__button" :aria-label="zoomInLabel" @click="emit('action', 'zoom-in')"><span aria-hidden="true">+</span></button>
    <button type="button" class="cu-canvas-toolbar__button" :aria-label="zoomOutLabel" @click="emit('action', 'zoom-out')"><span aria-hidden="true">−</span></button>
    <button type="button" class="cu-canvas-toolbar__button" :aria-label="resetLabel" @click="emit('action', 'reset')"><span aria-hidden="true">⟲</span></button>
    <button type="button" class="cu-canvas-toolbar__button" :aria-label="fitLabel" @click="emit('action', 'fit')"><span aria-hidden="true">⛶</span></button>
  </div>
</template>

<style scoped src="./styles.css"></style>
