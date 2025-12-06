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
 */
async function downloadImage(
  url: string,
  filename: string,
  alt: string,
): Promise<{ data: Buffer; mimetype: string; name: string; size: number } | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SeedScript/1.0)',
      },
    })

    if (!response.ok) {
      console.error(`  ⚠️  Failed to download image: ${url} (${response.status})`)
      return null
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    return {
      data: buffer,
      mimetype: contentType,
      name: filename,
      size: buffer.length,
    }
  } catch (error) {
    console.error(`  ⚠️  Error downloading image: ${url}`, error)
    return null
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
): Promise<string | null> {
  const imageData = await downloadImage(imageUrl, filename, alt)

  if (!imageData) {
    return null
  }

  try {
    const media = await payload.create({
      collection: 'media',
      data: {
        alt,
      },
      file: imageData as File,
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
    slug: 'actualites',
    color: '#0ea5e9',
    icon: 'newspaper',
    description: {
      fr: 'Dernières actualités et mises à jour du monde tech',
      en: 'Latest news and updates from the tech world',
    },
  },
  {
    name: { fr: 'Tutoriels', en: 'Tutorials' },
    slug: 'tutoriels',
    color: '#06b6d4',
    icon: 'book-open',
    description: {
      fr: 'Guides pratiques et tutoriels détaillés',
      en: 'Practical guides and detailed tutorials',
    },
  },
  {
    name: { fr: 'Décryptage', en: 'Deep Dive' },
    slug: 'decryptage',
    color: '#6366f1',
    icon: 'lightbulb',
    description: {
      fr: 'Analyses approfondies et décryptage technique',
      en: 'In-depth technical analysis and insights',
    },
  },
  {
    name: { fr: 'Étude de Cas', en: 'Case Study' },
    slug: 'etude-cas',
    color: '#ec4899',
    icon: 'target',
    description: {
      fr: "Études de cas et retours d'expérience concrets",
      en: 'Real-world case studies and experience reports',
    },
  },
  {
    name: { fr: "Retour d'Expérience", en: 'Feedback' },
    slug: 'retour-experience',
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
 * Creates a Lexical root structure with the given children.
 */
function createLexicalRoot(children: unknown[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children,
      direction: 'ltr',
    },
  }
}

/**
 * Creates a Lexical paragraph node.
 */
function paragraph(text: string) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      {
        type: 'text',
        format: 0,
        mode: 'normal',
        style: '',
        detail: 0,
        text,
        version: 1,
      },
    ],
  }
}

/**
 * Creates a Lexical heading node.
 */
function heading(text: string, tag: 'h2' | 'h3' = 'h2') {
  return {
    type: 'heading',
    format: '',
    indent: 0,
    version: 1,
    tag,
    direction: 'ltr',
    children: [
      {
        type: 'text',
        format: 0,
        mode: 'normal',
        style: '',
        detail: 0,
        text,
        version: 1,
      },
    ],
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
    children: items.map((item) => ({
      type: 'listitem',
      format: '',
      indent: 0,
      version: 1,
      value: 1,
      direction: 'ltr',
      children: [
        {
          type: 'text',
          format: 0,
          mode: 'normal',
          style: '',
          detail: 0,
          text: item,
          version: 1,
        },
      ],
    })),
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
    category: 'tutoriels',
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
    category: 'tutoriels',
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
    category: 'decryptage',
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
    category: 'etude-cas',
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
    category: 'tutoriels',
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
    category: 'tutoriels',
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
    category: 'retour-experience',
    tags: ['typescript', 'cloudflare', 'performance'],
    complexity: 'beginner' as const,
    publishedAt: new Date('2025-11-23T08:00:00Z'),
  },
]

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedCategories(payload: BasePayload) {
  console.log('🏷️  Seeding categories...')

  const categoryMap: Record<string, string> = {}

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

  const tagMap: Record<string, string> = {}

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
  categoryMap: Record<string, string>,
  tagMap: Record<string, string>,
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
    const tagIds = article.tags.map((tagSlug) => tagMap[tagSlug]).filter(Boolean)

    // Upload featured image
    const imageConfig = ARTICLE_IMAGES.find((img) => img.slug === article.slug)
    let featuredImageId: string | null = null

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
        content: article.content.fr,
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
        content: article.content.en,
      },
      locale: 'en',
    })

    console.log(`  ✅ Created article: ${article.title.fr}`)
  }
}

/**
 * Updates existing articles with featured images if they don't have one.
 */
async function seedImages(payload: BasePayload) {
  console.log('🖼️  Seeding images for existing articles...')

  for (const imageConfig of ARTICLE_IMAGES) {
    // Find the article
    const existing = await payload.find({
      collection: 'articles',
      where: { slug: { equals: imageConfig.slug } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      console.log(`  ⏭️  Article "${imageConfig.slug}" not found, skipping`)
      continue
    }

    const article = existing.docs[0]

    // Check if article already has a featured image
    if (article.featuredImage) {
      console.log(`  ⏭️  Article "${imageConfig.slug}" already has an image`)
      continue
    }

    console.log(`  📷 Uploading image for "${imageConfig.slug}"...`)
    // Using picsum.photos with seed for consistent images (1200x675 = 16:9 aspect ratio)
    const imageUrl = `https://picsum.photos/seed/${imageConfig.seed}/1200/675`
    const featuredImageId = await uploadImage(
      payload,
      imageUrl,
      `${imageConfig.slug}.jpg`,
      imageConfig.alt.fr,
    )

    if (featuredImageId) {
      await payload.update({
        collection: 'articles',
        id: article.id,
        data: {
          featuredImage: featuredImageId,
        },
      })
      console.log(`  ✅ Added image to article: ${imageConfig.slug}`)
    } else {
      console.log(`  ⚠️  Failed to upload image for: ${imageConfig.slug}`)
    }
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function seed() {
  console.log('\n🌱 Starting seed process...\n')

  const payload = await getPayload({ config })

  try {
    const categoryMap = await seedCategories(payload)
    const tagMap = await seedTags(payload)
    await seedArticles(payload, categoryMap, tagMap)
    await seedImages(payload)

    console.log('\n✨ Seed completed successfully!\n')
  } catch (error) {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

seed()
