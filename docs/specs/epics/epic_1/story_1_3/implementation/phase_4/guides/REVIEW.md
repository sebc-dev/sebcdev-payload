# Phase 4 - Code Review Guide

**Phase**: Dead Code Detection & Type Sync
**Total Commits**: 4
**Estimated Review Time**: 60-90 minutes

---

## Review Overview

This guide helps reviewers efficiently validate Phase 4 implementation. Each commit is reviewed independently with specific focus areas.

### Key Review Principles

1. **Configuration correctness** - Entry points must cover all framework conventions
2. **No false positives** - Legitimate code should not be flagged
3. **Security** - No secrets exposed in logs or workflow
4. **Maintainability** - Configuration is documented and understandable

---

## Commit 1: Knip Configuration

### Review Focus

| Area               | Priority | Time     |
| ------------------ | -------- | -------- |
| Entry points       | Critical | 10 min   |
| Ignore patterns    | High     | 5 min    |
| Schema & syntax    | Medium   | 5 min    |

### Checklist

#### Entry Points

- [ ] `next.config.ts` is listed (Next.js configuration)
- [ ] `payload.config.ts` is listed (Payload CMS entry)
- [ ] Both root and `src/` variations covered if needed
- [ ] `src/middleware.ts` included if exists
- [ ] `src/instrumentation.ts` included if exists

#### Ignore Patterns

- [ ] `src/payload-types.ts` ignored (auto-generated)
- [ ] `drizzle/migrations/**` excluded (SQL files)
- [ ] `public/**` ignored (static assets)
- [ ] No legitimate code accidentally ignored

#### Dependencies

- [ ] `@cloudflare/workers-types` in `ignoreDependencies` (type-only)
- [ ] No unnecessary dependencies ignored

#### Package.json

- [ ] `knip` script added
- [ ] `knip:production` script added
- [ ] Correct command syntax

### Red Flags

- ❌ Missing `payload.config.ts` entry point
- ❌ `src/**/*.ts` files over-ignored
- ❌ No `$schema` reference (prevents IDE support)
- ❌ Typos in file paths

### Questions to Ask

1. Are all framework conventions covered as entry points?
2. Is the ignore list minimal and justified?
3. Will this configuration work with the project structure?

---

## Commit 2: Knip Workflow Integration

### Review Focus

| Area               | Priority | Time     |
| ------------------ | -------- | -------- |
| Step placement     | Critical | 5 min    |
| Mode configuration | High     | 3 min    |
| Error handling     | Medium   | 5 min    |

### Checklist

#### Workflow Structure

- [ ] Knip step is in Layer 2 (Code Quality)
- [ ] Positioned after ESLint and Prettier steps
- [ ] Positioned before build/deployment steps
- [ ] Proper YAML indentation

#### Configuration

- [ ] `--production` flag used
- [ ] No `continue-on-error: true` (should block on issues)
- [ ] Step name is clear and descriptive

#### YAML Syntax

- [ ] Valid YAML (run parser to verify)
- [ ] No duplicate step names
- [ ] Comments explain purpose

### Red Flags

- ❌ `continue-on-error: true` on Knip step
- ❌ Missing `--production` flag (slower, more noise)
- ❌ Knip before ESLint/Prettier (wrong order)
- ❌ Invalid YAML syntax

### Questions to Ask

1. Will Knip failures block the pipeline appropriately?
2. Is the step order logical for the quality gate?
3. Are there any unnecessary permissions added?

---

## Commit 3: Type Sync Validation

### Review Focus

| Area               | Priority | Time     |
| ------------------ | -------- | -------- |
| Security           | Critical | 10 min   |
| Error handling     | High     | 5 min    |
| User experience    | Medium   | 5 min    |

### Checklist

#### Security

- [ ] `PAYLOAD_SECRET` uses `${{ secrets.PAYLOAD_SECRET }}`
- [ ] Fallback secret is at least 32 characters
- [ ] No real secrets hardcoded
- [ ] Secret not exposed in logs

#### Type Generation Step

- [ ] Environment variable set correctly
- [ ] Correct command: `pnpm generate:types:payload`
- [ ] Step name is clear

#### Type Sync Verification Step

- [ ] Uses `git diff --exit-code src/payload-types.ts`
- [ ] Success message is clear (✅ emoji)
- [ ] Error message is actionable
- [ ] Shows diff when sync fails (for debugging)
- [ ] Exits with code 1 on failure

#### Error Messages

- [ ] Tells user exactly what to do to fix
- [ ] Mentions `pnpm generate:types:payload`
- [ ] Mentions committing the changes

### Red Flags

- ❌ Real secret in workflow file
- ❌ Fallback secret less than 32 characters
- ❌ `echo $PAYLOAD_SECRET` or similar (exposes secret)
- ❌ No `exit 1` on failure
- ❌ Unclear error message

### Questions to Ask

1. If a developer's types are out of sync, will they understand what to do?
2. Are secrets handled securely?
3. Is the diff shown for debugging purposes?

---

## Commit 4: Documentation

### Review Focus

| Area               | Priority | Time     |
| ------------------ | -------- | -------- |
| Accuracy           | Critical | 10 min   |
| Completeness       | High     | 5 min    |
| Clarity            | Medium   | 5 min    |

### Checklist

#### Content Accuracy

- [ ] Commands work when copy-pasted
- [ ] Entry points match `knip.json`
- [ ] Ignore patterns match configuration
- [ ] Error messages match workflow output

#### Completeness

- [ ] Knip configuration documented
- [ ] Type sync workflow documented
- [ ] Troubleshooting section included
- [ ] Common issues covered

#### Clarity

- [ ] Clear section headings
- [ ] Code blocks properly formatted
- [ ] Tables used for complex information
- [ ] No jargon without explanation

### Red Flags

- ❌ Commands that don't work
- ❌ Outdated entry points list
- ❌ Missing troubleshooting section
- ❌ Broken markdown formatting

### Questions to Ask

1. Can a new developer understand how to use these tools?
2. Are the troubleshooting steps accurate?
3. Is anything missing from the documentation?

---

## Overall Phase Review

After reviewing all commits, verify the following:

### Integration Testing

```bash
# All commands should work
pnpm exec knip --production
pnpm generate:types:payload
git diff --exit-code src/payload-types.ts

# Full quality gate (local)
pnpm lint && pnpm format:check && pnpm exec knip --production
```

### CI Testing

- [ ] Push to branch triggers workflow (if configured)
- [ ] Manually run Quality Gate workflow
- [ ] Knip step passes
- [ ] Type sync steps pass

### Documentation Verification

- [ ] Guide is accessible and accurate
- [ ] CLAUDE.md updated (if applicable)
- [ ] No broken links

---

## Review Checklist Summary

### Critical Items (Must Pass)

- [ ] Entry points cover all framework conventions
- [ ] PAYLOAD_SECRET handled securely
- [ ] Error messages are actionable
- [ ] No false positives on legitimate code

### High Priority Items

- [ ] Production mode used in CI
- [ ] Steps in correct order
- [ ] Documentation accurate

### Medium Priority Items

- [ ] Good step naming
- [ ] Clear comments
- [ ] Troubleshooting documented

---

## Approve/Reject Criteria

### Approve If:

- All critical items pass
- No security issues
- CI integration works correctly
- Documentation is accurate

### Request Changes If:

- Security concerns (secrets exposed)
- Entry points missing (will cause false positives)
- Error messages unclear or missing
- Commands don't work

### Reject If:

- Real secrets in code
- Fundamentally broken configuration
- Major security vulnerabilities

---

**Document Created**: 2025-11-29
**Last Updated**: 2025-11-29
