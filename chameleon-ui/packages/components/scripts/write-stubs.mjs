import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import catalog from '../catalog.json' with { type: 'json' }

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')

function contractFor(item) {
  const iconRtl =
    item.slug === 'icon'
      ? {
          supported: true,
          strategy:
            'Each icon declares rtl as mirror | preserve | localized. Default is preserve. Automatic scaleX(-1) only for mirror.',
          mirroredValues: ['mirror'],
        }
      : {
          supported: true,
          strategy: 'Logical CSS only. Direction inherits from document lang/dir.',
          mirroredValues: [],
        }

  return {
    schemaVersion: '0.1',
    slug: item.slug,
    name: item.name,
    status: 'draft',
    purpose: `${item.requirement} Frozen in the Phase 1 catalog; implementation is still a stub.`,
    scenarios: [`Demonstrate ${item.name}`, `Reserve the ${item.slug} install slug`],
    props: {},
    variants: [],
    states: [{ name: 'draft', description: 'Catalog-frozen stub; not a complete implementation.' }],
    composition: {
      allowedParents: ['app-shell', 'page'],
      allowedChildren: [],
      requiredContext: [],
    },
    antiPatterns: [
      'Do not treat this stub as a shipping component.',
      'Do not import @ark-ui or @base-ui from components.',
    ],
    a11y: {
      role: 'group',
      keyboard: ['Not implemented'],
      focus: 'Stub only; no focus algorithm yet.',
      labeling: 'Contract reserved; implementation pending.',
    },
    responsive: {
      strategy: 'Reserved. Implementation must match this contract when filled.',
      breakpoints: {
        compact: 'todo',
        medium: 'todo',
        large: 'todo',
      },
    },
    platforms: {
      web: 'planned',
      react: 'planned',
      vue: 'planned',
    },
    rtl: iconRtl,
  }
}

for (const item of catalog.components) {
  if (item.implementation === 'complete') continue
  const directory = path.join(srcRoot, item.slug)
  await mkdir(directory, { recursive: true })
  await writeFile(
    path.join(directory, 'README.md'),
    `# ${item.name}

Frozen Phase 1 stub for \`${item.slug}\`.

- Requirement: ${item.requirement}
- Implementation: **stub** (README + \`contract.json\` only)
- Do not import \`@ark-ui/*\` or \`@base-ui/react\` when this component is filled; go through \`@chameleon-ui/primitives\`.
`,
    'utf8',
  )
  await writeFile(
    path.join(directory, 'contract.json'),
    `${JSON.stringify(contractFor(item), null, 2)}\n`,
    'utf8',
  )
}

console.log('Wrote Phase 1 component stubs')
