<script lang="ts">
export interface TextareaProps {
  label: string
  disabled?: boolean
  invalid?: boolean
  errorMessage?: string
  id?: string
  placeholder?: string
  rows?: number
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { FieldPrimitive } from '@chameleon-ui/primitives-vue'

const props = withDefaults(defineProps<TextareaProps>(), {
  disabled: false,
  invalid: false,
  errorMessage: 'Please review this value.',
  rows: 4,
})

const model = defineModel<string>('modelValue', { default: '' })

const textareaClasses = computed(() => ['cu-textarea', props.class].filter(Boolean).join(' '))
const dataAiState = computed(() =>
  props.invalid ? 'invalid' : props.disabled ? 'disabled' : 'default',
)

function updateValue(event: Event) {
  model.value = (event.target as HTMLTextAreaElement).value
}
</script>

<template>
  <FieldPrimitive.Root
    class="cu-field"
    data-ai-role="textarea"
    data-ai-intent="enter-long-text"
    :data-ai-state="dataAiState"
    :disabled="disabled"
    :id="id"
    :invalid="invalid"
  >
    <FieldPrimitive.Label class="cu-field__label">{{ label }}</FieldPrimitive.Label>
    <FieldPrimitive.Textarea
      :class="textareaClasses"
      :value="model"
      :placeholder="placeholder"
      :rows="rows"
      @input="updateValue"
    />
    <FieldPrimitive.ErrorText v-if="invalid" class="cu-field__error">{{ errorMessage }}</FieldPrimitive.ErrorText>
  </FieldPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
