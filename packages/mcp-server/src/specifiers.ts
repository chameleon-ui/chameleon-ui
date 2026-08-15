import {
  LINK_RUNTIME_PACKAGES,
  LINK_RUNTIME_PACKAGES_VUE,
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
 * Preferred path is the umbrella (`@chameleon-ui/react` / `@chameleon-ui/vue`).
 * Underlying package names remain valid. Preferred CSS is the umbrella `./css`
 * entry (tokens + density + line) or the `exports` theme alias.
 */
export function consumerImportSpecifiers(themeId = DEFAULT_THEME_ID, slug = 'button') {
  const theme = isThemeId(themeId) ? themeId : DEFAULT_THEME_ID
  return {
    themeId: theme,
    slug,
    preferred: {
      umbrellaReact: '@chameleon-ui/react',
      umbrellaVue: '@chameleon-ui/vue',
      umbrellaReactCss: '@chameleon-ui/react/css',
      umbrellaVueCss: '@chameleon-ui/vue/css',
      themeCss: `@chameleon-ui/themes/${theme}/css`,
      tokensCss: '@chameleon-ui/tokens/css',
      tokensDensityCss: '@chameleon-ui/tokens/density.css',
      components: '@chameleon-ui/react',
      componentSlug: `@chameleon-ui/components/${slug}`,
      componentsVue: '@chameleon-ui/vue',
      componentVueSlug: `@chameleon-ui/components-vue/${slug}`,
      componentsVueCss: '@chameleon-ui/components-vue/css',
      contract: `@chameleon-ui/components/contracts/${slug}`,
      designRules: `@chameleon-ui/themes/${theme}/design-rules`,
      schemaRenderer: '@chameleon-ui/schema-renderer',
      schemaRendererVue: '@chameleon-ui/schema-renderer/vue',
    },
    alsoValid: {
      componentsPackage: '@chameleon-ui/components',
      componentsVuePackage: '@chameleon-ui/components-vue',
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
      inExternalApp: 'npm link @chameleon-ui/react',
      fromMonorepoVue: 'node ./scripts/link-external.mjs --vue --apply',
      inExternalAppVue: 'npm link @chameleon-ui/vue',
      legacyFiveFromMonorepo: 'node ./scripts/link-external.mjs --legacy-five --apply',
      legacyFiveInExternalApp: `npm link ${LINK_RUNTIME_PACKAGES.join(' ')}`,
      legacyFiveInExternalAppVue: `npm link ${LINK_RUNTIME_PACKAGES_VUE.join(' ')}`,
      viteTemplate: 'templates/external-vite-react',
      viteTemplateVue: 'templates/external-vite-vue',
      printVite: 'node ./scripts/link-external.mjs --print-vite',
      printViteVue: 'node ./scripts/link-external.mjs --print-vite-vue',
      packTarballs: 'node ./scripts/pack-external.mjs',
      packTarballsVue: 'node ./scripts/pack-external.mjs --vue',
      packLegacyFive: 'node ./scripts/pack-external.mjs --legacy-five',
      note: 'Packages are 0.2.0 and unpublished. Prefer one umbrella: @chameleon-ui/react or @chameleon-ui/vue (pack-external default bundles the five). workspace:* only works inside this pnpm workspace. Legacy five-pack: --legacy-five.',
    },
    versionMatrix: {
      node: '>=20.19.0',
      react: '^19.0.0',
      vue: '^3.5.0',
      arkUi: '5.38.0',
      arkUiVue: '5.38.1',
      intlMessageformat: '11.2.13',
      icuParser: '3.5.14',
    },
    dualTrack: {
      package:
        'React: one @chameleon-ui/react (or legacy five). Vue: one @chameleon-ui/vue (or legacy five including components-vue).',
      copySource:
        'chameleon add <slug> / MCP install_* via install-core. Do not mix with workspace:*. Copy-source is React-oriented.',
    },
  }
}
