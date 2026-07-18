import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const checkOnly = process.argv.includes("--check");
const layoutMarker = "/_next/static/chunks/app/layout-7a59849285855451.js";
const legacyAssetVersion = "romans-home-static-74";
const currentAssetVersion = "romans-home-static-75";
const actionsMarker = '<div class="reader-header-actions"><button';
const themeMarker = 'class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-muted h-10 px-4 py-2 theme-word-toggle"';
const themeButton = `<button ${themeMarker} aria-label="Toggle theme"><span>Dark</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon h-4 w-4" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path></svg></button>`;

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

  const themeCount = html.split(themeMarker).length - 1;
  if (themeCount === 1) continue;
  if (themeCount > 1) {
    throw new Error(`${relative(root, file)} has ${themeCount} theme hydration controls`);
  }
  if (!html.includes(actionsMarker)) {
    throw new Error(`${relative(root, file)} is missing the reader header action marker`);
  }
  if (checkOnly) {
    throw new Error(`${relative(root, file)} is missing the server-rendered theme control`);
  }

  html = html.replace(actionsMarker, `<div class="reader-header-actions">${themeButton}<button`);
  await writeFile(file, html);
}

if (targets.length !== 19) {
  throw new Error(`Expected 19 Next-rendered HTML artifacts; found ${targets.length}`);
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

console.log(`${checkOnly ? "Validated" : "Synchronized"} theme hydration markup in ${targets.length} Next artifacts and ${htmlFiles.length} HTML asset references.`);
