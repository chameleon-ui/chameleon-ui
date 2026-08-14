import {
  LINK_RUNTIME_PACKAGES,
  PHASE_2_LOCALES,
  RTL_LOCALES,
  THEME_IDS,
} from './constants.js'

export const DEFAULT_THEME_ID = 'cupertino'

export function isThemeId(value: string): value is (typeof THEME_IDS)[number] {
  return (THEME_IDS as readonly string[]).includes(value)
}

/**
 * Legal import specifiers for an external (non-pnpm-workspace) consumer app.
 * Preferred CSS is the `exports` alias, not a guessed `dist/` path.
 */
export function consumerImportSpecifiers(themeId = DEFAULT_THEME_ID, slug = 'button') {
  const theme = isThemeId(themeId) ? themeId : DEFAULT_THEME_ID
  return {
    themeId: theme,
    slug,
    preferred: {
      themeCss: `@chameleon-ui/themes/${theme}/css`,
      tokensCss: '@chameleon-ui/tokens/css',
      tokensDensityCss: '@chameleon-ui/tokens/density.css',
      components: '@chameleon-ui/components',
      contract: `@chameleon-ui/components/contracts/${slug}`,
      designRules: `@chameleon-ui/themes/${theme}/design-rules`,
      schemaRenderer: '@chameleon-ui/schema-renderer',
    },
    alsoValid: {
      themeCssDist: `@chameleon-ui/themes/dist/${theme}/variables.css`,
      tokensCssDist: '@chameleon-ui/tokens/dist/css/variables.css',
    },
    never: [
      `@chameleon-ui/themes/${theme}/variables.css`,
      'workspace:*',
    ],
    themes: [...THEME_IDS],
    locales: [...PHASE_2_LOCALES],
    rtlLocales: [...RTL_LOCALES],
    unpublishedLink: {
      fromMonorepo: 'node ./scripts/link-external.mjs --apply',
      inExternalApp: `npm link ${LINK_RUNTIME_PACKAGES.join(' ')}`,
      note: 'Packages are 0.0.0 and unpublished. workspace:* only works inside this pnpm workspace. Link all five runtime packages. Do not link only @chameleon-ui/components.',
    },
  }
}
