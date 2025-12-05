# Phase 1: Code Review Guide - Composants Atomiques

**Story**: 3.5 - Homepage Implementation
**Phase**: 1 of 3

---

## Review Philosophy

Cette phase cree les composants atomiques reusables. La review doit s'assurer que:
1. Les composants sont generiques et reusables
2. Les types sont stricts et bien definis
3. L'accessibilite est integree des le depart
4. Les styles suivent le design system

---

## Review Checklist by Commit

### Commit 1: i18n Keys

#### What to Review
- [ ] **Structure JSON** - Syntaxe valide, pas de trailing commas
- [ ] **Coherence** - Memes cles en FR et EN
- [ ] **Placeholders** - Format `{variable}` correct
- [ ] **Contexte** - Textes adaptes au contexte d'utilisation

#### Questions to Ask
1. Les textes sont-ils clairs et concis?
2. Les placeholders ont-ils des noms descriptifs?
3. Y a-t-il des cles manquantes qui seront necessaires?

#### Red Flags
- Textes trop longs (> 50 chars pour les labels)
- Traductions litterales qui ne fonctionnent pas dans l'autre langue
- Cles dupliquees ou mal nommees

---

### Commit 2: CategoryBadge

#### What to Review

**Types**
- [ ] Interface `Category` complete et precise
- [ ] Props bien typees avec defaults explicites
- [ ] Pas de `any` ou types trop larges

**Implementation**
- [ ] Couleur dynamique via style inline (pas de classes dynamiques)
- [ ] `aria-hidden` sur l'icone decorative
- [ ] `clickable` prop avec comportement correct
- [ ] Utilisation de `cn()` pour merge des classes

**Accessibility**
- [ ] Lien a un texte accessible (titre de categorie)
- [ ] Hover state visible
- [ ] Focus state visible (inherited from Badge)

#### Code Snippets to Verify

```typescript
// GOOD: Couleur via style inline
style={category.color ? { backgroundColor: `${category.color}20` } : {}}

// BAD: Classes dynamiques (ne fonctionne pas avec Tailwind)
className={`bg-[${category.color}]`}
```

```typescript
// GOOD: Icon decorative cachee
{category.icon && <span aria-hidden="true">{category.icon}</span>}

// BAD: Icon sans aria-hidden
{category.icon && <span>{category.icon}</span>}
```

#### Questions to Ask
1. Le composant est-il reusable dans d'autres contextes?
2. Que se passe-t-il si `category.color` est undefined?
3. Le hover est-il suffisamment visible?

---

### Commit 3: ComplexityBadge & TagPill

#### What to Review

**ComplexityBadge**
- [ ] Type union strict pour `Complexity`
- [ ] Configuration centralisee (COMPLEXITY_CONFIG)
- [ ] Couleurs respectent la spec (green/orange/red)
- [ ] Traductions utilisees correctement

**TagPill**
- [ ] `stopPropagation` pour eviter le click parent
- [ ] Navigation vers Hub avec bon format de query param
- [ ] Style coherent avec autres badges

#### Code Snippets to Verify

```typescript
// GOOD: Type union strict
type Complexity = 'beginner' | 'intermediate' | 'advanced'

// BAD: Type trop large
type Complexity = string
```

```typescript
// GOOD: stopPropagation
onClick={(e) => e.stopPropagation()}

// BAD: Pas de stopPropagation (click cascade vers la carte parent)
```

#### Accessibility Check
- [ ] Couleurs ont suffisamment de contraste (WCAG AA)
- [ ] Texte lisible sur fond colore

---

### Commit 4: RelativeDate

#### What to Review

**Client Component**
- [ ] `'use client'` directive presente
- [ ] Pas d'imports server-only

**Semantique**
- [ ] Element `<time>` utilise
- [ ] Attribut `dateTime` au format ISO 8601
- [ ] Attribut `title` avec date complete

**Localisation**
- [ ] `useFormatter` de next-intl utilise
- [ ] Fonctionne en FR et EN

#### Code Snippets to Verify

```typescript
// GOOD: Element time semantique
<time dateTime={dateObj.toISOString()} title={fullDate}>
  {relativeTime}
</time>

// BAD: Span sans semantique
<span>{relativeTime}</span>
```

#### Questions to Ask
1. Que se passe-t-il avec des dates invalides?
2. Le format de date est-il coherent avec le reste du site?

---

### Commit 5: ArticleCard

#### What to Review

**Composition**
- [ ] Utilise tous les composants atomiques precedents
- [ ] Import paths corrects (barrel export)
- [ ] Props passees correctement aux enfants

**Image Handling**
- [ ] `next/image` utilise
- [ ] `sizes` attribute present et correct
- [ ] `alt` text toujours present (fallback sur titre)
- [ ] Aspect ratio maintenu (`aspect-video`)

**Hover Effects**
- [ ] Scale sur la carte (1.02)
- [ ] Scale sur l'image (1.05)
- [ ] Shadow sur hover
- [ ] Transitions fluides (200ms)

**Accessibility**
- [ ] Element `<article>` semantique
- [ ] `focus-within:ring` pour navigation clavier
- [ ] Ordre de lecture logique

#### Code Snippets to Verify

```typescript
// GOOD: sizes attribute pour responsive images
sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"

// BAD: Pas de sizes (images trop grandes chargees)
```

```typescript
// GOOD: Alt text avec fallback
alt={article.coverImage.alt || article.title}

// BAD: Alt vide
alt=""
```

```typescript
// GOOD: Focus ring pour accessibilite
'focus-within:ring-2 focus-within:ring-primary'

// BAD: Pas de focus visible
```

#### Layout Check
- [ ] `line-clamp-2` sur titre et extrait
- [ ] Tags limites a 3
- [ ] Espacement coherent (`space-y-3`)

---

## Common Review Patterns

### Type Safety

```typescript
// Pattern a verifier: Props interface bien definie
interface ArticleCardProps {
  article: Article  // Type complet, pas Partial<Article>
  locale: string    // Pas 'fr' | 'en', utiliser string pour flexibilite
  className?: string // Optionnel avec ?
}
```

### Accessibility Patterns

```typescript
// Pattern: Decorative elements hidden
<span aria-hidden="true">icon</span>

// Pattern: Interactive elements focusable
<Link className="focus:ring-2 focus:ring-primary">

// Pattern: Semantic HTML
<article><h3>{title}</h3></article>
```

### Style Patterns

```typescript
// Pattern: Utiliser cn() pour merge
className={cn('base-classes', className)}

// Pattern: Transitions fluides
'transition-all duration-200'

// Pattern: Hover states
'hover:shadow-lg hover:scale-[1.02]'
```

---

## Review Workflow

### Before Review
1. Pull la branche
2. `pnpm install`
3. `pnpm exec tsc --noEmit`
4. `pnpm lint`
5. `pnpm build`

### During Review
1. Lire le diff commit par commit
2. Verifier chaque point de la checklist
3. Tester manuellement si possible
4. Noter les questions/suggestions

### Review Comments

**Approval**:
- Tous les checks passent
- Code suit les patterns etablis
- Pas de problemes d'accessibilite

**Request Changes**:
- Type safety compromise
- Accessibilite manquante
- Build casse
- Logique incorrecte

**Comment**:
- Suggestions d'amelioration non-bloquantes
- Questions de clarification
- Patterns alternatifs a considerer

---

## Post-Review Checklist

Avant d'approuver la phase complete:

- [ ] Tous les 5 commits reviewes
- [ ] `pnpm exec tsc --noEmit` passe
- [ ] `pnpm lint` passe
- [ ] `pnpm build` passe
- [ ] Composants fonctionnent visuellement (si testable)
- [ ] Pas de regressions dans le reste de l'app
