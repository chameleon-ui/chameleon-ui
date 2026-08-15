<script lang="ts">
export interface InputProps {
  label: string
  disabled?: boolean
  invalid?: boolean
  errorMessage?: string
  id?: string
  placeholder?: string
  type?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { FieldPrimitive } from '@chameleon-ui/primitives-vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputProps>(), {
  disabled: false,
  invalid: false,
  errorMessage: 'Please review this value.',
  type: 'text',
})

const model = defineModel<string>('modelValue', { default: '' })

const inputClasses = computed(() => ['cu-input', props.class].filter(Boolean).join(' '))
const dataAiState = computed(() =>
  props.invalid ? 'invalid' : props.disabled ? 'disabled' : 'default',
)

function updateValue(event: Event) {
  model.value = (event.target as HTMLInputElement).value
}
</script>

<template>
  <FieldPrimitive.Root
    class="cu-field"
    data-ai-role="input"
    data-ai-intent="enter-text"
    :data-ai-state="dataAiState"
    :disabled="disabled"
    :id="id"
    :invalid="invalid"
  >
    <FieldPrimitive.Label class="cu-field__label">{{ label }}</FieldPrimitive.Label>
    <FieldPrimitive.Input
      :class="inputClasses"
      :value="model"
      :placeholder="placeholder"
      :type="type"
      :aria-invalid="invalid || undefined"
      v-bind="$attrs"
      @input="updateValue"
    />
    <FieldPrimitive.ErrorText v-if="invalid" class="cu-field__error">{{ errorMessage }}</FieldPrimitive.ErrorText>
  </FieldPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
