const HEX_PATTERN = /^#?[0-9a-fA-F]{6}$/

export function normalizeHex(input: string): string | null {
  const trimmed = input.trim()
  if (!HEX_PATTERN.test(trimmed)) return null
  return (trimmed.startsWith('#') ? trimmed : `#${trimmed}`).toLowerCase()
}

export const DEFAULT_SWATCHES = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0f766e', '#111827']
