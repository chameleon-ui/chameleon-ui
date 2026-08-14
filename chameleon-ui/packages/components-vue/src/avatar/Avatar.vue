<script lang="ts">
export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
})

const classes = computed(() =>
  ['cu-avatar', `cu-avatar--${props.size}`, props.class].filter(Boolean).join(' '),
)
const imageAlt = computed(() => props.alt || props.fallback || '')
</script>

<template>
  <img
    v-if="src"
    :class="classes"
    :src="src"
    :alt="imageAlt"
    data-ai-role="avatar"
    data-ai-intent="identify-user"
    data-ai-state="image"
  />
  <span
    v-else
    :class="classes"
    data-ai-role="avatar"
    data-ai-intent="identify-user"
    data-ai-state="fallback"
    :aria-label="alt || fallback"
  >{{ fallback }}</span>
</template>

<style scoped src="./styles.css"></style>
