/**
 * List Node Components
 *
 * Renders ordered and unordered lists with proper nesting support.
 */

import { serializeChildren } from '../serialize'
import type { ListNode, ListItemNode } from '../types'

interface ListProps {
  node: ListNode
}

interface ListItemProps {
  node: ListItemNode
}

export function List({ node }: ListProps) {
  const Tag = node.listType === 'number' ? 'ol' : 'ul'
  const listStyle = node.listType === 'number' ? 'list-decimal' : 'list-disc'

  return (
    <Tag className={`${listStyle} pl-6 mb-4 space-y-1`} start={node.start}>
      {node.children.map((child, index) => (
        <ListItem key={index} node={child} />
      ))}
    </Tag>
  )
}

export function ListItem({ node }: ListItemProps) {
  // Check if this list item contains a nested list
  const hasNestedList = node.children.some((child) => child.type === 'list')

  return <li className={hasNestedList ? 'list-none' : ''}>{serializeChildren(node.children)}</li>
}
