import { createCatalog, formatMessage, requireMessage } from '@chameleon-ui/i18n'
import type { PrimitiveMessageValue } from '@chameleon-ui/i18n'

export function createBlockCopy(trees: { readonly [locale: string]: unknown }, locale: string) {
  const tree = trees[locale] ?? trees.en
  const catalog = createCatalog(tree)
  const t = (key: string, values?: Record<string, PrimitiveMessageValue>) =>
    formatMessage(locale, requireMessage(catalog, key), values ?? {})
  return { catalog, t, tree }
}

export function isSkeletonTree(tree: unknown): boolean {
  return Boolean(
    tree &&
      typeof tree === 'object' &&
      '_cuSkeleton' in tree &&
      (tree as { _cuSkeleton?: boolean })._cuSkeleton === true,
  )
}
