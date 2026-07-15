import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const siteRoot = process.cwd();
const [oldContentRoot, newContentRoot] = process.argv.slice(2);
const assetVersion = "romans-mobile-inline-notes-68";
if (!oldContentRoot || !newContentRoot) {
  throw new Error("Usage: node scripts/sync-romans-natural-flow-export.mjs <old-content-root> <new-content-root>");
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function htmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}

function replaceAllCount(value, before, after) {
  if (!before || before === after || !value.includes(before)) return { value, count: 0 };
  const count = value.split(before).length - 1;
  return { value: value.replaceAll(before, after), count };
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
  throw new Error("Could not find the end of the embedded chapter object.");
}

function replaceChapterObject(stream, chapter) {
  const marker = '"chapter":';
  const markerIndex = stream.indexOf(marker);
  if (markerIndex === -1) return { value: stream, count: 0 };
  const start = markerIndex + marker.length;
  if (stream[start] !== "{") throw new Error(`Romans ${chapter.chapterNumber} has a malformed embedded chapter object.`);
  const end = findJsonObjectEnd(stream, start);
  const existing = JSON.parse(stream.slice(start, end));
  if (existing.chapterNumber !== chapter.chapterNumber) {
    throw new Error(`Expected Romans ${chapter.chapterNumber}; found embedded Romans ${existing.chapterNumber}.`);
  }
  return { value: `${stream.slice(0, start)}${JSON.stringify(chapter)}${stream.slice(end)}`, count: 1 };
}

function repairRawFlightTextLength(value, text) {
  const replacements = [];
  let searchFrom = 0;
  while (searchFrom < value.length) {
    const textIndex = value.indexOf(text, searchFrom);
    if (textIndex === -1) break;
    const textEnd = textIndex + text.length;
    const remainder = value.slice(textEnd, textEnd + 64);
    const endsAtRowBoundary = textEnd === value.length || /^(?:\r?\n)*[0-9a-f]*:/u.test(remainder);
    if (!endsAtRowBoundary) {
      searchFrom = textEnd;
      continue;
    }
    const prefix = value.slice(Math.max(0, textIndex - 64), textIndex);
    const match = prefix.match(/([0-9a-f]+):T([0-9a-f]+),$/u);
    if (match) {
      const headerStart = textIndex - match[0].length;
      const replacement = `${match[1]}:T${Buffer.byteLength(text).toString(16)},`;
      if (match[0] !== replacement) replacements.push({ start: headerStart, end: textIndex, replacement });
    }
    searchFrom = textEnd;
  }
  let output = value;
  for (const replacement of replacements.reverse()) {
    output = `${output.slice(0, replacement.start)}${replacement.replacement}${output.slice(replacement.end)}`;
  }
  return { value: output, count: replacements.length };
}

function advanceUtf8(value, start, byteLength) {
  let index = start;
  let bytes = 0;
  while (index < value.length && bytes < byteLength) {
    const character = String.fromCodePoint(value.codePointAt(index));
    bytes += Buffer.byteLength(character);
    index += character.length;
  }
  if (bytes !== byteLength) throw new Error(`Flight text row ends at ${bytes} bytes; expected ${byteLength}.`);
  return index;
}

function validateFlightStream(value) {
  let position = 0;
  while (position < value.length) {
    const colon = value.indexOf(":", position);
    if (colon === -1 || !/^[0-9a-f]*$/u.test(value.slice(position, colon))) {
      throw new Error(`Invalid Flight row identifier at offset ${position}.`);
    }
    if (value[colon + 1] === "T") {
      const comma = value.indexOf(",", colon + 2);
      const lengthHex = value.slice(colon + 2, comma);
      if (comma === -1 || !/^[0-9a-f]+$/u.test(lengthHex)) throw new Error(`Invalid Flight text header at offset ${position}.`);
      position = advanceUtf8(value, comma + 1, Number.parseInt(lengthHex, 16));
      continue;
    }
    const newline = value.indexOf("\n", colon + 1);
    if (newline === -1) throw new Error(`Unterminated Flight row at offset ${position}.`);
    position = newline + 1;
  }
}

function transformFlightStream(stream, before, after) {
  let output = replaceChapterObject(stream, after).value;
  let noteReplacements = 0;
  let lengthRepairs = 0;
  for (let index = 0; index < after.verses.length; index += 1) {
    const oldNote = before.verses[index].commentary.detailedExplanation;
    const newNote = after.verses[index].commentary.detailedExplanation;
    const replacement = replaceAllCount(output, oldNote, newNote);
    output = replacement.value;
    noteReplacements += replacement.count;
    const repaired = repairRawFlightTextLength(output, newNote);
    output = repaired.value;
    lengthRepairs += repaired.count;
  }
  validateFlightStream(output);
  return { value: output, noteReplacements, lengthRepairs };
}

function readFlightScripts(html) {
  const pattern = /<script>self\.__next_f\.push\((\[1,[\s\S]*?\])\)<\/script>/gu;
  const scripts = [];
  let match;
  while ((match = pattern.exec(html))) {
    try {
      const tuple = JSON.parse(match[1]);
      if (tuple[0] === 1 && typeof tuple[1] === "string") {
        scripts.push({ full: match[0], index: match.index, tuple, payload: tuple[1] });
      }
    } catch {
      // Non-JSON script fragments do not contribute to the Flight stream.
    }
  }
  return scripts;
}

function replaceHtmlFlightStream(html, transformedStream, scripts) {
  let cursor = 0;
  const replacements = [];
  scripts.forEach((script, index) => {
    let end = index === scripts.length - 1 ? transformedStream.length : cursor + script.payload.length;
    if (end < transformedStream.length && /[\uD800-\uDBFF]/u.test(transformedStream[end - 1] ?? "")) end -= 1;
    const tuple = [...script.tuple];
    tuple[1] = transformedStream.slice(cursor, end);
    cursor = end;
    replacements.push({
      start: script.index,
      end: script.index + script.full.length,
      replacement: `<script>self.__next_f.push(${JSON.stringify(tuple)})</script>`
    });
  });
  let output = html;
  for (const replacement of replacements.reverse()) {
    output = `${output.slice(0, replacement.start)}${replacement.replacement}${output.slice(replacement.end)}`;
  }
  return output;
}

function renderParagraphs(value) {
  return value.split(/\n\s*\n/gu).map((paragraph) => `<p>${htmlEscape(paragraph.trim())}</p>`).join("");
}

function renderStudyCard(verse) {
  const crossReferences = verse.crossReferences ?? [];
  const wordNotes = verse.wordNotes ?? [];
  if (!crossReferences.length && !wordNotes.length) return "";
  const icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library h-4 w-4" aria-hidden="true"><path d="m16 6 4 14"></path><path d="M12 6v14"></path><path d="M8 8v12"></path><path d="M4 4v16"></path></svg>';
  const references = crossReferences.length
    ? `<div class="study-card-section"><h3>Cross References</h3><div class="reference-chip-list">${crossReferences.map((reference) => `<span class="reference-chip">${htmlEscape(reference)}</span>`).join("")}</div></div>`
    : "";
  const words = wordNotes.length
    ? `<div class="study-card-section study-card-section-wide"><h3>Word / Phrase Notes</h3><div class="word-note-list">${wordNotes.map((note) => {
      const noteReferences = note.scriptureReferences ?? [];
      const referenceMarkup = noteReferences.length
        ? `<div class="word-reference-list" aria-label="${htmlEscape(note.term)} Scripture references">${noteReferences.map((reference) => `<span class="word-reference-chip">${htmlEscape(reference)}</span>`).join("")}</div>`
        : "";
      return `<article class="word-note"><div class="word-note-title">${htmlEscape(note.term)}</div><p>${htmlEscape(note.explanation)}</p>${referenceMarkup}</article>`;
    }).join("")}</div></div>`
    : "";
  return `<section class="verse-study-card" aria-label="Cross references and word notes"><div class="verse-study-card-header">${icon}Study Links</div><div class="verse-study-grid">${references}${words}</div></section>`;
}

function replaceInitialArticle(html, verse, chapterNumber) {
  const pattern = /<article class="exposition-card">[\s\S]*?<\/article>(?=<\/div><\/div><\/aside>)/u;
  if (!pattern.test(html)) throw new Error(`Romans ${chapterNumber} is missing its initial exposition card.`);
  const article = `<article class="exposition-card"><div class="exposition-card-heading"><h2>${htmlEscape(verse.verse)}</h2></div><div class="commentary-reading">${renderParagraphs(verse.commentary.detailedExplanation)}</div>${renderStudyCard(verse)}</article>`;
  return html.replace(pattern, article);
}

let changedFiles = 0;
let chapterPayloads = 0;
let noteReplacements = 0;
let lengthRepairs = 0;

for (let chapterNumber = 1; chapterNumber <= 16; chapterNumber += 1) {
  const file = `chapter-${String(chapterNumber).padStart(2, "0")}.json`;
  const before = readJson(join(oldContentRoot, file));
  const after = readJson(join(newContentRoot, file));
  const chapterDir = join(siteRoot, "romans", String(chapterNumber));
  const files = readdirSync(chapterDir).filter((entry) => entry.endsWith(".html") || entry.endsWith(".txt"));

  for (const exportFile of files) {
    const path = join(chapterDir, exportFile);
    const original = readFileSync(path, "utf8");
    let output = original;
    if (exportFile.endsWith(".html")) {
      const scripts = readFlightScripts(output);
      const stream = scripts.map((script) => script.payload).join("");
      if (stream.includes('"chapter":')) {
        const transformed = transformFlightStream(stream, before, after);
        output = replaceHtmlFlightStream(output, transformed.value, scripts);
        chapterPayloads += 1;
        noteReplacements += transformed.noteReplacements;
        lengthRepairs += transformed.lengthRepairs;
      }
      if (exportFile === "index.html") {
        output = replaceInitialArticle(output, after.verses[0], chapterNumber);
        output = output.replace(/<script src="\/romans-theology-notes\.js\?v=[^"]+"><\/script>/gu, "");
        const enhancement = `<script src="/romans-theology-notes.js?v=${assetVersion}"></script>`;
        const unifiedIndex = output.indexOf('<script src="/mbe-unified.js');
        output = unifiedIndex === -1
          ? output.replace("</body>", `${enhancement}</body>`)
          : `${output.slice(0, unifiedIndex)}${enhancement}${output.slice(unifiedIndex)}`;
      }
    } else if (output.includes('"chapter":')) {
      const transformed = transformFlightStream(output, before, after);
      output = transformed.value;
      chapterPayloads += 1;
      noteReplacements += transformed.noteReplacements;
      lengthRepairs += transformed.lengthRepairs;
    }
    if (output !== original) {
      writeFileSync(path, output);
      changedFiles += 1;
    }
  }
}

console.log(
  `Synced Romans natural-flow content: ${chapterPayloads} chapter payloads, ${noteReplacements} note rows, ` +
  `${lengthRepairs} Flight lengths repaired, and ${changedFiles} files updated.`
);
