<script lang="ts">
export interface RadioOption {
  value: string
  label: string
}

export interface RadioProps {
  options: RadioOption[]
  label: string
  name?: string
  disabled?: boolean
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RadioGroupPrimitive } from '@chameleon-ui/primitives-vue'

const props = withDefaults(defineProps<RadioProps>(), {
  disabled: false,
})

const model = defineModel<string>('modelValue', { default: '' })

const classes = computed(() => ['cu-radio', props.class].filter(Boolean).join(' '))
const dataAiState = computed(() => (props.disabled ? 'disabled' : 'default'))

function onValueChange(details: { value: string | null }) {
  model.value = details.value ?? ''
}
</script>

<template>
  <RadioGroupPrimitive.Root
    :class="classes"
    data-ai-role="radio"
    data-ai-intent="select-single"
    :data-ai-state="dataAiState"
    :disabled="disabled"
    :name="name"
    :model-value="model || null"
    @value-change="onValueChange"
  >
    <RadioGroupPrimitive.Label class="cu-radio__label">{{ label }}</RadioGroupPrimitive.Label>
    <RadioGroupPrimitive.Item
      v-for="option in options"
      :key="option.value"
      class="cu-radio__item"
      :value="option.value"
    >
      <RadioGroupPrimitive.ItemControl class="cu-radio__control">
        <RadioGroupPrimitive.Indicator class="cu-radio__indicator">●</RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.ItemControl>
      <RadioGroupPrimitive.ItemText class="cu-radio__text">{{ option.label }}</RadioGroupPrimitive.ItemText>
      <RadioGroupPrimitive.ItemHiddenInput />
    </RadioGroupPrimitive.Item>
  </RadioGroupPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
