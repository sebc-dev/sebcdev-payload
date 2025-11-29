# Phase 4 - Environment Setup

This guide covers all environment setup needed for Phase 4 (Dead Code Detection & Type Sync).

---

## Prerequisites

### Previous Phases

- [x] Phase 1 completed (quality-gate.yml foundation)
- [x] Phase 2 completed (Socket.dev configured)
- [x] Phase 3 completed (ESLint/Prettier configured)

### Tools Required

- [x] Node.js 20+ (already installed)
- [x] pnpm 9+ (already installed)
- [x] TypeScript 5.x (already in devDependencies)
- [ ] Knip 5.x (to be installed)

### Services Required

- [x] GitHub Actions enabled
- [x] Repository access configured
- [x] PAYLOAD_SECRET configured (or using default)

---

## Dependencies Installation

### Install Knip

```bash
# Install Knip for dead code detection
pnpm add -D knip
```

**Package added**:

- `knip` - Finds unused files, dependencies and exports in JavaScript/TypeScript projects

### Verify Installation

```bash
# Check Knip is installed
pnpm list knip

# Check version
pnpm exec knip --version
```

**Expected Output**:

```
knip 5.x.x
```

---

## Configuration Files

### Knip Configuration

**File**: `knip.json`
**Location**: Repository root

```json
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "entry": [
    "next.config.ts",
    "payload.config.ts",
    "src/payload.config.ts",
    "src/instrumentation.ts",
    "src/middleware.ts"
  ],
  "project": ["src/**/*.{ts,tsx}"],
  "ignore": ["src/payload-types.ts", "public/**"],
  "ignoreDependencies": ["@cloudflare/workers-types"],
  "exclude": ["drizzle/migrations/**", "drizzle/meta/**"],
  "next": {
    "entry": []
  },
  "drizzle": {
    "config": ["drizzle.config.ts"]
  }
}
```

### Configuration Breakdown

| Property             | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `$schema`            | Enables IDE autocompletion                       |
| `entry`              | Files discovered by frameworks, not imported     |
| `project`            | All files to analyze                             |
| `ignore`             | Files to skip entirely                           |
| `ignoreDependencies` | Dependencies used only for types                 |
| `exclude`            | Patterns to exclude from analysis                |
| `next`               | Next.js plugin config (auto-detects conventions) |
| `drizzle`            | Drizzle plugin config                            |

---

## Environment Variables

### Required for Type Generation

| Variable         | Purpose                    | Required | Default            |
| ---------------- | -------------------------- | -------- | ------------------ |
| `PAYLOAD_SECRET` | JWT secret for Payload CMS | Yes      | None (must be set) |

### CI Environment

In GitHub Actions, `PAYLOAD_SECRET` is configured with a fallback:

```yaml
env:
  PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || 'ci-placeholder-secret-minimum-32chars!!' }}
```

**Note**: The fallback must be at least 32 characters for Payload to accept it.

### Local Development

Ensure `.env` or `.env.local` has:

```bash
PAYLOAD_SECRET=your-development-secret-at-least-32-characters
```

---

## Package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "knip": "knip",
    "knip:production": "knip --production"
  }
}
```

**Existing scripts** (no changes needed):

- `generate:types:payload` - Already configured for Payload type generation

---

## GitHub Actions Configuration

### Secrets Required

| Secret           | Purpose               | Required | Set By |
| ---------------- | --------------------- | -------- | ------ |
| `PAYLOAD_SECRET` | Type generation in CI | Optional | DevOps |

**Note**: If `PAYLOAD_SECRET` is not set as a GitHub secret, the fallback value in the workflow is used.

### Workflow Additions

The quality-gate workflow will be updated with:

```yaml
- name: Knip - Dead Code Detection
  run: pnpm exec knip --production

- name: Generate Payload Types
  env:
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || 'ci-placeholder-secret-minimum-32chars!!' }}
  run: pnpm generate:types:payload

- name: Verify Type Sync
  run: |
    if git diff --exit-code src/payload-types.ts; then
      echo "✅ Payload types are synchronized"
    else
      echo "❌ ERROR: Payload types are out of sync!"
      exit 1
    fi
```

---

## Validation Tests

### Test Knip

```bash
# Run full analysis
pnpm exec knip

# Run production mode (matches CI)
pnpm exec knip --production

# Run with debug output
pnpm exec knip --debug
```

**Expected Result**: No unused files, exports, or dependencies reported (or justified exceptions)

### Test Type Generation

```bash
# Generate types
pnpm generate:types:payload

# Check if types are in sync
git diff --exit-code src/payload-types.ts
```

**Expected Result**: Types generated successfully, no git diff

### Test Integration

```bash
# Run all checks (as CI will)
pnpm lint && pnpm format:check && pnpm exec knip --production
```

**Expected Result**: All checks pass

---

## Troubleshooting

### Issue: Knip Not Found

**Symptoms**:

- Command not found: `knip`
- "knip is not recognized"

**Solutions**:

1. Verify installation:
   ```bash
   pnpm list knip
   ```
2. Reinstall if needed:
   ```bash
   pnpm add -D knip
   ```

**Verify Fix**:

```bash
pnpm exec knip --version
```

---

### Issue: Type Generation Fails

**Symptoms**:

- Error about PAYLOAD_SECRET
- Database connection errors

**Solutions**:

1. Ensure PAYLOAD_SECRET is set:
   ```bash
   export PAYLOAD_SECRET="your-secret-at-least-32-characters-long"
   pnpm generate:types:payload
   ```
2. Check that secret is at least 32 characters

**Verify Fix**:

```bash
pnpm generate:types:payload
ls -la src/payload-types.ts
```

---

### Issue: Knip Reports Next.js Pages as Unused

**Symptoms**:

- `page.tsx` files marked as unused
- `layout.tsx` files marked as unused

**Solutions**:

1. Verify Next.js plugin is active (should be automatic)
2. Check `entry` array includes `next.config.ts`
3. Ensure you're using Knip 5.x or later

**Verify Fix**:

```bash
pnpm exec knip --production
```

---

### Issue: Knip Reports Payload Collections as Unused

**Symptoms**:

- Collection files marked as unused
- Hook files marked as unused

**Solutions**:

1. Add `payload.config.ts` to entry array:
   ```json
   {
     "entry": ["payload.config.ts", "src/payload.config.ts"]
   }
   ```
2. Ensure collections are statically imported in config

**Verify Fix**:

```bash
pnpm exec knip --production
```

---

### Issue: Knip is Very Slow

**Symptoms**:

- Analysis takes > 60 seconds
- High CPU usage during analysis

**Solutions**:

1. Use `--production` mode (faster):
   ```bash
   pnpm exec knip --production
   ```
2. Add large generated files to `ignore`:
   ```json
   {
     "ignore": ["src/payload-types.ts", "large-generated-file.ts"]
   }
   ```

**Verify Fix**:

```bash
time pnpm exec knip --production
```

---

### Issue: Ignored Dependencies Still Reported

**Symptoms**:

- `@cloudflare/workers-types` still reported as unused
- Type-only dependencies flagged

**Solutions**:

1. Add to `ignoreDependencies`:
   ```json
   {
     "ignoreDependencies": ["@cloudflare/workers-types"]
   }
   ```
2. Ensure the exact package name is used

**Verify Fix**:

```bash
pnpm exec knip --production
```

---

## Setup Checklist

Complete this checklist before starting implementation:

- [ ] All prerequisites met
- [ ] Knip installed (`pnpm add -D knip`)
- [ ] PAYLOAD_SECRET available (local and CI)
- [ ] Validation tests pass
- [ ] No unexpected Knip errors on current codebase

**Environment is ready!**

---

## Quick Reference

### Commands

| Command                         | Purpose                  |
| ------------------------------- | ------------------------ |
| `pnpm exec knip`                | Full dead code analysis  |
| `pnpm exec knip --production`   | Production mode (for CI) |
| `pnpm exec knip --debug`        | Debug output             |
| `pnpm generate:types:payload`   | Regenerate Payload types |
| `git diff src/payload-types.ts` | Check for type drift     |

### Files

| File                   | Purpose                       |
| ---------------------- | ----------------------------- |
| `knip.json`            | Knip configuration            |
| `src/payload-types.ts` | Generated Payload types       |
| `package.json`         | Scripts: knip, generate:types |

---

**Document Created**: 2025-11-29
**Last Updated**: 2025-11-29
