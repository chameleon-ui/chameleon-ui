import { createRequire } from 'node:module'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import { themes as prismThemes } from 'prism-react-renderer'

const require = createRequire(import.meta.url)

/** Docs-site UI locales only. Product ICU remains 21 in packages/components. */
const DOCS_SITE_LOCALES = ['zh-CN', 'zh-HK', 'en'] as const
const DOCS_DEFAULT_LOCALE = 'zh-CN'

const localeConfigs: NonNullable<Config['i18n']>['localeConfigs'] = {
  'zh-CN': {
    label: '中文',
    direction: 'ltr',
    htmlLang: 'zh-CN',
  },
  'zh-HK': {
    label: '繁體',
    direction: 'ltr',
    htmlLang: 'zh-HK',
  },
  en: {
    label: 'English',
    direction: 'ltr',
    htmlLang: 'en',
  },
}

const config: Config = {
  title: 'Chameleon UI',
  tagline: 'MIT 许可的 React 组件，底座为 Ark/Zag',
  url: 'https://chameleon-ui.dev',
  baseUrl: '/',
  organizationName: 'chameleon-ui',
  projectName: 'chameleon-ui',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  trailingSlash: false,
  i18n: {
    defaultLocale: DOCS_DEFAULT_LOCALE,
    locales: [...DOCS_SITE_LOCALES],
    localeConfigs,
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themes: [
    '@docusaurus/theme-live-codeblock',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en', 'zh'],
        indexDocs: true,
        docsRouteBasePath: '/',
        explicitSearchResultPath: true,
      },
    ],
  ],
  plugins: [
    function chameleonWorkspaceWebpack() {
      return {
        name: 'chameleon-workspace-webpack',
        configureWebpack() {
          return {
            module: {
              rules: [
                {
                  resourceQuery: /raw/,
                  type: 'asset/source',
                },
              ],
            },
          }
        },
      }
    },
  ],
  themeConfig: {
    liveCodeBlock: {
      playgroundPosition: 'bottom',
    },
    navbar: {
      title: 'Chameleon UI',
      items: [
        { type: 'docSidebar', sidebarId: 'docs', position: 'left', label: '文档' },
        { to: '/install', label: '安装', position: 'left' },
        { to: '/components', label: '组件', position: 'left' },
        { to: '/themes', label: '主题', position: 'left' },
        { type: 'custom-themeSwitcher', position: 'right' },
        { type: 'localeDropdown', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      copyright: 'MIT · Chameleon UI 0.1.0 · owner 待指定',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
