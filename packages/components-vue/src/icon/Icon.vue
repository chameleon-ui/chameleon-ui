<script lang="ts">
export interface IconProps {
  label: string
  mode?: 'mirror' | 'preserve' | 'localized'
  class?: string
}
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(defineProps<IconProps>(), {
  mode: 'preserve'
})
const slots = useSlots()
const classes = computed(() => ['cu-icon', `cu-icon--${props.mode}`, props.class].filter(Boolean).join(' '))
</script>

<template>
  <span
    :class="classes"
    data-ai-role="icon"
    data-ai-intent="signal-meaning"
    data-ai-state="default"
    :data-mode="mode"
    :aria-label="label"
    role="img"
  >
    <slot>
      <svg aria-hidden="true" class="cu-icon__svg" viewBox="0 0 24 24">
        <path d="M20 12H4m0 0l6-6m-6 6l6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
      </svg>
    </slot>
  </span>
</template>

<style scoped src="./styles.css"></style>
