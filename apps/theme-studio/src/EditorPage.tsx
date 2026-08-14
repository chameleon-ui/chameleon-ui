import { Button, Input, Stack, Typography } from '@chameleon-ui/components'
import { themeIds, type ThemeId } from '@chameleon-ui/themes'
import { useEffect, useMemo, useState } from 'react'
import type { DesignRules } from '@chameleon-ui/themes'
import { cloneRules, themeBundles } from './themeData'
import { applyTheme } from './theme'
import { formatValidationIssues, validateDesignRules } from './validateRules'

interface EditorPageProps {
  themeId: ThemeId
  onThemeChange: (themeId: ThemeId) => void
  onNavigateExport: () => void
}

export function EditorPage({ themeId, onThemeChange, onNavigateExport }: EditorPageProps) {
  const baseline = themeBundles[themeId].designRules
  const [rulesText, setRulesText] = useState(() => JSON.stringify(baseline, null, 2))
  const [rules, setRules] = useState<DesignRules>(() => cloneRules(baseline))
  const [parseError, setParseError] = useState<string | null>(null)

  useEffect(() => {
    const next = cloneRules(themeBundles[themeId].designRules)
    setRules(next)
    setRulesText(JSON.stringify(next, null, 2))
    setParseError(null)
    applyTheme(themeId)
  }, [themeId])

  const schemaIssues = useMemo(() => validateDesignRules(rules), [rules])

  function handleRulesChange(nextText: string) {
    setRulesText(nextText)
    try {
      const parsed = JSON.parse(nextText) as DesignRules
      setRules(parsed)
      setParseError(null)
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Invalid JSON')
    }
  }

  function resetRules() {
    const next = cloneRules(themeBundles[themeId].designRules)
    setRules(next)
    setRulesText(JSON.stringify(next, null, 2))
    setParseError(null)
  }

  const meta = themeBundles[themeId].meta
  const validationSummary =
    parseError ?? (schemaIssues.length > 0 ? formatValidationIssues(schemaIssues) : 'Valid')

  return (
    <div className="cu-studio-layout">
      <header className="cu-studio-header">
        <div>
          <p className="cu-studio-kicker">Theme Studio · Phase 3 Beta</p>
          <Typography variant="heading-2">Editor</Typography>
        </div>
        <Stack align="center" direction="row" gap="2">
          <label className="cu-studio-field">
            Theme
            <select
              data-studio="theme"
              value={themeId}
              onChange={(event) => onThemeChange(event.currentTarget.value as ThemeId)}
            >
              {themeIds.map((id) => (
                <option key={id} value={id}>
                  {themeBundles[id].meta.label} ({id})
                </option>
              ))}
            </select>
          </label>
          <Button size="sm" variant="outline" onClick={resetRules}>
            Reset rules
          </Button>
          <Button size="sm" onClick={onNavigateExport}>
            Export
          </Button>
        </Stack>
      </header>

      <div className="cu-studio-grid">
        <section aria-label="Design rules editor" className="cu-studio-panel">
          <Typography variant="heading-2">design-rules.json</Typography>
          <textarea
            aria-label="Design rules JSON"
            className="cu-studio-editor"
            spellCheck={false}
            value={rulesText}
            onChange={(event) => handleRulesChange(event.currentTarget.value)}
          />
          <p
            className={
              parseError || schemaIssues.length > 0 ? 'cu-studio-status cu-studio-status--error' : 'cu-studio-status cu-studio-status--ok'
            }
            data-studio="validation"
          >
            {validationSummary}
          </p>
        </section>

        <section aria-label="Theme preview" className="cu-studio-panel">
          <Typography variant="heading-2">Preview · {meta.label}</Typography>
          <div className="cu-studio-preview" data-theme={themeId}>
            <Stack gap="3">
              <Typography variant="body">
                Density: <strong>{rules.spacing.density}</strong> · RTL:{' '}
                <strong>{rules.rtl.supported ? 'supported' : 'unsupported'}</strong>
              </Typography>
              <Stack direction="row" gap="2">
                <Button>Primary</Button>
                <Button variant="outline">Outline</Button>
              </Stack>
              <Input label="Sample input" name="preview" placeholder="Type here" value="Preview" onChange={() => {}} />
              <ul className="cu-studio-rule-list">
                {rules.forbiddenPatterns.map((pattern) => (
                  <li key={pattern}>{pattern}</li>
                ))}
              </ul>
            </Stack>
          </div>
        </section>
      </div>
    </div>
  )
}
