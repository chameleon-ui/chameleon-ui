export interface CommandItem {
  value: string
  label: string
  shortcut?: string
  group?: string
}

/**
 * Filters then stably sorts commands for the palette list.
 *
 * @complexity time O(n log n) | space O(n) | n = command count
 * @guarantees default order is localeCompare('en') on label then value — reproducible
 */
export function filterCommands(commands: CommandItem[], query: string): CommandItem[] {
  const needle = query.trim().toLowerCase()
  const matched =
    needle.length === 0
      ? commands
      : commands.filter(
          (command) =>
            command.label.toLowerCase().includes(needle) ||
            command.value.toLowerCase().includes(needle),
        )
  return [...matched].sort((left, right) => {
    const byLabel = left.label.localeCompare(right.label, 'en')
    if (byLabel !== 0) return byLabel
    return left.value.localeCompare(right.value, 'en')
  })
}
