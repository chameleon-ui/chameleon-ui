<script lang="ts">
export type TypographyVariant = 'heading-1' | 'heading-2' | 'body' | 'caption'
export type TypographyTag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'

export interface TypographyProps {
  variant?: TypographyVariant
  as?: TypographyTag
  class?: string
}

export const defaultElement: Record<TypographyVariant, TypographyTag> = {
  'heading-1': 'h1',
  'heading-2': 'h2',
  body: 'p',
  caption: 'span',
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<TypographyProps>(), {
  variant: 'body',
})

const tag = computed(() => props.as ?? defaultElement[props.variant])
const classes = computed(() =>
  ['cu-typography', `cu-typography--${props.variant}`, props.class].filter(Boolean).join(' '),
)
</script>

<template>
  <component
    :is="tag"
    :class="classes"
    data-ai-role="typography"
    data-ai-intent="style-text"
    :data-ai-state="variant"
    :data-variant="variant"
  >
    <slot />
  </component>
</template>

<style src="./styles.css"></style>
