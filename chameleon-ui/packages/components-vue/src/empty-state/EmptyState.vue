<script lang="ts">
export interface EmptyStateProps {
  title: string
  description?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = defineProps<EmptyStateProps>()
const slots = useSlots()
const classes = computed(() => ['cu-empty-state', props.class].filter(Boolean).join(' '))
</script>

<template>
  <div
    :class="classes"
    data-ai-role="empty-state"
    data-ai-state="default"
    data-ai-intent="prompt-first-action"
    role="status"
  >
    <div class="cu-empty-state__mark" aria-hidden="true" />
    <div class="cu-empty-state__title">{{ title }}</div>
    <div v-if="description" class="cu-empty-state__description">{{ description }}</div>
    <div v-if="slots.action" class="cu-empty-state__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style src="./styles.css"></style>
