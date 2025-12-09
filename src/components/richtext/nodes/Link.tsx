/**
 * Link Node Component
 *
 * Renders anchor elements with proper handling for:
 * - Internal links (same domain) - uses Next.js Link
 * - External links - opens in new tab with security attrs
 * - mailto: and tel: links
 */

import NextLink from 'next/link'
import { serializeChildren } from '../serialize'
import type { LinkNode, AutoLinkNode } from '../types'

interface LinkProps {
  node: LinkNode | AutoLinkNode
}

/**
 * Check if URL is external (different domain)
 */
export function isExternalUrl(url: string): boolean {
  if (!url) return false
  if (url.startsWith('/')) return false
  if (url.startsWith('#')) return false
  if (url.startsWith('mailto:')) return false
  if (url.startsWith('tel:')) return false

  try {
    const urlObj = new URL(url)
    // Check if it's a different origin
    if (typeof window !== 'undefined') {
      return urlObj.origin !== window.location.origin
    }
    // On server, treat http/https URLs as potentially external
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Check if URL is a special protocol (mailto, tel)
 */
export function isSpecialProtocol(url: string): boolean {
  return url.startsWith('mailto:') || url.startsWith('tel:')
}

export function Link({ node }: LinkProps) {
  const url = node.fields?.url || '#'
  const newTab = node.fields?.newTab ?? isExternalUrl(url)
  const isExternal = isExternalUrl(url)
  const isSpecial = isSpecialProtocol(url)

  const className =
    'text-primary hover:text-primary/80 underline underline-offset-4 transition-colors'

  // Special protocol links (mailto, tel)
  if (isSpecial) {
    return (
      <a href={url} className={className}>
        {serializeChildren(node.children)}
      </a>
    )
  }

  // External links - open in new tab with security
  if (isExternal || newTab) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
        {serializeChildren(node.children)}
      </a>
    )
  }

  // Internal links - use Next.js Link for client-side navigation
  return (
    <NextLink href={url} className={className}>
      {serializeChildren(node.children)}
    </NextLink>
  )
}
