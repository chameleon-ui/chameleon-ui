import './styles.css'

export interface SliderProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  label?: string
  className?: string
}

export function Slider({ value, min = 0, max = 100, onChange, label, className }: SliderProps) {
  const classes = ['cu-slider', className].filter(Boolean).join(' ')
  return (
    <div className={classes} data-ai-role="slider" data-ai-state="default" data-ai-intent="adjust-value">
      {label ? <label className="cu-slider__label">{label}</label> : null}
      <input
        aria-label={label}
        className="cu-slider__input"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        type="range"
        value={value}
      />
    </div>
  )
}
