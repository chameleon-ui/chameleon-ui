<script lang="ts">
export interface StepItem {
  value: string
  label: string
  description?: string
}

export type StepsStatus = 'start' | 'in-progress' | 'complete'

export interface StepsProps {
  items: StepItem[]
  currentValue: string
  label: string
  class?: string
}

function statusFor(currentIndex: number, lastIndex: number): StepsStatus {
  if (currentIndex <= 0) return 'start'
  if (currentIndex >= lastIndex) return 'complete'
  return 'in-progress'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<StepsProps>()
const emit = defineEmits<{ select: [value: string] }>()
const classes = computed(() => ['cu-steps', props.class].filter(Boolean).join(' '))
const currentIndex = computed(() => props.items.findIndex((item) => item.value === props.currentValue))
const state = computed(() => statusFor(currentIndex.value, Math.max(0, props.items.length - 1)))
const selectable = computed(() => typeof getListener() === 'function')

function getListener() {
  return undefined
}

function itemStatus(index: number) {
  if (index < currentIndex.value) return 'complete'
  if (index === currentIndex.value) return 'current'
  return 'upcoming'
}
</script>

<template>
  <nav :class="classes" :aria-label="label" data-ai-role="steps" data-ai-intent="enumerate-items" :data-ai-state="state">
    <ol class="cu-steps__list">
      <li v-for="(item, index) in items" :key="item.value" :class="'cu-steps__item cu-steps__item--' + itemStatus(index)" :data-status="itemStatus(index)">
        <button
          v-if="$attrs.onSelect"
          type="button"
          class="cu-steps__button"
          :aria-current="itemStatus(index) === 'current' ? 'step' : undefined"
          @click="emit('select', item.value)"
        >
          <span class="cu-steps__index" aria-hidden="true">{{ index + 1 }}</span>
          <span class="cu-steps__copy">
            <span class="cu-steps__label">{{ item.label }}</span>
            <span v-if="item.description" class="cu-steps__description">{{ item.description }}</span>
          </span>
        </button>
        <div v-else class="cu-steps__static" :aria-current="itemStatus(index) === 'current' ? 'step' : undefined">
          <span class="cu-steps__index" aria-hidden="true">{{ index + 1 }}</span>
          <span class="cu-steps__copy">
            <span class="cu-steps__label">{{ item.label }}</span>
            <span v-if="item.description" class="cu-steps__description">{{ item.description }}</span>
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<style scoped src="./styles.css"></style>
