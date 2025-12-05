# Phase 2: Validation Checklist - Homepage Structure

**Story**: 3.5 - Homepage Implementation
**Phase**: 2 of 3

---

## Pre-Validation Requirements

- [ ] Phase 1 completee et validee
- [ ] Tous les 5 commits de Phase 2 completes
- [ ] Branche a jour avec main

---

## Build Validation

### TypeScript Compilation

```bash
pnpm exec tsc --noEmit
```

- [ ] **PASS** - Aucune erreur TypeScript
- [ ] Pas de `any` implicites dans les nouveaux fichiers

### ESLint

```bash
pnpm lint
```

- [ ] **PASS** - Aucune erreur lint

### Next.js Build

```bash
pnpm build
```

- [ ] **PASS** - Build complete sans erreur
- [ ] Pas de warnings critiques

---

## Component Validation

### FeaturedArticleCard

| Check | Status |
|-------|--------|
| Affiche l'image de couverture | [ ] |
| Image avec `priority` | [ ] |
| Title en `<h1>` | [ ] |
| CategoryBadge present | [ ] |
| ComplexityBadge present | [ ] |
| RelativeDate present | [ ] |
| Reading time affiche | [ ] |
| Tags affiches (max 5) | [ ] |
| CTA "Lire l'article" present | [ ] |
| Hover effect sur carte | [ ] |
| Hover effect sur image | [ ] |
| Link vers article fonctionne | [ ] |

### ArticleGrid

| Check | Status |
|-------|--------|
| Section title affiche | [ ] |
| Grille 1 col sur mobile | [ ] |
| Grille 2 cols sur tablet | [ ] |
| Grille 3 cols sur desktop | [ ] |
| Gaps corrects par breakpoint | [ ] |
| ArticleCards rendues | [ ] |
| Return null si vide | [ ] |

### EmptyState

| Check | Status |
|-------|--------|
| Icone affichee | [ ] |
| Title affiche | [ ] |
| Description affichee | [ ] |
| CTA cache si non authentifie | [ ] |
| CTA visible si authentifie | [ ] |
| CTA link correct vers admin | [ ] |

### Homepage Page

| Check | Status |
|-------|--------|
| Data fetch fonctionne | [ ] |
| Featured article affiche | [ ] |
| Recent articles grid affiche | [ ] |
| Empty state si 0 articles | [ ] |
| CTA vers Hub affiche | [ ] |
| CTA link correct | [ ] |

---

## SEO Validation

### Metadata Check

Ouvrir les DevTools (F12) > Elements > `<head>`

| FR (`/fr`) | Status |
|------------|--------|
| `<title>Accueil \| sebc.dev</title>` | [ ] |
| `<meta name="description">` correct | [ ] |
| `<link rel="canonical">` = `https://sebc.dev/fr` | [ ] |
| `<link rel="alternate" hreflang="en">` present | [ ] |
| `<link rel="alternate" hreflang="fr">` present | [ ] |
| `<meta property="og:title">` present | [ ] |
| `<meta property="og:description">` present | [ ] |
| `<meta property="og:locale">` = `fr_FR` | [ ] |
| `<meta name="twitter:card">` present | [ ] |

| EN (`/en`) | Status |
|------------|--------|
| `<title>Home \| sebc.dev</title>` | [ ] |
| `<meta name="description">` correct | [ ] |
| `<link rel="canonical">` = `https://sebc.dev/en` | [ ] |
| `<meta property="og:locale">` = `en_US` | [ ] |

---

## Functional Testing

### Scenario 1: Homepage with Articles

1. Avoir au moins 7 articles publies dans Payload
2. Visiter `/fr`

- [ ] Featured article (1er) affiche en grand
- [ ] Grid d'articles (6 suivants) affiche
- [ ] CTA "Voir tous les articles" visible
- [ ] Click sur featured -> navigation vers article
- [ ] Click sur grid card -> navigation vers article
- [ ] Click sur CTA -> navigation vers `/fr/articles`

### Scenario 2: Homepage Empty

1. Supprimer tous les articles OU utiliser DB vide
2. Visiter `/fr`

- [ ] Empty state affiche
- [ ] Message "Bienvenue sur sebc.dev !" visible
- [ ] Message "Aucun article..." visible
- [ ] CTA "Creer un article" NON visible (pas connecte)

### Scenario 3: Empty State with Auth

1. Se connecter a `/admin`
2. Visiter `/fr` (avec DB vide)

- [ ] CTA "Creer un article" VISIBLE
- [ ] Click sur CTA -> navigation vers `/admin/collections/posts/create`

### Scenario 4: Multilingual

1. Visiter `/fr`
2. Verifier le contenu en francais
3. Visiter `/en`
4. Verifier le contenu en anglais

- [ ] Titles traduits (FR/EN)
- [ ] Section titles traduits
- [ ] CTA buttons traduits
- [ ] Metadata traduits (verifier `<head>`)

---

## Responsive Testing

### Mobile (<768px)

- [ ] Featured card: image pleine largeur
- [ ] Featured card: title readable
- [ ] Grid: 1 colonne
- [ ] Grid: gaps 16px
- [ ] CTA: pleine largeur ou centre

### Tablet (768-1023px)

- [ ] Featured card: image pleine largeur
- [ ] Grid: 2 colonnes
- [ ] Grid: gaps 20px

### Desktop (>=1024px)

- [ ] Featured card: image max-h 400px
- [ ] Grid: 3 colonnes
- [ ] Grid: gaps 24px
- [ ] CTA: centre

---

## Accessibility Testing

### Structure HTML

- [ ] Un seul `<h1>` sur la page
- [ ] `<h2>` pour "Articles recents"
- [ ] `<main>` element present
- [ ] `<section>` elements avec `aria-labelledby`
- [ ] `<article>` pour les cartes

### Keyboard Navigation

1. Tab a travers la page

- [ ] Tous les liens focusables
- [ ] Focus visible sur tous les elements
- [ ] Ordre de tab logique

### Screen Reader

1. Utiliser un screen reader (NVDA/VoiceOver)

- [ ] Structure de page annoncee
- [ ] Headings hierarchy correcte
- [ ] Images ont alt text
- [ ] Liens ont texte descriptif

### axe DevTools

1. Installer extension axe DevTools
2. Scanner la page

- [ ] 0 violations critiques
- [ ] 0 violations serieuses
- [ ] Warnings examines

---

## Performance Check

### Lighthouse

```bash
# Ou via Chrome DevTools > Lighthouse
```

| Metric | Target | Actual | Pass |
|--------|--------|--------|------|
| Performance | >80 | [ ] | [ ] |
| Accessibility | >90 | [ ] | [ ] |
| Best Practices | >90 | [ ] | [ ] |
| SEO | >90 | [ ] | [ ] |

### Core Web Vitals

| Metric | Target | Status |
|--------|--------|--------|
| LCP | <2.5s | [ ] |
| FID/INP | <100ms | [ ] |
| CLS | <0.1 | [ ] |

### Image Loading

- [ ] Featured image avec `priority` (preload)
- [ ] Grid images lazy loaded
- [ ] Pas d'images non optimisees

---

## Integration Validation

### Payload Connection

```bash
# Verifier les logs du serveur
pnpm dev
# Chercher: "Connected to database"
```

- [ ] Connection Payload OK
- [ ] Query posts fonctionne
- [ ] Relations chargees (depth 2)

### Cookie Authentication

```bash
# Dans DevTools > Application > Cookies
```

- [ ] `payload-token` set apres login
- [ ] `payload-token` absent si logout
- [ ] EmptyState CTA reagit au cookie

---

## Code Quality Check

### File Structure

```
src/components/
├── articles/
│   ├── index.ts                  [ ] Exports corrects
│   ├── CategoryBadge.tsx         [ ] (Phase 1)
│   ├── ComplexityBadge.tsx       [ ] (Phase 1)
│   ├── TagPill.tsx               [ ] (Phase 1)
│   ├── ArticleCard.tsx           [ ] (Phase 1)
│   ├── FeaturedArticleCard.tsx   [ ] NEW
│   └── ArticleGrid.tsx           [ ] NEW
├── RelativeDate.tsx              [ ] (Phase 1)
└── EmptyState.tsx                [ ] NEW
```

### Imports

- [ ] Barrel export fonctionne
- [ ] Pas d'imports circulaires
- [ ] Imports optimises

---

## Sign-Off

### Developer

- [ ] Tous les checks ci-dessus passent
- [ ] Tests manuels effectues sur FR et EN
- [ ] Tests manuels effectues sur mobile/tablet/desktop

### Reviewer

- [ ] Code review completee
- [ ] Pas de blockers
- [ ] Approuve pour merge

---

## Phase Completion

### Final Status

| Category | Status |
|----------|--------|
| TypeScript | [ ] PASS |
| ESLint | [ ] PASS |
| Build | [ ] PASS |
| Functional | [ ] PASS |
| SEO | [ ] PASS |
| Responsive | [ ] PASS |
| Accessibility | [ ] PASS |
| Performance | [ ] PASS |

### Ready for Phase 3?

- [ ] **OUI** - Tous les checks passent
- [ ] **NON** - Issues a resoudre:
  - Issue 1: ___
  - Issue 2: ___

### Notes

```
[Ajouter notes sur decisions/issues]
```
