<script lang="ts">
export interface ResultProps {
  status?: 'success' | 'error' | 'info' | 'warning'
  title: string
  description?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(defineProps<ResultProps>(), {
  status: 'info'
})
const slots = useSlots()
const STATUS_GLYPH = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' } as const
const classes = computed(() => ["cu-result", 'cu-result--' + props.status, props.class].filter(Boolean).join(' '))
</script>

<template>
  <div :class="classes" role="status" data-ai-role="result" data-ai-intent="notify-status" :data-ai-state="status">
    <span class="cu-result__icon" aria-hidden="true">{{ STATUS_GLYPH[status] }}</span>
    <p class="cu-result__title">{{ title }}</p>
    <p v-if="description" class="cu-result__description">{{ description }}</p>
    <div v-if="slots.default" class="cu-result__actions"><slot /></div>
  </div>
</template>

<style scoped src="./styles.css"></style>
