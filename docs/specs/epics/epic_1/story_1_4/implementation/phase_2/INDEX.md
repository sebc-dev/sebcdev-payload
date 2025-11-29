# Phase 2: Deployment Workflow Creation

**Story**: 1.4 - Adaptation du Pipeline de Deploiement
**Epic**: Epic 1 - Foundation & Cloudflare Architecture
**Phase**: 2 of 4
**Status**: Ready for Implementation

---

## Quick Navigation

| Document                                                                   | Purpose                   |
| -------------------------------------------------------------------------- | ------------------------- |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)                         | Atomic commit strategy    |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)                               | Per-commit verification   |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)                             | Environment configuration |
| [guides/REVIEW.md](./guides/REVIEW.md)                                     | Code review guide         |
| [guides/TESTING.md](./guides/TESTING.md)                                   | Testing strategy          |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation          |

---

## Phase Overview

### Objective

Create the deployment workflow that executes only after the Quality Gate succeeds, initially using the existing Cloudflare API Token. This phase establishes the deployment pipeline that will be enhanced with OIDC authentication in Phase 3.

### Scope

- Extension of `quality-gate.yml` with a `deploy` job
- Configuration of `needs: [quality-gate]` to guarantee execution order
- Integration of `wrangler deploy` with Cloudflare
- Execution of D1 migrations before deployment
- Addition of `wait-for-url` pattern for deployment validation

### Key Deliverables

| Deliverable                            | Status  |
| -------------------------------------- | ------- |
| Job `deploy` added to quality-gate.yml | Pending |
| D1 migrations executed before deploy   | Pending |
| `wrangler deploy` with API Token       | Pending |
| Wait-for-url validation                | Pending |
| Deployment URL in GitHub Summary       | Pending |
| DEPLOYMENT.md documentation            | Pending |

---

## Dependencies

### Phase Dependencies

| Phase   | Dependency Type | Status    | Notes                                |
| ------- | --------------- | --------- | ------------------------------------ |
| Phase 1 | Hard            | Completed | Branch protection must be configured |

### External Dependencies

| Dependency             | Required For    | Status  |
| ---------------------- | --------------- | ------- |
| CLOUDFLARE_API_TOKEN   | Wrangler deploy | Pending |
| CLOUDFLARE_ACCOUNT_ID  | Wrangler deploy | Pending |
| PAYLOAD_SECRET (in CI) | Migrations      | Exists  |
| quality-gate.yml       | Base workflow   | Exists  |

---

## Technical Context

### Current State

The `quality-gate.yml` workflow exists with:

- Supply chain security (Socket.dev)
- Code quality checks (ESLint, Prettier, Knip, Type Sync)
- Build validation (Next.js no-DB mode)
- Architecture validation (dependency-cruiser)

### Target State

After this phase:

- Deploy job triggered only after quality-gate passes
- D1 migrations run automatically
- Site deployed to Cloudflare Workers
- Deployment validation confirms site accessibility
- Deployment URL visible in GitHub Actions Summary

### Files Affected

| File                                 | Action   | Description                    |
| ------------------------------------ | -------- | ------------------------------ |
| `.github/workflows/quality-gate.yml` | Modified | Add deploy job                 |
| `docs/guides/DEPLOYMENT.md`          | Created  | Deployment documentation       |
| `package.json`                       | Modified | Add deploy scripts (if needed) |

---

## Risk Assessment

### Risk Factors

| Risk                               | Likelihood | Impact | Mitigation                             |
| ---------------------------------- | ---------- | ------ | -------------------------------------- |
| D1 migrations fail                 | Medium     | High   | Dry-run locally, rollback strategy     |
| Cloudflare propagation delay       | Medium     | Low    | Generous timeout (60s+)                |
| API Token permissions insufficient | Low        | Medium | Document required permissions          |
| Workflow syntax errors             | Low        | Low    | Local validation, incremental approach |

### Mitigation Strategies

1. **Dry-run migrations**: Test migrations locally before push
2. **Generous timeouts**: Configure 60s+ wait for URL availability
3. **Continue-on-error**: Initial smoke test non-blocking
4. **Incremental commits**: Each commit adds one piece of functionality

---

## Success Criteria

### Functional Criteria

- [ ] Deploy job executes only if quality-gate passes
- [ ] D1 migrations run successfully in CI
- [ ] Site is accessible after deployment
- [ ] Deployment URL visible in GitHub Actions Summary
- [ ] Workflow fails gracefully on deployment errors

### Non-Functional Criteria

- [ ] Total deployment time < 5 minutes
- [ ] Clear error messages on failure
- [ ] Documentation complete and accurate

---

## Atomic Commits Overview

This phase is broken into **4 atomic commits**:

| #   | Commit                           | Est. Lines | Est. Time |
| --- | -------------------------------- | ---------- | --------- |
| 1   | Add deploy job skeleton          | ~30        | 30 min    |
| 2   | Add D1 migration step            | ~20        | 20 min    |
| 3   | Add wrangler deploy integration  | ~40        | 45 min    |
| 4   | Add deployment validation & docs | ~150       | 60 min    |

**Total estimated**: ~240 lines, ~2.5 hours

---

## Reference Documents

### Story Context

- [Story 1.4 Specification](../../story_1.4.md)
- [PHASES_PLAN.md](../PHASES_PLAN.md)

### Technical References

- [CI-CD-Security.md](../../../../../CI-CD-Security.md) - Section 5, 11
- [quality-gate.yml](../../../../../../../.github/workflows/quality-gate.yml)
- [wrangler.jsonc](../../../../../../../wrangler.jsonc)

### External Documentation

- [Cloudflare Wrangler Action](https://github.com/cloudflare/wrangler-action)
- [Cloudflare D1 Migrations](https://developers.cloudflare.com/d1/reference/migrations/)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

---

## Getting Started

1. **Read** [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) to prepare your environment
2. **Follow** [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for step-by-step commits
3. **Use** [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) to verify each commit
4. **Review** with [guides/REVIEW.md](./guides/REVIEW.md) before submitting PR
5. **Validate** using [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

**Phase Created**: 2025-11-29
**Last Updated**: 2025-11-29
**Created by**: Claude Code (phase-doc-generator)
