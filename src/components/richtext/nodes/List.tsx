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
  isCheckList?: boolean
}

export function List({ node }: ListProps) {
  const isCheckList = node.listType === 'check'
  const Tag = node.listType === 'number' ? 'ol' : 'ul'
  const listStyle =
    node.listType === 'number' ? 'list-decimal' : isCheckList ? 'list-none' : 'list-disc'

  return (
    <Tag className={`${listStyle} pl-6 mb-4 space-y-1`} start={node.start}>
      {node.children.map((child, index) => (
        <ListItem key={index} node={child} isCheckList={isCheckList} />
      ))}
    </Tag>
  )
}

export function ListItem({ node, isCheckList = false }: ListItemProps) {
  // Check if this list item contains a nested list
  const hasNestedList = node.children.some((child) => child.type === 'list')

  return (
    <li className={hasNestedList ? 'list-none' : ''}>
      {isCheckList && (
        <input
          type="checkbox"
          checked={node.checked ?? false}
          readOnly
          className="mr-2 pointer-events-none"
          aria-label={node.checked ? 'Completed' : 'Not completed'}
        />
      )}
      {serializeChildren(node.children)}
    </li>
  )
}
