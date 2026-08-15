import { Button, Stack, Typography } from '@chameleon-ui/components'
import {
  listingApplicationFromThemeStudioExport,
  parseThemeStudioExport,
  type ListingApplication,
  type ListingType,
  type ThemeStudioExportPayload,
} from '@chameleon-ui/market-service'
import { useState } from 'react'

export interface ApplyPageProps {
  /** Called after a successful apply; pass listing id when known. */
  onDone: (listingId?: string) => void
}

function rulesFiles(id: string, license: string): ListingApplication['files'] {
  return [
    {
      path: `rules/${id}/design-rules.json`,
      content: JSON.stringify({
        version: '1.0',
        typography: { scale: 'major-third', lineHeightBody: 1.5 },
        spacing: { rhythm: 8 },
        colorBoundaries: { accentUsage: 'primary-actions-only' },
        rtl: { supported: true, strategy: 'logical-properties-only' },
        forbiddenPatterns: ['invisible-focus-ring'],
      }),
    },
    {
      path: `rules/${id}/meta.json`,
      content: JSON.stringify({ id, kind: 'community', pricing: { paid: false } }),
    },
    { path: `rules/${id}/LICENSE`, content: `${license} License` },
  ]
}

function themeFiles(license: string): ListingApplication['files'] {
  return [
    {
      path: 'design-rules.json',
      content: JSON.stringify({
        version: '1.0',
        typography: { scale: 'major-third', lineHeightBody: 1.5 },
        spacing: { rhythm: 8 },
        colorBoundaries: { accentUsage: 'primary-actions-only' },
        rtl: { supported: true, strategy: 'logical-properties-only' },
      }),
    },
    { path: 'LICENSE', content: `${license} License` },
    {
      path: 'theme.css',
      content: '/* a11y: focus-visible outline for keyboard navigation */\nbody { margin-inline: 1rem; }',
    },
  ]
}

export function ApplyPage({ onDone }: ApplyPageProps) {
  const [id, setId] = useState('community-')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ListingType>('registry:theme')
  const [pricing, setPricing] = useState<'free' | 'paid'>('free')
  const [license, setLicense] = useState('MIT')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [studioPayload, setStudioPayload] = useState<ThemeStudioExportPayload | null>(null)
  const [importNote, setImportNote] = useState<string | null>(null)

  function applyStudioDefaults(payload: ThemeStudioExportPayload, listingId: string) {
    const base = payload.extends || payload.themeId
    const label = payload.meta?.label ?? base
    setStudioPayload(payload)
    setType('registry:theme')
    setId(listingId)
    setName((prev) => prev || String(label))
    setDescription(
      (prev) =>
        prev ||
        String(payload.meta?.description ?? `Theme Studio export derived from ${base} ($extends delta).`),
    )
    setImportNote(
      `Imported Theme Studio export (base: ${base}). Files will be built from the export on submit.`,
    )
  }

  async function onImportStudioFile(file: File | undefined) {
    setImportNote(null)
    setResult(null)
    if (!file) return
    try {
      const text = await file.text()
      const parsed = parseThemeStudioExport(JSON.parse(text) as unknown)
      const suggestedId =
        id.startsWith('community-') && id.length > 'community-'.length
          ? id
          : `community-${parsed.themeId}-studio`
      applyStudioDefaults(parsed, suggestedId)
    } catch (err) {
      setStudioPayload(null)
      setImportNote(err instanceof Error ? err.message : String(err))
    }
  }

  function clearStudioImport() {
    setStudioPayload(null)
    setImportNote(null)
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setResult(null)

    let application: ListingApplication
    try {
      if (studioPayload) {
        application = listingApplicationFromThemeStudioExport(studioPayload, {
          id,
          name,
          description,
          pricing,
          license,
        })
      } else {
        application = {
          id,
          type,
          name,
          description,
          pricing,
          license,
          files: type === 'registry:rules' ? rulesFiles(id, license) : themeFiles(license),
          dependencies: [],
        }
      }
    } catch (err) {
      setResult(`Build failed: ${err instanceof Error ? err.message : String(err)}`)
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/v1/listings/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      })
      const data = (await res.json()) as {
        listing?: { id: string; status: string }
        error?: { message: string }
      }
      if (res.ok && data.listing) {
        setResult(`Application submitted. Status: ${data.listing.status}`)
        onDone(data.listing.id)
      } else {
        setResult(`Application rejected: ${data.error?.message ?? res.statusText}`)
      }
    } catch (err) {
      setResult(`Submission failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack gap="3">
      <Typography variant="heading-2">Apply for listing</Typography>

      <section className="cu-market-import" aria-label="Import Theme Studio export">
        <p className="cu-market-import-title">Import Theme Studio export</p>
        <p className="cu-market-hint">
          Drop a <code>*-export.json</code> from Theme Studio (<code>generator=theme-studio</code>).
          Maps to a community theme listing, then Browse → Install as usual.
        </p>
        <label className="cu-market-field">
          Studio export JSON
          <input
            accept="application/json,.json"
            type="file"
            data-market="studio-import"
            onChange={(e) => void onImportStudioFile(e.currentTarget.files?.[0])}
          />
        </label>
        {studioPayload ? (
          <Stack direction="row" gap="2">
            <p className="cu-market-result" role="status" data-market="studio-import-ok">
              {importNote}
            </p>
            <Button type="button" size="sm" variant="outline" onClick={clearStudioImport}>
              Clear import
            </Button>
          </Stack>
        ) : importNote ? (
          <p className="cu-market-error" role="alert" data-market="studio-import-error">
            {importNote}
          </p>
        ) : null}
      </section>

      <form className="cu-market-form" onSubmit={(e) => void submit(e)}>
        <label className="cu-market-field">
          Listing id
          <input
            required
            value={id}
            onChange={(e) => setId(e.currentTarget.value)}
            placeholder="community-your-theme"
          />
        </label>
        <p className="cu-market-hint">
          Official homage ids list as free SKUs. Community listings need the community- prefix and
          may be free or paid.
          {studioPayload ? ' Studio imports always become registry:theme community listings.' : ''}
        </p>
        <label className="cu-market-field">
          Name
          <input required value={name} onChange={(e) => setName(e.currentTarget.value)} />
        </label>
        <label className="cu-market-field">
          Description
          <textarea value={description} onChange={(e) => setDescription(e.currentTarget.value)} />
        </label>
        <label className="cu-market-field">
          Listing type
          <select
            value={type}
            disabled={Boolean(studioPayload)}
            onChange={(e) => setType(e.currentTarget.value as ListingType)}
          >
            <option value="registry:theme">theme</option>
            <option value="registry:rules">rules pack</option>
          </select>
        </label>
        <label className="cu-market-field">
          Pricing zone
          <select
            value={pricing}
            onChange={(e) => setPricing(e.currentTarget.value as 'free' | 'paid')}
          >
            <option value="free">free</option>
            <option value="paid">paid (community packs only)</option>
          </select>
        </label>
        <label className="cu-market-field">
          License
          <input value={license} onChange={(e) => setLicense(e.currentTarget.value)} />
        </label>
        <Stack direction="row" gap="2">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit'}
          </Button>
          <Button type="button" variant="outline" onClick={() => onDone()}>
            Cancel
          </Button>
        </Stack>
      </form>
      {result && (
        <p className="cu-market-result" role="status">
          {result}
        </p>
      )}
    </Stack>
  )
}
