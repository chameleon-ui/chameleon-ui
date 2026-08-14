export type {
  RegistryFile,
  RegistryItem,
} from './catalog.js';
export {
  getRegistryItem,
  listComponents,
  listRulesPacks,
  listThemes,
  registry,
  registryById,
  searchRegistry,
} from './catalog.js';
export {
  authorizeRulesPackDownload,
  createStubRulesDownloadAuth,
  isRulesPackItem,
  parseRulesPackMeta,
  type RulesPackMeta,
  type RulesAuthStatus,
  type RulesDownloadAuthContext,
  type RulesDownloadAuthPort,
} from './rules.js';
export {
  RegistryAuthError,
  RegistryClientError,
  createBundledRegistryClient,
  createHttpRegistryClient,
  createRegistryClientFromEnv,
  parseItemRef,
  prepareInstall,
  prepareRulesInstall,
  type RegistryClient,
  type RegistryClientOptions,
} from './client.js';
export {
  searchByIntent,
  type IntentMatch,
  type IntentSearchResult,
} from './intent.js';
export {
  InstallWithThemeError,
  installWithTheme,
  planInstallWithTheme,
  type InstallWithThemePlan,
  type InstallWithThemeResult,
} from './install-with-theme.js';
