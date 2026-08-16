import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './styles.css'

export interface CanvasViewport {
  zoom: number
  offsetX: number
  offsetY: number
}

export interface CanvasProps {
  children?: ReactNode
  label: string
  initialZoom?: number
  minZoom?: number
  maxZoom?: number
  gridSize?: number
  snapToGrid?: boolean
  showMinimap?: boolean
  onViewportChange?: (viewport: CanvasViewport) => void
  className?: string
}

/** Snaps a world coordinate to the nearest grid intersection when enabled. */
export function snapToGridValue(value: number, gridSize: number, enabled: boolean) {
  if (!enabled || gridSize <= 0) return value
  return Math.round(value / gridSize) * gridSize
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function Canvas({
  children,
  label,
  initialZoom = 1,
  minZoom = 0.25,
  maxZoom = 2,
  gridSize = 24,
  snapToGrid = false,
  showMinimap = false,
  onViewportChange,
  className,
}: CanvasProps) {
  const [viewport, setViewport] = useState<CanvasViewport>({ zoom: clamp(initialZoom, minZoom, maxZoom), offsetX: 0, offsetY: 0 })
  const [panning, setPanning] = useState(false)
  const gridRef = useRef<HTMLCanvasElement>(null)
  const minimapRef = useRef<HTMLCanvasElement>(null)
  const dragOrigin = useRef<{ pointerX: number; pointerY: number; offsetX: number; offsetY: number } | null>(null)
  const classes = ['cu-canvas', className].filter(Boolean).join(' ')

  const applyViewport = (next: CanvasViewport) => {
    const clamped = { zoom: clamp(next.zoom, minZoom, maxZoom), offsetX: next.offsetX, offsetY: next.offsetY }
    setViewport(clamped)
    onViewportChange?.(clamped)
  }

  // Canvas 2D grid backend: draws the world grid; degrades to a plain surface when 2D is unavailable (e.g. jsdom).
  useEffect(() => {
    const element = gridRef.current
    if (!element) return
    let context: CanvasRenderingContext2D | null = null
    try {
      context = element.getContext('2d')
    } catch {
      context = null
    }
    if (!context) return
    const width = (element.clientWidth || 800)
    const height = (element.clientHeight || 600)
    if (element.width !== width) element.width = width
    if (element.height !== height) element.height = height
    const styles = getComputedStyle(element)
    const gridColor = styles.getPropertyValue('--cu-color-border-default').trim() || 'gray'
    context.clearRect(0, 0, width, height)
    context.strokeStyle = gridColor
    context.globalAlpha = 0.4
    context.lineWidth = 1
    const step = gridSize * viewport.zoom
    if (step < 4) return
    const startX = ((viewport.offsetX % step) + step) % step
    const startY = ((viewport.offsetY % step) + step) % step
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
  }, [viewport, gridSize])

  useEffect(() => {
    const element = minimapRef.current
    if (!element || !showMinimap) return
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
    // Viewport indicator: the visible world window mapped into minimap scale.
    const scaleX = width / 4000
    const scaleY = height / 3000
    context.strokeStyle = viewportColor
    context.strokeRect(-viewport.offsetX * scaleX, -viewport.offsetY * scaleY, 800 * scaleX * viewport.zoom, 600 * scaleY * viewport.zoom)
  }, [viewport, showMinimap])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('[data-canvas-node]')) return
    dragOrigin.current = { pointerX: event.clientX, pointerY: event.clientY, offsetX: viewport.offsetX, offsetY: viewport.offsetY }
    setPanning(true)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const origin = dragOrigin.current
    if (!origin) return
    const nextX = origin.offsetX + (event.clientX - origin.pointerX)
    const nextY = origin.offsetY + (event.clientY - origin.pointerY)
    applyViewport({
      zoom: viewport.zoom,
      offsetX: snapToGridValue(nextX, gridSize, snapToGrid),
      offsetY: snapToGridValue(nextY, gridSize, snapToGrid),
    })
  }

  const endPan = () => {
    dragOrigin.current = null
    setPanning(false)
  }

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const factor = event.deltaY < 0 ? 1.1 : 1 / 1.1
    applyViewport({ ...viewport, zoom: viewport.zoom * factor })
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const panStep = gridSize * 4
    if (event.key === 'ArrowLeft') applyViewport({ ...viewport, offsetX: viewport.offsetX + panStep })
    else if (event.key === 'ArrowRight') applyViewport({ ...viewport, offsetX: viewport.offsetX - panStep })
    else if (event.key === 'ArrowUp') applyViewport({ ...viewport, offsetY: viewport.offsetY + panStep })
    else if (event.key === 'ArrowDown') applyViewport({ ...viewport, offsetY: viewport.offsetY - panStep })
    else if (event.key === '+' || event.key === '=') applyViewport({ ...viewport, zoom: viewport.zoom * 1.1 })
    else if (event.key === '-') applyViewport({ ...viewport, zoom: viewport.zoom / 1.1 })
    else return
    event.preventDefault()
  }

  return (
    <div
      className={classes}
      role="application"
      aria-label={label}
      aria-description={`Zoom ${Math.round(viewport.zoom * 100)}%`}
      tabIndex={0}
      data-ai-role="canvas-base" data-ai-intent="pan-canvas"
      data-ai-state={panning ? 'panning' : 'default'}
      data-backend="canvas-2d"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPan}
      onPointerLeave={endPan}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
    >
      <canvas ref={gridRef} className="cu-canvas__grid" width={800} height={600} aria-hidden="true" />
      <div
        className="cu-canvas__world"
        style={{ transform: `translate(${viewport.offsetX}px, ${viewport.offsetY}px) scale(${viewport.zoom})` }}
      >
        {children}
      </div>
      {showMinimap ? <canvas ref={minimapRef} className="cu-canvas__minimap" width={160} height={120} aria-hidden="true" /> : null}
    </div>
  )
}
