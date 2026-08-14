import './styles.css'

export interface TimePickerProps {
  value: string
  onChange: (value: string) => void
  label: string
  hourLabel?: string
  minuteLabel?: string
  locale?: string
  className?: string
}

function parseTime(value: string): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value)
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour > 23 || minute > 59) return null
  return { hour, minute }
}

export function TimePicker({ value, onChange, label, hourLabel = 'Hour', minuteLabel = 'Minute', locale = 'en', className }: TimePickerProps) {
  const classes = ['cu-time-picker', className].filter(Boolean).join(' ')
  const parsed = parseTime(value)
  const numberFormat = new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false })

  const emit = (hour: number, minute: number) => {
    onChange(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
  }

  return (
    <div className={classes} role="group" aria-label={label} data-ai-role="time-picker" data-ai-intent="pick-datetime" data-ai-state="default">
      <label className="cu-time-picker__field">
        <span className="cu-time-picker__label">{hourLabel}</span>
        <select
          className="cu-time-picker__select"
          value={parsed?.hour ?? ''}
          onChange={(event) => emit(Number(event.currentTarget.value), parsed?.minute ?? 0)}
        >
          <option value="" disabled>
            --
          </option>
          {Array.from({ length: 24 }, (_, hour) => (
            <option key={hour} value={hour}>
              {numberFormat.format(hour)}
            </option>
          ))}
        </select>
      </label>
      <span className="cu-time-picker__separator" aria-hidden="true">
        :
      </span>
      <label className="cu-time-picker__field">
        <span className="cu-time-picker__label">{minuteLabel}</span>
        <select
          className="cu-time-picker__select"
          value={parsed?.minute ?? ''}
          onChange={(event) => emit(parsed?.hour ?? 0, Number(event.currentTarget.value))}
        >
          <option value="" disabled>
            --
          </option>
          {Array.from({ length: 60 }, (_, minute) => (
            <option key={minute} value={minute}>
              {numberFormat.format(minute)}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
