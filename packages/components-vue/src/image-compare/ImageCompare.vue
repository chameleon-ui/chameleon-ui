<script lang="ts">
import type { CheckerboardContrast } from '../checkerboard-surface/CheckerboardSurface.vue'

export type ImageCompareOrientation = 'horizontal' | 'vertical'

export interface ImageCompareProps {
  beforeSrc: string
  afterSrc: string
  beforeAlt?: string
  afterAlt?: string
  position?: number
  orientation?: ImageCompareOrientation
  showKnob?: boolean
  checkerboard?: boolean
  /** Checker contrast when `checkerboard` is on. Defaults to `strong` for transparent results. */
  checkerboardContrast?: CheckerboardContrast
  label?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CheckerboardSurface } from '../checkerboard-surface/index.js'

const props = withDefaults(defineProps<ImageCompareProps>(), {
  beforeAlt: 'Before',
  afterAlt: 'After',
  position: undefined,
  orientation: 'horizontal',
  showKnob: true,
  checkerboard: true,
  checkerboardContrast: 'strong',
  label: 'Compare before and after',
})

const emit = defineEmits<{
  'update:position': [value: number]
  positionChange: [value: number]
}>()

const rootRef = ref<HTMLDivElement | null>(null)
const uncontrolled = ref(0.5)
const value = computed(() => props.position ?? uncontrolled.value)

function clamp01(next: number) {
  return Math.min(1, Math.max(0, next))
}

function setValue(next: number) {
  const clamped = clamp01(next)
  if (props.position === undefined) uncontrolled.value = clamped
  emit('update:position', clamped)
  emit('positionChange', clamped)
}

function updateFromPointer(event: PointerEvent) {
  const el = rootRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  if (props.orientation === 'vertical') {
    setValue((event.clientY - rect.top) / Math.max(rect.height, 1))
  } else {
    setValue((event.clientX - rect.left) / Math.max(rect.width, 1))
  }
}

function onPointerDown(event: PointerEvent) {
  ;(event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId)
  updateFromPointer(event)
}

function onPointerMove(event: PointerEvent) {
  if (!(event.currentTarget as HTMLDivElement).hasPointerCapture(event.pointerId)) return
  updateFromPointer(event)
}

function onKeyDown(event: KeyboardEvent) {
  const step = event.shiftKey ? 0.1 : 0.02
  if (props.orientation === 'vertical') {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setValue(value.value - step)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setValue(value.value + step)
    }
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    setValue(value.value - step)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    setValue(value.value + step)
  } else if (event.key === 'Home') {
    event.preventDefault()
    setValue(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    setValue(1)
  }
}

const pct = computed(() => `${value.value * 100}%`)
const clip = computed(() =>
  props.orientation === 'vertical' ? `inset(${pct.value} 0 0 0)` : `inset(0 0 0 ${pct.value})`,
)
const dividerStyle = computed(() =>
  props.orientation === 'vertical' ? { insetBlockStart: pct.value } : { insetInlineStart: pct.value },
)
const classes = computed(() =>
  ['cu-image-compare', `cu-image-compare--${props.orientation}`, props.class].filter(Boolean).join(' '),
)
</script>

<template>
  <CheckerboardSurface
    v-if="checkerboard"
    class="cu-image-compare__surface"
    :contrast="checkerboardContrast"
  >
    <div
      ref="rootRef"
      :class="classes"
      data-ai-role="image-compare"
      data-ai-intent="compare-images"
      data-ai-state="default"
      role="slider"
      tabindex="0"
      :aria-label="label"
      :aria-valuemin="0"
      :aria-valuemax="100"
      :aria-valuenow="Math.round(value * 100)"
      :aria-orientation="orientation"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @keydown="onKeyDown"
    >
      <img class="cu-image-compare__img cu-image-compare__img--before" :src="beforeSrc" :alt="beforeAlt" draggable="false" />
      <img
        class="cu-image-compare__img cu-image-compare__img--after"
        :src="afterSrc"
        :alt="afterAlt"
        draggable="false"
        :style="{ clipPath: clip }"
      />
      <div
        class="cu-image-compare__divider"
        :style="dividerStyle"
        :data-show-knob="showKnob ? 'true' : 'false'"
        aria-hidden="true"
      />
    </div>
  </CheckerboardSurface>
  <div
    v-else
    ref="rootRef"
    :class="classes"
    data-ai-role="image-compare"
    data-ai-intent="compare-images"
    data-ai-state="default"
    role="slider"
    tabindex="0"
    :aria-label="label"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="Math.round(value * 100)"
    :aria-orientation="orientation"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @keydown="onKeyDown"
  >
    <img class="cu-image-compare__img cu-image-compare__img--before" :src="beforeSrc" :alt="beforeAlt" draggable="false" />
    <img
      class="cu-image-compare__img cu-image-compare__img--after"
      :src="afterSrc"
      :alt="afterAlt"
      draggable="false"
      :style="{ clipPath: clip }"
    />
    <div
      class="cu-image-compare__divider"
      :style="dividerStyle"
      :data-show-knob="showKnob ? 'true' : 'false'"
      aria-hidden="true"
    />
  </div>
</template>

<style src="./styles.css"></style>
