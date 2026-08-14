<script lang="ts">
export interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'sm' | 'md' | 'lg'
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'default',
  padding: 'md',
})

const classes = computed(() =>
  ['cu-card', `cu-card--${props.variant}`, `cu-card--padding-${props.padding}`, props.class]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div
    :class="classes"
    data-ai-role="card"
    data-ai-intent="group-content"
    :data-ai-state="variant"
  >
    <slot />
  </div>
</template>

<style scoped src="./styles.css"></style>
