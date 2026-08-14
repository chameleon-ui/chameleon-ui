import { LocaleProvider } from '@ark-ui/react/locale'
import { useEffect, useMemo, useState } from 'react'
import { Button } from './components/button'
import { Dialog } from './components/dialog'
import { Input } from './components/input'
import { Breakpoints } from './demo/Breakpoints'
import { formatMessage, getMessages, type Locale } from './demo/i18n'
import { RtlPlayground } from './demo/RtlPlayground'

export type Direction = 'ltr' | 'rtl'

export function App() {
  const [locale, setLocale] = useState<Locale>('en')
  const [direction, setDirection] = useState<Direction>('ltr')
  const [projectName, setProjectName] = useState('')
  const [actionCount, setActionCount] = useState(0)
  const messages = useMemo(() => getMessages(locale), [locale])
  const primitiveLocale =
    locale === 'ar' || direction === 'rtl' ? 'ar' : locale === 'de' ? 'de' : 'en'
  const invalid = projectName.length > 0 && projectName.length < 3

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = direction
  }, [direction, locale])

  return (
    <LocaleProvider locale={primitiveLocale}>
      <div className="cu-app" dir={direction} lang={locale}>
      <header className="cu-hero">
        <p className="cu-kicker">{messages.app.eyebrow}</p>
        <h1>{messages.app.title}</h1>
        <p className="cu-hero__description">{messages.app.description}</p>
      </header>

      <main className="cu-main">
        <RtlPlayground
          direction={direction}
          locale={locale}
          messages={messages}
          onDirectionChange={setDirection}
          onLocaleChange={setLocale}
        />

        <section aria-labelledby="components-title" className="cu-panel cu-components">
          <div className="cu-section-heading">
            <div>
              <p className="cu-kicker">{messages.components.kicker}</p>
              <h2 id="components-title">{messages.components.title}</h2>
            </div>
            <output aria-live="polite" className="cu-counter">
              {formatMessage(locale, messages.button.count, { count: actionCount })}
            </output>
          </div>

          <div className="cu-demo-grid">
            <article className="cu-demo-card">
              <h3>{messages.button.componentName}</h3>
              <div className="cu-inline-actions">
                <Button onClick={() => setActionCount((count) => count + 1)}>
                  {messages.button.solid}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActionCount((count) => count + 1)}
                >
                  {messages.button.outline}
                </Button>
              </div>
            </article>

            <article className="cu-demo-card">
              <h3>{messages.input.componentName}</h3>
              <Input
                errorMessage={messages.input.invalid}
                invalid={invalid}
                label={messages.input.label}
                placeholder={messages.input.placeholder}
                value={projectName}
                onChange={setProjectName}
              />
            </article>

            <article className="cu-demo-card">
              <h3>{messages.dialog.componentName}</h3>
              <Dialog
                closeLabel={messages.dialog.close}
                description={messages.dialog.description}
                title={messages.dialog.title}
                triggerLabel={messages.dialog.trigger}
              >
                <p>{messages.dialog.body}</p>
              </Dialog>
            </article>
          </div>
        </section>

        <Breakpoints direction={direction} locale={locale} messages={messages} />

        <aside aria-labelledby="notes-title" className="cu-panel cu-notes">
          <p className="cu-kicker">{messages.notes.kicker}</p>
          <h2 id="notes-title">{messages.notes.title}</h2>
          <ul>
            <li>{formatMessage(locale, messages.icu.direction, { direction })}</li>
            <li>{messages.notes.keyboard}</li>
            <li>{messages.notes.telemetry}</li>
            <li>{messages.notes.migration}</li>
          </ul>
        </aside>
      </main>
      </div>
    </LocaleProvider>
  )
}
