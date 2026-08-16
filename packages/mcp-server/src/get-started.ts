import { THEME_IDS } from './constants.js'
import { catalogSummaryForAgents } from './catalog-summary.js'
import { consumerImportSpecifiers, DEFAULT_THEME_ID } from './specifiers.js'

export const MCP_INSTRUCTIONS = [
  'Chameleon UI consumer session.',
  'On first use call get_started.',
  'Always import umbrella CSS: @chameleon-ui/react/css or @chameleon-ui/vue/css.',
  'Wrap the app in ThemeProvider with theme="linear" (flagship) unless the user named another theme.',
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
        note: 'Import once in the app entry. Both @chameleon-ui/react/css and @chameleon-ui/vue/css are real dist/css.css files (tokens + density + line + components). Other themes: @chameleon-ui/react/themes/<id>/css, @chameleon-ui/vue/themes/<id>/css, or @chameleon-ui/themes/<id>/css.',
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
    appChrome: {
      model: 'Tab controller + per-tab stack. Not a marketing navbar.',
      slots: {
        header:
          'NavigationTitle (formerly NavigationBar) → AppShell header / #header (stack title + back). Not TitleBar.',
        navigation: 'Navigation → AppShell navigation / #navigation (one items list; TabBar↔rail↔sidebar).',
        navigationHeader: 'TitleBar → Navigation header / #header (sidebar brand only; compact TabBar hides it). Not NavigationTitle.',
        navigationFooter:
          'NavAccountCard → Navigation footer / #footer (sidebar account+logout; hides collapse toggle). Not AppShell footer.',
        footer:
          'Footer → AppShell footer / #footer (credits/legal). Not NavAccountCard.',
        main: 'children / default slot → screens or WorkspaceSplit / ScrollPane.',
      },
      defaults: {
        footerPlacement: 'auto (compact → end of main scroll; ≥48rem → shell-bottom; shell|main force)',
        sidebarLabel: 'Sidebar',
        landmarks: 'true (React); Vue always landmarks',
        footerSurface: 'transparent (Footer + AppShell __footer)',
        navigationMaxCompactItems: 4,
        navigationCollapsible: 'true (omitted when Navigation footer set)',
        navigationTitleBackLabel: 'Back',
        titleBar:
          'brandInteractive/preventContextMenu/userSelectNone true; density default',
        navAccountCardLogoutLabel: 'Log out',
        workspaceSplitScrollMode: 'shell',
      },
      chromeRowHeight:
        'min-block-size: calc(var(--cu-control-size-active) + 2 * var(--cu-space-1)) on NavigationTitle __frame, Navigation __header, NavAccountCard. Do not hardcode rem.',
      topAlignment:
        '≥48rem: Navigation __frame padding-block-start is env(safe-area-inset-top) only so TitleBar aligns with NavigationTitle.',
      heightChain:
        'html/body/#root|#app block-size 100% → prefer ToastProvider fill → AppShell fills parent (data-cu-shell). Never min-block-size 100dvh or a second data-cu-shell.',
      never: [
        'Compose Sidebar + TabBar instead of Navigation',
        'Put NavAccountCard in AppShell footer',
        'Put TitleBar in AppShell header (that slot is NavigationTitle)',
        'Confuse NavigationTitle (stack) with TitleBar (sidebar brand) or Navigation (destinations)',
        'Freeze desktop Grid / Stack direction=row that ignores morph',
      ],
      // Legacy flat keys (same facts) for older agent prompts:
      navigation: 'One Navigation items list (TabBar↔rail↔sidebar). Do not compose Sidebar + TabBar.',
      titleBar: 'TitleBar → Navigation header / #header (sidebar brand only; compact TabBar hides it). Not NavigationTitle.',
      navAccountCard:
        'NavAccountCard → Navigation footer / #footer (sidebar account+logout; hides collapse toggle). Not AppShell footer.',
      navigationTitle:
        'NavigationTitle (formerly NavigationBar) → AppShell header / #header (stack title + back).',
      navigationBar:
        'Deprecated alias of NavigationTitle. Prefer NavigationTitle / get_contract(navigation-title).',
      footer:
        'Footer → AppShell footer / #footer (credits/legal). footerPlacement auto: compact scrolls in main; ≥48rem shell-bottom.',
      buttonGroup:
        'ButtonGroup wraps Button children for attached/spaced tool toggles; selection stays on each Button.',
    },
    next: {
      writeImports: 'Call get_import_specifiers then copy preferred CSS/JS paths exactly.',
      pickComponent: 'search_components with intent, or list_components by family, then get_contract.',
      chromeRecipe:
        'Use appChrome.slots + defaults + chromeRowHeight; get_contract for app-shell, title-bar, nav-account-card, footer, navigation-title, button-group.',
    },
  }
}
