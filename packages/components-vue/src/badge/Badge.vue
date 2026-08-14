<script lang="ts">
export interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
  size: 'md',
})

const classes = computed(() =>
  ['cu-badge', `cu-badge--${props.variant}`, `cu-badge--${props.size}`, props.class]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <span :class="classes" data-ai-role="badge" data-ai-intent="flag-status" :data-ai-state="variant">
    <slot />
  </span>
</template>

<style scoped src="./styles.css"></style>
