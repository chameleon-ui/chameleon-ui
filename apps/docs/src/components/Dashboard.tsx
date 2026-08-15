import { useEffect, useState } from 'react'

const BENCH_IDS = [
  'bench.install_success_rate',
  'bench.bundle_install_success_rate',
  'bench.idempotent_reinstall_rate',
  'bench.docs_cta_install_success_rate',
  'bench.conflict_reject_rate',
  'bench.block_install_success_rate',
  'bench.generation_quality',
] as const

const TELEMETRY_IDS = ['telemetry.install', 'telemetry.intent_vs_adopt', 'telemetry.opt_out', 'telemetry.generation_quality'] as const

const TELEMETRY_EVENT = {
  'telemetry.install': 'install',
  'telemetry.intent_vs_adopt': 'intent_vs_adopt',
  'telemetry.opt_out': 'opt_out',
  'telemetry.generation_quality': 'generation_quality',
} as const

interface BenchReport {
  generatedAt?: string
  metrics?: Array<{ id: string; value: number | null; unit?: string; successes?: number; attempts?: number; note?: string }>
}

export default function Dashboard() {
  const [report, setReport] = useState<BenchReport | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/bench/latest.json')
      .then((response) => (response.ok ? response.json() : null))
      .then((data: BenchReport | null) => {
        if (!cancelled) {
          setReport(data)
          setLoaded(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReport(null)
          setLoaded(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const byId = new Map((report?.metrics ?? []).map((metric) => [metric.id, metric]))

  return (
    <div>
      <p className="cu-docs-banner" data-docs="dashboard-empty">
        No live telemetry stream. CU_TELEMETRY defaults to off. Metrics below stay empty until a report is present.
      </p>
      {!report && loaded ? (
        <p>bench/latest.json is not on this docs origin. Run bench:genui then rebuild docs, or use the empty state.</p>
      ) : null}
      <h2>bench.*</h2>
      <table className="cu-docs-table" data-docs="bench-metrics">
        <thead>
          <tr>
            <th>id</th>
            <th>value</th>
            <th>note</th>
          </tr>
        </thead>
        <tbody>
          {BENCH_IDS.map((id) => {
            const metric = byId.get(id)
            const value = metric && metric.value !== null && metric.value !== undefined ? String(metric.value) : '—'
            return (
              <tr key={id} data-metric={id}>
                <td>
                  <code>{id}</code>
                </td>
                <td data-docs="metric-value">{value}</td>
                <td>{metric?.note ?? (loaded && !report ? 'empty' : '')}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <h2>telemetry.*</h2>
      <table className="cu-docs-table" data-docs="telemetry-metrics">
        <thead>
          <tr>
            <th>dashboard id</th>
            <th>dictionary event</th>
            <th>value</th>
          </tr>
        </thead>
        <tbody>
          {TELEMETRY_IDS.map((id) => (
            <tr key={id} data-metric={id}>
              <td>
                <code>{id}</code>
              </td>
              <td>
                <code>{TELEMETRY_EVENT[id]}</code>
              </td>
              <td data-docs="metric-value">—</td>
            </tr>
          ))}
        </tbody>
      </table>
      {report?.generatedAt ? <p>{report.generatedAt}</p> : null}
    </div>
  )
}
