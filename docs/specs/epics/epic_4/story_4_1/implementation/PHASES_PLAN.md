# Story 4.1 - Phases Implementation Plan

**Story**: Rendu Article & MDX
**Epic**: Epic 4 - Article Reading Experience
**Created**: 2025-12-09
**Status**: 📋 PLANNING

---

## 📖 Story Overview

### Original Story Specification

**Location**: `docs/specs/epics/epic_4/story_4_1/story_4.1.md`

**Story Objective**: Permettre aux lecteurs de consulter les articles techniques avec un rendu riche du contenu Lexical (code syntax-highlighted, images, mise en forme), le tout via React Server Components pour une performance optimale sur Cloudflare Workers.

**Acceptance Criteria**:

- La route `/[locale]/articles/[slug]` affiche un article complet
- Le contenu Lexical (richText) est rendu avec tous les blocs supportés
- Les blocs de code affichent la syntax highlighting appropriée
- Les images sont optimisées via next/image
- La page affiche les métadonnées (catégorie, tags, temps de lecture, etc.)
- Support bilingue FR/EN avec contenu localisé
- Page 404 pour articles non trouvés
- LCP < 2.5s, CLS < 0.1, Accessibilité 100

**User Value**: Les développeurs (mid-level, juniors, indie hackers) pourront lire des articles techniques avec un confort optimal : code lisible et coloré, navigation fluide, temps de chargement minimal.

---

## 🎯 Phase Breakdown Strategy

### Why 5 Phases?

This story is decomposed into **5 atomic phases** based on:

✅ **Technical dependencies**: La page article (Phase 1) doit exister avant le rendu Lexical (Phase 2), qui doit exister avant la syntax highlighting (Phase 3)
✅ **Risk mitigation**: La syntax highlighting sur Edge est le risque principal, isolé en Phase 3
✅ **Incremental value**: Chaque phase livre une fonctionnalité testable indépendamment
✅ **Team capacity**: Phases de 1-2 jours, adaptées au développement solo
✅ **Testing strategy**: Chaque phase peut être testée avant de passer à la suivante

### Atomic Phase Principles

Each phase follows these principles:

- **Independent**: Can be implemented and tested separately
- **Deliverable**: Produces tangible, working functionality
- **Sized appropriately**: 1-2 days of work per phase
- **Low coupling**: Minimal dependencies on other phases
- **High cohesion**: All work in phase serves single objective

### Implementation Approach

```
[Phase 1] → [Phase 2] → [Phase 3] → [Phase 4] → [Phase 5]
   ↓           ↓           ↓           ↓           ↓
 Route &    Lexical     Syntax      Images &   SEO &
 Layout     Render    Highlight    Styling    Tests
```

---

## 📦 Phases Summary

### Phase 1: Article Page Route & Basic Layout

**Objective**: Créer la route dynamique `/[locale]/articles/[slug]` avec le layout de base et le fetch de données Payload.

**Scope**:

- Route dynamique Next.js App Router
- Server Component avec fetch Payload par slug
- Layout article de base (header, content area, footer)
- Page 404 pour articles non trouvés
- Métadonnées de base (titre, excerpt)

**Dependencies**:

- None (Foundation phase)

**Key Deliverables**:

- [ ] Route `/[locale]/articles/[slug]/page.tsx`
- [ ] Composant `ArticleHeader` (titre, date, catégorie, temps de lecture)
- [ ] Page `not-found.tsx` pour 404
- [ ] Fetch article par slug avec gestion d'erreur
- [ ] Layout responsive de base

**Files Affected** (~8 files):

- `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` (new)
- `src/app/[locale]/(frontend)/articles/[slug]/not-found.tsx` (new)
- `src/components/articles/ArticleHeader.tsx` (new)
- `src/components/articles/ArticleFooter.tsx` (new)
- `src/components/articles/index.ts` (modified - exports)
- `src/lib/payload/articles.ts` (new - fetch utilities)
- `messages/fr.json` (modified - translations)
- `messages/en.json` (modified - translations)

**Estimated Complexity**: 🟢 Low

**Estimated Duration**: 1-1.5 days (4-5 commits)

**Risk Level**: 🟢 Low

**Success Criteria**:

- [ ] Route accessible via URL directe
- [ ] Article affiché avec titre et métadonnées basiques
- [ ] 404 retourné pour slug inexistant
- [ ] Build Next.js réussit sans erreur
- [ ] Tests: Route unit tests + 404 handling

**Technical Notes**:

- Utiliser `notFound()` de Next.js pour le 404
- Le contenu richText sera affiché en JSON brut temporairement
- Réutiliser les composants existants (CategoryBadge, ComplexityBadge, etc.)

---

### Phase 2: Lexical Content Rendering

**Objective**: Implémenter le serializer Lexical → React pour convertir le JSON du CMS en composants React rendus.

**Scope**:

- Serializer Lexical JSON vers React components
- Support des nodes de base (paragraph, heading, list, quote, link)
- Composant `RichText` générique
- Styling typographique pour le contenu

**Dependencies**:

- Phase 1 (route et layout en place)

**Key Deliverables**:

- [ ] Composant `RichText` principal
- [ ] Serializer pour nodes Lexical de base
- [ ] Support headings (h1-h6) avec ancres
- [ ] Support paragraphes, listes (ul/ol), citations
- [ ] Support liens (internal/external)
- [ ] Styling prose avec Tailwind typography

**Files Affected** (~10 files):

- `src/components/richtext/RichText.tsx` (new)
- `src/components/richtext/serialize.tsx` (new)
- `src/components/richtext/nodes/Heading.tsx` (new)
- `src/components/richtext/nodes/Paragraph.tsx` (new)
- `src/components/richtext/nodes/List.tsx` (new)
- `src/components/richtext/nodes/Quote.tsx` (new)
- `src/components/richtext/nodes/Link.tsx` (new)
- `src/components/richtext/index.ts` (new)
- `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` (modified)
- `src/app/globals.css` (modified - prose styles)

**Estimated Complexity**: 🟡 Medium

**Estimated Duration**: 1.5-2 days (5-6 commits)

**Risk Level**: 🟡 Medium

**Risk Factors**:

- Structure JSON Lexical peut varier selon la config Payload
- Handling des nodes imbriqués (nested lists, etc.)

**Mitigation Strategies**:

- Étudier la structure JSON générée par Payload Lexical
- Implémenter un fallback pour nodes non reconnus
- Tester avec contenu réel du CMS

**Success Criteria**:

- [ ] Contenu paragraphes rendu correctement
- [ ] Headings avec ancres cliquables
- [ ] Listes ordonnées et non-ordonnées
- [ ] Citations stylées
- [ ] Liens internes et externes fonctionnels
- [ ] Tests: Snapshot tests pour chaque node type

**Technical Notes**:

- Utiliser `@payloadcms/richtext-lexical` comme référence pour la structure JSON
- Les blocs de code seront rendus en texte brut (Phase 3 ajoutera highlighting)
- Préparer les ancres pour la TOC de Story 4.2

---

### Phase 3: Code Block Syntax Highlighting

**Objective**: Ajouter la syntax highlighting pour les blocs de code avec une solution compatible Cloudflare Workers (Edge runtime).

**Scope**:

- Composant `CodeBlock` avec syntax highlighting
- Intégration Shiki (build-time) ou solution WASM
- Support des langages courants (JS, TS, Python, Go, Rust, Bash, JSON, etc.)
- Thème de couleurs cohérent avec le Design System (dark mode)
- Copie du code en un clic

**Dependencies**:

- Phase 2 (serializer Lexical en place)

**Key Deliverables**:

- [ ] Composant `CodeBlock` avec highlighting
- [ ] Configuration Shiki ou alternative
- [ ] Thème de couleurs personnalisé (dark mode)
- [ ] Bouton "Copy" fonctionnel
- [ ] Indicateur de langage
- [ ] Support inline code (backticks)

**Files Affected** (~8 files):

- `src/components/richtext/nodes/CodeBlock.tsx` (new)
- `src/components/richtext/nodes/InlineCode.tsx` (new)
- `src/components/richtext/shiki-config.ts` (new)
- `src/components/richtext/serialize.tsx` (modified)
- `src/components/ui/copy-button.tsx` (new)
- `package.json` (modified - add shiki)
- `tailwind.config.ts` (modified - code theme tokens)
- `src/app/globals.css` (modified - code styles)

**Estimated Complexity**: 🟡 Medium-High

**Estimated Duration**: 1.5-2 days (4-5 commits)

**Risk Level**: 🟡 Medium

**Risk Factors**:

- Compatibilité Shiki avec Cloudflare Workers
- Bundle size avec les grammaires de langages
- Performance du highlighting

**Mitigation Strategies**:

- Utiliser Shiki avec `shiki/bundle/web` (optimisé pour Edge)
- Limiter les langages inclus au strict nécessaire
- Build-time highlighting si runtime impossible
- Fallback vers `<pre><code>` non stylé si erreur

**Success Criteria**:

- [ ] Code blocks avec coloration syntaxique
- [ ] Minimum 10 langages supportés
- [ ] Thème cohérent dark mode
- [ ] Bouton copier fonctionnel
- [ ] Pas d'erreur sur Cloudflare Workers
- [ ] Bundle size acceptable (< 500KB ajouté)
- [ ] Tests: Visual regression + copy functionality

**Technical Notes**:

- Shiki supporte le highlighting build-time via `getHighlighter`
- Utiliser `shiki/bundle/web` pour le bundle minimal
- JetBrains Mono comme font (déjà dans le Design System)
- Le thème peut être basé sur `github-dark` ou `one-dark-pro`

---

### Phase 4: Image Rendering & Advanced Styling

**Objective**: Implémenter le rendu des images inline avec optimisation Next.js et finaliser le styling typographique de l'article.

**Scope**:

- Node `ImageBlock` pour images Lexical
- Intégration next/image avec Cloudflare loader
- Captions et alt text
- Styling final du contenu (espacements, max-width lecture optimale)
- Featured image en hero

**Dependencies**:

- Phase 2 (serializer en place)
- Phase 3 (styling de base établi)

**Key Deliverables**:

- [ ] Composant `ImageBlock` avec next/image
- [ ] Support captions et attributions
- [ ] Featured image en hero (pleine largeur)
- [ ] Largeur de lecture optimale (~65ch)
- [ ] Spacing et rythme vertical harmonieux
- [ ] Responsive images (mobile/tablet/desktop)

**Files Affected** (~7 files):

- `src/components/richtext/nodes/ImageBlock.tsx` (new)
- `src/components/richtext/serialize.tsx` (modified)
- `src/components/articles/ArticleHero.tsx` (new)
- `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` (modified)
- `src/app/globals.css` (modified - article prose styles)
- `next.config.ts` (modified - image domains if needed)
- `src/lib/cloudflare-image-loader.ts` (new or modify existing)

**Estimated Complexity**: 🟢 Low-Medium

**Estimated Duration**: 1-1.5 days (3-4 commits)

**Risk Level**: 🟢 Low

**Success Criteria**:

- [ ] Images rendues avec next/image
- [ ] Captions affichées sous les images
- [ ] Hero image pleine largeur
- [ ] CLS < 0.1 (pas de décalage)
- [ ] Responsive sur tous breakpoints
- [ ] Tests: Image loading + responsive behavior

**Technical Notes**:

- Utiliser les dimensions de l'image Payload pour éviter CLS
- Cloudflare Images loader déjà configuré (vérifier)
- Max-width ~700px pour lecture optimale (UX Spec)

---

### Phase 5: SEO, Metadata & E2E Tests

**Objective**: Finaliser les métadonnées SEO, Open Graph, et valider la story avec des tests E2E complets.

**Scope**:

- Metadata dynamique (title, description, OG tags)
- Structured data JSON-LD (Article schema)
- hreflang pour versions linguistiques
- Tests E2E Playwright
- Performance audit (Lighthouse)

**Dependencies**:

- Phases 1-4 (toutes fonctionnalités en place)

**Key Deliverables**:

- [ ] `generateMetadata` avec OG tags dynamiques
- [ ] JSON-LD Article schema
- [ ] hreflang FR/EN
- [ ] Tests E2E: navigation, rendu, 404
- [ ] Audit Lighthouse (LCP, CLS, Accessibility)
- [ ] Documentation technique

**Files Affected** (~6 files):

- `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` (modified - metadata)
- `src/lib/seo/article-metadata.ts` (new)
- `src/lib/seo/json-ld.ts` (new)
- `tests/e2e/article-page.e2e.spec.ts` (new)
- `tests/e2e/article-404.e2e.spec.ts` (new)
- `docs/specs/epics/epic_4/story_4_1/IMPLEMENTATION_NOTES.md` (new)

**Estimated Complexity**: 🟢 Low-Medium

**Estimated Duration**: 1-1.5 days (4-5 commits)

**Risk Level**: 🟢 Low

**Success Criteria**:

- [ ] OG tags corrects (vérifiables via debugger Facebook/Twitter)
- [ ] JSON-LD valide (Schema.org validator)
- [ ] hreflang correct pour FR/EN
- [ ] Tests E2E passent
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Accessibilité = 100
- [ ] Tests: E2E coverage + Lighthouse CI

**Technical Notes**:

- Utiliser le pattern de metadata de la homepage existante
- JSON-LD type Article avec author, datePublished, etc.
- Playwright tests doivent inclure article avec contenu seedé

---

## 🔄 Implementation Order & Dependencies

### Dependency Graph

```
Phase 1 (Route & Layout)
    ↓
Phase 2 (Lexical Rendering)
    ↓
Phase 3 (Code Highlighting) ─┬─ Phase 4 (Images & Styling)
                             │
                             ↓
                      Phase 5 (SEO & Tests)
```

### Critical Path

**Must follow this order**:

1. Phase 1 → Phase 2 → Phase 3 → Phase 5

**Can be parallelized**:

- Phase 3 and Phase 4 are independent once Phase 2 is complete
- However, for solo development, sequential is recommended

### Blocking Dependencies

**Phase 1 blocks**:

- Phase 2: Route must exist to render content
- All subsequent phases

**Phase 2 blocks**:

- Phase 3: CodeBlock node must be part of serializer
- Phase 4: ImageBlock node must be part of serializer
- Phase 5: Content must render for E2E tests

---

## 📊 Timeline & Resource Estimation

### Overall Estimates

| Metric | Estimate | Notes |
|--------|----------|-------|
| **Total Phases** | 5 | Atomic, independent phases |
| **Total Duration** | 6-8 days | Sequential implementation |
| **Total Commits** | ~20-25 | Across all phases |
| **Total Files** | ~25 new, ~10 modified | Estimated |
| **Test Coverage Target** | >80% | Unit + E2E |

### Per-Phase Timeline

| Phase | Duration | Commits | Start After | Blocks |
|-------|----------|---------|-------------|--------|
| 1. Route & Layout | 1-1.5d | 4-5 | - | Phase 2, 3, 4, 5 |
| 2. Lexical Rendering | 1.5-2d | 5-6 | Phase 1 | Phase 3, 4, 5 |
| 3. Code Highlighting | 1.5-2d | 4-5 | Phase 2 | Phase 5 |
| 4. Images & Styling | 1-1.5d | 3-4 | Phase 2 | Phase 5 |
| 5. SEO & Tests | 1-1.5d | 4-5 | Phase 3, 4 | - |

### Resource Requirements

**Team Composition**:

- 1 developer (full-stack capable)
- Self-review + CI validation

**External Dependencies**:

- Shiki: Syntax highlighting library (npm package)
- Payload Lexical: Already installed
- Test data: Articles avec contenu riche seedés

---

## ⚠️ Risk Assessment

### High-Risk Phases

**Phase 3: Code Highlighting** 🟡

- **Risk**: Shiki ou alternative non compatible avec Cloudflare Workers runtime
- **Impact**: Code blocks sans coloration, expérience dégradée
- **Mitigation**: Utiliser build-time highlighting, ou fallback CSS classes
- **Contingency**: Prism.js avec CSS statique comme alternative minimaliste

### Overall Story Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Shiki Edge incompatibility | Medium | Medium | Build-time highlighting |
| Lexical JSON structure changes | Low | High | Version lock + tests |
| Bundle size bloat | Medium | Low | Tree-shaking + language subset |
| Performance regression | Low | Medium | Lighthouse CI gate |

---

## 🧪 Testing Strategy

### Test Coverage by Phase

| Phase | Unit Tests | Integration Tests | E2E Tests |
|-------|------------|-------------------|-----------|
| 1. Route & Layout | 3-4 tests | 2 tests | - |
| 2. Lexical Rendering | 8-10 tests | 3 tests | - |
| 3. Code Highlighting | 4-5 tests | 2 tests | - |
| 4. Images & Styling | 3-4 tests | 2 tests | - |
| 5. SEO & Tests | 4-5 tests | - | 5-6 tests |

### Test Milestones

- **After Phase 1**: Route accessible, 404 handling verified
- **After Phase 2**: Rich content renders (paragraphs, headings, lists)
- **After Phase 3**: Code blocks with highlighting
- **After Phase 5**: Full E2E validation, Lighthouse scores

### Quality Gates

Each phase must pass:

- [ ] All unit tests (coverage > 80%)
- [ ] TypeScript compilation sans erreur
- [ ] ESLint + Prettier sans erreur
- [ ] Build Next.js réussi
- [ ] Manual QA sur contenu test

---

## 📝 Phase Documentation Strategy

### Documentation to Generate per Phase

For each phase, use the `phase-doc-generator` skill to create:

1. INDEX.md
2. IMPLEMENTATION_PLAN.md
3. COMMIT_CHECKLIST.md
4. ENVIRONMENT_SETUP.md
5. guides/REVIEW.md
6. guides/TESTING.md
7. validation/VALIDATION_CHECKLIST.md

**Estimated documentation**: ~3400 lines per phase × 5 phases = **~17,000 lines**

### Story-Level Documentation

**This document** (PHASES_PLAN.md):

- Strategic overview
- Phase coordination
- Cross-phase dependencies
- Overall timeline

**Phase-level documentation** (generated separately):

- Tactical implementation details
- Commit-by-commit checklists
- Specific technical validations

---

## 🚀 Next Steps

### Immediate Actions

1. **Review this plan** with stakeholders
   - Validate phase breakdown makes sense
   - Confirm Shiki/Edge compatibility approach
   - Adjust estimates if needed

2. **Set up project structure**
   ```bash
   mkdir -p docs/specs/epics/epic_4/story_4_1/implementation/phase_1
   mkdir -p docs/specs/epics/epic_4/story_4_1/implementation/phase_2
   mkdir -p docs/specs/epics/epic_4/story_4_1/implementation/phase_3
   mkdir -p docs/specs/epics/epic_4/story_4_1/implementation/phase_4
   mkdir -p docs/specs/epics/epic_4/story_4_1/implementation/phase_5
   ```

3. **Generate detailed documentation for Phase 1**
   - Use command: `/generate-phase-doc Epic 4 Story 4.1 Phase 1`
   - Provide this PHASES_PLAN.md as context

### Implementation Workflow

For each phase:

1. **Plan** (if not done):
   - Read PHASES_PLAN.md for phase overview
   - Generate detailed docs with `phase-doc-generator`

2. **Implement**:
   - Follow IMPLEMENTATION_PLAN.md
   - Use COMMIT_CHECKLIST.md for each commit
   - Validate after each commit

3. **Review**:
   - Use guides/REVIEW.md
   - Ensure all success criteria met

4. **Validate**:
   - Complete validation/VALIDATION_CHECKLIST.md
   - Update this plan with actual metrics

5. **Move to next phase**:
   - Repeat process for next phase

### Progress Tracking

Update this document as phases complete:

- [ ] Phase 1: Route & Layout - Status: 📋 PENDING
- [ ] Phase 2: Lexical Rendering - Status: 📋 PENDING
- [ ] Phase 3: Code Highlighting - Status: 📋 PENDING
- [ ] Phase 4: Images & Styling - Status: 📋 PENDING
- [ ] Phase 5: SEO & Tests - Status: 📋 PENDING

---

## 📊 Success Metrics

### Story Completion Criteria

This story is considered complete when:

- [ ] All 5 phases implemented and validated
- [ ] All acceptance criteria from story spec met
- [ ] Test coverage > 80% achieved
- [ ] No critical bugs remaining
- [ ] LCP < 2.5s verified
- [ ] CLS < 0.1 verified
- [ ] Accessibility = 100 verified
- [ ] Documentation complete
- [ ] Deployed to preview environment

### Quality Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Test Coverage | >80% | - |
| Type Safety | 100% | - |
| Lighthouse Performance | ≥90 | - |
| Lighthouse Accessibility | 100 | - |
| Lighthouse Best Practices | 100 | - |
| Lighthouse SEO | 100 | - |
| Bundle Size Impact | <500KB | - |

---

## 📚 Reference Documents

### Story Specification

- Original spec: `docs/specs/epics/epic_4/story_4_1/story_4.1.md`

### Related Documentation

- Epic tracking: `docs/specs/epics/epic_4/EPIC_TRACKING.md`
- PRD: `docs/specs/PRD.md` (Epic 4, Story 4.1)
- UX/UI Spec: `docs/specs/UX_UI_Spec.md` (Section 5.2, 8.2, 8.3)

### Technical References

- Payload Lexical: https://payloadcms.com/docs/rich-text/lexical
- Shiki: https://shiki.style/
- Next.js Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- Schema.org Article: https://schema.org/Article

### Generated Phase Documentation

- Phase 1: `docs/specs/epics/epic_4/story_4_1/implementation/phase_1/INDEX.md`
- Phase 2: `docs/specs/epics/epic_4/story_4_1/implementation/phase_2/INDEX.md`
- Phase 3: `docs/specs/epics/epic_4/story_4_1/implementation/phase_3/INDEX.md`
- Phase 4: `docs/specs/epics/epic_4/story_4_1/implementation/phase_4/INDEX.md`
- Phase 5: `docs/specs/epics/epic_4/story_4_1/implementation/phase_5/INDEX.md`

---

**Plan Created**: 2025-12-09
**Last Updated**: 2025-12-09
**Created by**: Claude Code (story-phase-planner skill)
**Story Status**: 📋 PLANNING
