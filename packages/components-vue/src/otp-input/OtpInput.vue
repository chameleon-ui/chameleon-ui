<script lang="ts">
export interface OtpInputProps {
  value: string
  length?: number
  label: string
  digitLabel?: string
  disabled?: boolean
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<OtpInputProps>(), { length: 6, digitLabel: 'Digit', disabled: false })
const emit = defineEmits<{ change: [value: string] }>()
const cells = ref<(HTMLInputElement | null)[]>([])
const classes = computed(() => ['cu-otp-input', props.class].filter(Boolean).join(' '))
const indexFormat = new Intl.NumberFormat(undefined)
const digits = computed(() => Array.from({ length: props.length }, (_, index) => index))
const aiState = computed(() => (props.disabled ? 'disabled' : props.value.length >= props.length ? 'complete' : 'default'))

function focusCell(index: number) {
  const clamped = Math.max(0, Math.min(props.length - 1, index))
  cells.value[clamped]?.focus()
}

function writeDigit(index: number, digit: string) {
  emit('change', (props.value.slice(0, index) + digit + props.value.slice(index + 1)).slice(0, props.length))
}

function onCellChange(index: number, event: Event) {
  const digit = (event.currentTarget as HTMLInputElement).value.slice(-1)
  if (!/^[0-9]$/.test(digit)) return
  writeDigit(index, digit)
  if (index < props.length - 1) focusCell(index + 1)
}

function onCellKeyDown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    event.preventDefault()
    if (props.value[index]) writeDigit(index, '')
    else {
      writeDigit(index - 1, '')
      focusCell(index - 1)
    }
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusCell(index - 1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusCell(index + 1)
  }
}

function onPaste(event: ClipboardEvent) {
  const next = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, props.length) ?? ''
  if (next.length === 0) return
  event.preventDefault()
  emit('change', next)
  focusCell(Math.min(next.length, props.length - 1))
}

function setCell(el: Element | null, index: number) {
  cells.value[index] = el as HTMLInputElement | null
}
</script>

<template>
  <div :class="classes" role="group" :aria-label="label" data-ai-role="otp-input" data-ai-intent="enter-text" :data-ai-state="aiState" @paste="onPaste">
    <input
      v-for="index in digits"
      :key="index"
      :ref="(el) => setCell(el as Element | null, index)"
      class="cu-otp-input__cell"
      type="text"
      inputmode="numeric"
      :autocomplete="index === 0 ? 'one-time-code' : 'off'"
      :aria-label="digitLabel + ' ' + indexFormat.format(index + 1)"
      :value="value[index] ?? ''"
      :disabled="disabled"
      @input="onCellChange(index, $event)"
      @keydown="onCellKeyDown(index, $event)"
    />
  </div>
</template>

<style scoped src="./styles.css"></style>
