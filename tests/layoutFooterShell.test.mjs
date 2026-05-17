import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import test from "node:test";

const worktreePath = fileURLToPath(new URL("../", import.meta.url));
const buildOutDir = join(worktreePath, ".test-builds", "layout-footer-shell");
const shortSlug = "layout-footer-short-test";
const longSlug = "layout-footer-long-test";
const shortPagePath = join(worktreePath, "src", "pages", `${shortSlug}.astro`);
const longPagePath = join(worktreePath, "src", "pages", `${longSlug}.astro`);
const sourceGlobalCss = readFileSync(join(worktreePath, "src", "styles", "global.css"), "utf8");
const sourceFooterCss = readFileSync(join(worktreePath, "src", "styles", "Footer.css"), "utf8");

writeFileSync(
  shortPagePath,
  `---
import Layout from "../layouts/Layout.astro";
---

<Layout pageTitle="Layout Footer Short Test">
  <section>
    <p>Short page content.</p>
  </section>
</Layout>
`,
);

writeFileSync(
  longPagePath,
  `---
import Layout from "../layouts/Layout.astro";
const paragraphs = Array.from({ length: 48 }, (_, index) => "Long page paragraph " + (index + 1) + ".");
---

<Layout pageTitle="Layout Footer Long Test">
  <section>
    {paragraphs.map((paragraph) => <p>{paragraph}</p>)}
  </section>
</Layout>
`,
);

let shortHtml = "";
let longHtml = "";
let builtCss = "";

function readBuiltCssFromHtml(html) {
  const stylesheetPaths = Array.from(
    html.matchAll(/href="(\/_astro\/[^\"]+\.css)"/g),
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

  shortHtml = readFileSync(join(buildOutDir, shortSlug, "index.html"), "utf8");
  longHtml = readFileSync(join(buildOutDir, longSlug, "index.html"), "utf8");
  builtCss = readBuiltCssFromHtml(shortHtml);
} finally {
  rmSync(shortPagePath, { force: true });
  rmSync(longPagePath, { force: true });
  rmSync(buildOutDir, { force: true, recursive: true });
}

test("layout shell wraps content in a viewport-height flex column with footer after main content", () => {
  for (const html of [shortHtml, longHtml]) {
    assert.match(html, /<body class="page-shell">/i);
    assert.match(html, /<div class="page-shell__main">[\s\S]*?<div class="container main-container">/i);
    assert.match(html, /<main class="content-wrap">[\s\S]*?<\/main>/i);
    assert.match(html, /<footer class="site-footer">/i);

    const shellIndex = html.indexOf('<div class="page-shell__main">');
    const footerIndex = html.indexOf('<footer class="site-footer">');
    assert.notEqual(shellIndex, -1);
    assert.notEqual(footerIndex, -1);
    assert.ok(shellIndex < footerIndex, "expected footer to render after the flexing page shell");
  }
});

test("layout and footer CSS define a non-overlay sticky-footer shell", () => {
  assert.match(sourceGlobalCss, /body\.page-shell\s*\{[\s\S]*?min-height:\s*100vh;[\s\S]*?display:\s*flex;[\s\S]*?flex-direction:\s*column;/i);
  assert.match(sourceGlobalCss, /\.page-shell__main\s*\{[\s\S]*?flex:\s*1;[\s\S]*?display:\s*flex;/i);
  assert.match(sourceGlobalCss, /\.main-container\s*\{[\s\S]*?flex:\s*1;[\s\S]*?display:\s*flex;[\s\S]*?flex-direction:\s*column;/i);
  assert.match(sourceGlobalCss, /\.content-wrap\s*\{[\s\S]*?flex:\s*1;/i);
  assert.match(sourceFooterCss, /\.site-footer\s*\{[\s\S]*?flex-shrink:\s*0;[\s\S]*?position:\s*sticky;[\s\S]*?bottom:\s*0;[\s\S]*?z-index:\s*10;[\s\S]*?background:\s*var\(--main\);[\s\S]*?border-top:\s*1px solid #555;/i);
  assert.match(sourceFooterCss, /\.site-footer__inner\s*\{[\s\S]*?display:\s*flex;[\s\S]*?justify-content:\s*space-between;/i);

  assert.match(builtCss, /body\.page-shell\{[^}]*min-height:100vh[^}]*display:flex[^}]*flex-direction:column/i);
  assert.match(builtCss, /\.page-shell__main\{[^}]*flex:1[^}]*display:flex/i);
  assert.match(builtCss, /\.main-container\{[^}]*flex:1[^}]*display:flex[^}]*flex-direction:column/i);
  assert.match(builtCss, /\.content-wrap\{[^}]*flex:1/i);
  assert.match(builtCss, /\.site-footer\{[^}]*flex-shrink:0[^}]*position:sticky[^}]*bottom:0[^}]*z-index:10[^}]*background:var\(--main\)[^}]*border-top:1px solid #555/i);
});
