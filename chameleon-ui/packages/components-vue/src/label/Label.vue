<script lang="ts">
export interface LabelProps {
  htmlFor?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<LabelProps>()
const classes = computed(() => ["cu-label", props.class].filter(Boolean).join(' '))
</script>

<template>
  <label :class="classes" data-ai-role="label" data-ai-state="default" data-ai-intent="name-field" :for="htmlFor"><slot /></label>
</template>

<style scoped src="./styles.css"></style>
