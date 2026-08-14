<script lang="ts">
export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  options: SelectOption[]
  label: string
  placeholder?: string
  disabled?: boolean
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { SelectPrimitive } from '@chameleon-ui/primitives-vue'

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: 'Select an option',
  disabled: false,
})

const model = defineModel<string>('modelValue', { default: '' })

const collection = computed(() => SelectPrimitive.createListCollection({ items: props.options }))
const classes = computed(() => ['cu-select', props.class].filter(Boolean).join(' '))
const dataAiState = computed(() => (props.disabled ? 'disabled' : 'default'))
const selected = computed(() => (model.value ? [model.value] : []))

function onValueChange(details: { value: string[] }) {
  model.value = details.value[0] ?? ''
}
</script>

<template>
  <SelectPrimitive.Root
    :class="classes"
    :collection="collection"
    data-ai-role="select"
    data-ai-intent="choose-option"
    :data-ai-state="dataAiState"
    :disabled="disabled"
    :model-value="selected"
    @value-change="onValueChange"
  >
    <SelectPrimitive.Label class="cu-select__label">{{ label }}</SelectPrimitive.Label>
    <SelectPrimitive.Control>
      <SelectPrimitive.Trigger class="cu-select__trigger">
        <SelectPrimitive.ValueText :placeholder="placeholder" />
        <SelectPrimitive.Indicator class="cu-select__indicator">▼</SelectPrimitive.Indicator>
      </SelectPrimitive.Trigger>
    </SelectPrimitive.Control>
    <SelectPrimitive.Positioner class="cu-select__positioner">
      <SelectPrimitive.Content class="cu-select__content">
        <SelectPrimitive.List class="cu-select__list">
          <SelectPrimitive.Item
            v-for="option in options"
            :key="option.value"
            class="cu-select__item"
            :item="option"
          >
            <SelectPrimitive.ItemText>{{ option.label }}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator class="cu-select__item-indicator">✓</SelectPrimitive.ItemIndicator>
          </SelectPrimitive.Item>
        </SelectPrimitive.List>
      </SelectPrimitive.Content>
    </SelectPrimitive.Positioner>
  </SelectPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
