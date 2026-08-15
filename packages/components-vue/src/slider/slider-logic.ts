export type SliderValue = number | readonly [number, number]

export interface SliderProps {
  value: SliderValue
  min?: number
  max?: number
  step?: number
  marks?: number[]
  disabled?: boolean
  label?: string
  class?: string
}

export function isRange(value: SliderValue): value is readonly [number, number] {
  return Array.isArray(value)
}
