<script lang="ts">
export interface TagProps {
  label: string
  variant?: 'default' | 'brand' | 'outline'
  removeLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'

const props = withDefaults(defineProps<TagProps>(), {
  variant: 'default',
  removeLabel: 'Remove tag'
})
const emit = defineEmits<{ remove: [] }>()
const instance = getCurrentInstance()
const hasRemove = computed(() => typeof instance?.vnode.props?.onRemove === 'function')
const classes = computed(() => ["cu-tag", 'cu-tag--' + props.variant, props.class].filter(Boolean).join(' '))
</script>

<template>
  <span :class="classes" data-ai-role="tag" data-ai-intent="filter-selection" :data-ai-state="hasRemove ? 'closable' : 'default'">
    <span class="cu-tag__label">{{ label }}</span>
    <button v-if="hasRemove" type="button" class="cu-tag__remove" :aria-label="removeLabel" @click="emit('remove')">×</button>
  </span>
</template>

<style scoped src="./styles.css"></style>
