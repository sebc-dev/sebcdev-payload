import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useReadingProgress } from '@/hooks/use-reading-progress'

describe('useReadingProgress', () => {
  let scrollY = 0
  let innerHeight = 800
  let scrollHeight = 2000

  // Store original property descriptors for cleanup
  let originalScrollY: PropertyDescriptor | undefined
  let originalInnerHeight: PropertyDescriptor | undefined
  let originalScrollHeight: PropertyDescriptor | undefined

  // Spies for RAF - declared at describe level for reuse
  let rafSpy: ReturnType<typeof vi.spyOn<typeof window, 'requestAnimationFrame'>>

  beforeEach(() => {
    // Reset values
    scrollY = 0
    innerHeight = 800
    scrollHeight = 2000

    // Capture original descriptors before mocking
    originalScrollY = Object.getOwnPropertyDescriptor(window, 'scrollY')
    originalInnerHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight')
    originalScrollHeight = Object.getOwnPropertyDescriptor(document.documentElement, 'scrollHeight')

    // Mock window.scrollY as a getter
    Object.defineProperty(window, 'scrollY', {
      get: () => scrollY,
      configurable: true,
    })

    // Mock window.innerHeight
    Object.defineProperty(window, 'innerHeight', {
      get: () => innerHeight,
      configurable: true,
    })

    // Mock document.documentElement.scrollHeight
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      get: () => scrollHeight,
      configurable: true,
    })

    // Mock requestAnimationFrame to execute immediately (default behavior)
    rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore original property descriptors
    if (originalScrollY) {
      Object.defineProperty(window, 'scrollY', originalScrollY)
    } else {
      delete (window as Record<string, unknown>).scrollY
    }

    if (originalInnerHeight) {
      Object.defineProperty(window, 'innerHeight', originalInnerHeight)
    } else {
      delete (window as Record<string, unknown>).innerHeight
    }

    if (originalScrollHeight) {
      Object.defineProperty(document.documentElement, 'scrollHeight', originalScrollHeight)
    } else {
      delete (document.documentElement as Record<string, unknown>).scrollHeight
    }

    vi.restoreAllMocks()
  })

  describe('document-based tracking (no ref)', () => {
    it('returns 0 when at top of page', () => {
      scrollY = 0

      const { result } = renderHook(() => useReadingProgress())

      expect(result.current).toBe(0)
    })

    it('returns 100 when at bottom of page', () => {
      // scrollableHeight = 2000 - 800 = 1200
      // scrollY = 1200 = 100%
      scrollY = 1200

      const { result } = renderHook(() => useReadingProgress())

      expect(result.current).toBe(100)
    })

    it('returns 50 when halfway through document', () => {
      // scrollableHeight = 2000 - 800 = 1200
      // scrollY = 600 = 50%
      scrollY = 600

      const { result } = renderHook(() => useReadingProgress())

      expect(result.current).toBe(50)
    })

    it('returns 100 when document is shorter than viewport', () => {
      scrollHeight = 600
      innerHeight = 800

      const { result } = renderHook(() => useReadingProgress())

      expect(result.current).toBe(100)
    })
  })

  describe('article-ref based tracking', () => {
    it('returns 0 when article top is at viewport top', () => {
      scrollY = 0

      const mockElement = {
        getBoundingClientRect: () => ({
          top: 0,
          bottom: 2000,
          height: 2000,
          left: 0,
          right: 0,
          width: 0,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }),
        offsetHeight: 2000,
      } as HTMLElement

      const mockRef = { current: mockElement }

      const { result } = renderHook(() => useReadingProgress(mockRef))

      expect(result.current).toBe(0)
    })

    it('returns 100 when scrolled past article', () => {
      // Article starts at y=0, height=2000, viewport=800
      // End = 0 + 2000 - 800 = 1200
      // When scrollY = 1200, we're at end
      scrollY = 1200

      const mockElement = {
        getBoundingClientRect: () => ({
          // When scrollY=1200 and element starts at 0, rect.top = -1200
          top: -scrollY,
          bottom: 2000 - scrollY,
          height: 2000,
          left: 0,
          right: 0,
          width: 0,
          x: 0,
          y: -scrollY,
          toJSON: () => ({}),
        }),
        offsetHeight: 2000,
      } as HTMLElement

      const mockRef = { current: mockElement }

      const { result } = renderHook(() => useReadingProgress(mockRef))

      expect(result.current).toBe(100)
    })

    it('returns 50 when halfway through article', () => {
      // Article starts at y=0, height=2000, viewport=800
      // End = 0 + 2000 - 800 = 1200
      // When scrollY = 600, we're at 50%
      scrollY = 600

      const mockElement = {
        getBoundingClientRect: () => ({
          top: -scrollY,
          bottom: 2000 - scrollY,
          height: 2000,
          left: 0,
          right: 0,
          width: 0,
          x: 0,
          y: -scrollY,
          toJSON: () => ({}),
        }),
        offsetHeight: 2000,
      } as HTMLElement

      const mockRef = { current: mockElement }

      const { result } = renderHook(() => useReadingProgress(mockRef))

      expect(result.current).toBe(50)
    })

    it('returns 100 for short article fully visible in viewport', () => {
      // Article height=400, viewport=800, article at Y=100
      // Article fits entirely in viewport
      scrollY = 0
      innerHeight = 800

      const mockElement = {
        getBoundingClientRect: () => ({
          top: 100,
          bottom: 500,
          height: 400,
          left: 0,
          right: 0,
          width: 0,
          x: 0,
          y: 100,
          toJSON: () => ({}),
        }),
        offsetHeight: 400,
      } as HTMLElement

      const mockRef = { current: mockElement }

      const { result } = renderHook(() => useReadingProgress(mockRef))

      // Short article fully visible = 100% read
      expect(result.current).toBe(100)
    })

    it('returns 0 for short article not yet in viewport', () => {
      // Article height=400, viewport=800, article below viewport
      scrollY = 0
      innerHeight = 800

      const mockElement = {
        getBoundingClientRect: () => ({
          top: 1000, // Below viewport
          bottom: 1400,
          height: 400,
          left: 0,
          right: 0,
          width: 0,
          x: 0,
          y: 1000,
          toJSON: () => ({}),
        }),
        offsetHeight: 400,
      } as HTMLElement

      const mockRef = { current: mockElement }

      const { result } = renderHook(() => useReadingProgress(mockRef))

      // Short article not visible = 0%
      expect(result.current).toBe(0)
    })

    it('returns 0 for short article scrolled past viewport top', () => {
      // Article height=400, originally at Y=100, now scrolled past
      // This documents current behavior: scrolled-past short articles show 0%
      scrollY = 600
      innerHeight = 800

      const mockElement = {
        getBoundingClientRect: () => ({
          top: 100 - scrollY, // -500 (above viewport)
          bottom: 500 - scrollY, // -100 (above viewport)
          height: 400,
          left: 0,
          right: 0,
          width: 0,
          x: 0,
          y: 100 - scrollY,
          toJSON: () => ({}),
        }),
        offsetHeight: 400,
      } as HTMLElement

      const mockRef = { current: mockElement }

      const { result } = renderHook(() => useReadingProgress(mockRef))

      // Short article scrolled past top = 0% (current behavior)
      expect(result.current).toBe(0)
    })
  })

  describe('scroll event handling', () => {
    it('updates progress on scroll event', () => {
      scrollY = 0

      const { result } = renderHook(() => useReadingProgress())
      expect(result.current).toBe(0)

      // Simulate scroll
      scrollY = 600
      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current).toBe(50)
    })

    it('updates progress on resize event', () => {
      // Initial: scrollY=600, innerHeight=800, scrollHeight=2000
      // scrollableHeight = 2000 - 800 = 1200
      // progress = 600 / 1200 = 50%
      scrollY = 600
      innerHeight = 800
      scrollHeight = 2000

      const { result } = renderHook(() => useReadingProgress())
      expect(result.current).toBe(50)

      // Simulate viewport resize: innerHeight changes to 1000
      // New scrollableHeight = 2000 - 1000 = 1000
      // New progress = 600 / 1000 = 60%
      innerHeight = 1000
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })

      expect(result.current).toBe(60)
    })

    it('cleans up scroll and resize listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useReadingProgress())
      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    })

    it('cancels pending requestAnimationFrame on unmount', () => {
      const rafId = 12345
      rafSpy.mockImplementation(() => rafId)
      const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame')

      const { unmount } = renderHook(() => useReadingProgress())

      // Trigger a scroll to schedule RAF
      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })

      // Unmount should cancel the pending RAF
      unmount()

      expect(cancelSpy).toHaveBeenCalledWith(rafId)
    })

    it('throttles multiple scroll events via requestAnimationFrame', () => {
      // Capture RAF callbacks instead of executing immediately
      let rafCallback: FrameRequestCallback | null = null
      let rafCallCount = 0

      rafSpy.mockImplementation((cb) => {
        rafCallback = cb
        rafCallCount++
        return rafCallCount
      })

      scrollY = 0
      const { result } = renderHook(() => useReadingProgress())

      // Initial render calls updateProgress() directly, not via RAF
      const initialRafCount = rafCallCount
      expect(initialRafCount).toBe(0)

      // Dispatch multiple scroll events synchronously
      scrollY = 300
      act(() => {
        window.dispatchEvent(new Event('scroll'))
        window.dispatchEvent(new Event('scroll'))
        window.dispatchEvent(new Event('scroll'))
      })

      // RAF should only be scheduled once more (throttling works)
      expect(rafCallCount).toBe(initialRafCount + 1)

      // Progress hasn't updated yet (RAF pending)
      expect(result.current).toBe(0)

      // Flush the RAF callback
      scrollY = 600
      act(() => {
        if (rafCallback) {
          rafCallback(0)
        }
      })

      // Now progress should update
      expect(result.current).toBe(50)
    })
  })

  describe('edge cases', () => {
    it('clamps negative values to 0', () => {
      // Force a negative calculation by having scroll before document start
      scrollY = -100

      const { result } = renderHook(() => useReadingProgress())

      expect(result.current).toBe(0)
    })

    it('clamps values over 100 to 100', () => {
      // Scroll past the end
      scrollY = 2000

      const { result } = renderHook(() => useReadingProgress())

      expect(result.current).toBe(100)
    })

    it('handles null ref gracefully by falling back to document', () => {
      scrollY = 600 // 50% of document
      const mockRef: { current: HTMLElement | null } = { current: null }

      const { result } = renderHook(() => useReadingProgress(mockRef))

      // Should fall back to document-based calculation = 50%
      expect(result.current).toBe(50)
    })
  })
})
