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

export interface CodeToken {
  text: string
  kind: 'comment' | 'string' | 'number' | 'keyword' | null
}

/**
 * Language-agnostic heuristic highlighter.
 * @complexity time O(n) | space O(n) | n = code length
 */
export function tokenize(code: string): CodeToken[] {
  const nodes: CodeToken[] = []
  let last = 0
  for (const match of code.matchAll(TOKEN_PATTERN)) {
    const at = match.index ?? 0
    if (at > last) nodes.push({ text: code.slice(last, at), kind: null })
    const [text, lineComment, blockComment, str, num, word] = match
    let kind: CodeToken['kind'] = null
    if (lineComment !== undefined || blockComment !== undefined) kind = 'comment'
    else if (str !== undefined) kind = 'string'
    else if (num !== undefined) kind = 'number'
    else if (word !== undefined && KEYWORDS.has(word.toLowerCase())) kind = 'keyword'
    nodes.push({ text, kind })
    last = at + text.length
  }
  if (last < code.length) nodes.push({ text: code.slice(last), kind: null })
  return nodes
}
