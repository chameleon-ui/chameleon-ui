import { AppShell, Stack, Typography } from '@chameleon-ui/components'
import { themeIds, type ThemeId } from '@chameleon-ui/themes'
import { useEffect, useMemo, useState } from 'react'
import {
  BLIND_RESULT_FILENAME,
  BLIND_TRIAL_COUNT,
  UNKNOWN_GUESS,
  buildBlindDeck,
  buildBlindTestResult,
  copyText,
  downloadJson,
  recordTrial,
  serializeBlindTestResult,
  type BlindGuess,
  type BlindTestResult,
  type BlindTrial,
} from './blind-test'
import { SuitePreview } from './SuitePreview'

type BlindPhase = 'intro' | 'trial' | 'done'

interface BlindTestViewProps {
  t: (key: string, values?: Record<string, string | number>) => string
}

function applyStimulusTheme(themeId: ThemeId | null) {
  if (themeId) {
    document.documentElement.dataset.theme = themeId
    return
  }
  delete document.documentElement.dataset.theme
}

export function BlindTestView({ t }: BlindTestViewProps) {
  const [phase, setPhase] = useState<BlindPhase>('intro')
  const [testerId, setTesterId] = useState('')
  const [deck, setDeck] = useState<ThemeId[]>([])
  const [index, setIndex] = useState(0)
  const [guess, setGuess] = useState<BlindGuess | ''>('')
  const [trials, setTrials] = useState<BlindTrial[]>([])
  const [startedAt, setStartedAt] = useState<string | null>(null)
  const [completedAt, setCompletedAt] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const currentTheme = phase === 'trial' ? (deck[index] ?? null) : null
  applyStimulusTheme(currentTheme)

  useEffect(() => {
    return () => {
      applyStimulusTheme(null)
    }
  }, [])

  const result: BlindTestResult = useMemo(
    () =>
      buildBlindTestResult({
        status: phase === 'done' ? 'complete' : trials.length > 0 ? 'in_progress' : 'not_run',
        testerId: testerId.trim(),
        startedAt,
        completedAt,
        trials,
      }),
    [phase, testerId, startedAt, completedAt, trials],
  )

  const payload = useMemo(() => serializeBlindTestResult(result), [result])

  function startSession() {
    setDeck(buildBlindDeck())
    setIndex(0)
    setGuess('')
    setTrials([])
    setCopied(false)
    setStartedAt(new Date().toISOString())
    setCompletedAt(null)
    setPhase('trial')
  }

  function lockGuess() {
    if (!guess || currentTheme === null) return
    const nextTrials = [
      ...trials,
      recordTrial({ index, themeId: currentTheme, guess }),
    ]
    setTrials(nextTrials)
    setGuess('')
    setCopied(false)

    if (index + 1 >= BLIND_TRIAL_COUNT) {
      setCompletedAt(new Date().toISOString())
      setPhase('done')
      applyStimulusTheme(null)
      return
    }
    setIndex((current) => current + 1)
  }

  async function onCopy() {
    const ok = await copyText(payload)
    setCopied(ok)
  }

  function onDownload() {
    downloadJson(BLIND_RESULT_FILENAME, payload)
  }

  const exportActions = (
    <Stack direction="row" gap="2">
      <button type="button" className="cu-demo-blind-action" data-blind-action="copy" onClick={() => void onCopy()}>
        {copied ? t('demo.blindCopied') : t('demo.blindCopy')}
      </button>
      <button type="button" className="cu-demo-blind-action" data-blind-action="download" onClick={onDownload}>
        {t('demo.blindDownload')}
      </button>
    </Stack>
  )

  if (phase === 'intro') {
    return (
      <div className="cu-demo-blind" data-blind-phase="intro">
        <AppShell
          header={
            <Stack gap="1">
              <p className="cu-demo-kicker">{t('demo.blindKicker')}</p>
              <Typography variant="heading-2">{t('demo.blindTitle')}</Typography>
            </Stack>
          }
          sidebar={
            <nav aria-label={t('demo.blindGuessLabel')}>
              <ul className="cu-demo-nav">
                {themeIds.map((id) => (
                  <li key={id}>{id}</li>
                ))}
                <li>{t('demo.blindUnknown')}</li>
              </ul>
            </nav>
          }
          sidebarLabel={t('demo.blindGuessLabel')}
        >
          <Stack gap="3">
            <Typography variant="body">{t('demo.blindLead')}</Typography>
            <label className="cu-demo-field">
              {t('demo.blindTesterId')}
              <input
                data-blind="tester-id"
                value={testerId}
                onChange={(event) => setTesterId(event.currentTarget.value)}
              />
            </label>
            <button type="button" className="cu-demo-blind-action" data-blind-action="begin" onClick={startSession}>
              {t('demo.blindBegin')}
            </button>
          </Stack>
        </AppShell>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="cu-demo-blind" data-blind-phase="done">
        <AppShell
          header={
            <Stack gap="1">
              <p className="cu-demo-kicker">{t('demo.blindKicker')}</p>
              <Typography variant="heading-2">{t('demo.blindDoneTitle')}</Typography>
            </Stack>
          }
          sidebar={
            <nav aria-label={t('demo.blindGuessLabel')}>
              <p className="cu-demo-kicker">{t('demo.blindExportHint')}</p>
            </nav>
          }
          sidebarLabel={t('demo.blindGuessLabel')}
        >
          <Stack gap="3">
            <Typography variant="body">
              {t('demo.blindDoneLead', {
                correct: result.summary.correct,
                total: result.summary.answered,
              })}
            </Typography>
            {exportActions}
            <textarea
              readOnly
              className="cu-demo-blind-json"
              data-blind="export"
              aria-label={t('demo.blindCopy')}
              value={payload}
            />
            <button type="button" className="cu-demo-blind-action" data-blind-action="restart" onClick={() => setPhase('intro')}>
              {t('demo.blindRestart')}
            </button>
          </Stack>
        </AppShell>
      </div>
    )
  }

  return (
    <div className="cu-demo-blind" data-blind-phase="trial">
      <div data-blind="stimulus">
        <SuitePreview t={t} />
      </div>
      <aside className="cu-demo-blind-dock" data-blind="dock">
        <Stack gap="2">
          <Typography variant="caption">
            {t('demo.blindProgress', { current: index + 1, total: BLIND_TRIAL_COUNT })}
          </Typography>
          <p className="cu-demo-kicker">{t('demo.blindGuessLabel')}</p>
          <div className="cu-demo-blind-guesses" role="group" aria-label={t('demo.blindGuessLabel')}>
            {themeIds.map((id) => (
              <button
                key={id}
                type="button"
                className="cu-demo-blind-choice"
                data-blind-guess={id}
                aria-pressed={guess === id}
                onClick={() => setGuess(id)}
              >
                {id}
              </button>
            ))}
            <button
              type="button"
              className="cu-demo-blind-choice"
              data-blind-guess={UNKNOWN_GUESS}
              aria-pressed={guess === UNKNOWN_GUESS}
              onClick={() => setGuess(UNKNOWN_GUESS)}
            >
              {t('demo.blindUnknown')}
            </button>
          </div>
          <button
            type="button"
            className="cu-demo-blind-action"
            data-blind-action="submit"
            disabled={!guess}
            onClick={lockGuess}
          >
            {t('demo.blindSubmit')}
          </button>
        </Stack>
      </aside>
    </div>
  )
}
