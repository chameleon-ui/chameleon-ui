/** Canonical CSS import paths for Vue umbrella consumers. */
export const tokensCss = '@chameleon-ui/tokens/css' as const
export const tokensDensityCss = '@chameleon-ui/tokens/density.css' as const
export const defaultThemeCss = '@chameleon-ui/themes/line/css' as const
export const componentsVueCss = '@chameleon-ui/components-vue/css' as const
/** Preferred single import — real CSS file after `pnpm build`. */
export const umbrellaCss = '@chameleon-ui/vue/css' as const

/** Theme overlay via umbrella (baked into dist/themes). */
export function umbrellaThemeCss(
  themeId: string,
): `@chameleon-ui/vue/themes/${string}/css` {
  return `@chameleon-ui/vue/themes/${themeId}/css`
}

/** Same files via the themes package (also valid). */
export function themeCss(themeId: string): `@chameleon-ui/themes/${string}/css` {
  return `@chameleon-ui/themes/${themeId}/css`
}
