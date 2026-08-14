import catalog from '@chameleon-ui/components/catalog.json'
import { Stack, Typography } from '@chameleon-ui/components'
import { previewKind, renderGalleryPreview } from './gallery-previews'

interface ComponentGalleryProps {
  t: (key: string, values?: Record<string, string | number>) => string
}

const FAMILIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const

const FAMILY_TITLE: Record<(typeof FAMILIES)[number], string> = {
  A: 'A · Layout',
  B: 'B · Navigation',
  C: 'C · Inputs',
  D: 'D · Data display',
  E: 'E · Feedback',
  F: 'F · Visualization',
  G: 'G · Canvas',
  H: 'H · Content',
}

export function ComponentGallery({ t }: ComponentGalleryProps) {
  const slugs = catalog.components

  return (
    <Stack gap="3">
      <Typography variant="heading-1">{t('demo.title')}</Typography>
      <Typography variant="body">{t('demo.galleryLead')}</Typography>
      <Typography variant="caption">{t('demo.dirNote', { dir: document.documentElement.dir })}</Typography>
      <p data-demo="catalog-count">{slugs.length}</p>
      <nav className="cu-demo-family-nav" aria-label="Component families">
        {FAMILIES.map((family) => (
          <a key={family} href={`#family-${family}`}>
            {family}
          </a>
        ))}
      </nav>

      {FAMILIES.map((family) => {
        const items = slugs.filter((item) => item.family === family)
        return (
          <section key={family} className="cu-demo-family" data-demo-family={family} id={`family-${family}`}>
            <Typography variant="heading-1">{FAMILY_TITLE[family]}</Typography>
            {items.map((item) => (
              <section
                key={item.slug}
                className="cu-demo-section"
                data-demo-slug={item.slug}
                data-demo-kind={previewKind(item.slug)}
                id={`demo-${item.slug}`}
              >
                <Typography variant="heading-2">{item.name}</Typography>
                {renderGalleryPreview(item.slug, t)}
              </section>
            ))}
          </section>
        )
      })}
    </Stack>
  )
}
