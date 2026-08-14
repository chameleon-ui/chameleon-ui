import type { ReactNode } from 'react'
import './styles.css'

export interface MarkdownRendererProps {
  markdown: string
  label?: string
  className?: string
}

const INLINE_PATTERN = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let index = 0
  for (const match of text.matchAll(INLINE_PATTERN)) {
    const at = match.index ?? 0
    if (at > last) nodes.push(text.slice(last, at))
    const key = `${keyPrefix}-${index}`
    index += 1
    const [, bold, italic, code, linkText, linkHref] = match
    if (bold !== undefined) nodes.push(<strong key={key}>{bold}</strong>)
    else if (italic !== undefined) nodes.push(<em key={key}>{italic}</em>)
    else if (code !== undefined) nodes.push(<code key={key}>{code}</code>)
    else if (linkText !== undefined) nodes.push(<a key={key} href={linkHref}>{linkText}</a>)
    last = at + match[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

const HEADING_TAGS = ['h2', 'h3', 'h4'] as const

/** Line-oriented Markdown subset parser: headings, paragraphs, dash lists, fenced code, and inline emphasis/code/links. */
function renderBlocks(markdown: string): ReactNode[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

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
      blocks.push(
        <pre key={key++} className="cu-markdown-renderer__code">
          <code>{buffer.join('\n')}</code>
        </pre>,
      )
      continue
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line)
    if (heading) {
      const Tag = HEADING_TAGS[Math.min(heading[1].length, 3) - 1]
      blocks.push(<Tag key={key++}>{parseInline(heading[2] ?? '', `h${key}`)}</Tag>)
      i += 1
      continue
    }

    if (/^-\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^-\s+/.test(lines[i] ?? '')) {
        items.push((lines[i] ?? '').replace(/^-\s+/, ''))
        i += 1
      }
      blocks.push(
        <ul key={key++} className="cu-markdown-renderer__list">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{parseInline(item, `li${key}-${itemIndex}`)}</li>
          ))}
        </ul>,
      )
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
    blocks.push(<p key={key++}>{parseInline(buffer.join(' '), `p${key}`)}</p>)
  }

  return blocks
}

export function MarkdownRenderer({ markdown, label = 'Markdown content', className }: MarkdownRendererProps) {
  const classes = ['cu-markdown-renderer', className].filter(Boolean).join(' ')
  const empty = markdown.trim().length === 0
  return (
    <div
      className={classes}
      role="document"
      aria-label={label}
      data-ai-role="markdown-renderer" data-ai-intent="render-markup"
      data-ai-state={empty ? 'empty' : 'default'}
    >
      {empty ? null : renderBlocks(markdown)}
    </div>
  )
}
