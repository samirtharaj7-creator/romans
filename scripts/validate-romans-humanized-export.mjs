import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const siteRoot = process.cwd();
const argumentsList = process.argv.slice(2);
if (argumentsList.length > 2) {
  throw new Error(
    "Usage: node scripts/validate-romans-humanized-export.mjs [content-root] [baseline-manifest]"
  );
}
const contentRoot = argumentsList[0]
  ? resolve(siteRoot, argumentsList[0])
  : join(siteRoot, "content", "romans");
const baselineManifestPath = argumentsList[1]
  ? resolve(siteRoot, argumentsList[1])
  : join(siteRoot, "scripts", "romans-humanization-baseline.manifest.json");

const errors = [];
// This immutable hash-only baseline comes from the last public export before humanization.
const expectedBaselineRevision = "b1252db1afa7832f3254b8e9ddac6eb66a875f1d";
const expectedBaselineEntriesSha256 =
  "df1bf3ba1b1947245357cd45ce2db0ff89494d51faa07bf11312061fbc5a9e82";
const expectedVerseCounts = [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27];
const forbiddenPatterns = [
  /\bAdventist\b/iu,
  /Biblical Research Institute/iu,
  /Ellen G\.? White/iu,
  /General Conference of Seventh-day Adventists/iu,
  /\bfilecite\b|[]/iu
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function jsonInner(value) {
  return JSON.stringify(value).slice(1, -1);
}

function htmlEscape(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}

function count(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

function validateHtmlFlightLengths(html, label) {
  const scriptPattern = /<script>self\.__next_f\.push\((\[1,[\s\S]*?\])\)<\/script>/gu;
  const payloads = [];
  let match;
  while ((match = scriptPattern.exec(html))) {
    try {
      payloads.push(JSON.parse(match[1])[1]);
    } catch {
      // Non-JSON payloads are ignored by the browser too.
    }
  }
  const stream = payloads.join("");
  let position = 0;
  while (position < stream.length) {
    const colon = stream.indexOf(":", position);
    if (colon === -1 || !/^[0-9a-f]*$/u.test(stream.slice(position, colon))) {
      errors.push(`${label} has an invalid Flight row at offset ${position}.`);
      return;
    }
    if (stream[colon + 1] === "T") {
      const comma = stream.indexOf(",", colon + 2);
      const lengthHex = stream.slice(colon + 2, comma);
      if (comma === -1 || !/^[0-9a-f]+$/u.test(lengthHex)) {
        errors.push(`${label} has an invalid Flight text header at offset ${position}.`);
        return;
      }
      const expectedBytes = Number.parseInt(lengthHex, 16);
      let actualBytes = 0;
      position = comma + 1;
      while (position < stream.length && actualBytes < expectedBytes) {
        const codePoint = stream.codePointAt(position);
        const character = String.fromCodePoint(codePoint);
        actualBytes += Buffer.byteLength(character);
        position += character.length;
      }
      if (actualBytes !== expectedBytes) {
        errors.push(`${label} has a Flight text length mismatch (${actualBytes} !== ${expectedBytes}).`);
        return;
      }
      continue;
    }
    const newline = stream.indexOf("\n", colon + 1);
    if (newline === -1) {
      errors.push(`${label} has an unterminated Flight row.`);
      return;
    }
    position = newline + 1;
  }
}

function htmlFlightStream(html) {
  const scriptPattern = /<script>self\.__next_f\.push\((\[1,[\s\S]*?\])\)<\/script>/gu;
  const payloads = [];
  let match;
  while ((match = scriptPattern.exec(html))) {
    try {
      const tuple = JSON.parse(match[1]);
      if (tuple[0] === 1 && typeof tuple[1] === "string") payloads.push(tuple[1]);
    } catch {
      // Non-JSON payloads do not contribute to the Flight stream.
    }
  }
  return payloads.join("");
}

function findJsonObjectEnd(value, start) {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < value.length; index += 1) {
    const character = value[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
  }
  throw new Error("Could not find the end of an embedded chapter object.");
}

function embeddedChapter(value, label) {
  const marker = '"chapter":';
  const markerIndex = value.indexOf(marker);
  if (markerIndex === -1) {
    errors.push(`${label} is missing its embedded chapter payload.`);
    return null;
  }
  const start = markerIndex + marker.length;
  try {
    return JSON.parse(value.slice(start, findJsonObjectEnd(value, start)));
  } catch (error) {
    errors.push(`${label} has an invalid embedded chapter payload: ${error.message}`);
    return null;
  }
}

const baselineManifest = readJson(baselineManifestPath);
const baselineEntriesSha256 = Array.isArray(baselineManifest.baseline)
  ? sha256(JSON.stringify(baselineManifest.baseline))
  : "";
if (
  baselineManifest.schemaVersion !== 1 ||
  baselineManifest.hashAlgorithm !== "sha256" ||
  baselineManifest.chapters !== 16 ||
  baselineManifest.notes !== 433 ||
  baselineManifest.source?.kind !== "public-git-revision" ||
  baselineManifest.source?.revision !== expectedBaselineRevision ||
  baselineEntriesSha256 !== expectedBaselineEntriesSha256 ||
  !Array.isArray(baselineManifest.baseline) ||
  baselineManifest.baseline.length !== 433
) {
  errors.push("The public pre-humanization baseline manifest is missing or invalid.");
}

const baselineByReference = new Map();
for (const entry of baselineManifest.baseline ?? []) {
  if (
    typeof entry.reference !== "string" ||
    !/^[a-f0-9]{64}$/u.test(entry.detailedExplanationSha256 ?? "")
  ) {
    errors.push("The public pre-humanization baseline manifest contains an invalid entry.");
    continue;
  }
  if (baselineByReference.has(entry.reference)) {
    errors.push(`The public pre-humanization baseline repeats ${entry.reference}.`);
    continue;
  }
  baselineByReference.set(entry.reference, entry.detailedExplanationSha256);
}

let embeddedNotes = 0;
let preHumanizationRegressions = 0;
const checkedBaselineReferences = new Set();

for (let chapterNumber = 1; chapterNumber <= 16; chapterNumber += 1) {
  const file = `chapter-${String(chapterNumber).padStart(2, "0")}.json`;
  const chapter = readJson(join(contentRoot, file));
  const expectedVerseCount = expectedVerseCounts[chapterNumber - 1];
  if (chapter.chapterNumber !== chapterNumber || chapter.verses?.length !== expectedVerseCount) {
    errors.push(
      `${file} reports chapter ${chapter.chapterNumber} with ${chapter.verses?.length ?? 0} verses; ` +
      `expected Romans ${chapterNumber} with ${expectedVerseCount} verses.`
    );
  }
  const chapterDir = join(siteRoot, "romans", String(chapterNumber));
  const html = readFileSync(join(chapterDir, "index.html"), "utf8");
  const indexText = readFileSync(join(chapterDir, "index.txt"), "utf8");
  const pageText = readFileSync(join(chapterDir, "__next.romans.$d$chapter.__PAGE__.txt"), "utf8");
  const exportText = `${html}\n${indexText}\n${pageText}`;

  for (const [label, embedded] of [
    [`Romans ${chapterNumber} HTML`, embeddedChapter(htmlFlightStream(html), `Romans ${chapterNumber} HTML`)],
    [`Romans ${chapterNumber} index.txt`, embeddedChapter(indexText, `Romans ${chapterNumber} index.txt`)],
    [`Romans ${chapterNumber} PAGE payload`, embeddedChapter(pageText, `Romans ${chapterNumber} PAGE payload`)]
  ]) {
    if (embedded && JSON.stringify(embedded) !== JSON.stringify(chapter)) {
      errors.push(`${label} does not exactly match the canonical chapter JSON.`);
    }
  }

  if (count(html, /<script src="\/romans-initial-notes\.js/gu) !== 0) {
    errors.push(`Romans ${chapterNumber} still loads the obsolete initial-note map.`);
  }
  if (count(html, /<script src="\/romans-theology-notes\.js\?v=romans-search-cleanup-71"><\/script>/gu) !== 1) {
    errors.push(`Romans ${chapterNumber} does not load the commentary enhancement exactly once.`);
  }
  if (/romans-theology-pass-2/iu.test(html)) errors.push(`Romans ${chapterNumber} still loads the old theology runtime.`);
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(exportText)) errors.push(`Romans ${chapterNumber} contains forbidden public research language.`);
  }
  validateHtmlFlightLengths(html, `Romans ${chapterNumber}`);

  chapter.verses.forEach((verse, index) => {
    const expectedReference = `Romans ${chapterNumber}:${index + 1}`;
    const note = verse.commentary.detailedExplanation;
    if (verse.verse !== expectedReference) {
      errors.push(`${file} verse ${index + 1} is labeled ${verse.verse}; expected ${expectedReference}.`);
    }
    const baselineHash = baselineByReference.get(expectedReference);
    if (!baselineHash) {
      errors.push(`${expectedReference} is missing from the public pre-humanization baseline.`);
    } else {
      checkedBaselineReferences.add(expectedReference);
      if (sha256(note) === baselineHash) {
        preHumanizationRegressions += 1;
        errors.push(`${expectedReference} has reverted to its pre-humanization detailed note.`);
      }
    }
    const variants = [note, jsonInner(note), htmlEscape(note)];
    if (!variants.some((variant) => exportText.includes(variant))) {
      errors.push(`${verse.verse} is absent from the static payload.`);
    } else {
      embeddedNotes += 1;
    }
  });
}

if (embeddedNotes !== 433) errors.push(`Expected 433 embedded notes; verified ${embeddedNotes}.`);
if (checkedBaselineReferences.size !== 433 || baselineByReference.size !== 433) {
  errors.push(
    `Expected 433 canonical-to-baseline mappings; checked ${checkedBaselineReferences.size} ` +
    `against ${baselineByReference.size} manifest entries.`
  );
}

if (errors.length) {
  console.error(`Romans static humanization validation failed with ${errors.length} issue${errors.length === 1 ? "" : "s"}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Romans static humanization validation passed: ${embeddedNotes} embedded notes match the canonical public JSON, ` +
  `${preHumanizationRegressions} pre-humanization regressions, and valid Flight lengths.`
);
