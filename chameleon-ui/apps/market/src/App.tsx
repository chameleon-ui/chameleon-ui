import { AppShell, Button, Stack, Typography } from '@chameleon-ui/components'
import { isThemeId, themeIds, type ThemeId } from '@chameleon-ui/themes'
import { useEffect, useState } from 'react'
import type { ThemeListing } from '@chameleon-ui/market-service'
import { ApplyPage } from './ApplyPage'
import { BrowsePage } from './BrowsePage'
import { DetailPage } from './DetailPage'

type MarketPage = { page: 'browse' } | { page: 'detail'; id: string } | { page: 'apply' }

function readTheme(value: string | null): ThemeId {
  return value && isThemeId(value) ? value : 'line'
}

export function App() {
  const [route, setRoute] = useState<MarketPage>(() => ({ page: 'browse' }))
  const [theme, setTheme] = useState<ThemeId>(() =>
    readTheme(new URLSearchParams(window.location.search).get('theme')),
  )
  const [listings, setListings] = useState<ThemeListing[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  function refreshListings() {
    return fetch('/api/v1/listings')
      .then((res) => res.json())
      .then((data: { listings: ThemeListing[] }) => {
        setListings(data.listings)
        setError(null)
        return data.listings
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err))
        return null
      })
  }

  useEffect(() => {
    void refreshListings()
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function navigate(to: MarketPage) {
    setRoute(to)
  }

  async function onApplyDone(listingId?: string) {
    await refreshListings()
    if (listingId) {
      navigate({ page: 'detail', id: listingId })
      return
    }
    navigate({ page: 'browse' })
  }

  const header = (
    <Stack align="center" direction="row" gap="2" justify="between">
      <div>
        <Typography variant="heading-2">Marketplace</Typography>
        <p className="cu-market-kicker">Official homage free · Community packs free or paid</p>
      </div>
      <Stack align="center" direction="row" gap="2">
        <label className="cu-market-field">
          Theme
          <select
            value={theme}
            onChange={(event) => setTheme(readTheme(event.currentTarget.value))}
          >
            {themeIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate({ page: 'browse' })}
        >
          Browse
        </Button>
        <Button
          size="sm"
          variant="solid"
          aria-label="Apply for listing"
          onClick={() => navigate({ page: 'apply' })}
        >
          Apply
        </Button>
      </Stack>
    </Stack>
  )

  let content: React.ReactNode
  if (error) {
    content = <p className="cu-market-error" role="alert">Error: {error}</p>
  } else if (route.page === 'apply') {
    content = <ApplyPage onDone={(listingId) => void onApplyDone(listingId)} />
  } else if (route.page === 'detail') {
    const listing = listings?.find((l) => l.id === route.id)
    content = listing ? (
      <DetailPage listing={listing} onBack={() => navigate({ page: 'browse' })} />
    ) : (
      <p className="cu-market-empty">Listing not found.</p>
    )
  } else {
    content = (
      <BrowsePage
        listings={listings}
        onSelect={(id) => navigate({ page: 'detail', id })}
      />
    )
  }

  return (
    <AppShell
      header={header}
      sidebar={
        <nav aria-label="Marketplace">
          <ul className="cu-market-nav">
            <li>
              <button className="cu-market-link" type="button" onClick={() => navigate({ page: 'browse' })}>
                Browse
              </button>
            </li>
            <li>
              <button className="cu-market-link" type="button" onClick={() => navigate({ page: 'apply' })}>
                Apply
              </button>
            </li>
          </ul>
        </nav>
      }
      sidebarLabel="Marketplace"
    >
      <div className="cu-market-body">{content}</div>
    </AppShell>
  )
}
