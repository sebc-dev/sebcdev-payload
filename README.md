# sebc.dev — Technical Blog Platform

> A bilingual (FR/EN) technical blog exploring AI amplification, UX principles, and software engineering best practices through a _learning in public_ approach.

Built with **Payload CMS** on **Cloudflare Workers** — a modern, code-first headless CMS natively integrated with Next.js 15, enabling professional content management on serverless edge infrastructure.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **CMS**: Payload CMS 3.x
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **Deployment**: Cloudflare Workers
- **Language**: TypeScript

## ✨ Features

- 🌐 **Edge-first architecture** - Deploy globally with Cloudflare Workers
- 🔐 **Security-hardened CI/CD** - Multi-layer validation with Socket.dev, SHA pinning, and Dependabot
- 🧪 **Comprehensive testing** - Integration tests (Vitest), E2E tests (Playwright), and mutation testing (Stryker)
- ♿️ **Accessibility first** - WCAG 2.1 AA compliance with axe-core validation
- ⚡️ **Performance optimized** - Lighthouse scores: Performance ≥90, A11y/SEO = 100
- 📦 **Type-safe** - Full TypeScript support with auto-generated Payload types
- 🎨 **Convention-based commits** - Gitmoji for semantic commit messages

## 🛠️ Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run quality checks
pnpm lint                    # ESLint + Prettier
pnpm test                    # Unit + E2E tests
pnpm build                   # Production build

# Deploy to Cloudflare
pnpm deploy
```

## 🏗️ Architecture

### Project Structure
```
src/
├── app/
│   ├── (frontend)/          # Public pages
│   └── (payload)/           # Admin panel + API
├── collections/             # CMS collections
├── migrations/              # Database migrations
└── payload.config.ts        # Central configuration
```

### Key Integrations
- **D1 Database**: SQLite edge database via `@payloadcms/db-d1-sqlite`
- **R2 Storage**: Object storage for media via `@payloadcms/storage-r2`
- **OpenNext**: Cloudflare Workers adapter for Next.js

## 🔒 Quality & Security

This project implements an **AI-Shield** CI/CD pipeline with:

- **Supply Chain Security**: Socket.dev package scanning, SHA-pinned GitHub Actions
- **Code Quality Gates**: Knip (dead code detection), ESLint, Prettier, dependency-cruiser
- **Architecture Validation**: Enforced separation between server/client code
- **Automated Testing**: Multi-stage testing with coverage reports
- **OIDC Authentication**: Secure deployments without static secrets

> Full documentation: [CI/CD Security Architecture](docs/specs/CI-CD-Security.md)

## 📝 Commit Convention

This project uses [Gitmoji](https://gitmoji.dev/) for semantic commits:

```bash
✨ Add new feature
🐛 Fix bug
📝 Update documentation
♻️ Refactor code
⚡️ Improve performance
```

## 🚢 Deployment

### Prerequisites

1. **Cloudflare Account** with Workers, D1, and R2 access
2. **Wrangler CLI** authenticated: `pnpm wrangler login`
3. **PAYLOAD_SECRET** configured

### Quick Deploy

```bash
# 1. Set production secret (first time only)
pnpm wrangler secret put PAYLOAD_SECRET

# 2. Deploy to Cloudflare Workers
pnpm deploy
```

### Local Development with Cloudflare Bindings

```bash
# Create local secrets file
echo "PAYLOAD_SECRET=$(openssl rand -hex 32)" > .dev.vars

# Start dev server with Cloudflare bindings
pnpm dev
```

> Full infrastructure details: [docs/deployment/INFRASTRUCTURE.md](docs/deployment/INFRASTRUCTURE.md)

## 📚 Documentation

- [CLAUDE.md](CLAUDE.md) - Development guidelines
- [Infrastructure Reference](docs/deployment/INFRASTRUCTURE.md) - Cloudflare resources & commands
- [Gitmoji Reference](docs/gitmoji.md) - Complete emoji list
- [Payload Docs](https://payloadcms.com/docs) - Official CMS documentation
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) - Deployment platform

## 🤝 Contributing

1. Follow the Gitmoji commit convention
2. Run quality checks before pushing (`pnpm lint && pnpm test`)
3. Ensure TypeScript types are synced (`pnpm generate:types:payload`)

## 📄 License

MIT
