import { Button, Stack, Typography } from '@chameleon-ui/components'
import type { ThemeListing } from '@chameleon-ui/market-service'
import { useState } from 'react'

export interface DetailPageProps {
  listing: ThemeListing;
  onBack: () => void;
}

export function DetailPage({ listing, onBack }: DetailPageProps) {
  const [installing, setInstalling] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function install() {
    setInstalling(true);
    setResult(null);
    try {
      const targetDir = window.prompt('Install target directory:', './cu-market-out');
      if (!targetDir) {
        setInstalling(false);
        return;
      }
      const res = await fetch(`/api/v1/listings/${encodeURIComponent(listing.id)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDir }),
      });
      const data = (await res.json()) as { result?: { written: string[] }; error?: { message: string } };
      if (res.ok && data.result) {
        setResult(`Installed ${data.result.written.length} file(s): ${data.result.written.join(', ')}`);
      } else {
        setResult(`Install failed: ${data.error?.message ?? res.statusText}`);
      }
    } catch (err) {
      setResult(`Install failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setInstalling(false);
    }
  }

  return (
    <Stack gap="3">
      <Button size="sm" variant="outline" onClick={onBack}>
        ← Back to browse
      </Button>
      <Typography variant="heading-2">{listing.name}</Typography>
      <p className="cu-market-id">{listing.id}</p>
      <p className="cu-market-description">{listing.description}</p>
      <p className="cu-market-status">
        Type: {listing.type === 'registry:rules' ? 'rules pack' : 'theme'}
      </p>
      <p className="cu-market-status">Status: {listing.status}</p>
      <p className="cu-market-pricing" data-pricing={listing.pricing}>
        Pricing: {listing.pricing}
      </p>
      <p>License: {listing.license}</p>
      <Button disabled={installing} onClick={install}>
        {installing ? 'Installing…' : 'Install to project'}
      </Button>
      {result && <p className="cu-market-result" role="status">{result}</p>}
      <Typography variant="heading-2">Validation checks</Typography>
      <ul className="cu-market-checks">
        {listing.validationReport.checks.map((check: { id: string; ok: boolean; message: string }) => (
          <li key={check.id} className={check.ok ? 'cu-market-check-ok' : 'cu-market-check-fail'}>
            {check.ok ? '✓' : '✗'} {check.id}: {check.message}
          </li>
        ))}
      </ul>
    </Stack>
  );
}
