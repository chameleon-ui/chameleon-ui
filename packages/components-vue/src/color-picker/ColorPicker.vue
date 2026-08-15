<script lang="ts">
export interface ColorPickerProps {
  value: string
  swatches?: string[]
  label: string
  hexLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { DEFAULT_SWATCHES, normalizeHex } from './normalize.js'

const props = withDefaults(defineProps<ColorPickerProps>(), { hexLabel: 'Hex value' })
const emit = defineEmits<{ change: [value: string] }>()
const draft = ref(props.value)
const invalidHex = ref(false)
const classes = computed(() => ['cu-color-picker', props.class].filter(Boolean).join(' '))
const palette = computed(() => props.swatches ?? DEFAULT_SWATCHES)

watch(
  () => props.value,
  (next) => {
    draft.value = next
  },
)

function commitHex() {
  const normalized = normalizeHex(draft.value)
  if (normalized) {
    invalidHex.value = false
    emit('change', normalized)
  } else {
    invalidHex.value = true
  }
}

function pick(swatch: string) {
  draft.value = swatch
  emit('change', swatch)
}
</script>

<template>
  <div :class="classes" data-ai-role="color-picker" data-ai-intent="choose-option" data-ai-state="default">
    <div class="cu-color-picker__swatches" role="listbox" :aria-label="label">
      <button
        v-for="swatch in palette"
        :key="swatch"
        type="button"
        :class="'cu-color-picker__swatch' + (normalizeHex(value) === swatch ? ' cu-color-picker__swatch--selected' : '')"
        role="option"
        :aria-selected="normalizeHex(value) === swatch"
        :aria-label="swatch"
        :style="{ background: swatch }"
        @click="pick(swatch)"
      />
    </div>
    <label class="cu-color-picker__hex">
      <span class="cu-color-picker__hex-label">{{ hexLabel }}</span>
      <input
        class="cu-color-picker__input"
        type="text"
        :value="draft"
        :aria-invalid="invalidHex"
        @input="draft = ($event.target as HTMLInputElement).value; invalidHex = false"
        @blur="commitHex"
        @keydown.enter="commitHex"
      />
    </label>
  </div>
</template>

<style scoped src="./styles.css"></style>
