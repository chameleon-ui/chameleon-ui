<script setup lang="ts">
import { computed } from 'vue'
import { isRange, type SliderProps } from './slider-logic'

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
})

const emit = defineEmits<{
  change: [value: SliderProps['value']]
}>()

const range = computed(() => isRange(props.value))
const classes = computed(() =>
  ['cu-slider', props.disabled ? 'cu-slider--disabled' : '', props.class].filter(Boolean).join(' '),
)
const aiState = computed(() => (props.disabled ? 'disabled' : range.value ? 'range' : 'default'))

function markStyle(mark: number) {
  return {
    insetInlineStart: `${((mark - props.min) / Math.max(props.max - props.min, 1)) * 100}%`,
  }
}

function onSingle(event: Event) {
  emit('change', Number((event.currentTarget as HTMLInputElement).value))
}

function onMin(event: Event) {
  if (!isRange(props.value)) return
  emit('change', [Number((event.currentTarget as HTMLInputElement).value), props.value[1]])
}

function onMax(event: Event) {
  if (!isRange(props.value)) return
  emit('change', [props.value[0], Number((event.currentTarget as HTMLInputElement).value)])
}
</script>

<template>
  <div :class="classes" data-ai-role="slider" :data-ai-state="aiState" data-ai-intent="adjust-value">
    <label v-if="label" class="cu-slider__label">{{ label }}</label>
    <div v-if="range && Array.isArray(value)" class="cu-slider__inputs">
      <input
        :aria-label="label ? `${label} minimum` : 'Minimum'"
        class="cu-slider__input"
        :disabled="disabled"
        :max="value[1]"
        :min="min"
        :step="step"
        type="range"
        :value="value[0]"
        @input="onMin"
      />
      <input
        :aria-label="label ? `${label} maximum` : 'Maximum'"
        class="cu-slider__input"
        :disabled="disabled"
        :max="max"
        :min="value[0]"
        :step="step"
        type="range"
        :value="value[1]"
        @input="onMax"
      />
    </div>
    <input
      v-else
      :aria-label="label"
      class="cu-slider__input"
      :disabled="disabled"
      :max="max"
      :min="min"
      :step="step"
      type="range"
      :value="value"
      @input="onSingle"
    />
    <div v-if="marks && marks.length > 0" class="cu-slider__marks">
      <span v-for="mark in marks" :key="mark" class="cu-slider__mark" :style="markStyle(mark)">{{ mark }}</span>
    </div>
  </div>
</template>

<style src="./styles.css"></style>
