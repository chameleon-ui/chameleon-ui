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
  rules: {
    "property-disallowed-list": [
      "/^(?:left|right|margin-(?:left|right)|padding-(?:left|right)|border-(?:left|right)(?:-(?:color|style|width))?)$/i",
    ],
    "declaration-property-value-disallowed-list": {
      "/^(float|clear)$/": ["left", "right"],
    },
  },
};

export { physicalPropertyReplacements };
