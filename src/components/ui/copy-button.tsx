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

/** Duration in ms to show feedback (success/error) before resetting */
const FEEDBACK_DURATION_MS = 2000

interface CopyButtonProps {
  /** Text to copy (optional if copyFromDOM is true) */
  text?: string
  /** If true, copy text from nearest pre > code element in parent */
  copyFromDOM?: boolean
  className?: string
}

/**
 * CopyButton Component
 *
 * Copies text to clipboard with visual feedback.
 * Can copy from prop or extract from DOM for better RSC performance.
 */
export function CopyButton({ text, copyFromDOM = false, className }: CopyButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
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
    timeoutRef.current = setTimeout(() => setError(false), FEEDBACK_DURATION_MS)
  }, [])

  const handleCopy = useCallback(async () => {
    // Feature detection: fail fast if clipboard API unavailable
    if (!navigator.clipboard) {
      showError('Clipboard API not available in this context')
      return
    }

    // Determine text to copy
    let textToCopy: string
    if (copyFromDOM) {
      // Extract text from nearest pre > code element
      const button = buttonRef.current
      if (!button) {
        showError('Button ref not available')
        return
      }
      const container = button.closest('[data-code-container]')
      if (!container) {
        showError('Code container not found')
        return
      }
      const codeElement = container.querySelector('pre code')
      if (!codeElement) {
        showError('Code element not found')
        return
      }
      textToCopy = codeElement.textContent || ''
    } else {
      if (!text) {
        showError('No text provided to copy')
        return
      }
      textToCopy = text
    }

    // Guard against empty or whitespace-only content
    if (!textToCopy.trim()) {
      showError('No code to copy')
      return
    }

    try {
      await navigator.clipboard.writeText(textToCopy)
      setError(false) // Reset opposite state
      setCopied(true)
      // Clear any existing timeout before setting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => setCopied(false), FEEDBACK_DURATION_MS)
    } catch (err) {
      showError(`Failed to copy: ${err}`)
    }
  }, [text, copyFromDOM, showError])

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
      ref={buttonRef}
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
