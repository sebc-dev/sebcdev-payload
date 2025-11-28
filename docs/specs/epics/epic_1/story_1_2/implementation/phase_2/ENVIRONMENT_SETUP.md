# Phase 2: Environment Setup

**Phase**: Developer Documentation & Onboarding Guide
**Story**: 1.2 - Récupération & Configuration Locale

This document describes the prerequisites and environment configuration required before implementing Phase 2.

---

## Prerequisites

### Required: Phase 1 Completion

Phase 1 (Environment Validation) **must be completed** before starting Phase 2.

**Verify Phase 1 status**:
```bash
# Check PHASES_PLAN.md for Phase 1 status
grep -A5 "Phase 1" docs/specs/epics/epic_1/story_1_2/implementation/PHASES_PLAN.md
```

**Phase 1 completion requirements**:
- [ ] Wrangler authentication verified
- [ ] D1 database connection working
- [ ] R2 binding configured
- [ ] TypeScript types regenerated
- [ ] Development server starts correctly
- [ ] No TypeScript or ESLint errors

### Required: Working Development Environment

Ensure your environment is validated:

```bash
# Verify dev server starts
pnpm dev

# In another terminal, check the server
curl -I http://localhost:3000
# Should return HTTP 200

# Stop the dev server (Ctrl+C)
```

### Required: Access to Configuration Files

You need read access to these files for documentation reference:

| File | Purpose | Location |
|------|---------|----------|
| `package.json` | Script definitions | Root |
| `.env.example` | Environment template | Root |
| `wrangler.jsonc` | Cloudflare config | Root |
| `tsconfig.json` | TypeScript config | Root |
| `.eslintrc.*` | ESLint config | Root |

**Verify access**:
```bash
# Check all files exist
ls -la package.json .env.example wrangler.jsonc tsconfig.json
```

---

## Development Tools

### Required Software

| Tool | Purpose | Check Command |
|------|---------|---------------|
| Node.js | Runtime | `node --version` |
| pnpm | Package manager | `pnpm --version` |
| Git | Version control | `git --version` |
| Text editor | Writing docs | - |

### Recommended: VSCode

VSCode is recommended for documentation writing:
- Built-in Markdown preview
- Spell checking extensions
- Link validation

**Markdown Preview**:
- Open `.md` file
- Press `Ctrl+Shift+V` for preview
- Or `Ctrl+K V` for side-by-side

---

## Directory Setup

### Create Documentation Directory

Phase 2 creates files in `docs/development/`. Verify the structure:

```bash
# Create directory if not exists
mkdir -p docs/development

# Verify directory structure
tree docs/ -L 2 2>/dev/null || find docs/ -type d | head -20
```

### Expected Directory Structure After Phase 2

```
docs/
├── development/          # Created in Phase 2
│   ├── QUICKSTART.md
│   ├── COMMANDS.md
│   ├── ENVIRONMENT.md
│   ├── TROUBLESHOOTING.md
│   └── IDE_SETUP.md
└── specs/
    └── epics/
        └── epic_1/
            └── story_1_2/
                └── implementation/
                    ├── PHASES_PLAN.md
                    ├── phase_1/
                    └── phase_2/   # Current phase docs
```

---

## Reference Files

### Files to Review Before Writing Documentation

Before creating each documentation file, review these sources:

#### For QUICKSTART.md
- Phase 1 validation notes (if created)
- `.env.example` - for environment setup steps
- Current `CLAUDE.md` - for existing setup instructions

#### For COMMANDS.md
- `package.json` - scripts section
- Current command usage experience

#### For ENVIRONMENT.md
- `.env.example` - all variables
- `wrangler.jsonc` - Cloudflare bindings

#### For TROUBLESHOOTING.md
- Phase 1 issues encountered
- Common error messages seen
- Existing documentation gaps

#### For IDE_SETUP.md
- `.vscode/` directory (if exists)
- Current project settings
- Extension recommendations

---

## Content Guidelines

### Documentation Standards

Follow these standards for all documentation:

1. **Use Markdown formatting**
   - Headers for sections
   - Code blocks for commands
   - Tables for structured data

2. **Make commands copy-paste ready**
   - Full commands, not abbreviations
   - Include all necessary flags
   - Use code blocks

3. **Include expected outputs**
   - Show what success looks like
   - Note potential warnings vs errors

4. **Add verification steps**
   - How to confirm each step worked
   - What to check if it didn't

5. **Cross-reference other docs**
   - Link to related documentation
   - Use relative paths

### Markdown Template

```markdown
# Document Title

Brief description of what this document covers.

---

## Section 1

### Subsection 1.1

Content here.

```bash
# Command example
command --flag value
```

**Expected Output**:
```
Output here
```

---

## See Also

- [Related Doc](./RELATED.md)
```

---

## Git Workflow

### Branch Strategy

Work on the current branch (likely `main` or feature branch):

```bash
# Check current branch
git branch --show-current

# Verify clean state
git status
```

### Commit Strategy

Make 4 atomic commits as defined in IMPLEMENTATION_PLAN.md:

1. **Commit 2.1**: QUICKSTART.md
2. **Commit 2.2**: COMMANDS.md + ENVIRONMENT.md
3. **Commit 2.3**: TROUBLESHOOTING.md + IDE_SETUP.md
4. **Commit 2.4**: Review + tracking updates

### Commit Message Format

Use Gitmoji convention:
```
📝 <short description>

- Detail 1
- Detail 2

Part of Story 1.2 Phase 2: Developer Documentation
```

---

## Quality Checks

### Before Each Commit

1. **Review content accuracy**
   - Commands work as documented
   - Links are valid

2. **Check formatting**
   - Markdown renders correctly
   - Code blocks are properly formatted

3. **Verify cross-references**
   - Internal links work
   - "See Also" sections complete

### After Phase Completion

1. **Full documentation review**
   - All 5 files created
   - Consistent style

2. **Test quick-start guide**
   - Follow steps on clean environment (if possible)
   - Or mentally walk through each step

3. **Update tracking files**
   - PHASES_PLAN.md
   - EPIC_TRACKING.md

---

## Troubleshooting Setup Issues

### Phase 1 Not Complete

If Phase 1 is not complete, you must complete it first:

```bash
# Generate Phase 1 docs if needed
# /generate-phase-doc Epic 1 Story 1.2 Phase 1

# Follow Phase 1 IMPLEMENTATION_PLAN.md
```

### Missing Configuration Files

If configuration files are missing:

```bash
# Check git status
git status

# Pull latest changes
git pull origin main
```

### Directory Permission Issues

If you can't create directories:

```bash
# Check permissions
ls -la docs/

# Create with sudo if needed (not recommended)
# Better to fix permissions on parent directory
```

---

## Quick Start Commands

```bash
# Verify Phase 1 complete
pnpm dev  # Should start successfully

# Create docs directory
mkdir -p docs/development

# Verify reference files
cat package.json | jq '.scripts' | head -20
cat .env.example

# Start implementing
# Follow IMPLEMENTATION_PLAN.md commit by commit
```

---

## Checklist Before Starting

- [ ] Phase 1 completed and validated
- [ ] Development server starts correctly
- [ ] No TypeScript or ESLint errors
- [ ] Access to package.json
- [ ] Access to .env.example
- [ ] Access to wrangler.jsonc
- [ ] docs/development/ directory created
- [ ] Git status is clean
- [ ] Read IMPLEMENTATION_PLAN.md

---

## Next Step

Once environment is ready:

1. Open [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
2. Start with Commit 2.1
3. Follow commit-by-commit instructions
4. Use [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) for verification

---

**Document Created**: 2025-11-28
**Last Updated**: 2025-11-28
**Created by**: Claude Code (phase-doc-generator skill)
