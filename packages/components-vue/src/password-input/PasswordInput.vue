<script lang="ts">
export interface PasswordInputProps {
  value: string
  label: string
  showLabel: string
  hideLabel: string
  disabled?: boolean
  invalid?: boolean
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FieldPrimitive } from '@chameleon-ui/primitives-vue'

const props = withDefaults(defineProps<PasswordInputProps>(), { disabled: false, invalid: false })
const emit = defineEmits<{ change: [value: string] }>()
const revealed = ref(false)
const classes = computed(() => ['cu-password-input', props.class].filter(Boolean).join(' '))
const aiState = computed(() => (props.invalid ? 'invalid' : props.disabled ? 'disabled' : revealed.value ? 'revealed' : 'default'))

function onInput(event: Event) {
  emit('change', (event.currentTarget as HTMLInputElement).value)
}
</script>

<template>
  <FieldPrimitive.Root class="cu-field" :disabled="disabled" :invalid="invalid">
    <FieldPrimitive.Label class="cu-field__label">{{ label }}</FieldPrimitive.Label>
    <div :class="classes" data-ai-role="password-input" data-ai-intent="enter-text" :data-ai-state="aiState">
      <FieldPrimitive.Input
        class="cu-input cu-password-input__field"
        :type="revealed ? 'text' : 'password'"
        autocomplete="current-password"
        :model-value="value"
        @input="onInput"
      />
      <button
        type="button"
        class="cu-password-input__toggle"
        :aria-label="revealed ? hideLabel : showLabel"
        :aria-pressed="revealed"
        :disabled="disabled"
        @click="revealed = !revealed"
      >
        <span aria-hidden="true">{{ revealed ? '◡' : '◉' }}</span>
      </button>
    </div>
  </FieldPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
<style scoped src="../input/styles.css"></style>
