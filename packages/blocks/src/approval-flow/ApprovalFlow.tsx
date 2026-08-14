import { Card, Form, Radio, Result, Steps, Textarea, Typography } from '@chameleon-ui/components'
import type { StepItem } from '@chameleon-ui/components'
import { useState, type FormEvent } from 'react'
import { createBlockCopy } from '../copy.js'
import { approvalFlowLocaleTrees } from './locale-map.js'
import './styles.css'

export type ApprovalDecision = 'approve' | 'reject'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface ApprovalFlowProps {
  locale?: string
  status?: ApprovalStatus
  onDecide?: (payload: { decision: ApprovalDecision; comment: string }) => void
  className?: string
}

export function ApprovalFlow({
  locale = 'en',
  status: initialStatus = 'pending',
  onDecide,
  className,
}: ApprovalFlowProps) {
  const { t } = createBlockCopy(approvalFlowLocaleTrees, locale)
  const [status, setStatus] = useState<ApprovalStatus>(initialStatus)
  const [decision, setDecision] = useState<ApprovalDecision | ''>('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)
  const classes = ['cu-block-approval-flow', className].filter(Boolean).join(' ')
  const currentValue = status === 'pending' ? 'review' : 'done'
  const openCount = status === 'pending' ? 1 : 0

  const items: StepItem[] = [
    { value: 'submit', label: t('approval.stepSubmit'), description: t('approval.stepSubmitHint') },
    { value: 'review', label: t('approval.stepReview'), description: t('approval.stepReviewHint') },
    { value: 'done', label: t('approval.stepDone'), description: t('approval.stepDoneHint') },
  ]

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!decision || !comment.trim()) {
      setError(t('approval.errorRequired'))
      return
    }
    setError(null)
    const next = decision === 'approve' ? 'approved' : 'rejected'
    setStatus(next)
    onDecide?.({ decision, comment: comment.trim() })
  }

  return (
    <section
      className={classes}
      data-ai-role="approval-flow"
      data-ai-intent="review-request"
      data-ai-state={status}
    >
      <Typography variant="heading-1">{t('approval.title')}</Typography>
      <Typography variant="body">{t('approval.subtitle')}</Typography>
      <p className="cu-block-approval-flow__meta">{t('approval.requestCount', { count: openCount })}</p>
      <Steps currentValue={currentValue} items={items} label={t('approval.stepsLabel')} />
      <Card className="cu-block-approval-flow__panel" padding="lg" variant="outlined">
        <Typography variant="heading-2">{t('approval.subject')}</Typography>
        {status === 'pending' ? (
          <>
            {error ? (
              <p className="cu-block-approval-flow__error" role="alert">
                {error}
              </p>
            ) : null}
            <Form onSubmit={handleSubmit} submitLabel={t('approval.submit')}>
              <Radio
                label={t('approval.decisionLabel')}
                name="approval-decision"
                onChange={(value) => setDecision(value as ApprovalDecision)}
                options={[
                  { value: 'approve', label: t('approval.approve') },
                  { value: 'reject', label: t('approval.reject') },
                ]}
                value={decision}
              />
              <Textarea label={t('approval.commentLabel')} onChange={setComment} value={comment} />
            </Form>
          </>
        ) : (
          <Result
            description={status === 'approved' ? t('approval.successBody') : t('approval.rejectedBody')}
            status={status === 'approved' ? 'success' : 'error'}
            title={status === 'approved' ? t('approval.successTitle') : t('approval.rejectedTitle')}
          />
        )}
      </Card>
    </section>
  )
}
