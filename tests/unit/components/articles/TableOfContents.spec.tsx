import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { TOCHeading } from '@/lib/toc/types'

// Mock the hooks - must be before component import
vi.mock('@/hooks/use-active-section', () => ({
  useActiveSection: vi.fn(() => null),
}))

// Import component after mock is set up
import { TableOfContents } from '@/components/articles/TableOfContents'
import { useActiveSection } from '@/hooks/use-active-section'

const mockUseActiveSection = vi.mocked(useActiveSection)

describe('TableOfContents', () => {
  const mockHeadings: TOCHeading[] = [
    { id: 'intro', text: 'Introduction', level: 2 },
    { id: 'features', text: 'Features', level: 2 },
    { id: 'sub-feature', text: 'Sub Feature', level: 3 },
    { id: 'conclusion', text: 'Conclusion', level: 2 },
  ]

  beforeEach(() => {
    mockUseActiveSection.mockReturnValue(null)

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()

    // Mock matchMedia
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

    // Create target elements
    mockHeadings.forEach((heading) => {
      const el = document.createElement('div')
      el.id = heading.id
      document.body.appendChild(el)
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    it('renders navigation with aria-label', () => {
      render(<TableOfContents headings={mockHeadings} />)

      const nav = screen.getByRole('navigation', { name: 'Table of Contents' })
      expect(nav).toBeDefined()
    })

    it('renders with custom title', () => {
      render(<TableOfContents headings={mockHeadings} title="Contents" />)

      const nav = screen.getByRole('navigation', { name: 'Contents' })
      expect(nav).toBeDefined()
      expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Contents')
    })

    it('renders all headings as links', () => {
      render(<TableOfContents headings={mockHeadings} />)

      expect(screen.getByText('Introduction')).toBeDefined()
      expect(screen.getByText('Features')).toBeDefined()
      expect(screen.getByText('Sub Feature')).toBeDefined()
      expect(screen.getByText('Conclusion')).toBeDefined()
    })

    it('renders list with role="list"', () => {
      render(<TableOfContents headings={mockHeadings} />)

      expect(screen.getByRole('list')).toBeDefined()
    })

    it('returns null when headings is empty', () => {
      const { container } = render(<TableOfContents headings={[]} />)

      expect(container.firstChild).toBeNull()
    })

    it('applies custom className', () => {
      render(<TableOfContents headings={mockHeadings} className="custom-class" />)

      expect(screen.getByRole('navigation').classList.contains('custom-class')).toBe(true)
    })
  })

  describe('sticky positioning', () => {
    it('has sticky class', () => {
      render(<TableOfContents headings={mockHeadings} />)

      expect(screen.getByRole('navigation').classList.contains('sticky')).toBe(true)
    })

    it('applies default top offset', () => {
      render(<TableOfContents headings={mockHeadings} />)

      expect(screen.getByRole('navigation').style.top).toBe('80px')
    })

    it('applies custom top offset', () => {
      render(<TableOfContents headings={mockHeadings} topOffset={120} />)

      expect(screen.getByRole('navigation').style.top).toBe('120px')
    })
  })

  describe('active section integration', () => {
    it('passes sectionIds to useActiveSection', () => {
      render(<TableOfContents headings={mockHeadings} topOffset={100} />)

      expect(mockUseActiveSection).toHaveBeenCalledWith({
        sectionIds: ['intro', 'features', 'sub-feature', 'conclusion'],
        topOffset: 100,
      })
    })

    it('highlights active section', () => {
      mockUseActiveSection.mockReturnValue('features')

      render(<TableOfContents headings={mockHeadings} />)

      const featuresLink = screen.getByText('Features')
      expect(featuresLink.getAttribute('aria-current')).toBe('location')
    })

    it('does not highlight inactive sections', () => {
      mockUseActiveSection.mockReturnValue('features')

      render(<TableOfContents headings={mockHeadings} />)

      const introLink = screen.getByText('Introduction')
      expect(introLink.getAttribute('aria-current')).toBeNull()
    })
  })

  describe('navigation callback', () => {
    it('passes onNavigate to TOCLinks and calls it on click', () => {
      const onNavigate = vi.fn()
      render(<TableOfContents headings={mockHeadings} onNavigate={onNavigate} />)

      // Click on the first link
      const firstLink = screen.getByText('Introduction')
      fireEvent.click(firstLink)

      // Verify onNavigate was called
      expect(onNavigate).toHaveBeenCalledTimes(1)
    })
  })

  describe('width constraints', () => {
    it('has max-width class', () => {
      render(<TableOfContents headings={mockHeadings} />)

      expect(screen.getByRole('navigation').classList.contains('max-w-[200px]')).toBe(true)
    })
  })
})
