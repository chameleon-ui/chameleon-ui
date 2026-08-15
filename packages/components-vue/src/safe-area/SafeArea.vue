<script lang="ts">
export interface SafeAreaProps {
  top?: boolean
  bottom?: boolean
  start?: boolean
  end?: boolean
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<SafeAreaProps>(), {
  top: false,
  bottom: true,
  start: false,
  end: false
})
const classes = computed(() =>
  ['cu-safe-area', props.top && 'cu-safe-area--top', props.bottom && 'cu-safe-area--bottom', props.start && 'cu-safe-area--start', props.end && 'cu-safe-area--end', props.class]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div :class="classes" data-ai-role="safe-area" data-ai-intent="fit-safe-area" data-ai-state="default"><slot /></div>
</template>

<style scoped src="./styles.css"></style>
