import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  CheckerboardSurface,
  type CheckerboardContrast,
} from '../checkerboard-surface/CheckerboardSurface.js'
import './styles.css'

export type MaskPaintMode = 'paint' | 'erase'
export type MaskPaintFit = 'contain'

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
  onReadyChange?: (ready: boolean) => void
  onZoomChange?: (zoom: number) => void
  className?: string
}

const BRUSH_SCREEN_MIN = 10
const ZOOM_STEP = 1.25

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

function clampPanValues(x: number, y: number, cssW: number, cssH: number, stageW: number, stageH: number) {
  // Centered overflow: each side may reveal at most (cssW - stageW) / 2.
  const maxX = Math.max(0, (cssW - stageW) / 2)
  const maxY = Math.max(0, (cssH - stageH) / 2)
  return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) }
}

function isEditableTarget(t: EventTarget | null) {
  const el = t as HTMLElement | null
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
}

export const MaskPaintCanvas = forwardRef<MaskPaintCanvasHandle, MaskPaintCanvasProps>(
  function MaskPaintCanvas(
    {
      src,
      fit = 'contain',
      mode = 'paint',
      brushSize = 34,
      disabled = false,
      checkerboard = true,
      checkerboardContrast = 'strong',
      zoom: zoomProp,
      minZoom = 1,
      maxZoom = 8,
      wheelZoom = false,
      onReadyChange,
      onZoomChange,
      className,
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const imageCanvasRef = useRef<HTMLCanvasElement>(null)
    const paintCanvasRef = useRef<HTMLCanvasElement>(null)
    const maskCanvasRef = useRef<HTMLCanvasElement>(null)
    const brushCursorRef = useRef<HTMLDivElement>(null)
    const naturalRef = useRef({ w: 0, h: 0 })
    const drawingRef = useRef(false)
    const lastRef = useRef<{ x: number; y: number } | null>(null)
    const pressureRef = useRef(0.5)
    const modeRef = useRef(mode)
    const brushImageRef = useRef(28)
    const hasPaintRef = useRef(false)
    const canvasRectRef = useRef<DOMRect | null>(null)
    const paintColorRef = useRef('rgba(23, 23, 23, 0.45)')
    const scaleFitRef = useRef(1)
    const panStartRef = useRef<{ px: number; py: number; x: number; y: number } | null>(null)
    const hoverRef = useRef(false)
    const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 })
    const [hasPaint, setHasPaint] = useState(false)
    const [innerZoom, setInnerZoom] = useState(1)
    const [pan, setPanState] = useState({ x: 0, y: 0 })
    const [panning, setPanning] = useState(false)
    const [spaceDown, setSpaceDown] = useState(false)
    const panRef = useRef(pan)

    const clampZoomValue = useCallback(
      (z: number) => Math.min(maxZoom, Math.max(minZoom, z)),
      [minZoom, maxZoom],
    )
    const zoom = clampZoomValue(zoomProp ?? innerZoom)
    const zoomRef = useRef(zoom)
    zoomRef.current = zoom
    const onZoomChangeRef = useRef(onZoomChange)
    onZoomChangeRef.current = onZoomChange
    modeRef.current = mode
    void fit

    const setPan = useCallback((next: { x: number; y: number }) => {
      panRef.current = next
      setPanState(next)
    }, [])

    const markHasPaint = useCallback(
      (next: boolean) => {
        if (hasPaintRef.current === next) return
        hasPaintRef.current = next
        setHasPaint(next)
        onReadyChange?.(next)
      },
      [onReadyChange],
    )

    const fitCanvases = useCallback(() => {
      const stage = stageRef.current
      const { w, h } = naturalRef.current
      if (!stage || !w || !h) return
      const pad = 16
      // Never invent a box larger than the stage — that crops contain-fit.
      const maxW = Math.max(1, stage.clientWidth - pad)
      const maxH = Math.max(1, stage.clientHeight - pad)
      if (stage.clientWidth <= 0 || stage.clientHeight <= 0) return
      const scaleFit = Math.min(maxW / w, maxH / h, 1)
      scaleFitRef.current = scaleFit
      const z = zoomRef.current
      const cssW = Math.max(1, Math.round(w * scaleFit * z))
      const cssH = Math.max(1, Math.round(h * scaleFit * z))
      setDisplaySize((prev) => (prev.w === cssW && prev.h === cssH ? prev : { w: cssW, h: cssH }))
      const clamped = clampPanValues(
        panRef.current.x,
        panRef.current.y,
        cssW,
        cssH,
        stage.clientWidth,
        stage.clientHeight,
      )
      if (clamped.x !== panRef.current.x || clamped.y !== panRef.current.y) setPan(clamped)
      canvasRectRef.current = paintCanvasRef.current?.getBoundingClientRect() ?? null
      const scale = cssW / w
      brushImageRef.current = Math.max(1, brushSize / Math.max(scale, 0.0001))
      paintColorRef.current = resolveAccentPaint(rootRef.current)
    }, [brushSize, setPan])

    const applyZoom = useCallback(
      (nextRaw: number, anchor?: { x: number; y: number }) => {
        const prev = zoomRef.current
        const next = clampZoomValue(nextRaw)
        if (next === prev) return
        const stage = stageRef.current
        if (anchor && stage && prev > 0) {
          // Keep the stage-space anchor point stable across the zoom change.
          const k = next / prev
          const cx = stage.clientWidth / 2
          const cy = stage.clientHeight / 2
          const vx = anchor.x - cx - panRef.current.x
          const vy = anchor.y - cy - panRef.current.y
          setPan({ x: anchor.x - cx - vx * k, y: anchor.y - cy - vy * k })
        }
        if (zoomProp === undefined) {
          setInnerZoom(next)
          // Uncontrolled: re-fit immediately. Controlled mode waits for the
          // parent to pass the new `zoom` prop back (zoom effect re-fits).
          zoomRef.current = next
          fitCanvases()
        }
        onZoomChangeRef.current?.(next)
      },
      [clampZoomValue, fitCanvases, setPan, zoomProp],
    )
    const applyZoomRef = useRef(applyZoom)
    applyZoomRef.current = applyZoom

    const zoomIn = useCallback((step: number = ZOOM_STEP) => {
      applyZoomRef.current(zoomRef.current * step)
    }, [])
    const zoomOut = useCallback((step: number = ZOOM_STEP) => {
      applyZoomRef.current(zoomRef.current / step)
    }, [])
    const resetZoom = useCallback(() => {
      setPan({ x: 0, y: 0 })
      applyZoomRef.current(1)
    }, [setPan])
    const setZoom = useCallback((z: number) => {
      applyZoomRef.current(z)
    }, [])
    const getZoom = useCallback(() => zoomRef.current, [])

    useEffect(() => {
      const img = new Image()
      img.onload = () => {
        const w = img.naturalWidth
        const h = img.naturalHeight
        naturalRef.current = { w, h }
        markHasPaint(false)
        setDisplaySize({ w: 0, h: 0 })
        setPan({ x: 0, y: 0 })
        if (zoomProp === undefined && zoomRef.current !== 1) {
          setInnerZoom(1)
          zoomRef.current = 1
          onZoomChangeRef.current?.(1)
        }
        for (const canvas of [imageCanvasRef.current, maskCanvasRef.current, paintCanvasRef.current]) {
          if (!canvas) continue
          canvas.width = w
          canvas.height = h
        }
        const imageCtx = imageCanvasRef.current?.getContext('2d')
        const maskCtx = maskCanvasRef.current?.getContext('2d')
        const paintCtx = paintCanvasRef.current?.getContext('2d')
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
      img.src = src
    }, [src, fitCanvases, markHasPaint, setPan, zoomProp])

    useEffect(() => {
      fitCanvases()
    }, [brushSize, zoom, minZoom, maxZoom, fitCanvases])

    useEffect(() => {
      const onResize = () => fitCanvases()
      window.addEventListener('resize', onResize)
      const root = rootRef.current
      const stage = stageRef.current
      const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null
      if (ro && root) ro.observe(root)
      if (ro && stage) ro.observe(stage)
      return () => {
        window.removeEventListener('resize', onResize)
        ro?.disconnect()
      }
    }, [fitCanvases, checkerboard])

    useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.code !== 'Space' || isEditableTarget(e.target)) return
        // Avoid page scroll when Space would pan the zoomed stage under the pointer.
        if (hoverRef.current) e.preventDefault()
        setSpaceDown(true)
      }
      const onKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Space') setSpaceDown(false)
      }
      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('keyup', onKeyUp)
      return () => {
        window.removeEventListener('keydown', onKeyDown)
        window.removeEventListener('keyup', onKeyUp)
      }
    }, [])

    useEffect(() => {
      const stage = stageRef.current
      if (!stage || !wheelZoom) return
      const onWheel = (e: WheelEvent) => {
        if (disabled) return
        e.preventDefault()
        const rect = stage.getBoundingClientRect()
        const anchor = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        applyZoomRef.current(zoomRef.current * Math.exp(-e.deltaY * 0.002), anchor)
      }
      stage.addEventListener('wheel', onWheel, { passive: false })
      return () => stage.removeEventListener('wheel', onWheel)
    }, [wheelZoom, disabled])

    const pointerPos = (event: ReactPointerEvent<HTMLCanvasElement>) => {
      const canvas = paintCanvasRef.current!
      const rect = canvasRectRef.current ?? canvas.getBoundingClientRect()
      return {
        x: ((event.clientX - rect.left) / rect.width) * canvas.width,
        y: ((event.clientY - rect.top) / rect.height) * canvas.height,
      }
    }

    const pressureFactor = (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (event.pointerType === 'mouse' || !event.pressure || event.pressure <= 0) return 1
      return Math.min(1, Math.max(0.35, event.pressure))
    }

    const maskStillHasPaint = () => {
      const canvas = maskCanvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return false
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < data.length; i += 16) {
        if (data[i]! > 127) return true
      }
      return false
    }

    const stroke = (from: { x: number; y: number }, to: { x: number; y: number }, widthImage: number) => {
      const maskCtx = maskCanvasRef.current?.getContext('2d')
      const paintCtx = paintCanvasRef.current?.getContext('2d')
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

    const showBrushCursor = (x: number, y: number) => {
      const el = brushCursorRef.current
      if (!el) return
      const r = Math.max(BRUSH_SCREEN_MIN, brushSize) / 2
      el.style.transform = `translate(${x - r}px, ${y - r}px)`
      el.style.opacity = '1'
    }

    const hideBrushCursor = () => {
      const el = brushCursorRef.current
      if (!el) return
      el.style.opacity = '0'
    }

    const updateCursor = (event: ReactPointerEvent<HTMLCanvasElement>) => {
      const canvas = paintCanvasRef.current
      if (!canvas) return
      const rect = canvasRectRef.current ?? canvas.getBoundingClientRect()
      showBrushCursor(event.clientX - rect.left, event.clientY - rect.top)
    }

    const endInteraction = () => {
      if (panStartRef.current) {
        panStartRef.current = null
        setPanning(false)
      }
      drawingRef.current = false
      lastRef.current = null
      if (modeRef.current === 'erase') markHasPaint(maskStillHasPaint())
    }

    const clearMask = useCallback(() => {
      const mask = maskCanvasRef.current
      const paint = paintCanvasRef.current
      if (!mask || !paint) return
      const maskCtx = mask.getContext('2d')!
      const paintCtx = paint.getContext('2d')!
      maskCtx.fillStyle = '#000'
      maskCtx.fillRect(0, 0, mask.width, mask.height)
      paintCtx.clearRect(0, 0, paint.width, paint.height)
      markHasPaint(false)
    }, [markHasPaint])

    const exportMask = useCallback(async () => {
      const mask = maskCanvasRef.current
      if (!mask || !hasPaintRef.current) return null
      return new Promise<Blob | null>((resolve) => mask.toBlob((blob) => resolve(blob), 'image/png'))
    }, [])

    useImperativeHandle(ref, () => ({
      exportMask,
      clearMask,
      zoomIn,
      zoomOut,
      resetZoom,
      setZoom,
      getZoom,
    }))

    const cursorDiameter = Math.max(BRUSH_SCREEN_MIN, brushSize)
    const fittedStyle = {
      width: displaySize.w || undefined,
      height: displaySize.h || undefined,
      visibility: (displaySize.w > 0 ? 'visible' : 'hidden') as 'visible' | 'hidden',
      // Translation only — never scale(): keeps the brush ring screen-space and the
      // getBoundingClientRect pointer → natural-pixel mapping exact under zoom + pan.
      transform: pan.x || pan.y ? `translate(${pan.x}px, ${pan.y}px)` : undefined,
    }
    const stack = (
      <div className="cu-mask-paint-canvas__stack" style={checkerboard ? undefined : fittedStyle}>
        <canvas ref={imageCanvasRef} className="cu-mask-paint-canvas__layer" />
        <canvas
          ref={paintCanvasRef}
          className="cu-mask-paint-canvas__layer cu-mask-paint-canvas__hit"
          onPointerDown={(event) => {
            if (disabled) return
            canvasRectRef.current = event.currentTarget.getBoundingClientRect()
            const wantsPan = event.button === 1 || (event.button === 0 && spaceDown)
            if (wantsPan) {
              event.preventDefault()
              event.currentTarget.setPointerCapture(event.pointerId)
              panStartRef.current = {
                px: event.clientX,
                py: event.clientY,
                x: panRef.current.x,
                y: panRef.current.y,
              }
              setPanning(true)
              hideBrushCursor()
              return
            }
            if (event.pointerType === 'mouse' && event.button !== 0) return
            event.currentTarget.setPointerCapture(event.pointerId)
            drawingRef.current = true
            pressureRef.current = pressureFactor(event)
            updateCursor(event)
            const p = pointerPos(event)
            lastRef.current = p
            stroke(p, p, brushImageRef.current * pressureRef.current)
          }}
          onPointerMove={(event) => {
            if (panStartRef.current) {
              const stage = stageRef.current
              const s = panStartRef.current
              if (stage) {
                setPan(
                  clampPanValues(
                    s.x + (event.clientX - s.px),
                    s.y + (event.clientY - s.py),
                    displaySize.w,
                    displaySize.h,
                    stage.clientWidth,
                    stage.clientHeight,
                  ),
                )
                canvasRectRef.current = paintCanvasRef.current?.getBoundingClientRect() ?? null
              }
              return
            }
            updateCursor(event)
            if (!drawingRef.current || disabled) return
            pressureRef.current = pressureFactor(event)
            const p = pointerPos(event)
            if (lastRef.current) stroke(lastRef.current, p, brushImageRef.current * pressureRef.current)
            lastRef.current = p
          }}
          onPointerUp={endInteraction}
          onPointerCancel={endInteraction}
          onPointerLeave={() => {
            hoverRef.current = false
            if (!drawingRef.current && !panStartRef.current) hideBrushCursor()
          }}
          onPointerEnter={(event) => {
            hoverRef.current = true
            canvasRectRef.current = event.currentTarget.getBoundingClientRect()
            updateCursor(event)
          }}
        />
        <canvas ref={maskCanvasRef} className="cu-mask-paint-canvas__mask" aria-hidden="true" />
        <div
          ref={brushCursorRef}
          className={['cu-mask-paint-canvas__brush', mode === 'erase' ? 'is-erase' : '']
            .filter(Boolean)
            .join(' ')}
          style={{ width: cursorDiameter, height: cursorDiameter, opacity: 0 }}
          aria-hidden="true"
        />
      </div>
    )

    return (
      <div
        ref={rootRef}
        className="cu-mask-paint-canvas"
        data-ai-role="mask-paint-canvas"
        data-ai-intent="paint-mask"
        data-ai-state={disabled ? 'disabled' : hasPaint ? 'ready' : 'default'}
        data-mode={mode}
        data-fit={fit}
        data-zoom={Math.round(zoom * 100) / 100}
      >
        <div
          ref={stageRef}
          className={[
            'cu-mask-paint-canvas__stage',
            'cu-mask-paint-canvas__surface',
            panning ? 'is-panning' : '',
            spaceDown ? 'is-pan-mode' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {checkerboard ? (
            <CheckerboardSurface
              className="cu-mask-paint-canvas__checker"
              contrast={checkerboardContrast}
              style={fittedStyle}
            >
              {stack}
            </CheckerboardSurface>
          ) : (
            stack
          )}
        </div>
      </div>
    )
  },
)
