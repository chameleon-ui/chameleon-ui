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
      componentSlug: `@chameleon-ui/components/${slug}`,
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
      viteTemplate: 'templates/external-vite-react',
      printVite: 'node ./scripts/link-external.mjs --print-vite',
      packTarballs: 'node ./scripts/pack-external.mjs',
      note: 'Packages are 0.1.0 and unpublished. workspace:* only works inside this pnpm workspace. Link all five runtime packages. Do not link only @chameleon-ui/components.',
    },
    versionMatrix: {
      node: '>=20.19.0',
      react: '^19.0.0',
      arkUi: '5.38.0',
      intlMessageformat: '11.2.13',
      icuParser: '3.5.14',
    },
    dualTrack: {
      package: 'Depend on the five runtime packages and import from @chameleon-ui/components.',
      copySource: 'chameleon add <slug> / MCP install_* via install-core. Do not mix with workspace:*.',
    },
  }
}
