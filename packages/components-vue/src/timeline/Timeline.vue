<script lang="ts">
export interface TimelineItem {
  id: string
  title: string
  description?: string
  time?: string
}

export interface TimelineProps {
  items: TimelineItem[]
  emptyLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<TimelineProps>(), { emptyLabel: 'No events yet' })
const classes = computed(() => ['cu-timeline', props.class].filter(Boolean).join(' '))
</script>

<template>
  <div :class="classes" data-ai-role="timeline" data-ai-intent="enumerate-items" :data-ai-state="items.length === 0 ? 'empty' : 'default'">
    <p v-if="items.length === 0" class="cu-timeline__empty">{{ emptyLabel }}</p>
    <ol v-else class="cu-timeline__list">
      <li v-for="item in items" :key="item.id" class="cu-timeline__item">
        <span class="cu-timeline__marker" aria-hidden="true" />
        <div class="cu-timeline__content">
          <span class="cu-timeline__title">{{ item.title }}</span>
          <time v-if="item.time" class="cu-timeline__time">{{ item.time }}</time>
          <p v-if="item.description" class="cu-timeline__description">{{ item.description }}</p>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped src="./styles.css"></style>
