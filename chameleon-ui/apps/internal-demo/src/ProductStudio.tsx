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

export type StreetExit = 'gallery' | 'blocks' | 'three-end' | 'blind'

export interface ProductStudioProps {
  t: (key: string, values?: Record<string, string | number>) => string
  onNavigate?: (view: StreetExit) => void
}

interface InboxRow {
  id: string
  title: string
  meta: string
  draft?: boolean
}

export function ProductStudio({ t, onNavigate }: ProductStudioProps) {
  const [page, setPage] = useState<StreetPage>('inbox')
  const [name, setName] = useState('Ada Chen')
  const [rows, setRows] = useState<InboxRow[]>([
    { id: 'r1', title: t('demo.streetRow1'), meta: t('demo.streetRow1Meta') },
    { id: 'r2', title: t('demo.streetRow2'), meta: t('demo.streetRow2Meta') },
    { id: 'r3', title: t('demo.streetRow3'), meta: t('demo.streetRow3Meta') },
  ])
  const [draftCount, setDraftCount] = useState(0)
  const [files, setFiles] = useState<string[]>([])

  const items = [
    { value: 'inbox', label: t('demo.streetInbox') },
    { value: 'files', label: t('demo.streetFiles') },
    { value: 'settings', label: t('demo.streetSettings') },
  ]

  const title =
    page === 'files' ? t('demo.streetFiles') : page === 'settings' ? t('demo.streetSettings') : t('demo.streetTitle')

  function createIssue() {
    const next = draftCount + 1
    setDraftCount(next)
    setRows((current) => [
      {
        id: `draft-${next}`,
        title: t('demo.streetDraftTitle', { n: next }),
        meta: t('demo.streetDraftMeta'),
        draft: true,
      },
      ...current,
    ])
    setPage('inbox')
  }

  function chooseFiles() {
    setFiles([t('demo.streetFileA'), t('demo.streetFileB')])
  }

  function clearFiles() {
    setFiles([])
  }

  return (
    <AppShell
      header={
        <NavigationBar
          title={title}
          trailing={
            page === 'inbox' ? (
              <Button size="sm" onClick={createIssue} data-street="new-issue">
                {t('demo.streetNew')}
              </Button>
            ) : undefined
          }
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
                  {rows.map((row) => (
                    <li key={row.id} className="cu-street__row" data-street-row={row.draft ? 'draft' : 'seed'}>
                      <span>{row.title}</span>
                      <span className="cu-street__meta">{row.meta}</span>
                    </li>
                  ))}
                </ul>
              </Stack>
            </Card>
            {onNavigate ? (
              <div data-street="explore">
                <Card padding="lg">
                  <Stack gap="3">
                    <Typography variant="heading-2">{t('demo.streetExploreTitle')}</Typography>
                    <Typography variant="body">{t('demo.streetExploreLead')}</Typography>
                    <Stack direction="row" gap="2">
                      <Button size="sm" variant="outline" onClick={() => onNavigate('gallery')}>
                        {t('demo.streetOpenGallery')}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onNavigate('blocks')}>
                        {t('demo.streetOpenBlocks')}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onNavigate('three-end')}>
                        {t('demo.streetOpenThreeEnd')}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onNavigate('blind')}>
                        {t('demo.streetOpenBlind')}
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              </div>
            ) : null}
          </Stack>
        ) : null}
        {page === 'files' ? (
          files.length === 0 ? (
            <EmptyState
              title={t('demo.streetEmptyTitle')}
              description={t('demo.streetEmptyBody')}
              action={
                <Button variant="outline" onClick={chooseFiles} data-street="choose-files">
                  {t('demo.streetEmptyAction')}
                </Button>
              }
            />
          ) : (
            <div data-street="files-ready">
              <Stack gap="4">
                <Typography variant="heading-2">{t('demo.streetFilesReady')}</Typography>
                <Card padding="lg">
                  <ul className="cu-street__list">
                    {files.map((file) => (
                      <li key={file} className="cu-street__row">
                        <span>{file}</span>
                        <span className="cu-street__meta">{t('demo.streetFileMeta')}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Button variant="outline" onClick={clearFiles} data-street="clear-files">
                  {t('demo.streetClearFiles')}
                </Button>
              </Stack>
            </div>
          )
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
