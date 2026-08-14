<script lang="ts">
export interface SwitchProps {
  disabled?: boolean
  label: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { SwitchPrimitive } from '@chameleon-ui/primitives-vue'

const props = withDefaults(defineProps<SwitchProps>(), {
  disabled: false,
})

const checked = defineModel<boolean>('modelValue', { default: false })

const classes = computed(() => ['cu-switch', props.class].filter(Boolean).join(' '))
const dataAiState = computed(() =>
  checked.value ? 'checked' : props.disabled ? 'disabled' : 'default',
)

function onCheckedChange(details: { checked: boolean }) {
  checked.value = !!details.checked
}
</script>

<template>
  <SwitchPrimitive.Root
    :checked="checked"
    :class="classes"
    data-ai-role="switch"
    data-ai-intent="toggle-setting"
    :data-ai-state="dataAiState"
    :disabled="disabled"
    @checked-change="onCheckedChange"
  >
    <SwitchPrimitive.Label class="cu-switch__label">{{ label }}</SwitchPrimitive.Label>
    <SwitchPrimitive.Control class="cu-switch__control">
      <SwitchPrimitive.Thumb class="cu-switch__thumb" />
    </SwitchPrimitive.Control>
    <SwitchPrimitive.HiddenInput />
  </SwitchPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
