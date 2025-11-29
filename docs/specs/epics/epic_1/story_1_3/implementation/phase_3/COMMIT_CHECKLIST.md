# Phase 3 - Commit Checklist: Code Quality (Linting & Formatting)

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 3 of 8
**Total Commits**: 4

---

## Checklist Overview

Use this checklist to track progress through each atomic commit. Each commit should be independently valid and the codebase should remain functional after each commit.

---

## Commit 1: Prettier Configuration

### Pre-Commit Checklist

- [ ] Read IMPLEMENTATION_PLAN.md Commit 1 section
- [ ] Verify Phase 2 is complete (Socket.dev configured)
- [ ] Understand Prettier configuration options

### Implementation Checklist

- [ ] Install `prettier-plugin-tailwindcss`:

  ```bash
  pnpm add -D prettier-plugin-tailwindcss
  ```

- [ ] Create `prettier.config.mjs` at repository root:

  ```javascript
  /** @type {import("prettier").Config} */
  const config = {
    semi: false,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
    printWidth: 100,
    plugins: ['prettier-plugin-tailwindcss'],
  }

  export default config
  ```

- [ ] Create `.prettierignore` at repository root:

  ```
  # Build outputs
  .next/
  .open-next/
  dist/
  build/

  # Dependencies
  node_modules/

  # Generated files
  src/payload-types.ts
  pnpm-lock.yaml

  # Cloudflare
  .wrangler/
  cloudflare-env.d.ts

  # Database
  drizzle/migrations/

  # IDE
  .idea/
  .vscode/
  ```

- [ ] Add scripts to `package.json`:

  ```json
  {
    "scripts": {
      "format": "prettier --write .",
      "format:check": "prettier --check ."
    }
  }
  ```

- [ ] Verify configuration structure:
  - [ ] `prettier.config.mjs` uses ESM syntax
  - [ ] Plugin is correctly referenced
  - [ ] Ignore patterns match project structure

### Validation Checklist

- [ ] Run `pnpm exec prettier --check .` (may show files to format)
- [ ] Run `pnpm format` to format all files
- [ ] Run `pnpm format:check` - should pass now
- [ ] Check that `.prettierignore` excludes correct files

### Commit Checklist

- [ ] Stage files: `git add prettier.config.mjs .prettierignore package.json pnpm-lock.yaml`
- [ ] Stage any auto-formatted files
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  🎨 Add Prettier configuration with Tailwind plugin

  - Create prettier.config.mjs with standard options
  - Add prettier-plugin-tailwindcss for class ordering
  - Create .prettierignore for generated files
  - Add format and format:check scripts
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git show --stat` shows correct files
- [ ] `pnpm format:check` passes
- [ ] No uncommitted changes: `git status` is clean

---

## Commit 2: ESLint Configuration Enhancement

### Pre-Commit Checklist

- [ ] Commit 1 is complete and verified
- [ ] Read IMPLEMENTATION_PLAN.md Commit 2 section
- [ ] Understand `eslint-config-prettier` purpose

### Implementation Checklist

- [ ] Install `eslint-config-prettier`:

  ```bash
  pnpm add -D eslint-config-prettier
  ```

- [ ] Update `eslint.config.mjs`:

  ```javascript
  import { dirname } from 'path'
  import { fileURLToPath } from 'url'
  import { FlatCompat } from '@eslint/eslintrc'

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  const compat = new FlatCompat({
    baseDirectory: __dirname,
  })

  const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
      rules: {
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/no-empty-object-type': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: false,
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^(_|ignore)',
          },
        ],
      },
    },
    // IMPORTANT: eslint-config-prettier must be last to disable conflicting rules
    ...compat.extends('prettier'),
    {
      ignores: [
        '.next/',
        '.open-next/',
        'node_modules/',
        'src/payload-types.ts',
        'drizzle/migrations/',
        '.wrangler/',
      ],
    },
  ]

  export default eslintConfig
  ```

- [ ] Verify configuration:
  - [ ] `eslint-config-prettier` is last in extends
  - [ ] Generated files in ignores array
  - [ ] No syntax errors in config

### Validation Checklist

- [ ] Run `pnpm lint` - should pass with no errors
- [ ] Run `pnpm exec eslint . --cache --cache-location .eslintcache`
- [ ] Verify `.eslintcache` file is created
- [ ] Add `.eslintcache` to `.gitignore` if not already present

### Commit Checklist

- [ ] Stage files: `git add eslint.config.mjs package.json pnpm-lock.yaml`
- [ ] Stage `.gitignore` if modified
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  🚨 Enhance ESLint config with eslint-config-prettier

  - Add eslint-config-prettier to disable format rules
  - Configure ignores for generated files
  - Enable ESLint caching for CI performance
  - Ensure compatibility with Prettier
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git show --stat` shows correct files
- [ ] `pnpm lint` passes
- [ ] No uncommitted changes

---

## Commit 3: Workflow Integration

### Pre-Commit Checklist

- [ ] Commits 1-2 are complete and verified
- [ ] Read IMPLEMENTATION_PLAN.md Commit 3 section
- [ ] Review current quality-gate.yml structure

### Implementation Checklist

- [ ] Open `.github/workflows/quality-gate.yml` for editing

- [ ] Add ESLint and Prettier steps after Socket.dev:

  ```yaml
  # ============================================
  # LAYER 2: Code Quality
  # ============================================

  - name: ESLint
    run: pnpm lint --format stylish
    continue-on-error: false

  - name: Prettier Check
    run: pnpm exec prettier --check .
    continue-on-error: false
  ```

- [ ] Update placeholder step message:

  ```yaml
  - name: Placeholder - Quality checks coming soon
    run: |
      echo "::notice::Phase 1-3 complete - Foundation + Socket.dev + ESLint/Prettier"
      echo "::notice::Future phases will add: Knip, Build, dependency-cruiser, etc."
  ```

- [ ] Verify step placement:
  - [ ] After Socket.dev Security Scan
  - [ ] Before placeholder/future steps
  - [ ] Proper YAML indentation

### Validation Checklist

- [ ] YAML syntax valid:
  ```bash
  python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml'))"
  ```
- [ ] Steps are in correct order
- [ ] No duplicate step names
- [ ] `continue-on-error: false` for both steps (blocking)

### Commit Checklist

- [ ] Stage file: `git add .github/workflows/quality-gate.yml`
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  👷 Add ESLint and Prettier steps to quality-gate workflow

  - Add ESLint step with stylish format
  - Add Prettier check step
  - Configure as blocking checks (no continue-on-error)
  - Update placeholder message for Phase 3
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git show` shows workflow changes
- [ ] YAML syntax valid
- [ ] No uncommitted changes

---

## Commit 4: Documentation Update

### Pre-Commit Checklist

- [ ] Commits 1-3 are complete and verified
- [ ] Read IMPLEMENTATION_PLAN.md Commit 4 section
- [ ] Review existing CLAUDE.md structure

### Implementation Checklist

- [ ] Create `docs/guides/linting-formatting.md`:

  ````markdown
  # Linting & Formatting Guide

  ## Overview

  This project uses ESLint for code quality and Prettier for formatting.
  They are configured to work together without conflicts.

  ## Quick Commands

  ```bash
  # Check linting
  pnpm lint

  # Check formatting
  pnpm format:check

  # Auto-fix formatting
  pnpm format
  ```
  ````

  ## ESLint Configuration
  - **Config file**: `eslint.config.mjs` (ESLint 9 Flat Config)
  - **Extends**: `next/core-web-vitals`, `next/typescript`, `prettier`
  - **Key rules**:
    - `@typescript-eslint/no-explicit-any`: warn
    - `@typescript-eslint/no-unused-vars`: warn (with `_` prefix ignore)

  ### Ignored Files
  - `.next/` - Build output
  - `src/payload-types.ts` - Generated by Payload
  - `drizzle/migrations/` - Database migrations

  ## Prettier Configuration
  - **Config file**: `prettier.config.mjs`
  - **Plugins**: `prettier-plugin-tailwindcss`
  - **Options**:
    - `semi: false` - No semicolons
    - `singleQuote: true` - Single quotes
    - `tabWidth: 2` - 2 spaces
    - `printWidth: 100` - Line width

  ### Tailwind Class Ordering

  The Tailwind plugin automatically sorts CSS classes in a consistent order.

  ## IDE Integration

  ### VS Code

  Install extensions:
  - ESLint (`dbaeumer.vscode-eslint`)
  - Prettier (`esbenp.prettier-vscode`)

  Add to `.vscode/settings.json`:

  ```json
  {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  }
  ```

  ## Troubleshooting

  ### ESLint and Prettier Conflict

  If you see conflicting errors:
  1. Verify `eslint-config-prettier` is last in config
  2. Run `pnpm lint` then `pnpm format`

  ### Slow ESLint

  Enable caching:

  ```bash
  pnpm exec eslint . --cache
  ```

  ### Unknown Rule Errors

  Update ESLint packages:

  ```bash
  pnpm add -D eslint@latest eslint-config-next@latest
  ```

  ```

  ```

- [ ] Verify documentation:
  - [ ] Commands are accurate
  - [ ] File paths are correct
  - [ ] Examples work

### Validation Checklist

- [ ] File exists at `docs/guides/linting-formatting.md`
- [ ] Markdown renders correctly
- [ ] All commands are copy-pasteable and work
- [ ] No broken links

### Commit Checklist

- [ ] Stage files: `git add docs/guides/linting-formatting.md`
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  📝 Add linting and formatting documentation

  - Create docs/guides/linting-formatting.md
  - Document ESLint and Prettier configuration
  - Add IDE integration instructions
  - Include troubleshooting section
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] All 4 commits are in history: `git log --oneline -4`
- [ ] No uncommitted changes

---

## Phase Completion Checklist

### Files Created/Modified

- [ ] `prettier.config.mjs` - Created with Tailwind plugin
- [ ] `.prettierignore` - Created with ignore patterns
- [ ] `eslint.config.mjs` - Modified with eslint-config-prettier
- [ ] `.github/workflows/quality-gate.yml` - Modified with ESLint/Prettier steps
- [ ] `docs/guides/linting-formatting.md` - Created
- [ ] `package.json` - Modified with new scripts and dependencies

### Functional Verification

- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm format:check` passes with no errors
- [ ] Push to GitHub: `git push origin story_1_3`
- [ ] Navigate to GitHub Actions tab
- [ ] Click "Run workflow" on Quality Gate
- [ ] Verify ESLint step completes (green)
- [ ] Verify Prettier step completes (green)

### Configuration Verification

- [ ] `eslint-config-prettier` is last in ESLint config
- [ ] Generated files are properly ignored
- [ ] Tailwind classes get sorted by Prettier
- [ ] No conflicts between ESLint and Prettier

### Documentation Verification

- [ ] `docs/guides/linting-formatting.md` exists
- [ ] Documentation is accurate for current config
- [ ] IDE integration documented

### Phase Sign-Off

- [ ] All 4 commits completed
- [ ] ESLint and Prettier working locally
- [ ] CI integration working
- [ ] Documentation complete

**Phase 3 Status**: [ ] COMPLETE

---

## Quick Reference: Commit Messages (Gitmoji)

```bash
# Commit 1
git commit -m "🎨 Add Prettier configuration with Tailwind plugin"

# Commit 2
git commit -m "🚨 Enhance ESLint config with eslint-config-prettier"

# Commit 3
git commit -m "👷 Add ESLint and Prettier steps to quality-gate workflow"

# Commit 4
git commit -m "📝 Add linting and formatting documentation"
```

---

**Document Created**: 2025-11-29
**Last Updated**: 2025-11-29
