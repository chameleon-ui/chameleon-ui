<script lang="ts">
export interface ButtonProps {
  variant?: 'solid' | 'outline'
  size?: 'sm' | 'md'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  intent?: 'submit' | 'confirm' | 'cancel'
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ButtonPrimitive } from '@chameleon-ui/primitives-vue'

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'solid',
  size: 'md',
  type: 'button',
})

const classes = computed(() =>
  ['cu-button', `cu-button--${props.variant}`, `cu-button--${props.size}`, props.class]
    .filter(Boolean)
    .join(' '),
)

const dataAiState = computed(() => (props.disabled ? 'disabled' : 'default'))
</script>

<template>
  <ButtonPrimitive
    :class="classes"
    :disabled="disabled"
    :type="type"
    data-ai-role="button"
    :data-ai-state="dataAiState"
    :data-ai-intent="intent"
    :data-variant="variant"
    :data-size="size"
  >
    <slot />
  </ButtonPrimitive>
</template>

<style scoped src="./styles.css"></style>
