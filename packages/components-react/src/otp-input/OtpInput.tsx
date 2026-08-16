import { useRef } from 'react'
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react'
import './styles.css'

export interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  label: string
  digitLabel?: string
  disabled?: boolean
  className?: string
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  label,
  digitLabel = 'Digit',
  disabled = false,
  className,
}: OtpInputProps) {
  const cellsRef = useRef<(HTMLInputElement | null)[]>([])
  const classes = ['cu-otp-input', className].filter(Boolean).join(' ')
  const indexFormat = new Intl.NumberFormat(undefined)

  const focusCell = (index: number) => {
    const clamped = Math.max(0, Math.min(length - 1, index))
    cellsRef.current[clamped]?.focus()
  }

  const writeDigit = (index: number, digit: string) => {
    onChange((value.slice(0, index) + digit + value.slice(index + 1)).slice(0, length))
  }

  const onCellChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const digit = event.currentTarget.value.slice(-1)
    if (!/^[0-9]$/.test(digit)) return
    writeDigit(index, digit)
    if (index < length - 1) focusCell(index + 1)
  }

  const onCellKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault()
      if (value[index]) {
        writeDigit(index, '')
      } else {
        writeDigit(index - 1, '')
        focusCell(index - 1)
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusCell(index - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusCell(index + 1)
    }
  }

  const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (digits.length === 0) return
    event.preventDefault()
    onChange(digits)
    focusCell(Math.min(digits.length, length - 1))
  }

  return (
    <div
      className={classes}
      role="group"
      aria-label={label}
      data-ai-role="otp-input" data-ai-intent="enter-text"
      data-ai-state={disabled ? 'disabled' : value.length >= length ? 'complete' : 'default'}
      onPaste={onPaste}
    >
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            cellsRef.current[index] = element
          }}
          className="cu-otp-input__cell"
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`${digitLabel} ${indexFormat.format(index + 1)}`}
          value={value[index] ?? ''}
          disabled={disabled}
          onChange={(event) => onCellChange(index, event)}
          onKeyDown={(event) => onCellKeyDown(index, event)}
        />
      ))}
    </div>
  )
}
