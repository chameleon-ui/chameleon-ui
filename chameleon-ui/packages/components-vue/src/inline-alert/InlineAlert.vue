<script lang="ts">
export interface InlineAlertProps {
  status?: 'info' | 'success' | 'warning' | 'error'
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<InlineAlertProps>(), {
  status: 'info'
})
const classes = computed(() => ["cu-inline-alert", 'cu-inline-alert--' + props.status, props.class].filter(Boolean).join(' '))
</script>

<template>
  <div :class="classes" data-ai-role="inline-alert" data-ai-intent="flag-field-error" :data-ai-state="status" role="status"><slot /></div>
</template>

<style scoped src="./styles.css"></style>
