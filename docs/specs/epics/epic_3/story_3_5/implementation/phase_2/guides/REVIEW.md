# Phase 2: Code Review Guide - Homepage Structure

**Story**: 3.5 - Homepage Implementation
**Phase**: 2 of 3

---

## Review Focus Areas

Cette phase assemble les composants atomiques en une page fonctionnelle. La review doit verifier:

1. **Data Fetching**: Utilisation correcte de Payload Local API
2. **Composition**: Assemblage correct des composants
3. **SEO**: Metadata correctes et completes
4. **Performance**: Optimisations images, pas de re-renders inutiles

---

## Review Checklist by Commit

### Commit 1: FeaturedArticleCard

#### Data & Props
- [ ] Interface `Article` complete et correcte
- [ ] Props bien typees
- [ ] Fallbacks pour valeurs optionnelles

#### Layout & Design
- [ ] Image avec `priority` et `sizes="100vw"`
- [ ] Aspect ratio maintenu (`aspect-video`)
- [ ] Max height sur l'image (`max-h-[400px]`)
- [ ] Hover effects conformes a la spec

#### SEO
- [ ] Title dans un `<h1>` (unique sur la page)
- [ ] Title linkable vers article

#### Accessibility
- [ ] `aria-hidden` sur icones et separateurs decoratifs
- [ ] Alt text sur l'image

#### Code Quality
```typescript
// GOOD: Image avec priority pour LCP
<Image
  priority
  sizes="100vw"
  // ...
/>

// BAD: Pas de priority sur le hero
<Image
  sizes="100vw"
  // ...
/>
```

---

### Commit 2: ArticleGrid

#### Grid Layout
- [ ] Classes responsive correctes
- [ ] Gaps responsifs (`gap-4 sm:gap-5 lg:gap-6`)
- [ ] Colonnes responsives (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)

#### Comportement
- [ ] Return `null` si pas d'articles
- [ ] Title par defaut via i18n
- [ ] Title customizable via prop

#### Accessibility
- [ ] `aria-labelledby` sur la section
- [ ] `id` correspondant sur le titre

#### Code Quality
```typescript
// GOOD: Section avec aria-labelledby
<section aria-labelledby="recent-articles-heading">
  <h2 id="recent-articles-heading">{title}</h2>
  ...
</section>

// BAD: Section sans accessibilite
<section>
  <h2>{title}</h2>
  ...
</section>
```

---

### Commit 3: EmptyState

#### Authentication Check
- [ ] Utilise `cookies()` de `next/headers`
- [ ] Check du cookie `payload-token`
- [ ] CTA conditionnel sur l'auth

#### Security Review
- [ ] Le check cote serveur est fiable
- [ ] Pas de leak d'info si non authentifie

#### Accessibility
- [ ] `aria-labelledby` sur la section
- [ ] `aria-hidden` sur les icones decoratives

#### Code Snippets to Verify
```typescript
// GOOD: Check cookie cote serveur
const cookieStore = await cookies()
const isAuthenticated = cookieStore.has('payload-token')

// BAD: Check cote client (pas secure)
const isAuthenticated = document.cookie.includes('payload-token')
```

```typescript
// GOOD: CTA conditionnel
{isAuthenticated && (
  <Button asChild>
    <Link href="/admin/collections/posts/create">
      {t('cta')}
    </Link>
  </Button>
)}

// BAD: CTA toujours visible
<Button asChild>
  <Link href="/admin/collections/posts/create">
    {t('cta')}
  </Link>
</Button>
```

---

### Commit 4: Homepage Page

#### Data Fetching
- [ ] Utilise Payload Local API (`getPayload`)
- [ ] Config chargee correctement
- [ ] Query bien formee

#### Query Validation
```typescript
// GOOD: Query complete et optimisee
const { docs: articles } = await payload.find({
  collection: 'posts',
  locale,            // Localized content
  limit: 7,          // 1 featured + 6 grid
  sort: '-publishedAt', // Most recent first
  where: {
    _status: { equals: 'published' }, // Only published
  },
  depth: 2,          // Include relations
})

// BAD: Query incomplete
const { docs } = await payload.find({
  collection: 'posts',
})
```

#### Page Structure
- [ ] Empty state si 0 articles
- [ ] Destructuring correct `[featured, ...recent]`
- [ ] Condition sur `recentArticles.length`
- [ ] CTA vers Hub present

#### Static Rendering
- [ ] `setRequestLocale(locale)` appele
- [ ] Import de `next-intl/server`

#### Code Quality
```typescript
// GOOD: Destructuring avec spread
const [featuredArticle, ...recentArticles] = articles

// BAD: Index access
const featuredArticle = articles[0]
const recentArticles = articles.slice(1)
```

---

### Commit 5: SEO Metadata

#### Metadata Completeness
- [ ] Title localise (FR/EN)
- [ ] Description localisee (FR/EN)
- [ ] Canonical URL
- [ ] hreflang alternates
- [ ] OpenGraph data
- [ ] Twitter card data

#### URL Structure
- [ ] Canonical: `https://sebc.dev/${locale}`
- [ ] hreflang fr: `/fr`
- [ ] hreflang en: `/en`

#### Type Safety
```typescript
// GOOD: Record type pour les traductions
const titles: Record<string, string> = {
  fr: 'Accueil | sebc.dev',
  en: 'Home | sebc.dev',
}
const title = titles[locale] || titles.fr

// BAD: Type unsafe
const titles = {
  fr: 'Accueil | sebc.dev',
  en: 'Home | sebc.dev',
}
const title = titles[locale] // Possible undefined
```

#### OpenGraph Verification
```typescript
// GOOD: OpenGraph complet
openGraph: {
  title,
  description,
  url: `https://sebc.dev/${locale}`,
  siteName: 'sebc.dev',
  locale: locale === 'en' ? 'en_US' : 'fr_FR',
  type: 'website',
}
```

---

## Performance Review

### Image Optimization
- [ ] `next/image` utilise partout
- [ ] `priority` sur le hero image
- [ ] `sizes` attribute correct
- [ ] Pas d'images non optimisees

### Bundle Size
- [ ] Imports optimises (pas d'import de tout lucide-react)
- [ ] Barrel export utilise correctement

### Data Fetching
- [ ] Une seule query Payload
- [ ] `depth: 2` suffisant mais pas excessif
- [ ] Pas de waterfalls

---

## Security Review

### Authentication
- [ ] Cookie check cote serveur uniquement
- [ ] Pas d'info sensible dans le client

### Data Exposure
- [ ] Seuls les articles publies sont fetches
- [ ] Pas de drafts exposes

### Links
- [ ] Pas de liens externes non securises
- [ ] Admin link correct (`/admin/...`)

---

## Common Issues

### Issue: H1 duplice

```typescript
// BAD: H1 dans FeaturedArticleCard ET EmptyState visible simultanement
// Solution: Impossible car mutuellement exclusifs (if/else)
```

### Issue: Missing locale in URLs

```typescript
// BAD: Missing locale prefix
<Link href="/articles">

// GOOD: Locale prefix
<Link href={`/${locale}/articles`}>
```

### Issue: Hardcoded strings

```typescript
// BAD: Hardcoded
<h2>Articles recents</h2>

// GOOD: i18n
const t = await getTranslations('homepage')
<h2>{t('recentArticles')}</h2>
```

---

## Approval Criteria

### Must Have
- [ ] Build passe (`pnpm build`)
- [ ] Type check passe (`pnpm exec tsc --noEmit`)
- [ ] Lint passe (`pnpm lint`)
- [ ] Homepage fonctionne en FR et EN
- [ ] Empty state fonctionne
- [ ] Metadata correctes

### Should Have
- [ ] Tests unitaires pour EmptyState
- [ ] Tests manuels documentes

### Nice to Have
- [ ] Performance audit
- [ ] Lighthouse score
