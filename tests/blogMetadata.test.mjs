import assert from "node:assert/strict";
import test from "node:test";

import {
  formatPostDate,
  getPostExcerpt,
  getReadingTimeMinutes,
  sortMarkdownPostsByDate,
} from "../src/utils/blogMetadata.ts";

function createPost({ title, date, excerpt, rawContent, url } = {}) {
  return {
    frontmatter: {
      title: title ?? "Post title",
      ...(date ? { date } : {}),
      ...(excerpt ? { excerpt } : {}),
    },
    rawContent: rawContent ?? (() => "Default content"),
    url: url ?? "/blog/post-title",
  };
}

test("getReadingTimeMinutes rounds up based on markdown body words", () => {
  const post = createPost({
    rawContent: () => `# Heading\n\n${Array.from({ length: 220 }, () => "word").join(" ")}`,
  });

  assert.equal(getReadingTimeMinutes(post), 2);
});

test("getPostExcerpt falls back to readable text stripped from markdown content", () => {
  const post = createPost({
    rawContent: () =>
      [
        "# Heading",
        "",
        "This **post** explains [metadata](https://example.com) helpers for readers.",
        "",
        "![Alt text](./image.png)",
      ].join("\n"),
    });

  assert.equal(
    getPostExcerpt(post),
    "This post explains metadata helpers for readers.",
  );
});

test("sortMarkdownPostsByDate keeps newest dated posts first and undated posts last", () => {
  const first = createPost({ title: "first", date: "Jan 1, 2024", url: "/blog/first" });
  const undatedA = createPost({ title: "undated-a", url: "/blog/undated-a" });
  const newest = createPost({ title: "newest", date: "Feb 1, 2024", url: "/blog/newest" });
  const undatedB = createPost({ title: "undated-b", url: "/blog/undated-b" });
  const sameDate = createPost({ title: "same-date", date: "Jan 1, 2024", url: "/blog/same-date" });

  const sorted = sortMarkdownPostsByDate([first, undatedA, newest, undatedB, sameDate]);

  assert.deepEqual(
    sorted.map((post) => post.url),
    ["/blog/newest", "/blog/first", "/blog/same-date", "/blog/undated-a", "/blog/undated-b"],
  );
});

test("sortMarkdownPostsByDate treats rollover dates as undated in supported formats", () => {
  const invalidIso = createPost({ title: "invalid-iso", date: "2024-02-31", url: "/blog/invalid-iso" });
  const validOlder = createPost({ title: "valid-older", date: "Jan 1, 2024", url: "/blog/valid-older" });
  const invalidNamed = createPost({
    title: "invalid-named",
    date: "Feb 31, 2024",
    url: "/blog/invalid-named",
  });
  const validNewest = createPost({ title: "valid-newest", date: "Mar 1, 2024", url: "/blog/valid-newest" });
  const undated = createPost({ title: "undated", url: "/blog/undated" });

  const sorted = sortMarkdownPostsByDate([invalidIso, validOlder, invalidNamed, validNewest, undated]);

  assert.deepEqual(sorted.map((post) => post.url), [
    "/blog/valid-newest",
    "/blog/valid-older",
    "/blog/invalid-iso",
    "/blog/invalid-named",
    "/blog/undated",
  ]);
});

test("formatPostDate normalizes supported frontmatter values without crashing on missing dates", () => {
  assert.equal(formatPostDate("Jan 27, 2024"), "Jan 27, 2024");
  assert.equal(formatPostDate("2024-01-27"), "Jan 27, 2024");
  assert.equal(formatPostDate(undefined), undefined);
});

test("formatPostDate returns undefined for rollover dates in supported formats", () => {
  assert.equal(formatPostDate("2024-02-31"), undefined);
  assert.equal(formatPostDate("Feb 31, 2024"), undefined);
});
