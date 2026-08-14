import { useRef, useState } from 'react'
import type { ClipboardEvent, DragEvent, KeyboardEvent } from 'react'
import './styles.css'

export type UploadRejectReason = 'type' | 'size'
export type UploadFileStatus = 'queued' | 'uploading' | 'done' | 'error'

export interface UploadFileItem {
  name: string
  size: number
  progress?: number
  status?: UploadFileStatus
  error?: string
}

export interface UploadReject {
  file: File
  reason: UploadRejectReason
}

export interface UploadProps {
  label: string
  dropzoneLabel?: string
  browseLabel?: string
  multiple?: boolean
  /** Same grammar as the native file input `accept` attribute. */
  accept?: string
  /** Maximum byte size per file. Larger files are rejected, not truncated. */
  maxSize?: number
  /** Controlled list for names, sizes, and caller-measured progress. */
  files?: UploadFileItem[]
  onFiles?: (files: File[]) => void
  onReject?: (rejections: UploadReject[]) => void
  className?: string
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true
  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
  if (tokens.length === 0) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return tokens.some((token) => {
    if (token === '*/*') return true
    if (token.startsWith('.')) return name.endsWith(token)
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1))
    return type === token
  })
}

function toItem(file: File): UploadFileItem {
  return { name: file.name, size: file.size, status: 'queued' }
}

export function Upload({
  label,
  dropzoneLabel = 'Drag files here',
  browseLabel = 'Browse files',
  multiple = true,
  accept,
  maxSize,
  files: filesProp,
  onFiles,
  onReject,
  className,
}: UploadProps) {
  const [uncontrolledFiles, setUncontrolledFiles] = useState<File[]>([])
  const [dragover, setDragover] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isControlled = filesProp !== undefined
  const listed: UploadFileItem[] = isControlled ? filesProp : uncontrolledFiles.map(toItem)
  const uploading = listed.some(
    (item) => item.status === 'uploading' || (item.progress !== undefined && item.progress < 100),
  )
  const aiState = dragover ? 'dragover' : listed.length > 0 ? 'uploading' : 'default'
  const classes = ['cu-upload', dragover ? 'cu-upload--dragover' : '', className].filter(Boolean).join(' ')
  const sizeFormat = new Intl.NumberFormat(undefined, {
    style: 'unit',
    unit: 'kilobyte',
    maximumFractionDigits: 0,
  })

  const acceptIncoming = (incoming: Iterable<File>) => {
    const accepted: File[] = []
    const rejections: UploadReject[] = []
    for (const file of incoming) {
      if (!matchesAccept(file, accept)) {
        rejections.push({ file, reason: 'type' })
        continue
      }
      if (typeof maxSize === 'number' && file.size > maxSize) {
        rejections.push({ file, reason: 'size' })
        continue
      }
      accepted.push(file)
    }
    if (rejections.length > 0) onReject?.(rejections)
    if (accepted.length === 0) return
    const nextFiles = multiple ? [...uncontrolledFiles, ...accepted] : accepted.slice(0, 1)
    if (!isControlled) setUncontrolledFiles(nextFiles)
    onFiles?.(isControlled ? (multiple ? accepted : accepted.slice(0, 1)) : nextFiles)
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragover(false)
    acceptIncoming(event.dataTransfer.files)
  }

  const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (event.clipboardData.files.length > 0) {
      event.preventDefault()
      acceptIncoming(event.clipboardData.files)
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
      data-ai-role="upload"
      data-ai-intent="upload-file"
      data-ai-state={aiState}
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
        accept={accept}
        className="cu-upload__input"
        type="file"
        multiple={multiple}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          acceptIncoming(event.currentTarget.files ?? [])
          event.currentTarget.value = ''
        }}
      />
      {listed.length > 0 ? (
        <ul className="cu-upload__list">
          {listed.map((file, index) => {
            const progress = clampProgress(file.progress)
            return (
              <li key={`${file.name}-${index}`} className="cu-upload__file">
                <span className="cu-upload__name">{file.name}</span>
                <span className="cu-upload__size">{sizeFormat.format(Math.ceil(file.size / 1024))}</span>
                {progress !== undefined ? (
                  <progress
                    aria-label={`${file.name} ${progress}%`}
                    className="cu-upload__progress"
                    max={100}
                    value={progress}
                  />
                ) : null}
                {file.error ? <span className="cu-upload__error">{file.error}</span> : null}
              </li>
            )
          })}
        </ul>
      ) : null}
      {uploading ? <span className="cu-upload__sr">Uploading</span> : null}
    </div>
  )
}

function clampProgress(value?: number): number | undefined {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined
  return Math.min(100, Math.max(0, value))
}
