<script lang="ts">
export interface NumberInputProps {
  value: number
  label: string
  min?: number
  max?: number
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { FieldPrimitive } from '@chameleon-ui/primitives-vue'

const props = defineProps<NumberInputProps>()
const emit = defineEmits<{ change: [value: number] }>()
const classes = computed(() => ['cu-number-input', props.class].filter(Boolean).join(' '))

function onInput(event: Event) {
  emit('change', Number((event.currentTarget as HTMLInputElement).value))
}
</script>

<template>
  <FieldPrimitive.Root :class="classes" data-ai-role="number-input" data-ai-state="default" data-ai-intent="enter-quantity">
    <FieldPrimitive.Label class="cu-number-input__label">{{ label }}</FieldPrimitive.Label>
    <FieldPrimitive.Input
      class="cu-number-input__input"
      :max="max"
      :min="min"
      type="number"
      :model-value="String(value)"
      @input="onInput"
    />
  </FieldPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
