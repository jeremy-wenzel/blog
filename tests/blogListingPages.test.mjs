import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import test from "node:test";

import { sortMarkdownPostsByDate } from "../src/utils/blogMetadata.ts";

const worktreePath = fileURLToPath(new URL("../", import.meta.url));
const buildOutDir = join(worktreePath, ".test-builds", "blog-listing-pages");
const blogPostsPath = join(worktreePath, "src", "pages", "blog");
const blogPostFiles = readdirSync(blogPostsPath).filter((file) => file.endsWith(".md"));
const totalPosts = blogPostFiles.length;
const noMetadataPageName = "blog-card-no-metadata-test";
const noMetadataPagePath = join(worktreePath, "src", "pages", `${noMetadataPageName}.astro`);

writeFileSync(noMetadataPagePath, `---
import BlogCard from "../components/BlogCard.astro";

const post = {
  frontmatter: {
    title: "Rendered title",
  },
  rawContent: "",
  url: "/blog/rendered-route",
};
---

<BlogCard post={post} />
`);

let noMetadataHtml;
let indexHtml;
let archiveHtml;

try {
  rmSync(buildOutDir, { force: true, recursive: true });
  execFileSync("npm", ["exec", "--", "astro", "build", "--outDir", buildOutDir], {
    cwd: worktreePath,
    stdio: "pipe",
  });

  noMetadataHtml = readFileSync(join(buildOutDir, noMetadataPageName, "index.html"), "utf8");
  indexHtml = readFileSync(join(buildOutDir, "index.html"), "utf8");
  archiveHtml = readFileSync(join(buildOutDir, "blog", "index.html"), "utf8");
} finally {
  rmSync(noMetadataPagePath, { force: true });
  rmSync(buildOutDir, { force: true, recursive: true });
}

function countBlogCards(source) {
  return source.match(/data-blog-card(?=[\s>])/g)?.length ?? 0;
}

function decodeHtmlEntities(value) {
  return value
    ?.replaceAll("&quot;", '"')
    ?.replaceAll("&#39;", "'")
    ?.replaceAll("&amp;", "&")
    ?.replaceAll("&lt;", "<")
    ?.replaceAll("&gt;", ">");
}

function parseFrontmatterValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim().replace(/^['"](.*)['"]$/, "$1");
}

function readMarkdownPosts() {
  return blogPostFiles.map((file) => {
    const source = readFileSync(join(blogPostsPath, file), "utf8");
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    const frontmatter = match?.[1] ?? "";
    const rawContent = match?.[2] ?? "";

    return {
      frontmatter: {
        date: parseFrontmatterValue(frontmatter, "date"),
        title: parseFrontmatterValue(frontmatter, "title"),
      },
      rawContent,
      url: `/blog/${file.replace(/\.md$/, "")}`,
    };
  });
}

function extractBlogCards(source) {
  return Array.from(
    source.matchAll(/<article class="blog-card"[^>]*data-blog-card[^>]*>([\s\S]*?)<\/article>/g),
    ([cardHtml]) => {
      const titleAndLinkMatch = cardHtml.match(
        /<h2 class="blog-card__title"[\s\S]*?<a href="([^"]+)"[^>]*>\s*([^<]+?)\s*<\/a>/,
      );
      const eyebrowMatch = cardHtml.match(/<div class="blog-card__eyebrow"[^>]*>\s*([^<]+?)\s*<\/div>/);

      return {
        eyebrow: eyebrowMatch?.[1],
        href: titleAndLinkMatch?.[1],
        title: decodeHtmlEntities(titleAndLinkMatch?.[2]),
      };
    },
  );
}

test("home page renders the newest 10 posts in a vertical preview list using their real routes", () => {
  const expectedPreviewPosts = sortMarkdownPostsByDate(readMarkdownPosts())
    .slice(0, 10)
    .map((post) => ({
      eyebrow: `cat ${post.url}`,
      href: post.url,
      title: post.frontmatter.title,
    }));
  const actualPreviewPosts = extractBlogCards(indexHtml);

  assert.match(indexHtml, /Latest Posts/i);
  assert.match(indexHtml, /href="\/blog\/"/i);
  assert.match(indexHtml, /data-blog-card-list="vertical"/);
  assert.doesNotMatch(indexHtml, /row g-4/);
  assert.doesNotMatch(indexHtml, /col-12 col-md-6 col-xl-4/);
  assert.equal(countBlogCards(indexHtml), Math.min(10, totalPosts));
  assert.deepEqual(actualPreviewPosts, expectedPreviewPosts);
});

test("blog archive renders the full vertical list with metadata and excerpt fallbacks", () => {
  assert.match(archiveHtml, /data-blog-card-list="vertical"/);
  assert.doesNotMatch(archiveHtml, /row g-4/);
  assert.doesNotMatch(archiveHtml, /col-12 col-md-6 col-xl-4/);
  assert.equal(countBlogCards(archiveHtml), totalPosts);
  assert.match(archiveHtml, /Jan 27, 2024/);
  assert.match(archiveHtml, /min read/);
  assert.match(archiveHtml, /While testing some functionality with AlarmKit/i);

  const azureIndex = archiveHtml.indexOf("Azure Function HTTP authentication with Managed Identities");
  const alarmKitIndex = archiveHtml.indexOf("AlarmKit simulator bugs");

  assert.notEqual(azureIndex, -1);
  assert.notEqual(alarmKitIndex, -1);
  assert.ok(azureIndex < alarmKitIndex, "expected newest dated post to appear before undated posts");
});

test("BlogCard omits an empty metadata wrapper when no metadata is available", () => {
  assert.doesNotMatch(noMetadataHtml, /<div class="blog-card__meta"/);
});
