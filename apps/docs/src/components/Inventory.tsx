import catalog from '@chameleon-ui/components/catalog.json'
import { themeIds } from '@chameleon-ui/themes'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { getTranslator } from '../messages'

export default function Inventory({ locale }: { locale?: string }) {
  const { i18n } = useDocusaurusContext()
  const { t } = getTranslator(locale ?? i18n?.currentLocale ?? 'zh-CN')
  return (
    <section data-docs="inventory">
      <h2>{t('docs.inventory')}</h2>
      <ul className="cu-docs-list">
        <li>{t('docs.componentsCount', { count: catalog.components.length })}</li>
        <li>{t('docs.themesCount', { count: themeIds.length })}</li>
        <li>{t('docs.localesCount', { count: catalog.locales.length })}</li>
      </ul>
    </section>
  )
}
