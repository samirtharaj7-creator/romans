import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const siteRoot = process.cwd();
const defaultContentRoot = join(siteRoot, "content", "romans");
// No arguments run all public controls. Private page mapping remains an explicit opt-in.
const argumentsList = process.argv.slice(2);
let sourceTextPath = null;
let contentRoot = defaultContentRoot;
let reportPath = null;

if (argumentsList[0] === "--public-only") {
  if (argumentsList.length > 3) {
    throw new Error(
      "Usage: validate-romans-source-agreement.mjs --public-only [content-root] [report-path]"
    );
  }
  if (argumentsList[1]) contentRoot = resolve(siteRoot, argumentsList[1]);
  if (argumentsList[2]) reportPath = resolve(siteRoot, argumentsList[2]);
} else if (argumentsList[0] === "--private-source") {
  if (!argumentsList[1] || argumentsList.length > 4) {
    throw new Error(
      "Usage: validate-romans-source-agreement.mjs --private-source <source-text> [content-root] [report-path]"
    );
  }
  sourceTextPath = resolve(siteRoot, argumentsList[1]);
  if (argumentsList[2]) contentRoot = resolve(siteRoot, argumentsList[2]);
  if (argumentsList[3]) reportPath = resolve(siteRoot, argumentsList[3]);
} else if (argumentsList.length > 0) {
  if (argumentsList.length > 3) {
    throw new Error(
      "Usage: validate-romans-source-agreement.mjs <private-source-text> [content-root] [report-path]"
    );
  }
  sourceTextPath = resolve(siteRoot, argumentsList[0]);
  if (argumentsList[1]) contentRoot = resolve(siteRoot, argumentsList[1]);
  if (argumentsList[2]) reportPath = resolve(siteRoot, argumentsList[2]);
}
const chapters = new Map();
const verses = new Map();
const expectedVerseCounts = [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27];

for (let chapterNumber = 1; chapterNumber <= 16; chapterNumber += 1) {
  const path = join(contentRoot, `chapter-${String(chapterNumber).padStart(2, "0")}.json`);
  const chapter = JSON.parse(readFileSync(path, "utf8"));
  if (chapter.chapterNumber !== chapterNumber) {
    throw new Error(`${path} reports chapter ${chapter.chapterNumber}.`);
  }
  const expectedVerseCount = expectedVerseCounts[chapterNumber - 1];
  if (chapter.verses?.length !== expectedVerseCount) {
    throw new Error(`${path} has ${chapter.verses?.length ?? 0} verses; expected ${expectedVerseCount}.`);
  }
  chapters.set(chapterNumber, chapter);
  for (const [index, verse] of chapter.verses.entries()) {
    const expectedReference = `Romans ${chapterNumber}:${index + 1}`;
    if (verse.verse !== expectedReference) {
      throw new Error(`${path} verse ${index + 1} is labeled ${verse.verse}; expected ${expectedReference}.`);
    }
    if (verses.has(verse.verse)) throw new Error(`Duplicate note ${verse.verse}.`);
    verses.set(verse.verse, verse);
  }
}

if (verses.size !== 433) throw new Error(`Expected 433 Romans notes; found ${verses.size}.`);

let sourceHash = null;
let sourcePageCount = 0;
const sourceCoverage = [];
const sourceChapterRanges = [];
let exactVerseHeadings = 0;
let groupedVerseHeadings = 0;

if (sourceTextPath) {
  const sourceText = readFileSync(sourceTextPath, "utf8");
  const sourceLines = sourceText.split(/\r?\n/u);
  sourceHash = createHash("sha256").update(sourceText).digest("hex");
  let currentPage = null;
  const pageAtLine = [];
  const pageNumbers = new Set();
  for (let index = 0; index < sourceLines.length; index += 1) {
    const pageMatch = sourceLines[index].match(/^===== PDF PAGE (\d+) =====$/u);
    if (pageMatch) {
      currentPage = Number.parseInt(pageMatch[1], 10);
      pageNumbers.add(currentPage);
    }
    pageAtLine[index] = currentPage;
  }

  if (pageNumbers.size !== 210) {
    throw new Error(`Expected 210 extracted source pages; found ${pageNumbers.size}.`);
  }

  const chapterStarts = [];
  for (let index = 0; index < sourceLines.length; index += 1) {
    const chapterMatch = sourceLines[index].match(/^CHAPTER ([1-9]|1[0-6])$/u);
    if (chapterMatch) chapterStarts.push({ chapter: Number.parseInt(chapterMatch[1], 10), line: index });
  }

  if (chapterStarts.length !== 16) {
    throw new Error(`Expected 16 source chapter boundaries; found ${chapterStarts.length}.`);
  }

  for (let chapterIndex = 0; chapterIndex < chapterStarts.length; chapterIndex += 1) {
    const start = chapterStarts[chapterIndex];
    const endLine = chapterStarts[chapterIndex + 1]?.line ?? sourceLines.length;
    const chapter = chapters.get(start.chapter);
    let cursor = start.line;
    let previousPage = pageAtLine[start.line];

    sourceChapterRanges.push({
      chapter: start.chapter,
      startPage: pageAtLine[start.line],
      endPage: pageAtLine[Math.max(start.line, endLine - 1)]
    });

    for (let verseNumber = 1; verseNumber <= chapter.verses.length; verseNumber += 1) {
      let headingLine = -1;
      const headingPattern = new RegExp(`^${verseNumber}\\.\\s`, "u");
      for (let index = cursor; index < endLine; index += 1) {
        if (headingPattern.test(sourceLines[index])) {
          headingLine = index;
          break;
        }
      }

      const exactHeading = headingLine !== -1;
      if (exactHeading) {
        cursor = headingLine + 1;
        previousPage = pageAtLine[headingLine] ?? previousPage;
        exactVerseHeadings += 1;
      } else {
        groupedVerseHeadings += 1;
      }

      const reference = `Romans ${start.chapter}:${verseNumber}`;
      sourceCoverage.push({
        reference,
        sourcePage: previousPage,
        sourceMapping: exactHeading ? "explicit-verse-heading" : "grouped-with-adjacent-comment"
      });
    }
  }

  if (sourceCoverage.length !== 433) {
    throw new Error(`Expected source coverage for 433 notes; mapped ${sourceCoverage.length}.`);
  }
  sourcePageCount = pageNumbers.size;
}

function publicNoteText(verse) {
  const publicFields = {
    explanation: verse.explanation,
    historicalBackground: verse.historicalBackground,
    literaryContext: verse.literaryContext,
    theologicalInsight: verse.theologicalInsight,
    relatedConnection: verse.relatedConnection,
    application: verse.application,
    commentary: verse.commentary,
    wordNotes: verse.wordNotes
  };
  return JSON.stringify(publicFields);
}

const sourceLeakPatterns = [
  /SDA Bible Commentary/iu,
  /Seventh-day Adventist Bible Commentary/iu,
  /SdaBc/iu,
  /White Estate/iu,
  /https?:\/\//iu,
  /filecite/iu,
  //u
];
const sourceLeaks = [];
const incompleteNotes = [];
const reviewFlags = [];

for (const [reference, verse] of verses) {
  const note = publicNoteText(verse);
  if ((verse.commentary?.detailedExplanation ?? "").trim().split(/\s+/u).length < 120) {
    incompleteNotes.push(reference);
  }
  if (verse.reviewStatus !== "verified-seed") {
    reviewFlags.push(`${reference}: reviewStatus=${verse.reviewStatus}`);
  }
  if ((verse.commentary?.reviewFlags ?? []).length > 0) {
    reviewFlags.push(`${reference}: ${verse.commentary.reviewFlags.join(", ")}`);
  }
  for (const pattern of sourceLeakPatterns) {
    if (pattern.test(note)) sourceLeaks.push(`${reference}: ${pattern}`);
  }
}

const controls = [
  ["Romans 1:18", [/must not be compared to human passion/iu, /gives persistent rebels over/iu, /withdrawing the protection and life-giving presence/iu]],
  ["Romans 2:6", [/works are not the ground/iu, /evidence/iu]],
  ["Romans 2:13", [/not an argument for self-salvation/iu, /obedience/iu]],
  ["Romans 3:20", [/law cannot justify/iu, /knowledge of sin/iu]],
  ["Romans 3:25", [/does not begin with man persuading an unwilling God/iu, /God Himself has set forth Christ/iu]],
  ["Romans 3:31", [/faith establishes the law/iu, /does not nullify the law/iu]],
  ["Romans 4:5", [/Nor does he mean that God approves ungodliness/iu, /ground of acceptance/iu]],
  ["Romans 5:1", [/let us have peace/iu, /continue to enjoy the peace/iu, /reconciliation/iu]],
  ["Romans 5:12", [/not.*personally guilty for Adam's act/iu, /fallen condition/iu, /actual sin/iu]],
  ["Romans 5:18", [/must not be read as universalism/iu, /gift must be received/iu]],
  ["Romans 6:4", [/baptism by immersion/iu, /no saving power apart from faith/iu]],
  ["Romans 6:14", [/moral law has become irrelevant/iu, /under grace/iu]],
  ["Romans 6:23", [/not a naturally immortal possession/iu, /bodily resurrection/iu]],
  ["Romans 7:14", [/cannot be read.*normal settled life/iu, /apart from liberating power/iu]],
  ["Romans 8:1", [/no condemnation/iu, /not (?:presumption or )?permission/iu]],
  ["Romans 8:11", [/bodily resurrection/iu, /not the release of a naturally immortal soul/iu]],
  ["Romans 8:29", [/not.*fatalism/iu, /conformity to Christ/iu]],
  ["Romans 9:18", [/hardening is judicial/iu, /resisted light/iu]],
  ["Romans 9:22", [/does not here say.*God prepared/iu, /much longsuffering/iu]],
  ["Romans 10:4", [/not saying.*moral law.*canceled/iu, /goal|culmination/iu]],
  ["Romans 11:26", [/does not mean that every ethnic Israelite/iu, /one Savior, one gospel, one mercy/iu]],
  ["Romans 13:1", [/civil authority is delegated and limited/iu, /not the lord of the conscience/iu]],
  ["Romans 14:5", [/not discussing the fourth commandment/iu, /weekly Sabbath is not named/iu]],
  ["Romans 14:9", [/sleep in Him/iu, /not describing death as a transfer of an immortal soul/iu, /dead in Christ will rise|bodily resurrection/iu]],
  ["Romans 14:14", [/koinos/iu, /akathartos/iu, /does not announce the abolition/iu]],
  ["Romans 16:1", [/diakonos/iu, /does not state that detail explicitly/iu, /ordination debates/iu]],
  ["Romans 16:7", [/Junia or Junias/iu, /either a woman or a man/iu, /well known to the apostles.*distinguished apostles/iu]]
];

const controlResults = [];
const failedControls = [];
for (const [reference, requiredPatterns] of controls) {
  const verse = verses.get(reference);
  if (!verse) throw new Error(`Control references missing note ${reference}.`);
  const note = publicNoteText(verse);
  const failures = requiredPatterns.filter((pattern) => !pattern.test(note)).map(String);
  controlResults.push({ reference, passed: failures.length === 0, checks: requiredPatterns.length });
  if (failures.length > 0) failedControls.push({ reference, failures });
}

const globalContradictionPatterns = [
  /faith (?:abolishes|cancels) (?:God's )?(?:moral )?law[.!]/iu,
  /salvation (?:is|comes) by works[.!]/iu,
  /every (?:person|human being) will be saved regardless of faith/iu,
  /Adam's guilt is personally imputed to every descendant/iu,
  /the soul is naturally immortal[.!]/iu,
  /God creates unbelief in innocent people/iu,
  /Romans 14 abolishes the Sabbath/iu,
  /Romans 14 abolishes the clean-and-unclean distinction/iu,
  /civil government is the lord of conscience/iu
];
const globalContradictions = [];
for (const [reference, verse] of verses) {
  const note = publicNoteText(verse);
  for (const pattern of globalContradictionPatterns) {
    if (pattern.test(note)) globalContradictions.push(`${reference}: ${pattern}`);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  source: sourceTextPath
    ? {
        mode: "private-source",
        sha256: sourceHash,
        pages: sourcePageCount,
        chapters: sourceChapterRanges
      }
    : {
        mode: "public-only",
        status: "not-run-private-source-required"
      },
  coverage: {
    chapters: chapters.size,
    notes: verses.size,
    explicitVerseHeadings: exactVerseHeadings,
    groupedVerseHeadings,
    sourceMappedNotes: sourceCoverage.length,
    verifiedSeedNotes: [...verses.values()].filter((verse) => verse.reviewStatus === "verified-seed").length
  },
  controls: controlResults,
  findings: {
    failedControls,
    sourceLeaks,
    incompleteNotes,
    reviewFlags,
    globalContradictions
  },
  verseSourceCoverage: sourceCoverage
};

if (reportPath) writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

const failures = [
  ...failedControls.map((failure) => `${failure.reference}: ${failure.failures.join(", ")}`),
  ...sourceLeaks,
  ...incompleteNotes.map((reference) => `${reference}: note shorter than 120 words`),
  ...reviewFlags,
  ...globalContradictions
];

if (failures.length > 0) {
  throw new Error(`Source-agreement validation failed:\n${failures.join("\n")}`);
}

console.log(
  sourceTextPath
    ? `Romans source agreement passed: ${verses.size} notes mapped to ${sourcePageCount} private source pages; ` +
        `${controls.length} theological controls passed; no public source leakage or contradiction markers found.`
    : `Romans public source controls passed: ${verses.size} canonical notes and ${controls.length} theological controls; ` +
        `no public source leakage or contradiction markers found. Private source-page mapping was not run.`
);
