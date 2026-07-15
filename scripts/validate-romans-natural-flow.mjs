import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const contentRoot = process.argv[2] ?? join(root, "content", "romans");
const auditPath = process.argv[3] ?? join(root, "research", "romans-natural-flow-audit.json");
const contextPath = process.argv[4] ?? join(root, "research", "romans-natural-flow-context-packs.json");
const expectedVerseCounts = [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27];
const topLevelHelpers = [
  "explanation", "historicalBackground", "literaryContext", "theologicalInsight",
  "structuralNotes", "relatedConnection", "application", "practicalApplication", "teachingAngle"
];
const commentaryHelpers = [
  "exegesis", "historicalBackground", "technicalNotes", "theologicalInsight",
  "structuralNotes", "otherCommentaryInsights", "application", "practicalApplication", "teachingAngle"
];
const sourceLeakPatterns = [
  /SDA Bible Commentary/iu,
  /Seventh-day Adventist Bible Commentary/iu,
  /SdaBc/iu,
  /White Estate/iu,
  /https?:\/\//iu,
  /filecite/iu,
  /[]/u,
  /\b(?:our research|source audit|research process|private source)\b/iu
];
const formulaicPublicPatterns = [
  /repentance, trust, worship, and a concrete act of love/iu,
  /Romans presses toward a whole gospel/iu,
  /The key interpretive control is context/iu,
  /This passage keeps .* connected with/iu
];
const stockPatterns = [
  ["This verse", /\bthis verse\b/giu],
  ["Paul does not", /\bPaul does not\b/giu],
  ["not ... but ...", /\bnot\b[^.!?]{0,110}\bbut\b/giu],
  ["In practice", /\bIn practice\b/giu],
  ["Within Christian practice", /\bWithin Christian practice\b/giu],
  ["At the level of discipleship", /\bAt the level of discipleship\b/giu]
];

function words(value) {
  return String(value).match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) ?? [];
}

function wordCount(value) {
  return words(value).length;
}

function normalize(value) {
  return words(value).join(" ").toLocaleLowerCase();
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function splitSentences(value) {
  return String(value)
    .replace(/\s+/gu, " ")
    .trim()
    .split(/(?<=[.!?])\s+(?=[“"']?[A-Z0-9])/gu)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function ngrams(value, size = 4) {
  const tokens = words(value).map((word) => word.toLocaleLowerCase());
  const result = new Set();
  for (let index = 0; index <= tokens.length - size; index += 1) result.add(tokens.slice(index, index + size).join(" "));
  return result;
}

function jaccard(left, right) {
  if (!left.size || !right.size) return 0;
  let overlap = 0;
  const smaller = left.size <= right.size ? left : right;
  const larger = left.size <= right.size ? right : left;
  for (const value of smaller) if (larger.has(value)) overlap += 1;
  return overlap / (left.size + right.size - overlap);
}

function countMatches(value, pattern) {
  pattern.lastIndex = 0;
  return [...value.matchAll(pattern)].length;
}

function publicVerse(verse) {
  return JSON.stringify(Object.fromEntries(Object.entries(verse).filter(([key]) => key !== "sources" && key !== "sourceAudit")));
}

const audit = JSON.parse(readFileSync(auditPath, "utf8"));
const contextPacks = JSON.parse(readFileSync(contextPath, "utf8"));
const chapterFiles = readdirSync(contentRoot)
  .filter((file) => /^chapter-\d+\.json$/u.test(file))
  .sort((left, right) => Number(left.match(/\d+/u)[0]) - Number(right.match(/\d+/u)[0]));
const chapters = chapterFiles.map((file) => JSON.parse(readFileSync(join(contentRoot, file), "utf8")));
const notes = [];
const errors = [];

chapters.forEach((chapter, index) => {
  if (chapter.chapterNumber !== index + 1 || chapter.verses.length !== expectedVerseCounts[index]) {
    errors.push(`Romans ${index + 1} has ${chapter.verses.length} verses; expected ${expectedVerseCounts[index]}.`);
  }
  for (const verse of chapter.verses) {
    const text = String(verse.commentary?.detailedExplanation ?? "").trim();
    notes.push({
      reference: verse.verse,
      chapter: chapter.chapterNumber,
      verse,
      text,
      words: wordCount(text),
      paragraphs: text.split(/\n\s*\n/gu).filter(Boolean).length,
      sentences: splitSentences(text),
      grams: ngrams(text)
    });
  }
});

if (notes.length !== 433) errors.push(`Expected 433 Romans notes; found ${notes.length}.`);
if (audit.expectedNotes !== 433 || audit.reviewedNotes !== 433 || audit.notes?.length !== 433) {
  errors.push("The natural-flow audit does not account for all 433 notes.");
}
if (!Array.isArray(contextPacks.passages) || contextPacks.passages.length < 40) {
  errors.push("Passage-level context packs are missing or incomplete.");
}

const auditByReference = new Map((audit.notes ?? []).map((entry) => [entry.reference, entry]));
const wordNoteSignatures = new Map();
let emptyWordNoteModules = 0;
let emptyCrossReferenceModules = 0;
for (const note of notes) {
  const { verse } = note;
  const auditEntry = auditByReference.get(note.reference);
  if (!auditEntry) errors.push(`${note.reference} is missing from the natural-flow audit.`);
  else if (auditEntry.afterHash !== sha256(note.text)) errors.push(`${note.reference} no longer matches its audited text.`);
  if (note.words < 120) errors.push(`${note.reference} has only ${note.words} words.`);
  if (verse.reviewStatus !== "verified-seed") errors.push(`${note.reference} is not verified-seed.`);
  if ((verse.commentary?.reviewFlags ?? []).length) errors.push(`${note.reference} retains review flags.`);
  for (const key of topLevelHelpers) {
    if (key in verse && String(verse[key] ?? "").trim()) errors.push(`${note.reference} retains legacy ${key}.`);
  }
  for (const key of commentaryHelpers) {
    if (key in (verse.commentary ?? {}) && String(verse.commentary[key] ?? "").trim()) {
      errors.push(`${note.reference} retains commentary.${key}.`);
    }
  }
  if ((verse.wordNotes ?? []).length === 0) emptyWordNoteModules += 1;
  if ((verse.crossReferences ?? []).length === 0) emptyCrossReferenceModules += 1;
  if ((verse.crossReferences ?? []).length > 6) errors.push(`${note.reference} has more than six cross references.`);
  if (new Set(verse.crossReferences ?? []).size !== (verse.crossReferences ?? []).length) {
    errors.push(`${note.reference} has duplicate cross references.`);
  }
  for (const wordNote of verse.wordNotes ?? []) {
    const signature = `${normalize(wordNote.term)}\u0000${normalize(wordNote.explanation)}`;
    const references = wordNoteSignatures.get(signature) ?? [];
    references.push(note.reference);
    wordNoteSignatures.set(signature, references);
  }
  const publicText = publicVerse(verse);
  for (const pattern of sourceLeakPatterns) if (pattern.test(publicText)) errors.push(`${note.reference} exposes private source language.`);
  for (const pattern of formulaicPublicPatterns) if (pattern.test(publicText)) errors.push(`${note.reference} retains formulaic helper prose.`);
}

const duplicateWordNotes = [...wordNoteSignatures.values()].filter((references) => references.length > 1);
if (duplicateWordNotes.length) errors.push(`${duplicateWordNotes.length} repeated word-note definitions remain.`);
if (emptyWordNoteModules < 100) errors.push(`Only ${emptyWordNoteModules} verses hide Word Notes; optional modules remain overpopulated.`);
if (emptyCrossReferenceModules < 100) errors.push(`Only ${emptyCrossReferenceModules} verses hide Cross References; optional modules remain overpopulated.`);

const repeatedSentences = new Map();
const repeatedParagraphs = new Map();
for (const note of notes) {
  for (const sentence of note.sentences) {
    if (wordCount(sentence) < 14) continue;
    const key = normalize(sentence);
    const references = repeatedSentences.get(key) ?? [];
    references.push(note.reference);
    repeatedSentences.set(key, references);
  }
  for (const paragraph of note.text.split(/\n\s*\n/gu)) {
    if (wordCount(paragraph) < 30) continue;
    const key = normalize(paragraph);
    const references = repeatedParagraphs.get(key) ?? [];
    references.push(note.reference);
    repeatedParagraphs.set(key, references);
  }
}
const duplicateSentences = [...repeatedSentences.values()].filter((references) => references.length > 1);
const duplicateParagraphs = [...repeatedParagraphs.values()].filter((references) => references.length > 1);
if (duplicateSentences.length) errors.push(`${duplicateSentences.length} exact long sentence(s) remain duplicated.`);
if (duplicateParagraphs.length) errors.push(`${duplicateParagraphs.length} exact substantial paragraph(s) remain duplicated.`);

const adjacentSimilarity = [];
for (let index = 1; index < notes.length; index += 1) {
  const previous = notes[index - 1];
  const current = notes[index];
  if (previous.chapter !== current.chapter) continue;
  const score = jaccard(previous.grams, current.grams);
  if (score >= 0.42) adjacentSimilarity.push({ left: previous.reference, right: current.reference, score });
}
const severeAdjacent = adjacentSimilarity.filter((entry) => entry.score >= 0.6);
if (severeAdjacent.length) errors.push(`${severeAdjacent.length} adjacent note pair(s) remain severely similar.`);

const allText = notes.map((note) => note.text).join("\n");
console.log("Romans natural-flow audit");
console.log(`- Notes: ${notes.length}`);
console.log(`- Total words: ${notes.reduce((sum, note) => sum + note.words, 0).toLocaleString()}`);
console.log(`- Word range: ${Math.min(...notes.map((note) => note.words))}-${Math.max(...notes.map((note) => note.words))}`);
console.log(`- Paragraph range: ${Math.min(...notes.map((note) => note.paragraphs))}-${Math.max(...notes.map((note) => note.paragraphs))}`);
console.log(`- Empty Word Notes modules: ${emptyWordNoteModules}`);
console.log(`- Empty Cross References modules: ${emptyCrossReferenceModules}`);
console.log(`- Exact repeated long sentences: ${duplicateSentences.length}`);
console.log(`- Exact repeated substantial paragraphs: ${duplicateParagraphs.length}`);
console.log(`- Adjacent similarity flags: ${adjacentSimilarity.length} (${severeAdjacent.length} severe)`);
for (const [label, pattern] of stockPatterns) console.log(`- ${label}: ${countMatches(allText, pattern)}`);

if (errors.length) {
  console.error(`Romans natural-flow validation failed with ${errors.length} issue${errors.length === 1 ? "" : "s"}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log("Romans natural-flow validation passed.");
