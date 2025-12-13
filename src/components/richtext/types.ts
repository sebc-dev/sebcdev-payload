/**
 * Lexical JSON Type Definitions
 *
 * Types for Payload CMS Lexical richText editor output.
 * Used by the serializer to convert JSON to React components.
 *
 * @see https://payloadcms.com/docs/rich-text/lexical
 */

/**
 * Text format flags (bitmask)
 * Combined using bitwise OR: bold + italic = 1 | 2 = 3
 */
export const TEXT_FORMAT = {
  BOLD: 1,
  ITALIC: 2,
  STRIKETHROUGH: 4,
  UNDERLINE: 8,
  CODE: 16,
  SUBSCRIPT: 32,
  SUPERSCRIPT: 64,
} as const

/** @public - Type definition for text formatting, may be used in custom components */
export type TextFormat = (typeof TEXT_FORMAT)[keyof typeof TEXT_FORMAT]

/**
 * Base node properties shared by all Lexical nodes
 */
export interface BaseLexicalNode {
  type: string
  version: number
  direction?: 'ltr' | 'rtl' | null
  format?: string | number
  indent?: number
}

/**
 * Text node - leaf node containing actual text content
 */
export interface TextNode extends BaseLexicalNode {
  type: 'text'
  text: string
  format: number // Bitmask of TextFormat flags
  mode?: 'normal' | 'token' | 'segmented'
  style?: string
  detail?: number
}

/**
 * Linebreak node - represents a line break
 */
export interface LinebreakNode extends BaseLexicalNode {
  type: 'linebreak'
}

/**
 * Paragraph node - block element containing text/inline nodes
 */
export interface ParagraphNode extends BaseLexicalNode {
  type: 'paragraph'
  children: LexicalNode[]
  textFormat?: number
}

/**
 * Heading node - h1-h6 elements
 */
export interface HeadingNode extends BaseLexicalNode {
  type: 'heading'
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: LexicalNode[]
}

/**
 * List node - ordered or unordered list
 */
export interface ListNode extends BaseLexicalNode {
  type: 'list'
  listType: 'bullet' | 'number' | 'check'
  tag: 'ul' | 'ol'
  children: ListItemNode[]
  start?: number
}

/**
 * List item node - individual list item
 */
export interface ListItemNode extends BaseLexicalNode {
  type: 'listitem'
  children: LexicalNode[]
  checked?: boolean
  value?: number
}

/**
 * Quote node - blockquote element
 */
export interface QuoteNode extends BaseLexicalNode {
  type: 'quote'
  children: LexicalNode[]
}

/**
 * Link fields from Payload
 */
export interface LinkFields {
  url?: string
  newTab?: boolean
  linkType?: 'custom' | 'internal'
  doc?: {
    value: unknown
    relationTo: string
  }
}

/**
 * Link node - anchor element
 */
export interface LinkNode extends BaseLexicalNode {
  type: 'link'
  fields: LinkFields
  children: LexicalNode[]
}

/**
 * Autolink node - automatically detected links
 */
export interface AutoLinkNode extends BaseLexicalNode {
  type: 'autolink'
  fields: LinkFields
  children: LexicalNode[]
}

/**
 * Code block node - legacy native Lexical code node
 */
export interface CodeNode extends BaseLexicalNode {
  type: 'code'
  language?: string
  children: LexicalNode[]
}

/**
 * Block node - custom blocks from BlocksFeature
 */
export interface BlockNode extends BaseLexicalNode {
  type: 'block'
  fields: {
    blockType: string
    blockName?: string
    [key: string]: unknown
  }
}

/**
 * Upload/Image node - Lexical upload node for media files
 *
 * When stored, `value` is the media document ID (number).
 * When fetched with depth >= 1, Payload populates `value` as the full Media object.
 */
export interface UploadNode extends BaseLexicalNode {
  type: 'upload'
  /** Media document ID (when unpopulated) or populated Media object */
  value:
    | number
    | string
    | {
        id: number | string
        url?: string
        alt?: string
        width?: number
        height?: number
      }
  fields?: Record<string, unknown>
  relationTo?: string
}

/**
 * Root node - top-level container
 */
export interface RootNode extends BaseLexicalNode {
  type: 'root'
  children: LexicalNode[]
}

/**
 * Union type of all supported Lexical nodes
 */
export type LexicalNode =
  | TextNode
  | LinebreakNode
  | ParagraphNode
  | HeadingNode
  | ListNode
  | ListItemNode
  | QuoteNode
  | LinkNode
  | AutoLinkNode
  | CodeNode
  | BlockNode
  | UploadNode
  | RootNode

/**
 * Lexical content structure from Payload
 */
export interface LexicalContent {
  root: RootNode
}

/**
 * Props for node renderer components
 * @public - Type definition for custom node renderers
 */
export interface NodeRendererProps {
  node: LexicalNode
}

/**
 * Type guard to check if node has children
 */
export function hasChildren(node: LexicalNode): node is LexicalNode & { children: LexicalNode[] } {
  return 'children' in node && Array.isArray(node.children)
}

/**
 * Type guard for text nodes
 */
export function isTextNode(node: LexicalNode): node is TextNode {
  return node.type === 'text'
}

/**
 * Type guard for heading nodes
 */
export function isHeadingNode(node: LexicalNode): node is HeadingNode {
  return node.type === 'heading'
}

/**
 * Type guard for block nodes
 * @param node - Node to check (accepts unknown for safe usage in serializers)
 */
export function isBlockNode(node: unknown): node is BlockNode {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    node.type === 'block' &&
    'fields' in node &&
    typeof node.fields === 'object' &&
    node.fields !== null &&
    'blockType' in node.fields &&
    typeof node.fields.blockType === 'string'
  )
}

/**
 * Type guard for LexicalContent - validates minimal structure
 */
export function isLexicalContent(value: unknown): value is LexicalContent {
  return (
    typeof value === 'object' &&
    value !== null &&
    'root' in value &&
    typeof (value as LexicalContent).root === 'object' &&
    (value as LexicalContent).root?.type === 'root'
  )
}
