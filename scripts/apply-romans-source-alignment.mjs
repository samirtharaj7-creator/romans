import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const contentRoot = process.argv[2] ?? join(process.cwd(), "content", "romans");

function readChapter(chapterNumber) {
  const path = join(contentRoot, `chapter-${String(chapterNumber).padStart(2, "0")}.json`);
  return { path, chapter: JSON.parse(readFileSync(path, "utf8")) };
}

function findVerse(chapter, reference) {
  const verse = chapter.verses.find((entry) => entry.verse === reference);
  if (!verse) throw new Error(`Missing ${reference}.`);
  return verse;
}

function replaceOnce(value, before, after, label) {
  if (value.includes(after)) return value;
  const first = value.indexOf(before);
  if (first === -1) throw new Error(`${label}: expected text was not found.`);
  if (value.indexOf(before, first + before.length) !== -1) {
    throw new Error(`${label}: expected text occurs more than once.`);
  }
  return value.replace(before, after);
}

function appendParagraph(value, paragraph) {
  if (value.includes(paragraph)) return value;
  return `${value.trim()}\n\n${paragraph}`;
}

const revisions = [];

{
  const { path, chapter } = readChapter(1);
  const verse = findVerse(chapter, "Romans 1:18");
  const before = "God's wrath is His holy and judicial opposition to evil. It arises not from fickleness but from righteousness and love together.";
  const after = "God's wrath is His holy and judicial opposition to evil, and it must not be compared to human passion. In the movement of this chapter it is revealed as God gives persistent rebels over to the path they have chosen, withdrawing the protection and life-giving presence they refuse. Judgment is therefore neither fickle nor arbitrary; it is the solemn consequence of rejecting the Source of life.";

  verse.commentary.detailedExplanation = replaceOnce(
    verse.commentary.detailedExplanation,
    before,
    after,
    "Romans 1:18 detailed explanation"
  );
  writeFileSync(path, `${JSON.stringify(chapter, null, 2)}\n`);
  revisions.push("Romans 1:18");
}

{
  const { path, chapter } = readChapter(5);
  const verse = findVerse(chapter, "Romans 5:1");
  const paragraph = "The Greek textual tradition also preserves the closely related reading, \"let us have peace.\" That need not mean believers must obtain peace by their own effort; the wording can carry the sense, \"let us continue to enjoy the peace\" granted in justification. Whether the line is read as assurance (\"we have peace\") or as an appeal to retain and enjoy that peace, Paul's theological point remains the same: reconciliation is God's gift through Jesus Christ.";

  verse.commentary.detailedExplanation = appendParagraph(verse.commentary.detailedExplanation, paragraph);
  writeFileSync(path, `${JSON.stringify(chapter, null, 2)}\n`);
  revisions.push("Romans 5:1");
}

{
  const { path, chapter } = readChapter(14);
  const verse = findVerse(chapter, "Romans 14:9");
  const paragraph = "Paul is not describing death as a transfer of an immortal soul into another sphere of conscious service. Believers who die belong to Christ while they sleep in Him, and His resurrection guarantees that the dead in Christ will rise. His lordship embraces both living believers and those awaiting resurrection; death cannot remove anyone from His claim, and every person will answer to Him when God raises the dead.";

  verse.commentary.detailedExplanation = appendParagraph(verse.commentary.detailedExplanation, paragraph);
  writeFileSync(path, `${JSON.stringify(chapter, null, 2)}\n`);
  revisions.push("Romans 14:9");
}

{
  const { path, chapter } = readChapter(16);
  const verse = findVerse(chapter, "Romans 16:7");
  const before = "Junia is best treated as a woman's name in the ordinary reading of the text. The phrase translated 'of note among the apostles' can be understood in more than one way, so this line clearly establishes honor, seniority, suffering, and recognized gospel service without by itself settling later debates about church office or ordination.";
  const after = "The name can be read as Junia or Junias and may refer to either a woman or a man. The phrase translated 'of note among the apostles' can likewise mean either that these believers were well known to the apostles or that they were themselves distinguished apostles. The verse clearly establishes honor, seniority, suffering, and recognized gospel service, while its wording alone does not settle later debates about church office or ordination.";

  verse.commentary.detailedExplanation = replaceOnce(
    verse.commentary.detailedExplanation,
    before,
    after,
    "Romans 16:7 detailed explanation"
  );
  writeFileSync(path, `${JSON.stringify(chapter, null, 2)}\n`);
  revisions.push("Romans 16:7");
}

console.log(`Aligned ${revisions.length} notes with the controlling Romans source: ${revisions.join(", ")}.`);
