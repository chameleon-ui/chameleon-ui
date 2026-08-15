<script lang="ts">
export interface ChipProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  class?: string
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'

const props = withDefaults(defineProps<ChipProps>(), {
  variant: 'default'
})
const emit = defineEmits<{ remove: [] }>()
const instance = getCurrentInstance()
const hasRemove = computed(() => typeof instance?.vnode.props?.onRemove === 'function')
const classes = computed(() => ["cu-chip", 'cu-chip--' + props.variant, props.class].filter(Boolean).join(' '))
</script>

<template>
  <span :class="classes" data-ai-role="chip" data-ai-intent="filter-selection" :data-ai-state="hasRemove ? 'removable' : 'default'">
    <slot />
    <button v-if="hasRemove" class="cu-chip__remove" type="button" aria-label="Remove" @click="emit('remove')">×</button>
  </span>
</template>

<style scoped src="./styles.css"></style>
