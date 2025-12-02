# Environment Setup - Phase 1: Tailwind CSS 4 Foundation

**Phase**: 1 of 4
**Purpose**: Ensure development environment is ready for Tailwind CSS 4 installation

---

## Prerequisites

### Required Software

| Software | Minimum Version | Check Command | Status |
|----------|-----------------|---------------|--------|
| Node.js | 20.9.0 | `node --version` | ⬜ |
| pnpm | 9.0.0 | `pnpm --version` | ⬜ |
| Git | 2.30.0 | `git --version` | ⬜ |

### Verification Commands

```bash
# Check Node.js version
node --version
# Expected: v20.x.x or v22.x.x

# Check pnpm version
pnpm --version
# Expected: 9.x.x or 10.x.x

# Check Git version
git --version
# Expected: 2.30+
```

---

## Project State Verification

### Story 3.1 Prerequisites

Story 3.1 (i18n) must be complete. Verify:

```bash
# Check i18n structure exists
ls src/i18n/
# Expected: config.ts, routing.ts, request.ts

# Check locale layout exists
ls src/app/[locale]/
# Expected: layout.tsx

# Check middleware exists
ls src/middleware.ts
# Expected: file exists

# Check messages exist
ls messages/
# Expected: fr.json, en.json
```

### Current Project Structure

```
sebcdev-payload/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx          # Root locale layout (will be modified)
│   │   │   └── (frontend)/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx
│   │   │       └── styles.css      # Will be replaced in Phase 3
│   │   └── (payload)/
│   │       └── admin/
│   ├── i18n/
│   │   ├── config.ts
│   │   ├── routing.ts
│   │   └── request.ts
│   └── middleware.ts
├── messages/
│   ├── fr.json
│   └── en.json
├── package.json
└── next.config.ts
```

---

## Pre-Implementation Checks

### 1. Clean Working Directory

```bash
# Check git status
git status
# Expected: "nothing to commit, working tree clean"

# If not clean, commit or stash changes
git stash  # or git commit
```

### 2. Correct Branch

```bash
# Check current branch
git branch --show-current
# Expected: epic-3-story-3-2-phase1 or similar feature branch

# If needed, create/switch branch
git checkout -b epic-3-story-3-2-phase1
```

### 3. Dependencies Up to Date

```bash
# Install any missing dependencies
pnpm install

# Verify no outdated critical packages
pnpm outdated
```

### 4. Build Works

```bash
# Verify current build works before changes
pnpm build
# Expected: Build succeeds

# If build fails, fix issues before proceeding
```

### 5. Dev Server Works

```bash
# Start dev server
pnpm dev

# Visit http://localhost:3000/fr
# Expected: Page loads, i18n working
```

---

## Environment Variables

### Required Variables

No new environment variables needed for Phase 1.

### Existing Variables

Verify these exist in `.env`:

```bash
# Check .env file
cat .env | grep -E "PAYLOAD_SECRET|CLOUDFLARE"
```

---

## IDE Setup (Optional but Recommended)

### VS Code Extensions

| Extension | Purpose |
|-----------|---------|
| Tailwind CSS IntelliSense | Autocomplete for Tailwind classes |
| PostCSS Language Support | Syntax highlighting for PostCSS |
| ESLint | Linting integration |
| Prettier | Code formatting |

### Install Tailwind IntelliSense

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search "Tailwind CSS IntelliSense"
4. Install `bradlc.vscode-tailwindcss`

### VS Code Settings (Optional)

Add to `.vscode/settings.json`:

```json
{
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

---

## Network Requirements

### NPM Registry Access

Verify access to npm registry:

```bash
# Test npm registry
npm ping
# Expected: Pong

# Or pnpm equivalent
pnpm ping
```

### Packages to Download

| Package | Size (approx) |
|---------|---------------|
| tailwindcss | ~2.5 MB |
| @tailwindcss/postcss | ~200 KB |

---

## Disk Space

Ensure sufficient disk space:

```bash
# Check available space
df -h .
# Need at least 500MB free

# node_modules will grow by ~50MB
```

---

## Troubleshooting Common Issues

### Issue: pnpm install fails

```bash
# Clear pnpm cache
pnpm store prune

# Remove node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Issue: Build fails before starting

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
pnpm build
```

### Issue: Port 3000 in use

```bash
# Find process using port
lsof -i :3000

# Kill if needed
kill -9 <PID>

# Or use different port
pnpm dev -- -p 3001
```

### Issue: Node.js version mismatch

```bash
# Use nvm to switch versions
nvm install 20
nvm use 20

# Verify
node --version
```

---

## Final Checklist Before Implementation

- [ ] Node.js ≥ 20.9.0 installed
- [ ] pnpm ≥ 9.0.0 installed
- [ ] Git working directory clean
- [ ] On correct feature branch
- [ ] Story 3.1 i18n structure in place
- [ ] `pnpm build` succeeds
- [ ] `pnpm dev` works, page loads at /fr
- [ ] IDE ready (optional)
- [ ] Network access to npm registry

---

## Ready to Start

Once all checks pass:

1. Open [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
2. Follow [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)
3. Execute commits in order

**Estimated setup time**: 5-10 minutes (if prerequisites met)
