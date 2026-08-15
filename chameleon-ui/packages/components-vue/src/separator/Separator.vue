<script lang="ts">
export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal'
})
const classes = computed(() => ["cu-separator", 'cu-separator--' + props.orientation, props.class].filter(Boolean).join(' '))
</script>

<template>
  <hr :class="classes" data-ai-role="separator" data-ai-intent="separate-items" :data-ai-state="orientation" :aria-orientation="orientation" />
</template>

<style scoped src="./styles.css"></style>
