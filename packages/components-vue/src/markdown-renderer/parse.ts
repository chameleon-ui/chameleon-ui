export type InlineNode =
  | { type: 'text'; text: string }
  | { type: 'strong'; text: string }
  | { type: 'em'; text: string }
  | { type: 'code'; text: string }
  | { type: 'a'; text: string; href: string }

export type BlockNode =
  | { type: 'h2' | 'h3' | 'h4'; children: InlineNode[] }
  | { type: 'p'; children: InlineNode[] }
  | { type: 'ul'; items: InlineNode[][] }
  | { type: 'pre'; text: string }

const INLINE_PATTERN = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = []
  let last = 0
  for (const match of text.matchAll(INLINE_PATTERN)) {
    const at = match.index ?? 0
    if (at > last) nodes.push({ type: 'text', text: text.slice(last, at) })
    const [, bold, italic, code, linkText, linkHref] = match
    if (bold !== undefined) nodes.push({ type: 'strong', text: bold })
    else if (italic !== undefined) nodes.push({ type: 'em', text: italic })
    else if (code !== undefined) nodes.push({ type: 'code', text: code })
    else if (linkText !== undefined) nodes.push({ type: 'a', text: linkText, href: linkHref })
    last = at + match[0].length
  }
  if (last < text.length) nodes.push({ type: 'text', text: text.slice(last) })
  return nodes
}

/** Line-oriented Markdown subset parser: headings, paragraphs, dash lists, fenced code, and inline emphasis/code/links. */
export function renderBlocks(markdown: string): BlockNode[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: BlockNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i] ?? ''

    if (line.startsWith('```')) {
      const buffer: string[] = []
      i += 1
      while (i < lines.length && !(lines[i] ?? '').startsWith('```')) {
        buffer.push(lines[i] ?? '')
        i += 1
      }
      i += 1
      blocks.push({ type: 'pre', text: buffer.join('\n') })
      continue
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line)
    if (heading) {
      const level = Math.min(heading[1].length, 3)
      const tag = (['h2', 'h3', 'h4'] as const)[level - 1]
      blocks.push({ type: tag, children: parseInline(heading[2] ?? '') })
      i += 1
      continue
    }

    if (/^-\s+/.test(line)) {
      const items: InlineNode[][] = []
      while (i < lines.length && /^-\s+/.test(lines[i] ?? '')) {
        items.push(parseInline((lines[i] ?? '').replace(/^-\s+/, '')))
        i += 1
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    if (line.trim() === '') {
      i += 1
      continue
    }

    const buffer: string[] = [line]
    i += 1
    while (i < lines.length) {
      const next = lines[i] ?? ''
      if (next.trim() === '' || /^(#{1,3}\s|-\s|```)/.test(next)) break
      buffer.push(next)
      i += 1
    }
    blocks.push({ type: 'p', children: parseInline(buffer.join(' ')) })
  }

  return blocks
}
