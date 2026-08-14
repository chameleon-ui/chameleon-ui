import './styles.css'

export type SliderValue = number | readonly [number, number]

export interface SliderProps {
  value: SliderValue
  min?: number
  max?: number
  step?: number
  marks?: number[]
  disabled?: boolean
  onChange: (value: SliderValue) => void
  label?: string
  className?: string
}

function isRange(value: SliderValue): value is readonly [number, number] {
  return Array.isArray(value)
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  marks,
  disabled = false,
  onChange,
  label,
  className,
}: SliderProps) {
  const classes = ['cu-slider', disabled ? 'cu-slider--disabled' : '', className].filter(Boolean).join(' ')
  const range = isRange(value)

  return (
    <div
      className={classes}
      data-ai-role="slider"
      data-ai-state={disabled ? 'disabled' : range ? 'range' : 'default'}
      data-ai-intent="adjust-value"
    >
      {label ? <label className="cu-slider__label">{label}</label> : null}
      {range ? (
        <div className="cu-slider__inputs">
          <input
            aria-label={label ? `${label} minimum` : 'Minimum'}
            className="cu-slider__input"
            disabled={disabled}
            max={value[1]}
            min={min}
            onChange={(event) => onChange([Number(event.currentTarget.value), value[1]])}
            step={step}
            type="range"
            value={value[0]}
          />
          <input
            aria-label={label ? `${label} maximum` : 'Maximum'}
            className="cu-slider__input"
            disabled={disabled}
            max={max}
            min={value[0]}
            onChange={(event) => onChange([value[0], Number(event.currentTarget.value)])}
            step={step}
            type="range"
            value={value[1]}
          />
        </div>
      ) : (
        <input
          aria-label={label}
          className="cu-slider__input"
          disabled={disabled}
          max={max}
          min={min}
          onChange={(event) => onChange(Number(event.currentTarget.value))}
          step={step}
          type="range"
          value={value}
        />
      )}
      {marks && marks.length > 0 ? (
        <div className="cu-slider__marks">
          {marks.map((mark) => (
            <span
              className="cu-slider__mark"
              key={mark}
              style={{ insetInlineStart: `${((mark - min) / Math.max(max - min, 1)) * 100}%` }}
            >
              {mark}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
