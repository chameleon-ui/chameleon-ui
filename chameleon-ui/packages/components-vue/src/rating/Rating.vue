<script lang="ts">
export interface RatingProps {
  value: number
  max?: number
  label: string
  starLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'

const props = withDefaults(defineProps<RatingProps>(), { max: 5, starLabel: 'Star' })
const emit = defineEmits<{ change: [value: number] }>()
const instance = getCurrentInstance()
const readOnly = computed(() => typeof instance?.vnode.props?.onChange !== 'function')
const classes = computed(() => ['cu-rating', props.class].filter(Boolean).join(' '))
const stars = computed(() => Array.from({ length: props.max }, (_, index) => index + 1))

function onKey(event: KeyboardEvent) {
  if (readOnly.value) return
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') emit('change', Math.min(props.max, props.value + 1))
  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') emit('change', Math.max(0, props.value - 1))
}
</script>

<template>
  <div :class="classes" role="radiogroup" :aria-label="label" data-ai-role="rating" data-ai-intent="rate-item" :data-ai-state="readOnly ? 'readonly' : 'default'">
    <button
      v-for="star in stars"
      :key="star"
      type="button"
      :class="'cu-rating__star' + (star <= value ? ' cu-rating__star--filled' : '')"
      role="radio"
      :aria-checked="star === value"
      :aria-label="star + ' ' + starLabel"
      :disabled="readOnly"
      @click="emit('change', star)"
      @keydown="onKey"
    >
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path d="M8 1.5 10 6l4.9.4-3.7 3.2 1.1 4.8L8 12l-4.3 2.4 1.1-4.8L1.1 6.4 6 6Z" :fill="star <= value ? 'currentColor' : 'none'" stroke="currentColor" />
      </svg>
    </button>
  </div>
</template>

<style scoped src="./styles.css"></style>
