<script lang="ts">
export interface ListProps {
  items: string[]
  variant?: 'unordered' | 'ordered' | 'none'
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<ListProps>(), {
  variant: 'unordered'
})
const classes = computed(() => ["cu-list", 'cu-list--' + props.variant, props.class].filter(Boolean).join(' '))
</script>

<template>
  <ol v-if="variant === 'ordered'" :class="classes" data-ai-role="list" data-ai-intent="enumerate-items" :data-ai-state="variant">
    <li v-for="(item, index) in items" :key="index" class="cu-list__item">{{ item }}</li>
  </ol>
  <ul v-else :class="classes" data-ai-role="list" data-ai-intent="enumerate-items" :data-ai-state="variant">
    <li v-for="(item, index) in items" :key="index" class="cu-list__item">{{ item }}</li>
  </ul>
</template>

<style scoped src="./styles.css"></style>
