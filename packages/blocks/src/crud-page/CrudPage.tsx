import { Card, DataGrid, Dialog, EmptyState, Form, Input, Pagination, Typography } from '@chameleon-ui/components-react'
import type { DataGridColumn } from '@chameleon-ui/components-react'
import { useState, type FormEvent } from 'react'
import { createBlockCopy } from '../copy.js'
import { crudPageLocaleTrees } from './locale-map.js'
import './styles.css'

export interface CrudRecord {
  id: string
  name: string
  status: string
}

export interface CrudPageProps {
  locale?: string
  rows?: CrudRecord[]
  pageSize?: number
  onCreate?: (record: CrudRecord) => void
  className?: string
}

const DEFAULT_ROWS: CrudRecord[] = [
  { id: 'rec-1', name: 'Northwind', status: 'Active' },
  { id: 'rec-2', name: 'Contoso', status: 'Active' },
  { id: 'rec-3', name: 'Fabrikam', status: 'Active' },
]

export function CrudPage({
  locale = 'en',
  rows: initialRows = DEFAULT_ROWS,
  pageSize = 5,
  onCreate,
  className,
}: CrudPageProps) {
  const { t } = createBlockCopy(crudPageLocaleTrees, locale)
  const [rows, setRows] = useState<CrudRecord[]>(initialRows)
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const classes = ['cu-block-crud-page', className].filter(Boolean).join(' ')
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const columns: DataGridColumn<CrudRecord>[] = [
    { key: 'name', header: t('crud.colName'), width: 220 },
    { key: 'status', header: t('crud.colStatus'), width: 160 },
  ]

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError(t('crud.errorRequired'))
      return
    }
    const record: CrudRecord = {
      id: `rec-${Date.now()}`,
      name: trimmed,
      status: t('crud.statusActive'),
    }
    setRows((current) => [record, ...current])
    setName('')
    setError(null)
    setOpen(false)
    setPage(1)
    onCreate?.(record)
  }

  return (
    <section
      className={classes}
      data-ai-role="crud-page"
      data-ai-intent="manage-records"
      data-ai-state={rows.length === 0 ? 'empty' : 'default'}
    >
      <div className="cu-block-crud-page__header">
        <div>
          <Typography variant="heading-1">{t('crud.title')}</Typography>
          <Typography variant="body">{t('crud.subtitle')}</Typography>
          <p className="cu-block-crud-page__meta">{t('crud.itemCount', { count: rows.length })}</p>
        </div>
        <Dialog
          closeLabel={t('crud.close')}
          description={t('crud.dialogDescription')}
          onOpenChange={setOpen}
          open={open}
          title={t('crud.dialogTitle')}
          triggerLabel={t('crud.create')}
        >
          {error ? (
            <p className="cu-block-crud-page__error" role="alert">
              {error}
            </p>
          ) : null}
          <Form onSubmit={handleSubmit} submitLabel={t('crud.submit')}>
            <Input invalid={Boolean(error)} label={t('crud.nameLabel')} onChange={setName} value={name} />
          </Form>
        </Dialog>
      </div>
      <Card padding="md" variant="outlined">
        {rows.length === 0 ? (
          <EmptyState description={t('crud.emptyDescription')} title={t('crud.emptyTitle')} />
        ) : (
          <DataGrid
            columns={columns}
            emptyLabel={t('crud.emptyLabel')}
            getRowId={(row) => row.id}
            height={240}
            label={t('crud.gridLabel')}
            rowHeight={40}
            rows={pageRows}
            width={640}
          />
        )}
      </Card>
      {rows.length > pageSize ? (
        <Pagination currentPage={currentPage} onChange={setPage} totalPages={totalPages} />
      ) : null}
    </section>
  )
}
