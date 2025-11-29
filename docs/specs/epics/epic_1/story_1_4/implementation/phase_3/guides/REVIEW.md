# Phase 3: Code Review Guide - Security Best Practices & Validation

**Phase**: 3 of 3 (active)

---

## Overview

This phase contains **documentation-only** changes. Review focuses on accuracy, completeness, and clarity rather than code logic.

---

## Review Checklist by Commit

### Commit 1: DEPLOYMENT.md Extension

**Accuracy Review**:

- [ ] API Token permissions match actual Cloudflare requirements
- [ ] Token rotation steps are complete and accurate
- [ ] Emergency rotation procedure is safe
- [ ] Rollback CLI commands are correct (`wrangler rollback`, `wrangler deployments list`)
- [ ] Dashboard rollback steps match current Cloudflare UI
- [ ] OIDC tracking URL is correct

**Completeness Review**:

- [ ] All security best practices documented
- [ ] All rollback methods covered (CLI, Dashboard, Git)
- [ ] Database migration rollback warning included
- [ ] Future OIDC note included

**Clarity Review**:

- [ ] Instructions are step-by-step
- [ ] Tables are well-formatted
- [ ] Code blocks have correct syntax highlighting
- [ ] No ambiguous instructions

### Commit 2: DEVELOPER_WORKFLOW.md

**Accuracy Review**:

- [ ] Workflow diagram matches actual pipeline
- [ ] Commands are correct (`pnpm dev`, `pnpm lint`, etc.)
- [ ] Quality Gate checks list is accurate
- [ ] Branch naming conventions match project standards
- [ ] Gitmoji examples are correct

**Completeness Review**:

- [ ] All workflow stages documented
- [ ] Local development setup included
- [ ] PR creation process documented
- [ ] Troubleshooting section covers common issues
- [ ] Quick reference is useful

**Clarity Review**:

- [ ] Flow diagram is easy to understand
- [ ] Tables are consistent
- [ ] No missing steps in procedures
- [ ] Links to other docs are correct

### Commit 3: CLAUDE.md Update

**Accuracy Review**:

- [ ] Commands are correct
- [ ] Links point to existing files
- [ ] OIDC note is accurate

**Consistency Review**:

- [ ] Format matches rest of CLAUDE.md
- [ ] No duplicate information
- [ ] Section placement is logical

**Completeness Review**:

- [ ] All new documentation referenced
- [ ] Pipeline stages documented
- [ ] Authentication method documented

---

## Documentation Standards

### Markdown Formatting

- Use consistent heading levels (## for main sections, ### for subsections)
- Use fenced code blocks with language specifiers
- Use tables for structured data
- Use bullet lists for unordered items
- Use numbered lists for sequential steps

### Content Standards

- Write in present tense for current state
- Use imperative mood for instructions ("Run this command", not "You should run")
- Include examples for complex concepts
- Provide troubleshooting for common issues

### Links

- Use relative paths for internal links (`./DEPLOYMENT.md`)
- Use absolute paths from root for cross-directory links (`/docs/guides/...`)
- Verify all links resolve correctly

---

## Review Process

### Self-Review (Before PR)

1. Read through all documentation changes
2. Click all links to verify they work
3. Run any documented commands locally
4. Check markdown rendering in preview

### Peer Review

1. Verify technical accuracy
2. Check for missing scenarios
3. Suggest improvements for clarity
4. Verify formatting consistency

### Final Approval

- [ ] All checklist items addressed
- [ ] No outstanding concerns
- [ ] Ready to merge

---

## Common Issues to Watch For

### Accuracy Issues

| Issue                 | Example                    | Fix                          |
| --------------------- | -------------------------- | ---------------------------- |
| Wrong command         | `wrangler rollback --id`   | Use `wrangler rollback <id>` |
| Outdated UI reference | "Click 'Deployments' menu" | Verify current Cloudflare UI |
| Missing prerequisite  | "Run deploy" without setup | Add missing setup steps      |

### Clarity Issues

| Issue                      | Example               | Fix                            |
| -------------------------- | --------------------- | ------------------------------ |
| Ambiguous instruction      | "Configure the token" | "Go to Dashboard > API Tokens" |
| Missing context            | "Use OIDC"            | Explain what OIDC is first     |
| Jargon without explanation | "ISR propagation"     | Add brief explanation          |

### Formatting Issues

| Issue                 | Example                   | Fix                          |
| --------------------- | ------------------------- | ---------------------------- | ---------- |
| Inconsistent headings | # then ### skipping ##    | Use proper heading hierarchy |
| Missing code fence    | Command without backticks | Use `code` or `code block`   |
| Broken table          | Misaligned columns        | Align                        | characters |

---

## Approval Criteria

### Must Have

- [ ] All CLI commands verified as working
- [ ] All links resolve correctly
- [ ] No markdown rendering issues
- [ ] Consistent with existing documentation

### Nice to Have

- [ ] Examples for edge cases
- [ ] Screenshots for Dashboard procedures
- [ ] Additional troubleshooting scenarios

---

**Review Guide Created**: 2025-11-29
