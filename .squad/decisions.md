# Squad Decisions

## Active Decisions

### 2026-05-15T14:45:10.201-07:00: Initial squad composition
**By:** Squad
**What:** Initialized the project squad as Danny (Lead), Rusty (Frontend Dev), Basher (Platform Dev), Livingston (DevOps), Linus (Tester), plus Scribe and Ralph.
**Why:** The repo is a small Astro + TypeScript blog with automated build, release, and deployment concerns, so the team needs focused coverage for UI, site logic, release operations, and quality without overstaffing.

### 2026-05-15T14:45:10.201-07:00: Casting universe
**By:** Squad
**What:** Assigned persistent cast names from Ocean's Eleven for the initial specialist roster.
**Why:** The project fits a small coordinated ensemble, and the universe provides clear, distinct identifiers with enough capacity for future specialists.

### 2026-05-15T15:05:51.099-07:00: Spec Direction for Progressive Polish
**By:** Danny (Lead)
**What:** Recommend Direction 1: Progressive Polish for reading experience and visual improvements (footer sticky fix, blog list enrichment with date/excerpt/reading time, typography improvements, breadcrumbs, metadata schema).
**Why:** Fits one sprint with low risk; addresses core issues (footer bug, sparse blog list, weak reading experience); leaves door open for deeper terminal aesthetic work later.

### 2026-05-15T15:05:51.099-07:00: Frontend Design Direction - Blog Aesthetic
**By:** Rusty (Frontend Dev)
**What:** Provided three design direction options (A: Minimalist Archive, B: Structured Metadata Gallery, C: Hybrid Modern Terminal) with effort estimates and trade-offs.
**Why:** Multiple perspectives on balance between readability, visual personality, and implementation cost; recommendation is Direction C (Hybrid Modern Terminal) for best ROI.

### 2026-05-15T14:45:10.201-07:00: Blockquote Styling Scope
**By:** Danny (Lead)
**What:** Bracket-prefixed blockquotes deferred to future enhancement; left border styling (2px solid #bf5700) included in Progressive Polish scope.
**Why:** Progressive Polish prioritizes low-risk, high-impact improvements; bracket prefix requires content author coordination and is optional polish.

### 2026-05-15T15:41:11.914-07:00: Plan Revision - Blog Reading Experience (Single Implementer)
**By:** Rusty (Frontend Dev)
**What:** Updated the blog reading experience implementation plan to be executable by a single sequential implementer with 5 phases: Pre-Phase (Frontmatter schema normalization), Phase 1 (Metadata & layout foundation), Phase 2 (Typography & styling), Phase 3 (Footer sticky positioning), Phase 4 (Post breadcrumb & spacing), Phase 5 (QA & validation). Total: 11 logical steps, 9 code commits.
**Why:** Single-implementer focus provides clear linear workflow; Pre-Phase unblocks downstream work; footer work isolated for independent validation; test discipline and commit discipline ensure clean history.

### 2026-05-15T19:19:50.476-07:00: Footer Spec Alignment
**By:** Rusty (Frontend Dev)
**What:** Final footer slice aligned to approved spec: `.site-footer` must use `position: sticky`, `bottom: 0`, `z-index: 10`, `background: var(--main)`, and `border-top: 1px solid #555`.
**Why:** Closes footer review gap without reopening reading/listing work; targeted footer test protects exact contract approved by team.

### 2026-05-17T09:48:04.314-07:00: Vertical Blog Listing
**By:** Rusty (Frontend Dev)
**What:** Use single-column `.blog-card-list` for both home page (capped at 10 newest posts) and `/blog/` archive listing.
**Why:** Vertical scan aligns with editorial/terminal aesthetic; gives each card more room for title + excerpt; prevents home page from feeling dense.

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
