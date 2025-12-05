# Phase 2: Environment Setup - Homepage Structure

**Story**: 3.5 - Homepage Implementation
**Phase**: 2 of 3

---

## Prerequisites

### Phase 1 Completion

Cette phase depend de la Phase 1. Verifier:

```bash
# Verifier que les composants Phase 1 existent
ls src/components/articles/
# Expected: CategoryBadge.tsx, ComplexityBadge.tsx, TagPill.tsx, ArticleCard.tsx, index.ts

ls src/components/RelativeDate.tsx
# Expected: RelativeDate.tsx
```

### Dependencies Check

```bash
# Verifier les packages necessaires
pnpm list lucide-react  # Pour les icones
pnpm list payload       # Pour le data fetching
pnpm list next-intl     # Pour les traductions
```

Si `lucide-react` manque:
```bash
pnpm add lucide-react
```

---

## Directory Structure

### Before Phase 2

```
src/
├── components/
│   ├── articles/
│   │   ├── index.ts
│   │   ├── CategoryBadge.tsx
│   │   ├── ComplexityBadge.tsx
│   │   ├── TagPill.tsx
│   │   └── ArticleCard.tsx
│   ├── RelativeDate.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   └── card.tsx
│   └── layout/
└── app/
    └── [locale]/
        └── (frontend)/
            └── page.tsx  # Placeholder actuel
```

### After Phase 2

```
src/
├── components/
│   ├── articles/
│   │   ├── index.ts              # MODIFIED
│   │   ├── CategoryBadge.tsx
│   │   ├── ComplexityBadge.tsx
│   │   ├── TagPill.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── FeaturedArticleCard.tsx  # NEW
│   │   └── ArticleGrid.tsx          # NEW
│   ├── RelativeDate.tsx
│   ├── EmptyState.tsx            # NEW
│   └── ui/
└── app/
    └── [locale]/
        └── (frontend)/
            └── page.tsx          # REPLACED
```

---

## Payload CMS Requirements

### Posts Collection

La collection `posts` doit exister avec ces champs:

```typescript
// Champs requis pour la Homepage
interface Post {
  id: string
  title: string           // Localized text
  slug: string            // Localized text
  excerpt: string         // Localized textarea
  coverImage?: Media      // Upload relation
  category: Category      // Relation
  tags: Tag[]             // Relation (hasMany)
  complexity: 'beginner' | 'intermediate' | 'advanced'
  readingTime: number
  publishedAt: string     // Date
  _status: 'draft' | 'published'
}
```

### Verification

```bash
# Via Payload Admin
# Navigate to /admin/collections/posts
# Verify fields exist

# Ou via API (dev server running)
curl http://localhost:3000/api/posts?limit=1
```

### Si la collection n'existe pas

Creer la collection dans `src/collections/Posts.ts`:

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      localized: true,
      unique: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'complexity',
      type: 'select',
      options: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    {
      name: 'readingTime',
      type: 'number',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
  ],
}
```

---

## Type Definitions

### Article Interface

Creer un type partage pour l'interface Article:

```typescript
// src/types/article.ts (optionnel, ou inline dans composants)
export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: {
    url: string
    alt?: string
  } | null
  category: {
    id: string
    title: string
    slug: string
    color?: string
    icon?: string
  }
  tags: Array<{
    id: string
    title: string
    slug: string
  }>
  complexity: 'beginner' | 'intermediate' | 'advanced'
  readingTime: number
  publishedAt: string
}
```

---

## Environment Variables

### Required

```env
# .env.local
PAYLOAD_SECRET=your-secret-key
DATABASE_URI=your-d1-connection
```

### Optional (Development)

```env
# Pour tester avec des donnees mockees
MOCK_DATA=true
```

---

## Development Server

### Start Dev Server

```bash
pnpm dev
```

### Verify Payload Connection

1. Navigate to `http://localhost:3000/admin`
2. Login
3. Go to Posts collection
4. Verify data is accessible

### Create Test Data

Si la base est vide, creer au moins 1 article:

1. Go to `/admin/collections/posts/create`
2. Fill required fields:
   - Title (FR/EN)
   - Slug (FR/EN)
   - Excerpt (FR/EN)
   - Category
   - Complexity
   - Reading time
   - Published date
3. Set status to "Published"
4. Save

---

## Cookie Authentication

### Test Authentication Flow

Pour tester le CTA de l'EmptyState:

1. **Sans auth**: Visit homepage sans etre connecte
   - CTA "Creer un article" ne doit PAS apparaitre

2. **Avec auth**: Se connecter a `/admin`
   - Le cookie `payload-token` sera set
   - Retourner sur homepage
   - CTA "Creer un article" doit apparaitre

### Debug Cookie

```javascript
// Dans la console du navigateur
document.cookie
// Chercher "payload-token"
```

---

## Troubleshooting

### Issue: "Cannot find module '@/components/articles'"

**Solution**: Verifier le barrel export:
```typescript
// src/components/articles/index.ts
export { CategoryBadge } from './CategoryBadge'
export { ComplexityBadge } from './ComplexityBadge'
// ... etc
```

### Issue: "posts collection not found"

**Solution**:
1. Verifier `src/payload.config.ts` inclut la collection Posts
2. Run migrations: `pnpm payload migrate`

### Issue: "No articles returned from Payload"

**Solutions**:
1. Verifier qu'il y a des articles dans la DB
2. Verifier que `_status: 'published'` est correct
3. Tester sans le filtre `where` d'abord

### Issue: "cookies() must be called in a Server Component"

**Solution**: S'assurer que le composant est un RSC (pas de `'use client'`)

### Issue: "useTranslations is not a function"

**Solution**: Utiliser `getTranslations` de `next-intl/server` dans les RSC

---

## Pre-Implementation Checklist

Avant de commencer:

- [ ] Phase 1 completee
- [ ] `pnpm install` execute
- [ ] `pnpm exec tsc --noEmit` passe
- [ ] `pnpm build` passe
- [ ] `pnpm dev` demarre
- [ ] Posts collection existe dans Payload
- [ ] Au moins 1 article publie (ou pret a tester empty state)
- [ ] `lucide-react` installe

**Ready to implement Phase 2!**
