import { useId, useState } from 'react'
import type { CSSProperties } from 'react'
import { Button } from '../components/button'
import { Dialog } from '../components/dialog'
import { Input } from '../components/input'
import { translate } from './i18n'
import type { Locale, MessageKey, TextDirection } from './i18n'

export type PreviewWidth = 390 | 768 | 1280

export interface RtlPlaygroundProps {
  locale: Locale
  direction: TextDirection
  previewWidth: PreviewWidth
}

export function RtlPlayground({
  locale,
  direction,
  previewWidth,
}: RtlPlaygroundProps) {
  const [activationCount, setActivationCount] = useState(0)
  const [projectName, setProjectName] = useState('Chameleon UI')
  const [invalid, setInvalid] = useState(false)
  const headingId = useId()
  const t = (key: MessageKey, parameters?: Record<string, string | number>) =>
    translate(locale, key, parameters)
  const previewStyle = { '--cu-preview-width': `${previewWidth}px` } as CSSProperties

  return (
    <section
      className="cu-preview-shell"
      lang={locale}
      dir={direction}
      style={previewStyle}
      aria-labelledby={headingId}
    >
      <div className="cu-preview" data-preview-width={previewWidth}>
        <header className="cu-preview__header">
          <div>
            <p className="cu-eyebrow">{t('app.eyebrow')}</p>
            <h2 id={headingId}>{t('preview.heading')}</h2>
          </div>
          <span className="cu-preview__badge">{previewWidth}px</span>
        </header>

        <p className="cu-preview__hint">{t('preview.hint')}</p>
        <p className="cu-preview__hint">{t('preview.direction', { direction })}</p>

        <div className="cu-demo-grid">
          <article className="cu-demo-card">
            <h3>{t('component.button')}</h3>
            <div className="cu-demo-card__actions">
              <Button onClick={() => setActivationCount((count) => count + 1)}>
                {t('button.primary')}
              </Button>
              <Button variant="outline" size="sm">
                {t('button.secondary')}
              </Button>
            </div>
            <output className="cu-demo-card__status" aria-live="polite">
              {t('button.count', { count: activationCount })}
            </output>
          </article>

          <article className="cu-demo-card">
            <h3>{t('component.input')}</h3>
            <Input
              errorMessage={t('input.invalid')}
              label={t('input.label')}
              value={projectName}
              onChange={setProjectName}
              placeholder={t('input.placeholder')}
              invalid={invalid}
              required
            />
            <label className="cu-check">
              <input
                type="checkbox"
                checked={invalid}
                onChange={(event) => setInvalid(event.currentTarget.checked)}
              />
              <span>{t('input.invalid')}</span>
            </label>
            <Input
              label={t('input.disabled')}
              value={t('input.disabledValue')}
              onChange={() => undefined}
              disabled
            />
          </article>

          <article className="cu-demo-card">
            <h3>{t('component.dialog')}</h3>
            <Dialog
              direction={direction}
              triggerLabel={t('dialog.trigger')}
              title={t('dialog.title')}
              description={t('dialog.description')}
              closeLabel={t('dialog.close')}
            >
              <p className="cu-demo-card__status">{t('dialog.body')}</p>
            </Dialog>
          </article>
        </div>
      </div>
    </section>
  )
}
