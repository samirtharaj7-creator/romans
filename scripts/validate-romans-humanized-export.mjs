import { readFileSync } from "node:fs";
import { join } from "node:path";

const siteRoot = process.cwd();
const [contentRoot, baselineRoot] = process.argv.slice(2);
if (!contentRoot || !baselineRoot) {
  throw new Error("Usage: node scripts/validate-romans-humanized-export.mjs <content-root> <baseline-root>");
}

const errors = [];
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
let embeddedNotes = 0;
let staleNotes = 0;

for (let chapterNumber = 1; chapterNumber <= 16; chapterNumber += 1) {
  const file = `chapter-${String(chapterNumber).padStart(2, "0")}.json`;
  const chapter = readJson(join(contentRoot, file));
  const baseline = readJson(join(baselineRoot, file));
  const chapterDir = join(siteRoot, "romans", String(chapterNumber));
  const html = readFileSync(join(chapterDir, "index.html"), "utf8");
  const indexText = readFileSync(join(chapterDir, "index.txt"), "utf8");
  const pageText = readFileSync(join(chapterDir, "__next.romans.$d$chapter.__PAGE__.txt"), "utf8");
  const exportText = `${html}\n${indexText}\n${pageText}`;

  if (count(html, /<script src="\/romans-initial-notes\.js/gu) !== 0) {
    errors.push(`Romans ${chapterNumber} still loads the obsolete initial-note map.`);
  }
  if (count(html, /<script src="\/romans-theology-notes\.js\?v=romans-humanization-pass-2"><\/script>/gu) !== 1) {
    errors.push(`Romans ${chapterNumber} does not load the commentary enhancement exactly once.`);
  }
  if (/romans-theology-pass-2/iu.test(html)) errors.push(`Romans ${chapterNumber} still loads the old theology runtime.`);
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(exportText)) errors.push(`Romans ${chapterNumber} contains forbidden public research language.`);
  }
  validateHtmlFlightLengths(html, `Romans ${chapterNumber}`);

  chapter.verses.forEach((verse, index) => {
    const note = verse.commentary.detailedExplanation;
    const oldNote = baseline.verses[index].commentary.detailedExplanation;
    const variants = [note, jsonInner(note), htmlEscape(note)];
    if (!variants.some((variant) => exportText.includes(variant))) errors.push(`${verse.verse} is absent from the static payload.`);
    else embeddedNotes += 1;
    if (oldNote !== note && [oldNote, jsonInner(oldNote), htmlEscape(oldNote)].some((variant) => exportText.includes(variant))) {
      staleNotes += 1;
      errors.push(`${verse.verse} retains its pre-humanized detailed note.`);
    }
});
}

if (embeddedNotes !== 433) errors.push(`Expected 433 embedded notes; verified ${embeddedNotes}.`);

if (errors.length) {
  console.error(`Romans static humanization validation failed with ${errors.length} issue${errors.length === 1 ? "" : "s"}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Romans static humanization validation passed: ${embeddedNotes} embedded notes, 0 stale notes, and valid Flight lengths.`);
