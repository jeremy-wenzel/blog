# Project Context

- **Owner:** Jeremy Wenzel
- **Project:** Personal learning blog that shares things Jeremy learns
- **Stack:** Astro 5, TypeScript, React islands, Bootstrap, React-Bootstrap, Sass
- **Created:** 2026-05-15T14:45:10.201-07:00

## Learnings

- The site builds with `npm run build`, which runs `astro check && astro build`.
- Repo changes create releases that are picked up by a deployment server.
- This is a small web project, so lean coordination and clear scope matter more than heavy process.
- Blog posts include title and date in frontmatter; excerpt and reading time are not yet structured.
- Home and blog pages currently list the same content (redundant entry points); decision on consolidation deferred.

## 2026-05-15T14:57:54.346-07:00: Design Review — Reading Experience & Terminal Aesthetic

**Request:** Jeremy asked for a design audit focusing on reader experience, modern feel, and terminal-adjacent identity refinement.

**Audit Scope:** Reviewed Layout.astro, PostLayout.astro, Navigation, Footer, global.css, blog list, and sample posts.

**Key Findings:**
- Color scheme is already terminal-grounded (dark bg, neon green links, burnt orange accent).
- Blog lists are skeletal—no metadata (dates, excerpts, reading time), no visual hierarchy.
- Blog post reading experience is minimal—no breadcrumbs, typography not optimized for long-form, no post navigation hints.
- Footer has a known bug (doesn't stick to bottom; overlays content on scroll).
- Terminal aesthetic is present in palette but underbaked in execution (no monospace, no link texture, code blocks unstyled).
- Home and blog pages are redundant.
- Bootstrap is loaded but underutilized.

**Recommendations (Prioritized):**
1. **Fix footer:** Sticky positioning + flexbox container rework to resolve overlay bug.
2. **Enrich blog list:** Add date, excerpt, reading time; use card grid layout; sort by date.
3. **Strengthen terminal aesthetic:** Monospace body font (JetBrains Mono, Fira Code, or system mono), underlined link hover, styled code blocks with `#353535` bg, bracket-prefixed blockquotes.
4. **Improve post flow:** Breadcrumb ("Back to Blog"), increase line-height to 1.6–1.8, consistent margins/padding, subtle left borders on blockquotes.
5. **Consolidate entry pages:** Either merge home → blog, or differentiate (hero + featured vs. full archive).

**Design Direction:**
Terminal aesthetic should be deliberate and polished, not retro. Emphasize intentional typography, clear hierarchy, generous whitespace. Links should have texture (underline, hover background fade). Metadata should be sized/colored distinctly. The site should feel like navigating a thoughtful system, not a Web 1.0 artifact.

**Files Referenced:**
- src/layouts/Layout.astro (base structure)
- src/layouts/PostLayout.astro (blog post rendering, has code-block TODOs)
- src/styles/global.css (color scheme, base styles)
- src/styles/Footer.css (footer layout issue documented)
- src/components/Navigation.astro (brand, nav links)
- src/components/Footer.tsx (social links, copyright)
- src/pages/index.astro (home page, lists all posts)
- src/pages/blog.astro (blog page, same content as home)
- src/pages/blog/*.md (substantive, opinion-driven posts)

## 2026-05-15T15:05:51.099-07:00: Spec Direction Proposal — Reading Experience & Polish

**Request:** Jeremy asked for spec document options covering whole-site reading experience, visual polish, posts index improvements, and metadata/model changes.

**Approach:** Surveyed three viable directions with clear trade-offs, recommended one to keep scope focused and risk low.

**Three Directions Evaluated:**
1. **Progressive Polish** (RECOMMENDED) — Fix footer bug, enrich blog list with date/excerpt/reading time, improve typography, add breadcrumbs. Low risk, visible impact, fits one sprint.
2. **Terminal-First Redesign** — Complete visual overhaul with cohesive terminal identity, page consolidation, rich metadata model, advanced styling. Higher scope and risk, but delivers unified identity.
3. **Metadata-First (Lean Foundation)** — Enhance frontmatter structure and reading flow; defer visual polish. Lowest risk, but defers the visible improvements Jeremy prioritized.

**Recommended Direction:** Progressive Polish
- Fixes known issues (footer, sparse blog list)
- Improves reading experience (better typography, breadcrumbs, metadata)
- Low risk (CSS, layout, metadata augmentation)
- Scope fits one design spec + implementation plan
- Leaves door open for deeper terminal aesthetic work later

**Metadata Schema (Progressive Polish):** Add optional `excerpt` field to all post frontmatter; compute `readingTime` from word count (default ~200 wpm).

**Decision Pending:** Jeremy approval on direction; once approved, Rusty (Frontend) will own component design, Basher coordinates build/deploy.

## 2026-05-15T15:05:51.099-07:00: Spec Authoring — Blog Reading Experience Design

**Request:** Jeremy approved Progressive Polish direction and asked for a validated design spec document covering problem/goal, scope, current state, design direction, changes by surface, metadata/model changes, fallback behavior, validation criteria, and phased implementation.

**Work Done:**
1. Authored comprehensive spec to `docs/superpowers/specs/2026-05-15-blog-reading-experience-design.md` (406 lines)
2. Self-reviewed for placeholders, contradictions, ambiguity, and scope drift; fixed:
   - Moved "bracket-prefixed blockquotes" from Included to Deferred (optional polish, not critical)
   - Clarified typography: monospace body + sans-serif headings (for contrast), not serif
   - Corrected problem statement to focus on optimization gaps, not specific font families
3. Staged and committed spec with required Co-authored-by trailer
4. Commit: 822670b

**Spec Coverage:**
- **Problem & Goal:** Clear statement of reading experience issues (metadata-sparse lists, minimal typography, footer bug)
- **Scope:** Tightly defined Included work (footer fix, blog list enrichment, typography improvements, breadcrumbs); deferred items clearly separated
- **Current State:** Accurate file inventory, current styling baseline, known issues, metadata support gaps
- **Design Direction:** Progressive Polish principle with 5 core tenets (intentional terminal aesthetic, visible metadata, legible reading flow, textured links, fixed layout bugs)
- **Changes by Surface:** Detailed per-page/per-component specifications with before/after examples
- **Metadata & Model:** Optional excerpt field + dynamic reading time calculation (200 wpm)
- **Fallback Behavior:** Typography font stacks, missing metadata extraction, visual graceful degradation
- **Validation Criteria:** 12 visual criteria, 4 metadata criteria, browser compat, build perf, content stability
- **Phased Implementation:** 4-phase plan (Metadata foundation, Typography/styling, Layout fixes, QA) with phase deliverables
- **Risk & Mitigation:** 5 identified risks with concrete mitigations

**Handoff Status:** Spec is approved, self-reviewed, validated, and ready for Rusty (Frontend) implementation. Includes phased implementation plan to fit one sprint.

## 2026-05-15T22:05:51Z: Decision Archival — Blockquote Styling Scope

**Team Decision Recorded:** Bracket-prefixed blockquotes deferred to future enhancement; left border styling (2px solid #bf5700) confirmed as included in Progressive Polish scope.

**Rationale:** Progressive Polish prioritizes low-risk, high-impact improvements that fit one sprint. Bracket prefix requires content author coordination and is optional polish; left border alone delivers terminal aesthetic signal without refactoring overhead.

**Impact:** Rusty (Frontend) will implement only left-border blockquote styling for Progressive Polish. Bracket prefix can be revisited in Terminal-First Redesign phase if approved.


## 2026-05-15T22:05:51Z: Implementation Plan Review & Parallelization Assessment

**Role:** Lead

**Task:** Review implementation plan task breakdown for parallelization readiness and decomposition.

**Outcome:** Determined the plan is executable for a single implementer but not decomposed enough for parallel squad execution.

**Key Findings:**
- Current plan structure viable for sequential execution by single agent
- Insufficient granularity for parallel task distribution across multiple team members

**Recommendations:**
1. Split metadata utility into discrete, independently-executable tasks
2. Separate BlogCard build from polish/refinement phases to allow parallel work
3. Reorder frontmatter audit to precede breadcrumb work (dependency resolution)

**Impact:** Plan restructuring will enable team parallelization and reduce critical path for implementation phase.
