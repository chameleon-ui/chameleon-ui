<script lang="ts">
export type ButtonVariant = 'solid' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md'
export type ButtonTone = 'brand' | 'danger'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  tone?: ButtonTone
  disabled?: boolean
  loading?: boolean
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
  tone: 'brand',
  type: 'button',
  loading: false,
  intent: 'submit',
})

const classes = computed(() =>
  [
    'cu-button',
    `cu-button--${props.variant}`,
    `cu-button--${props.size}`,
    `cu-button--tone-${props.tone}`,
    props.loading ? 'cu-button--loading' : '',
    props.class,
  ]
    .filter(Boolean)
    .join(' '),
)

const dataAiState = computed(() => {
  if (props.loading) return 'loading'
  if (props.disabled) return 'disabled'
  return 'default'
})

const isDisabled = computed(() => Boolean(props.disabled || props.loading))
</script>

<template>
  <ButtonPrimitive
    :class="classes"
    :disabled="isDisabled"
    :type="type"
    :aria-busy="loading || undefined"
    data-ai-role="button"
    :data-ai-state="dataAiState"
    :data-ai-intent="intent"
    :data-variant="variant"
    :data-size="size"
    :data-tone="tone"
  >
    <span v-if="loading" aria-hidden="true" class="cu-button__spinner" />
    <span v-else-if="$slots.icon" aria-hidden="true" class="cu-button__icon">
      <slot name="icon" />
    </span>
    <slot />
  </ButtonPrimitive>
</template>

<style scoped src="./styles.css"></style>
