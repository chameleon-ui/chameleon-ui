<script lang="ts">
export interface DescriptionListItem {
  term: string
  description: string
}

export interface DescriptionListProps {
  items: DescriptionListItem[]
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<DescriptionListProps>()
const classes = computed(() => ["cu-description-list", props.class].filter(Boolean).join(' '))
</script>

<template>
  <dl :class="classes" data-ai-role="description-list" data-ai-state="default" data-ai-intent="inspect-details">
    <div v-for="(item, index) in items" :key="index" class="cu-description-list__group">
      <dt class="cu-description-list__term">{{ item.term }}</dt>
      <dd class="cu-description-list__detail">{{ item.description }}</dd>
    </div>
  </dl>
</template>

<style scoped src="./styles.css"></style>
