'use client'

import { useEffect, useState, type RefObject } from 'react'

/**
 * Custom hook to track reading progress of an article.
 *
 * Uses requestAnimationFrame for performant scroll handling and
 * supports both article-specific tracking (via ref) or full document tracking.
 *
 * @param articleRef - Optional ref to the article element. If not provided,
 *                     tracks progress of the entire document.
 * @returns progress - Number between 0 and 100 representing reading progress
 *
 * @example
 * // Track entire document
 * const progress = useReadingProgress()
 *
 * @example
 * // Track specific article element
 * const articleRef = useRef<HTMLElement>(null)
 * const progress = useReadingProgress(articleRef)
 *
 * <article ref={articleRef}>...</article>
 */
export function useReadingProgress(articleRef?: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let rafId: number | null = null
    let ticking = false

    const calculateProgress = (): number => {
      if (articleRef?.current) {
        // Calculate based on article element
        const element = articleRef.current
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + window.scrollY
        const elementHeight = element.offsetHeight
        const windowHeight = window.innerHeight
        const scrollY = window.scrollY

        // Start progress when article top enters viewport
        const start = elementTop
        // End progress when article bottom reaches viewport bottom
        const end = elementTop + elementHeight - windowHeight

        if (scrollY <= start) return 0
        if (scrollY >= end) return 100

        return ((scrollY - start) / (end - start)) * 100
      } else {
        // Fallback: calculate based on full document
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight
        const winHeight = window.innerHeight
        const scrollableHeight = docHeight - winHeight

        if (scrollableHeight <= 0) return 100
        return (scrollTop / scrollableHeight) * 100
      }
    }

    const updateProgress = () => {
      const newProgress = Math.min(100, Math.max(0, calculateProgress()))
      setProgress(newProgress)
      ticking = false
    }

    const requestUpdate = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateProgress)
        ticking = true
      }
    }

    // Initial calculation
    updateProgress()

    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate, { passive: true })

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [articleRef])

  return progress
}
