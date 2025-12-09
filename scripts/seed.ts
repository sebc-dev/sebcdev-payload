/**
 * Seed script for sebc.dev homepage demonstration.
 *
 * Creates:
 * - 5 Categories (with colors and icons)
 * - 10 Tags
 * - 7 Articles (with Lexical rich text content and images)
 *
 * Run with: pnpm seed
 */

import 'dotenv/config'

import type { BasePayload, File } from 'payload'

import { getPayload } from 'payload'

import config from '../src/payload.config'

// ============================================================================
// IMAGE HELPERS
// ============================================================================

/**
 * Downloads an image from a URL and returns it as a Payload File object.
 * Uses Uint8Array instead of Buffer for Miniflare compatibility.
 */
async function downloadImage(
  url: string,
  filename: string,
): Promise<{ data: Uint8Array; mimetype: string; name: string; size: number } | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SeedScript/1.0)',
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      console.error(`  ⚠️  Failed to download image: ${url} (${response.status})`)
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    const data = new Uint8Array(arrayBuffer)
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    return {
      data,
      mimetype: contentType,
      name: filename,
      size: data.length,
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`  ⚠️  Timeout downloading image: ${url} (10s exceeded)`)
      return null
    }
    console.error(`  ⚠️  Error downloading image: ${url}`, error)
    return null
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Uploads an image to Payload and returns the media document ID.
 */
async function uploadImage(
  payload: BasePayload,
  imageUrl: string,
  filename: string,
  alt: string,
): Promise<number | null> {
  const imageData = await downloadImage(imageUrl, filename)

  if (!imageData) {
    return null
  }

  try {
    const media = await payload.create({
      collection: 'media',
      data: {
        alt,
      },
      // Uint8Array is used instead of Buffer for Miniflare/Workers compatibility.
      // Payload's File type expects Buffer, but Workers runtime accepts Uint8Array.
      // See downloadImage() JSDoc for rationale.
      file: imageData as unknown as File,
    })

    return media.id
  } catch (error) {
    console.error(`  ⚠️  Error uploading image: ${filename}`, error)
    return null
  }
}

// ============================================================================
// SEED DATA DEFINITIONS
// ============================================================================

const CATEGORIES = [
  {
    name: { fr: 'Actualités', en: 'News' },
    slug: 'news',
    color: '#0ea5e9',
    icon: 'newspaper',
    description: {
      fr: 'Dernières actualités et mises à jour du monde tech',
      en: 'Latest news and updates from the tech world',
    },
  },
  {
    name: { fr: 'Tutoriels', en: 'Tutorials' },
    slug: 'tutorial',
    color: '#06b6d4',
    icon: 'book-open',
    description: {
      fr: 'Guides pratiques et tutoriels détaillés',
      en: 'Practical guides and detailed tutorials',
    },
  },
  {
    name: { fr: 'Décryptage', en: 'Deep Dive' },
    slug: 'deep-dive',
    color: '#6366f1',
    icon: 'lightbulb',
    description: {
      fr: 'Analyses approfondies et décryptage technique',
      en: 'In-depth technical analysis and insights',
    },
  },
  {
    name: { fr: 'Étude de Cas', en: 'Case Study' },
    slug: 'case-study',
    color: '#ec4899',
    icon: 'target',
    description: {
      fr: "Études de cas et retours d'expérience concrets",
      en: 'Real-world case studies and experience reports',
    },
  },
  {
    name: { fr: "Retour d'Expérience", en: 'Feedback' },
    slug: 'feedback',
    color: '#f59e0b',
    icon: 'message-circle',
    description: {
      fr: "Partage d'expérience et retours personnels",
      en: 'Personal experience sharing and feedback',
    },
  },
] as const

const TAGS = [
  { name: { fr: 'React', en: 'React' }, slug: 'react' },
  { name: { fr: 'TypeScript', en: 'TypeScript' }, slug: 'typescript' },
  { name: { fr: 'Next.js', en: 'Next.js' }, slug: 'nextjs' },
  { name: { fr: 'Cloudflare', en: 'Cloudflare' }, slug: 'cloudflare' },
  { name: { fr: 'Payload CMS', en: 'Payload CMS' }, slug: 'payload-cms' },
  { name: { fr: 'Performance', en: 'Performance' }, slug: 'performance' },
  { name: { fr: 'Accessibilité', en: 'Accessibility' }, slug: 'accessibility' },
  { name: { fr: 'UX Design', en: 'UX Design' }, slug: 'ux-design' },
  { name: { fr: 'IA / LLM', en: 'AI / LLM' }, slug: 'ai-llm' },
  { name: { fr: 'CSS', en: 'CSS' }, slug: 'css' },
] as const

// ============================================================================
// LEXICAL CONTENT HELPERS
// ============================================================================

/**
 * Text format bitmask values (from Lexical)
 * Can be combined with bitwise OR: BOLD | ITALIC = 3
 */
const TEXT_FORMAT = {
  BOLD: 1,
  ITALIC: 2,
  STRIKETHROUGH: 4,
  UNDERLINE: 8,
  CODE: 16,
  SUBSCRIPT: 32,
  SUPERSCRIPT: 64,
} as const

/**
 * Creates a Lexical text node with optional formatting.
 */
function text(content: string, format: number = 0) {
  return {
    type: 'text',
    format,
    mode: 'normal',
    style: '',
    detail: 0,
    text: content,
    version: 1,
  }
}

/**
 * Creates a bold text node.
 */
function bold(content: string) {
  return text(content, TEXT_FORMAT.BOLD)
}

/**
 * Creates an italic text node.
 */
function italic(content: string) {
  return text(content, TEXT_FORMAT.ITALIC)
}

/**
 * Creates an underlined text node.
 */
function underline(content: string) {
  return text(content, TEXT_FORMAT.UNDERLINE)
}

/**
 * Creates a strikethrough text node.
 */
function strikethrough(content: string) {
  return text(content, TEXT_FORMAT.STRIKETHROUGH)
}

/**
 * Creates an inline code text node.
 */
function inlineCode(content: string) {
  return text(content, TEXT_FORMAT.CODE)
}

/**
 * Creates a text node with combined formats.
 * Example: boldItalic("text") = bold + italic
 */
function boldItalic(content: string) {
  return text(content, TEXT_FORMAT.BOLD | TEXT_FORMAT.ITALIC)
}

/**
 * Creates a subscript text node.
 */
function subscript(content: string) {
  return text(content, TEXT_FORMAT.SUBSCRIPT)
}

/**
 * Creates a superscript text node.
 */
function superscript(content: string) {
  return text(content, TEXT_FORMAT.SUPERSCRIPT)
}

/**
 * Creates a Lexical root structure with the given children.
 */
function createLexicalRoot(children: unknown[]) {
  return {
    root: {
      type: 'root' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      children,
      direction: 'ltr' as const,
    },
  }
}

/**
 * Creates a Lexical paragraph node with mixed content (text nodes with different formats).
 */
function paragraphWithChildren(children: unknown[]) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children,
  }
}

/**
 * Creates a Lexical paragraph node with plain text.
 */
function paragraph(content: string) {
  return paragraphWithChildren([text(content)])
}

/**
 * Creates a Lexical heading node (h1-h6).
 */
function heading(content: string, tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h2') {
  return {
    type: 'heading',
    format: '',
    indent: 0,
    version: 1,
    tag,
    direction: 'ltr',
    children: [text(content)],
  }
}

/**
 * Creates a Lexical heading node with mixed content.
 */
function headingWithChildren(
  children: unknown[],
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h2',
) {
  return {
    type: 'heading',
    format: '',
    indent: 0,
    version: 1,
    tag,
    direction: 'ltr',
    children,
  }
}

/**
 * Creates a Lexical code block node.
 */
function codeBlock(code: string, language = 'typescript') {
  return {
    type: 'block',
    format: '',
    indent: 0,
    version: 2,
    fields: {
      language,
      code,
    },
    blockType: 'code',
  }
}

/**
 * Creates a Lexical blockquote node.
 */
function blockquote(content: string) {
  return {
    type: 'quote',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [text(content)],
  }
}

/**
 * Creates a Lexical blockquote node with mixed content.
 */
function blockquoteWithChildren(children: unknown[]) {
  return {
    type: 'quote',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children,
  }
}

/**
 * Creates a Lexical link node.
 * @param url - The URL (can be internal path, external URL, mailto:, or tel:)
 * @param children - The link text content (array of text nodes)
 * @param newTab - Force open in new tab (auto-detected for external URLs)
 */
function link(url: string, children: unknown[], newTab?: boolean) {
  return {
    type: 'link',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    fields: {
      url,
      newTab: newTab ?? undefined,
      linkType: 'custom' as const,
    },
    children,
  }
}

/**
 * Creates a simple text link.
 */
function textLink(url: string, linkText: string, newTab?: boolean) {
  return link(url, [text(linkText)], newTab)
}

/**
 * Creates a Lexical list item node.
 */
function listItem(children: unknown[], indent = 0) {
  return {
    type: 'listitem',
    format: '',
    indent,
    version: 1,
    value: 1,
    direction: 'ltr',
    children,
  }
}

/**
 * Creates a simple list item with text.
 */
function simpleListItem(content: string, indent = 0) {
  return listItem([text(content)], indent)
}

/**
 * Creates a Lexical unordered list node.
 */
function bulletList(items: string[]) {
  return {
    type: 'list',
    format: '',
    indent: 0,
    version: 1,
    listType: 'bullet',
    start: 1,
    tag: 'ul',
    direction: 'ltr',
    children: items.map((item) => simpleListItem(item)),
  }
}

/**
 * Creates a Lexical unordered list node with complex list items.
 */
function bulletListWithItems(items: ReturnType<typeof listItem>[]) {
  return {
    type: 'list',
    format: '',
    indent: 0,
    version: 1,
    listType: 'bullet',
    start: 1,
    tag: 'ul',
    direction: 'ltr',
    children: items,
  }
}

/**
 * Creates a Lexical ordered list node.
 */
function orderedList(items: string[]) {
  return {
    type: 'list',
    format: '',
    indent: 0,
    version: 1,
    listType: 'number',
    start: 1,
    tag: 'ol',
    direction: 'ltr',
    children: items.map((item) => simpleListItem(item)),
  }
}

/**
 * Creates a Lexical ordered list node with complex list items.
 */
function orderedListWithItems(items: ReturnType<typeof listItem>[]) {
  return {
    type: 'list',
    format: '',
    indent: 0,
    version: 1,
    listType: 'number',
    start: 1,
    tag: 'ol',
    direction: 'ltr',
    children: items,
  }
}

/**
 * Creates a list item with text content AND a nested sub-list.
 * This is the proper Lexical structure for nested lists:
 * The sub-list is a direct child of the listitem node.
 *
 * @param content - Text content for the list item
 * @param nestedList - A nested list (bullet or ordered) to include
 */
function listItemWithNestedList(
  content: string,
  nestedList: ReturnType<typeof bulletList | typeof orderedList>,
) {
  return {
    type: 'listitem',
    format: '',
    indent: 0,
    version: 1,
    value: 1,
    direction: 'ltr',
    children: [text(content), nestedList],
  }
}

/**
 * Creates a nested bullet list structure.
 * Example: nestedBulletList([
 *   { text: 'Item 1', children: ['Sub 1.1', 'Sub 1.2'] },
 *   { text: 'Item 2' },
 * ])
 */
function nestedBulletList(items: Array<{ text: string; children?: string[] }>) {
  return {
    type: 'list',
    format: '',
    indent: 0,
    version: 1,
    listType: 'bullet',
    start: 1,
    tag: 'ul',
    direction: 'ltr',
    children: items.map((item) =>
      item.children
        ? listItemWithNestedList(item.text, bulletList(item.children))
        : simpleListItem(item.text),
    ),
  }
}

// ============================================================================
// ARTICLE CONTENT
// ============================================================================

// Image configuration for each article (using picsum.photos for placeholder images)
// Each article gets a unique seed for consistent images
const ARTICLE_IMAGES = [
  {
    slug: 'nextjs-cloudflare-workers',
    seed: 101,
    alt: {
      fr: 'Déploiement Next.js sur Cloudflare Workers',
      en: 'Next.js deployment on Cloudflare Workers',
    },
  },
  {
    slug: 'optimiser-ux-react19',
    seed: 102,
    alt: { fr: 'Optimisation UX avec React 19', en: 'UX optimization with React 19' },
  },
  {
    slug: 'llms-avenir-web',
    seed: 103,
    alt: {
      fr: 'Intelligence artificielle et développement web',
      en: 'Artificial intelligence and web development',
    },
  },
  {
    slug: 'case-study-payload-migration',
    seed: 104,
    alt: { fr: 'Migration vers Payload CMS', en: 'Migration to Payload CMS' },
  },
  {
    slug: 'accessibility-wcag-nextjs',
    seed: 105,
    alt: { fr: 'Accessibilité web WCAG', en: 'WCAG web accessibility' },
  },
  {
    slug: 'css-modern-container-queries',
    seed: 106,
    alt: { fr: 'CSS moderne avec Container Queries', en: 'Modern CSS with Container Queries' },
  },
  {
    slug: 'parcours-wordpress-edge',
    seed: 107,
    alt: { fr: 'Évolution du développement web', en: 'Web development evolution' },
  },
  {
    slug: 'guide-formatage-richtext',
    seed: 108,
    alt: { fr: 'Guide de formatage rich text', en: 'Rich text formatting guide' },
  },
] as const

const ARTICLES = [
  {
    title: {
      fr: 'Déployer une Application Next.js sur Cloudflare Workers',
      en: 'Deploy a Next.js Application on Cloudflare Workers',
    },
    slug: 'nextjs-cloudflare-workers',
    excerpt: {
      fr: 'Découvrez comment déployer une application Next.js complète sur Cloudflare Workers avec D1 et R2, en utilisant OpenNext et Wrangler pour une infrastructure serverless ultra-performante.',
      en: 'Learn how to deploy a complete Next.js application on Cloudflare Workers using D1 and R2, with OpenNext and Wrangler for ultra-performant serverless infrastructure.',
    },
    content: {
      fr: createLexicalRoot([
        paragraph(
          'Cloudflare Workers offre une plateforme edge computing puissante pour déployer des applications Next.js. Dans ce guide, nous allons explorer comment configurer et déployer une application complète avec base de données D1 et stockage R2.',
        ),
        heading('Prérequis'),
        bulletList([
          'Node.js 20+ installé',
          'Un compte Cloudflare (gratuit)',
          'pnpm comme gestionnaire de paquets',
          'Connaissances de base en Next.js',
        ]),
        heading('Configuration de Wrangler'),
        paragraph(
          "La première étape consiste à configurer Wrangler, l'outil CLI de Cloudflare pour gérer vos Workers.",
        ),
        codeBlock(
          `// wrangler.jsonc
{
  "name": "my-nextjs-app",
  "compatibility_date": "2024-01-01",
  "main": ".open-next/worker.js",
  "d1_databases": [
    {
      "binding": "D1",
      "database_name": "my-database"
    }
  ],
  "r2_buckets": [
    {
      "binding": "R2",
      "bucket_name": "my-bucket"
    }
  ]
}`,
          'json',
        ),
        heading('Installation des dépendances'),
        paragraph(
          'Installez les packages nécessaires pour le déploiement sur Cloudflare Workers :',
        ),
        codeBlock(
          `pnpm add @opennextjs/cloudflare @payloadcms/db-d1-sqlite @payloadcms/storage-r2`,
        ),
        heading('Configuration de la base de données D1'),
        paragraph(
          "D1 est la base de données SQLite edge-native de Cloudflare. Elle s'intègre parfaitement avec Payload CMS via l'adaptateur dédié.",
        ),
        codeBlock(
          `import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'

export default buildConfig({
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  // ... rest of config
})`,
        ),
        heading('Déploiement'),
        paragraph(
          "Une fois configuré, le déploiement se fait en une seule commande. OpenNext compile votre application Next.js pour l'environnement Workers.",
        ),
        codeBlock(`pnpm build && pnpm deploy`, 'bash'),
        paragraph(
          'Votre application est maintenant déployée sur le réseau edge de Cloudflare, offrant des temps de réponse ultra-rapides partout dans le monde.',
        ),
      ]),
      en: createLexicalRoot([
        paragraph(
          'Cloudflare Workers provides a powerful edge computing platform for deploying Next.js applications. In this guide, we will explore how to configure and deploy a complete application with D1 database and R2 storage.',
        ),
        heading('Prerequisites'),
        bulletList([
          'Node.js 20+ installed',
          'A Cloudflare account (free)',
          'pnpm as package manager',
          'Basic knowledge of Next.js',
        ]),
        heading('Wrangler Configuration'),
        paragraph(
          "The first step is to configure Wrangler, Cloudflare's CLI tool for managing your Workers.",
        ),
        codeBlock(
          `// wrangler.jsonc
{
  "name": "my-nextjs-app",
  "compatibility_date": "2024-01-01",
  "main": ".open-next/worker.js",
  "d1_databases": [
    {
      "binding": "D1",
      "database_name": "my-database"
    }
  ],
  "r2_buckets": [
    {
      "binding": "R2",
      "bucket_name": "my-bucket"
    }
  ]
}`,
          'json',
        ),
        heading('Installing Dependencies'),
        paragraph('Install the necessary packages for Cloudflare Workers deployment:'),
        codeBlock(
          `pnpm add @opennextjs/cloudflare @payloadcms/db-d1-sqlite @payloadcms/storage-r2`,
        ),
        heading('D1 Database Configuration'),
        paragraph(
          "D1 is Cloudflare's edge-native SQLite database. It integrates seamlessly with Payload CMS via the dedicated adapter.",
        ),
        codeBlock(
          `import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'

export default buildConfig({
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  // ... rest of config
})`,
        ),
        heading('Deployment'),
        paragraph(
          'Once configured, deployment is done with a single command. OpenNext compiles your Next.js application for the Workers environment.',
        ),
        codeBlock(`pnpm build && pnpm deploy`, 'bash'),
        paragraph(
          "Your application is now deployed on Cloudflare's edge network, offering ultra-fast response times worldwide.",
        ),
      ]),
    },
    category: 'tutorial',
    tags: ['nextjs', 'cloudflare', 'typescript', 'performance'],
    complexity: 'advanced' as const,
    publishedAt: new Date('2025-12-05T10:00:00Z'),
  },
  {
    title: {
      fr: "Optimiser l'UX d'une Application React 19",
      en: 'Optimizing UX in React 19 Applications',
    },
    slug: 'optimiser-ux-react19',
    excerpt: {
      fr: "Les nouvelles fonctionnalités de React 19 permettent d'améliorer significativement l'expérience utilisateur. Découvrez les patterns clés pour des interfaces réactives.",
      en: 'New React 19 features allow significant improvements in user experience. Discover key patterns for responsive interfaces.',
    },
    content: {
      fr: createLexicalRoot([
        paragraph(
          "React 19 introduit des fonctionnalités révolutionnaires pour l'expérience utilisateur. Dans cet article, nous explorons les patterns essentiels pour créer des interfaces fluides et réactives.",
        ),
        heading('Les Server Components'),
        paragraph(
          "Les Server Components permettent de réduire drastiquement la taille du bundle JavaScript envoyé au client. Ils s'exécutent côté serveur et ne transmettent que le HTML résultant.",
        ),
        heading('Les Actions'),
        paragraph(
          'Les Actions simplifient la gestion des mutations de données. Plus besoin de gérer manuellement les états de chargement et les erreurs.',
        ),
        codeBlock(
          `'use server'

async function submitForm(formData: FormData) {
  const email = formData.get('email')
  await saveToDatabase(email)
  return { success: true }
}`,
        ),
        heading('Optimistic Updates'),
        paragraph(
          "Le hook useOptimistic permet d'afficher immédiatement le résultat attendu d'une action, avant même que le serveur ne réponde.",
        ),
        paragraph(
          'Ces patterns combinés permettent de créer des applications qui semblent instantanées, même avec des opérations réseau complexes.',
        ),
      ]),
      en: createLexicalRoot([
        paragraph(
          'React 19 introduces revolutionary features for user experience. In this article, we explore essential patterns for creating fluid and responsive interfaces.',
        ),
        heading('Server Components'),
        paragraph(
          'Server Components drastically reduce the JavaScript bundle size sent to the client. They execute on the server and only transmit the resulting HTML.',
        ),
        heading('Actions'),
        paragraph(
          'Actions simplify data mutation management. No more manual handling of loading states and errors.',
        ),
        codeBlock(
          `'use server'

async function submitForm(formData: FormData) {
  const email = formData.get('email')
  await saveToDatabase(email)
  return { success: true }
}`,
        ),
        heading('Optimistic Updates'),
        paragraph(
          'The useOptimistic hook allows displaying the expected result of an action immediately, even before the server responds.',
        ),
        paragraph(
          'These combined patterns enable creating applications that feel instant, even with complex network operations.',
        ),
      ]),
    },
    category: 'tutorial',
    tags: ['react', 'ux-design', 'performance'],
    complexity: 'intermediate' as const,
    publishedAt: new Date('2025-12-03T14:00:00Z'),
  },
  {
    title: {
      fr: "Les LLMs et l'Avenir du Développement Web",
      en: 'LLMs and the Future of Web Development',
    },
    slug: 'llms-avenir-web',
    excerpt: {
      fr: "Comment les Large Language Models transforment-ils notre façon de développer ? Analyse des opportunités et des défis de l'IA générative dans le développement web.",
      en: 'How are Large Language Models transforming our way of developing? Analysis of generative AI opportunities and challenges in web development.',
    },
    content: {
      fr: createLexicalRoot([
        paragraph(
          "L'intelligence artificielle générative révolutionne le développement web. Les LLMs comme Claude, GPT-4 et Gemini ne sont plus de simples curiosités mais des outils de productivité essentiels.",
        ),
        heading("L'Assistance au Code"),
        paragraph(
          'Les assistants IA peuvent générer du code, expliquer des concepts complexes, et suggérer des améliorations. Ils accélèrent considérablement le développement initial.',
        ),
        heading('Les Limites Actuelles'),
        bulletList([
          'Hallucinations sur les APIs récentes',
          'Contexte limité pour les grandes codesbases',
          'Nécessité de validation humaine',
          'Coût computationnel élevé',
        ]),
        heading("L'Avenir : Agents Autonomes"),
        paragraph(
          "La prochaine étape est celle des agents capables d'exécuter des tâches complexes de manière autonome : debugging, refactoring, déploiement.",
        ),
        paragraph(
          "Le développeur du futur sera un architecte qui guide et supervise ces agents IA plutôt qu'un codeur manuel.",
        ),
      ]),
      en: createLexicalRoot([
        paragraph(
          'Generative artificial intelligence is revolutionizing web development. LLMs like Claude, GPT-4, and Gemini are no longer mere curiosities but essential productivity tools.',
        ),
        heading('Code Assistance'),
        paragraph(
          'AI assistants can generate code, explain complex concepts, and suggest improvements. They significantly accelerate initial development.',
        ),
        heading('Current Limitations'),
        bulletList([
          'Hallucinations on recent APIs',
          'Limited context for large codebases',
          'Need for human validation',
          'High computational cost',
        ]),
        heading('The Future: Autonomous Agents'),
        paragraph(
          'The next step is agents capable of executing complex tasks autonomously: debugging, refactoring, deployment.',
        ),
        paragraph(
          'The developer of the future will be an architect who guides and supervises these AI agents rather than a manual coder.',
        ),
      ]),
    },
    category: 'deep-dive',
    tags: ['ai-llm', 'typescript', 'nextjs'],
    complexity: 'intermediate' as const,
    publishedAt: new Date('2025-12-01T09:00:00Z'),
  },
  {
    title: {
      fr: 'Étude de Cas: Migration vers Payload CMS',
      en: 'Case Study: Migration to Payload CMS',
    },
    slug: 'case-study-payload-migration',
    excerpt: {
      fr: "Retour d'expérience sur la migration d'un site WordPress vers Payload CMS. Défis, solutions et bénéfices d'une architecture headless moderne.",
      en: 'Experience report on migrating a WordPress site to Payload CMS. Challenges, solutions, and benefits of modern headless architecture.',
    },
    content: {
      fr: createLexicalRoot([
        paragraph(
          "Après 5 ans sur WordPress, nous avons décidé de migrer vers Payload CMS. Voici notre retour d'expérience complet sur ce projet de migration.",
        ),
        heading('Contexte Initial'),
        paragraph(
          'Le site WordPress hébergeait 500+ articles avec des taxonomies complexes. La performance se dégradait et la maintenance devenait difficile.',
        ),
        heading('Pourquoi Payload CMS ?'),
        bulletList([
          'TypeScript natif',
          'API GraphQL et REST automatiques',
          'Contrôle total sur le schéma de données',
          'Intégration Next.js seamless',
        ]),
        heading('Le Processus de Migration'),
        paragraph(
          "La migration s'est faite en 3 phases : export des données, transformation du schéma, import dans Payload.",
        ),
        heading('Résultats'),
        paragraph(
          'Temps de chargement divisé par 3, DX améliorée, et un site enfin maintenable sur le long terme.',
        ),
      ]),
      en: createLexicalRoot([
        paragraph(
          'After 5 years on WordPress, we decided to migrate to Payload CMS. Here is our complete experience report on this migration project.',
        ),
        heading('Initial Context'),
        paragraph(
          'The WordPress site hosted 500+ articles with complex taxonomies. Performance was degrading and maintenance was becoming difficult.',
        ),
        heading('Why Payload CMS?'),
        bulletList([
          'Native TypeScript',
          'Automatic GraphQL and REST APIs',
          'Full control over data schema',
          'Seamless Next.js integration',
        ]),
        heading('The Migration Process'),
        paragraph(
          'Migration was done in 3 phases: data export, schema transformation, import into Payload.',
        ),
        heading('Results'),
        paragraph(
          'Loading time divided by 3, improved DX, and a site finally maintainable in the long term.',
        ),
      ]),
    },
    category: 'case-study',
    tags: ['payload-cms', 'typescript'],
    complexity: 'beginner' as const,
    publishedAt: new Date('2025-11-29T11:00:00Z'),
  },
  {
    title: {
      fr: 'Accessibilité Web WCAG 2.1 AA avec Next.js',
      en: 'Web Accessibility WCAG 2.1 AA with Next.js',
    },
    slug: 'accessibility-wcag-nextjs',
    excerpt: {
      fr: "Guide pratique pour implémenter les standards d'accessibilité WCAG 2.1 niveau AA dans une application Next.js. Tests automatisés et checklist complète.",
      en: 'Practical guide to implementing WCAG 2.1 level AA accessibility standards in a Next.js application. Automated tests and complete checklist.',
    },
    content: {
      fr: createLexicalRoot([
        paragraph(
          "L'accessibilité web n'est pas optionnelle. Elle garantit que tous les utilisateurs peuvent accéder à votre contenu, y compris les personnes en situation de handicap.",
        ),
        heading('Les Critères WCAG 2.1 AA'),
        bulletList([
          'Contraste de couleurs minimum 4.5:1',
          'Navigation au clavier complète',
          'Textes alternatifs pour les images',
          'Labels pour tous les formulaires',
        ]),
        heading('Tests Automatisés avec Playwright'),
        paragraph(
          "Intégrez axe-core dans vos tests E2E pour détecter automatiquement les violations d'accessibilité.",
        ),
        codeBlock(
          `import AxeBuilder from '@axe-core/playwright'

test('homepage accessibility', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})`,
        ),
        heading('Bonnes Pratiques Next.js'),
        paragraph(
          'Utilisez le composant Image de Next.js avec des alt descriptifs, et Link pour une navigation accessible.',
        ),
      ]),
      en: createLexicalRoot([
        paragraph(
          'Web accessibility is not optional. It ensures all users can access your content, including people with disabilities.',
        ),
        heading('WCAG 2.1 AA Criteria'),
        bulletList([
          'Minimum color contrast 4.5:1',
          'Complete keyboard navigation',
          'Alternative text for images',
          'Labels for all forms',
        ]),
        heading('Automated Tests with Playwright'),
        paragraph(
          'Integrate axe-core into your E2E tests to automatically detect accessibility violations.',
        ),
        codeBlock(
          `import AxeBuilder from '@axe-core/playwright'

test('homepage accessibility', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})`,
        ),
        heading('Next.js Best Practices'),
        paragraph(
          'Use the Next.js Image component with descriptive alt text, and Link for accessible navigation.',
        ),
      ]),
    },
    category: 'tutorial',
    tags: ['accessibility', 'nextjs', 'react'],
    complexity: 'intermediate' as const,
    publishedAt: new Date('2025-11-27T15:00:00Z'),
  },
  {
    title: {
      fr: 'CSS Modern : Container Queries et Subgrid',
      en: 'Modern CSS: Container Queries and Subgrid',
    },
    slug: 'css-modern-container-queries',
    excerpt: {
      fr: 'Les nouvelles fonctionnalités CSS révolutionnent la création de layouts responsives. Découvrez Container Queries et Subgrid avec des exemples pratiques.',
      en: 'New CSS features are revolutionizing responsive layout creation. Discover Container Queries and Subgrid with practical examples.',
    },
    content: {
      fr: createLexicalRoot([
        paragraph(
          'Le CSS moderne offre des outils puissants pour créer des interfaces véritablement responsives. Container Queries et Subgrid changent fondamentalement notre approche du design.',
        ),
        heading('Container Queries'),
        paragraph(
          'Contrairement aux Media Queries qui dépendent du viewport, les Container Queries permettent de styliser un élément en fonction de la taille de son conteneur parent.',
        ),
        codeBlock(
          `.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}`,
          'css',
        ),
        heading('CSS Subgrid'),
        paragraph(
          "Subgrid permet aux éléments enfants d'hériter des lignes et colonnes de la grille parente, garantissant un alignement parfait.",
        ),
        heading('Support Navigateurs'),
        paragraph(
          'Ces fonctionnalités sont maintenant supportées par tous les navigateurs modernes. Il est temps de les adopter !',
        ),
      ]),
      en: createLexicalRoot([
        paragraph(
          'Modern CSS offers powerful tools for creating truly responsive interfaces. Container Queries and Subgrid fundamentally change our approach to design.',
        ),
        heading('Container Queries'),
        paragraph(
          'Unlike Media Queries that depend on the viewport, Container Queries allow styling an element based on the size of its parent container.',
        ),
        codeBlock(
          `.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}`,
          'css',
        ),
        heading('CSS Subgrid'),
        paragraph(
          'Subgrid allows child elements to inherit lines and columns from the parent grid, ensuring perfect alignment.',
        ),
        heading('Browser Support'),
        paragraph(
          "These features are now supported by all modern browsers. It's time to adopt them!",
        ),
      ]),
    },
    category: 'tutorial',
    tags: ['css', 'ux-design'],
    complexity: 'intermediate' as const,
    publishedAt: new Date('2025-11-25T10:00:00Z'),
  },
  {
    title: {
      fr: "Mon Parcours : De WordPress à l'Edge Computing",
      en: 'My Journey: From WordPress to Edge Computing',
    },
    slug: 'parcours-wordpress-edge',
    excerpt: {
      fr: '15 ans de développement web résumés : les technologies qui ont marqué mon parcours et les leçons apprises en chemin.',
      en: '15 years of web development summarized: the technologies that marked my journey and lessons learned along the way.',
    },
    content: {
      fr: createLexicalRoot([
        paragraph(
          "Quand j'ai commencé le développement web en 2010, jQuery était roi et WordPress la solution à tout. Aujourd'hui, je déploie des applications sur le edge. Voici mon parcours.",
        ),
        heading('Les Débuts (2010-2015)'),
        paragraph(
          'PHP, MySQL, WordPress, jQuery. Des sites "à la main" avec FTP. Pas de Git, pas de CI/CD. Une autre époque !',
        ),
        heading("L'Ère JavaScript (2015-2020)"),
        paragraph(
          'React, Node.js, MongoDB. La révolution du frontend. NPM et ses 1000 dépendances. Docker et les microservices.',
        ),
        heading("L'Ère Moderne (2020-aujourd'hui)"),
        paragraph(
          'TypeScript partout, Next.js, edge computing, IA assistée. Le développeur est devenu architecte.',
        ),
        heading('Leçon Principale'),
        paragraph(
          'Les frameworks changent, les principes restent : clean code, tests, accessibilité, performance.',
        ),
      ]),
      en: createLexicalRoot([
        paragraph(
          'When I started web development in 2010, jQuery was king and WordPress was the solution to everything. Today, I deploy applications on the edge. Here is my journey.',
        ),
        heading('The Beginnings (2010-2015)'),
        paragraph(
          'PHP, MySQL, WordPress, jQuery. Handcrafted sites with FTP. No Git, no CI/CD. A different era!',
        ),
        heading('The JavaScript Era (2015-2020)'),
        paragraph(
          'React, Node.js, MongoDB. The frontend revolution. NPM and its 1000 dependencies. Docker and microservices.',
        ),
        heading('The Modern Era (2020-today)'),
        paragraph(
          'TypeScript everywhere, Next.js, edge computing, AI-assisted. The developer has become an architect.',
        ),
        heading('Main Lesson'),
        paragraph(
          'Frameworks change, principles remain: clean code, tests, accessibility, performance.',
        ),
      ]),
    },
    category: 'feedback',
    tags: ['typescript', 'cloudflare', 'performance'],
    complexity: 'beginner' as const,
    publishedAt: new Date('2025-11-23T08:00:00Z'),
  },
  {
    title: {
      fr: 'Guide Complet du Formatage Rich Text',
      en: 'Complete Rich Text Formatting Guide',
    },
    slug: 'guide-formatage-richtext',
    excerpt: {
      fr: 'Découvrez toutes les possibilités de formatage rich text : texte en gras, italique, souligné, barré, code inline, titres, listes, citations et liens.',
      en: 'Discover all rich text formatting possibilities: bold, italic, underline, strikethrough, inline code, headings, lists, blockquotes and links.',
    },
    content: {
      fr: createLexicalRoot([
        // Introduction
        paragraph(
          "Cet article présente toutes les fonctionnalités de formatage disponibles dans l'éditeur rich text. Il sert également de référence pour tester le rendu.",
        ),

        // H1 - Formatage de texte
        heading('Formatage de Texte', 'h1'),
        paragraphWithChildren([
          text('Le texte peut être formaté de plusieurs façons : '),
          bold('en gras'),
          text(', '),
          italic('en italique'),
          text(', '),
          underline('souligné'),
          text(', '),
          strikethrough('barré'),
          text(', ou en '),
          inlineCode('code inline'),
          text('. On peut aussi '),
          boldItalic('combiner gras et italique'),
          text('.'),
        ]),

        // H2 - Niveaux de titres
        heading('Niveaux de Titres', 'h2'),
        paragraph(
          'Les titres permettent de structurer le contenu. Voici les différents niveaux disponibles :',
        ),
        heading('Titre de niveau 1 (H1)', 'h1'),
        heading('Titre de niveau 2 (H2)', 'h2'),
        heading('Titre de niveau 3 (H3)', 'h3'),
        heading('Titre de niveau 4 (H4)', 'h4'),
        heading('Titre de niveau 5 (H5)', 'h5'),
        heading('Titre de niveau 6 (H6)', 'h6'),

        // H2 - Paragraphes
        heading('Paragraphes', 'h2'),
        paragraph(
          'Les paragraphes sont les blocs de base du contenu. Ils peuvent contenir du texte simple ou du texte formaté.',
        ),
        paragraphWithChildren([
          text('Ce paragraphe contient du texte avec '),
          bold('différents'),
          text(' '),
          italic('styles'),
          text(' de '),
          underline('formatage'),
          text(' mélangés dans la même phrase.'),
        ]),

        // H2 - Listes
        heading('Listes', 'h2'),

        // H3 - Listes à puces
        heading('Listes à Puces (non ordonnées)', 'h3'),
        bulletList([
          'Premier élément de la liste',
          'Deuxième élément de la liste',
          'Troisième élément de la liste',
        ]),

        // H3 - Listes numérotées
        heading('Listes Numérotées (ordonnées)', 'h3'),
        orderedList([
          'Première étape du processus',
          'Deuxième étape du processus',
          'Troisième étape du processus',
        ]),

        // H3 - Listes imbriquées
        heading('Listes Imbriquées', 'h3'),
        nestedBulletList([
          {
            text: 'Catégorie principale A',
            children: ['Sous-élément A.1', 'Sous-élément A.2'],
          },
          {
            text: 'Catégorie principale B',
            children: ['Sous-élément B.1', 'Sous-élément B.2'],
          },
          { text: 'Catégorie principale C (sans enfants)' },
        ]),

        // H3 - Listes avec formatage
        heading('Listes avec Formatage', 'h3'),
        bulletListWithItems([
          listItem([bold('Gras'), text(' : pour mettre en évidence')]),
          listItem([italic('Italique'), text(' : pour les citations ou termes étrangers')]),
          listItem([inlineCode('Code'), text(' : pour les éléments techniques')]),
        ]),

        // H2 - Citations
        heading('Citations (Blockquotes)', 'h2'),
        blockquote(
          "Une citation simple avec du texte. Les blockquotes sont utiles pour mettre en avant des passages importants ou des citations d'auteurs.",
        ),
        blockquoteWithChildren([
          text('Une citation peut aussi contenir du texte '),
          bold('formaté'),
          text(' avec des éléments en '),
          italic('italique'),
          text(' ou même du '),
          inlineCode('code'),
          text('.'),
        ]),

        // H2 - Liens
        heading('Liens', 'h2'),

        // H3 - Liens internes
        heading('Liens Internes (Next.js)', 'h3'),
        paragraphWithChildren([
          text(
            'Les liens internes utilisent le composant Link de Next.js pour une navigation côté client : ',
          ),
          textLink('/fr', "Retour à la page d'accueil"),
          text(' ou '),
          textLink('/fr/articles', 'voir tous les articles'),
          text('.'),
        ]),

        // H3 - Liens externes
        heading('Liens Externes (nouvel onglet)', 'h3'),
        paragraphWithChildren([
          text("Les liens externes s'ouvrent dans un nouvel onglet : "),
          textLink('https://nextjs.org', 'Documentation Next.js'),
          text(', '),
          textLink('https://payloadcms.com', 'Payload CMS'),
          text(', ou '),
          textLink('https://github.com', 'GitHub'),
          text('.'),
        ]),

        // H3 - Liens mailto et tel
        heading('Liens Spéciaux (mailto, tel)', 'h3'),
        paragraphWithChildren([
          text("Pour contacter quelqu'un : "),
          textLink('mailto:contact@example.com', 'Envoyer un email'),
          text(' ou '),
          textLink('tel:+33123456789', 'Appeler le +33 1 23 45 67 89'),
          text('.'),
        ]),

        // H2 - Code
        heading('Blocs de Code', 'h2'),
        paragraph(
          "Les blocs de code permettent d'afficher du code source avec coloration syntaxique :",
        ),
        codeBlock(
          `// Exemple TypeScript
interface User {
  id: string
  name: string
  email: string
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`
}`,
          'typescript',
        ),

        // Conclusion
        heading('Conclusion', 'h2'),
        paragraphWithChildren([
          text(
            "Ce guide couvre l'ensemble des fonctionnalités de formatage disponibles. Pour plus d'informations, consultez la ",
          ),
          textLink('https://lexical.dev', 'documentation Lexical'),
          text('.'),
        ]),
      ]),
      en: createLexicalRoot([
        // Introduction
        paragraph(
          'This article presents all the formatting features available in the rich text editor. It also serves as a reference for testing rendering.',
        ),

        // H1 - Text Formatting
        heading('Text Formatting', 'h1'),
        paragraphWithChildren([
          text('Text can be formatted in several ways: '),
          bold('bold'),
          text(', '),
          italic('italic'),
          text(', '),
          underline('underlined'),
          text(', '),
          strikethrough('strikethrough'),
          text(', or as '),
          inlineCode('inline code'),
          text('. You can also '),
          boldItalic('combine bold and italic'),
          text('.'),
        ]),

        // H2 - Heading Levels
        heading('Heading Levels', 'h2'),
        paragraph('Headings help structure content. Here are the different levels available:'),
        heading('Heading Level 1 (H1)', 'h1'),
        heading('Heading Level 2 (H2)', 'h2'),
        heading('Heading Level 3 (H3)', 'h3'),
        heading('Heading Level 4 (H4)', 'h4'),
        heading('Heading Level 5 (H5)', 'h5'),
        heading('Heading Level 6 (H6)', 'h6'),

        // H2 - Paragraphs
        heading('Paragraphs', 'h2'),
        paragraph(
          'Paragraphs are the basic building blocks of content. They can contain plain text or formatted text.',
        ),
        paragraphWithChildren([
          text('This paragraph contains text with '),
          bold('different'),
          text(' '),
          italic('formatting'),
          text(' '),
          underline('styles'),
          text(' mixed in the same sentence.'),
        ]),

        // H2 - Lists
        heading('Lists', 'h2'),

        // H3 - Bullet Lists
        heading('Bullet Lists (unordered)', 'h3'),
        bulletList(['First list item', 'Second list item', 'Third list item']),

        // H3 - Numbered Lists
        heading('Numbered Lists (ordered)', 'h3'),
        orderedList([
          'First step of the process',
          'Second step of the process',
          'Third step of the process',
        ]),

        // H3 - Nested Lists
        heading('Nested Lists', 'h3'),
        nestedBulletList([
          {
            text: 'Main category A',
            children: ['Sub-item A.1', 'Sub-item A.2'],
          },
          {
            text: 'Main category B',
            children: ['Sub-item B.1', 'Sub-item B.2'],
          },
          { text: 'Main category C (no children)' },
        ]),

        // H3 - Lists with Formatting
        heading('Lists with Formatting', 'h3'),
        bulletListWithItems([
          listItem([bold('Bold'), text(': to emphasize')]),
          listItem([italic('Italic'), text(': for quotes or foreign terms')]),
          listItem([inlineCode('Code'), text(': for technical elements')]),
        ]),

        // H2 - Blockquotes
        heading('Blockquotes', 'h2'),
        blockquote(
          'A simple blockquote with text. Blockquotes are useful for highlighting important passages or author quotes.',
        ),
        blockquoteWithChildren([
          text('A blockquote can also contain '),
          bold('formatted'),
          text(' text with '),
          italic('italic'),
          text(' elements or even '),
          inlineCode('code'),
          text('.'),
        ]),

        // H2 - Links
        heading('Links', 'h2'),

        // H3 - Internal Links
        heading('Internal Links (Next.js)', 'h3'),
        paragraphWithChildren([
          text('Internal links use the Next.js Link component for client-side navigation: '),
          textLink('/en', 'Back to homepage'),
          text(' or '),
          textLink('/en/articles', 'view all articles'),
          text('.'),
        ]),

        // H3 - External Links
        heading('External Links (new tab)', 'h3'),
        paragraphWithChildren([
          text('External links open in a new tab: '),
          textLink('https://nextjs.org', 'Next.js Documentation'),
          text(', '),
          textLink('https://payloadcms.com', 'Payload CMS'),
          text(', or '),
          textLink('https://github.com', 'GitHub'),
          text('.'),
        ]),

        // H3 - mailto and tel links
        heading('Special Links (mailto, tel)', 'h3'),
        paragraphWithChildren([
          text('To contact someone: '),
          textLink('mailto:contact@example.com', 'Send an email'),
          text(' or '),
          textLink('tel:+33123456789', 'Call +33 1 23 45 67 89'),
          text('.'),
        ]),

        // H2 - Code
        heading('Code Blocks', 'h2'),
        paragraph('Code blocks display source code with syntax highlighting:'),
        codeBlock(
          `// TypeScript example
interface User {
  id: string
  name: string
  email: string
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`
}`,
          'typescript',
        ),

        // Conclusion
        heading('Conclusion', 'h2'),
        paragraphWithChildren([
          text(
            'This guide covers all available formatting features. For more information, see the ',
          ),
          textLink('https://lexical.dev', 'Lexical documentation'),
          text('.'),
        ]),
      ]),
    },
    category: 'tutorial',
    tags: ['typescript', 'payload-cms', 'react'],
    complexity: 'beginner' as const,
    publishedAt: new Date('2025-12-07T09:00:00Z'),
  },
]

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedCategories(payload: BasePayload) {
  console.log('🏷️  Seeding categories...')

  const categoryMap: Record<string, number> = {}

  for (const cat of CATEGORIES) {
    // Check if category already exists
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ⏭️  Category "${cat.slug}" already exists`)
      categoryMap[cat.slug] = existing.docs[0].id
      continue
    }

    const created = await payload.create({
      collection: 'categories',
      data: {
        name: cat.name.fr,
        slug: cat.slug,
        color: cat.color,
        icon: cat.icon,
        description: cat.description.fr,
      },
      locale: 'fr',
    })

    // Update English locale
    await payload.update({
      collection: 'categories',
      id: created.id,
      data: {
        name: cat.name.en,
        description: cat.description.en,
      },
      locale: 'en',
    })

    categoryMap[cat.slug] = created.id
    console.log(`  ✅ Created category: ${cat.name.fr}`)
  }

  return categoryMap
}

async function seedTags(payload: BasePayload) {
  console.log('🔖 Seeding tags...')

  const tagMap: Record<string, number> = {}

  for (const tag of TAGS) {
    // Check if tag already exists
    const existing = await payload.find({
      collection: 'tags',
      where: { slug: { equals: tag.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ⏭️  Tag "${tag.slug}" already exists`)
      tagMap[tag.slug] = existing.docs[0].id
      continue
    }

    const created = await payload.create({
      collection: 'tags',
      data: {
        name: tag.name.fr,
        slug: tag.slug,
      },
      locale: 'fr',
    })

    // Update English locale
    await payload.update({
      collection: 'tags',
      id: created.id,
      data: {
        name: tag.name.en,
      },
      locale: 'en',
    })

    tagMap[tag.slug] = created.id
    console.log(`  ✅ Created tag: ${tag.name.fr}`)
  }

  return tagMap
}

async function seedArticles(
  payload: BasePayload,
  categoryMap: Record<string, number>,
  tagMap: Record<string, number>,
) {
  console.log('📝 Seeding articles...')

  for (const article of ARTICLES) {
    // Check if article already exists
    const existing = await payload.find({
      collection: 'articles',
      where: { slug: { equals: article.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ⏭️  Article "${article.slug}" already exists`)
      continue
    }

    const categoryId = categoryMap[article.category]
    if (!categoryId) {
      throw new Error(`Article "${article.slug}" references unknown category "${article.category}"`)
    }

    const missingTags = article.tags.filter((tagSlug) => !tagMap[tagSlug])
    if (missingTags.length > 0) {
      throw new Error(
        `Article "${article.slug}" references unknown tags: ${missingTags.join(', ')}`,
      )
    }

    const tagIds = article.tags.map((tagSlug) => tagMap[tagSlug])

    // Upload featured image
    const imageConfig = ARTICLE_IMAGES.find((img) => img.slug === article.slug)
    let featuredImageId: number | null = null

    if (imageConfig) {
      console.log(`  📷 Uploading image for "${article.slug}"...`)
      // Using picsum.photos with seed for consistent images (1200x675 = 16:9 aspect ratio)
      const imageUrl = `https://picsum.photos/seed/${imageConfig.seed}/1200/675`
      featuredImageId = await uploadImage(
        payload,
        imageUrl,
        `${article.slug}.jpg`,
        imageConfig.alt.fr,
      )
    }

    const created = await payload.create({
      collection: 'articles',
      data: {
        title: article.title.fr,
        slug: article.slug,
        excerpt: article.excerpt.fr,
        content: article.content.fr as any,
        category: categoryId,
        tags: tagIds,
        complexity: article.complexity,
        status: 'published',
        publishedAt: article.publishedAt.toISOString(),
        ...(featuredImageId && { featuredImage: featuredImageId }),
      },
      locale: 'fr',
    })

    // Update English locale

    await payload.update({
      collection: 'articles',
      id: created.id,
      data: {
        title: article.title.en,
        excerpt: article.excerpt.en,
        content: article.content.en as any,
      },
      locale: 'en',
    })

    console.log(`  ✅ Created article: ${article.title.fr}`)
  }
}

// ============================================================================
// CLEAN FUNCTIONS
// ============================================================================

/**
 * Deletes ALL data from content collections (articles, categories, tags, media).
 *
 * WARNING: This function removes ALL records, not just seeded data.
 * It is intended for development environments to reset the database.
 *
 * Safety: Requires --force flag in production to prevent accidental data loss.
 */
async function cleanAll(payload: BasePayload) {
  // Safety check: prevent accidental production data deletion
  if (process.env.NODE_ENV === 'production') {
    const args = process.argv.slice(2)
    if (!args.includes('--force')) {
      console.error('❌ Cannot run --clean in production without --force flag')
      console.error('   If you really want to delete all data, run:')
      console.error('   NODE_ENV=production pnpm seed --clean --force')
      process.exit(1)
    }
    console.warn('⚠️  Running clean in PRODUCTION mode with --force flag!')
  }

  console.log('🧹 Cleaning all content data...\n')

  // Delete articles first (they reference categories, tags, and media)
  console.log('  🗑️  Deleting articles...')
  let articlesDeleted = 0
  let hasMoreArticles = true
  while (hasMoreArticles) {
    const articles = await payload.find({
      collection: 'articles',
      limit: 100,
    })
    if (articles.docs.length === 0) {
      hasMoreArticles = false
    } else {
      for (const article of articles.docs) {
        await payload.delete({ collection: 'articles', id: article.id })
      }
      articlesDeleted += articles.docs.length
    }
  }
  console.log(`    ✅ Deleted ${articlesDeleted} articles`)

  // Delete media (images)
  console.log('  🗑️  Deleting media...')
  let mediaDeleted = 0
  let hasMoreMedia = true
  while (hasMoreMedia) {
    const media = await payload.find({
      collection: 'media',
      limit: 100,
    })
    if (media.docs.length === 0) {
      hasMoreMedia = false
    } else {
      for (const item of media.docs) {
        await payload.delete({ collection: 'media', id: item.id })
      }
      mediaDeleted += media.docs.length
    }
  }
  console.log(`    ✅ Deleted ${mediaDeleted} media items`)

  // Delete tags
  console.log('  🗑️  Deleting tags...')
  let tagsDeleted = 0
  let hasMoreTags = true
  while (hasMoreTags) {
    const tags = await payload.find({
      collection: 'tags',
      limit: 100,
    })
    if (tags.docs.length === 0) {
      hasMoreTags = false
    } else {
      for (const tag of tags.docs) {
        await payload.delete({ collection: 'tags', id: tag.id })
      }
      tagsDeleted += tags.docs.length
    }
  }
  console.log(`    ✅ Deleted ${tagsDeleted} tags`)

  // Delete categories
  console.log('  🗑️  Deleting categories...')
  let categoriesDeleted = 0
  let hasMoreCategories = true
  while (hasMoreCategories) {
    const categories = await payload.find({
      collection: 'categories',
      limit: 100,
    })
    if (categories.docs.length === 0) {
      hasMoreCategories = false
    } else {
      for (const cat of categories.docs) {
        await payload.delete({ collection: 'categories', id: cat.id })
      }
      categoriesDeleted += categories.docs.length
    }
  }
  console.log(`    ✅ Deleted ${categoriesDeleted} categories`)

  console.log('\n✅ Clean completed!\n')
}

// ============================================================================
// MAIN
// ============================================================================

async function seed() {
  const args = process.argv.slice(2)
  const shouldClean = args.includes('--clean') || args.includes('-c')
  const hasForce = args.includes('--force') || args.includes('-f')

  // Safety check: prevent accidental production seeding
  if (process.env.NODE_ENV === 'production' && !hasForce) {
    console.error('❌ Cannot run seed in production without --force flag')
    console.error('   Seeding would add demo data to your production database.')
    console.error('   If you really want to proceed, run:')
    console.error('   NODE_ENV=production pnpm seed --force')
    process.exit(1)
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️  Running seed in PRODUCTION mode with --force flag!')
  }

  console.log('\n🌱 Starting seed process...\n')

  const payload = await getPayload({ config })

  // Track completed steps for better error reporting
  const completedSteps: string[] = []
  let currentStep = ''

  try {
    if (shouldClean) {
      currentStep = 'clean'
      await cleanAll(payload)
      completedSteps.push('clean')
    }

    currentStep = 'categories'
    const categoryMap = await seedCategories(payload)
    completedSteps.push('categories')

    currentStep = 'tags'
    const tagMap = await seedTags(payload)
    completedSteps.push('tags')

    currentStep = 'articles'
    await seedArticles(payload, categoryMap, tagMap)
    completedSteps.push('articles')

    console.log('\n✨ Seed completed successfully!\n')
  } catch (error) {
    console.error(`\n❌ Seed failed during step: ${currentStep}`)
    if (completedSteps.length > 0) {
      console.error(`   ✅ Completed steps: ${completedSteps.join(' → ')}`)
    }
    console.error(`   💡 The seed is idempotent - you can safely re-run it to continue`)
    console.error('\nError details:', error)
    process.exit(1)
  }

  process.exit(0)
}

seed()
