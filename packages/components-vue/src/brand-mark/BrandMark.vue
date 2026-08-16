<script lang="ts">
export type BrandMarkSize = 'sm' | 'md'

export interface BrandMarkProps {
  src: string
  alt: string
  size?: BrandMarkSize
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<BrandMarkProps>(), {
  size: 'md',
})

const classes = computed(() =>
  ['cu-brand-mark', `cu-brand-mark--${props.size}`, props.class].filter(Boolean).join(' '),
)
</script>

<template>
  <img
    :class="classes"
    :src="src"
    :alt="alt"
    data-ai-role="brand-mark"
    data-ai-intent="show-brand"
    :data-ai-state="size"
  />
</template>

<style src="./styles.css"></style>
