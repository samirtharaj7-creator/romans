import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const shellPath = join(root, 'mbe-unified.js');
const shell = await readFile(shellPath, 'utf8');

function readMarkupConstant(name) {
  const match = shell.match(new RegExp(`const ${name} = ("(?:[^"\\\\]|\\\\.)*");`));
  if (!match) throw new Error(`Could not find ${name} in mbe-unified.js`);
  return JSON.parse(match[1]).trim();
}

const header = readMarkupConstant('headerMarkup');
const footer = readMarkupConstant('footerMarkup');
const readerHeaderPattern = /[ \t]*<header class="reader-header no-print">[\s\S]*?<\/header>\s*/;

async function articlePages() {
  const directory = join(root, 'articles');
  const entries = await readdir(directory, { withFileTypes: true });
  return [
    join(directory, 'index.html'),
    ...entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(directory, entry.name, 'index.html')),
  ];
}

async function consolidateStaticPage(file, route) {
  let html = await readFile(file, 'utf8');
  html = html.replace(readerHeaderPattern, '\n');
  html = html.replace(/<body([^>]*)>/, (opening, attributes) => {
    let next = attributes;
    if (/\bclass="/.test(next)) {
      next = next.replace(/\bclass="([^"]*)"/, (_, classes) => (
        `class="${classes.split(/\s+/).filter(Boolean).concat('mbe-shell-managed').filter((value, index, all) => all.indexOf(value) === index).join(' ')}"`
      ));
    } else {
      next += ' class="mbe-shell-managed"';
    }
    if (!/\bdata-romans-route=/.test(next)) next += ` data-romans-route="${route}"`;
    return `<body${next}>`;
  });
  if (!html.includes('class="mbe-global-shell"')) {
    html = html.replace(/<body[^>]*>/, (opening) => `${opening}\n${header}`);
  }
  if (!html.includes('class="mbe-global-footer"')) {
    html = html.replace(
      /([ \t]*)<script src="\/mbe-unified\.js[^"]*"><\/script>/,
      `${footer}\n$1<script src="/mbe-unified.js?v=romans-shell-static-79"></script>`,
    );
  }
  html = html.replace(/mbe-unified\.js\?v=[^"]+/g, 'mbe-unified.js?v=romans-shell-static-79');
  await writeFile(file, html);
}

await consolidateStaticPage(join(root, 'index.html'), 'home');
await consolidateStaticPage(join(root, '404.html'), 'not-found');
await consolidateStaticPage(join(root, 'gospel', 'index.html'), 'gospel');
for (const file of await articlePages()) {
  await consolidateStaticPage(file, 'articles');
}

for (let chapter = 1; chapter <= 16; chapter += 1) {
  const file = join(root, 'romans', String(chapter), 'index.html');
  let html = await readFile(file, 'utf8');
  html = html.replace(
    new RegExp(`<body class="mbe-shell-managed(?: mbe-shell-pending)?" data-romans-route="commentary" data-romans-chapter="${chapter}">\\s*${header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
    `<body class="mbe-shell-managed mbe-shell-pending" data-romans-route="commentary" data-romans-chapter="${chapter}">`,
  );
  html = html.replace(
    new RegExp(`<body class="mbe-shell-managed(?: mbe-shell-pending)?" data-romans-route="commentary" data-romans-chapter="${chapter}">`),
    `<body class="mbe-shell-managed mbe-shell-pending" data-romans-route="commentary" data-romans-chapter="${chapter}">`,
  );
  html = html.replace('<body>', `<body class="mbe-shell-managed mbe-shell-pending" data-romans-route="commentary" data-romans-chapter="${chapter}">`);
  html = html.replace(readerHeaderPattern, '');
  html = html.replace(
    /layout-7a59849285855451\.js\?v=[^"]+/g,
    'layout-7a59849285855451.js?v=romans-shell-static-79',
  );
  html = html.replace(/mbe-unified\.js\?v=[^"]+/g, 'mbe-unified.js?v=romans-shell-static-79');
  await writeFile(file, html);
}

console.log('Consolidated the current shell into home, articles, gospel, and 16 chapter pages.');
