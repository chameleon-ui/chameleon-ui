<script lang="ts">
export type ButtonGroupOrientation = 'horizontal' | 'vertical'
/** `attached` = segmented / shared border; `spaced` = token gap between buttons. */
export type ButtonGroupVariant = 'attached' | 'spaced'
export type ButtonGroupSize = 'sm' | 'md'

export interface ButtonGroupProps {
  orientation?: ButtonGroupOrientation
  variant?: ButtonGroupVariant
  size?: ButtonGroupSize
  label?: string
  disabled?: boolean
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  orientation: 'horizontal',
  variant: 'attached',
  size: 'md',
  disabled: false,
})

const classes = computed(() =>
  [
    'cu-button-group',
    `cu-button-group--${props.orientation}`,
    `cu-button-group--${props.variant}`,
    `cu-button-group--${props.size}`,
    props.class,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div
    :class="classes"
    role="group"
    :aria-label="label"
    :aria-disabled="disabled || undefined"
    :data-orientation="orientation"
    :data-variant="variant"
    :data-size="size"
    :data-disabled="disabled ? 'true' : 'false'"
    data-ai-role="button-group"
    data-ai-intent="select-single"
    :data-ai-state="disabled ? 'disabled' : 'default'"
  >
    <slot />
  </div>
</template>

<style src="./styles.css"></style>
