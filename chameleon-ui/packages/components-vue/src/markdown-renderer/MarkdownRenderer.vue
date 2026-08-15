<script lang="ts">
export interface MarkdownRendererProps {
  markdown: string
  label?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { renderBlocks, type InlineNode } from './parse.js'

const props = withDefaults(defineProps<MarkdownRendererProps>(), { label: 'Markdown content' })
const classes = computed(() => ['cu-markdown-renderer', props.class].filter(Boolean).join(' '))
const empty = computed(() => props.markdown.trim().length === 0)
const blocks = computed(() => (empty.value ? [] : renderBlocks(props.markdown)))

function inlineKey(node: InlineNode, index: number) {
  return node.type + '-' + index + '-' + ('text' in node ? node.text : '')
}
</script>

<template>
  <div
    :class="classes"
    role="document"
    :aria-label="label"
    data-ai-role="markdown-renderer"
    data-ai-intent="render-markup"
    :data-ai-state="empty ? 'empty' : 'default'"
  >
    <template v-for="(block, index) in blocks" :key="block.type + '-' + index">
      <pre v-if="block.type === 'pre'" class="cu-markdown-renderer__code"><code>{{ block.text }}</code></pre>
      <ul v-else-if="block.type === 'ul'" class="cu-markdown-renderer__list">
        <li v-for="(item, itemIndex) in block.items" :key="itemIndex">
          <template v-for="(node, nodeIndex) in item" :key="inlineKey(node, nodeIndex)">
            <strong v-if="node.type === 'strong'">{{ node.text }}</strong>
            <em v-else-if="node.type === 'em'">{{ node.text }}</em>
            <code v-else-if="node.type === 'code'">{{ node.text }}</code>
            <a v-else-if="node.type === 'a'" :href="node.href">{{ node.text }}</a>
            <template v-else>{{ node.text }}</template>
          </template>
        </li>
      </ul>
      <component :is="block.type" v-else>
        <template v-for="(node, nodeIndex) in block.children" :key="inlineKey(node, nodeIndex)">
          <strong v-if="node.type === 'strong'">{{ node.text }}</strong>
          <em v-else-if="node.type === 'em'">{{ node.text }}</em>
          <code v-else-if="node.type === 'code'">{{ node.text }}</code>
          <a v-else-if="node.type === 'a'" :href="node.href">{{ node.text }}</a>
          <template v-else>{{ node.text }}</template>
        </template>
      </component>
    </template>
  </div>
</template>

<style scoped src="./styles.css"></style>
