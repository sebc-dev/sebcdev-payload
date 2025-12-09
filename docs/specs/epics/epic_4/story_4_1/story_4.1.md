# Story 4.1 - Rendu Article & MDX

**Epic**: Epic 4 - Article Reading Experience
**Status**: 📋 PLANNING
**Created**: 2025-12-09

---

## 📖 Story Description

**En tant que** Lecteur, **je veux** voir le contenu riche (code syntax-highlighted, images, mise en forme) s'afficher correctement via les React Server Components, **afin de** lire les articles techniques confortablement.

---

## 🎯 Objectives

1. Créer la page article dynamique `/[locale]/articles/[slug]`
2. Implémenter le rendu du contenu Lexical JSON vers React components
3. Ajouter la syntax highlighting pour les blocs de code (compatible Edge/Workers)
4. Supporter les images inline avec optimisation Next.js
5. Appliquer la typographie et le styling conforme au Design System

---

## ✅ Acceptance Criteria

### Fonctionnels

- [ ] **AC1**: La route `/[locale]/articles/[slug]` affiche un article complet avec titre, contenu, métadonnées
- [ ] **AC2**: Le contenu Lexical (richText) est rendu correctement avec tous les blocs supportés (paragraphes, headings, listes, citations, code)
- [ ] **AC3**: Les blocs de code affichent la syntax highlighting appropriée selon le langage
- [ ] **AC4**: Les images dans le contenu sont rendues avec `next/image` et optimisées
- [ ] **AC5**: La page affiche les métadonnées de l'article (catégorie, tags, temps de lecture, date, complexité)
- [ ] **AC6**: La page est accessible en FR et EN avec contenu localisé
- [ ] **AC7**: Un article non trouvé retourne une page 404 appropriée

### Non-fonctionnels

- [ ] **AC8**: LCP < 2.5s sur mobile 4G (ENF2)
- [ ] **AC9**: CLS < 0.1 (pas de décalage au chargement des images/code)
- [ ] **AC10**: Score Accessibilité Lighthouse = 100 (WCAG 2.1 AA)
- [ ] **AC11**: Compatible Cloudflare Workers (pas de dépendances Node.js natives)

---

## 📋 Technical Requirements

### Stack Technique

- **Framework**: Next.js 15 App Router (React Server Components)
- **CMS**: Payload CMS 3.x avec Lexical richText editor
- **Styling**: Tailwind CSS 4 + Design System existant
- **Syntax Highlighting**: Shiki (compatible Edge) ou solution WASM
- **Images**: next/image avec Cloudflare Images loader

### Dependencies Existantes

- `@payloadcms/richtext-lexical`: 3.63.0 (déjà installé)
- Collection `Articles` configurée avec champ `content` (richText, localized)
- Design System: shadcn/ui, couleurs, typographie (JetBrains Mono pour code)

### Contraintes Cloudflare Workers

- Pas de modules Node.js natifs (C++ bindings)
- Bundle size < 2 Mo recommandé
- Compatible `nodejs_compat` flag de workerd

---

## 🔗 Dependencies

### Story Dependencies

- **Epic 2 (CMS Core)**: Collection Articles avec Lexical editor (✅ Complété)
- **Epic 3 (Frontend Core)**: Design System, Layout, Routing i18n (✅ Complété)

### External Dependencies

- Shiki ou alternative WASM pour syntax highlighting
- Payload Lexical richText serializer

---

## 📐 Technical Design

### Route Structure

```
src/app/[locale]/(frontend)/articles/[slug]/
├── page.tsx          # Server Component - fetches article & renders
├── not-found.tsx     # 404 page for missing articles
└── loading.tsx       # Loading skeleton (optional)
```

### Key Components

1. **ArticlePage** (RSC): Fetches article by slug, renders layout
2. **ArticleContent**: Serializes Lexical JSON to React components
3. **CodeBlock**: Renders code with syntax highlighting
4. **ArticleHeader**: Title, metadata, featured image
5. **ArticleFooter**: Related articles, tags navigation

### Data Flow

```
1. Request: /fr/articles/mon-article
2. Next.js extracts: locale=fr, slug=mon-article
3. Server Component fetches: payload.find({ collection: 'articles', where: { slug } })
4. Lexical JSON → React components via serializer
5. Syntax highlighting applied at build/render time
6. HTML streamed to client
```

---

## 📊 Estimated Metrics

| Metric | Estimate |
|--------|----------|
| Complexity | 🟡 Medium |
| Duration | 5-7 days |
| Commits | ~15-20 |
| Files | ~12-15 new, ~3-5 modified |
| Test Coverage | >80% |

---

## 🔗 References

- PRD: `docs/specs/PRD.md` (Story 4.1, EF2)
- UX/UI Spec: `docs/specs/UX_UI_Spec.md` (Section 5.2 - Flux Lecture Article)
- Epic Tracking: `docs/specs/epics/epic_4/EPIC_TRACKING.md`
- Payload Lexical Docs: https://payloadcms.com/docs/rich-text/lexical
- Shiki Docs: https://shiki.style/

---

**Story Created**: 2025-12-09
**Last Updated**: 2025-12-09
