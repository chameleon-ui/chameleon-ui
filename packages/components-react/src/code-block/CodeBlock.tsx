import { useState } from 'react'
import type { ReactNode } from 'react'
import './styles.css'

export interface CodeBlockProps {
  code: string
  language?: string
  highlight?: boolean
  copyLabel?: string
  copiedLabel?: string
  className?: string
}

const KEYWORDS = new Set([
  'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'def', 'default',
  'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'fn', 'for', 'from', 'func',
  'function', 'go', 'if', 'impl', 'import', 'in', 'interface', 'lambda', 'let', 'match', 'mod',
  'mut', 'new', 'nil', 'none', 'null', 'package', 'private', 'pub', 'public', 'return', 'self',
  'static', 'struct', 'switch', 'this', 'throw', 'true', 'try', 'type', 'undefined', 'use',
  'var', 'void', 'while', 'yield',
])

const TOKEN_PATTERN =
  /(\/\/[^\n]*|#[^\n]*)|(\/\*[\s\S]*?\*\/)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)/g

/**
 * Language-agnostic heuristic highlighter: line/block comments, strings, numbers, and a small
 * cross-language keyword set. Kept dependency-free on purpose; a full grammar highlighter is a
 * Phase 6 budget decision.
 * @complexity time O(n) | space O(n) | n = code length
 */
function tokenize(code: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let index = 0
  for (const match of code.matchAll(TOKEN_PATTERN)) {
    const at = match.index ?? 0
    if (at > last) nodes.push(code.slice(last, at))
    const [text, lineComment, blockComment, str, num, word] = match
    let kind: string | null = null
    if (lineComment !== undefined || blockComment !== undefined) kind = 'comment'
    else if (str !== undefined) kind = 'string'
    else if (num !== undefined) kind = 'number'
    else if (word !== undefined && KEYWORDS.has(word.toLowerCase())) kind = 'keyword'
    if (kind) nodes.push(<span key={index} className={`cu-code-block__token--${kind}`}>{text}</span>)
    else nodes.push(text)
    index += 1
    last = at + text.length
  }
  if (last < code.length) nodes.push(code.slice(last))
  return nodes
}

export function CodeBlock({ code, language, highlight = true, copyLabel = 'Copy code', copiedLabel = 'Copied', className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const classes = ['cu-code-block', className].filter(Boolean).join(' ')

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(code)
    } catch {
      // Clipboard unavailable (permission or insecure context); the state change still confirms intent.
    }
    setCopied(true)
  }

  return (
    <figure className={classes} data-ai-role="code-block" data-ai-intent="copy-snippet" data-ai-state={copied ? 'copied' : 'default'}>
      <figcaption className="cu-code-block__bar">
        <span className="cu-code-block__language">{language ?? 'text'}</span>
        <button type="button" className="cu-code-block__copy" onClick={copy}>
          {copied ? copiedLabel : copyLabel}
        </button>
      </figcaption>
      <pre className="cu-code-block__pre">
        <code>{highlight ? tokenize(code) : code}</code>
      </pre>
    </figure>
  )
}
