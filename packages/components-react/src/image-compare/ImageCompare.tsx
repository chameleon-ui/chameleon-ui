import { useCallback, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import {
  CheckerboardSurface,
  type CheckerboardContrast,
} from '../checkerboard-surface/CheckerboardSurface.js'
import './styles.css'

export type ImageCompareOrientation = 'horizontal' | 'vertical'

export interface ImageCompareProps {
  beforeSrc: string
  afterSrc: string
  beforeAlt?: string
  afterAlt?: string
  position?: number
  defaultPosition?: number
  onPositionChange?: (value: number) => void
  orientation?: ImageCompareOrientation
  showKnob?: boolean
  checkerboard?: boolean
  /** Checker contrast when `checkerboard` is on. Defaults to `strong` for transparent results. */
  checkerboardContrast?: CheckerboardContrast
  label?: string
  children?: ReactNode
  className?: string
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function ImageCompare({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Before',
  afterAlt = 'After',
  position,
  defaultPosition = 0.5,
  onPositionChange,
  orientation = 'horizontal',
  showKnob = true,
  checkerboard = true,
  checkerboardContrast = 'strong',
  label = 'Compare before and after',
  className,
}: ImageCompareProps) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [uncontrolled, setUncontrolled] = useState(defaultPosition)
  const value = position ?? uncontrolled

  const setValue = useCallback(
    (next: number) => {
      const clamped = clamp01(next)
      if (position === undefined) setUncontrolled(clamped)
      onPositionChange?.(clamped)
    },
    [onPositionChange, position],
  )

  const updateFromPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const el = rootRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (orientation === 'vertical') {
        setValue((event.clientY - rect.top) / Math.max(rect.height, 1))
      } else {
        setValue((event.clientX - rect.left) / Math.max(rect.width, 1))
      }
    },
    [orientation, setValue],
  )

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 0.1 : 0.02
    if (orientation === 'vertical') {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setValue(value - step)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        setValue(value + step)
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setValue(value - step)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      setValue(value + step)
    } else if (event.key === 'Home') {
      event.preventDefault()
      setValue(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setValue(1)
    }
  }

  const pct = `${value * 100}%`
  const clip =
    orientation === 'vertical' ? `inset(${pct} 0 0 0)` : `inset(0 0 0 ${pct})`
  const dividerStyle =
    orientation === 'vertical'
      ? { insetBlockStart: pct }
      : { insetInlineStart: pct }

  const body = (
    <div
      ref={rootRef}
      className={['cu-image-compare', `cu-image-compare--${orientation}`, className]
        .filter(Boolean)
        .join(' ')}
      data-ai-role="image-compare"
      data-ai-intent="compare-images"
      data-ai-state="default"
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      aria-orientation={orientation}
      aria-controls={id}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        updateFromPointer(event)
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        updateFromPointer(event)
      }}
      onKeyDown={onKeyDown}
    >
      <img className="cu-image-compare__img cu-image-compare__img--before" src={beforeSrc} alt={beforeAlt} draggable={false} />
      <img
        id={id}
        className="cu-image-compare__img cu-image-compare__img--after"
        src={afterSrc}
        alt={afterAlt}
        draggable={false}
        style={{ clipPath: clip }}
      />
      <div
        className="cu-image-compare__divider"
        style={dividerStyle}
        data-show-knob={showKnob ? 'true' : 'false'}
        aria-hidden="true"
      />
    </div>
  )

  return checkerboard ? (
    <CheckerboardSurface className="cu-image-compare__surface" contrast={checkerboardContrast}>
      {body}
    </CheckerboardSurface>
  ) : (
    body
  )
}
