<script lang="ts">
export interface DividerProps {
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<DividerProps>()
const classes = computed(() => ["cu-divider", props.class].filter(Boolean).join(' '))
</script>

<template>
  <hr :class="classes" data-ai-role="divider" data-ai-state="default" data-ai-intent="separate-sections" />
</template>

<style scoped src="./styles.css"></style>
