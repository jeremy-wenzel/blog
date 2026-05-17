# Project Context

- **Owner:** Jeremy Wenzel
- **Project:** Personal learning blog that shares things Jeremy learns
- **Stack:** Astro 5, TypeScript, React islands, Bootstrap, React-Bootstrap, Sass
- **Created:** 2026-05-15T14:45:10.201-07:00

## Learnings

- Astro is the primary framework, with React available for interactive islands.
- Bootstrap and Sass are already part of the styling stack.
- Frontend work should stay lightweight and blog-first rather than app-heavy.
- **Design Review (2026-05-15):** Color palette is strong and intentional (burnt orange + neon green + dark charcoal). Key polish opportunities: (1) typography + line-height for readability, (2) consistent vertical rhythm/spacing in blog posts, (3) styled code blocks with terminal-inspired border/background, (4) navigation context (breadcrumbs/metadata). Footer has known layout bug (overlaps content). These changes would modernize the aesthetic without gimmickry.
- **2026-05-15T19:19:50.476-07:00:** The approved footer finish keeps the existing flex-shell layout in `global.css` and narrows the footer styling to a sticky, bottom-anchored bar with `var(--main)` background, `#555` top border, and `z-index: 10`, guarded by the targeted layout/footer test.

## Work Log

**2026-05-15T22:02:56Z:** Posts index audit completed. Reviewed posts page readability and layout with focus on scanability, metadata hierarchy, grouping, and terminal-modern styling ideas.

**2026-05-15T22:05:51Z (Rusty):** Design direction decision recorded to squad decisions. Recommendation of Direction C (Hybrid Modern Terminal) now part of team governance. Awaiting Jeremy's approval and Danny's spec authoring to begin implementation work. Design spec will detail component breakdown, color/spacing tokens, and code block examples once direction is confirmed.
