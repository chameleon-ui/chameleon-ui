<script lang="ts">
export type { TreeNode, TreeProps } from './types.js'
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { TreeLevel } from './TreeLevel.js'
import type { TreeProps } from './types.js'

const props = withDefaults(defineProps<TreeProps>(), {
  defaultExpandedIds: () => [],
  toggleLabel: 'Toggle node',
})
const expanded = ref(new Set(props.defaultExpandedIds))
const classes = computed(() => ['cu-tree', props.class].filter(Boolean).join(' '))

function toggle(id: string) {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}

function isExpanded(id: string) {
  return expanded.value.has(id)
}
</script>

<template>
  <div :class="classes" data-ai-role="tree" data-ai-intent="navigate-hierarchy" :data-ai-state="nodes.length === 0 ? 'empty' : 'default'">
    <TreeLevel :items="nodes" :root="true" :toggle-label="toggleLabel" :is-expanded="isExpanded" @toggle="toggle" />
  </div>
</template>

<style scoped src="./styles.css"></style>
