import type { RegistryItem } from '@chameleon-ui/registry'

function normalizePath(filePath: string): string {
  return filePath.replaceAll('\\', '/')
}

function parseFile(
  item: RegistryItem,
  match: (filePath: string) => boolean,
): unknown | undefined {
  const file = item.files.find((entry) => match(normalizePath(entry.path)))
  if (!file) return undefined
  try {
    return JSON.parse(file.content) as unknown
  } catch {
    return undefined
  }
}

/** Parsed v0.2 `contract.json` bundled on a `registry:ui` item. */
export function extractContract(item: RegistryItem): unknown | undefined {
  return parseFile(
    item,
    (filePath) => filePath.endsWith('/contract.json') || filePath === 'contract.json',
  )
}

/** Parsed `design-rules.json` bundled on a theme or rules-pack item. */
export function extractDesignRules(item: RegistryItem): unknown | undefined {
  return parseFile(item, (filePath) => filePath.endsWith('/design-rules.json'))
}
