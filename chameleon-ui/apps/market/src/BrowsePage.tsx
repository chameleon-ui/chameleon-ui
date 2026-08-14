import { Button, Stack, Typography } from '@chameleon-ui/components'
import type { ThemeListing } from '@chameleon-ui/market-service'

export interface BrowsePageProps {
  listings: ThemeListing[] | null;
  onSelect: (id: string) => void;
}

export function BrowsePage({ listings, onSelect }: BrowsePageProps) {
  if (listings === null) {
    return <p className="cu-market-empty">Loading marketplace listings…</p>;
  }
  if (listings.length === 0) {
    return <p className="cu-market-empty">No listings yet. Official homage themes ship free; community packs may be free or paid.</p>;
  }
  return (
    <Stack gap="3">
      <Typography variant="heading-2">Marketplace listings</Typography>
      {listings.map((listing) => (
        <article key={listing.id} className="cu-market-card" data-market-id={listing.id}>
          <Stack direction="row" gap="2" justify="between" align="center">
            <div>
              <Typography variant="heading-2">{listing.name}</Typography>
              <p className="cu-market-id">{listing.id}</p>
              <p className="cu-market-status">
                Type: {listing.type === 'registry:rules' ? 'rules pack' : 'theme'} · Status:{' '}
                {listing.status}
              </p>
            </div>
            <Stack direction="row" gap="2" align="center">
              <span className="cu-market-pricing" data-pricing={listing.pricing}>
                {listing.pricing}
              </span>
              <Button size="sm" variant="outline" onClick={() => onSelect(listing.id)}>
                Details
              </Button>
            </Stack>
          </Stack>
        </article>
      ))}
    </Stack>
  );
}
