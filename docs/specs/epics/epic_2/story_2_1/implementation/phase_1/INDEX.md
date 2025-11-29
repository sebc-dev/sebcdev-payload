# Phase 1: i18n Configuration

## Navigation Hub

| Document                                                                   | Description                                   | Status    |
| -------------------------------------------------------------------------- | --------------------------------------------- | --------- |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)                         | Atomic commit strategy and detailed breakdown | Required  |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)                               | Step-by-step implementation checklist         | Required  |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)                             | Prerequisites and environment configuration   | Required  |
| [guides/REVIEW.md](./guides/REVIEW.md)                                     | Code review guidelines                        | Reference |
| [guides/TESTING.md](./guides/TESTING.md)                                   | Testing strategy and instructions             | Reference |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation checklist                    | Required  |

---

## Phase Overview

| Attribute        | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **Phase**        | 1 of 5                                                        |
| **Title**        | i18n Configuration                                            |
| **Story**        | Epic 2 - Story 2.1: Configuration des Collections Blog & i18n |
| **Duration**     | 1-2 days                                                      |
| **Commits**      | 2                                                             |
| **Risk Level**   | Low                                                           |
| **Dependencies** | None (Foundation Phase)                                       |

---

## Objective

Configurer l'internationalisation native de Payload CMS avec le francais comme langue par defaut et l'anglais comme langue secondaire. Cette phase etablit les fondations i18n necessaires pour toutes les collections de contenu.

---

## Scope

### In Scope

- Configuration du bloc `localization` dans `payload.config.ts`
- Definition des locales FR (defaut) et EN
- Activation du fallback automatique vers la locale par defaut
- Regeneration des types TypeScript avec support i18n
- Verification du toggle de langue dans l'interface admin

### Out of Scope

- Creation des collections de contenu (Phase 2-4)
- Configuration de l'editeur Lexical (Story 2.3)
- Traductions de l'interface admin Payload
- Integration avec next-intl (Epic 3)

---

## Deliverables

| Deliverable        | File(s)                 | Description                          |
| ------------------ | ----------------------- | ------------------------------------ |
| i18n Configuration | `src/payload.config.ts` | Bloc localization avec FR/EN         |
| TypeScript Types   | `src/payload-types.ts`  | Types regeneres avec support locale  |
| Verification       | Admin UI                | Toggle langue visible et fonctionnel |

---

## Files Affected

| File                    | Action     | Lines (est.) | Description                          |
| ----------------------- | ---------- | ------------ | ------------------------------------ |
| `src/payload.config.ts` | Modify     | +15          | Add localization configuration block |
| `src/payload-types.ts`  | Regenerate | ~50          | Types updated with locale support    |

**Total Estimated Changes**: ~65 lines

---

## Technical Approach

### Configuration Structure

```typescript
// src/payload.config.ts
export default buildConfig({
  // ... existing config
  localization: {
    locales: [
      { label: 'Francais', code: 'fr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
  // ... rest of config
})
```

### Key Decisions

1. **Francais as Default**: Le contenu sera principalement redige en francais, l'anglais etant secondaire
2. **Fallback Enabled**: Si une traduction n'existe pas, le contenu s'affiche dans la langue par defaut
3. **Simple Labels**: Labels lisibles pour l'interface admin

---

## Atomic Commits

| #   | Commit Message                                                    | Files             | Est. Time |
| --- | ----------------------------------------------------------------- | ----------------- | --------- |
| 1   | `feat(i18n): add localization configuration to payload.config.ts` | payload.config.ts | 30 min    |
| 2   | `chore(types): regenerate payload types with i18n support`        | payload-types.ts  | 15 min    |

**Total Estimated Time**: 45 minutes implementation + 30 minutes verification

---

## Success Criteria

### Functional

- [ ] Payload config includes `localization` block
- [ ] Two locales defined: `fr` (default) and `en`
- [ ] Fallback is set to `true`
- [ ] Admin UI displays language toggle in header
- [ ] Language toggle switches between FR and EN

### Technical

- [ ] `pnpm generate:types:payload` executes without errors
- [ ] `payload-types.ts` includes `Config.locale` type
- [ ] `pnpm dev` starts without errors
- [ ] No TypeScript compilation errors
- [ ] `pnpm build` succeeds

### Quality

- [ ] Code follows project conventions
- [ ] No linting errors (`pnpm lint`)
- [ ] Configuration is properly documented

---

## Risk Assessment

| Risk                        | Impact | Probability | Mitigation                                           |
| --------------------------- | ------ | ----------- | ---------------------------------------------------- |
| Config syntax error         | Low    | Low         | Follow Payload docs exactly, validate JSON structure |
| Type generation failure     | Medium | Low         | Clear `.next` cache before regenerating              |
| Admin UI not showing toggle | Low    | Low         | Verify localization block placement in config        |

---

## Dependencies

### Prerequisites

- [x] Payload CMS installed and configured
- [x] Development server functional (`pnpm dev`)
- [x] Type generation working (`pnpm generate:types:payload`)

### Blocks

This phase blocks:

- Phase 2: Categories & Tags Collections
- Phase 3: Articles Collection
- Phase 4: Pages Collection

---

## Quick Start

### 1. Read Prerequisites

```bash
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_1/ENVIRONMENT_SETUP.md
```

### 2. Follow Implementation

```bash
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_1/COMMIT_CHECKLIST.md
```

### 3. Validate Completion

```bash
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_1/validation/VALIDATION_CHECKLIST.md
```

---

## Commands Reference

```bash
# Development server
pnpm dev

# Generate types
pnpm generate:types:payload

# Build verification
pnpm build

# Lint check
pnpm lint

# Type check
pnpm tsc --noEmit
```

---

## References

- [PHASES_PLAN.md](../PHASES_PLAN.md) - Strategic overview
- [Story 2.1 Spec](../../story_2.1.md) - Full story specification
- [Payload i18n Documentation](https://payloadcms.com/docs/configuration/i18n)
- [Payload Config Documentation](https://payloadcms.com/docs/configuration/overview)

---

## Next Phase

After completing Phase 1, proceed to:

**Phase 2: Categories & Tags Collections**

- Creates taxonomy collections with i18n support
- Depends on i18n configuration from this phase

```bash
/generate-phase-doc Epic 2 Story 2.1 Phase 2
```

---

**Phase Status**: READY FOR IMPLEMENTATION
