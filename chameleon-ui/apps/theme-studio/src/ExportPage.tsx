import { Button, Stack, Typography } from '@chameleon-ui/components'
import type { ThemeId } from '@chameleon-ui/themes'
import { useMemo, useState } from 'react'
import { themeBundles } from './themeData'
import { diffTokenTrees } from './tokenDelta'
import { formatValidationIssues, validateDesignRules } from './validateRules'

export interface ExportPayload {
  generator: 'theme-studio'
  exportedAt: string
  themeId: ThemeId
  meta: (typeof themeBundles)[ThemeId]['meta']
  /** DTCG $extends delta export: the base theme this export derives from. */
  extends: ThemeId
  /** Delta-only token tree (差量存储); apply over the base theme's tokens.json. */
  tokens: Record<string, unknown>
  /** Token paths removed relative to the base; $extends cannot express removals. */
  removedTokenPaths: string[]
  designRules: (typeof themeBundles)[ThemeId]['designRules']
}

interface ExportPageProps {
  themeId: ThemeId
  rulesOverride: string | null
  onNavigateEditor: () => void
}

export function createExportPayload(
  themeId: ThemeId,
  designRules: ExportPayload['designRules'],
  tokens: Record<string, unknown>,
  meta: ExportPayload['meta'],
): ExportPayload {
  const baseTokens = themeBundles[themeId].tokens
  const { delta, removedPaths } = diffTokenTrees(baseTokens, tokens)
  return {
    generator: 'theme-studio',
    exportedAt: new Date().toISOString(),
    themeId,
    meta,
    extends: themeId,
    tokens: delta,
    removedTokenPaths: removedPaths,
    designRules,
  }
}

function parseRules(themeId: ThemeId, rulesOverride: string | null) {
  if (!rulesOverride) return themeBundles[themeId].designRules
  return JSON.parse(rulesOverride) as (typeof themeBundles)[ThemeId]['designRules']
}

export function ExportPage({ themeId, rulesOverride, onNavigateEditor }: ExportPageProps) {
  const [status, setStatus] = useState<string | null>(null)
  const bundle = themeBundles[themeId]

  const { rules, issues, parseError } = useMemo(() => {
    try {
      const parsed = parseRules(themeId, rulesOverride)
      return {
        rules: parsed,
        issues: validateDesignRules(parsed),
        parseError: null as string | null,
      }
    } catch (error) {
      return {
        rules: bundle.designRules,
        issues: [] as ReturnType<typeof validateDesignRules>,
        parseError: error instanceof Error ? error.message : 'Invalid JSON',
      }
    }
  }, [bundle.designRules, rulesOverride, themeId])

  const canExport = !parseError && issues.length === 0

  function buildPayload(): ExportPayload {
    return createExportPayload(themeId, rules, bundle.tokens, bundle.meta)
  }

  function downloadExport() {
    if (!canExport) {
      setStatus(parseError ?? formatValidationIssues(issues))
      return
    }

    const payload = buildPayload()
    const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${themeId}-export.json`
    anchor.click()
    URL.revokeObjectURL(url)
    setStatus(`Exported ${themeId}-export.json (validate-rules ready)`)

    window.dispatchEvent(
      new CustomEvent('cu:theme-studio:export', {
        detail: { themeId, generator: 'theme-studio' },
      }),
    )
  }

  return (
    <div className="cu-studio-layout">
      <header className="cu-studio-header">
        <div>
          <p className="cu-studio-kicker">Theme Studio · Phase 3 Beta</p>
          <Typography variant="heading-2">Export</Typography>
        </div>
        <Button size="sm" variant="outline" onClick={onNavigateEditor}>
          Back to editor
        </Button>
      </header>

      <section className="cu-studio-panel cu-studio-export">
        <Typography variant="heading-2">{bundle.meta.label}</Typography>
        <p>
          Exports <code>meta.json</code>, a DTCG <code>$extends</code> token delta, and{' '}
          <code>design-rules.json</code> in a single bundle. The delta applies over the base theme
          and is diffable/rollbackable. Export is blocked until schema validation passes.
        </p>
        <Stack direction="row" gap="2">
          <Button disabled={!canExport} onClick={downloadExport}>
            Download export JSON
          </Button>
        </Stack>
        {!canExport ? (
          <p className="cu-studio-status cu-studio-status--error" data-studio="export-validation">
            {parseError ?? formatValidationIssues(issues)}
          </p>
        ) : (
          <p className="cu-studio-status cu-studio-status--ok" data-studio="export-validation">
            Ready — all Phase 3 design-rules groups present and schema-valid.
          </p>
        )}
        {status ? <p className="cu-studio-status">{status}</p> : null}
        <pre className="cu-studio-export-preview">{JSON.stringify(buildPayload(), null, 2)}</pre>
      </section>
    </div>
  )
}
