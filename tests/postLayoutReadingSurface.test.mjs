import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import test from "node:test";

const worktreePath = fileURLToPath(new URL("../", import.meta.url));
const buildOutDir = join(worktreePath, ".test-builds", "post-layout-reading-surface");
const slug = "reading-surface-polish-test";
const markdownPagePath = join(worktreePath, "src", "pages", `${slug}.md`);

writeFileSync(
  markdownPagePath,
  `---
 layout: ../layouts/PostLayout.astro
 title: "Reading Surface Polish Test"
 date: "2026-05-15"
---

This paragraph includes \`inline code\` so the reading surface can prove inline code styling.

- First list item
- Second list item

> A quote that should feel distinct from the rest of the article body.

\`\`\`js
console.log("reading surface");
\`\`\`
`,
);

let postHtml = "";
let builtCss = "";
const sourceCss = readFileSync(join(worktreePath, "src", "styles", "global.css"), "utf8");

function readBuiltCssFromHtml(html) {
  const stylesheetPaths = Array.from(
    html.matchAll(/href="(\/_astro\/[^"]+\.css)"/g),
    ([, href]) => join(buildOutDir, href.replace(/^\//, "")),
  );
  const inlineStyles = Array.from(
    html.matchAll(/<style(?:[^>]*)>([\s\S]*?)<\/style>/g),
    ([, css]) => css,
  );

  return [...inlineStyles, ...stylesheetPaths.map((path) => readFileSync(path, "utf8"))].join("\n");
}

try {
  rmSync(buildOutDir, { force: true, recursive: true });
  execFileSync("npm", ["exec", "--", "astro", "build", "--outDir", buildOutDir], {
    cwd: worktreePath,
    stdio: "pipe",
  });

  postHtml = readFileSync(join(buildOutDir, slug, "index.html"), "utf8");
  builtCss = readBuiltCssFromHtml(postHtml);
} finally {
  rmSync(markdownPagePath, { force: true });
  rmSync(buildOutDir, { force: true, recursive: true });
}

test("blog posts render a polished reading surface structure", () => {
  assert.match(postHtml, /<article class="post-article">/i);
  assert.match(postHtml, /<header class="post-header">/i);
  assert.match(postHtml, /<div class="post-content">/i);
  assert.match(postHtml, /<blockquote>/i);
  assert.match(postHtml, /<ul>/i);
  assert.match(postHtml, /<pre[^>]*>/i);
  assert.match(postHtml, /<code>inline code<\/code>/i);

  assert.match(builtCss, /\.post-content p\{/);
  assert.match(builtCss, /\.post-content ul,\s*\.post-content ol\{/);
  assert.match(builtCss, /\.post-content blockquote\{/);
  assert.match(builtCss, /\.post-content :not\(pre\)>code\{/);
  assert.match(builtCss, /\.post-content pre\{/);
  assert.match(builtCss, /body\{[^}]*font-family:ui-monospace/i);
  assert.match(builtCss, /body\{[^}]*line-height:1\.6/i);
  assert.match(builtCss, /h1,h2,h3,h4,h5,h6\{[^}]*font-family:-apple-system/i);
});

test("blog posts link the breadcrumb back to /blog/ exactly", () => {
  assert.match(
    postHtml,
    /<nav class="post-breadcrumb" aria-label="Breadcrumb">[\s\S]*?<a href="\/blog\/">[\s\S]*?Back to Blog[\s\S]*?<\/a>[\s\S]*?<\/nav>/i,
  );
});

test("blog post code blocks set the spec font size on pre elements", () => {
  assert.match(sourceCss, /\.post-content pre\s*\{[\s\S]*?font-size:\s*0\.9rem;/i);
  assert.match(builtCss, /\.post-content pre\{[^}]*font-size:\.9rem/i);
});

test("reading-surface styles derive text-tint variants from semantic tokens", () => {
  assert.match(sourceCss, /--text-rgb:\s*243,\s*243,\s*243;/i);
  assert.match(sourceCss, /--surface-border-subtle:\s*rgba\(var\(--text-rgb\),\s*0\.12\);/i);
  assert.match(sourceCss, /--text-muted:\s*rgba\(var\(--text-rgb\),\s*0\.75\);/i);
  assert.match(sourceCss, /--text-soft:\s*rgba\(var\(--text-rgb\),\s*0\.85\);/i);
  assert.match(sourceCss, /--surface-code-inline:\s*rgba\(var\(--text-rgb\),\s*0\.08\);/i);
  assert.match(sourceCss, /\.post-header\s*\{[\s\S]*?border-bottom:\s*1px solid var\(--surface-border-subtle\);/i);
  assert.match(sourceCss, /\.post-date\s*\{[\s\S]*?color:\s*var\(--text-muted\);/i);
  assert.match(sourceCss, /\.post-content blockquote\s*\{[\s\S]*?color:\s*var\(--text-soft\);/i);
  assert.match(sourceCss, /\.post-content :not\(pre\) > code\s*\{[\s\S]*?background:\s*var\(--surface-code-inline\);/i);
  assert.doesNotMatch(sourceCss, /rgba\(243,\s*243,\s*243,\s*0\.(?:08|12|75|85)\)/i);
});
