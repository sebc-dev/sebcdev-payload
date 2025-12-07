import {
  Newspaper,
  Book,
  BookOpen,
  FileText,
  Code,
  CodeXml,
  Terminal,
  Cpu,
  Database,
  Server,
  Cloud,
  Sparkles,
  Lightbulb,
  Rocket,
  Beaker,
  Wrench,
  Settings,
  Layers,
  Package,
  Puzzle,
  Zap,
  Target,
  Compass,
  Map as MapIcon,
  Pencil,
  PenTool,
  Paintbrush,
  Palette,
  Image,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  GraduationCap,
  Award,
  Star,
  Heart,
  Bookmark,
  Tag,
  Folder,
  Briefcase,
  Megaphone,
  MessageCircle,
  Users,
  User,
  Globe,
  Shield,
  Lock,
  Key,
  Bug,
  GitBranch,
  GitCommit,
  Github,
  Gitlab,
  Inbox,
  Mail,
  Calendar,
  Clock,
  TrendingUp,
  BarChart,
  PieChart,
  Activity,
  AlertCircle,
  Info,
  HelpCircle,
  CheckCircle,
  XCircle,
  PlayCircle,
  Flame,
  Coffee,
  Construction,
  type LucideIcon,
} from 'lucide-react'

/**
 * Curated list of Lucide icons for blog categories.
 * See https://lucide.dev/icons/ for full icon reference.
 *
 * This list focuses on icons commonly used for blog/content categorization.
 * To add more icons, consult the official Lucide documentation.
 */

export const LUCIDE_CATEGORY_ICONS = [
  'newspaper',
  'book',
  'book-open',
  'file-text',
  'code',
  'code-xml',
  'terminal',
  'cpu',
  'database',
  'server',
  'cloud',
  'sparkles',
  'lightbulb',
  'rocket',
  'beaker',
  'wrench',
  'settings',
  'layers',
  'package',
  'puzzle',
  'zap',
  'target',
  'compass',
  'map',
  'pencil',
  'pen-tool',
  'paintbrush',
  'palette',
  'image',
  'monitor',
  'smartphone',
  'tablet',
  'laptop',
  'graduation-cap',
  'award',
  'star',
  'heart',
  'bookmark',
  'tag',
  'folder',
  'briefcase',
  'megaphone',
  'message-circle',
  'users',
  'user',
  'globe',
  'shield',
  'lock',
  'key',
  'bug',
  'git-branch',
  'git-commit',
  'github',
  'gitlab',
  'inbox',
  'mail',
  'calendar',
  'clock',
  'trending-up',
  'bar-chart',
  'pie-chart',
  'activity',
  'alert-circle',
  'info',
  'help-circle',
  'check-circle',
  'x-circle',
  'play-circle',
  'flame',
  'coffee',
  'construction',
] as const

/**
 * TypeScript type representing valid Lucide category icon names.
 * @public - Used for typing icon fields in Payload collections
 */
export type LucideCategoryIcon = (typeof LUCIDE_CATEGORY_ICONS)[number]

/**
 * Validates that a string is a valid Lucide category icon identifier.
 * Allows null/undefined values (returns true) for optional icon fields.
 *
 * @param value The icon identifier to validate
 * @returns true if valid or null/undefined, error message string if invalid
 *
 * @example
 * isValidLucideIcon('newspaper') // true
 * isValidLucideIcon('book-open') // true
 * isValidLucideIcon(null) // true
 * isValidLucideIcon('invalid-icon') // 'Please select a valid icon...'
 */
export function isValidLucideIcon(value: string | null | undefined): true | string {
  if (!value) return true
  return (
    (LUCIDE_CATEGORY_ICONS as readonly string[]).includes(value) ||
    'Please select a valid icon from the available options'
  )
}

/**
 * Returns the icon list formatted for Payload CMS select field options.
 */
export function getLucideIconOptions() {
  return LUCIDE_CATEGORY_ICONS.map((icon) => ({
    label: icon
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    value: icon,
  }))
}

/**
 * Explicit mapping from kebab-case icon names to Lucide components.
 * This provides type-safe icon lookup without dynamic import assertions.
 *
 * @remarks
 * When adding new icons to LUCIDE_CATEGORY_ICONS, also add them here.
 */
export const LUCIDE_ICON_COMPONENTS: Record<LucideCategoryIcon, LucideIcon> = {
  newspaper: Newspaper,
  book: Book,
  'book-open': BookOpen,
  'file-text': FileText,
  code: Code,
  'code-xml': CodeXml,
  terminal: Terminal,
  cpu: Cpu,
  database: Database,
  server: Server,
  cloud: Cloud,
  sparkles: Sparkles,
  lightbulb: Lightbulb,
  rocket: Rocket,
  beaker: Beaker,
  wrench: Wrench,
  settings: Settings,
  layers: Layers,
  package: Package,
  puzzle: Puzzle,
  zap: Zap,
  target: Target,
  compass: Compass,
  map: MapIcon,
  pencil: Pencil,
  'pen-tool': PenTool,
  paintbrush: Paintbrush,
  palette: Palette,
  image: Image,
  monitor: Monitor,
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  'graduation-cap': GraduationCap,
  award: Award,
  star: Star,
  heart: Heart,
  bookmark: Bookmark,
  tag: Tag,
  folder: Folder,
  briefcase: Briefcase,
  megaphone: Megaphone,
  'message-circle': MessageCircle,
  users: Users,
  user: User,
  globe: Globe,
  shield: Shield,
  lock: Lock,
  key: Key,
  bug: Bug,
  'git-branch': GitBranch,
  'git-commit': GitCommit,
  github: Github,
  gitlab: Gitlab,
  inbox: Inbox,
  mail: Mail,
  calendar: Calendar,
  clock: Clock,
  'trending-up': TrendingUp,
  'bar-chart': BarChart,
  'pie-chart': PieChart,
  activity: Activity,
  'alert-circle': AlertCircle,
  info: Info,
  'help-circle': HelpCircle,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'play-circle': PlayCircle,
  flame: Flame,
  coffee: Coffee,
  construction: Construction,
}

/**
 * Gets the Lucide icon component for a given icon name.
 * Uses explicit whitelist mapping for type safety.
 *
 * @param iconName - The kebab-case icon name (e.g., "book-open")
 * @returns The Lucide icon component or null if not found
 */
export function getLucideIcon(iconName: string): LucideIcon | null {
  return LUCIDE_ICON_COMPONENTS[iconName as LucideCategoryIcon] ?? null
}
