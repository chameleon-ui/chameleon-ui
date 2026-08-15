<script lang="ts">
export interface FlowNodeProps {
  id: string
  x: number
  y: number
  title: string
  status?: 'default' | 'active' | 'success' | 'failed'
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<FlowNodeProps>(), {
  status: 'default'
})
const classes = computed(() => ["cu-flow-node", 'cu-flow-node--' + props.status, props.class].filter(Boolean).join(' '))
const style = computed(() => ({ transform: `translate(${props.x}px, ${props.y}px)` }))
</script>

<template>
  <div :id="id" :class="classes" data-ai-role="flow-node" data-ai-intent="group-content" :data-ai-state="status" data-canvas-node :style="style">
    <span class="cu-flow-node__port cu-flow-node__port--in" aria-hidden="true" />
    <span class="cu-flow-node__title">{{ title }}</span>
    <span class="cu-flow-node__port cu-flow-node__port--out" aria-hidden="true" />
  </div>
</template>

<style scoped src="./styles.css"></style>
