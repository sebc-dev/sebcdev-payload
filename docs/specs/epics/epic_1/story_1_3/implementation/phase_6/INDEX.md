# Phase 6: Architecture Validation (dependency-cruiser)

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Epic**: 1 - Foundation & Cloudflare Architecture
**Phase**: 6 of 8
**Status**: IN PROGRESS
**Started**: 2025-11-29

---

## Overview

### Objective

Configure dependency-cruiser to validate architecture and enforce import boundaries in a Next.js 15 + Payload CMS 3.0 application. This phase adds Layer 2+ protection by detecting architectural violations before they reach production.

### Key Deliverables

| Deliverable                                 | Description                                      | Priority |
| ------------------------------------------- | ------------------------------------------------ | -------- |
| `.dependency-cruiser.cjs`                   | Architecture rules configuration                 | Critical |
| `.dependency-cruiser-known-violations.json` | Baseline for existing violations (if needed)     | Medium   |
| Workflow integration                        | Step in quality-gate.yml with GitHub Job Summary | Critical |
| Documentation update                        | CLAUDE.md reference to new tool                  | Low      |

### Success Criteria

- [ ] No new architectural violations introduced
- [ ] Circular imports detected (excluding type-only cycles)
- [ ] Server code blocked from client components
- [ ] Report visible in GitHub Actions Job Summary
- [ ] Existing violations baselined (if any)

---

## Phase Context

### Dependencies

| Dependency                   | Status    | Notes                                  |
| ---------------------------- | --------- | -------------------------------------- |
| Phase 1: Workflow Foundation | Completed | Base workflow exists                   |
| Phase 5: Build Validation    | Completed | Build must pass before arch validation |

### Blocking

This phase does not block any subsequent phases.

### Related Acceptance Criteria

- **CA7**: dependency-cruiser pour validation architecture

---

## Quick Navigation

### Implementation Documents

| Document                                           | Purpose                               | Lines |
| -------------------------------------------------- | ------------------------------------- | ----- |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy with 4 commits | ~500  |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)       | Detailed per-commit checklist         | ~600  |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)     | Local environment configuration       | ~300  |

### Guide Documents

| Document                                 | Purpose                         | Lines |
| ---------------------------------------- | ------------------------------- | ----- |
| [guides/REVIEW.md](./guides/REVIEW.md)   | Commit-by-commit review guide   | ~400  |
| [guides/TESTING.md](./guides/TESTING.md) | Testing and validation strategy | ~350  |

### Validation Documents

| Document                                                                   | Purpose                | Lines |
| -------------------------------------------------------------------------- | ---------------------- | ----- |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final phase validation | ~400  |

---

## Technical Summary

### Architecture Rules to Implement

```
┌─────────────────────────────────────────────────────────────┐
│ Rule 1: no-server-in-client                                 │
│         Block server code imports in client components      │
├─────────────────────────────────────────────────────────────┤
│ Rule 2: no-circular                                         │
│         Detect circular dependencies (except type-only)     │
├─────────────────────────────────────────────────────────────┤
│ Rule 3: no-orphans                                          │
│         Detect unreachable modules (optional)               │
└─────────────────────────────────────────────────────────────┘
```

### Files to Create/Modify

| File                                        | Action             | Description                   |
| ------------------------------------------- | ------------------ | ----------------------------- |
| `.dependency-cruiser.cjs`                   | Create             | Architecture validation rules |
| `.dependency-cruiser-known-violations.json` | Create (if needed) | Baseline existing violations  |
| `.github/workflows/quality-gate.yml`        | Modify             | Add dependency-cruiser step   |
| `package.json`                              | Modify             | Add `depcruise` script        |
| `CLAUDE.md`                                 | Modify             | Document new tool usage       |

---

## Commit Overview

| #   | Commit Message                                | Scope                | Est. Time |
| --- | --------------------------------------------- | -------------------- | --------- |
| 1   | Install and configure dependency-cruiser      | Package + config     | 30 min    |
| 2   | Add architecture validation rules             | Rules implementation | 45 min    |
| 3   | Generate baseline for existing violations     | Baseline (if needed) | 20 min    |
| 4   | Integrate dependency-cruiser into CI workflow | CI integration       | 30 min    |

**Total Estimated Time**: 2-2.5 hours

---

## Risk Assessment

### Identified Risks

| Risk                             | Likelihood | Impact | Mitigation                                 |
| -------------------------------- | ---------- | ------ | ------------------------------------------ |
| Existing violations              | Medium     | Low    | Generate baseline to freeze technical debt |
| Complex Next.js App Router rules | Low        | Medium | Test rules locally before CI               |
| False positives on type imports  | Low        | Low    | Use `dependencyTypesNot: ['type-only']`    |

### Contingency Plans

1. **Many existing violations**: Start with `warn` severity, graduate to `error` after cleanup
2. **Rule conflicts with framework conventions**: Exclude specific patterns via `pathNot`
3. **Performance issues**: Cache depcruise output between runs

---

## Reference Documents

### Project Documentation

- [CI-CD-Security.md](../../../../CI-CD-Security.md) - Section 8.1
- [PHASES_PLAN.md](../PHASES_PLAN.md) - Phase 6 specification

### External Documentation

- [dependency-cruiser Official Docs](https://github.com/sverweij/dependency-cruiser)
- [dependency-cruiser Rules Reference](https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md)

---

## Getting Started

1. **Read** [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) to configure your local environment
2. **Follow** [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for the atomic commit strategy
3. **Use** [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) for each commit
4. **Review** with [guides/REVIEW.md](./guides/REVIEW.md) after implementation
5. **Validate** with [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

**Phase Created**: 2025-11-29
**Last Updated**: 2025-11-29
**Created by**: Claude Code (phase-doc-generator skill)
