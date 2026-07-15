import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const root = process.cwd();
const outputPath = process.argv[2] ?? join(root, "research", "romans-natural-flow-pages-audit.json");
const severePatterns = [
  ["generic four-part application", /repentance, trust, worship, and a concrete act of love/giu],
  ["whole-gospel template", /Romans presses toward a whole gospel/giu],
  ["context-control template", /The key interpretive control is context/giu],
  ["connection template", /This passage keeps .* connected with/giu]
];
const reportPatterns = [
  ["In practice", /\bIn practice\b/giu],
  ["Within Christian practice", /\bWithin Christian practice\b/giu],
  ["At the level of discipleship", /\bAt the level of discipleship\b/giu],
  ["For the reader", /\bFor the reader\b/giu],
  ["practical force", /\b(?:The|Its) practical force\b/giu],
  ["formulaic contrast", /\bnot\b[^.!?]{0,110}\bbut\b/giu]
];

function decodeHtml(value) {
  return value
    .replace(/<!--.*?-->/gsu, "")
    .replace(/&#x([0-9a-f]+);/giu, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/gu, (_match, code) => String.fromCodePoint(Number(code)))
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function visibleMain(html) {
  const withoutScripts = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, "");
  const main = withoutScripts.match(/<main\b[^>]*>([\s\S]*?)<\/main>/iu)?.[1] ?? withoutScripts;
  return main;
}

function elementTexts(html, tagPattern) {
  const pattern = new RegExp(`<(?:${tagPattern})\\b[^>]*>([\\s\\S]*?)<\\/(?:${tagPattern})>`, "giu");
  return [...html.matchAll(pattern)]
    .map((match) => decodeHtml(match[1].replace(/<[^>]+>/gu, " ")).replace(/\s+/gu, " ").trim())
    .filter(Boolean);
}

function countMatches(value, pattern) {
  pattern.lastIndex = 0;
  return [...value.matchAll(pattern)].length;
}

const articleDirectories = readdirSync(join(root, "articles"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(root, "articles", entry.name, "index.html"))
  .sort();
const files = [
  join(root, "index.html"),
  join(root, "introduction", "index.html"),
  join(root, "articles", "index.html"),
  ...articleDirectories
];

const pages = files.map((path) => {
  const html = readFileSync(path, "utf8");
  const main = visibleMain(html);
  const headings = elementTexts(main, "h1|h2|h3");
  const paragraphs = elementTexts(main, "p|blockquote");
  const text = [...headings, ...paragraphs].join("\n");
  const severe = severePatterns.flatMap(([label, pattern]) => {
    const count = countMatches(text, pattern);
    return count ? [{ label, count }] : [];
  });
  const phraseCounts = Object.fromEntries(reportPatterns.map(([label, pattern]) => [label, countMatches(text, pattern)]));
  return {
    path: relative(root, path),
    title: headings[0] ?? "Untitled",
    headings: headings.length,
    paragraphs: paragraphs.length,
    words: text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0,
    severe,
    phraseCounts,
    closingParagraphs: paragraphs.slice(-3)
  };
});

const severeFindings = pages.flatMap((page) => page.severe.map((finding) => ({ page: page.path, ...finding })));
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify({
  title: "Romans Teaching-Page Natural-Flow Audit",
  generatedOn: new Date().toISOString().slice(0, 10),
  scope: {
    homepage: 1,
    introduction: 1,
    articleIndex: 1,
    articles: articleDirectories.length,
    totalPages: pages.length
  },
  severeFindings,
  pages
}, null, 2)}\n`);

console.log(`Audited ${pages.length} Romans teaching pages (${articleDirectories.length} articles).`);
console.log(`Severe formulaic findings: ${severeFindings.length}.`);
for (const [label] of reportPatterns) {
  const total = pages.reduce((sum, page) => sum + page.phraseCounts[label], 0);
  console.log(`- ${label}: ${total}`);
}
if (severeFindings.length) {
  severeFindings.forEach((finding) => console.error(`- ${finding.page}: ${finding.label} (${finding.count})`));
  process.exit(1);
}
