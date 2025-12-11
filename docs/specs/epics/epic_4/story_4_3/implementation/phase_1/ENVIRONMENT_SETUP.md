# Environment Setup - Phase 1: Package Installation & Collection Configuration

**Story**: Story 4.3 - Live Preview
**Phase**: 1 of 3

---

## Prerequisites

### System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 20.x | 20.x LTS |
| pnpm | 9.x | Latest |
| Git | 2.x | Latest |
| OS | macOS/Linux/WSL2 | - |

### Project Requirements

| Requirement | Status Check |
|-------------|--------------|
| Payload CMS 3.65.x | `pnpm list payload` |
| Next.js 15.x | `pnpm list next` |
| TypeScript 5.7.x | `pnpm list typescript` |
| Articles Collection | `src/collections/Articles.ts` exists |

---

## Environment Setup

### Step 1: Verify Development Environment

```bash
# Check Node.js version (should be 20.x)
node --version

# Check pnpm version (should be 9.x)
pnpm --version

# Check git version
git --version
```

### Step 2: Clone/Update Repository

```bash
# If starting fresh
git clone <repository-url>
cd sebcdev-payload

# If already cloned, pull latest
git fetch origin
git pull origin main
```

### Step 3: Create Feature Branch

```bash
# Create and checkout the feature branch
git checkout -b feature/story-4.3-phase-1

# Or if branch exists
git checkout feature/story-4.3-phase-1
git pull origin feature/story-4.3-phase-1
```

### Step 4: Install Dependencies

```bash
# Install all project dependencies
pnpm install
```

### Step 5: Verify Environment Variables

```bash
# Check .env exists and has required variables
cat .env | grep -E "PAYLOAD_SECRET|DATABASE_URL"
```

Required variables (should already exist):
- `PAYLOAD_SECRET` - Payload authentication secret
- `DATABASE_URL` - Database connection (D1/SQLite)

### Step 6: Verify Database

```bash
# Run migrations if needed
pnpm payload migrate
```

### Step 7: Start Development Server

```bash
# Start the dev server
pnpm dev
```

Expected output:
```
▲ Next.js 15.x
- Local:    http://localhost:3000
- Ready in Xs
```

### Step 8: Verify Admin Access

1. Open browser: `http://localhost:3000/admin`
2. Login with admin credentials
3. Navigate to Articles collection
4. Verify articles list loads

---

## Environment Variables for Phase 1

### New Variable Required

| Variable | Purpose | Value |
|----------|---------|-------|
| `NEXT_PUBLIC_SERVER_URL` | Base URL for Live Preview | `http://localhost:3000` |

### How to Add

After Commit 3, you'll add this to `.env`:

```bash
# Live Preview
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Environment-Specific Values

| Environment | `NEXT_PUBLIC_SERVER_URL` |
|-------------|--------------------------|
| Local Dev | `http://localhost:3000` |
| Preview/Staging | `https://preview.sebc.dev` |
| Production | `https://sebc.dev` |

---

## IDE Setup

### Recommended Extensions (VS Code)

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright"
  ]
}
```

### TypeScript Settings

Ensure `tsconfig.json` has:
- `strict: true`
- Path aliases configured (`@/*` -> `src/*`)

### Prettier Configuration

Should already exist in project root. Verify:
```bash
cat .prettierrc
```

---

## Cloudflare Bindings (Development)

### Wrangler Configuration

The project uses `wrangler.jsonc` for Cloudflare bindings. For local development:

```bash
# Local dev uses --local flag automatically
pnpm dev
```

This binds:
- D1 database (SQLite locally)
- R2 storage (local emulation)

---

## Verification Checklist

Before starting Phase 1 implementation:

- [ ] Node.js 20.x installed
- [ ] pnpm 9.x installed
- [ ] Git configured
- [ ] Repository cloned
- [ ] Feature branch created
- [ ] Dependencies installed (`pnpm install`)
- [ ] Database migrated
- [ ] Dev server runs (`pnpm dev`)
- [ ] Admin panel accessible
- [ ] Articles collection visible

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `pnpm install` fails | Node version mismatch | Use Node 20.x |
| Port 3000 in use | Another process | Kill process or use different port |
| Admin 404 | Server not running | Run `pnpm dev` |
| Database errors | Migrations not run | Run `pnpm payload migrate` |
| TypeScript errors | Outdated types | Run `pnpm generate:types` |

### Debug Commands

```bash
# Check installed packages
pnpm list --depth=0

# Clear Next.js cache
rm -rf .next

# Regenerate types
pnpm generate:types

# Clean install
rm -rf node_modules pnpm-lock.yaml && pnpm install
```

### Getting Help

- Project documentation: `docs/` directory
- Payload CMS docs: https://payloadcms.com/docs
- Next.js docs: https://nextjs.org/docs

---

## Next Steps

Once environment is verified:

1. Read [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
2. Follow [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)
3. Validate with [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

**Setup Guide Created**: 2025-12-11
**Guide Version**: 1.0
