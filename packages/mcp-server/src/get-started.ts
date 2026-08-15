import { THEME_IDS } from './constants.js'
import { catalogSummaryForAgents } from './catalog-summary.js'
import { consumerImportSpecifiers, DEFAULT_THEME_ID } from './specifiers.js'

export const MCP_INSTRUCTIONS = [
  'Chameleon UI consumer session.',
  'On first use call get_started.',
  'Always import umbrella CSS: @chameleon-ui/react/css or @chameleon-ui/vue/css.',
  'Wrap the app in ThemeProvider with theme="line" (flagship) unless the user named another theme.',
  'Use exactly one umbrella: @chameleon-ui/react OR @chameleon-ui/vue.',
  'Before writing any import call get_import_specifiers.',
  'Never invent CSS paths, never write workspace:*, never import .../variables.css (unexported).',
].join(' ')

/** Structured bootstrap payload for consumer agents. */
export function getStartedPayload() {
  const catalog = catalogSummaryForAgents()
  const specifiers = consumerImportSpecifiers(DEFAULT_THEME_ID)

  return {
    must: {
      css: {
        react: '@chameleon-ui/react/css',
        vue: '@chameleon-ui/vue/css',
        note: 'Import once in the app entry. Prefer umbrella CSS (tokens + density + line).',
      },
      themeProvider: {
        theme: DEFAULT_THEME_ID,
        localeExample: 'zh-CN',
        note: 'Wrap the root. Flagship product chrome is line.',
      },
      umbrella: {
        pickOne: ['@chameleon-ui/react', '@chameleon-ui/vue'],
        neverBoth: true,
      },
    },
    catalogSummary: catalog,
    themes: {
      flagship: DEFAULT_THEME_ID,
      official: [...THEME_IDS],
      note: 'Other ids are quantified tribute overlays. Prefer line unless the consumer named another.',
    },
    toolOrder: [
      'get_started',
      'get_import_specifiers',
      'search_components',
      'list_components',
      'get_contract',
      'get_design_rules',
      'install_with_theme',
    ],
    templates: {
      react: 'templates/external-vite-react',
      vue: 'templates/external-vite-vue',
      unpublished: specifiers.unpublishedLink,
    },
    preferredImports: specifiers.preferred,
    never: [
      ...specifiers.never,
      'Invent Tailwind/custom CSS as a substitute for Chameleon theme CSS',
      'Compose Sidebar + TabBar instead of Navigation',
      'Treat adapter-ag-ui as supported (POC only)',
    ],
    next: {
      writeImports: 'Call get_import_specifiers then copy preferred CSS/JS paths exactly.',
      pickComponent: 'search_components with intent, or list_components by family, then get_contract.',
    },
  }
}
