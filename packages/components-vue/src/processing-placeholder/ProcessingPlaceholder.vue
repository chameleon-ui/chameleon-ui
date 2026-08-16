<script lang="ts">
export interface ProcessingPlaceholderProps {
  title: string
  description?: string
  thumbnailSrc?: string
  thumbnailAlt?: string
  spinnerLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Spinner } from '../spinner/index.js'

const props = withDefaults(defineProps<ProcessingPlaceholderProps>(), {
  thumbnailAlt: '',
  spinnerLabel: 'Processing',
})

const slots = useSlots()
const classes = computed(() => ['cu-processing-placeholder', props.class].filter(Boolean).join(' '))
</script>

<template>
  <div
    :class="classes"
    role="status"
    aria-live="polite"
    data-ai-role="processing-placeholder"
    data-ai-intent="indicate-busy"
    data-ai-state="busy"
  >
    <Spinner size="lg" :label="spinnerLabel" />
    <p class="cu-processing-placeholder__title">{{ title }}</p>
    <p v-if="description" class="cu-processing-placeholder__description">{{ description }}</p>
    <img
      v-if="thumbnailSrc"
      class="cu-processing-placeholder__thumb"
      :src="thumbnailSrc"
      :alt="thumbnailAlt"
    />
    <div v-if="slots.action" class="cu-processing-placeholder__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style src="./styles.css"></style>
