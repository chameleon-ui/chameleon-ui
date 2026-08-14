import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useEffect, useState } from 'react'
import { getTranslator } from '../messages'

interface GapTableData {
  gapCount?: number
  greenCount?: number
  ownerForGaps?: string
  etaForGaps?: string
  rows?: Array<{
    language: string
    page: string
    status: string
    eta: string | null
    owner: string | null
    legacy: string | null
    note: string
  }>
}

export default function GapTable() {
  const { i18n } = useDocusaurusContext()
  const { t } = getTranslator(i18n?.currentLocale ?? 'zh-CN')
  const [table, setTable] = useState<GapTableData | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/compliance/locale-gap-table.json')
      .then((response) => (response.ok ? response.json() : null))
      .then((data: GapTableData | null) => {
        if (!cancelled) setTable(data)
      })
      .catch(() => {
        if (!cancelled) setTable(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const gaps = (table?.rows ?? []).filter((row) => row.status !== 'green').slice(0, 40)

  return (
    <div>
      <p className="cu-docs-banner" data-docs="marketing-gap">
        {t('docs.gapsMarketing')}
      </p>
      {table ? (
        <ul className="cu-docs-list" data-docs="gap-summary">
          <li>green: {table.greenCount}</li>
          <li>gaps: {table.gapCount}</li>
          <li>ETA: {table.etaForGaps}</li>
          <li>owner: {table.ownerForGaps}</li>
        </ul>
      ) : null}
      <table className="cu-docs-table" data-docs="gap-preview">
        <thead>
          <tr>
            <th>language</th>
            <th>page</th>
            <th>ETA</th>
            <th>owner</th>
            <th>id</th>
          </tr>
        </thead>
        <tbody>
          {gaps.map((row) => (
            <tr key={`${row.language}-${row.page}`}>
              <td>{row.language}</td>
              <td>{row.page}</td>
              <td>{row.eta ?? '—'}</td>
              <td>{row.owner ?? '—'}</td>
              <td>{row.legacy ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <a className="cu-docs-link" href="/compliance/locale-gap-table.md">
          /compliance/locale-gap-table.md
        </a>
      </p>
    </div>
  )
}
