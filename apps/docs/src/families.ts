import catalog from '@chameleon-ui/components/catalog.json'

/**
 * §7.2 八族 (eight families) information architecture.
 * Source: Chameleon UI — 综合可行性研究报告 v3.0.md §7.2.
 * This is the nav grouping SSOT for the docs site. Families with zero shipped
 * components still render (marked "planned") so the roadmap is honest.
 */
export interface Family {
  id: string
  /** i18n key under `docs.family.*` */
  labelKey: string
  slugs: string[]
}

const FAMILY_LABEL: Record<string, string> = {
  A: 'docs.family.a',
  B: 'docs.family.b',
  C: 'docs.family.c',
  D: 'docs.family.d',
  E: 'docs.family.e',
  F: 'docs.family.f',
  G: 'docs.family.g',
  H: 'docs.family.h',
}

/** Fallback IA used only when a catalog row has no family field yet. */
const FALLBACK_SLUGS: Record<string, string[]> = {
  A: [
    'button', 'icon', 'typography', 'heading', 'divider', 'separator',
    'stack', 'grid', 'app-shell', 'label', 'kbd', 'link', 'safe-area',
  ],
  B: ['drawer', 'breadcrumb', 'tabs', 'pagination', 'menu', 'tab-bar', 'sidebar', 'navigation', 'navigation-bar', 'navbar'],
  C: [
    'input', 'textarea', 'number-input', 'select', 'combobox', 'checkbox',
    'radio', 'radio-card', 'switch', 'slider', 'file-input', 'form',
  ],
  D: [
    'table', 'list', 'card', 'badge', 'chip', 'avatar',
    'description-list', 'empty-state', 'skeleton', 'progress',
  ],
  E: [
    'alert', 'inline-alert', 'toast', 'dialog', 'sheet',
    'popover', 'tooltip', 'hover-card', 'spinner', 'action-sheet',
  ],
  F: [],
  G: [],
  H: [],
}

function familyIdFor(component: { slug: string; family?: string }): string {
  if (component.family && FAMILY_LABEL[component.family]) return component.family
  for (const [id, slugs] of Object.entries(FALLBACK_SLUGS)) {
    if (slugs.includes(component.slug)) return id
  }
  return 'A'
}

export const FAMILIES: Family[] = Object.keys(FAMILY_LABEL).map((id) => ({
  id,
  labelKey: FAMILY_LABEL[id],
  slugs: catalog.components
    .filter((component) => familyIdFor(component) === id)
    .map((component) => component.slug),
}))

const catalogSlugs = new Set(catalog.components.map((c) => c.slug))

export interface FamilyView extends Family {
  components: Array<{ slug: string; name: string }>
}

export function familyViews(): FamilyView[] {
  return FAMILIES.map((family) => ({
    ...family,
    components: family.slugs
      .filter((slug) => catalogSlugs.has(slug))
      .map((slug) => ({
        slug,
        name: catalog.components.find((c) => c.slug === slug)?.name ?? slug,
      })),
  }))
}

export function familyForSlug(slug: string): Family | null {
  return FAMILIES.find((family) => family.slugs.includes(slug)) ?? null
}
