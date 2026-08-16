import './styles.css'

export interface PipelineStage {
  id: string
  name: string
  status: 'pending' | 'running' | 'success' | 'failed'
}

export interface PipelineViewProps {
  stages: PipelineStage[]
  label: string
  statusLabels?: Partial<Record<PipelineStage['status'], string>>
  className?: string
}

const DEFAULT_STATUS_LABELS: Record<PipelineStage['status'], string> = {
  pending: 'Pending',
  running: 'Running',
  success: 'Succeeded',
  failed: 'Failed',
}

export function PipelineView({ stages, label, statusLabels, className }: PipelineViewProps) {
  const classes = ['cu-pipeline-view', className].filter(Boolean).join(' ')
  const labels = { ...DEFAULT_STATUS_LABELS, ...statusLabels }

  return (
    <section
      className={classes}
      aria-label={label}
      data-ai-role="pipeline-view" data-ai-intent="show-progress"
      data-ai-state={stages.length === 0 ? 'empty' : 'default'}
    >
      <ol className="cu-pipeline-view__stages">
        {stages.map((stage) => (
          <li key={stage.id} className={'cu-pipeline-view__stage cu-pipeline-view__stage--' + stage.status}>
            <span className="cu-pipeline-view__name">{stage.name}</span>
            <span className="cu-pipeline-view__status">{labels[stage.status]}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
