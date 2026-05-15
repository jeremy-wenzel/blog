# Blog Reading Experience — Progressive Polish Design Spec

**Version:** 1.0  
**Date:** 2026-05-15  
**Direction:** Progressive Polish  
**Owner:** Danny (Lead), Rusty (Frontend)  
**Status:** Approved & Ready for Implementation

---

## 1. Problem & Goal

### Problem
The blog's reading experience is minimal and underdeveloped:
- Blog lists lack metadata (publication date, excerpt, reading time), creating low information scent
- Blog post pages have no breadcrumb navigation or related post hints
- Typography is unoptimized for long-form reading (no monospace identity, inadequate line-height, poor visual hierarchy)
- Footer has a documented bug (sticky positioning breaks on scroll, overlays content)
- Terminal aesthetic is implied by color scheme (#2c2c2c bg, #00ff00 links, #bf5700 accent) but underbaked in typography and interactions
- Navigation is minimal; pages are skeletal

### Goal
Deliver a polished, professional reading experience that feels intentional, modern, and terminal-grounded without being retro. Improve metadata richness, typography, and visual hierarchy. Fix known layout bugs. This is a low-risk, high-impact design direction that fits one sprint.

---

## 2. Scope

### Included
- **Layout fixes:** Footer sticky positioning, flexbox rework
- **Blog list enrichment:** Display publication date, excerpt, reading time; grid layout; sort by date descending
- **Blog post flow:** Breadcrumb ("Back to Blog"), increased line-height for readability, consistent margins/padding, subtle left borders on blockquotes
- **Typography improvements:** Monospace body font (system-first fallback: `ui-monospace, 'SF Mono', 'Monaco', monospace`), sans-serif heading font for visual contrast, improved spacing and baseline alignment
- **Terminal aesthetic refinement:** Link underlines on hover, styled code blocks with #353535 background, consistent color use
- **Metadata schema:** Add optional `excerpt` field to post frontmatter; compute `readingTime` dynamically from word count (assume 200 wpm)

### Deferred (Future Directions)
- Page consolidation (home → blog merge)
- Advanced terminal redesign (comprehensive visual overhaul)
- Bracket-prefixed blockquotes (CSS `::before` content; opt-in per post)
- Rich metadata model (tags, categories, authors, featured flag)
- Post search/filtering
- Dark/light mode toggle

---

## 3. Current State

### File Structure
```
src/
  pages/
    index.astro          # Home page; lists all posts (TODO: "maybe only latest few")
    blog.astro           # Blog page; lists all posts (identical to index)
    blog/
      *.md               # Blog posts with title and date frontmatter
  layouts/
    Layout.astro         # Base container; imports Navigation, Footer, global.css
    PostLayout.astro     # Blog post wrapper; renders title and date
  components/
    Navigation.astro     # Top nav bar with brand and /blog link
    Footer.tsx           # Footer with social links; has sticky positioning bug
  styles/
    global.css           # Color variables, body/link styles, .main-container/.content-wrap
    Footer.css           # Footer layout (broken)
```

### Current Styling
- **Colors:** --main=#2c2c2c (bg), --text=#f3f3f3 (text), --link=#00ff00 (green links), --primary=#bf5700 (burnt orange accent), --hover=#bf5700
- **Font:** System default (no monospace or serif specified)
- **Layout:** Flexbox nav bar; .main-container with min-height 97vh; .content-wrap with padding-bottom 2.5rem
- **Links:** Green, no underline; underline on hover; orange text on hover

### Metadata Support
- Frontmatter: `title`, `date`
- Missing: `excerpt`, `readingTime` (not computed)

### Known Issues
1. Footer overlays content on scroll (sticky positioning conflict)
2. Blog lists are bare—no metadata display, no visual hierarchy, no sorting
3. Blog post page lacks breadcrumb and navigation hints
4. Typography is not optimized for long-form reading

---

## 4. Design Direction: Progressive Polish

**Principle:** Refine existing aesthetics without major overhaul. Improve information density and reading flow. Keep scope tight and risk low.

### Core Tenets
1. **Terminal aesthetic is intentional, not retro.** Use monospace for body text (terminal identity), sans-serif for headings (visual contrast). Favor generous whitespace over dense layouts.
2. **Metadata is visible and accessible.** Dates, excerpts, and reading time are displayed with clear visual distinction (smaller, dimmed text).
3. **Reading flow is legible.** Increased line-height (1.6–1.8), consistent margins, left borders on blockquotes.
4. **Links have texture.** Underline on hover signals interactivity. Color remains green (#00ff00) and orange (#bf5700) on hover.
5. **Layout bugs are fixed.** Footer is sticky without overlay; blog list has card structure.

---

## 5. Changes by Surface

### 5.1 Blog List (index.astro, blog.astro)

**Current:**
```
<ul>
  <li><a href={post.url}>{post.frontmatter.title}</a></li>
</ul>
```

**Target:**
- Render as card grid (2–3 columns on desktop, 1 on mobile)
- Display per post:
  - Title (large, primary color)
  - Publication date (small, dimmed)
  - Excerpt (2–3 lines, --text color)
  - Reading time (small, dimmed, e.g., "5 min read")
  - Link to post (explicit "Read →" or post title as link)
- Sort by date descending (newest first)
- Card styling: subtle border, padding, hover effect (slight lift, color shift)

**Implementation Note:** Use CSS Grid or Bootstrap's grid classes. Store excerpt in post frontmatter; compute reading time from word count on render.

---

### 5.2 Blog Post Page (PostLayout.astro)

**Current:**
```
<Layout pageTitle={frontmatter.title}>
  <h1>{frontmatter.title}</h1>
  <p>{frontmatter.date}</p>
  <slot />
</Layout>
```

**Target:**
- Add breadcrumb above title: "← Back to Blog" (link to /blog)
- Preserve title and date
- Increase line-height to 1.6–1.8 for body text
- Add consistent left border (2px, --hover color) to blockquotes
- Style code blocks: #353535 background, padding, font-family monospace, overflow scrollable
- Add spacing between content sections (consistent margin-top 2rem)

**Implementation Note:** Breadcrumb is a simple link in PostLayout. Line-height and blockquote styling go in global.css or scoped style block.

---

### 5.3 Typography Improvements (global.css)

**Changes:**
1. **Body font:** Add `font-family: ui-monospace, 'SF Mono', 'Monaco', monospace;` to `body` rule
2. **Heading font:** Apply to `h1, h2, h3, h4, h5, h6`: `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;` (system sans-serif for visual contrast with monospace body)
3. **Line-height:** Set `body { line-height: 1.6; }` for readability
4. **Letter-spacing:** Slight increase for monospace body text: `letter-spacing: 0.3px;`
5. **Link styling:** Preserve green (#00ff00) and orange (#bf5700) on hover; add `text-decoration: underline;` on hover (already done)

**Fallback Behavior:** If monospace font is unavailable, graceful degradation to system mono. If heading font is unavailable, falls back to system sans-serif.

---

### 5.4 Terminal Aesthetic Details (global.css, component styles)

**Code Blocks:**
- Background: #353535 (slightly lighter than main bg for contrast)
- Padding: 1rem
- Border-radius: 4px
- Font-family: monospace
- Font-size: 0.9rem
- Overflow: auto (horizontal scroll for long lines)
- Border: 1px solid #555 (subtle outline)

**Blockquotes:**
- Left border: 2px solid --hover (#bf5700)
- Padding-left: 1rem
- Margin-left: 0
- Font-style: italic (optional; test for readability)
- Optional: Prefix with "> " in content or CSS ::before (requires content author opt-in)

**Links:**
- Color: --link (#00ff00)
- Text-decoration: none
- On hover: --hover (#bf5700), underline

**Navigation Bar:**
- Brand: --primary color, no underline
- Links: --link color, underline on hover (inherited)

**Footer:**
- Background: rgba(0, 0, 0, 0.8) or var(--main)
- Sticky positioning: `position: sticky; bottom: 0;` with proper z-index
- Layout: Flexbox, centered, with social links and copyright
- Padding: 1.5rem
- Border-top: 1px solid #555 (subtle separator)

---

### 5.5 Footer Bug Fix

**Current Issue:**
Footer uses sticky positioning but overlays content on scroll because `.main-container` has `min-height: 97vh` without accounting for footer height.

**Fix:**
1. Change `.main-container` to use flexbox: `display: flex; flex-direction: column; min-height: 100vh;`
2. Set `.content-wrap` to `flex: 1;` (grows to fill available space)
3. Move Footer outside `.main-container` in Layout.astro (already is)
4. Set Footer to `position: sticky; bottom: 0;` with `z-index: 10;` and `background: var(--main);`
5. Add top border to Footer for visual separation: `border-top: 1px solid #555;`

**Result:** Footer sticks to bottom without overlay; content scrolls above it cleanly.

---

## 6. Metadata & Model Changes

### 6.1 Post Frontmatter Schema

**Existing:**
```yaml
---
title: "Post Title"
date: "2026-05-15"
---
```

**Add (Optional):**
```yaml
---
title: "Post Title"
date: "2026-05-15"
excerpt: "A 1-2 sentence summary of the post. Optional; if omitted, first 160 chars of content is used."
---
```

**Rationale:** Excerpt allows authors to customize blog list preview. If omitted, a fallback extracts the first paragraph or first 160 characters.

### 6.2 Reading Time Calculation

**Implementation:**
- Compute in blog list component (index.astro, blog.astro)
- Formula: `Math.ceil(wordCount / 200)` (assume 200 wpm average)
- Word count from post `content` or stripped Markdown body
- Display as "X min read" or "X–Y min read" (range for 1–2 minute fuzziness)
- Cache result if possible (static generation); avoid recalc on every render

**Fallback:** If word count cannot be determined, omit reading time or display "~5 min" default.

---

## 7. Fallback Behavior

### Typography Fallbacks
- **Monospace:** `ui-monospace, 'SF Mono', 'Monaco', 'Courier New', monospace`
- **Heading font:** System sans-serif (inherits from browser default or explicit fallback)
- **Line-height:** Defaults to browser 1.2 if CSS is not applied

### Missing Metadata Fallbacks
- **Excerpt:** If not provided in frontmatter, extract first 160 characters of post content
- **Reading time:** If word count cannot be parsed, omit display or show "~5 min"
- **Date:** Display as-is from frontmatter; if missing, blog list entry is incomplete but doesn't crash

### Visual Fallbacks
- **CSS Grid:** Blog list falls back to single-column list if Grid is not supported (unlikely in modern browsers; acceptable graceful degradation)
- **Code block styling:** If colors are not applied, code still renders with monospace font; readability is maintained

---

## 8. Validation & Success Criteria

### Visual Criteria
- [ ] Blog list renders as multi-column card grid on desktop; single column on mobile
- [ ] Card layout has clear visual hierarchy: title > excerpt > date/reading time
- [ ] Blog post page displays breadcrumb ("← Back to Blog") above title
- [ ] Post content renders with line-height ≥ 1.6
- [ ] Blockquotes have left orange (#bf5700) border
- [ ] Code blocks have #353535 background, padding, scrollable overflow
- [ ] Links are green (#00ff00), underlined on hover, orange (#bf5700) on hover
- [ ] Footer is sticky at bottom without overlay; content scrolls cleanly above it

### Metadata Criteria
- [ ] Blog posts with `excerpt` field display custom excerpt in blog list
- [ ] Posts without `excerpt` fall back to auto-extracted first 160 chars
- [ ] Reading time is calculated and displayed as "X min read" for all posts
- [ ] Posts are sorted by date descending (newest first)

### Browser Compatibility
- [ ] Renders without JavaScript errors in Chrome, Firefox, Safari (desktop and mobile)
- [ ] Flexbox and CSS Grid are standard; no polyfills needed
- [ ] Monospace and system fonts degrade gracefully

### Build & Performance
- [ ] `npm run build` succeeds with no errors or warnings
- [ ] Static site generation completes in <30 seconds
- [ ] No console errors or warnings in dev mode (`npm run dev`)

### Content Stability
- [ ] All existing blog posts are still accessible via their URLs
- [ ] No content is modified or lost
- [ ] Home and blog pages still list all posts (same as before, just richer display)

---

## 9. Phased Implementation

### Phase 1: Metadata & Layout Foundation (Day 1–2)
1. Add `excerpt` field to all existing blog post frontmatter (or script auto-extraction)
2. Implement reading time calculation component
3. Update blog list template (index.astro, blog.astro) to render cards with metadata
4. Test sorting (newest first) and fallback extraction

**Deliverable:** Blog lists are enriched; metadata is accessible.

### Phase 2: Typography & Styling (Day 2–3)
1. Update global.css with monospace body font, heading font, line-height
2. Style code blocks with #353535 background, monospace font, padding, overflow
3. Style blockquotes with left orange border
4. Test readability on sample posts

**Deliverable:** Typography is professional and legible; terminal aesthetic is refined.

### Phase 3: Layout Fixes & Polish (Day 3–4)
1. Fix footer sticky positioning bug (flexbox rework, z-index, top border)
2. Add breadcrumb to PostLayout.astro
3. Add post navigation spacing (margin-top 2rem between sections)
4. Test footer on pages of varying heights
5. Test breadcrumb on all post pages

**Deliverable:** Layout is clean and stable; footer doesn't overlay; navigation is clear.

### Phase 4: QA & Launch (Day 4)
1. Self-review spec for contradictions, placeholders, ambiguity
2. Run `npm run build` and verify no errors
3. Test in dev mode: home, blog list, individual posts
4. Verify all metadata displays correctly
5. Check browser compatibility (Chrome, Firefox, Safari)
6. Merge to dev

**Deliverable:** All criteria met; spec is validated; code is ready for merge.

---

## 10. Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Font fallbacks fail or render poorly | Typography looks bad | Use system-first font stacks; test on multiple OS |
| Footer fix introduces layout regression | Content is misaligned | Thorough testing on pages of varying heights; preserve existing margin-bottom logic |
| Reading time calculation is inaccurate | Misleading metadata | Use conservative 200 wpm estimate; display as approximate ("~5 min") |
| Excerpt extraction loses formatting | Poor preview quality | Manual excerpt field in frontmatter preferred; auto-extraction is fallback only |
| Blog list grid breaks on older browsers | Layout fails | Test on IE11 is not required; acceptable modern-only browser support |

---

## 11. Design Notes & Rationale

- **Progressive Polish over Terminal-First:** Keeps scope tight and risk low. Fixes known issues. Improves reading experience immediately. Leaves door open for deeper terminal aesthetic work (Phase 2 future).
- **Monospace body font:** Emphasizes terminal identity without sacrificing readability. System-first stack ensures compatibility.
- **Metadata display:** Excerpt and reading time are high-value signals for readers; enable discovery and set expectations.
- **Breadcrumb:** Simple navigation aid; critical for long-form pages where readers need context.
- **Blockquote styling:** Left border is subtle, non-intrusive, and consistent with terminal aesthetic (borders are structural, not decorative).
- **Footer fix:** Removes a known bug and unblocks future layout work.

---

## 12. Files to Modify

1. **src/styles/global.css** — Typography, body font, blockquote styles, code block styles, line-height
2. **src/pages/index.astro** — Blog list template with card layout, metadata display, sorting
3. **src/pages/blog.astro** — Same as index.astro (consider future consolidation)
4. **src/layouts/PostLayout.astro** — Add breadcrumb, spacing
5. **src/layouts/Layout.astro** — Flexbox rework for footer fix
6. **src/components/Footer.tsx** — Update CSS class references if needed; Footer.css changes
7. **src/styles/Footer.css** — Fix sticky positioning bug
8. **src/pages/blog/*.md** — Add `excerpt` field to frontmatter (if not auto-extracted)
9. **package.json** — No changes required

---

## Appendix: Example Post Frontmatter

### Before
```yaml
---
title: "Azure Function Managed Identity Auth"
date: "2026-02-16"
---
```

### After
```yaml
---
title: "Azure Function Managed Identity Auth"
date: "2026-02-16"
excerpt: "How to set up managed identity authentication for Azure Functions without managing secrets. A practical guide with code examples."
---
```

---

## Approval & Sign-Off

**Approved by:** Jeremy Wenzel (Product)  
**Approved by:** Danny (Lead)  
**Ready for:** Rusty (Frontend Implementation)  

**Approval Date:** 2026-05-15  
**Target Completion:** 2026-05-18  
