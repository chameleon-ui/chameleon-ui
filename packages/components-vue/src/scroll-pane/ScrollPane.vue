<script lang="ts">
export type ScrollPaneOrientation = 'vertical' | 'horizontal' | 'both'

export interface ScrollPaneProps {
  orientation?: ScrollPaneOrientation
  overscrollBehavior?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<ScrollPaneProps>(), {
  orientation: 'vertical',
  overscrollBehavior: 'contain',
})

const classes = computed(() =>
  ['cu-scroll-pane', `cu-scroll-pane--${props.orientation}`, props.class].filter(Boolean).join(' '),
)
</script>

<template>
  <div
    :class="classes"
    data-ai-role="scroll-pane"
    data-ai-intent="scroll-region"
    data-ai-state="default"
    :style="{ overscrollBehavior }"
  >
    <slot />
  </div>
</template>

<style src="./styles.css"></style>
