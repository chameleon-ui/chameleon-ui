import { DirectionProvider } from '@base-ui/react/direction-provider'
import { useEffect, useState } from 'react'
import { Breakpoints } from './demo/Breakpoints'
import type { Locale, MessageKey, TextDirection } from './demo/i18n'
import { translate } from './demo/i18n'
import { RtlPlayground } from './demo/RtlPlayground'
import type { PreviewWidth } from './demo/RtlPlayground'

const previewWidths: PreviewWidth[] = [390, 768, 1280]

export function App() {
  const [locale, setLocale] = useState<Locale>('en')
  const [direction, setDirection] = useState<TextDirection>('ltr')
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>(390)
  const [showAllBreakpoints, setShowAllBreakpoints] = useState(false)
  const t = (key: MessageKey) => translate(locale, key)

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = direction
  }, [direction, locale])

  return (
    <DirectionProvider direction={direction}>
      <main className="cu-app" dir={direction} lang={locale}>
        <header className="cu-app__header">
          <p className="cu-eyebrow">{t('app.eyebrow')}</p>
          <h1>{t('app.title')}</h1>
          <p>{t('app.description')}</p>
        </header>

      <section className="cu-controls" aria-labelledby="controls-heading">
        <h2 id="controls-heading">{t('controls.heading')}</h2>
        <div className="cu-controls__grid">
          <label className="cu-control">
            <span>{t('controls.locale')}</span>
            <select
              value={locale}
              onChange={(event) => setLocale(event.currentTarget.value as Locale)}
            >
              <option value="en">en</option>
              <option value="en-XA">en-XA</option>
            </select>
          </label>

          <fieldset className="cu-control cu-segmented">
            <legend>{t('controls.direction')}</legend>
            {(['ltr', 'rtl'] as TextDirection[]).map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="direction"
                  value={value}
                  checked={direction === value}
                  onChange={() => setDirection(value)}
                />
                <span>{t(`controls.${value}`)}</span>
              </label>
            ))}
          </fieldset>

          <label className="cu-control">
            <span>{t('controls.viewport')}</span>
            <select
              value={previewWidth}
              disabled={showAllBreakpoints}
              onChange={(event) =>
                setPreviewWidth(Number(event.currentTarget.value) as PreviewWidth)
              }
            >
              {previewWidths.map((width) => (
                <option value={width} key={width}>
                  {t(`controls.width.${width}` as MessageKey)}
                </option>
              ))}
            </select>
          </label>

          <label className="cu-check cu-check--panel">
            <input
              type="checkbox"
              checked={showAllBreakpoints}
              onChange={(event) => setShowAllBreakpoints(event.currentTarget.checked)}
            />
            <span>{t('controls.showAll')}</span>
          </label>
        </div>
      </section>

      {showAllBreakpoints ? (
        <Breakpoints locale={locale} direction={direction} />
      ) : (
        <RtlPlayground
          locale={locale}
          direction={direction}
          previewWidth={previewWidth}
        />
      )}

        <footer className="cu-app__footer">
          <span>{t('status.stack')}</span>
          <span>{t('status.telemetry')}</span>
        </footer>
      </main>
    </DirectionProvider>
  )
}
