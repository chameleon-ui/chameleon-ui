import stylelint from "stylelint";

const { createPlugin, utils } = stylelint;

const ruleName = "chameleon/no-breakpoint-literal";

const messages = utils.ruleMessages(ruleName, {
  rejectedMediaWidth: (prelude) =>
    `viewport width/height media query "${prelude}" is forbidden in component CSS. Breakpoints are tokens (packages/tokens/src/core/breakpoint.json); adapt to the parent with @container, or consume dist/css/density.css. Escape hatch: stylelint-disable comment plus a LEGACY-* note.`,
  rejectedPxBreakpoint: (prelude) =>
    `px breakpoint literal in "${prelude}" is forbidden. Use the token-equal rem value (768px -> 48rem / breakpoint.tablet, 1280px -> 80rem / breakpoint.desktop) or a documented component-local rem container threshold.`,
});

// (min|max)-(width|height) features, range-syntax width/height comparisons, or any
// length literal make an @media prelude a viewport breakpoint query.
const MEDIA_WIDTH_FEATURE = /(?:min|max)-(?:width|height)\s*:/i;
const MEDIA_RANGE_FEATURE = /(?:^|[\s(])(?:width|height)\s*(?:[<>]=?|=)|(?:[<>]=?|=)\s*(?:width|height)(?:\s*[)])/i;
const LENGTH_LITERAL = /\d+(?:\.\d+)?\s*(?:px|r?em|vw|vh|vmin|vmax|ch|cm|mm|in|pt|pc|q)\b/i;

// The frozen viewport breakpoints written as px (vision §7.1: 768 / 1280).
const PX_BREAKPOINT = /(?:^|[^\d.])(?:768|1280)\s*px\b/i;

/** True when an @media prelude is a viewport size query (prefers-*, hover, pointer stay legal). */
function isViewportSizeMedia(prelude) {
  return (
    MEDIA_WIDTH_FEATURE.test(prelude) ||
    MEDIA_RANGE_FEATURE.test(prelude) ||
    LENGTH_LITERAL.test(prelude)
  );
}

/**
 * Phase 5 (A5.2): component CSS must not hardcode viewport breakpoints.
 * @media width/height size queries are rejected; @container queries must not
 * spell the frozen breakpoints in px.
 */
const rule = createPlugin(ruleName, (primary) => {
  return (root, result) => {
    if (primary !== true) return;

    root.walkAtRules((atRule) => {
      const name = atRule.name.toLowerCase();
      const prelude = atRule.params ?? "";

      if (name === "media" && isViewportSizeMedia(prelude)) {
        utils.report({
          message: messages.rejectedMediaWidth(prelude),
          node: atRule,
          result,
          ruleName,
        });
        return;
      }

      if (name === "container" && PX_BREAKPOINT.test(prelude)) {
        utils.report({
          message: messages.rejectedPxBreakpoint(prelude),
          node: atRule,
          result,
          ruleName,
        });
      }
    });
  };
});

rule.ruleName = ruleName;
rule.messages = messages;

export { rule as noBreakpointLiteral };
