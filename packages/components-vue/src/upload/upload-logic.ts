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
  accept?: string
  maxSize?: number
  files?: UploadFileItem[]
  class?: string
}

export function matchesAccept(file: File, accept?: string): boolean {
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

export function clampProgress(value?: number): number | undefined {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined
  return Math.min(100, Math.max(0, value))
}
