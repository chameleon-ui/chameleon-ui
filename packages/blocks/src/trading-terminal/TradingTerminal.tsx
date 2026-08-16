import { Button, Card, Chart, DataGrid, Ticker, Typography } from '@chameleon-ui/components-react'
import type { DataGridColumn, TickerItem } from '@chameleon-ui/components-react'
import { useMemo, useState } from 'react'
import { createBlockCopy } from '../copy.js'
import { tradingTerminalLocaleTrees } from './locale-map.js'
import './styles.css'

export interface TradingQuote extends TickerItem {
  series: number[]
}

export interface TradingOrder {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  size: string
  price: string
}

export interface TradingTerminalProps {
  locale?: string
  quotes?: TradingQuote[]
  orders?: TradingOrder[]
  onSelectSymbol?: (id: string) => void
  className?: string
}

const DEFAULT_QUOTES: TradingQuote[] = [
  { id: 'btc', label: 'BTC', value: '67.2k', trend: 'up', series: [62, 64, 63, 66, 67] },
  { id: 'eth', label: 'ETH', value: '3.1k', trend: 'down', series: [3.4, 3.3, 3.2, 3.15, 3.1] },
  { id: 'sol', label: 'SOL', value: '148', trend: 'flat', series: [144, 147, 146, 148, 148] },
]

const DEFAULT_ORDERS: TradingOrder[] = [
  { id: 'ord-1', symbol: 'BTC', side: 'buy', size: '0.40', price: '67.1k' },
  { id: 'ord-2', symbol: 'ETH', side: 'sell', size: '2.00', price: '3.12k' },
  { id: 'ord-3', symbol: 'BTC', side: 'sell', size: '0.10', price: '67.4k' },
  { id: 'ord-4', symbol: 'SOL', side: 'buy', size: '12', price: '147' },
]

export function TradingTerminal({
  locale = 'en',
  quotes = DEFAULT_QUOTES,
  orders = DEFAULT_ORDERS,
  onSelectSymbol,
  className,
}: TradingTerminalProps) {
  const { t } = createBlockCopy(tradingTerminalLocaleTrees, locale)
  const [selectedId, setSelectedId] = useState(quotes[0]?.id ?? '')
  const classes = ['cu-block-trading-terminal', className].filter(Boolean).join(' ')
  const selected = quotes.find((quote) => quote.id === selectedId) ?? quotes[0]
  const visibleOrders = orders.filter((order) => !selected || order.symbol === selected.label)

  const columns: DataGridColumn<TradingOrder>[] = useMemo(
    () => [
      { key: 'symbol', header: t('trade.colSymbol'), width: 120 },
      {
        key: 'side',
        header: t('trade.colSide'),
        width: 120,
        render: (row) => (row.side === 'buy' ? t('trade.sideBuy') : t('trade.sideSell')),
      },
      { key: 'size', header: t('trade.colSize'), width: 120 },
      { key: 'price', header: t('trade.colPrice'), width: 120 },
    ],
    [t],
  )

  const handleSelect = (id: string) => {
    setSelectedId(id)
    onSelectSymbol?.(id)
  }

  return (
    <section
      className={classes}
      data-ai-role="trading-terminal"
      data-ai-intent="watch-markets"
      data-ai-state={orders.length === 0 ? 'empty' : 'default'}
    >
      <div className="cu-block-trading-terminal__header">
        <Typography variant="heading-1">{t('trade.title')}</Typography>
        <Typography variant="body">{t('trade.subtitle')}</Typography>
        <p className="cu-block-trading-terminal__meta">
          {t('trade.orderCount', { count: visibleOrders.length })}
        </p>
      </div>
      <Ticker items={quotes} label={t('trade.tickerLabel')} />
      <div className="cu-block-trading-terminal__symbols" role="group" aria-label={t('trade.tickerLabel')}>
        {quotes.map((quote) => (
          <Button
            aria-pressed={quote.id === selected?.id}
            key={quote.id}
            onClick={() => handleSelect(quote.id)}
            type="button"
            variant={quote.id === selected?.id ? 'solid' : 'outline'}
          >
            {t('trade.selectSymbol', { symbol: quote.label })}
          </Button>
        ))}
      </div>
      <div className="cu-block-trading-terminal__body">
        <Card padding="md" variant="outlined">
          {selected ? (
            <Chart
              emptyLabel={t('trade.emptyLabel')}
              label={t('trade.chartNamed', { symbol: selected.label })}
              series={[{ name: t('trade.priceSeries'), data: selected.series }]}
              type="line"
            />
          ) : null}
        </Card>
        <Card padding="md" variant="outlined">
          <DataGrid
            columns={columns}
            emptyLabel={t('trade.emptyLabel')}
            getRowId={(row) => row.id}
            height={240}
            label={t('trade.gridLabel')}
            rowHeight={40}
            rows={visibleOrders}
            width={640}
          />
        </Card>
      </div>
    </section>
  )
}
