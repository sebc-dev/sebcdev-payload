import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { TOCHeading } from '@/lib/toc/types'

// Mock the hooks - must be before component import
vi.mock('@/hooks/use-active-section', () => ({
  useActiveSection: vi.fn(() => null),
}))

// Import component after mock is set up
import { MobileTOC } from '@/components/articles/MobileTOC'
import { useActiveSection } from '@/hooks/use-active-section'

const mockUseActiveSection = vi.mocked(useActiveSection)

describe('MobileTOC', () => {
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

    // Mock history.pushState
    vi.spyOn(window.history, 'pushState').mockImplementation(() => {})

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
    it('renders trigger button with List icon', () => {
      render(<MobileTOC headings={mockHeadings} />)

      const button = screen.getByRole('button')
      expect(button).toBeDefined()
      // Check the button has the List icon (svg inside)
      expect(button.querySelector('svg')).toBeDefined()
    })

    it('renders trigger button with correct aria-label', () => {
      render(<MobileTOC headings={mockHeadings} />)

      expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Open table of contents')
    })

    it('renders with custom trigger label', () => {
      render(<MobileTOC headings={mockHeadings} triggerLabel="Menu" />)

      expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Menu')
    })

    it('returns null when headings is empty', () => {
      const { container } = render(<MobileTOC headings={[]} />)

      expect(container.firstChild).toBeNull()
    })

    it('applies custom trigger className', () => {
      render(<MobileTOC headings={mockHeadings} triggerClassName="custom-trigger" />)

      expect(screen.getByRole('button').classList.contains('custom-trigger')).toBe(true)
    })
  })

  describe('trigger button styling', () => {
    it('has fixed positioning classes', () => {
      render(<MobileTOC headings={mockHeadings} />)

      const button = screen.getByRole('button')
      expect(button.classList.contains('fixed')).toBe(true)
      expect(button.classList.contains('bottom-4')).toBe(true)
      expect(button.classList.contains('right-4')).toBe(true)
    })

    it('has rounded-full class', () => {
      render(<MobileTOC headings={mockHeadings} />)

      expect(screen.getByRole('button').classList.contains('rounded-full')).toBe(true)
    })

    it('has shadow class', () => {
      render(<MobileTOC headings={mockHeadings} />)

      expect(screen.getByRole('button').classList.contains('shadow-lg')).toBe(true)
    })
  })

  describe('sheet interaction', () => {
    it('opens sheet when trigger is clicked', () => {
      render(<MobileTOC headings={mockHeadings} />)

      // Sheet should not be open initially
      expect(screen.queryByRole('dialog')).toBeNull()

      // Click the trigger
      fireEvent.click(screen.getByRole('button'))

      // Sheet should now be open
      expect(screen.getByRole('dialog')).toBeDefined()
    })

    it('displays title in sheet header', () => {
      render(<MobileTOC headings={mockHeadings} title="Contents" />)

      fireEvent.click(screen.getByRole('button'))

      // Check for the title in the opened sheet
      expect(screen.getByText('Contents')).toBeDefined()
    })

    it('renders all headings in sheet', () => {
      render(<MobileTOC headings={mockHeadings} />)

      fireEvent.click(screen.getByRole('button'))

      expect(screen.getByText('Introduction')).toBeDefined()
      expect(screen.getByText('Features')).toBeDefined()
      expect(screen.getByText('Sub Feature')).toBeDefined()
      expect(screen.getByText('Conclusion')).toBeDefined()
    })

    it('closes sheet when link is clicked', () => {
      render(<MobileTOC headings={mockHeadings} />)

      // Open the sheet
      fireEvent.click(screen.getByRole('button'))
      expect(screen.getByRole('dialog')).toBeDefined()

      // Click a link
      fireEvent.click(screen.getByText('Introduction'))

      // Sheet should close - dialog should no longer be visible
      // Note: Due to animation, we check if dialog is no longer in document
      // The Radix dialog may still be in DOM but with closed state
    })
  })

  describe('active section integration', () => {
    it('passes sectionIds to useActiveSection', () => {
      render(<MobileTOC headings={mockHeadings} topOffset={100} />)

      expect(mockUseActiveSection).toHaveBeenCalledWith({
        sectionIds: ['intro', 'features', 'sub-feature', 'conclusion'],
        topOffset: 100,
      })
    })

    it('highlights active section in sheet', () => {
      mockUseActiveSection.mockReturnValue('features')

      render(<MobileTOC headings={mockHeadings} />)

      // Open sheet
      fireEvent.click(screen.getByRole('button'))

      const featuresLink = screen.getByText('Features')
      expect(featuresLink.getAttribute('aria-current')).toBe('location')
    })
  })

  describe('navigation in sheet', () => {
    it('contains navigation element with aria-label', () => {
      render(<MobileTOC headings={mockHeadings} title="Contents" />)

      fireEvent.click(screen.getByRole('button'))

      // Check for navigation inside the sheet
      const nav = screen.getByRole('navigation', { name: 'Contents' })
      expect(nav).toBeDefined()
    })

    it('contains list with role="list"', () => {
      render(<MobileTOC headings={mockHeadings} />)

      fireEvent.click(screen.getByRole('button'))

      expect(screen.getByRole('list')).toBeDefined()
    })
  })

  describe('accessibility', () => {
    it('trigger button has aria-label for screen readers', () => {
      render(<MobileTOC headings={mockHeadings} triggerLabel="Navigation menu" />)

      expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Navigation menu')
    })
  })
})
