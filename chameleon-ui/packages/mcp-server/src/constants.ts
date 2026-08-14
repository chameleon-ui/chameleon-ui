/** Official tribute theme ids. Must match `@chameleon-ui/themes` `themeIds`. */
export const THEME_IDS = [
  'line',
  'silver-arrow',
  'stuttgart',
  'corsa',
  'cupertino',
  'siren',
  'wechat',
  'ant-blue',
] as const

/** Phase 2 shipping locales. Must match `@chameleon-ui/i18n` `PHASE_2_LOCALES`. */
export const PHASE_2_LOCALES = [
  'zh-CN',
  'zh-HK',
  'ja',
  'ko',
  'ru',
  'hi',
  'en',
  'de',
  'ar',
  'ug',
  'sw',
  'ha',
  'am',
  'es',
  'fr',
  'pt',
  'bn',
  'id',
  'ur',
  'fa',
  'vi',
] as const

export const RTL_LOCALES = ['ar', 'ug', 'ur', 'fa'] as const

export const LINK_RUNTIME_PACKAGES = [
  '@chameleon-ui/tokens',
  '@chameleon-ui/i18n',
  '@chameleon-ui/primitives',
  '@chameleon-ui/themes',
  '@chameleon-ui/components',
] as const

/**
 * MCP tool names. `tools/list`, README, AGENTS.md, and `pnpm ai:check` must
 * stay in lockstep with this list.
 */
export const MCP_TOOL_NAMES = [
  'search_components',
  'get_component',
  'get_contract',
  'get_design_rules',
  'get_import_specifiers',
  'install_component',
  'list_themes',
  'install_theme',
  'install_bundle',
  'install_with_theme',
  'telemetry_opt_out',
  'record_intent',
] as const

export type McpToolName = (typeof MCP_TOOL_NAMES)[number]
