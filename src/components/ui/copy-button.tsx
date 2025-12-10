'use client'

/**
 * CopyButton Component
 *
 * Client-side button to copy text to clipboard.
 * Shows visual feedback on successful copy.
 */

import { useState, useCallback } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from './button'

interface CopyButtonProps {
  text: string
  className?: string
}

/**
 * CopyButton Component
 *
 * Copies text to clipboard with visual feedback.
 */
export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Clipboard API may fail in some contexts
      console.error('Failed to copy:', error)
    }
  }, [text])

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}
