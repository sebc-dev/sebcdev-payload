import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useActiveSection } from '@/hooks/use-active-section'

describe('useActiveSection', () => {
  // Mock IntersectionObserver
  let mockObserve: ReturnType<typeof vi.fn>
  let mockDisconnect: ReturnType<typeof vi.fn>
  let mockCallback: IntersectionObserverCallback | null = null

  beforeEach(() => {
    mockObserve = vi.fn()
    mockDisconnect = vi.fn()

    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn((callback: IntersectionObserverCallback) => {
        mockCallback = callback
        return {
          observe: mockObserve,
          disconnect: mockDisconnect,
          unobserve: vi.fn(),
          root: null,
          rootMargin: '',
          thresholds: [],
          takeRecords: vi.fn(),
        }
      }),
    )

    // Mock getElementById to return elements
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      const element = document.createElement('div')
      element.id = id
      return element
    })

    // Mock scrollY - default to scrolled position to avoid initial active section
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(150)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    mockCallback = null
  })

  describe('initialization', () => {
    it('returns null when no sections provided', () => {
      const { result } = renderHook(() => useActiveSection({ sectionIds: [] }))

      expect(result.current).toBeNull()
    })

    it('creates IntersectionObserver with correct options', () => {
      renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main'],
          topOffset: 100,
          threshold: 0.5,
        }),
      )

      expect(IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          rootMargin: '-100px 0px -60% 0px',
          threshold: 0.5,
        }),
      )
    })

    it('observes all section elements', () => {
      renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main', 'conclusion'],
        }),
      )

      // Each element observed (may be called multiple times due to React strict mode)
      expect(mockObserve).toHaveBeenCalled()
      // Verify observe was called for each section ID
      const observedElements = mockObserve.mock.calls.map((call) => call[0].id)
      expect(observedElements).toContain('intro')
      expect(observedElements).toContain('main')
      expect(observedElements).toContain('conclusion')
    })

    it('sets first section as active when at top of page', () => {
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)

      const { result } = renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main'],
        }),
      )

      expect(result.current).toBe('intro')
    })

    it('does not set initial active when scrolled past threshold', () => {
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(150)

      const { result } = renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main'],
        }),
      )

      // No initial active section set when scrolled past 100px
      expect(result.current).toBeNull()
    })
  })

  describe('intersection handling', () => {
    it('updates active section when entry becomes visible', () => {
      // Start scrolled so no initial active
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(150)

      const { result } = renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main'],
        }),
      )

      // Initially null since scrolled
      expect(result.current).toBeNull()

      // Simulate intersection
      act(() => {
        mockCallback?.(
          [
            {
              target: { id: 'main' } as Element,
              isIntersecting: true,
              intersectionRatio: 0.5,
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        )
      })

      expect(result.current).toBe('main')
    })

    it('returns first visible section in document order', () => {
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(150)

      const { result } = renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main', 'conclusion'],
        }),
      )

      // Simulate multiple sections visible
      act(() => {
        mockCallback?.(
          [
            {
              target: { id: 'main' } as Element,
              isIntersecting: true,
              intersectionRatio: 0.3,
            } as IntersectionObserverEntry,
            {
              target: { id: 'conclusion' } as Element,
              isIntersecting: true,
              intersectionRatio: 0.3,
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        )
      })

      // 'main' comes before 'conclusion' in sectionIds
      expect(result.current).toBe('main')
    })

    it('removes section from visible set when not intersecting', () => {
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(150)

      const { result } = renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main'],
        }),
      )

      // First, make 'main' visible
      act(() => {
        mockCallback?.(
          [
            {
              target: { id: 'main' } as Element,
              isIntersecting: true,
              intersectionRatio: 0.5,
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        )
      })

      expect(result.current).toBe('main')

      // Then make 'main' not visible and 'intro' visible
      act(() => {
        mockCallback?.(
          [
            {
              target: { id: 'main' } as Element,
              isIntersecting: false,
              intersectionRatio: 0,
            } as IntersectionObserverEntry,
            {
              target: { id: 'intro' } as Element,
              isIntersecting: true,
              intersectionRatio: 0.5,
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        )
      })

      expect(result.current).toBe('intro')
    })

    it('keeps last active when no sections visible', () => {
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(150)

      const { result } = renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main'],
        }),
      )

      // Make 'main' visible
      act(() => {
        mockCallback?.(
          [
            {
              target: { id: 'main' } as Element,
              isIntersecting: true,
              intersectionRatio: 0.5,
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        )
      })

      expect(result.current).toBe('main')

      // Make 'main' not visible (no other sections visible)
      act(() => {
        mockCallback?.(
          [
            {
              target: { id: 'main' } as Element,
              isIntersecting: false,
              intersectionRatio: 0,
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        )
      })

      // Should keep 'main' as active for smoother UX
      expect(result.current).toBe('main')
    })
  })

  describe('cleanup', () => {
    it('disconnects observer on unmount', () => {
      const { unmount } = renderHook(() =>
        useActiveSection({
          sectionIds: ['intro', 'main'],
        }),
      )

      unmount()

      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('disconnects and recreates observer when sectionIds change', () => {
      const { rerender } = renderHook(({ sectionIds }) => useActiveSection({ sectionIds }), {
        initialProps: { sectionIds: ['intro'] },
      })

      // Clear the mock to track only new calls
      mockDisconnect.mockClear()

      rerender({ sectionIds: ['intro', 'main'] })

      expect(mockDisconnect).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('handles missing DOM elements gracefully', () => {
      vi.spyOn(document, 'getElementById').mockReturnValue(null)
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(150)

      const { result } = renderHook(() =>
        useActiveSection({
          sectionIds: ['nonexistent'],
        }),
      )

      // Should not throw, observe not called for missing elements
      expect(mockObserve).not.toHaveBeenCalled()
      // No active section since scrolled and no elements observed
      expect(result.current).toBeNull()
    })

    it('uses default values for topOffset and threshold', () => {
      renderHook(() =>
        useActiveSection({
          sectionIds: ['intro'],
        }),
      )

      expect(IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          rootMargin: '-80px 0px -60% 0px',
          threshold: 0.3,
        }),
      )
    })
  })
})
