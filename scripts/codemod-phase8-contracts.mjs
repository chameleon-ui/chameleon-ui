/**
 * Phase 8 one-off codemod (kept for audit): bump every component contract to
 * schemaVersion 0.2 and backfill dataAi.intents from the frozen vocabulary.
 * Run: node scripts/codemod-phase8-contracts.mjs [--check]
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const checkOnly = process.argv.includes('--check')
const invokedDirectly =
  !!process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

/** Frozen Phase 8 intent vocabulary (docs/ai/data-ai-vocabulary.md is the human doc). */
export const INTENT_VOCABULARY = {
  'adjust-value': 'Adjust a numeric value along a range.',
  'cancel': 'Abort or dismiss a reversible action.',
  'choose-action': 'Pick an action from a menu of commands.',
  'choose-option': 'Pick one option from a predefined list.',
  'collapse-section': 'Hide an expandable content section.',
  'collect-input': 'Gather structured input from the user in a modal flow.',
  'compare-options': 'Present richly described options for a single choice.',
  'confirm': 'Confirm a reversible action.',
  'confirm-decision': 'Ask the user to confirm or reject a decision.',
  'dismiss-tag': 'Remove a selected tag or filter token.',
  'enter-long-text': 'Enter multi-line free-form text.',
  'enter-quantity': 'Enter or step a numeric quantity.',
  'enter-text': 'Enter single-line text.',
  'enumerate-items': 'Present an ordered or unordered set of items.',
  'expand-section': 'Reveal a collapsed content section.',
  'explain-on-hover': 'Reveal a short contextual explanation.',
  'filter-selection': 'Narrow a set by selecting filter tokens.',
  'flag-field-error': 'Flag a validation problem next to a field.',
  'flag-status': 'Mark an item with a compact status or count.',
  'fit-safe-area': 'Inset content within the device safe-area edges.',
  'group-content': 'Group related content into a scannable unit.',
  'highlight-count': 'Surface a numeric count that needs attention.',
  'identify-user': 'Represent a user or entity visually.',
  'indicate-busy': 'Show that an indeterminate operation is running.',
  'indicate-loading': 'Show a placeholder while content loads.',
  'inspect-details': 'Read term/description metadata pairs.',
  'inspect-tabular-data': 'Scan and compare rows of structured data.',
  'layout-columns': 'Arrange content in a responsive column layout.',
  'layout-flow': 'Stack content with consistent rhythm.',
  'layout-shell': 'Provide the application frame and primary regions.',
  'name-field': 'Associate a caption with a form control.',
  'navigate': 'Follow a hyperlink to another location.',
  'navigate-detail': 'Open the detail view of a grouped item.',
  'navigate-hierarchy': 'Navigate back up a location hierarchy.',
  'navigate-overlay': 'Navigate within an overlay panel.',
  'navigate-pages': 'Move between pages of a result set.',
  'navigate-sections': 'Switch between top-level sections of the shell.',
  'notify-status': 'Communicate a persistent status message.',
  'notify-transient': 'Communicate a transient confirmation or alert.',
  'present-overlay': 'Present modal or side-sheet content above the page.',
  'preview-detail': 'Preview detail about a hovered target.',
  'prompt-first-action': 'Guide the user to the first action on an empty surface.',
  'reveal-context': 'Reveal contextual content anchored to a trigger.',
  'reveal-detail': 'Reveal detail in a dismissible panel.',
  'search-select': 'Search within options and select one.',
  'select-single': 'Select exactly one option from a small set.',
  'separate-items': 'Separate sibling items in a list or toolbar.',
  'separate-sections': 'Separate content sections visually.',
  'show-progress': 'Show determinate progress toward completion.',
  'show-shortcut': 'Document a keyboard shortcut.',
  'signal-meaning': 'Convey meaning through a glyph.',
  'structure-content': 'Structure content with hierarchical headings.',
  'style-text': 'Style inline or block text with the type scale.',
  'submit': 'Submit a form or trigger the primary action.',
  'submit-data': 'Submit a group of fields as one unit.',
  'switch-view': 'Switch between peer views in the same region.',
  'toggle-option': 'Toggle one option in a multi-select set.',
  'toggle-setting': 'Turn a binary setting on or off.',
  'toggle-visibility': 'Toggle visibility of a content region.',
  'upload-file': 'Choose a file from the device for upload.',
  'visualize-data': 'Render quantitative values as a chart, sparkline, heatmap, or gauge.',
  'pan-canvas': 'Pan, zoom, or inspect a 2D canvas surface.',
  'connect-nodes': 'Draw or represent a connection between canvas nodes.',
  'compose-rich-text': 'Author rich text with inline formatting commands.',
  'render-markup': 'Render Markdown or other markup as readable content.',
  'share-content': 'Share a URL or content payload to a chosen target.',
  'pick-datetime': 'Pick a calendar date and/or clock time.',
  'rate-item': 'Assign a discrete rating to an item.',
  'copy-snippet': 'Copy a code sample to the clipboard.',
}

/** Per-component intent registration (primary intent first). */
export const COMPONENT_INTENTS = {
  'accordion': ['expand-section', 'collapse-section'],
  'action-sheet': ['choose-action'],
  'alert': ['notify-status'],
  'app-shell': ['layout-shell', 'navigate-sections'],
  'avatar': ['identify-user'],
  'badge': ['flag-status', 'highlight-count'],
  'breadcrumb': ['navigate-hierarchy'],
  'button': ['submit', 'confirm', 'cancel'],
  'card': ['group-content', 'navigate-detail'],
  'checkbox': ['toggle-option'],
  'chip': ['filter-selection', 'dismiss-tag'],
  'collapse': ['toggle-visibility'],
  'combobox': ['search-select'],
  'description-list': ['inspect-details'],
  'dialog': ['confirm-decision', 'collect-input'],
  'divider': ['separate-sections'],
  'drawer': ['reveal-detail', 'navigate-overlay'],
  'empty-state': ['prompt-first-action'],
  'file-input': ['upload-file'],
  'form': ['submit-data'],
  'grid': ['layout-columns'],
  'heading': ['structure-content'],
  'hover-card': ['preview-detail'],
  'icon': ['signal-meaning'],
  'inline-alert': ['flag-field-error'],
  'input': ['enter-text'],
  'kbd': ['show-shortcut'],
  'label': ['name-field'],
  'link': ['navigate'],
  'list': ['enumerate-items'],
  'menu': ['choose-action'],
  'number-input': ['enter-quantity'],
  'pagination': ['navigate-pages'],
  'popover': ['reveal-context'],
  'progress': ['show-progress'],
  'radio': ['select-single'],
  'radio-card': ['select-single', 'compare-options'],
  'safe-area': ['fit-safe-area'],
  'select': ['choose-option'],
  'separator': ['separate-items'],
  'sheet': ['present-overlay'],
  'sidebar': ['navigate-sections'],
  'skeleton': ['indicate-loading'],
  'slider': ['adjust-value'],
  'spinner': ['indicate-busy'],
  'stack': ['layout-flow'],
  'switch': ['toggle-setting'],
  'tab-bar': ['navigate-sections'],
  'table': ['inspect-tabular-data'],
  'tabs': ['switch-view'],
  'textarea': ['enter-long-text'],
  'toast': ['notify-transient'],
  'tooltip': ['explain-on-hover'],
  'typography': ['style-text'],
  'article-card': ['group-content', 'navigate-detail'],
  'calendar': ['pick-datetime'],
  'canvas-base': ['pan-canvas'],
  'canvas-toolbar': ['choose-action'],
  'carousel': ['switch-view'],
  'chart': ['visualize-data'],
  'chat-bubble': ['notify-status'],
  'code-block': ['copy-snippet', 'style-text'],
  'color-picker': ['choose-option'],
  'comment-thread': ['enumerate-items'],
  'confirm-dialog': ['confirm-decision'],
  'data-grid': ['inspect-tabular-data'],
  'date-picker': ['pick-datetime'],
  'edge': ['connect-nodes'],
  'editor': ['compose-rich-text'],
  'flow-node': ['group-content'],
  'gauge': ['visualize-data', 'show-progress'],
  'graph-view': ['enumerate-items'],
  'heatmap': ['visualize-data'],
  'image': ['signal-meaning'],
  'kpi-dashboard': ['highlight-count', 'group-content'],
  'loading-bar': ['show-progress', 'indicate-busy'],
  'markdown-renderer': ['render-markup'],
  'mind-map': ['enumerate-items'],
  'multi-select': ['toggle-option', 'search-select'],
  'notification': ['notify-status'],
  'otp-input': ['enter-text'],
  'password-input': ['enter-text'],
  'pipeline-view': ['show-progress'],
  'rating': ['rate-item'],
  'result': ['notify-status'],
  'search-bar': ['search-select'],
  'share-panel': ['share-content'],
  'sparkline': ['visualize-data'],
  'statistic': ['highlight-count'],
  'tag': ['filter-selection', 'dismiss-tag'],
  'ticker': ['notify-status'],
  'time-picker': ['pick-datetime'],
  'timeline': ['enumerate-items'],
  'tree': ['navigate-hierarchy'],
  'upload': ['upload-file'],
}

async function main() {
  const catalogPath = join(root, 'packages/components/catalog.json')
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
  const problems = []
  let changed = 0

  for (const component of catalog.components) {
    const slug = component.slug
    const contractPath = join(root, 'packages/components/src', slug, 'contract.json')
    const raw = await readFile(contractPath, 'utf8')
    const contract = JSON.parse(raw)

    const intents = COMPONENT_INTENTS[slug]
    if (!intents) {
      problems.push(`${slug}: no intent registration in COMPONENT_INTENTS`)
      continue
    }
    for (const intent of intents) {
      if (!INTENT_VOCABULARY[intent]) {
        problems.push(`${slug}: intent ${intent} missing from INTENT_VOCABULARY`)
      }
    }

    const next = { ...contract, schemaVersion: '0.2' }
    const dataAi = { ...(contract.dataAi ?? {}) }
    dataAi.role = dataAi.role ?? slug
    if (!Array.isArray(dataAi.states) || dataAi.states.length === 0) {
      dataAi.states = ['default']
    }
    if (!Array.isArray(dataAi.intents) || dataAi.intents.length === 0) {
      dataAi.intents = intents
    }
    next.dataAi = dataAi

    const serialized = `${JSON.stringify(next, null, 2)}\n`
    if (serialized !== raw) {
      changed += 1
      if (checkOnly) {
        problems.push(`${slug}: contract.json is not at schema v0.2 with intents`)
      } else {
        await writeFile(contractPath, serialized, 'utf8')
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(`codemod-phase8-contracts problems:\n - ${problems.join('\n - ')}`)
  }
  console.log(`[codemod-phase8-contracts] ${checkOnly ? 'checked' : 'rewrote'} ${catalog.components.length} contracts; ${changed} needed changes`)
}

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
