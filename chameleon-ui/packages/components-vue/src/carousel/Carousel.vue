<script lang="ts">
export interface CarouselProps {
  items: string[]
  label: string
  previousLabel: string
  nextLabel: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<CarouselProps>()
const index = ref(0)
const classes = computed(() => ['cu-carousel', props.class].filter(Boolean).join(' '))
const count = computed(() => props.items.length)

function move(delta: number) {
  if (count.value === 0) return
  index.value = (index.value + delta + count.value) % count.value
}
</script>

<template>
  <section
    :class="classes"
    aria-roledescription="carousel"
    :aria-label="label"
    data-ai-role="carousel"
    data-ai-intent="switch-view"
    :data-ai-state="count === 0 ? 'empty' : 'default'"
  >
    <div class="cu-carousel__viewport" aria-roledescription="slide">{{ count > 0 ? items[index] : '' }}</div>
    <div v-if="count > 1" class="cu-carousel__controls">
      <button type="button" class="cu-carousel__control" :aria-label="previousLabel" @click="move(-1)"><span aria-hidden="true">‹</span></button>
      <span class="cu-carousel__position">{{ index + 1 }} / {{ count }}</span>
      <button type="button" class="cu-carousel__control" :aria-label="nextLabel" @click="move(1)"><span aria-hidden="true">›</span></button>
    </div>
  </section>
</template>

<style scoped src="./styles.css"></style>
