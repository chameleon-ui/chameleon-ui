<script lang="ts">
export interface MultiSelectOption {
  value: string
  label: string
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  values: string[]
  label: string
  selectedLabel?: string
  clearLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'

const props = withDefaults(defineProps<MultiSelectProps>(), { selectedLabel: 'selected', clearLabel: 'Clear all' })
const emit = defineEmits<{ change: [values: string[]] }>()
const open = ref(false)
const listboxId = useId()
const classes = computed(() => ['cu-multi-select', props.class].filter(Boolean).join(' '))
const aiState = computed(() => (open.value ? 'open' : props.values.length === 0 ? 'empty' : 'default'))

function toggle(value: string) {
  emit('change', props.values.includes(value) ? props.values.filter((entry) => entry !== value) : [...props.values, value])
}

function labelFor(value: string) {
  return props.options.find((option) => option.value === value)?.label ?? value
}
</script>

<template>
  <div :class="classes" data-ai-role="multi-select" data-ai-intent="toggle-option" :data-ai-state="aiState">
    <span class="cu-multi-select__label" :id="listboxId + '-label'">{{ label }}</span>
    <ul v-if="values.length > 0" class="cu-multi-select__chips" :aria-label="values.length + ' ' + selectedLabel">
      <li v-for="value in values" :key="value" class="cu-multi-select__chip">
        <span>{{ labelFor(value) }}</span>
        <button type="button" class="cu-multi-select__chip-remove" :aria-label="clearLabel + ': ' + labelFor(value)" @click="toggle(value)">×</button>
      </li>
    </ul>
    <button
      type="button"
      class="cu-multi-select__trigger"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-labelledby="listboxId + '-label'"
      @click="open = !open"
    >
      {{ values.length > 0 ? values.length + ' ' + selectedLabel : label }}
      <span aria-hidden="true"> ▾</span>
    </button>
    <ul
      v-if="open"
      class="cu-multi-select__listbox"
      role="listbox"
      aria-multiselectable="true"
      :aria-labelledby="listboxId + '-label'"
      :id="listboxId"
      @keydown.escape="open = false"
    >
      <li
        v-for="option in options"
        :key="option.value"
        class="cu-multi-select__option"
        role="option"
        :aria-selected="values.includes(option.value)"
        tabindex="0"
        @click="toggle(option.value)"
        @keydown.enter.prevent="toggle(option.value)"
        @keydown.space.prevent="toggle(option.value)"
      >
        <span class="cu-multi-select__check" aria-hidden="true">{{ values.includes(option.value) ? '✓' : '' }}</span>
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped src="./styles.css"></style>
