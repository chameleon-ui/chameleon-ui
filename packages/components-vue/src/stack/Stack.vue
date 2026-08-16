<script lang="ts">
export type StackDirection = 'row' | 'column'
export type StackGap = '0' | '1' | '2' | '3' | '4' | '5' | '6'
export type StackAlignment = 'start' | 'center' | 'end' | 'stretch'
export type StackJustify = 'start' | 'center' | 'end' | 'between'

export interface StackProps {
  direction?: StackDirection
  gap?: StackGap
  /** Cross-axis alignment. Default `stretch` fills the cross axis (full width in a column stack). */
  align?: StackAlignment
  /** Main-axis distribution. */
  justify?: StackJustify
  /**
   * Grow to fill a flex/grid parent (workspace panes, shell columns, toolbars).
   * Sets `flex: 1 1 auto` + self stretch; pair with `align="stretch"` for children.
   */
  grow?: boolean
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
  grow: false,
})

const classes = computed(() =>
  [
    'cu-stack',
    `cu-stack--${props.direction}`,
    `cu-stack--gap-${props.gap}`,
    `cu-stack--align-${props.align}`,
    `cu-stack--justify-${props.justify}`,
    props.grow ? 'cu-stack--grow' : '',
    props.class,
  ]
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
    :data-grow="grow ? 'true' : 'false'"
  >
    <slot />
  </div>
</template>

<style src="./styles.css"></style>
