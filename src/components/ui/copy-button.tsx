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

  // Helper to show error state with timeout
  const showError = useCallback((message: string) => {
    console.error(message)
    setCopied(false) // Reset opposite state
    setError(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => setError(false), 2000)
  }, [])

  const handleCopy = useCallback(async () => {
    // Feature detection: fail fast if clipboard API unavailable
    if (!navigator.clipboard) {
      showError('Clipboard API not available in this context')
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      setError(false) // Reset opposite state
      setCopied(true)
      // Clear any existing timeout before setting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      showError(`Failed to copy: ${err}`)
    }
  }, [text, showError])

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
