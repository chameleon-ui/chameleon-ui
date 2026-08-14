import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'

function mockFetch(response: unknown) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => response,
    text: async () => JSON.stringify(response),
  } as Response)
}

describe('market app', () => {
  it('renders the marketplace header', async () => {
    mockFetch({ listings: [] })
    render(<App />)
    expect(await screen.findByText('Marketplace')).toBeInTheDocument()
    expect(screen.getByText('Official homage free · Community packs free or paid')).toBeInTheDocument()
  })

  it('displays community listings', async () => {
    mockFetch({
      listings: [
        {
          id: 'community-ocean',
          type: 'registry:theme',
          name: 'Ocean',
          description: 'A blue theme',
          pricing: 'free',
          license: 'MIT',
          files: [],
          status: 'approved',
          submittedAt: new Date().toISOString(),
          validationReport: { ok: true, checks: [] },
        },
        {
          id: 'community-focus-first',
          type: 'registry:rules',
          name: 'Focus First Discipline',
          description: 'Community rules pack',
          pricing: 'free',
          license: 'MIT',
          files: [],
          status: 'approved',
          submittedAt: new Date().toISOString(),
          validationReport: { ok: true, checks: [] },
        },
      ],
    })
    render(<App />)
    await waitFor(() => expect(screen.getByText('Ocean')).toBeInTheDocument())
    expect(screen.getByText('community-ocean')).toBeInTheDocument()
    expect(screen.getByText('Focus First Discipline')).toBeInTheDocument()
    expect(screen.getByText('community-focus-first')).toBeInTheDocument()
    expect(screen.getByText(/Type: rules pack/)).toBeInTheDocument()
  })

  it('navigates to the apply page', async () => {
    mockFetch({ listings: [] })
    render(<App />)
    await screen.findByText('Marketplace')
    await userEvent.click(screen.getByRole('button', { name: 'Apply for listing' }))
    expect(await screen.findByText('Apply for listing')).toBeInTheDocument()
  })
})
