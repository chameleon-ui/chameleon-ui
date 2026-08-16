import { useRef, useState } from 'react'
import './styles.css'

export interface EditorProps {
  label: string
  placeholder?: string
  initialHtml?: string
  onChange?: (html: string) => void
  boldLabel?: string
  italicLabel?: string
  className?: string
}

/** Minimal allowlist-style cleanup: strips executable tags, inline handlers, and javascript: URLs. Not a full sanitizer; a dedicated sanitizer is tracked as a Phase 6 todo. */
function sanitizeHtml(html: string) {
  return html
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '')
}

export function Editor({
  label,
  placeholder = 'Write something',
  initialHtml = '',
  onChange,
  boldLabel = 'Bold',
  italicLabel = 'Italic',
  className,
}: EditorProps) {
  const regionRef = useRef<HTMLDivElement>(null)
  const [empty, setEmpty] = useState(initialHtml.trim().length === 0)
  const classes = ['cu-editor', className].filter(Boolean).join(' ')

  const emitChange = () => {
    const html = regionRef.current?.innerHTML ?? ''
    setEmpty((regionRef.current?.textContent ?? '').trim().length === 0)
    onChange?.(html)
  }

  const run = (command: 'bold' | 'italic') => {
    regionRef.current?.focus()
    if (typeof document.execCommand === 'function') {
      document.execCommand(command)
      emitChange()
    }
  }

  return (
    <div className={classes} data-ai-role="editor" data-ai-intent="compose-rich-text" data-ai-state={empty ? 'empty' : 'default'}>
      <div className="cu-editor__toolbar" role="toolbar" aria-label={label}>
        <button type="button" className="cu-editor__command" aria-label={boldLabel} onClick={() => run('bold')}>
          <strong aria-hidden="true">B</strong>
        </button>
        <button type="button" className="cu-editor__command" aria-label={italicLabel} onClick={() => run('italic')}>
          <em aria-hidden="true">I</em>
        </button>
      </div>
      <div
        ref={regionRef}
        className="cu-editor__region"
        role="textbox"
        aria-label={label}
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emitChange}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(initialHtml) }}
      />
    </div>
  )
}
