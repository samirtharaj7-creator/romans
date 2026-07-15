import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const contentRoot = process.argv[2] ?? join(process.cwd(), "content", "romans");
const bibleTextPath = process.argv[3] ?? process.env.KJV_TEXT_PATH;
const outputPath = process.argv[4] ?? join(process.cwd(), "data", "romans-reference-previews.json");

if (!bibleTextPath) {
  throw new Error(
    "Pass the Gutenberg KJV text path as the second argument or set KJV_TEXT_PATH."
  );
}

const bibleBookNames = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation"
];

const bookAliases = new Map(
  bibleBookNames.flatMap((book) => {
    const aliases = [[book.toLowerCase(), book]];
    if (book === "Psalms") aliases.push(["psalm", book]);
    if (book === "Song of Solomon") {
      aliases.push(["song", book], ["song of songs", book], ["canticles", book]);
    }
    return aliases;
  })
);
const singleChapterBooks = new Set(["Obadiah", "Philemon", "2 John", "3 John", "Jude"]);
const invalidReferences = new Set();

function normalizeReference(reference) {
  return String(reference).trim().replace(/\s+/gu, " ");
}

function parseReference(reference) {
  const normalized = normalizeReference(reference);
  const standardMatch = normalized.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/u);
  const shortMatch = normalized.match(/^(.+?)\s+(\d+)(?:-(\d+))?$/u);
  const match = standardMatch ?? shortMatch;
  if (!match) return null;
  const book = bookAliases.get(match[1].toLowerCase());
  if (!book || (!standardMatch && !singleChapterBooks.has(book))) return null;
  const chapter = standardMatch ? Number.parseInt(match[2], 10) : 1;
  const startVerse = Number.parseInt(standardMatch ? match[3] : match[2], 10);
  const endValue = standardMatch ? match[4] : match[3];
  const endVerse = endValue ? Number.parseInt(endValue, 10) : startVerse;
  if (endVerse < startVerse) return null;
  return {
    book,
    chapter,
    startVerse,
    endVerse
  };
}

function readBibleLookup() {
  const lookup = new Map();
  const lines = readFileSync(bibleTextPath, "utf8").split(/\r?\n/u);
  let currentKey = "";

  for (const line of lines) {
    if (/^\*\*\* END OF THE PROJECT GUTENBERG EBOOK\b/u.test(line)) break;
    if (/^Book \d{2}\b/u.test(line)) {
      currentKey = "";
      continue;
    }
    const match = line.match(/^(\d{2}):(\d{3}):(\d{3})\s+(.*)$/u);
    if (match) {
      const book = bibleBookNames[Number.parseInt(match[1], 10) - 1];
      currentKey = book
        ? `${book} ${Number.parseInt(match[2], 10)}:${Number.parseInt(match[3], 10)}`
        : "";
      if (currentKey) lookup.set(currentKey, match[4].trim());
      continue;
    }

    if (currentKey && line.trim()) {
      lookup.set(currentKey, `${lookup.get(currentKey)} ${line.trim()}`.replace(/\s+/gu, " "));
    }
  }

  return lookup;
}

function addReferences(target, values) {
  if (!Array.isArray(values)) return;
  values.forEach((value) => {
    if (typeof value !== "string") return;
    const normalized = normalizeReference(value);
    if (parseReference(normalized)) target.add(normalized);
    else invalidReferences.add(normalized);
  });
}

function collectDisplayedReferences() {
  const references = new Set();
  const chapterFiles = readdirSync(contentRoot)
    .filter((file) => /^chapter-\d{2}\.json$/u.test(file))
    .sort();

  for (const file of chapterFiles) {
    const chapter = JSON.parse(readFileSync(join(contentRoot, file), "utf8"));
    addReferences(references, chapter.crossReferences);
    for (const symbol of chapter.symbols ?? []) {
      addReferences(references, symbol.references);
      addReferences(references, symbol.scriptureReferences);
    }
    for (const verse of chapter.verses ?? []) {
      addReferences(references, verse.crossReferences);
      for (const wordNote of verse.wordNotes ?? []) {
        addReferences(references, wordNote.scriptureReferences);
      }
    }
  }

  return [...references].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

function buildPreview(reference, bibleLookup) {
  const parsed = parseReference(reference);
  if (!parsed) return null;
  const verseParts = [];
  const previewEnd = Math.min(parsed.endVerse, parsed.startVerse + 2);

  for (let verse = parsed.startVerse; verse <= previewEnd; verse += 1) {
    const text = bibleLookup.get(`${parsed.book} ${parsed.chapter}:${verse}`);
    if (!text) return null;
    verseParts.push(`${verse} ${text}`);
  }

  if (parsed.endVerse > previewEnd) verseParts.push("...");
  return verseParts.join(" ");
}

const bibleLookup = readBibleLookup();
const references = collectDisplayedReferences();
const previews = {};
const missing = [];

if (invalidReferences.size > 0) {
  throw new Error(
    `Unsupported cross-reference format for ${invalidReferences.size} references:\n${[
      ...invalidReferences
    ].join("\n")}`
  );
}

for (const reference of references) {
  const preview = buildPreview(reference, bibleLookup);
  if (preview) previews[reference] = preview;
  else missing.push(reference);
}

if (missing.length > 0) {
  throw new Error(`Missing KJV text for ${missing.length} references:\n${missing.join("\n")}`);
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `${JSON.stringify(
    {
      translation: "King James Version",
      referenceCount: references.length,
      references: previews
    },
    null,
    2
  )}\n`
);

console.log(`Built ${references.length} local KJV cross-reference previews at ${outputPath}.`);
