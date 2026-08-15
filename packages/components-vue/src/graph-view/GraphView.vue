<script lang="ts">
export interface GraphNode {
  id: string
  label: string
}

export interface GraphLink {
  source: string
  target: string
}

export interface GraphViewProps {
  nodes: GraphNode[]
  links: GraphLink[]
  label: string
  class?: string
}

const SIZE = 320
const CENTER = SIZE / 2
const RADIUS = 120
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<GraphViewProps>()
const classes = computed(() => ['cu-graph-view', props.class].filter(Boolean).join(' '))
const positions = computed(() => {
  const map = new Map<string, { x: number; y: number }>()
  props.nodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / Math.max(1, props.nodes.length) - Math.PI / 2
    map.set(node.id, { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) })
  })
  return map
})
const paintedLinks = computed(() =>
  props.links
    .map((link) => ({ from: positions.value.get(link.source), to: positions.value.get(link.target) }))
    .filter((link): link is { from: { x: number; y: number }; to: { x: number; y: number } } => Boolean(link.from && link.to)),
)
</script>

<template>
  <div :class="classes" data-ai-role="graph-view" data-ai-intent="enumerate-items" :data-ai-state="nodes.length === 0 ? 'empty' : 'default'">
    <svg class="cu-graph-view__svg" :viewBox="'0 0 ' + SIZE + ' ' + SIZE" role="img" :aria-label="label">
      <line v-for="(link, index) in paintedLinks" :key="index" class="cu-graph-view__link" :x1="link.from.x" :y1="link.from.y" :x2="link.to.x" :y2="link.to.y" />
      <g v-for="node in nodes" :key="node.id" class="cu-graph-view__node">
        <circle v-if="positions.get(node.id)" :cx="positions.get(node.id)!.x" :cy="positions.get(node.id)!.y" r="16" />
        <text v-if="positions.get(node.id)" :x="positions.get(node.id)!.x" :y="positions.get(node.id)!.y + 32" text-anchor="middle" class="cu-graph-view__label">{{ node.label }}</text>
      </g>
    </svg>
    <ul class="cu-graph-view__list">
      <li v-for="node in nodes" :key="node.id">{{ node.label }}</li>
    </ul>
  </div>
</template>

<style scoped src="./styles.css"></style>
