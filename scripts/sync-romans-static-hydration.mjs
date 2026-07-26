import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const checkOnly = process.argv.includes("--check");
const layoutMarker = "/_next/static/chunks/app/layout-7a59849285855451.js";
const currentLayoutReference = `${layoutMarker}?v=romans-shell-static-79`;
const layoutChunkPath = join(root, layoutMarker.slice(1));
const legacyAssetVersion = "romans-home-static-74";
const currentAssetVersion = "romans-home-static-80";

async function listHtml(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listHtml(path)));
    else if (extname(entry.name) === ".html") files.push(path);
  }
  return files;
}

const targets = [];
const htmlFiles = await listHtml(root);
for (const file of htmlFiles) {
  let html = await readFile(file, "utf8");
  if (html.includes(legacyAssetVersion)) {
    if (checkOnly) {
      throw new Error(`${relative(root, file)} still references ${legacyAssetVersion}`);
    }
    html = html.replaceAll(legacyAssetVersion, currentAssetVersion);
    await writeFile(file, html);
  }
  if (!html.includes(layoutMarker)) continue;
  targets.push(file);

  if (!html.includes(currentLayoutReference)) {
    throw new Error(`${relative(root, file)} is missing the current layout asset version`);
  }
  if (html.includes('reader-header no-print')) {
    throw new Error(`${relative(root, file)} still contains the obsolete reader header`);
  }
}

if (targets.length !== 16) {
  throw new Error(`Expected 16 Next-rendered HTML artifacts; found ${targets.length}`);
}

const layoutChunk = await readFile(layoutChunkPath, "utf8");
if (!layoutChunk.includes("function w(){return null}")) {
  throw new Error("The obsolete React reader header is still enabled");
}

const unifiedScript = await readFile(join(root, "mbe-unified.js"), "utf8");
for (const required of [
  `const illustratedVersion = "${currentAssetVersion}"`,
  "const scheduleShellAfterHydration = () =>",
  "window.setTimeout(ensureShell, 100)",
  "window.addEventListener('load', scheduleShellAfterHydration, { once: true })",
]) {
  if (!unifiedScript.includes(required)) {
    throw new Error(`mbe-unified.js is missing hydration guard: ${required}`);
  }
}
if (unifiedScript.includes("removeThemeToggle") || unifiedScript.includes("DOMContentLoaded', ensureShell")) {
  throw new Error("mbe-unified.js can mutate the React-owned header before hydration");
}

for (const generator of ["scripts/build-gospel-studies.mjs", "scripts/sync-romans-natural-flow-export.mjs"]) {
  const source = await readFile(join(root, generator), "utf8");
  if (!source.includes(currentAssetVersion)) {
    throw new Error(`${generator} does not use ${currentAssetVersion}`);
  }
}

console.log(`${checkOnly ? "Validated" : "Synchronized"} the consolidated shell in ${targets.length} interactive chapter artifacts and ${htmlFiles.length} HTML files.`);
