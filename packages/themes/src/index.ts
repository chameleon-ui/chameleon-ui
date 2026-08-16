import type { ThemeId } from './ids.js'

export {
  communityRulesPackIds,
  isThemeId,
  themeIds,
} from './ids.js'
export type { CommunityRulesPackId, ThemeId } from './ids.js'
export {
  applyDocumentTheme,
  installThemeOverlays,
  scopeThemeCss,
  THEME_OVERLAY_STYLE_ID,
} from './document-theme.js'
export type { ApplyDocumentThemeOptions, ThemeDensity } from './document-theme.js'



export interface ThemeMeta {

  id: ThemeId;

  label: string;

  preview: {

    accent: string;

    surface: string;

  };

  fonts: {

    sans: string;

  };

}



/** Phase 3 full design-rules shape — validated by design-rules.schema.json v1.0 */

export interface DesignRules {

  version: "1.0";

  typography: {

    scale: string;

    lineHeightBody: number;

    fontFamilyToken: string;

    headingWeightToken: string;

    tracking?: "tight" | "normal" | "wide";

  };

  spacing: {

    rhythm: number;

    density: "compact" | "comfortable" | "spacious";

    scale: {

      strategy: "rem-steps";

      steps: string[];

    };

    radiusStrategy: {

      default: string;

      interactive: string;

      surface: string;

    };

  };

  colorBoundaries: {

    accentUsage: "primary-actions-only" | "primary-and-links" | "brand-highlights";

    surfaceLayers: string[];

    disabledContrast: {

      minimumRatio: number;

      foregroundToken: string;

      backgroundToken: string;

    };

    gradientPolicy?: "forbidden" | "subtle-only" | "brand-allowed";

  };

  forbiddenPatterns: string[];

  composition: {

    surfaceHierarchy: "elevation-over-border" | "border-over-elevation" | "flat";

    preferredStacks: string[];

    componentRules: Record<

      string,

      {

        minWidthPx?: number;

        maxWidthPx?: number;

        minTouchTargetPx?: number;

      }

    >;

  };

  rtl: {

    supported: boolean;

    strategy: string;

    mirroredIcons: string[];

    bidiIsolation?: "required-for-user-content" | "recommended" | "optional";

  };

}




/**
 * Canonical CSS specifier for a tribute theme overlay.
 *
 * Use this (or the `exports` alias below). Do **not** invent a path such as
 * `@chameleon-ui/themes/apple/variables.css` — that specifier is not exported.
 *
 * @example
 * import "@chameleon-ui/themes/apple/css"
 */
export function themeCssSpecifier(id: ThemeId): `@chameleon-ui/themes/${ThemeId}/css` {
  return `@chameleon-ui/themes/${id}/css`;
}

/**
 * Filesystem-shaped alias also listed in package `exports` (`./dist/*`).
 * Same file as {@link themeCssSpecifier}; kept so `.../dist/<id>/variables.css`
 * does not throw `Missing specifier`.
 *
 * @example
 * import "@chameleon-ui/themes/dist/apple/variables.css"
 */
export function themeCssDistSpecifier(
  id: ThemeId,
): `@chameleon-ui/themes/dist/${ThemeId}/variables.css` {
  return `@chameleon-ui/themes/dist/${id}/variables.css`;
}

