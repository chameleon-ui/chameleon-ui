<script lang="ts">
export interface AccordionItem {
  title: string
  content: string
}

export interface AccordionProps {
  items: AccordionItem[]
  multiple?: boolean
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<AccordionProps>(), { multiple: false })
const openIndexes = ref<Set<number>>(new Set())
const classes = computed(() => ['cu-accordion', props.class].filter(Boolean).join(' '))

function isOpen(index: number) {
  return openIndexes.value.has(index)
}

function toggle(index: number) {
  const next = new Set(openIndexes.value)
  if (next.has(index)) next.delete(index)
  else {
    if (!props.multiple) next.clear()
    next.add(index)
  }
  openIndexes.value = next
}
</script>

<template>
  <div :class="classes" data-ai-role="accordion" data-ai-intent="expand-section" :data-ai-state="openIndexes.size > 0 ? 'open' : 'closed'">
    <div v-for="(item, index) in items" :key="index" class="cu-accordion__item">
      <button class="cu-accordion__trigger" type="button" :aria-expanded="isOpen(index)" @click="toggle(index)">{{ item.title }}</button>
      <div v-if="isOpen(index)" class="cu-accordion__content">{{ item.content }}</div>
    </div>
  </div>
</template>

<style scoped src="./styles.css"></style>
