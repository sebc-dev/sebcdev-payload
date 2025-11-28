# Phase 1: Workflow Foundation & Dependabot

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Epic**: Epic 1 - Foundation & Cloudflare Architecture
**Phase**: 1 of 8
**Status**: PLANNED

---

## Navigation

| Document | Description |
|----------|-------------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy and implementation order |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Detailed checklist per commit |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Environment and prerequisites configuration |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review guide (commit-by-commit) |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy and validation |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation checklist |

---

## Phase Overview

### Objective

Create the foundational GitHub Actions workflow structure with security best practices: SHA pinning for actions, Dependabot for automated maintenance, and the basic job skeleton for the quality gate pipeline.

### Scope

- Creation of the main workflow file `.github/workflows/quality-gate.yml`
- Configuration of `workflow_dispatch` trigger for manual execution
- SHA pinning of GitHub official actions
- Configuration of Dependabot for actions and npm packages
- Definition of GITHUB_TOKEN permissions (read-only by default)
- Basic job skeleton: checkout, setup-node, pnpm install

### Out of Scope

- Individual quality tools configuration (Socket.dev, Knip, ESLint, etc.)
- OIDC authentication (Phase 2 of ENF6)
- Performance testing (Phase 7)
- Mutation testing (Phase 8)

---

## Key Deliverables

| Deliverable | File | Status |
|-------------|------|--------|
| Main workflow file | `.github/workflows/quality-gate.yml` | PENDING |
| Dependabot config | `.github/dependabot.yml` | PENDING |
| CI script (optional) | `package.json` script | PENDING |
| Documentation update | `CLAUDE.md` | PENDING |

---

## Dependencies

### Prerequisites

| Dependency | Status | Notes |
|------------|--------|-------|
| GitHub repository | Required | Already exists (Story 1.1) |
| pnpm configured | Required | Already in package.json |
| Node.js 20+ | Required | Defined in engines |

### Blocked By

- None (Foundation phase)

### Blocks

- Phase 2: Socket.dev (requires workflow foundation)
- Phase 3: ESLint/Prettier (requires workflow foundation)
- Phase 4: Knip/Type Sync (requires workflow foundation)
- Phase 5: Build Validation (requires workflow foundation)
- Phase 6: dependency-cruiser (requires workflow foundation)
- Phase 7: Lighthouse CI (requires workflow foundation)
- Phase 8: Stryker (requires workflow foundation)

---

## Atomic Commits Summary

This phase is implemented through **4 atomic commits**:

| # | Commit | Description | Est. Time |
|---|--------|-------------|-----------|
| 1 | `feat(ci): initialize quality-gate workflow with SHA-pinned actions` | Create workflow file with checkout, setup-node, pnpm install | 30-45 min |
| 2 | `feat(ci): configure dependabot for actions and npm packages` | Create dependabot.yml with weekly schedule and grouping | 20-30 min |
| 3 | `feat(ci): add GITHUB_TOKEN permissions and concurrency config` | Add permissions block and concurrency group | 15-20 min |
| 4 | `docs(ci): update CLAUDE.md with quality gate workflow documentation` | Document the manual trigger workflow | 15-20 min |

**Total Estimated Time**: 1.5-2 hours

---

## Success Criteria

### Functional Requirements

- [ ] Workflow triggers successfully via `workflow_dispatch` from GitHub Actions UI
- [ ] Checkout step completes without errors
- [ ] Node.js 20 is correctly set up with pnpm
- [ ] pnpm install completes successfully with cached dependencies
- [ ] Dependabot creates PRs for action and npm updates

### Non-Functional Requirements

- [ ] Actions are pinned by full SHA (40 characters)
- [ ] GITHUB_TOKEN has minimal permissions (`contents: read`)
- [ ] Workflow execution time < 2 minutes for foundation steps
- [ ] Clear documentation for manual trigger process

### Security Requirements

- [ ] No secrets exposed in workflow file
- [ ] SHA pinning prevents tag hijacking attacks
- [ ] Permissions follow least privilege principle

---

## Technical Notes

### SHA Pinning Strategy

All third-party actions must be pinned by full SHA with version comment:

```yaml
# Correct
- uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3  # v6.0.0

# Incorrect
- uses: actions/checkout@v4
```

### Dependabot Grouping

Minor and patch updates are grouped to reduce PR noise:

```yaml
groups:
  minor-updates:
    patterns: ["*"]
    update-types: ["minor", "patch"]
```

### Workflow Dispatch Configuration

Manual trigger with optional inputs for future phases:

```yaml
on:
  workflow_dispatch:
    inputs:
      run_mutation_tests:
        description: 'Run Stryker mutation tests (slow)'
        required: false
        type: boolean
        default: false
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Incorrect SHA causes checkout failure | Low | High | Verify SHA from GitHub releases page |
| Dependabot PR flood | Medium | Low | Group updates, set limit to 10 PRs |
| Workflow syntax errors | Medium | Medium | Use VS Code YAML extension, test locally with `act` |

---

## Reference Documents

- [CI-CD-Security.md](../../../../CI-CD-Security.md) - Section 2.2-2.3 (SHA Pinning, Dependabot)
- [PHASES_PLAN.md](../PHASES_PLAN.md) - Phase 1 specification
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## Quick Links

| Action | Link |
|--------|------|
| Start Implementation | [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) |
| Review Checklist | [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) |
| Setup Environment | [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) |

---

**Phase Created**: 2025-11-28
**Last Updated**: 2025-11-28
**Created by**: Claude Code (phase-doc-generator skill)
