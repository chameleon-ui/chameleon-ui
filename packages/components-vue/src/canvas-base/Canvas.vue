<script lang="ts">
export interface CanvasProps {
  label: string
  initialZoom?: number
  minZoom?: number
  maxZoom?: number
  gridSize?: number
  snapToGrid?: boolean
  showMinimap?: boolean
  class?: string
}
</script>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { clamp, snapToGridValue, type CanvasViewport } from './snap.js'

const props = withDefaults(defineProps<CanvasProps>(), {
  initialZoom: 1,
  minZoom: 0.25,
  maxZoom: 2,
  gridSize: 24,
  snapToGrid: false,
  showMinimap: false,
})
const emit = defineEmits<{ viewportChange: [viewport: CanvasViewport] }>()
const viewport = ref<CanvasViewport>({
  zoom: clamp(props.initialZoom, props.minZoom, props.maxZoom),
  offsetX: 0,
  offsetY: 0,
})
const panning = ref(false)
const gridRef = ref<HTMLCanvasElement | null>(null)
const minimapRef = ref<HTMLCanvasElement | null>(null)
const dragOrigin = ref<{ pointerX: number; pointerY: number; offsetX: number; offsetY: number } | null>(null)
const classes = computed(() => ['cu-canvas', props.class].filter(Boolean).join(' '))
const worldStyle = computed(
  () => `translate(${viewport.value.offsetX}px, ${viewport.value.offsetY}px) scale(${viewport.value.zoom})`,
)

function applyViewport(next: CanvasViewport) {
  const clamped = {
    zoom: clamp(next.zoom, props.minZoom, props.maxZoom),
    offsetX: next.offsetX,
    offsetY: next.offsetY,
  }
  viewport.value = clamped
  emit('viewportChange', clamped)
}

function paintGrid() {
  const element = gridRef.value
  if (!element) return
  let context: CanvasRenderingContext2D | null = null
  try {
    context = element.getContext('2d')
  } catch {
    context = null
  }
  if (!context) return
  const width = element.clientWidth || 800
  const height = element.clientHeight || 600
  if (element.width !== width) element.width = width
  if (element.height !== height) element.height = height
  const styles = getComputedStyle(element)
  const gridColor = styles.getPropertyValue('--cu-color-border-default').trim() || 'gray'
  context.clearRect(0, 0, width, height)
  context.strokeStyle = gridColor
  context.globalAlpha = 0.4
  context.lineWidth = 1
  const step = props.gridSize * viewport.value.zoom
  if (step < 4) return
  const startX = ((viewport.value.offsetX % step) + step) % step
  const startY = ((viewport.value.offsetY % step) + step) % step
  context.beginPath()
  for (let x = startX; x <= width; x += step) {
    context.moveTo(x, 0)
    context.lineTo(x, height)
  }
  for (let y = startY; y <= height; y += step) {
    context.moveTo(0, y)
    context.lineTo(width, y)
  }
  context.stroke()
  context.globalAlpha = 1
}

function paintMinimap() {
  const element = minimapRef.value
  if (!element || !props.showMinimap) return
  let context: CanvasRenderingContext2D | null = null
  try {
    context = element.getContext('2d')
  } catch {
    context = null
  }
  if (!context) return
  const width = element.width
  const height = element.height
  const styles = getComputedStyle(element)
  const frameColor = styles.getPropertyValue('--cu-color-border-default').trim() || 'gray'
  const viewportColor = styles.getPropertyValue('--cu-color-palette-brand').trim() || frameColor
  context.clearRect(0, 0, width, height)
  context.strokeStyle = frameColor
  context.strokeRect(0, 0, width - 1, height - 1)
  const scaleX = width / 4000
  const scaleY = height / 3000
  context.strokeStyle = viewportColor
  context.strokeRect(
    -viewport.value.offsetX * scaleX,
    -viewport.value.offsetY * scaleY,
    800 * scaleX * viewport.value.zoom,
    600 * scaleY * viewport.value.zoom,
  )
}

watch([viewport, () => props.gridSize], paintGrid, { deep: true })
watch([viewport, () => props.showMinimap], paintMinimap, { deep: true })
onMounted(() => {
  paintGrid()
  paintMinimap()
})

function onPointerDown(event: PointerEvent) {
  if ((event.target as HTMLElement).closest('[data-canvas-node]')) return
  dragOrigin.value = {
    pointerX: event.clientX,
    pointerY: event.clientY,
    offsetX: viewport.value.offsetX,
    offsetY: viewport.value.offsetY,
  }
  panning.value = true
}

function onPointerMove(event: PointerEvent) {
  const origin = dragOrigin.value
  if (!origin) return
  applyViewport({
    zoom: viewport.value.zoom,
    offsetX: snapToGridValue(origin.offsetX + (event.clientX - origin.pointerX), props.gridSize, props.snapToGrid),
    offsetY: snapToGridValue(origin.offsetY + (event.clientY - origin.pointerY), props.gridSize, props.snapToGrid),
  })
}

function endPan() {
  dragOrigin.value = null
  panning.value = false
}

function onWheel(event: WheelEvent) {
  const factor = event.deltaY < 0 ? 1.1 : 1 / 1.1
  applyViewport({ ...viewport.value, zoom: viewport.value.zoom * factor })
}

function onKeyDown(event: KeyboardEvent) {
  const panStep = props.gridSize * 4
  if (event.key === 'ArrowLeft') applyViewport({ ...viewport.value, offsetX: viewport.value.offsetX + panStep })
  else if (event.key === 'ArrowRight') applyViewport({ ...viewport.value, offsetX: viewport.value.offsetX - panStep })
  else if (event.key === 'ArrowUp') applyViewport({ ...viewport.value, offsetY: viewport.value.offsetY + panStep })
  else if (event.key === 'ArrowDown') applyViewport({ ...viewport.value, offsetY: viewport.value.offsetY - panStep })
  else if (event.key === '+' || event.key === '=') applyViewport({ ...viewport.value, zoom: viewport.value.zoom * 1.1 })
  else if (event.key === '-') applyViewport({ ...viewport.value, zoom: viewport.value.zoom / 1.1 })
  else return
  event.preventDefault()
}
</script>

<template>
  <div
    :class="classes"
    role="application"
    :aria-label="label"
    :aria-description="'Zoom ' + Math.round(viewport.zoom * 100) + '%'"
    tabindex="0"
    data-ai-role="canvas-base"
    data-ai-intent="pan-canvas"
    :data-ai-state="panning ? 'panning' : 'default'"
    data-backend="canvas-2d"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="endPan"
    @pointerleave="endPan"
    @wheel="onWheel"
    @keydown="onKeyDown"
  >
    <canvas ref="gridRef" class="cu-canvas__grid" width="800" height="600" aria-hidden="true" />
    <div class="cu-canvas__world" :style="{ transform: worldStyle }">
      <slot />
    </div>
    <canvas v-if="showMinimap" ref="minimapRef" class="cu-canvas__minimap" width="160" height="120" aria-hidden="true" />
  </div>
</template>

<style src="./styles.css"></style>
