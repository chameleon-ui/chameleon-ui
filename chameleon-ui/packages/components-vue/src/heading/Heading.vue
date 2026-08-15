<script lang="ts">
export type HeadingLevel = 'level-1' | 'level-2' | 'level-3' | 'level-4' | 'level-5' | 'level-6'

export interface HeadingProps {
  level?: HeadingLevel
  class?: string
}

export const tagByLevel: Record<HeadingLevel, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
  'level-1': 'h1',
  'level-2': 'h2',
  'level-3': 'h3',
  'level-4': 'h4',
  'level-5': 'h5',
  'level-6': 'h6',
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<HeadingProps>(), {
  level: 'level-2',
})

const tag = computed(() => tagByLevel[props.level])
const classes = computed(() => ['cu-heading', `cu-heading--${props.level}`, props.class].filter(Boolean).join(' '))
</script>

<template>
  <component :is="tag" :class="classes" data-ai-role="heading" data-ai-intent="structure-content" :data-ai-state="level">
    <slot />
  </component>
</template>

<style src="./styles.css"></style>
