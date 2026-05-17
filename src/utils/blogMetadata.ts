type BlogFrontmatter = {
  date?: string;
  excerpt?: string;
  title?: string;
};

export type AstroMarkdownPage = {
  frontmatter: BlogFrontmatter;
  rawContent?: string | (() => string);
  url?: string;
};

const READING_WORDS_PER_MINUTE = 200;
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const NAMED_DATE_PATTERN = /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/;
const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

function createValidatedUtcDate(year: number, month: number, day: number): Date | undefined {
  const date = new Date(Date.UTC(year, month, day));

  return date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() === day
    ? date
    : undefined;
}

function getRawContent(post: AstroMarkdownPage): string {
  if (typeof post.rawContent === "function") {
    return post.rawContent();
  }

  return typeof post.rawContent === "string" ? post.rawContent : "";
}

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/(\*\*|__|\*|_|~~)/g, "")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateExcerpt(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content;
  }

  const clipped = content.slice(0, maxLength + 1).trim();
  const lastSpace = clipped.lastIndexOf(" ");
  const safeEnd = lastSpace > maxLength * 0.6 ? lastSpace : maxLength;

  return `${clipped.slice(0, safeEnd).trimEnd()}…`;
}

function getExcerptSource(markdown: string): string {
  const sections = markdown
    .split(/\r?\n\s*\r?\n/)
    .map((section) => section.trim())
    .filter(Boolean);

  for (const section of sections) {
    if (section.startsWith("#") || section.startsWith("```") || section.startsWith("![")) {
      continue;
    }

    const plainText = stripMarkdown(section);
    if (plainText) {
      return plainText;
    }
  }

  return stripMarkdown(markdown);
}

function parseFrontmatterDate(date?: string): Date | undefined {
  const trimmedDate = date?.trim();
  if (!trimmedDate) {
    return undefined;
  }

  const isoMatch = ISO_DATE_PATTERN.exec(trimmedDate);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return createValidatedUtcDate(Number(year), Number(month) - 1, Number(day));
  }

  const namedMatch = NAMED_DATE_PATTERN.exec(trimmedDate);
  if (namedMatch) {
    const [, monthName, day, year] = namedMatch;
    const month = MONTH_INDEX[monthName.toLowerCase()];

    if (month !== undefined) {
      return createValidatedUtcDate(Number(year), month, Number(day));
    }

    return undefined;
  }

  const timestamp = Date.parse(trimmedDate);
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp);
}

export function getReadingTimeMinutes(post: AstroMarkdownPage): number {
  const plainText = stripMarkdown(getRawContent(post));
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;

  if (wordCount === 0) {
    return 0;
  }

  return Math.max(1, Math.ceil(wordCount / READING_WORDS_PER_MINUTE));
}

export function getPostExcerpt(post: AstroMarkdownPage, maxLength = 160): string {
  const frontmatterExcerpt = post.frontmatter.excerpt?.trim();
  if (frontmatterExcerpt) {
    return frontmatterExcerpt;
  }

  return truncateExcerpt(getExcerptSource(getRawContent(post)), maxLength);
}

export function sortMarkdownPostsByDate<T extends AstroMarkdownPage>(posts: T[]): T[] {
  return posts
    .map((post, index) => ({
      index,
      post,
      timestamp: parseFrontmatterDate(post.frontmatter.date)?.getTime(),
    }))
    .sort((left, right) => {
      const leftHasDate = left.timestamp !== undefined;
      const rightHasDate = right.timestamp !== undefined;

      if (leftHasDate && rightHasDate && left.timestamp !== right.timestamp) {
        const leftTimestamp = left.timestamp;
        const rightTimestamp = right.timestamp;
        return rightTimestamp! - leftTimestamp!;
      }

      if (leftHasDate !== rightHasDate) {
        return leftHasDate ? -1 : 1;
      }

      return left.index - right.index;
    })
    .map(({ post }) => post);
}

export function formatPostDate(date?: string): string | undefined {
  const trimmedDate = date?.trim();
  if (!trimmedDate) {
    return undefined;
  }

  const parsedDate = parseFrontmatterDate(trimmedDate);
  return parsedDate ? DATE_FORMATTER.format(parsedDate) : undefined;
}
