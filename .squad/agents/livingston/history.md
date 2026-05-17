# Project Context

- **Owner:** Jeremy Wenzel
- **Project:** Personal learning blog that shares things Jeremy learns
- **Stack:** Astro 5, TypeScript, React islands, Bootstrap, React-Bootstrap, Sass
- **Created:** 2026-05-15T14:45:10.201-07:00

## Recent Activity

📌 Commit-and-merge handoff completed on 2026-05-17T10:03:26Z  
   - Feature commit b493524 merged into dev  
   - Follow-up commit 81cd4c6 preserving main-repo adjustments  
   - Orchestration log created and documented

## Learnings

- The project uses an automated build and release flow for deployment.
- Delivery work needs to preserve both `astro check` and `astro build`.
- Release artifacts are consumed by a separate deployment server, so handoff stability matters.
- Worktree isolation + merge coordination maintains clean git history across team handoffs.
