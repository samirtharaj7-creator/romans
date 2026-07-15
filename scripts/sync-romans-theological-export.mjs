import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const siteRoot = process.cwd();
const [oldContentRoot, newContentRoot] = process.argv.slice(2);
const publicLanguageReplacements = [
  [/That is crucial for Adventist witness:/giu, "That matters for Christian witness:"],
  [/For Adventist readers,/giu, "For readers,"],
  [/an important Adventist concern/giu, "an important biblical concern"],
  [/Adventist law\/gospel teaching/giu, "biblical teaching on law and gospel"],
  [/In an Adventist reading of Romans,/giu, "In the flow of Romans,"],
  [/Adventist faith, with its strong doctrine of creation/giu, "Biblical faith, with its strong doctrine of creation"],
  [/Adventist witness/giu, "Christian witness"],
  [/Adventist readers/giu, "readers"],
  [/Adventist reading/giu, "biblical reading"],
  [/Adventist theology/giu, "biblical theology"],
  [/Adventist faith/giu, "Christian faith"],
  [/Adventist mission/giu, "the church's mission"],
  [/\bAdventist\b/giu, "biblical"]
];

if (!oldContentRoot || !newContentRoot) {
  throw new Error("Usage: node scripts/sync-romans-theological-export.mjs <old-content-root> <new-content-root>");
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function collectChangedStrings(before, after, path, changes) {
  if (typeof before === "string" && typeof after === "string") {
    if (before !== after) changes.push({ before, after, path });
    return;
  }
  if (Array.isArray(before) && Array.isArray(after)) {
    for (let index = 0; index < Math.max(before.length, after.length); index += 1) {
      collectChangedStrings(before[index], after[index], `${path}[${index}]`, changes);
    }
    return;
  }
  if (!before || !after || typeof before !== "object" || typeof after !== "object") return;
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (key === "sources" || key === "sourceAudit") continue;
    collectChangedStrings(before[key], after[key], `${path}.${key}`, changes);
  }
}

function htmlEscape(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}

function jsonInner(value) {
  return JSON.stringify(value).slice(1, -1);
}

function replaceAllCount(value, before, after) {
  if (!before || before === after || !value.includes(before)) return { value, count: 0 };
  const count = value.split(before).length - 1;
  return { value: value.replaceAll(before, after), count };
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
    const prefixStart = Math.max(0, textIndex - 64);
    const prefix = value.slice(prefixStart, textIndex);
    const match = prefix.match(/([0-9a-f]+):T([0-9a-f]+),$/u);
    if (match) {
      const headerStart = textIndex - match[0].length;
      const replacement = `${match[1]}:T${Buffer.byteLength(text).toString(16)},`;
      if (match[0] !== replacement) replacements.push({ start: headerStart, end: textIndex, replacement });
    }
    searchFrom = textIndex + text.length;
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
    const codePoint = value.codePointAt(index);
    const character = String.fromCodePoint(codePoint);
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
      throw new Error(
        `Invalid Flight row identifier at offset ${position}: ${JSON.stringify(value.slice(position, position + 160))}`
      );
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

function repairHtmlFlightTextLengths(value, texts) {
  const scriptPattern = /<script>self\.__next_f\.push\((\[1,[\s\S]*?\])\)<\/script>/gu;
  const scripts = [];
  let match;
  while ((match = scriptPattern.exec(value))) {
    try {
      const tuple = JSON.parse(match[1]);
      if (tuple[0] === 1 && typeof tuple[1] === "string") {
        scripts.push({ full: match[0], index: match.index, tuple, payload: tuple[1] });
      }
    } catch {
      // Non-JSON script fragments are not Flight text chunks.
    }
  }
  let stream = scripts.map((script) => script.payload).join("");
  let repairCount = 0;
  for (const text of [...new Set(texts)].sort((left, right) => right.length - left.length)) {
    const repaired = repairRawFlightTextLength(stream, text);
    stream = repaired.value;
    repairCount += repaired.count;
  }
  validateFlightStream(stream);

  let cursor = 0;
  const replacements = [];
  scripts.forEach((script, index) => {
    let end = index === scripts.length - 1 ? stream.length : cursor + script.payload.length;
    if (end < stream.length && /[\uD800-\uDBFF]/u.test(stream[end - 1] ?? "")) end -= 1;
    const segment = stream.slice(cursor, end);
    cursor = end;
    const tuple = [...script.tuple];
    tuple[1] = segment;
    replacements.push({ start: script.index, end: script.index + script.full.length, replacement: `<script>self.__next_f.push(${JSON.stringify(tuple)})</script>` });
  });
  let output = value;
  for (const replacement of replacements.reverse()) {
    output = `${output.slice(0, replacement.start)}${replacement.replacement}${output.slice(replacement.end)}`;
  }
  return { value: output, count: repairCount };
}

function collectPublicStrings(value, output = []) {
  if (typeof value === "string") {
    output.push(value);
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => collectPublicStrings(entry, output));
    return output;
  }
  if (!value || typeof value !== "object") return output;
  for (const [key, entry] of Object.entries(value)) {
    if (key === "sources" || key === "sourceAudit") continue;
    collectPublicStrings(entry, output);
  }
  return output;
}

let changedFiles = 0;
let changedPairs = 0;
let replacements = 0;
let lengthRepairs = 0;
let deferredInitialNotes = 0;

function renderParagraphs(value) {
  return value
    .split(/\n\s*\n/gu)
    .map((paragraph) => `<p>${htmlEscape(paragraph.trim())}</p>`)
    .join("");
}

function replaceInitialCommentaryMarkup(value, note, chapterNumber) {
  const pattern = /(<div class="commentary-reading">)[\s\S]*?(<\/div><section class="verse-study-card")/u;
  if (!pattern.test(value)) throw new Error(`Romans ${chapterNumber} is missing its initial commentary markup.`);
  return value.replace(pattern, `$1${renderParagraphs(note)}$2`);
}

for (let chapterNumber = 1; chapterNumber <= 16; chapterNumber += 1) {
  const file = `chapter-${String(chapterNumber).padStart(2, "0")}.json`;
  const before = readJson(join(oldContentRoot, file));
  const after = readJson(join(newContentRoot, file));
  const rawChanges = [];
  collectChangedStrings(before, after, `Romans ${chapterNumber}`, rawChanges);
  for (const change of rawChanges) {
    if (!/\.verses\[0\]\.commentary\.detailedExplanation$/u.test(change.path)) continue;
    const separator = change.before.lastIndexOf("\n\n");
    if (separator > 0) change.alternateBefore = change.before.slice(0, separator);
  }
  const exportChanges = rawChanges;

  const byBefore = new Map();
  for (const change of exportChanges) {
    const existing = byBefore.get(change.before);
    if (existing && existing.after !== change.after) {
      throw new Error(`Ambiguous replacement for ${change.path}.`);
    }
    byBefore.set(change.before, change);
  }
  const changes = [...byBefore.values()].sort((left, right) => right.before.length - left.before.length);
  const languageMarkers = publicLanguageReplacements
    .slice(0, -1)
    .map(([, replacement]) => replacement)
    .filter((replacement) => replacement.length >= 18);
  const repairSourceTexts = [
    ...changes.map((change) => change.after),
    ...collectPublicStrings(after).filter((text) => languageMarkers.some((marker) => text.includes(marker)))
  ];
  const repairTexts = [...new Set(
    repairSourceTexts.flatMap((text) => [
      text,
      ...text.split(/\n\s*\n/gu).map((paragraph) => paragraph.trim()).filter(Boolean)
    ])
  )];
  changedPairs += changes.length;
  const pairHits = new Map(changes.map((change) => [change.before, 0]));
  const pairPresent = new Map(changes.map((change) => [change.before, false]));

  const chapterDir = join(siteRoot, "romans", String(chapterNumber));
  const exportFiles = readdirSync(chapterDir)
    .filter((entry) => entry.endsWith(".html") || entry.endsWith(".txt"));

  for (const exportFile of exportFiles) {
    const path = join(chapterDir, exportFile);
    const original = readFileSync(path, "utf8");
    let output = original;
    for (const change of changes) {
      const variantsFor = (beforeValue) => [
        [beforeValue, change.after],
        [jsonInner(beforeValue), jsonInner(change.after)],
        [htmlEscape(beforeValue), htmlEscape(change.after)]
      ];
      const primaryVariants = variantsFor(change.before);
      const newVariants = [change.after, jsonInner(change.after), htmlEscape(change.after)];
      let variants = primaryVariants;
      if (!primaryVariants.some(([oldValue]) => output.includes(oldValue))) {
        if (newVariants.some((value) => output.includes(value))) {
          pairPresent.set(change.before, true);
          continue;
        }
        variants = change.alternateBefore ? variantsFor(change.alternateBefore) : primaryVariants;
      }
      const seen = new Set();
      for (const [oldValue, newValue] of variants) {
        if (seen.has(oldValue)) continue;
        seen.add(oldValue);
        if (!output.includes(oldValue) && output.includes(newValue)) {
          pairPresent.set(change.before, true);
          continue;
        }
        const result = replaceAllCount(output, oldValue, newValue);
        output = result.value;
        replacements += result.count;
        pairHits.set(change.before, pairHits.get(change.before) + result.count);
      }
      if ([change.after, jsonInner(change.after), htmlEscape(change.after)].some((value) => output.includes(value))) {
        pairPresent.set(change.before, true);
      }
    }
    for (const [pattern, replacement] of publicLanguageReplacements) output = output.replace(pattern, replacement);
    if (exportFile === "index.html") {
      output = replaceInitialCommentaryMarkup(output, after.verses[0].commentary.detailedExplanation, chapterNumber);
    }

    if (exportFile === "index.html") {
      const repaired = repairHtmlFlightTextLengths(output, repairTexts);
      output = repaired.value;
      lengthRepairs += repaired.count;
    } else {
      for (const text of repairTexts) {
        const repaired = repairRawFlightTextLength(output, text);
        output = repaired.value;
        lengthRepairs += repaired.count;
      }
    }

    if (exportFile === "index.html") {
      const enhancementScript = '<script src="/romans-theology-notes.js?v=romans-mobile-inline-notes-68"></script>';
      output = output.replace(/<script src="\/romans-initial-notes\.js\?v=[^"]+"><\/script>/gu, "");
      output = output.replace(/<script src="\/romans-theology-notes\.js\?v=[^"]+"><\/script>/gu, "");
      if (!output.includes(enhancementScript)) {
        const unifiedScript = '<script src="/mbe-unified.js';
        const unifiedIndex = output.indexOf(unifiedScript);
        output = unifiedIndex === -1
          ? output.replace('</body>', `${enhancementScript}</body>`)
          : `${output.slice(0, unifiedIndex)}${enhancementScript}${output.slice(unifiedIndex)}`;
      }
    }
    if (output !== original) {
      writeFileSync(path, output);
      changedFiles += 1;
    }
  }

  for (const change of changes) {
    if (pairHits.get(change.before) === 0 && !pairPresent.get(change.before)) {
      throw new Error(`No exported occurrence found for ${change.path}. The static export may not match the supplied baseline.`);
    }
  }
}

console.log(`Synced Romans humanized content: ${changedPairs} unique changes, ${replacements} replacements, ${lengthRepairs} Flight lengths repaired, ${deferredInitialNotes} initial notes deferred, ${changedFiles} export files updated.`);
