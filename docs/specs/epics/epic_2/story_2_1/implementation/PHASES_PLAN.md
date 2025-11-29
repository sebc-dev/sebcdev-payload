# Story 2.1: Configuration des Collections Blog & i18n

## PHASES PLAN - Strategic Implementation Overview

**Story Reference**: Epic 2 - Story 2.1
**Created**: 2025-11-29
**Total Phases**: 5
**Estimated Duration**: 8-10 days
**Estimated Commits**: 15-20

---

## Executive Summary

Cette story configure le coeur du CMS avec l'internationalisation et les collections de contenu. L'implementation est decomposee en 5 phases progressives, chacune livrant une fonctionnalite testable independamment.

### Phase Overview

| Phase | Title                         | Duration | Commits | Risk   | Dependencies |
| ----- | ----------------------------- | -------- | ------- | ------ | ------------ |
| 1     | i18n Configuration            | 1-2 days | 2-3     | Low    | None         |
| 2     | Categories & Tags Collections | 2 days   | 3-4     | Low    | Phase 1      |
| 3     | Articles Collection           | 2-3 days | 4-5     | Medium | Phase 2      |
| 4     | Pages Collection              | 1-2 days | 2-3     | Low    | Phase 1      |
| 5     | Integration & Validation      | 2 days   | 3-4     | Medium | All phases   |

### Critical Path

```
Phase 1 (i18n)
    ├──> Phase 2 (Categories & Tags)
    │        └──> Phase 3 (Articles) ──┐
    └──> Phase 4 (Pages) ─────────────────> Phase 5 (Integration)
```

---

## Phase 1: i18n Configuration

### Objective

Configurer l'internationalisation native de Payload CMS avec le francais comme langue par defaut et l'anglais comme langue secondaire.

### Scope

- Configuration `localization` dans `payload.config.ts`
- Support FR (defaut) et EN
- Fallback automatique active

### Deliverables

1. Configuration i18n dans payload.config.ts
2. Types TypeScript regeneres avec support i18n
3. Verification du toggle langue dans l'admin

### Files Affected

| File                    | Action     | Description                    |
| ----------------------- | ---------- | ------------------------------ |
| `src/payload.config.ts` | Modify     | Add localization configuration |
| `src/payload-types.ts`  | Regenerate | Types with locale support      |

### Technical Details

```typescript
// payload.config.ts addition
localization: {
  locales: [
    { label: 'Francais', code: 'fr' },
    { label: 'English', code: 'en' },
  ],
  defaultLocale: 'fr',
  fallback: true,
}
```

### Success Criteria

- [ ] Payload config includes localization block
- [ ] `pnpm generate:types:payload` succeeds
- [ ] Admin UI shows language toggle (FR/EN)
- [ ] No runtime errors on dev server

### Estimated Commits

1. `feat(i18n): add localization configuration to payload.config.ts`
2. `chore(types): regenerate payload types with i18n support`

### Risk Assessment

| Risk                    | Impact | Probability | Mitigation                      |
| ----------------------- | ------ | ----------- | ------------------------------- |
| Config syntax error     | Low    | Low         | Follow Payload docs exactly     |
| Type generation failure | Medium | Low         | Clear cache before regenerating |

### Duration

**Estimated**: 1-2 days
**Complexity**: Low

---

## Phase 2: Categories & Tags Collections

### Objective

Creer les collections taxonomiques (Categories et Tags) avec support i18n pour permettre la classification du contenu.

### Scope

- Collection `Categories` avec champs localises et visuels
- Collection `Tags` avec champs localises
- Export barrel pour les collections
- Migration database

### Deliverables

1. `src/collections/Categories.ts`
2. `src/collections/Tags.ts`
3. `src/collections/index.ts` (barrel export)
4. Migration D1 generee et appliquee
5. Types regeneres

### Files Affected

| File                            | Action     | Description                   |
| ------------------------------- | ---------- | ----------------------------- |
| `src/collections/Categories.ts` | Create     | Category collection with i18n |
| `src/collections/Tags.ts`       | Create     | Tag collection with i18n      |
| `src/collections/index.ts`      | Create     | Barrel export                 |
| `src/payload.config.ts`         | Modify     | Register new collections      |
| `src/migrations/*.ts`           | Generate   | Database migration            |
| `src/payload-types.ts`          | Regenerate | Updated types                 |

### Technical Details

**Categories Collection Schema**:

```typescript
{
  slug: 'categories',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', unique: true, required: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'color', type: 'text' }, // hex color
    { name: 'icon', type: 'text' }, // icon identifier
  ]
}
```

**Tags Collection Schema**:

```typescript
{
  slug: 'tags',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', unique: true, required: true },
  ]
}
```

### Success Criteria

- [ ] Categories collection visible in admin
- [ ] Tags collection visible in admin
- [ ] Can create category in FR, view in EN (fallback)
- [ ] Slug uniqueness enforced
- [ ] Color field accepts hex values
- [ ] Migration applies without errors

### Estimated Commits

1. `feat(collections): create Categories collection with i18n support`
2. `feat(collections): create Tags collection with i18n support`
3. `feat(collections): create barrel export and register in config`
4. `chore(db): generate and apply migration for Categories and Tags`

### Risk Assessment

| Risk                    | Impact | Probability | Mitigation                   |
| ----------------------- | ------ | ----------- | ---------------------------- |
| Migration failure       | High   | Medium      | Test locally before applying |
| Slug collision handling | Medium | Low         | Add proper error messages    |

### Dependencies

- Phase 1 (i18n configuration)

### Duration

**Estimated**: 2 days
**Complexity**: Low

---

## Phase 3: Articles Collection

### Objective

Creer la collection Articles avec tous les champs requis, relations, et le hook de calcul du temps de lecture.

### Scope

- Collection `Articles` complete
- Relations vers Categories, Tags, Media, Users
- Hook `calculateReadingTime`
- Champs SEO localises
- Status workflow (draft/published/archived)

### Deliverables

1. `src/collections/Articles.ts`
2. `src/hooks/calculateReadingTime.ts`
3. Migration database
4. Types regeneres
5. Test d'integration pour le hook

### Files Affected

| File                                | Action     | Description                  |
| ----------------------------------- | ---------- | ---------------------------- |
| `src/collections/Articles.ts`       | Create     | Full article collection      |
| `src/hooks/calculateReadingTime.ts` | Create     | Reading time calculation     |
| `src/hooks/index.ts`                | Create     | Hooks barrel export          |
| `src/payload.config.ts`             | Modify     | Register Articles collection |
| `src/migrations/*.ts`               | Generate   | Database migration           |
| `src/payload-types.ts`              | Regenerate | Updated types                |
| `tests/int/articles.int.spec.ts`    | Create     | Integration tests            |

### Technical Details

**Articles Collection Schema**:

```typescript
{
  slug: 'articles',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'status', 'publishedAt'] },
  fields: [
    // Content - Localized
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'excerpt', type: 'textarea', localized: true },

    // Identifiers - Not localized
    { name: 'slug', type: 'text', unique: true, required: true },

    // Relations
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    { name: 'author', type: 'relationship', relationTo: 'users' },

    // Metadata
    { name: 'publishedAt', type: 'date' },
    { name: 'status', type: 'select', options: ['draft', 'published', 'archived'], defaultValue: 'draft' },
    { name: 'readingTime', type: 'number', admin: { readOnly: true } },

    // SEO Group - Localized
    { name: 'seo', type: 'group', fields: [
      { name: 'metaTitle', type: 'text', localized: true },
      { name: 'metaDescription', type: 'textarea', localized: true },
    ]}
  ],
  hooks: {
    beforeChange: [calculateReadingTime]
  }
}
```

**Reading Time Hook**:

```typescript
// Average reading speed: 200 words per minute
export const calculateReadingTime: CollectionBeforeChangeHook = async ({ data }) => {
  if (data.content) {
    const wordCount = extractTextFromLexical(data.content).split(/\s+/).length
    data.readingTime = Math.ceil(wordCount / 200)
  }
  return data
}
```

### Success Criteria

- [ ] Articles collection visible in admin
- [ ] All relations functional (Category, Tags, Media, Author)
- [ ] Reading time calculated on save
- [ ] Status workflow functional
- [ ] i18n fields switch correctly
- [ ] SEO group properly localized
- [ ] Integration tests passing

### Estimated Commits

1. `feat(hooks): create calculateReadingTime hook`
2. `feat(collections): create Articles collection base structure`
3. `feat(collections): add relations and SEO fields to Articles`
4. `feat(collections): add hooks and status workflow to Articles`
5. `test(int): add Articles collection integration tests`

### Risk Assessment

| Risk                       | Impact | Probability | Mitigation                             |
| -------------------------- | ------ | ----------- | -------------------------------------- |
| Lexical content extraction | Medium | Medium      | Use Payload's built-in utilities       |
| Complex migration          | High   | Medium      | Incremental migration, test thoroughly |
| Relation integrity         | Medium | Low         | Database constraints                   |

### Dependencies

- Phase 1 (i18n configuration)
- Phase 2 (Categories & Tags - for relations)

### Duration

**Estimated**: 2-3 days
**Complexity**: Medium

---

## Phase 4: Pages Collection

### Objective

Creer la collection Pages pour le contenu statique du site (About, Contact, etc.).

### Scope

- Collection `Pages` avec champs localises
- Template selection pour differents layouts
- Champs SEO
- Migration database

### Deliverables

1. `src/collections/Pages.ts`
2. Migration database
3. Types regeneres

### Files Affected

| File                       | Action     | Description               |
| -------------------------- | ---------- | ------------------------- |
| `src/collections/Pages.ts` | Create     | Pages collection          |
| `src/collections/index.ts` | Modify     | Add Pages export          |
| `src/payload.config.ts`    | Modify     | Register Pages collection |
| `src/migrations/*.ts`      | Generate   | Database migration        |
| `src/payload-types.ts`     | Regenerate | Updated types             |

### Technical Details

**Pages Collection Schema**:

```typescript
{
  slug: 'pages',
  admin: { useAsTitle: 'title' },
  fields: [
    // Content - Localized
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'content', type: 'richText', localized: true },

    // Identifiers - Not localized
    { name: 'slug', type: 'text', unique: true, required: true },
    { name: 'template', type: 'select', options: ['default', 'home', 'about', 'contact'] },
    { name: 'status', type: 'select', options: ['draft', 'published'], defaultValue: 'draft' },

    // SEO Group - Localized
    { name: 'seo', type: 'group', fields: [
      { name: 'metaTitle', type: 'text', localized: true },
      { name: 'metaDescription', type: 'textarea', localized: true },
    ]}
  ]
}
```

### Success Criteria

- [ ] Pages collection visible in admin
- [ ] Template selection functional
- [ ] i18n fields switch correctly
- [ ] SEO group properly localized
- [ ] Migration applies without errors

### Estimated Commits

1. `feat(collections): create Pages collection with i18n support`
2. `feat(collections): add template selection and SEO to Pages`
3. `chore(db): generate and apply migration for Pages`

### Risk Assessment

| Risk                     | Impact | Probability | Mitigation                |
| ------------------------ | ------ | ----------- | ------------------------- |
| Template field conflicts | Low    | Low         | Simple select field       |
| Migration ordering       | Medium | Low         | Run after Categories/Tags |

### Dependencies

- Phase 1 (i18n configuration)

### Duration

**Estimated**: 1-2 days
**Complexity**: Low

---

## Phase 5: Integration & Validation

### Objective

Valider l'integration complete de toutes les collections, executer les tests, et s'assurer de la qualite globale.

### Scope

- Tests d'integration complets
- Validation des relations inter-collections
- Verification de l'admin UI
- Documentation des collections
- Quality gate validation

### Deliverables

1. Tests d'integration complets
2. Validation manuelle documentee
3. README collections mis a jour
4. Quality gate passing

### Files Affected

| File                                              | Action | Description                |
| ------------------------------------------------- | ------ | -------------------------- |
| `tests/int/collections.int.spec.ts`               | Create | Complete integration tests |
| `tests/int/i18n.int.spec.ts`                      | Create | i18n specific tests        |
| `docs/specs/epics/epic_2/story_2_1/VALIDATION.md` | Create | Validation report          |

### Test Scenarios

**Integration Tests**:

1. Create article with all relations (FR)
2. Verify article retrieval in EN (fallback)
3. Update article, verify reading time recalculation
4. Create page with template
5. Verify Category/Tag uniqueness constraints
6. Test cascade behavior on relation deletion

**Manual Validation**:

1. Navigate admin UI - all collections accessible
2. Create content in FR, switch to EN
3. Verify language toggle in admin header
4. Test relation pickers (Category, Tags, Media)
5. Verify SEO fields display correctly

### Success Criteria

- [ ] All integration tests passing
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] `pnpm test:int` passes
- [ ] Manual validation checklist complete
- [ ] No TypeScript errors
- [ ] Documentation updated

### Estimated Commits

1. `test(int): add comprehensive collection integration tests`
2. `test(int): add i18n specific tests`
3. `docs: add validation report for Story 2.1`
4. `fix: address any issues found during validation`

### Risk Assessment

| Risk                 | Impact | Probability | Mitigation                  |
| -------------------- | ------ | ----------- | --------------------------- |
| Integration issues   | High   | Medium      | Thorough testing            |
| Performance concerns | Medium | Low         | Monitor query counts        |
| Edge cases           | Medium | Medium      | Comprehensive test coverage |

### Dependencies

- All previous phases (1-4)

### Duration

**Estimated**: 2 days
**Complexity**: Medium

---

## Implementation Order & Dependencies

### Dependency Graph

```
                    ┌──────────────────────────────────────┐
                    │                                      │
                    v                                      │
┌─────────────┐   ┌─────────────────────┐   ┌────────────────────┐
│  Phase 1    │──>│     Phase 2         │──>│     Phase 3        │
│  i18n       │   │  Categories & Tags  │   │     Articles       │
│  (1-2 days) │   │     (2 days)        │   │    (2-3 days)      │
└─────────────┘   └─────────────────────┘   └────────────────────┘
       │                                              │
       │                                              │
       v                                              v
┌─────────────────────┐                    ┌────────────────────┐
│     Phase 4         │                    │     Phase 5        │
│     Pages           │───────────────────>│   Integration      │
│    (1-2 days)       │                    │    (2 days)        │
└─────────────────────┘                    └────────────────────┘
```

### Recommended Sequence

1. **Phase 1** (i18n) - Foundation, must be first
2. **Phase 2** (Categories & Tags) - Required for Article relations
3. **Phase 3 & 4** (Articles & Pages) - Can be parallelized after Phase 2
4. **Phase 5** (Integration) - Final validation

### Parallelization Opportunities

- Phase 3 (Articles) and Phase 4 (Pages) can run in parallel after Phase 2 completes
- Integration tests can be written incrementally during each phase

---

## Timeline & Resource Estimation

### Timeline

```
Week 1:
├── Day 1-2: Phase 1 (i18n Configuration)
├── Day 3-4: Phase 2 (Categories & Tags)
└── Day 5: Phase 3 start (Articles base)

Week 2:
├── Day 1-2: Phase 3 complete (Articles)
├── Day 2-3: Phase 4 (Pages) - parallel with Articles testing
└── Day 4-5: Phase 5 (Integration & Validation)
```

### Resource Summary

| Resource      | Allocation |
| ------------- | ---------- |
| Developer     | 1 FTE      |
| Duration      | 8-10 days  |
| Total Commits | 15-20      |

### Effort Distribution

| Phase                       | Effort % | Days |
| --------------------------- | -------- | ---- |
| Phase 1 - i18n              | 15%      | 1-2  |
| Phase 2 - Categories & Tags | 20%      | 2    |
| Phase 3 - Articles          | 30%      | 2-3  |
| Phase 4 - Pages             | 15%      | 1-2  |
| Phase 5 - Integration       | 20%      | 2    |

---

## Risk Assessment

### Overall Risk Profile

| Category  | Level  | Notes                           |
| --------- | ------ | ------------------------------- |
| Technical | Medium | Multiple collections, relations |
| Schedule  | Low    | Well-defined scope              |
| Quality   | Low    | Strong testing strategy         |

### Top Risks

1. **Migration Complexity** (Medium)
   - Multiple related collections
   - Mitigation: Incremental migrations, thorough local testing

2. **Lexical Content Handling** (Medium)
   - Reading time calculation from rich text
   - Mitigation: Use Payload utilities, test edge cases

3. **i18n Edge Cases** (Low)
   - Fallback behavior
   - Mitigation: Explicit testing of locale switching

### Risk Mitigation Strategy

- Run all migrations locally first
- Incremental commits with working states
- Comprehensive test coverage
- Manual validation at each phase

---

## Testing Strategy

### Test Pyramid

```
           /\
          /  \     E2E Tests (Phase 5)
         /    \    - Admin UI navigation
        /──────\   - Full workflow tests
       /        \
      /          \  Integration Tests (Each Phase)
     /            \ - Collection CRUD
    /──────────────\ - Relation integrity
   /                \ - i18n behavior
  /                  \
 /                    \ Unit Tests (Phase 3)
/______________________\ - calculateReadingTime hook
```

### Test Categories

**Unit Tests**:

- `calculateReadingTime` hook
- Utility functions

**Integration Tests**:

- Collection CRUD operations
- Relation queries
- i18n field storage/retrieval
- Unique constraint validation

**Manual Tests**:

- Admin UI functionality
- Language switching
- Relation pickers
- SEO field display

### Coverage Goals

| Category          | Target                    |
| ----------------- | ------------------------- |
| Unit Tests        | 100% of hooks             |
| Integration Tests | All collection operations |
| Manual Tests      | All admin UI features     |

---

## Phase Documentation Strategy

### Document Generation

For each phase, generate detailed documentation using `/generate-phase-doc`:

```bash
/generate-phase-doc Epic 2 Story 2.1 Phase 1
/generate-phase-doc Epic 2 Story 2.1 Phase 2
# ... etc
```

### Generated Documents (per phase)

```
phase_X/
├── INDEX.md                    # Phase overview
├── IMPLEMENTATION_PLAN.md      # Atomic commit details
├── COMMIT_CHECKLIST.md         # Step-by-step checklist
├── ENVIRONMENT_SETUP.md        # Prerequisites
├── guides/
│   ├── REVIEW.md               # Code review guide
│   └── TESTING.md              # Testing instructions
└── validation/
    └── VALIDATION_CHECKLIST.md # Completion criteria
```

---

## Next Steps

### Immediate Actions

1. **Generate Phase 1 Documentation**

   ```bash
   /generate-phase-doc Epic 2 Story 2.1 Phase 1
   ```

2. **Review and Validate Plan**
   - Confirm phase breakdown
   - Adjust estimates if needed
   - Identify any missing requirements

3. **Start Implementation**
   - Follow Phase 1 commit checklist
   - Update EPIC_TRACKING.md as phases complete

### Progress Tracking

Update `EPIC_TRACKING.md` as each phase completes:

```markdown
| Story | Title                                 | Status      | Phases | Progress |
| ----- | ------------------------------------- | ----------- | ------ | -------- |
| 2.1   | Configuration Collections Blog & i18n | IN PROGRESS | 5      | X/5      |
```

---

## References

- [Story Specification](./story_2.1.md)
- [Epic Tracking](../EPIC_TRACKING.md)
- [PRD](../../../PRD.md)
- [Payload i18n Documentation](https://payloadcms.com/docs/configuration/i18n)
- [Payload Collections Documentation](https://payloadcms.com/docs/configuration/collections)

---

**Plan Status**: READY FOR IMPLEMENTATION
**Next Action**: Generate Phase 1 documentation with `/generate-phase-doc Epic 2 Story 2.1 Phase 1`
