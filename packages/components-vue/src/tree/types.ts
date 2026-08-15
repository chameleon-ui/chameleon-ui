export interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
}

export interface TreeProps {
  nodes: TreeNode[]
  defaultExpandedIds?: string[]
  toggleLabel?: string
  class?: string
}
