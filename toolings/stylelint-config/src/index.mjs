import { noBreakpointLiteral } from "./no-breakpoint-literal.mjs";

const physicalPropertyReplacements = {
  left: "inset-inline-start",
  right: "inset-inline-end",
  "margin-left": "margin-inline-start",
  "margin-right": "margin-inline-end",
  "padding-left": "padding-inline-start",
  "padding-right": "padding-inline-end",
  "border-left": "border-inline-start",
  "border-right": "border-inline-end",
  "border-left-color": "border-inline-start-color",
  "border-right-color": "border-inline-end-color",
  "border-left-style": "border-inline-start-style",
  "border-right-style": "border-inline-end-style",
  "border-left-width": "border-inline-start-width",
  "border-right-width": "border-inline-end-width",
};

export default {
  plugins: [noBreakpointLiteral],
  rules: {
    "property-disallowed-list": [
      "/^(?:left|right|margin-(?:left|right)|padding-(?:left|right)|border-(?:left|right)(?:-(?:color|style|width))?)$/i",
    ],
    "declaration-property-value-disallowed-list": {
      "/^(float|clear)$/": ["left", "right"],
    },
    // Off by default; component packages opt in via the override below so the
    // tokens package can keep owning the generated breakpoint defaults file.
    "chameleon/no-breakpoint-literal": null,
  },
  // NOTE: stylelint resolves overrides[].files relative to this config file's
  // directory (toolings/stylelint-config/src/), so the paths climb back to the
  // monorepo root.
  overrides: [
    {
      files: [
        "../../../packages/components/**/*.css",
        "../../../packages/components-vue/**/*.css",
        "../fixtures/**/*.css",
      ],
      rules: {
        "chameleon/no-breakpoint-literal": true,
      },
    },
  ],
};

export { physicalPropertyReplacements };
