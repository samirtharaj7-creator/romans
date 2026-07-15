import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REQUIRED_STUDIES = [
  'gospel-unfolded',
  'righteousness-by-faith',
  'adam-and-christ',
  'law-flesh-and-spirit',
  'israel-and-the-nations',
  'a-living-sacrifice',
];
const REQUIRED_STAGE_FIELDS = [
  'id',
  'phase',
  'reference',
  'title',
  'brief',
  'icon',
  'tone',
  'expandedStudy',
  'crossReferences',
  'commentaryHref',
  'excerpt',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function wordCount(value) {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function assertUniqueHtmlIds(html, pageName) {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const seen = new Set();
  for (const id of ids) {
    assert(!seen.has(id), `${pageName} contains duplicate DOM ID: ${id}`);
    seen.add(id);
  }
}

async function main() {
  const dataPath = path.join(ROOT, 'data', 'gospel-studies.json');
  const studies = JSON.parse(await fs.readFile(dataPath, 'utf8'));
  assert(studies.length === 6, `Expected 6 studies, found ${studies.length}`);
  assert(studies.map((study) => study.slug).join('|') === REQUIRED_STUDIES.join('|'), 'Study order or slugs do not match the approved library.');

  const stageIds = new Set();
  let stageCount = 0;
  for (const study of studies) {
    assert(study.title && study.passage && study.summary && study.introduction, `${study.slug} is missing study metadata.`);
    assert(study.stages.length >= 8 && study.stages.length <= 10, `${study.slug} has an unexpected stage count.`);
    const htmlPath = path.join(ROOT, 'gospel', study.slug, 'index.html');
    const html = await fs.readFile(htmlPath, 'utf8');
    assert(!/coming soon|placeholder|todo/i.test(html), `${study.slug} contains unfinished public copy.`);
    assert(html.includes('<blockquote>'), `${study.slug} is missing Scripture excerpts.`);
    assert(html.includes('/gospel/gospel.js'), `${study.slug} is missing the timeline enhancement.`);
    assert((html.match(/data-gospel-stage-expanded/g) || []).length === study.stages.length, `${study.slug} is missing static expanded content.`);
    assert(!/data-gospel-stage-expanded[^>]*\shidden(?:\s|=|>)/.test(html), `${study.slug} hides study content before JavaScript runs.`);
    assertUniqueHtmlIds(html, study.slug);

    for (const stage of study.stages) {
      stageCount += 1;
      REQUIRED_STAGE_FIELDS.forEach((field) => assert(stage[field] !== undefined, `${study.slug}/${stage.id} is missing ${field}.`));
      const globalId = `${study.slug}-${stage.id}`;
      assert(!stageIds.has(globalId), `Duplicate stage ID: ${globalId}`);
      stageIds.add(globalId);
      const words = wordCount(stage.expandedStudy);
      assert(words >= 150 && words <= 250, `${globalId} expanded study has ${words} words; expected 150-250.`);
      assert(stage.crossReferences.length >= 2 && stage.crossReferences.length <= 4, `${globalId} must have 2-4 cross references.`);
      assert(stage.excerpt.length >= 1 && stage.excerpt.length <= 3, `${globalId} must have 1-3 excerpt verses.`);
      assert(/^\/romans\/(?:[1-9]|1[0-6])\/#romans-\d+-\d+$/.test(stage.commentaryHref), `${globalId} has an invalid commentary link.`);
      assert(html.includes(`id="${globalId}"`), `${globalId} is absent from generated HTML.`);

      const commentaryMatch = stage.commentaryHref.match(/^\/romans\/(\d+)\/#(romans-\d+-\d+)$/);
      const chapterHtml = await fs.readFile(path.join(ROOT, 'romans', commentaryMatch[1], 'index.html'), 'utf8');
      assert(chapterHtml.includes(`id="${commentaryMatch[2]}"`), `${globalId} links to a missing commentary verse.`);
    }
  }

  const libraryHtml = await fs.readFile(path.join(ROOT, 'gospel', 'index.html'), 'utf8');
  REQUIRED_STUDIES.forEach((slug) => assert(libraryHtml.includes(`/gospel/${slug}/`), `Library is missing ${slug}.`));
  assert(!/coming soon|placeholder|todo/i.test(libraryHtml), 'Library contains unfinished public copy.');
  assertUniqueHtmlIds(libraryHtml, 'gospel library');
  assert(stageCount === 56, `Expected 56 stages, found ${stageCount}.`);
  process.stdout.write(`Validated ${studies.length} Gospel studies and ${stageCount} substantive timeline stages.\n`);
}

await main();
