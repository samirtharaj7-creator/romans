import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outputRoot = join(root, "content", "romans");
const expectedVerseCounts = [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27];

function findByte(buffer, byte, start) {
  for (let index = start; index < buffer.length; index += 1) {
    if (buffer[index] === byte) return index;
  }
  return -1;
}

function parseFlightRows(path) {
  const buffer = readFileSync(path);
  const rows = new Map();
  let position = 0;

  while (position < buffer.length) {
    while (buffer[position] === 10 || buffer[position] === 13) position += 1;
    if (position >= buffer.length) break;

    const colon = findByte(buffer, 58, position);
    if (colon === -1) throw new Error(`${path}: missing row separator at byte ${position}.`);
    const id = buffer.subarray(position, colon).toString("utf8");
    if (!/^[0-9a-f]*$/u.test(id)) throw new Error(`${path}: invalid Flight row id ${JSON.stringify(id)}.`);

    if (buffer[colon + 1] === 84) {
      const comma = findByte(buffer, 44, colon + 2);
      if (comma === -1) throw new Error(`${path}: malformed text row ${id}.`);
      const sizeHex = buffer.subarray(colon + 2, comma).toString("utf8");
      const size = Number.parseInt(sizeHex, 16);
      if (!Number.isFinite(size)) throw new Error(`${path}: invalid text size ${sizeHex}.`);
      const textStart = comma + 1;
      const textEnd = textStart + size;
      rows.set(id, buffer.subarray(textStart, textEnd).toString("utf8"));
      position = textEnd;
      continue;
    }

    const newline = findByte(buffer, 10, colon + 1);
    const rowEnd = newline === -1 ? buffer.length : newline;
    const payload = buffer.subarray(colon + 1, rowEnd).toString("utf8");
    try {
      rows.set(id, JSON.parse(payload));
    } catch {
      rows.set(id, payload);
    }
    position = newline === -1 ? buffer.length : newline + 1;
  }

  return rows;
}

function findChapter(value, expectedChapter) {
  if (!value || typeof value !== "object") return null;
  if (value.chapter?.chapterNumber === expectedChapter) return value.chapter;
  const entries = Array.isArray(value) ? value : Object.values(value);
  for (const entry of entries) {
    const chapter = findChapter(entry, expectedChapter);
    if (chapter) return chapter;
  }
  return null;
}

function resolveReferences(value, rows, stack = new Set()) {
  if (typeof value === "string") {
    const match = value.match(/^\$([0-9a-f]+)$/u);
    if (!match || !rows.has(match[1])) return value;
    if (stack.has(match[1])) throw new Error(`Circular Flight reference $${match[1]}.`);
    const nextStack = new Set(stack).add(match[1]);
    return resolveReferences(rows.get(match[1]), rows, nextStack);
  }
  if (Array.isArray(value)) return value.map((entry) => resolveReferences(entry, rows, stack));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, resolveReferences(entry, rows, stack)])
  );
}

mkdirSync(outputRoot, { recursive: true });

let totalNotes = 0;
for (let chapterNumber = 1; chapterNumber <= 16; chapterNumber += 1) {
  const input = join(root, "romans", String(chapterNumber), "index.txt");
  const rows = parseFlightRows(input);
  let chapter = null;
  for (const value of rows.values()) {
    chapter = findChapter(value, chapterNumber);
    if (chapter) break;
  }
  if (!chapter) throw new Error(`Could not find Romans ${chapterNumber} in ${input}.`);

  const resolved = resolveReferences(chapter, rows);
  const expected = expectedVerseCounts[chapterNumber - 1];
  if (!Array.isArray(resolved.verses) || resolved.verses.length !== expected) {
    throw new Error(`Romans ${chapterNumber} has ${resolved.verses?.length ?? 0} verses; expected ${expected}.`);
  }
  totalNotes += resolved.verses.length;

  const filename = `chapter-${String(chapterNumber).padStart(2, "0")}.json`;
  writeFileSync(join(outputRoot, filename), `${JSON.stringify(resolved, null, 2)}\n`);
}

if (totalNotes !== 433) throw new Error(`Recovered ${totalNotes} verse notes; expected 433.`);
console.log(`Recovered ${totalNotes} Romans verse notes into ${outputRoot}.`);
