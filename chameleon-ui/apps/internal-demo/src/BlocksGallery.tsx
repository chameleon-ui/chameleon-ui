import type { ReactElement } from 'react'
import {
  ApprovalFlow,
  CrudPage,
  DataScreen,
  Gantt,
  ImChat,
  IotPanel,
  Kanban,
  Login,
  MarketingSite,
  Register,
  TicketFlow,
  TradingTerminal,
  REAL_BLOCK_SLUGS,
} from '@chameleon-ui/blocks'
import { Typography } from '@chameleon-ui/components'
import type { Phase2Locale } from '@chameleon-ui/i18n'
import './BlocksGallery.css'

const renderers: Record<string, (locale: Phase2Locale) => ReactElement> = {
  login: (locale) => <Login locale={locale} />,
  register: (locale) => <Register locale={locale} />,
  'crud-page': (locale) => <CrudPage locale={locale} />,
  kanban: (locale) => <Kanban locale={locale} />,
  gantt: (locale) => <Gantt locale={locale} />,
  'ticket-flow': (locale) => <TicketFlow locale={locale} />,
  'approval-flow': (locale) => <ApprovalFlow locale={locale} />,
  'im-chat': (locale) => <ImChat locale={locale} />,
  'data-screen': (locale) => <DataScreen locale={locale} />,
  'trading-terminal': (locale) => <TradingTerminal locale={locale} />,
  'iot-panel': (locale) => <IotPanel locale={locale} />,
  'marketing-site': (locale) => <MarketingSite locale={locale} />,
}

export function BlocksGallery({ locale }: { locale: Phase2Locale }) {
  return (
    <div className="cu-demo-blocks" id="blocks">
      <Typography variant="heading-2">Phase 7 Blocks</Typography>
      <p className="cu-demo-blocks__lead">Twelve scenario blocks · Token-only · en/ar snapshots</p>
      {REAL_BLOCK_SLUGS.map((slug) => (
        <section key={slug} className="cu-demo-blocks__section" data-demo-block={slug}>
          <h3 className="cu-demo-blocks__title">{slug}</h3>
          <div className="cu-demo-blocks__frame">{renderers[slug]?.(locale)}</div>
        </section>
      ))}
    </div>
  )
}
