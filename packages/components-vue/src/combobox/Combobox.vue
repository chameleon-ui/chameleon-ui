<script lang="ts">
export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxProps {
  options: string[]
  value?: string
  placeholder?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { SelectPrimitive } from '@chameleon-ui/primitives-vue'

const props = withDefaults(defineProps<ComboboxProps>(), { value: '', placeholder: 'Search or select' })
const emit = defineEmits<{ change: [value: string] }>()
const items = computed(() => props.options.map((option) => ({ value: option, label: option })))
const collection = computed(() => SelectPrimitive.createListCollection({ items: items.value }))
const classes = computed(() => ['cu-combobox', props.class].filter(Boolean).join(' '))
const selected = computed(() => (props.options.includes(props.value) ? [props.value] : []))

function onValueChange(details: { value: string[] }) {
  emit('change', details.value[0] ?? '')
}
</script>

<template>
  <SelectPrimitive.Root
    :class="classes"
    :collection="collection"
    data-ai-role="combobox"
    data-ai-intent="search-select"
    :data-ai-state="value ? 'closed' : 'open'"
    :model-value="selected"
    @value-change="onValueChange"
  >
    <SelectPrimitive.Control class="cu-combobox__control">
      <SelectPrimitive.Trigger class="cu-combobox__trigger">{{ value || placeholder }}</SelectPrimitive.Trigger>
    </SelectPrimitive.Control>
    <SelectPrimitive.Positioner>
      <SelectPrimitive.Content class="cu-combobox__content">
        <SelectPrimitive.List>
          <SelectPrimitive.Item v-for="option in items" :key="option.value" class="cu-combobox__item" :item="option">
            <SelectPrimitive.ItemText>{{ option.label }}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator>✓</SelectPrimitive.ItemIndicator>
          </SelectPrimitive.Item>
        </SelectPrimitive.List>
      </SelectPrimitive.Content>
    </SelectPrimitive.Positioner>
  </SelectPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
