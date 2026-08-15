/** CSS custom-property prefix owned by Chameleon UI. */
export const tokenCssVariablePrefix = "--cu-" as const;

/** O2 Phase 0 decision recorded by the package implementation. */
export const tokenCompiler = "style-dictionary" as const;

/**
 * Phase 5 three-end kernel token names (values live in src/core/*.json and
 * compile to dist/css/variables.css + dist/tokens.json; never duplicate a
 * value here — these constants are the stable identifiers only).
 */
export const breakpointTokens = {
  mobile: "--cu-breakpoint-mobile",
  tablet: "--cu-breakpoint-tablet",
  desktop: "--cu-breakpoint-desktop",
} as const;

export const densityTokens = {
  compact: "--cu-density-compact",
  standard: "--cu-density-standard",
  comfortable: "--cu-density-comfortable",
  active: "--cu-density-active",
} as const;

export const controlSizeTokens = {
  compact: "--cu-control-size-compact",
  standard: "--cu-control-size-standard",
  comfortable: "--cu-control-size-comfortable",
  active: "--cu-control-size-active",
} as const;

export const touchTargetTokens = {
  min: "--cu-touch-target-min",
} as const;

export const typographySizeTokens = {
  caption: "--cu-typography-size-caption",
  body: "--cu-typography-size-body",
  heading3: "--cu-typography-size-heading-3",
  heading2: "--cu-typography-size-heading-2",
  heading1: "--cu-typography-size-heading-1",
} as const;

export const typographyLineHeightTokens = {
  tight: "--cu-typography-line-height-tight",
  snug: "--cu-typography-line-height-snug",
  body: "--cu-typography-line-height-body",
} as const;

export const typographyWeightTokens = {
  medium: "--cu-typography-weight-medium",
  semibold: "--cu-typography-weight-semibold",
  bold: "--cu-typography-weight-bold",
} as const;

export const typographyTrackingTokens = {
  tight: "--cu-typography-tracking-tight",
  body: "--cu-typography-tracking-body",
} as const;

export const motionDurationTokens = {
  fast: "--cu-motion-duration-fast",
  base: "--cu-motion-duration-base",
} as const;

export const spaceTokens = {
  0: "--cu-space-0",
  1: "--cu-space-1",
  2: "--cu-space-2",
  3: "--cu-space-3",
  4: "--cu-space-4",
  5: "--cu-space-5",
  6: "--cu-space-6",
} as const;

export const radiusTokens = {
  sm: "--cu-radius-sm",
  md: "--cu-radius-md",
  lg: "--cu-radius-lg",
} as const;

export const shadowTokens = {
  sm: "--cu-shadow-sm",
  md: "--cu-shadow-md",
  lg: "--cu-shadow-lg",
} as const;

export const blurTokens = {
  surface: "--cu-blur-surface",
  thick: "--cu-blur-thick",
} as const;

/** Attribute that overrides the per-breakpoint density default. */
export const densityAttribute = "data-density" as const;

/**
 * Canonical CSS specifiers (package `exports`). Prefer these over guessing a
 * `dist/` path. Filesystem-shaped aliases are also exported via `./dist/*`.
 *
 * @example
 * import "@chameleon-ui/tokens/css"
 * import "@chameleon-ui/tokens/density.css"
 */
export const tokensCssSpecifier = "@chameleon-ui/tokens/css" as const;
export const tokensDensityCssSpecifier = "@chameleon-ui/tokens/density.css" as const;
export const tokensCssDistSpecifier = "@chameleon-ui/tokens/dist/css/variables.css" as const;
export const tokensDensityCssDistSpecifier = "@chameleon-ui/tokens/dist/css/density.css" as const;
