<script lang="ts">
export interface MediaThumbItem {
  id: string
  src: string
  label: string
  alt?: string
}

export interface MediaThumbGridProps {
  items: MediaThumbItem[]
  selectedIds?: string[]
  minThumbSize?: string
  selectable?: boolean
  disabled?: boolean
  errorLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<MediaThumbGridProps>(), {
  selectedIds: () => [],
  minThumbSize: '8.75rem',
  selectable: true,
  disabled: false,
  errorLabel: 'Image failed to load',
})

const emit = defineEmits<{
  'update:selectedIds': [ids: string[]]
}>()

const failed = ref<Record<string, boolean>>({})
const classes = computed(() => ['cu-media-thumb-grid', props.class].filter(Boolean).join(' '))
const style = computed(() => ({
  '--cu-media-thumb-min': props.minThumbSize,
}))
const aiState = computed(() => (props.disabled ? 'disabled' : 'default'))

function isSelected(id: string) {
  return props.selectedIds.includes(id)
}

function activate(id: string) {
  if (!props.selectable || props.disabled) return
  const next = isSelected(id)
    ? props.selectedIds.filter((value) => value !== id)
    : [...props.selectedIds, id]
  emit('update:selectedIds', next)
}

function markFailed(id: string) {
  failed.value = { ...failed.value, [id]: true }
}
</script>

<template>
  <div
    :class="classes"
    role="group"
    data-ai-role="media-thumb-grid"
    data-ai-intent="toggle-option"
    :data-ai-state="aiState"
    :style="style"
  >
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      class="cu-media-thumb-grid__item"
      :data-selected="isSelected(item.id) ? 'true' : 'false'"
      :data-disabled="disabled || !selectable ? 'true' : 'false'"
      :aria-pressed="selectable ? isSelected(item.id) : undefined"
      :disabled="disabled || !selectable"
      @click="activate(item.id)"
    >
      <div
        v-if="failed[item.id]"
        class="cu-media-thumb-grid__fallback"
        role="img"
        :aria-label="item.alt ?? item.label"
      >
        {{ errorLabel }}
      </div>
      <img
        v-else
        class="cu-media-thumb-grid__media"
        :src="item.src"
        :alt="item.alt ?? item.label"
        loading="lazy"
        @error="markFailed(item.id)"
      />
      <span class="cu-media-thumb-grid__label">{{ item.label }}</span>
    </button>
  </div>
</template>

<style src="./styles.css"></style>
