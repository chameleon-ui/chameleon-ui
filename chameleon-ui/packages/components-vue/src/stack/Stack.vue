<script lang="ts">
export type StackDirection = 'row' | 'column'
export type StackGap = '0' | '1' | '2' | '3'
export type StackAlignment = 'start' | 'center' | 'end' | 'stretch'
export type StackJustify = 'start' | 'center' | 'end' | 'between'

export interface StackProps {
  direction?: StackDirection
  gap?: StackGap
  align?: StackAlignment
  justify?: StackJustify
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<StackProps>(), {
  direction: 'column',
  gap: '2',
  align: 'stretch',
  justify: 'start',
})

const classes = computed(() =>
  ['cu-stack', `cu-stack--${props.direction}`, `cu-stack--gap-${props.gap}`, props.class]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div
    :class="classes"
    data-ai-role="stack"
    data-ai-intent="layout-flow"
    data-ai-state="default"
    :data-direction="direction"
    :data-gap="gap"
    :data-align="align"
    :data-justify="justify"
  >
    <slot />
  </div>
</template>

<style scoped src="./styles.css"></style>
