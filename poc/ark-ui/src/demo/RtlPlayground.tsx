import type { Direction } from '../App'
import type { Locale, Messages } from './i18n'

interface RtlPlaygroundProps {
  direction: Direction
  locale: Locale
  messages: Messages
  onDirectionChange: (direction: Direction) => void
  onLocaleChange: (locale: Locale) => void
}

// @phase-1 locales migrate → packages/components/src/*/locales after O1 is signed off.
export function RtlPlayground({
  direction,
  locale,
  messages,
  onDirectionChange,
  onLocaleChange,
}: RtlPlaygroundProps) {
  return (
    <section aria-labelledby="playground-title" className="cu-panel cu-playground">
      <div>
        <p className="cu-kicker">{messages.controls.kicker}</p>
        <h2 id="playground-title">{messages.controls.heading}</h2>
      </div>
      <div className="cu-controls">
        <label className="cu-control">
          <span>{messages.controls.locale}</span>
          <select
            className="cu-select"
            value={locale}
            onChange={(event) => onLocaleChange(event.currentTarget.value as Locale)}
          >
            <option value="en">{messages.controls.english}</option>
            <option value="en-XA">{messages.controls.pseudo}</option>
            <option value="ar">{messages.controls.arabic}</option>
            <option value="de">{messages.controls.german}</option>
          </select>
        </label>
        <fieldset className="cu-direction-group">
          <legend>{messages.controls.direction}</legend>
          {(['ltr', 'rtl'] as const).map((value) => (
            <label className="cu-radio" key={value}>
              <input
                checked={direction === value}
                name="direction"
                type="radio"
                value={value}
                onChange={() => onDirectionChange(value)}
              />
              <span>{value === 'ltr' ? messages.controls.ltr : messages.controls.rtl}</span>
            </label>
          ))}
        </fieldset>
      </div>
    </section>
  )
}
