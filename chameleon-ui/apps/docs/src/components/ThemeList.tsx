import catalog from '@chameleon-ui/components/catalog.json'
import { themeIds } from '@chameleon-ui/themes'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { getTranslator } from '../messages'

export default function ThemeList() {
  const { i18n } = useDocusaurusContext()
  const { t } = getTranslator(i18n?.currentLocale ?? 'zh-CN')
  return (
    <div>
      <p className="cu-docs-banner" data-docs="legal-themes">
        {t('docs.legalThemes')}
      </p>
      <ul className="cu-docs-list" data-docs="theme-list">
        {themeIds.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </div>
  )
}

export function LocaleList() {
  return (
    <ul className="cu-docs-list" data-docs="locale-list">
      {catalog.locales.map((id) => (
        <li key={id}>{id}</li>
      ))}
    </ul>
  )
}
