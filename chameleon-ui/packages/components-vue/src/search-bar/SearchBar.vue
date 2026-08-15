<script lang="ts">
export interface SearchBarProps {
  value: string
  label: string
  placeholder?: string
  clearLabel?: string
  submitLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<SearchBarProps>(), {
  placeholder: 'Search',
  clearLabel: 'Clear',
  submitLabel: 'Submit search',
})
const emit = defineEmits<{ change: [value: string]; submit: [value: string] }>()
const inputRef = ref<HTMLInputElement | null>(null)
const classes = computed(() => ['cu-search-bar', props.class].filter(Boolean).join(' '))

function onSubmit(event: Event) {
  event.preventDefault()
  emit('submit', props.value)
}

function onInput(event: Event) {
  emit('change', (event.currentTarget as HTMLInputElement).value)
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.value.length > 0) {
    event.preventDefault()
    emit('change', '')
  }
}

function clear() {
  emit('change', '')
  inputRef.value?.focus()
}
</script>

<template>
  <form
    :class="classes"
    role="search"
    :aria-label="label"
    data-ai-role="search-bar"
    data-ai-intent="search-select"
    :data-ai-state="value.length > 0 ? 'filled' : 'default'"
    @submit="onSubmit"
  >
    <label class="cu-search-bar__label">
      <span class="cu-search-bar__label-text">{{ label }}</span>
      <input
        ref="inputRef"
        class="cu-input"
        type="search"
        :value="value"
        :placeholder="placeholder"
        @input="onInput"
        @keydown="onKeyDown"
      />
    </label>
    <button v-if="value.length > 0" type="button" class="cu-search-bar__clear" :aria-label="clearLabel" @click="clear">×</button>
    <button type="submit" class="cu-search-bar__submit" :aria-label="submitLabel"><span aria-hidden="true">⌕</span></button>
  </form>
</template>

<style scoped src="./styles.css"></style>
<style scoped src="../input/styles.css"></style>
