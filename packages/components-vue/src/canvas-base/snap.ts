export interface CanvasViewport {
  zoom: number
  offsetX: number
  offsetY: number
}

/** Snaps a world coordinate to the nearest grid intersection when enabled. */
export function snapToGridValue(value: number, gridSize: number, enabled: boolean) {
  if (!enabled || gridSize <= 0) return value
  return Math.round(value / gridSize) * gridSize
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
