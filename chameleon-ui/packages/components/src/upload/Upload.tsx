import { useRef, useState } from 'react'
import type { ClipboardEvent, DragEvent, KeyboardEvent } from 'react'
import './styles.css'

export interface UploadProps {
  label: string
  dropzoneLabel?: string
  browseLabel?: string
  multiple?: boolean
  onFiles?: (files: File[]) => void
  className?: string
}

export function Upload({
  label,
  dropzoneLabel = 'Drag files here',
  browseLabel = 'Browse files',
  multiple = true,
  onFiles,
  className,
}: UploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [dragover, setDragover] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const classes = ['cu-upload', dragover ? 'cu-upload--dragover' : '', className].filter(Boolean).join(' ')
  const sizeFormat = new Intl.NumberFormat(undefined, {
    style: 'unit',
    unit: 'kilobyte',
    maximumFractionDigits: 0,
  })

  const accept = (incoming: Iterable<File>) => {
    const next = multiple ? [...files, ...incoming] : Array.from(incoming).slice(0, 1)
    setFiles(next)
    if (next.length > 0) onFiles?.(next)
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragover(false)
    accept(event.dataTransfer.files)
  }

  const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (event.clipboardData.files.length > 0) {
      event.preventDefault()
      accept(event.clipboardData.files)
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      inputRef.current?.click()
    }
  }

  return (
    <div
      className={classes}
      data-ai-role="upload" data-ai-intent="upload-file"
      data-ai-state={dragover ? 'dragover' : files.length > 0 ? 'uploading' : 'default'}
    >
      <div
        className="cu-upload__dropzone"
        role="button"
        tabIndex={0}
        aria-label={label}
        onDragOver={(event) => {
          event.preventDefault()
          setDragover(true)
        }}
        onDragLeave={() => setDragover(false)}
        onDrop={onDrop}
        onPaste={onPaste}
        onKeyDown={onKeyDown}
        onClick={() => inputRef.current?.click()}
      >
        <span className="cu-upload__hint">{dropzoneLabel}</span>
        <span className="cu-upload__browse">{browseLabel}</span>
      </div>
      <input
        ref={inputRef}
        className="cu-upload__input"
        type="file"
        multiple={multiple}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => accept(event.currentTarget.files ?? [])}
      />
      {files.length > 0 ? (
        <ul className="cu-upload__list">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="cu-upload__file">
              <span className="cu-upload__name">{file.name}</span>
              <span className="cu-upload__size">{sizeFormat.format(Math.ceil(file.size / 1024))}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
