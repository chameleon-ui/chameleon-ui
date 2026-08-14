import { Button, Stack, Typography } from '@chameleon-ui/components'
import { useState } from 'react'
import type { ListingApplication, ListingType } from '@chameleon-ui/market-service'

export interface ApplyPageProps {
  onDone: () => void;
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
  ];
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
  ];
}

export function ApplyPage({ onDone }: ApplyPageProps) {
  const [id, setId] = useState('community-');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ListingType>('registry:theme');
  const [pricing, setPricing] = useState<'free' | 'paid'>('free');
  const [license, setLicense] = useState('MIT');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);

    const application: ListingApplication = {
      id,
      type,
      name,
      description,
      pricing,
      license,
      files: type === 'registry:rules' ? rulesFiles(id, license) : themeFiles(license),
      dependencies: [],
    };

    try {
      const res = await fetch('/api/v1/listings/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
      const data = (await res.json()) as { listing?: { status: string }; error?: { message: string } };
      if (res.ok && data.listing) {
        setResult(`Application submitted. Status: ${data.listing.status}`);
      } else {
        setResult(`Application rejected: ${data.error?.message ?? res.statusText}`);
      }
    } catch (err) {
      setResult(`Submission failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack gap="3">
      <Typography variant="heading-2">Apply for listing</Typography>
      <form className="cu-market-form" onSubmit={submit}>
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
          Official homage ids list as free SKUs. Community listings need the community- prefix and may be free or paid.
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
          <select value={type} onChange={(e) => setType(e.currentTarget.value as ListingType)}>
            <option value="registry:theme">theme</option>
            <option value="registry:rules">rules pack</option>
          </select>
        </label>
        <label className="cu-market-field">
          Pricing zone
          <select value={pricing} onChange={(e) => setPricing(e.currentTarget.value as 'free' | 'paid')}>
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
          <Button type="button" variant="outline" onClick={onDone}>
            Cancel
          </Button>
        </Stack>
      </form>
      {result && <p className="cu-market-result" role="status">{result}</p>}
    </Stack>
  );
}
