<script lang="ts">
export interface CheckboxProps {
  disabled?: boolean
  label: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckboxPrimitive } from '@chameleon-ui/primitives-vue'

const props = withDefaults(defineProps<CheckboxProps>(), {
  disabled: false,
})

const checked = defineModel<boolean>('modelValue', { default: false })

const classes = computed(() => ['cu-checkbox', props.class].filter(Boolean).join(' '))
const dataAiState = computed(() =>
  checked.value ? 'checked' : props.disabled ? 'disabled' : 'default',
)

function onCheckedChange(details: { checked: boolean | 'indeterminate' }) {
  checked.value = !!details.checked
}
</script>

<template>
  <CheckboxPrimitive.Root
    :checked="checked"
    :class="classes"
    data-ai-role="checkbox"
    data-ai-intent="toggle-option"
    :data-ai-state="dataAiState"
    :disabled="disabled"
    @checked-change="onCheckedChange"
  >
    <CheckboxPrimitive.Control class="cu-checkbox__control">
      <CheckboxPrimitive.Indicator class="cu-checkbox__indicator">✓</CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Control>
    <CheckboxPrimitive.Label class="cu-checkbox__label">{{ label }}</CheckboxPrimitive.Label>
    <CheckboxPrimitive.HiddenInput />
  </CheckboxPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
