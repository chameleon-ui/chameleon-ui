import { Card, EmptyState, Tag, Timeline, Typography } from '@chameleon-ui/components'
import type { TimelineItem } from '@chameleon-ui/components'
import { createBlockCopy } from '../copy.js'
import { ganttLocaleTrees } from './locale-map.js'
import './styles.css'

export type GanttTaskStatus = 'on-track' | 'at-risk'

export interface GanttTask {
  id: string
  title: string
  start: string
  end: string
  status: GanttTaskStatus
}

export interface GanttProps {
  locale?: string
  tasks?: GanttTask[]
  onSelectTask?: (task: GanttTask) => void
  /** ISO date for the today marker; defaults to UTC today. Pass null to hide. */
  today?: string | null
  className?: string
}

const DAY_MS = 24 * 60 * 60 * 1000

const DEFAULT_TASKS: GanttTask[] = [
  { id: 'task-1', title: 'Design system', start: '2026-08-01', end: '2026-08-10', status: 'on-track' },
  { id: 'task-2', title: 'Auth blocks', start: '2026-08-06', end: '2026-08-16', status: 'on-track' },
  { id: 'task-3', title: 'Scene coverage', start: '2026-08-12', end: '2026-08-22', status: 'at-risk' },
]

function utcDay(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return Number.NaN
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

function toISODate(ms: number) {
  const date = new Date(ms)
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
}

function barStyle(task: GanttTask, rangeStart: number, rangeEnd: number) {
  const start = utcDay(task.start)
  const end = utcDay(task.end)
  const span = Math.max(rangeEnd - rangeStart, DAY_MS)
  const inset = ((start - rangeStart) / span) * 100
  const width = Math.max(((end - start) / span) * 100, 2)
  return {
    insetInlineStart: `${Math.max(0, inset)}%`,
    inlineSize: `${Math.min(100, width)}%`,
  }
}

function buildTicks(rangeStart: number, rangeEnd: number, maxTicks = 8) {
  const spanDays = Math.max(1, Math.round((rangeEnd - rangeStart) / DAY_MS))
  const step = Math.max(1, Math.ceil(spanDays / maxTicks))
  const ticks: { iso: string; pct: number }[] = []
  for (let day = 0; day <= spanDays; day += step) {
    const ms = rangeStart + day * DAY_MS
    const pct = ((ms - rangeStart) / Math.max(rangeEnd - rangeStart, DAY_MS)) * 100
    ticks.push({ iso: toISODate(ms), pct: Math.min(100, pct) })
  }
  if (ticks[ticks.length - 1]?.iso !== toISODate(rangeEnd)) {
    ticks.push({ iso: toISODate(rangeEnd), pct: 100 })
  }
  return ticks
}

export function Gantt({
  locale = 'en',
  tasks = DEFAULT_TASKS,
  onSelectTask,
  today,
  className,
}: GanttProps) {
  const { t } = createBlockCopy(ganttLocaleTrees, locale)
  const classes = ['cu-block-gantt', className].filter(Boolean).join(' ')
  const timestamps = tasks.flatMap((task) => [utcDay(task.start), utcDay(task.end)]).filter((value) => Number.isFinite(value))
  const rangeStart = timestamps.length > 0 ? Math.min(...timestamps) : 0
  const rangeEnd = timestamps.length > 0 ? Math.max(...timestamps) : DAY_MS
  const startLabel = tasks.length > 0 ? tasks.reduce((min, task) => (task.start < min ? task.start : min), tasks[0]!.start) : ''
  const endLabel = tasks.length > 0 ? tasks.reduce((max, task) => (task.end > max ? task.end : max), tasks[0]!.end) : ''
  const ticks = tasks.length > 0 ? buildTicks(rangeStart, rangeEnd) : []
  const todayIso =
    today === null
      ? null
      : today ??
        (() => {
          const now = new Date()
          return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`
        })()
  const todayMs = todayIso ? utcDay(todayIso) : Number.NaN
  const todayPct =
    Number.isFinite(todayMs) && todayMs >= rangeStart && todayMs <= rangeEnd
      ? ((todayMs - rangeStart) / Math.max(rangeEnd - rangeStart, DAY_MS)) * 100
      : null

  const milestones: TimelineItem[] = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    time: `${task.start} → ${task.end}`,
    description: t(task.status === 'at-risk' ? 'gantt.statusAtRisk' : 'gantt.statusOnTrack'),
  }))

  return (
    <section
      className={classes}
      data-ai-role="gantt"
      data-ai-intent="schedule-tasks"
      data-ai-state={tasks.length === 0 ? 'empty' : 'default'}
    >
      <div>
        <Typography variant="heading-1">{t('gantt.title')}</Typography>
        <Typography variant="body">{t('gantt.subtitle')}</Typography>
        <p className="cu-block-gantt__meta">{t('gantt.taskCount', { count: tasks.length })}</p>
        {tasks.length > 0 ? (
          <p className="cu-block-gantt__meta">{t('gantt.rangeLabel', { start: startLabel, end: endLabel })}</p>
        ) : null}
      </div>
      <Card padding="md" variant="outlined">
        {tasks.length === 0 ? (
          <EmptyState description={t('gantt.emptyDescription')} title={t('gantt.emptyTitle')} />
        ) : (
          <div aria-label={t('gantt.scaleLabel')} className="cu-block-gantt__chart" role="list">
            <div aria-hidden="true" className="cu-block-gantt__scale">
              <span className="cu-block-gantt__scale-spacer" />
              <div className="cu-block-gantt__scale-track">
                {ticks.map((tick) => (
                  <span className="cu-block-gantt__tick" key={tick.iso} style={{ insetInlineStart: `${tick.pct}%` }}>
                    {tick.iso.slice(5)}
                  </span>
                ))}
              </div>
            </div>
            {tasks.map((task) => (
              <div className="cu-block-gantt__row" key={task.id} role="listitem">
                <div className="cu-block-gantt__label">
                  <Typography variant="body">{task.title}</Typography>
                  <Tag
                    label={t(task.status === 'at-risk' ? 'gantt.statusAtRisk' : 'gantt.statusOnTrack')}
                    variant={task.status === 'at-risk' ? 'brand' : 'outline'}
                  />
                </div>
                <div className="cu-block-gantt__track">
                  {todayPct !== null ? (
                    <span
                      aria-hidden="true"
                      className="cu-block-gantt__today"
                      style={{ insetInlineStart: `${todayPct}%` }}
                      title={todayIso ?? undefined}
                    />
                  ) : null}
                  <button
                    aria-label={t('gantt.barLabel', { name: task.title, start: task.start, end: task.end })}
                    className="cu-block-gantt__bar"
                    onClick={() => onSelectTask?.(task)}
                    style={barStyle(task, rangeStart, rangeEnd)}
                    type="button"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Timeline emptyLabel={t('gantt.emptyTimeline')} items={milestones} />
    </section>
  )
}
