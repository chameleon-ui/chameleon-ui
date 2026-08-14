import { useState } from 'react'
import './styles.css'

export interface FileInputProps {
  label: string
  accept?: string
  onChange: (files: FileList | null) => void
  className?: string
}

export function FileInput({ label, accept, onChange, className }: FileInputProps) {
  const [names, setNames] = useState<string[]>([])
  const classes = ['cu-file-input', className].filter(Boolean).join(' ')
  return (
    <label className={classes} data-ai-role="file-input" data-ai-intent="upload-file" data-ai-state={names.length > 0 ? 'selected' : 'empty'}>
      <span className="cu-file-input__label">{label}</span>
      <input
        accept={accept}
        className="cu-file-input__input"
        onChange={(event) => {
          const files = event.currentTarget.files
          setNames(files ? Array.from(files).map((f) => f.name) : [])
          onChange(files)
        }}
        type="file"
      />
      {names.length > 0 ? <span className="cu-file-input__names">{names.join(', ')}</span> : null}
    </label>
  )
}
