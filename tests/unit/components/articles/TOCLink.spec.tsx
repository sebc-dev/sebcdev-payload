import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TOCLink } from '@/components/articles/TOCLink'

describe('TOCLink', () => {
  const defaultProps = {
    id: 'test-section',
    text: 'Test Section',
    level: 2 as const,
    isActive: false,
  }

  // Store original global values
  let originalScrollIntoView: typeof Element.prototype.scrollIntoView
  let originalMatchMedia: typeof window.matchMedia

  beforeAll(() => {
    // Capture originals before any test runs
    originalScrollIntoView = Element.prototype.scrollIntoView
    originalMatchMedia = window.matchMedia
  })

  afterAll(() => {
    // Restore originals after all tests complete
    Element.prototype.scrollIntoView = originalScrollIntoView
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    })
  })

  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()

    // Mock matchMedia for reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    // Mock history.pushState
    vi.spyOn(window.history, 'pushState').mockImplementation(() => {})

    // Create target element
    const targetElement = document.createElement('div')
    targetElement.id = 'test-section'
    document.body.appendChild(targetElement)
  })

  afterEach(() => {
    // Restore Vitest spies
    vi.restoreAllMocks()
    // Clean up DOM
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    it('renders link with correct text', () => {
      render(<TOCLink {...defaultProps} />)

      expect(screen.getByRole('link').textContent).toBe('Test Section')
    })

    it('renders link with correct href', () => {
      render(<TOCLink {...defaultProps} />)

      expect(screen.getByRole('link').getAttribute('href')).toBe('#test-section')
    })

    it('applies custom className', () => {
      render(<TOCLink {...defaultProps} className="custom-class" />)

      expect(screen.getByRole('link').classList.contains('custom-class')).toBe(true)
    })
  })

  describe('active state', () => {
    it('does not have aria-current when inactive', () => {
      render(<TOCLink {...defaultProps} isActive={false} />)

      expect(screen.getByRole('link').getAttribute('aria-current')).toBeNull()
    })

    it('has aria-current="location" when active', () => {
      render(<TOCLink {...defaultProps} isActive={true} />)

      expect(screen.getByRole('link').getAttribute('aria-current')).toBe('location')
    })

    it('applies active styling classes when active', () => {
      render(<TOCLink {...defaultProps} isActive={true} />)

      const link = screen.getByRole('link')
      expect(link.classList.contains('text-primary')).toBe(true)
      expect(link.classList.contains('font-medium')).toBe(true)
      expect(link.classList.contains('border-l-2')).toBe(true)
    })

    it('applies inactive styling classes when not active', () => {
      render(<TOCLink {...defaultProps} isActive={false} />)

      const link = screen.getByRole('link')
      expect(link.classList.contains('text-muted-foreground')).toBe(true)
    })
  })

  describe('indentation', () => {
    it('has no left padding for level 2', () => {
      render(<TOCLink {...defaultProps} level={2} />)

      expect(screen.getByRole('link').classList.contains('pl-0')).toBe(true)
    })

    it('has left padding for level 3', () => {
      render(<TOCLink {...defaultProps} level={3} />)

      expect(screen.getByRole('link').classList.contains('pl-4')).toBe(true)
    })
  })

  describe('navigation', () => {
    it('scrolls to element on click', () => {
      render(<TOCLink {...defaultProps} />)

      fireEvent.click(screen.getByRole('link'))

      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      })
    })

    it('uses instant scroll when prefers-reduced-motion', () => {
      // Override shared mock to return matches: true for reduced motion query
      ;(window.matchMedia as ReturnType<typeof vi.fn>).mockImplementationOnce((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      render(<TOCLink {...defaultProps} />)

      fireEvent.click(screen.getByRole('link'))

      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'instant',
        block: 'start',
      })
    })

    it('updates URL hash on click', () => {
      render(<TOCLink {...defaultProps} />)

      fireEvent.click(screen.getByRole('link'))

      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '#test-section')
    })

    it('calls onNavigate callback on click', () => {
      const onNavigate = vi.fn()
      render(<TOCLink {...defaultProps} onNavigate={onNavigate} />)

      fireEvent.click(screen.getByRole('link'))

      expect(onNavigate).toHaveBeenCalled()
    })

    it('does not scroll when target element not found', () => {
      const onNavigate = vi.fn()

      // Remove the target element
      document.body.innerHTML = ''

      render(<TOCLink {...defaultProps} onNavigate={onNavigate} />)

      fireEvent.click(screen.getByRole('link'))

      expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()
      expect(window.history.pushState).not.toHaveBeenCalled()
      expect(onNavigate).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('has focus-visible styles', () => {
      render(<TOCLink {...defaultProps} />)

      const link = screen.getByRole('link')
      expect(link.classList.contains('focus-visible:ring-2')).toBe(true)
    })

    it('has motion-reduce transition class', () => {
      render(<TOCLink {...defaultProps} />)

      expect(screen.getByRole('link').classList.contains('motion-reduce:transition-none')).toBe(
        true,
      )
    })
  })
})
