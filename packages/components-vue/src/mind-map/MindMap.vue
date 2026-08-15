<script lang="ts">
export interface MindMapNode {
  id: string
  label: string
  children?: MindMapNode[]
}

export interface MindMapProps {
  root: MindMapNode
  label: string
  class?: string
}

interface PositionedNode {
  node: MindMapNode
  x: number
  y: number
}

const LEVEL_WIDTH = 200
const ROW_HEIGHT = 72
const NODE_HEIGHT = 32

function layout(root: MindMapNode) {
  const positioned: PositionedNode[] = []
  const links: { from: PositionedNode; to: PositionedNode }[] = []
  let nextRow = 0
  const visit = (node: MindMapNode, depth: number): PositionedNode => {
    const entry: PositionedNode = { node, x: depth * LEVEL_WIDTH, y: 0 }
    if (!node.children || node.children.length === 0) {
      entry.y = nextRow * ROW_HEIGHT
      nextRow += 1
    } else {
      const children = node.children.map((child) => {
        const placed = visit(child, depth + 1)
        links.push({ from: entry, to: placed })
        return placed
      })
      entry.y = (children[0].y + children[children.length - 1].y) / 2
    }
    positioned.push(entry)
    return entry
  }
  visit(root, 0)
  return { positioned, links, height: Math.max(ROW_HEIGHT, nextRow * ROW_HEIGHT) }
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Edge } from '../edge/index.js'
import { FlowNode } from '../flow-node/index.js'

const props = defineProps<MindMapProps>()
const classes = computed(() => ['cu-mind-map', props.class].filter(Boolean).join(' '))
const laid = computed(() => layout(props.root))
</script>

<template>
  <div
    :class="classes"
    role="tree"
    :aria-label="label"
    data-ai-role="mind-map"
    data-ai-intent="enumerate-items"
    :data-ai-state="laid.positioned.length === 0 ? 'empty' : 'default'"
    :style="{ minBlockSize: laid.height + NODE_HEIGHT + 'px' }"
  >
    <Edge
      v-for="link in laid.links"
      :key="link.from.node.id + '-' + link.to.node.id"
      :x1="link.from.x + 140"
      :y1="link.from.y + NODE_HEIGHT / 2"
      :x2="link.to.x"
      :y2="link.to.y + NODE_HEIGHT / 2"
    />
    <FlowNode v-for="entry in laid.positioned" :key="entry.node.id" :id="entry.node.id" :x="entry.x" :y="entry.y" :title="entry.node.label" />
  </div>
</template>

<style scoped src="./styles.css"></style>
