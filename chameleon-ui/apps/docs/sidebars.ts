import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'
import { familyViews } from './src/families'

const FAMILY_ZH: Record<string, string> = {
  A: 'A · 基础与布局',
  B: 'B · 导航',
  C: 'C · 数据录入',
  D: 'D · 数据展示',
  E: 'E · 反馈',
  F: 'F · 可视化',
  G: 'G · 画布与图形',
  H: 'H · 内容与协作',
}

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: '指南',
      collapsed: false,
      items: [
        'install',
        'guides/consume',
        'guides/for-agents',
        'themes',
        'locales',
        'schema',
        'schema-renderer',
        'guides/three-end',
        'bench',
        {
          type: 'link',
          label: 'Bench 报告',
          href: 'pathname:///bench/latest.json',
        },
        'telemetry',
        'dashboard',
        'vpat',
        'gaps',
      ],
    },
    {
      type: 'category',
      label: '组件',
      collapsed: false,
      link: { type: 'doc', id: 'components/index' },
      items: familyViews().map((family) => ({
        type: 'category' as const,
        label: FAMILY_ZH[family.id] ?? `${family.id}`,
        collapsed: family.components.length > 12,
        items:
          family.components.length > 0
            ? family.components.map((item) => `components/${item.slug}`)
            : [
                {
                  type: 'html' as const,
                  value: '<em class="cu-docs-nav-planned">规划中——该族尚无已出货组件。</em>',
                },
              ],
      })),
    },
  ],
}

export default sidebars
