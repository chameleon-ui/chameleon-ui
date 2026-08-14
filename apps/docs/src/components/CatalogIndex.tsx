import catalog from '@chameleon-ui/components/catalog.json'
import { Typography } from '@chameleon-ui/components'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { familyViews } from '../families'
import { getTranslator } from '../messages'

export default function CatalogIndex() {
  const { i18n } = useDocusaurusContext()
  const { t } = getTranslator(i18n?.currentLocale ?? 'zh-CN')
  return (
    <div>
      {familyViews().map((family) => (
        <section key={family.id} data-docs-family={family.id}>
          <Typography variant="heading-2">
            {family.id} · {t(family.labelKey)}
          </Typography>
          {family.components.length ? (
            <ul className="cu-docs-grid" data-docs="family-grid">
              {family.components.map((item) => (
                <li key={item.slug}>
                  <Link className="cu-docs-card" data-docs-slug={item.slug} to={`/components/${item.slug}`}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="cu-docs-nav-planned">{t('docs.familyPlanned')}</p>
          )}
        </section>
      ))}
      <p className="cu-docs-note">
        {t('docs.componentsCount', { count: catalog.components.length })}
      </p>
    </div>
  )
}
