import { Button, Card, EmptyState, Form, Input, Steps, Timeline, Typography } from '@chameleon-ui/components'
import type { TimelineItem } from '@chameleon-ui/components'
import { useState, type FormEvent } from 'react'
import { createBlockCopy } from '../copy.js'
import { ticketFlowLocaleTrees } from './locale-map.js'
import './styles.css'

export type TicketStep = 'open' | 'triage' | 'progress' | 'resolved'

export interface TicketNote {
  id: string
  title: string
  time: string
  description?: string
}

export interface TicketFlowProps {
  locale?: string
  notes?: TicketNote[]
  currentStep?: TicketStep
  onNote?: (note: TicketNote) => void
  onAdvance?: (step: TicketStep) => void
  className?: string
}

const STEPS: TicketStep[] = ['open', 'triage', 'progress', 'resolved']

const DEFAULT_NOTES: TicketNote[] = [
  {
    id: 'note-1',
    title: 'Ticket opened',
    time: '2026-08-12',
    description: 'Reporter filed the request.',
  },
  {
    id: 'note-2',
    title: 'Needs a repro',
    time: '2026-08-13',
    description: 'Waiting on steps to reproduce.',
  },
]

function stepLabelKey(step: TicketStep) {
  if (step === 'open') return 'ticket.stepOpen'
  if (step === 'triage') return 'ticket.stepTriage'
  if (step === 'progress') return 'ticket.stepProgress'
  return 'ticket.stepResolved'
}

function nextStep(step: TicketStep): TicketStep | null {
  const index = STEPS.indexOf(step)
  return STEPS[index + 1] ?? null
}

export function TicketFlow({
  locale = 'en',
  notes: initialNotes = DEFAULT_NOTES,
  currentStep: initialStep = 'triage',
  onNote,
  onAdvance,
  className,
}: TicketFlowProps) {
  const { t } = createBlockCopy(ticketFlowLocaleTrees, locale)
  const [notes, setNotes] = useState<TicketNote[]>(initialNotes)
  const [currentStep, setCurrentStep] = useState<TicketStep>(initialStep)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const classes = ['cu-block-ticket-flow', className].filter(Boolean).join(' ')
  const upcoming = nextStep(currentStep)
  const aiState = notes.length === 0 ? 'empty' : currentStep === 'resolved' ? 'complete' : 'default'

  const stepItems = STEPS.map((value) => ({
    value,
    label: t(stepLabelKey(value)),
  }))

  const timelineItems: TimelineItem[] = notes.map((note) => ({
    id: note.id,
    title: note.title,
    time: note.time,
    description: note.description,
  }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) {
      setError(t('ticket.errorRequired'))
      return
    }
    const note: TicketNote = {
      id: `note-${Date.now()}`,
      title: trimmed,
      time: t(stepLabelKey(currentStep)),
    }
    setNotes((current) => [...current, note])
    setDraft('')
    setError(null)
    onNote?.(note)
  }

  const handleAdvance = () => {
    if (!upcoming) return
    const note: TicketNote = {
      id: `advance-${Date.now()}`,
      title: t('ticket.eventAdvanced', { stage: t(stepLabelKey(upcoming)) }),
      time: t(stepLabelKey(upcoming)),
    }
    setCurrentStep(upcoming)
    setNotes((current) => [...current, note])
    onAdvance?.(upcoming)
  }

  return (
    <section
      className={classes}
      data-ai-role="ticket-flow"
      data-ai-intent="progress-ticket"
      data-ai-state={aiState}
    >
      <div className="cu-block-ticket-flow__header">
        <div>
          <Typography variant="heading-1">{t('ticket.title')}</Typography>
          <Typography variant="body">{t('ticket.subtitle')}</Typography>
          <p className="cu-block-ticket-flow__meta">{t('ticket.noteCount', { count: notes.length })}</p>
        </div>
        {upcoming ? (
          <Button onClick={handleAdvance} type="button" variant="outline">
            {t('ticket.advance')}
          </Button>
        ) : null}
      </div>
      <Steps currentValue={currentStep} items={stepItems} label={t('ticket.stepsLabel')} />
      <Card padding="md" variant="outlined">
        {error ? (
          <p className="cu-block-ticket-flow__error" role="alert">
            {error}
          </p>
        ) : null}
        <Form onSubmit={handleSubmit} submitLabel={t('ticket.submit')}>
          <Input invalid={Boolean(error)} label={t('ticket.noteLabel')} onChange={setDraft} value={draft} />
        </Form>
      </Card>
      {notes.length === 0 ? (
        <EmptyState description={t('ticket.emptyDescription')} title={t('ticket.emptyTitle')} />
      ) : (
        <Timeline emptyLabel={t('ticket.emptyTimeline')} items={timelineItems} />
      )}
    </section>
  )
}
