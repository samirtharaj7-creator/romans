import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REQUIRED_STEP_IDS = [
  'power-of-the-message',
  'universal-problem',
  'flaw-of-self-effort',
  'ultimate-remedy',
  'gift-versus-wage',
  'personal-response',
  'open-guarantee',
  'complete-spiritual-security',
];
const LEGACY_STUDY_SLUGS = [
  'gospel-unfolded',
  'righteousness-by-faith',
  'adam-and-christ',
  'law-flesh-and-spirit',
  'israel-and-the-nations',
  'a-living-sacrifice',
];
const REQUIRED_STEP_FIELDS = [
  'id',
  'number',
  'title',
  'reference',
  'quote',
  'paragraphs',
  'coreTruth',
  'takeaway',
  'commentaryHref',
  'icon',
  'tone',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function wordCount(value) {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
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
  const road = JSON.parse(await fs.readFile(dataPath, 'utf8'));
  const html = await fs.readFile(path.join(ROOT, 'gospel', 'index.html'), 'utf8');

  assert(road.title === 'Walking the Romans Road', 'Romans Road title is missing or incorrect.');
  assert(road.subtitle === 'Understanding the Gospel Message in 8 Verses', 'Romans Road subtitle is missing or incorrect.');
  assert(Array.isArray(road.introduction) && road.introduction.length === 2, 'Romans Road introduction must contain two paragraphs.');
  assert(Array.isArray(road.steps) && road.steps.length === 8, `Expected 8 Romans Road steps, found ${road.steps?.length || 0}.`);
  assert(road.steps.map((step) => step.id).join('|') === REQUIRED_STEP_IDS.join('|'), 'Romans Road step order or IDs are incorrect.');
  assert(!/publishing tip|wordpress|squarespace/i.test(html), 'Publisher-only guidance leaked into the public Gospel page.');
  assert(!/six visual studies|visual study library|all gospel studies/i.test(html), 'Old Gospel library copy remains on the public page.');
  assert((html.match(/data-gospel-stage(?:\s|>)/g) || []).length === 8, 'Generated Gospel page does not contain exactly eight timeline stages.');
  assert((html.match(/<tbody>[\s\S]*?<tr>/g) || []).length >= 1, 'Romans Road summary table is missing.');
  assert(/<script src="\/gospel\/gospel\.js\?v=[^"]+"><\/script>/.test(html), 'Romans Road page is missing its timeline enhancement.');
  assertUniqueHtmlIds(html, 'Romans Road');

  for (const [index, step] of road.steps.entries()) {
    REQUIRED_STEP_FIELDS.forEach((field) => assert(step[field] !== undefined, `${step.id || `Step ${index + 1}`} is missing ${field}.`));
    assert(step.number === index + 1, `${step.id} has the wrong step number.`);
    assert(step.quote.length >= 45, `${step.id} has an unexpectedly short Scripture quotation.`);
    assert(step.paragraphs.length >= 1, `${step.id} is missing explanatory prose.`);
    const explanatoryText = [
      ...step.paragraphs,
      ...(step.contrasts || []).flat(),
    ].join(' ');
    assert(wordCount(explanatoryText) >= 35, `${step.id} explanation is not substantive.`);
    assert(/^\/romans\/(?:[1-9]|1[0-6])\/#romans-\d+-\d+$/.test(step.commentaryHref), `${step.id} has an invalid commentary link.`);
    assert(html.includes(`id="romans-road-${step.id}"`), `${step.id} is absent from generated HTML.`);
    assert(html.includes(step.commentaryHref), `${step.id} commentary link is absent from generated HTML.`);
    assert(html.includes(escapeHtml(step.coreTruth)), `${step.id} core truth is absent from the summary table.`);
    assert(html.includes(escapeHtml(step.takeaway)), `${step.id} takeaway is absent from the summary table.`);

    const match = step.commentaryHref.match(/^\/romans\/(\d+)\/#(romans-\d+-\d+)$/);
    const chapterHtml = await fs.readFile(path.join(ROOT, 'romans', match[1], 'index.html'), 'utf8');
    assert(chapterHtml.includes(`id="${match[2]}"`), `${step.id} links to a missing commentary verse.`);
  }

  for (const slug of LEGACY_STUDY_SLUGS) {
    const redirectHtml = await fs.readFile(path.join(ROOT, 'gospel', slug, 'index.html'), 'utf8');
    assert(redirectHtml.includes('content="0; url=/gospel/"'), `${slug} is not redirected to the Romans Road.`);
    assert(!redirectHtml.includes('data-gospel-stage'), `${slug} still exposes the former study content.`);
  }

  process.stdout.write('Validated the 8-step Romans Road, summary table, commentary links, and 6 legacy redirects.\n');
}

await main();
