/** Phase 2 theme ids — SSOT: 综合可行性研究报告 v3.0 §6.2 (folder names without theme- prefix). */

export const themeIds = [
  "line",
  "silver-arrow",
  "stuttgart",
  "corsa",
  "cupertino",
  "siren",
  "wechat",
  "ant-blue",
] as const;

/** Community discipline packs (Phase 4) — not homage theme ids. */
export const communityRulesPackIds = ["community-focus-first"] as const;

export type CommunityRulesPackId = (typeof communityRulesPackIds)[number];

export type ThemeId = (typeof themeIds)[number];



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



export function isThemeId(value: string): value is ThemeId {

  return (themeIds as readonly string[]).includes(value);

}

/**
 * Canonical CSS specifier for a tribute theme overlay.
 *
 * Use this (or the `exports` alias below). Do **not** invent a path such as
 * `@chameleon-ui/themes/cupertino/variables.css` — that specifier is not exported.
 *
 * @example
 * import "@chameleon-ui/themes/cupertino/css"
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
 * import "@chameleon-ui/themes/dist/cupertino/variables.css"
 */
export function themeCssDistSpecifier(
  id: ThemeId,
): `@chameleon-ui/themes/dist/${ThemeId}/variables.css` {
  return `@chameleon-ui/themes/dist/${id}/variables.css`;
}

