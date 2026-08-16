<script lang="ts">
import type { CheckerboardContrast } from '../checkerboard-surface/CheckerboardSurface.vue'

export type MaskPaintMode = 'paint' | 'erase'
export type MaskPaintFit = 'contain'

export interface MaskPaintCanvasProps {
  src: string
  /** Default `contain`: whole image visible, centered in the stage. */
  fit?: MaskPaintFit
  mode?: MaskPaintMode
  /** Brush diameter in CSS pixels (screen space). */
  brushSize?: number
  disabled?: boolean
  checkerboard?: boolean
  /** Checker contrast when `checkerboard` is on. Defaults to `strong` for mask editing. */
  checkerboardContrast?: CheckerboardContrast
  /** User zoom relative to contain-fit; 1 = fitted. Controlled when set. */
  zoom?: number
  minZoom?: number
  maxZoom?: number
  /** Wheel to zoom inside the stage (preventDefault; no page-scroll conflict). Default false. */
  wheelZoom?: boolean
  class?: string
}

export interface MaskPaintCanvasHandle {
  exportMask: () => Promise<Blob | null>
  clearMask: () => void
  zoomIn: (step?: number) => void
  zoomOut: (step?: number) => void
  /** Back to contain fit (zoom 1, pan reset). */
  resetZoom: () => void
  setZoom: (zoom: number) => void
  getZoom: () => number
}
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<MaskPaintCanvasProps>(), {
  fit: 'contain',
  mode: 'paint',
  brushSize: 34,
  disabled: false,
  checkerboard: true,
  checkerboardContrast: 'strong',
  zoom: undefined,
  minZoom: 1,
  maxZoom: 8,
  wheelZoom: false,
})

const emit = defineEmits<{
  readyChange: [ready: boolean]
  zoomChange: [zoom: number]
}>()

const BRUSH_SCREEN_MIN = 10
const ZOOM_STEP = 1.25
const rootRef = ref<HTMLDivElement | null>(null)
const stageRef = ref<HTMLDivElement | null>(null)
const imageCanvasRef = ref<HTMLCanvasElement | null>(null)
const maskCanvasRef = ref<HTMLCanvasElement | null>(null)
const paintCanvasRef = ref<HTMLCanvasElement | null>(null)
const brushCursorRef = ref<HTMLDivElement | null>(null)
const naturalRef = { w: 0, h: 0 }
const drawing = { current: false }
const last = { current: null as { x: number; y: number } | null }
const pressureRef = { current: 0.5 }
const modeRef = { current: props.mode as MaskPaintMode }
const brushImageRef = { current: 28 }
const hasPaintRef = { current: false }
const canvasRectRef = { current: null as DOMRect | null }
const paintColorRef = { current: 'rgba(23, 23, 23, 0.45)' }
const scaleFitRef = { current: 1 }
const panStart = { current: null as { px: number; py: number; x: number; y: number } | null }
const hoverRef = { current: false }
const displaySize = ref({ w: 0, h: 0 })
const hasPaint = ref(false)
const innerZoom = ref(1)
const pan = ref({ x: 0, y: 0 })
const panning = ref(false)
const spaceDown = ref(false)

watch(
  () => props.mode,
  (v) => {
    modeRef.current = v
  },
)

function clampZoomValue(z: number) {
  return Math.min(props.maxZoom, Math.max(props.minZoom, z))
}

const currentZoom = computed(() => clampZoomValue(props.zoom ?? innerZoom.value))

function resolveAccentPaint(el: HTMLElement | null): string {
  if (!el || typeof getComputedStyle === 'undefined') {
    return 'rgba(23, 23, 23, 0.45)'
  }
  const probe = document.createElement('span')
  probe.style.cssText =
    'position:absolute;inline-size:0;block-size:0;overflow:hidden;color:var(--cu-color-accent-default,var(--cu-color-palette-brand))'
  el.appendChild(probe)
  const rgb = getComputedStyle(probe).color
  el.removeChild(probe)
  const match = rgb.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (!match) return 'rgba(23, 23, 23, 0.45)'
  return `rgba(${match[1]}, ${match[2]}, ${match[3]}, 0.45)`
}

function markHasPaint(next: boolean) {
  if (hasPaintRef.current === next) return
  hasPaintRef.current = next
  hasPaint.value = next
  emit('readyChange', next)
}

function clampPanValues(x: number, y: number, cssW: number, cssH: number, stageW: number, stageH: number) {
  // Centered overflow: each side may reveal at most (cssW - stageW) / 2.
  const maxX = Math.max(0, (cssW - stageW) / 2)
  const maxY = Math.max(0, (cssH - stageH) / 2)
  return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) }
}

function fitCanvases() {
  const stage = stageRef.value
  const { w, h } = naturalRef
  if (!stage || !w || !h) return
  const pad = 16
  // Never invent a box larger than the stage — that crops contain-fit.
  const maxW = Math.max(1, stage.clientWidth - pad)
  const maxH = Math.max(1, stage.clientHeight - pad)
  if (stage.clientWidth <= 0 || stage.clientHeight <= 0) return
  const scaleFit = Math.min(maxW / w, maxH / h, 1)
  scaleFitRef.current = scaleFit
  const zoom = currentZoom.value
  const cssW = Math.max(1, Math.round(w * scaleFit * zoom))
  const cssH = Math.max(1, Math.round(h * scaleFit * zoom))
  if (displaySize.value.w !== cssW || displaySize.value.h !== cssH) {
    displaySize.value = { w: cssW, h: cssH }
  }
  const clamped = clampPanValues(pan.value.x, pan.value.y, cssW, cssH, stage.clientWidth, stage.clientHeight)
  if (clamped.x !== pan.value.x || clamped.y !== pan.value.y) pan.value = clamped
  canvasRectRef.current = paintCanvasRef.value?.getBoundingClientRect() ?? null
  const scale = cssW / w
  brushImageRef.current = Math.max(1, props.brushSize / Math.max(scale, 0.0001))
  paintColorRef.current = resolveAccentPaint(rootRef.value)
}

function applyZoom(nextRaw: number, anchor?: { x: number; y: number }) {
  const prev = currentZoom.value
  const next = clampZoomValue(nextRaw)
  if (next === prev) return
  const stage = stageRef.value
  if (anchor && stage && prev > 0) {
    // Keep the stage-space anchor point stable across the zoom change.
    const k = next / prev
    const cx = stage.clientWidth / 2
    const cy = stage.clientHeight / 2
    const vx = anchor.x - cx - pan.value.x
    const vy = anchor.y - cy - pan.value.y
    pan.value = { x: anchor.x - cx - vx * k, y: anchor.y - cy - vy * k }
  }
  if (props.zoom === undefined) innerZoom.value = next
  emit('zoomChange', next)
  fitCanvases()
}

function zoomIn(step: number = ZOOM_STEP) {
  applyZoom(currentZoom.value * step)
}

function zoomOut(step: number = ZOOM_STEP) {
  applyZoom(currentZoom.value / step)
}

function resetZoom() {
  pan.value = { x: 0, y: 0 }
  applyZoom(1)
}

function setZoom(zoom: number) {
  applyZoom(zoom)
}

function getZoom() {
  return currentZoom.value
}

function loadImage(url: string) {
  const img = new Image()
  img.onload = () => {
    const w = img.naturalWidth
    const h = img.naturalHeight
    naturalRef.w = w
    naturalRef.h = h
    markHasPaint(false)
    displaySize.value = { w: 0, h: 0 }
    pan.value = { x: 0, y: 0 }
    if (props.zoom === undefined && innerZoom.value !== 1) {
      innerZoom.value = 1
      emit('zoomChange', 1)
    }
    for (const canvas of [imageCanvasRef.value, maskCanvasRef.value, paintCanvasRef.value]) {
      if (!canvas) continue
      canvas.width = w
      canvas.height = h
    }
    const imageCtx = imageCanvasRef.value?.getContext('2d')
    const maskCtx = maskCanvasRef.value?.getContext('2d')
    const paintCtx = paintCanvasRef.value?.getContext('2d')
    if (!imageCtx || !maskCtx || !paintCtx) return
    imageCtx.clearRect(0, 0, w, h)
    imageCtx.drawImage(img, 0, 0)
    maskCtx.fillStyle = '#000'
    maskCtx.fillRect(0, 0, w, h)
    paintCtx.clearRect(0, 0, w, h)
    fitCanvases()
    requestAnimationFrame(() => {
      fitCanvases()
      requestAnimationFrame(fitCanvases)
    })
  }
  img.src = url
}

watch(
  () => props.src,
  (url) => {
    void nextTick(() => loadImage(url))
  },
  { immediate: true },
)

watch(
  () => props.brushSize,
  () => fitCanvases(),
)

watch(
  () => [props.zoom, props.minZoom, props.maxZoom],
  () => fitCanvases(),
)

let ro: ResizeObserver | null = null
const onResize = () => fitCanvases()

function isEditableTarget(t: EventTarget | null) {
  const el = t as HTMLElement | null
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
}

function onKeyDown(e: KeyboardEvent) {
  if (e.code !== 'Space' || isEditableTarget(e.target)) return
  // Avoid page scroll when Space would pan the zoomed stage under the pointer.
  if (hoverRef.current) e.preventDefault()
  spaceDown.value = true
}

function onKeyUp(e: KeyboardEvent) {
  if (e.code === 'Space') spaceDown.value = false
}

function onWheel(e: WheelEvent) {
  if (!props.wheelZoom || props.disabled) return
  e.preventDefault()
  const stage = stageRef.value
  if (!stage) return
  const rect = stage.getBoundingClientRect()
  const anchor = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  applyZoom(currentZoom.value * Math.exp(-e.deltaY * 0.002), anchor)
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  stageRef.value?.addEventListener('wheel', onWheel, { passive: false })
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(onResize)
    if (rootRef.value) ro.observe(rootRef.value)
    if (stageRef.value) ro.observe(stageRef.value)
  }
  fitCanvases()
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  stageRef.value?.removeEventListener('wheel', onWheel)
  ro?.disconnect()
})

function pointerPos(e: PointerEvent) {
  const canvas = paintCanvasRef.value!
  const rect = canvasRectRef.current ?? canvas.getBoundingClientRect()
  return {
    x: ((e.clientX - rect.left) / rect.width) * canvas.width,
    y: ((e.clientY - rect.top) / rect.height) * canvas.height,
  }
}

function pressureFactor(e: PointerEvent) {
  if (e.pointerType === 'mouse' || !e.pressure || e.pressure <= 0) return 1
  return Math.min(1, Math.max(0.35, e.pressure))
}

function maskStillHasPaint() {
  const canvas = maskCanvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return false
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < data.length; i += 16) {
    if (data[i]! > 127) return true
  }
  return false
}

function stroke(from: { x: number; y: number }, to: { x: number; y: number }, widthImage: number) {
  const maskCtx = maskCanvasRef.value?.getContext('2d')
  const paintCtx = paintCanvasRef.value?.getContext('2d')
  if (!maskCtx || !paintCtx) return
  const paintMode = modeRef.current
  const width = Math.max(1, widthImage)
  for (const ctx of [maskCtx, paintCtx]) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = width
  }
  maskCtx.strokeStyle = paintMode === 'paint' ? '#ffffff' : '#000000'
  maskCtx.beginPath()
  maskCtx.moveTo(from.x, from.y)
  maskCtx.lineTo(to.x, to.y)
  maskCtx.stroke()
  paintCtx.globalCompositeOperation = paintMode === 'paint' ? 'source-over' : 'destination-out'
  paintCtx.strokeStyle = paintColorRef.current
  paintCtx.beginPath()
  paintCtx.moveTo(from.x, from.y)
  paintCtx.lineTo(to.x, to.y)
  paintCtx.stroke()
  paintCtx.globalCompositeOperation = 'source-over'
  if (paintMode === 'paint') markHasPaint(true)
}

function showBrushCursor(x: number, y: number) {
  const el = brushCursorRef.value
  if (!el) return
  const r = cursorDiameter.value / 2
  el.style.transform = `translate(${x - r}px, ${y - r}px)`
  el.style.opacity = '1'
}

function hideBrushCursor() {
  const el = brushCursorRef.value
  if (!el) return
  el.style.opacity = '0'
}

function updateCursor(e: PointerEvent) {
  const canvas = paintCanvasRef.value
  if (!canvas) return
  const rect = canvasRectRef.current ?? canvas.getBoundingClientRect()
  showBrushCursor(e.clientX - rect.left, e.clientY - rect.top)
}

function wantsPan(e: PointerEvent) {
  return e.button === 1 || (e.button === 0 && spaceDown.value)
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return
  const target = e.currentTarget as HTMLCanvasElement
  canvasRectRef.current = target.getBoundingClientRect()
  if (wantsPan(e)) {
    e.preventDefault()
    target.setPointerCapture(e.pointerId)
    panStart.current = { px: e.clientX, py: e.clientY, x: pan.value.x, y: pan.value.y }
    panning.value = true
    hideBrushCursor()
    return
  }
  if (e.pointerType === 'mouse' && e.button !== 0) return
  target.setPointerCapture(e.pointerId)
  drawing.current = true
  pressureRef.current = pressureFactor(e)
  updateCursor(e)
  const p = pointerPos(e)
  last.current = p
  stroke(p, p, brushImageRef.current * pressureRef.current)
}

function onPointerMove(e: PointerEvent) {
  if (panning.value && panStart.current) {
    const stage = stageRef.value
    const s = panStart.current
    if (stage) {
      pan.value = clampPanValues(
        s.x + (e.clientX - s.px),
        s.y + (e.clientY - s.py),
        displaySize.value.w,
        displaySize.value.h,
        stage.clientWidth,
        stage.clientHeight,
      )
      canvasRectRef.current = paintCanvasRef.value?.getBoundingClientRect() ?? null
    }
    return
  }
  updateCursor(e)
  if (!drawing.current || props.disabled) return
  pressureRef.current = pressureFactor(e)
  const p = pointerPos(e)
  if (last.current) stroke(last.current, p, brushImageRef.current * pressureRef.current)
  last.current = p
}

function onPointerUp() {
  if (panning.value) {
    panning.value = false
    panStart.current = null
  }
  drawing.current = false
  last.current = null
  if (modeRef.current === 'erase') markHasPaint(maskStillHasPaint())
}

function onPointerLeave() {
  hoverRef.current = false
  if (!drawing.current && !panning.value) hideBrushCursor()
}

function onPointerEnter(e: PointerEvent) {
  hoverRef.current = true
  canvasRectRef.current = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect()
  updateCursor(e)
}

function clearMask() {
  const mask = maskCanvasRef.value
  const paint = paintCanvasRef.value
  if (!mask || !paint) return
  const maskCtx = mask.getContext('2d')!
  const paintCtx = paint.getContext('2d')!
  maskCtx.fillStyle = '#000'
  maskCtx.fillRect(0, 0, mask.width, mask.height)
  paintCtx.clearRect(0, 0, paint.width, paint.height)
  markHasPaint(false)
}

async function exportMask(): Promise<Blob | null> {
  const mask = maskCanvasRef.value
  if (!mask || !hasPaintRef.current) return null
  return new Promise((resolve) => mask.toBlob((blob) => resolve(blob), 'image/png'))
}

const cursorDiameter = computed(() => Math.max(BRUSH_SCREEN_MIN, props.brushSize))
const state = computed(() => (props.disabled ? 'disabled' : hasPaint.value ? 'ready' : 'default'))
const dataZoom = computed(() => String(Math.round(currentZoom.value * 100) / 100))
const stageClass = computed(() =>
  [
    'cu-mask-paint-canvas__stage',
    'cu-mask-paint-canvas__surface',
    panning.value ? 'is-panning' : '',
    spaceDown.value ? 'is-pan-mode' : '',
    props.class,
  ]
    .filter(Boolean)
    .join(' '),
)

const fittedStyle = computed(() => ({
  width: displaySize.value.w ? `${displaySize.value.w}px` : undefined,
  height: displaySize.value.h ? `${displaySize.value.h}px` : undefined,
  visibility: (displaySize.value.w > 0 ? 'visible' : 'hidden') as 'visible' | 'hidden',
  // Translation only — never scale(): keeps the brush ring screen-space and the
  // getBoundingClientRect pointer → natural-pixel mapping exact under zoom + pan.
  transform:
    pan.value.x || pan.value.y ? `translate(${pan.value.x}px, ${pan.value.y}px)` : undefined,
}))

defineExpose({ exportMask, clearMask, zoomIn, zoomOut, resetZoom, setZoom, getZoom })
</script>

<template>
  <div
    ref="rootRef"
    class="cu-mask-paint-canvas"
    data-ai-role="mask-paint-canvas"
    data-ai-intent="paint-mask"
    :data-ai-state="state"
    :data-mode="mode"
    :data-fit="fit"
    :data-zoom="dataZoom"
  >
    <div ref="stageRef" :class="stageClass">
      <div
        :class="
          checkerboard
            ? 'cu-checkerboard-surface cu-mask-paint-canvas__checker'
            : 'cu-mask-paint-canvas__stack-host'
        "
        :data-ai-role="checkerboard ? 'checkerboard-surface' : undefined"
        :data-ai-intent="checkerboard ? 'show-transparency' : undefined"
        :data-ai-state="checkerboard ? 'default' : undefined"
        :data-cell-size="checkerboard ? 'md' : undefined"
        :data-contrast="checkerboard ? checkerboardContrast : undefined"
        :style="fittedStyle"
      >
        <div class="cu-mask-paint-canvas__stack">
          <canvas ref="imageCanvasRef" class="cu-mask-paint-canvas__layer" />
          <canvas
            ref="paintCanvasRef"
            class="cu-mask-paint-canvas__layer cu-mask-paint-canvas__hit"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @pointerleave="onPointerLeave"
            @pointerenter="onPointerEnter"
          />
          <canvas ref="maskCanvasRef" class="cu-mask-paint-canvas__mask" aria-hidden="true" />
          <div
            ref="brushCursorRef"
            class="cu-mask-paint-canvas__brush"
            :class="{ 'is-erase': mode === 'erase' }"
            :style="{ width: cursorDiameter + 'px', height: cursorDiameter + 'px', opacity: 0 }"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style src="../checkerboard-surface/styles.css"></style>
<style src="./styles.css"></style>
