'use client'

/**
 * CopyButton Component
 *
 * Client-side button to copy text to clipboard.
 * Shows visual feedback on successful copy.
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { Check, Copy, X } from 'lucide-react'
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
  const [error, setError] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      // Clear any existing timeout before setting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Clipboard API may fail in some contexts
      console.error('Failed to copy:', err)
      setError(true)
      // Clear any existing timeout before setting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => setError(false), 2000)
    }
  }, [text])

  // Determine icon and aria-label based on state
  const getIcon = () => {
    if (error) return <X className="h-4 w-4 text-red-500" />
    if (copied) return <Check className="h-4 w-4 text-green-500" />
    return <Copy className="h-4 w-4" />
  }

  const getAriaLabel = () => {
    if (error) return 'Failed to copy'
    if (copied) return 'Copied!'
    return 'Copy code'
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleCopy}
      aria-label={getAriaLabel()}
    >
      {getIcon()}
    </Button>
  )
}
