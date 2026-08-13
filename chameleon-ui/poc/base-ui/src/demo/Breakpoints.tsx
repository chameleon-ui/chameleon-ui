import type { Locale, MessageKey, TextDirection } from './i18n'
import { translate } from './i18n'
import { RtlPlayground } from './RtlPlayground'
import type { PreviewWidth } from './RtlPlayground'

const previewWidths: PreviewWidth[] = [390, 768, 1280]

export interface BreakpointsProps {
  locale: Locale
  direction: TextDirection
}

export function Breakpoints({ locale, direction }: BreakpointsProps) {
  const t = (key: MessageKey) => translate(locale, key)

  return (
    <div className="cu-breakpoints">
      {previewWidths.map((width) => (
        <details
          aria-label={`${t('controls.viewport')}: ${width}px`}
          className="cu-breakpoint"
          key={width}
          open
        >
          <summary>{t(`controls.width.${width}` as MessageKey)}</summary>
          <RtlPlayground
            locale={locale}
            direction={direction}
            previewWidth={width}
          />
        </details>
      ))}
    </div>
  )
}
