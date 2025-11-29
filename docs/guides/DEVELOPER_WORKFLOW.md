# Developer Workflow Guide

## Overview

This guide documents the complete developer workflow for this project, from local development to production deployment.

## Workflow Diagram

```
Local Development
↓
Git Commit
↓
Push to Branch
↓
Create Pull Request
↓
┌──────────────────────┐
│ Quality Gate (Auto) │ ← Triggered on PR
│ - Socket.dev scan   │
│ - ESLint/Prettier   │
│ - Knip dead code    │
│ - Type sync check   │
│ - Next.js build     │
│ - Architecture      │
└──────────────────────┘
↓ (must pass)
Code Review
↓
Merge to main
↓
┌──────────────────────┐
│ Deploy Job (Auto)   │ ← Triggered on main
│ - D1 migrations     │
│ - Wrangler deploy   │
│ - Wait-for-URL      │
│ - Smoke tests       │
└──────────────────────┘
↓
Production Live
```

## 1. Local Development

### Setup

```bash
# Clone repository
git clone <repo-url>
cd sebcdev-payload

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Commands

| Command               | Description                 |
| --------------------- | --------------------------- |
| `pnpm dev`            | Start dev server (Wrangler) |
| `pnpm devsafe`        | Clean start (removes .next) |
| `pnpm build`          | Build Next.js application   |
| `pnpm lint`           | Run ESLint                  |
| `pnpm generate:types` | Generate all types          |
| `pnpm test:int`       | Run integration tests       |
| `pnpm test:e2e`       | Run E2E tests               |

### Pre-Commit Checklist

Before committing, run:

```bash
pnpm lint                    # Fix linting issues
pnpm generate:types:payload  # Sync Payload types
pnpm build                   # Verify build works
```

## 2. Git Workflow

### Branch Naming

```
feature/<description>    # New features
fix/<description>        # Bug fixes
docs/<description>       # Documentation only
refactor/<description>   # Code refactoring
```

### Commit Messages

Use [Gitmoji](https://gitmoji.dev/) format:

```
<emoji> <message>

Examples:
✨ Add user authentication
🐛 Fix login redirect loop
📝 Update API documentation
♻️ Refactor database queries
```

### Creating a PR

1. Push your branch: `git push origin feature/my-feature`
2. Create PR via GitHub UI or CLI: `gh pr create`
3. Fill in PR template with description and test plan
4. Wait for Quality Gate to pass

## 3. Quality Gate

The Quality Gate runs automatically on every PR targeting `main`.

### Checks Performed

| Check        | Tool               | Failure Means               |
| ------------ | ------------------ | --------------------------- |
| Supply Chain | Socket.dev         | Suspicious package detected |
| Linting      | ESLint             | Code style violations       |
| Formatting   | Prettier           | Formatting inconsistencies  |
| Dead Code    | Knip               | Unused exports/imports      |
| Type Sync    | Payload CLI        | Types out of sync           |
| Build        | Next.js            | Compilation errors          |
| Architecture | dependency-cruiser | Forbidden imports           |

### If Quality Gate Fails

1. Click on the failed check in GitHub
2. Read the error message
3. Fix locally and push
4. Quality Gate re-runs automatically

### Manual Trigger

For `workflow_dispatch` enabled workflows:

1. Go to Actions tab
2. Select "Quality Gate"
3. Click "Run workflow"
4. Select your branch

## 4. Code Review

### Reviewer Checklist

- [ ] Code follows project conventions
- [ ] No security vulnerabilities introduced
- [ ] Tests cover new functionality
- [ ] Documentation updated if needed
- [ ] Commit messages follow Gitmoji format

### Merging

After approval:

1. Ensure branch is up-to-date with main
2. Squash and merge (or merge commit based on preference)
3. Delete feature branch

## 5. Deployment

Deployment triggers automatically when:

- Quality Gate passes on `main` branch
- Push to `main` (after merge)

### What Happens

1. **D1 Migrations**: `pnpm payload migrate`
2. **Build**: `pnpm build` (via OpenNext)
3. **Deploy**: `wrangler deploy`
4. **Validate**: Wait-for-URL + Smoke tests

### Monitoring Deployment

- **GitHub Actions**: Actions tab > Quality Gate workflow
- **Cloudflare Dashboard**: Workers & Pages > Your Worker

### Deployment URL

After successful deployment:

- Check GitHub Actions Summary for deployment URL
- Visit Cloudflare Dashboard for deployment details

## 6. Troubleshooting

### Common Issues

| Issue                | Solution                          |
| -------------------- | --------------------------------- |
| Quality Gate timeout | Re-run workflow                   |
| Type sync failure    | Run `pnpm generate:types:payload` |
| Build fails in CI    | Check for env var differences     |
| Deploy fails         | Check Cloudflare API Token        |
| Site not accessible  | Wait 1-2 min for propagation      |

### Getting Help

- Check existing documentation in `docs/`
- Review CI-CD-Security.md for pipeline details
- Check Cloudflare status page for outages

## Quick Reference

```bash
# Daily workflow
git checkout -b feature/my-feature
# ... make changes ...
pnpm lint && pnpm build
git add . && git commit -m "✨ Add feature"
git push origin feature/my-feature
gh pr create

# After merge
git checkout main
git pull origin main
# Deployment happens automatically
```

## See Also

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment details and rollback
- [CI-CD-Security.md](/docs/specs/CI-CD-Security.md) - Security architecture
- [CLAUDE.md](/CLAUDE.md) - Project overview and commands
