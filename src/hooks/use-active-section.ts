'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

export interface UseActiveSectionOptions {
  /**
   * IDs of the sections to observe
   */
  sectionIds: string[]
  /**
   * Offset from top of viewport (e.g., for sticky header)
   * @default 80
   */
  topOffset?: number
  /**
   * Intersection threshold (0-1)
   * @default 0.3
   */
  threshold?: number
}

/**
 * Custom hook to track which section is currently active based on scroll position.
 *
 * Uses Intersection Observer to efficiently detect which section heading
 * is most visible in the viewport.
 *
 * @param options - Configuration options
 * @returns activeId - ID of the currently active section, or null if none
 *
 * @example
 * const activeId = useActiveSection({
 *   sectionIds: ['intro', 'features', 'conclusion'],
 *   topOffset: 100, // account for sticky header
 * })
 */
export function useActiveSection({
  sectionIds,
  topOffset = 80,
  threshold = 0.3,
}: UseActiveSectionOptions): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Track which sections are currently intersecting
  const visibleSectionsRef = useRef<Set<string>>(new Set())

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const id = entry.target.id

        if (entry.isIntersecting) {
          visibleSectionsRef.current.add(id)
        } else {
          visibleSectionsRef.current.delete(id)
        }
      })

      // Find the first visible section in document order
      const visibleInOrder = sectionIds.filter((id) => visibleSectionsRef.current.has(id))

      if (visibleInOrder.length > 0) {
        // Use the first visible section (highest in document)
        setActiveId(visibleInOrder[0])
      }
      // When no sections visible, keep the current active ID for smoother UX
    },
    [sectionIds],
  )

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Don't create observer if no sections to observe
    if (sectionIds.length === 0) {
      setActiveId(null)
      return
    }

    // Create new observer with root margin to trigger earlier
    // Negative top margin accounts for sticky header
    // Negative bottom margin triggers when element is in top portion
    const rootMargin = `-${topOffset}px 0px -60% 0px`

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold,
    })

    // Observe all section elements
    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observerRef.current?.observe(element)
      }
    })

    // Set initial active section (first one if at top)
    if (window.scrollY < topOffset && sectionIds.length > 0) {
      setActiveId(sectionIds[0])
    }

    // Capture ref values for cleanup
    const observer = observerRef.current
    const visibleSections = visibleSectionsRef.current

    return () => {
      observer?.disconnect()
      visibleSections.clear()
    }
  }, [sectionIds, topOffset, threshold, handleIntersection])

  return activeId
}
