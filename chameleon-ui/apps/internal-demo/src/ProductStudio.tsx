import {
  AppShell,
  Button,
  Card,
  EmptyState,
  Input,
  Navigation,
  NavigationBar,
  Stack,
  Typography,
} from '@chameleon-ui/components'
import { useState } from 'react'
import './ProductStudio.css'

type StreetPage = 'inbox' | 'files' | 'settings'

export function ProductStudio({ t }: { t: (key: string, values?: Record<string, string | number>) => string }) {
  const [page, setPage] = useState<StreetPage>('inbox')
  const [name, setName] = useState('Ada Chen')

  const items = [
    { value: 'inbox', label: t('demo.streetInbox') },
    { value: 'files', label: t('demo.streetFiles') },
    { value: 'settings', label: t('demo.streetSettings') },
  ]

  const title =
    page === 'files' ? t('demo.streetFiles') : page === 'settings' ? t('demo.streetSettings') : t('demo.streetTitle')

  return (
    <AppShell
      header={
        <NavigationBar
          title={title}
          trailing={page === 'inbox' ? <Button size="sm">{t('demo.streetNew')}</Button> : undefined}
        />
      }
      navigation={
        <Navigation
          label={t('demo.streetNav')}
          header={t('demo.streetNav')}
          items={items}
          activeValue={page}
          onSelect={(value) => setPage(value as StreetPage)}
          collapseLabel={t('navigation.collapse')}
          expandLabel={t('navigation.expand')}
          moreLabel={t('navigation.more')}
        />
      }
    >
      <div className="cu-street" data-demo="street">
        {page === 'inbox' ? (
          <Stack gap="5">
            <Stack gap="2">
              <p className="cu-street__kicker">{t('demo.streetKicker')}</p>
              <Typography variant="heading-2">{t('demo.streetTitle')}</Typography>
              <Typography variant="body">{t('demo.streetLead')}</Typography>
            </Stack>
            <div className="cu-street__metrics">
              <Card variant="elevated">
                <p className="cu-street__kicker">{t('demo.streetMetricOpen')}</p>
                <p className="cu-street__metric-value">{t('demo.streetMetricOpenValue')}</p>
              </Card>
              <Card variant="elevated">
                <p className="cu-street__kicker">{t('demo.streetMetricCycle')}</p>
                <p className="cu-street__metric-value">{t('demo.streetMetricCycleValue')}</p>
              </Card>
              <Card variant="elevated">
                <p className="cu-street__kicker">{t('demo.streetMetricWaiting')}</p>
                <p className="cu-street__metric-value">{t('demo.streetMetricWaitingValue')}</p>
              </Card>
            </div>
            <Card padding="lg">
              <Stack gap="3">
                <Typography variant="heading-2">{t('demo.streetActivity')}</Typography>
                <ul className="cu-street__list">
                  <li className="cu-street__row">
                    <span>{t('demo.streetRow1')}</span>
                    <span className="cu-street__meta">{t('demo.streetRow1Meta')}</span>
                  </li>
                  <li className="cu-street__row">
                    <span>{t('demo.streetRow2')}</span>
                    <span className="cu-street__meta">{t('demo.streetRow2Meta')}</span>
                  </li>
                  <li className="cu-street__row">
                    <span>{t('demo.streetRow3')}</span>
                    <span className="cu-street__meta">{t('demo.streetRow3Meta')}</span>
                  </li>
                </ul>
              </Stack>
            </Card>
          </Stack>
        ) : null}
        {page === 'files' ? (
          <EmptyState
            title={t('demo.streetEmptyTitle')}
            description={t('demo.streetEmptyBody')}
            action={<Button variant="outline">{t('demo.streetEmptyAction')}</Button>}
          />
        ) : null}
        {page === 'settings' ? (
          <Stack gap="5">
            <Stack gap="2">
              <Typography variant="heading-2">{t('demo.streetSettings')}</Typography>
              <Typography variant="caption">{t('demo.streetNameHint')}</Typography>
            </Stack>
            <Card padding="lg">
              <Input label={t('demo.streetNameLabel')} value={name} onChange={setName} />
            </Card>
          </Stack>
        ) : null}
      </div>
    </AppShell>
  )
}
