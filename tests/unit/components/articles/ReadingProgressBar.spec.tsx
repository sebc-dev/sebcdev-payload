import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ReadingProgressBar } from '@/components/articles/ReadingProgressBar'

// Mock the hook
vi.mock('@/hooks/use-reading-progress', () => ({
  useReadingProgress: vi.fn(() => 0),
}))

import { useReadingProgress } from '@/hooks/use-reading-progress'

const mockUseReadingProgress = vi.mocked(useReadingProgress)

describe('ReadingProgressBar', () => {
  beforeEach(() => {
    mockUseReadingProgress.mockReturnValue(0)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders the progress bar container', () => {
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeTruthy()
    })

    it('renders with default aria-label', () => {
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar.getAttribute('aria-label')).toBe('Reading progress')
    })

    it('renders with custom aria-label', () => {
      render(<ReadingProgressBar ariaLabel="Article progress" />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar.getAttribute('aria-label')).toBe('Article progress')
    })

    it('applies custom className', () => {
      render(<ReadingProgressBar className="custom-class" />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar.className).toContain('custom-class')
    })
  })

  describe('accessibility', () => {
    it('has correct ARIA attributes at 0%', () => {
      mockUseReadingProgress.mockReturnValue(0)
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar.getAttribute('aria-valuenow')).toBe('0')
      expect(progressBar.getAttribute('aria-valuemin')).toBe('0')
      expect(progressBar.getAttribute('aria-valuemax')).toBe('100')
    })

    it('has correct ARIA attributes at 50%', () => {
      mockUseReadingProgress.mockReturnValue(50)
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar.getAttribute('aria-valuenow')).toBe('50')
    })

    it('has correct ARIA attributes at 100%', () => {
      mockUseReadingProgress.mockReturnValue(100)
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar.getAttribute('aria-valuenow')).toBe('100')
    })

    it('rounds progress values for aria-valuenow', () => {
      mockUseReadingProgress.mockReturnValue(33.333)
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar.getAttribute('aria-valuenow')).toBe('33')
    })
  })

  describe('progress visualization', () => {
    it('renders inner bar with 0% width initially', () => {
      mockUseReadingProgress.mockReturnValue(0)
      const { container } = render(<ReadingProgressBar />)

      const innerBar = container.querySelector('[class*="bg-primary"]') as HTMLElement
      expect(innerBar.style.width).toBe('0%')
    })

    it('renders inner bar with 50% width at halfway', () => {
      mockUseReadingProgress.mockReturnValue(50)
      const { container } = render(<ReadingProgressBar />)

      const innerBar = container.querySelector('[class*="bg-primary"]') as HTMLElement
      expect(innerBar.style.width).toBe('50%')
    })

    it('renders inner bar with 100% width when complete', () => {
      mockUseReadingProgress.mockReturnValue(100)
      const { container } = render(<ReadingProgressBar />)

      const innerBar = container.querySelector('[class*="bg-primary"]') as HTMLElement
      expect(innerBar.style.width).toBe('100%')
    })
  })

  describe('styling', () => {
    it('has fixed positioning classes', () => {
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar.className).toContain('fixed')
      expect(progressBar.className).toContain('top-0')
      expect(progressBar.className).toContain('left-0')
      expect(progressBar.className).toContain('right-0')
    })

    it('has z-index for layering', () => {
      render(<ReadingProgressBar />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar.className).toContain('z-50')
    })

    it('has motion-reduce class for reduced motion support', () => {
      const { container } = render(<ReadingProgressBar />)

      const innerBar = container.querySelector('[class*="bg-primary"]')
      expect(innerBar?.className).toContain('motion-reduce:transition-none')
    })
  })

  describe('integration with hook', () => {
    it('passes articleRef to useReadingProgress', () => {
      const mockRef = { current: document.createElement('article') }

      render(<ReadingProgressBar articleRef={mockRef} />)

      expect(mockUseReadingProgress).toHaveBeenCalledWith(mockRef)
    })

    it('calls useReadingProgress without ref when not provided', () => {
      render(<ReadingProgressBar />)

      expect(mockUseReadingProgress).toHaveBeenCalledWith(undefined)
    })
  })
})
