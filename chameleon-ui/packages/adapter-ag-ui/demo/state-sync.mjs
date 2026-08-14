/**
 * Runnable AG-UI state-sync demo (no network; in-memory transport).
 * Run: pnpm --filter @chameleon-ui/adapter-ag-ui build && pnpm --filter @chameleon-ui/adapter-ag-ui demo
 */
import { createAgUiPeerPair } from '../dist/index.js'

const { agent, frontend } = createAgUiPeerPair({ query: '', results: 0 })

const transcript = []
agent.onEvent((event) => transcript.push(`agent   <- ${event.type} (${event.origin})`))
frontend.onEvent((event) => transcript.push(`frontend <- ${event.type} (${event.origin})`))

transcript.push('— user types into the search input (frontend edit)')
frontend.setLocalState({ query: 'cham', results: 0 })

transcript.push('— agent answers with a state delta')
agent.pushDelta([{ op: 'replace', path: '/results', value: 3 }])

transcript.push('— link drops, user keeps typing, link recovers')
agent.disconnect()
frontend.setLocalState({ query: 'chameleon', results: 3 })
agent.reconnect()

console.log(
  [
    'AG-UI state-sync demo transcript',
    '================================',
    ...transcript,
    '--------------------------------',
    `final agent state:    ${JSON.stringify(agent.getState())}`,
    `final frontend state: ${JSON.stringify(frontend.getState())}`,
    `in sync: ${JSON.stringify(agent.getState()) === JSON.stringify(frontend.getState())}`,
    '',
  ].join('\n'),
)
