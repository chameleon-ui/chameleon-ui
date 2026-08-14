/// <reference types="vite/client" />

declare module '@chameleon-ui/themes/*/css?raw' {
  const css: string
  export default css
}

declare module '@chameleon-ui/themes/src/*/design-rules.json' {
  import type { DesignRules } from '@chameleon-ui/themes'
  const rules: DesignRules
  export default rules
}

declare module '@chameleon-ui/themes/src/*/meta.json' {
  import type { ThemeMeta } from '@chameleon-ui/themes'
  const meta: ThemeMeta
  export default meta
}

declare module '@chameleon-ui/themes/src/*/tokens.json' {
  const tokens: Record<string, unknown>
  export default tokens
}
