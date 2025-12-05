---
description: Review PR comments one by one - judge relevance, propose fixes, commit when validated
argument-hint: [optional: PR number or comment ID, or empty for interactive mode]
allowed-tools: Bash(gh:*), Bash(git add:*), Bash(git commit:*), Bash(git status:*), Bash(git diff:*), Read, Edit, Glob, Grep, Task, TodoWrite, AskUserQuestion
---

# PR Comment Review Command

Review and judge PR comments one by one with intelligent analysis and controlled commits.

## Modes of Operation

This command supports three modes:

1. **Interactive Mode** (no arguments): You provide comments one by one during the session
2. **From /pr-collect** (`/pr-review --from-collect [PR-number]`): Process collected comments from `.scd/`
3. **Direct Comment** (`/pr-review <PR-number> <comment-id>`): Review a specific comment

## Current Arguments

Arguments provided: `$ARGUMENTS`

## Your Task

### 1. Determine Mode

Based on `$ARGUMENTS`:

- If empty or no arguments → **Interactive Mode**
- If `--from-collect` → **From Collected Data Mode**
- If PR number and comment ID → **Direct Comment Mode**

### 2. Interactive Mode Workflow

If no arguments provided, display this welcome message:

```
╔══════════════════════════════════════════════════════════════╗
║               🔍 PR Comment Review Session                   ║
╠══════════════════════════════════════════════════════════════╣
║  Je suis prêt à analyser vos commentaires de PR un par un.   ║
║                                                              ║
║  📝 Pour chaque commentaire, fournissez :                    ║
║     - Le contenu du commentaire (copié depuis GitHub)        ║
║     - Le fichier concerné (si applicable)                    ║
║     - Le contexte si nécessaire                              ║
║                                                              ║
║  🎯 Je vais évaluer :                                        ║
║     ✓ Si le commentaire est déjà traité                      ║
║     ✓ Sa pertinence pour le projet                           ║
║     ✓ Si la correction proposée est adaptée                  ║
║     ✓ La cohérence avec les standards du projet              ║
║                                                              ║
║  💾 Workflow des corrections :                               ║
║     - Si validé → Correction + git add + git commit auto     ║
║     - Si rejeté → Explication du rejet                       ║
║                                                              ║
║  📌 Commandes disponibles :                                  ║
║     - "stop" ou "fin" → Terminer la session                  ║
║     - "status" → Voir les corrections effectuées             ║
║     - "skip" → Passer au commentaire suivant                 ║
╚══════════════════════════════════════════════════════════════╝

Collez votre premier commentaire de PR à analyser :
```

Then use AskUserQuestion to get the comment content.

### 3. Comment Analysis Framework

For each comment provided, perform this analysis:

#### Step A: Parse the Comment

Extract from the comment:
- **Source**: Which AI agent (CodeRabbit, Copilot, etc.) or human
- **File concerned**: Path to the file mentioned
- **Line numbers**: If specified
- **Severity**: Critical/Major/Minor/Trivial (from emoji or context)
- **Suggestion**: The actual fix proposed

#### Step B: Check if Already Addressed

1. Read the concerned file(s)
2. Check git diff to see if changes were already made
3. Compare current code with the suggestion

Display verdict:
```
📋 Analyse du commentaire
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏷️  Source: [Agent name or "Human"]
📁 Fichier: [file path]
📍 Lignes: [line numbers if any]
⚠️  Sévérité: [🔴 Critical | 🟠 Major | 🟡 Minor | 🔵 Trivial]

📝 Suggestion:
[The proposed fix]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Step C: Evaluate Relevance

Analyze against project standards:
1. Read CLAUDE.md and relevant documentation
2. Check existing patterns in the codebase
3. Consider project architecture
4. Evaluate security implications
5. Check TypeScript/ESLint rules compliance

#### Step D: Render Verdict

Display detailed verdict:

```
🔍 VERDICT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Statut: [✅ PERTINENT | ⚠️ PARTIELLEMENT PERTINENT | ❌ NON PERTINENT | 🔄 DÉJÀ TRAITÉ]

📝 Analyse:
[Detailed explanation of why the comment is relevant or not]

🎯 Cohérence projet:
[How it aligns or conflicts with project standards]

💡 Recommandation:
[What action to take - apply as-is, modify, or reject]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Step E: Apply Fix (if approved)

If the comment is validated:

1. **Show the proposed change**:
   ```
   📝 Modification proposée:

   Fichier: [path]

   - [old code]
   + [new code]
   ```

2. **Ask for confirmation**:
   ```
   Voulez-vous appliquer cette correction ?
   [Oui] [Non] [Modifier]
   ```

3. **If confirmed**:
   - Apply the edit using the Edit tool
   - Run `git add [file]`
   - Run `git commit` with a clear message following project conventions:
     ```
     🐛 fix(file): [description from comment]

     Addresses PR review comment from [source]

     🤖 Generated with [Claude Code](https://claude.com/claude-code)

     Co-Authored-By: Claude <noreply@anthropic.com>
     ```

4. **Display confirmation**:
   ```
   ✅ Correction appliquée et commitée

   📋 Commit: [hash]
   📝 Message: [commit message]
   📁 Fichier: [file path]
   ```

#### Step F: Handle Rejection

If the comment is rejected:

```
❌ Commentaire non appliqué

📝 Raison: [Detailed explanation]

💡 Alternative suggérée: [If applicable]

📌 Ce commentaire peut être marqué comme "Won't fix" avec la justification ci-dessus.
```

### 4. From Collected Data Mode

If `--from-collect` is specified:

1. Check if `.scd/github-pr-collector/data/pr-data/` exists
2. List available PRs and their comments
3. If PR number specified, filter to that PR
4. Present comments one by one following the same analysis framework
5. Track progress in a session file

### 5. Direct Comment Mode

If PR number and comment ID provided:

1. Use `gh api` to fetch the specific comment:
   ```bash
   gh api repos/{owner}/{repo}/pulls/{pr}/comments/{comment_id}
   ```
2. Apply the standard analysis framework
3. Process just that one comment

### 6. Session Tracking

Maintain a session log during the review:

```
📊 Session de Review
━━━━━━━━━━━━━━━━━━━━
✅ Appliqués: [count]
❌ Rejetés: [count]
🔄 Déjà traités: [count]
⏭️ Passés: [count]
━━━━━━━━━━━━━━━━━━━━
```

Update and display after each comment processed.

### 7. End of Session

When user says "stop", "fin", or there are no more comments:

```
╔══════════════════════════════════════════════════════════════╗
║              📊 Résumé de la Session de Review               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ✅ Corrections appliquées: [count]                          ║
║  ❌ Commentaires rejetés: [count]                            ║
║  🔄 Déjà traités: [count]                                    ║
║  ⏭️ Passés (skip): [count]                                   ║
║                                                              ║
║  📝 Commits créés: [count]                                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

💡 Prochaines étapes suggérées:
   - Vérifier les commits avec: git log --oneline -[count]
   - Pousser les changements avec: git push
   - Mettre à jour la PR avec les réponses aux commentaires
```

## Important Guidelines

### DO:
- ✅ Always read the file before suggesting changes
- ✅ Check git status before and after each change
- ✅ Use project commit conventions (Gitmoji)
- ✅ Explain your reasoning clearly
- ✅ Consider the broader project context
- ✅ Respect existing code patterns

### DON'T:
- ❌ Never push automatically (user controls when to push)
- ❌ Don't apply changes without showing the diff first
- ❌ Don't ignore project-specific standards
- ❌ Don't commit multiple unrelated changes together
- ❌ Don't guess file contents - always read first

## Error Handling

Handle gracefully:
- File not found → Ask user for correct path
- Already modified → Show current state, ask how to proceed
- Merge conflicts → Alert user, don't proceed
- Invalid comment format → Ask for clarification

## Example Interaction

```
User: [pastes CodeRabbit comment about unused import]

Claude:
📋 Analyse du commentaire
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏷️  Source: CodeRabbit
📁 Fichier: src/components/Header.tsx
📍 Lignes: 3
⚠️  Sévérité: 🟡 Minor

📝 Suggestion:
Remove unused import `useState` on line 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 VERDICT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Statut: ✅ PERTINENT

📝 Analyse:
L'import `useState` est effectivement présent mais non utilisé dans le composant.
ESLint devrait également le signaler.

🎯 Cohérence projet:
Conforme aux règles ESLint du projet (no-unused-vars).
Knip devrait détecter ce type de code mort.

💡 Recommandation:
Appliquer la correction - suppression de l'import inutilisé.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Modification proposée:

Fichier: src/components/Header.tsx

- import { useState, useEffect } from 'react'
+ import { useEffect } from 'react'

Appliquer cette correction ? [Oui/Non/Modifier]

User: Oui

Claude:
✅ Correction appliquée et commitée

📋 Commit: a1b2c3d
📝 Message: 🔥 chore(Header): remove unused useState import
📁 Fichier: src/components/Header.tsx

📊 Session: ✅ 1 | ❌ 0 | 🔄 0 | ⏭️ 0

Collez le prochain commentaire à analyser (ou "stop" pour terminer):
```

---

Now, process based on the mode determined by: $ARGUMENTS
