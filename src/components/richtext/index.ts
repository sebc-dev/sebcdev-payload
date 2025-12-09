/**
 * RichText Component Module
 *
 * Exports for Lexical JSON to React serialization.
 */

// Main component
export { RichText } from './RichText'

// Serializer
export { serializeLexical, serializeChildren, serializeNode, serializeText } from './serialize'

// Types
export type {
  LexicalContent,
  LexicalNode,
  TextNode,
  ParagraphNode,
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  LinkNode,
  AutoLinkNode,
  CodeNode,
  UploadNode,
  RootNode,
  LinkFields,
  BaseLexicalNode,
  TextFormat,
  NodeRendererProps,
} from './types'
export { TEXT_FORMAT, hasChildren, isTextNode, isHeadingNode, isLexicalContent } from './types'

// Node components (for advanced usage)
export { Paragraph } from './nodes/Paragraph'
export { Heading, slugify } from './nodes/Heading'
export { List, ListItem } from './nodes/List'
export { Quote } from './nodes/Quote'
export { Link, isExternalUrl, isSpecialProtocol } from './nodes/Link'
