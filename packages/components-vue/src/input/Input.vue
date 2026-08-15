<script lang="ts">
export interface InputProps {
  label: string
  disabled?: boolean
  invalid?: boolean
  errorMessage?: string
  id?: string
  placeholder?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { InputPrimitive } from '@chameleon-ui/primitives-vue'

const props = withDefaults(defineProps<InputProps>(), {
  disabled: false,
  invalid: false,
  errorMessage: 'Please review this value.',
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
  <div class="cu-field" data-ai-role="input" data-ai-intent="enter-text" :data-ai-state="dataAiState">
    <label :for="id" class="cu-field__label">{{ label }}</label>
    <InputPrimitive
      :id="id"
      :value="model"
      :class="inputClasses"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      :placeholder="placeholder"
      @input="updateValue"
    />
    <span v-if="invalid" class="cu-field__error" aria-live="polite">{{ errorMessage }}</span>
  </div>
</template>

<style scoped src="./styles.css"></style>
