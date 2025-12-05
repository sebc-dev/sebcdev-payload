# Phase 1: Environment Setup - Composants Atomiques

**Story**: 3.5 - Homepage Implementation
**Phase**: 1 of 3

---

## Prerequisites

### System Requirements

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | >= 20.x | `node --version` |
| pnpm | >= 9.x | `pnpm --version` |
| Git | >= 2.x | `git --version` |

### Project Dependencies

Ces dependencies doivent etre installees (deja presentes si Story 3.2 completee):

| Package | Purpose | Check |
|---------|---------|-------|
| `next-intl` | Internationalisation | `pnpm list next-intl` |
| `tailwindcss` | Styling | `pnpm list tailwindcss` |
| `@radix-ui/react-slot` | shadcn/ui base | `pnpm list @radix-ui/react-slot` |
| `class-variance-authority` | shadcn/ui variants | `pnpm list class-variance-authority` |
| `clsx` | Utility | `pnpm list clsx` |
| `tailwind-merge` | Utility | `pnpm list tailwind-merge` |

---

## Environment Verification

### Step 1: Verify Project State

```bash
# Ensure clean working directory
git status

# Pull latest changes
git pull origin main

# Install dependencies
pnpm install
```

### Step 2: Verify Build

```bash
# Type check
pnpm exec tsc --noEmit

# Build
pnpm build

# If errors, resolve before continuing
```

### Step 3: Verify shadcn/ui Components

```bash
# Check if Badge component exists
ls src/components/ui/badge.tsx

# If not, add it
pnpm dlx shadcn@latest add badge

# Check if Card component exists
ls src/components/ui/card.tsx

# If not, add it
pnpm dlx shadcn@latest add card
```

---

## Directory Structure

### Before Phase 1

```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── badge.tsx (may need to add)
│   │   ├── card.tsx (may need to add)
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   └── icons/
│       └── ...
├── app/
│   └── [locale]/
│       └── (frontend)/
│           └── page.tsx
└── ...
messages/
├── fr.json
└── en.json
```

### After Phase 1

```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── articles/          # NEW
│   │   ├── index.ts       # NEW
│   │   ├── CategoryBadge.tsx    # NEW
│   │   ├── ComplexityBadge.tsx  # NEW
│   │   ├── TagPill.tsx          # NEW
│   │   └── ArticleCard.tsx      # NEW
│   ├── RelativeDate.tsx   # NEW
│   ├── layout/
│   └── icons/
└── ...
messages/
├── fr.json  # MODIFIED
└── en.json  # MODIFIED
```

---

## shadcn/ui Setup

### Add Badge Component (if needed)

```bash
pnpm dlx shadcn@latest add badge
```

**Expected output in `src/components/ui/badge.tsx`**:
```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

### Add Card Component (if needed)

```bash
pnpm dlx shadcn@latest add card
```

**Expected output in `src/components/ui/card.tsx`**:
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

---

## TypeScript Configuration

### Verify Path Aliases

Dans `tsconfig.json`, verifier que ces aliases sont configures:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@payload-config": ["./src/payload.config.ts"]
    }
  }
}
```

### Verify Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true
  }
}
```

---

## next-intl Configuration

### Verify Locale Files

Les fichiers de traduction doivent exister:

```bash
ls messages/
# fr.json  en.json
```

### Verify next-intl Setup

Dans `src/i18n/request.ts` (ou equivalent):
```typescript
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../../messages/${locale}.json`)).default,
}))
```

---

## Development Workflow

### Start Dev Server

```bash
pnpm dev
```

### Watch for TypeScript Errors

Dans un terminal separe:
```bash
pnpm exec tsc --noEmit --watch
```

### Run Lint on Save

Configure votre IDE pour executer ESLint on save, ou:
```bash
pnpm lint --fix
```

---

## Troubleshooting

### Issue: Badge/Card component not found

**Solution**:
```bash
pnpm dlx shadcn@latest add badge card
```

### Issue: Import path errors

**Solution**:
Verifier que `@/` pointe vers `./src/` dans `tsconfig.json`.

### Issue: next-intl not working

**Solution**:
1. Verifier que `NextIntlClientProvider` wrap l'app
2. Verifier que `getTranslations` est importe de `next-intl/server`
3. Verifier que les fichiers `messages/*.json` existent

### Issue: Tailwind classes not applying

**Solution**:
1. Verifier que le fichier est dans le `content` de `tailwind.config.ts`
2. Verifier que `globals.css` est importe dans le root layout
3. Redemarrer le serveur de dev

---

## Pre-Flight Checklist

Avant de commencer l'implementation:

- [ ] `pnpm install` execute sans erreur
- [ ] `pnpm exec tsc --noEmit` passe
- [ ] `pnpm build` passe
- [ ] `pnpm dev` demarre correctement
- [ ] Badge component present ou ajoute
- [ ] Card component present ou ajoute
- [ ] Fichiers `messages/fr.json` et `messages/en.json` existent
- [ ] Path alias `@/*` fonctionne

**Ready to implement!**
