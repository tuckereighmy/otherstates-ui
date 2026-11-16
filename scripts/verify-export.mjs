// V2 · Export verifier for the theme builder. Run with plain node from the repo root:
//   node scripts/verify-export.mjs
// Applies every export to copies of the real token files in a scratch folder (never in the repo):
// OS_EXPORT_SCRATCH=<folder>, default <os tmpdir>/otherstates-verify-export.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mod = p => import(new URL(`../src/ui/customize/${p}`, import.meta.url).href);
const { baseFromSources, parseTokenSource } = await mod('base-values.ts');
const { PRESETS, ALL_AVAILABLE, normalizeRecipe, sameRecipe, recipeToJson, encodeRecipe } = await mod('recipe.ts');
const { deriveTheme } = await mod('derive.ts');
const { parseColor, rgbToHex } = await mod('color.ts');
const { patchTokenSources, themeFile, cssVariables, dtcgTokens, recipeSnippet, shareUrl, parseImport, headerLines } = await mod('export.ts');

const scratch = process.env.OS_EXPORT_SCRATCH || path.join(os.tmpdir(), 'otherstates-verify-export');
fs.rmSync(scratch, { recursive: true, force: true });
fs.mkdirSync(scratch, { recursive: true });

const tokensSrc = fs.readFileSync(path.join(root, 'src/ui/tokens.stylex.ts'), 'utf8');
const themeSrc = fs.readFileSync(path.join(root, 'src/ui/theme.ts'), 'utf8');
const base = baseFromSources(tokensSrc, themeSrc);
const stockTheme = parseTokenSource(themeSrc);
const { DARK_OVERRIDE_NAMES } = await mod('base-values.ts');

let checks = 0;
const failures = [];
const check = (ok, message) => { checks++; if (!ok) failures.push(message); return ok; };
const equalMaps = (got, want, label) => {
  const keys = Object.keys(want);
  check(Object.keys(got).length === keys.length, `${label}: ${Object.keys(got).length} tokens, expected ${keys.length}`);
  const bad = keys.filter(k => got[k] !== want[k]);
  check(bad.length === 0, `${label}: ${bad.length} values differ, e.g. ${bad[0]} ${got[bad[0]]} ≠ ${want[bad[0]]}`);
};
const syntaxOk = file => spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' }).status === 0;
const ENTRY = /"(--os-[a-z0-9-]+)":\s*"((?:[^"\\]|\\.)*)"/;
const skeleton = text => text.split('\n').map(line => line.replace(ENTRY, '"$1": ""').replace(/(""),\s*$/, '$1'));

// Tiny CSS reader: selector path → declarations.
function readCss(text) {
  const body = text.replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks = [];
  const stack = [];
  let buf = '';
  let depth = 0, balanced = true;
  for (const ch of body) {
    if (ch === '{') { stack.push({ selector: buf.trim(), decls: [] }); buf = ''; depth++; }
    else if (ch === '}') {
      if (buf.trim()) stack[stack.length - 1]?.decls.push(buf.trim());
      buf = '';
      const block = stack.pop();
      if (!block) { balanced = false; continue; }
      depth--;
      blocks.push({ path: [...stack.map(b => b.selector), block.selector].join(' > '), decls: block.decls });
    } else if (ch === ';' && stack.length) { stack[stack.length - 1].decls.push(buf.trim()); buf = ''; }
    else buf += ch;
  }
  return { balanced: balanced && depth === 0, blocks: blocks.map(b => ({ path: b.path, decls: b.decls.filter(Boolean).map(d => [d.slice(0, d.indexOf(':')).trim(), d.slice(d.indexOf(':') + 1).trim()]) })) };
}

const DTCG_TYPES = new Set(['color', 'dimension', 'fontFamily', 'fontWeight', 'duration', 'cubicBezier', 'number', 'shadow', 'gradient', 'strokeStyle', 'border', 'transition', 'typography']);
function walk(node, at, out) {
  if (node && typeof node === 'object' && '$value' in node) { out.push([at.join('.'), node]); return; }
  for (const [k, v] of Object.entries(node)) if (!k.startsWith('$') && v && typeof v === 'object') walk(v, [...at, k], out);
}

// Recipes: presets and 50 seeded-random recipes (every option, including the flagged ones).
let seed = 0xe4b047;
const rand = () => { seed = (seed + 0x6d2b79f5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
const pick = list => list[Math.floor(rand() * list.length)];
const hex = () => '#' + Array.from({ length: 3 }, () => Math.floor(rand() * 256).toString(16).padStart(2, '0')).join('');
const recipes = Object.values(PRESETS).map(p => p.recipe);
for (let i = 0; i < 50; i++) {
  recipes.push(normalizeRecipe({
    accent: rand() < 0.4 ? pick(['ink', 'harbor', 'lagoon', 'plum', 'orchid']) : hex(), accentDark: rand() < 0.2 ? hex() : null,
    neutrals: pick(['paper', 'pure', 'slate', 'sage', 'tinted']), corners: pick(['round', 'tight', 'standard', 'soft']), typeface: pick(['inter', 'platform']),
    contrast: pick(['standard', 'more']), focusFollowsAccent: rand() < 0.7, linksFollowAccent: rand() < 0.7,
  }, ALL_AVAILABLE));
}

const summaries = [];
check(JSON.stringify(DARK_OVERRIDE_NAMES) === JSON.stringify(Object.keys(stockTheme)), 'drift: DARK_OVERRIDE_NAMES differs from theme.ts');
for (const recipe of recipes) {
  const theme = deriveTheme(recipe, base);
  const label = theme.code;
  const dir = path.join(scratch, label.replace(/[^a-z0-9.-]/g, '_'));
  fs.mkdirSync(dir, { recursive: true });
  const expectedImport = normalizeRecipe(theme.recipe); // what the docs would apply (availability on)

  // 1. Edit your files.
  fs.writeFileSync(path.join(dir, 'tokens.stylex.ts'), tokensSrc);
  fs.writeFileSync(path.join(dir, 'theme.ts'), themeSrc);
  const patch = patchTokenSources(theme, { tokensSrc: fs.readFileSync(path.join(dir, 'tokens.stylex.ts'), 'utf8'), themeSrc: fs.readFileSync(path.join(dir, 'theme.ts'), 'utf8') });
  fs.writeFileSync(path.join(dir, 'tokens.stylex.ts'), patch.tokens);
  fs.writeFileSync(path.join(dir, 'theme.ts'), patch.theme);
  const light = parseTokenSource(fs.readFileSync(path.join(dir, 'tokens.stylex.ts'), 'utf8'));
  const dark = { ...light, ...parseTokenSource(fs.readFileSync(path.join(dir, 'theme.ts'), 'utf8')) };
  equalMaps(light, theme.light, `patch ${label} light`);
  equalMaps(dark, theme.dark, `patch ${label} dark`);
  check(JSON.stringify(skeleton(patch.tokens)) === JSON.stringify(skeleton(tokensSrc)), `patch ${label}: tokens.stylex.ts changed more than literals`);
  const oldSk = skeleton(themeSrc), newSk = skeleton(patch.theme);
  let j = 0;
  for (const line of newSk) if (j < oldSk.length && line === oldSk[j]) j++;
  check(j === oldSk.length, `patch ${label}: theme.ts changed more than literals and inserted entries`);
  check(syntaxOk(path.join(dir, 'tokens.stylex.ts')) && syntaxOk(path.join(dir, 'theme.ts')), `patch ${label}: patched files do not parse`);
  if (theme.identity) {
    check(patch.tokens === tokensSrc && patch.theme === themeSrc, `patch ${label}: House is not a no-op`);
    check(patch.changed.light.length === 0 && patch.changed.dark.length === 0, `patch ${label}: House lists changes`);
  }
  summaries.push(`${label}: ${patch.changed.light.length} light / ${patch.changed.dark.length} dark`);

  // 2. Theme file.
  const file = themeFile(theme, { base, themeSrc });
  check(file === themeFile(theme, { base }), `theme file ${label}: snapshot and source keys disagree`);
  fs.writeFileSync(path.join(dir, 'otherstates-theme.ts'), file);
  const at = file.search(/export const \w+Dark = /);
  const lightObj = parseTokenSource(file.slice(0, at)), darkObj = parseTokenSource(file.slice(at));
  check(Object.keys(stockTheme).every(k => k in darkObj), `theme file ${label}: dark object misses stock darkTheme keys`);
  equalMaps({ ...base.light, ...lightObj }, theme.light, `theme file ${label} light`);
  equalMaps({ ...base.light, ...darkObj }, theme.dark, `theme file ${label} dark`);
  check(syntaxOk(path.join(dir, 'otherstates-theme.ts')), `theme file ${label}: does not parse`);
  check(sameRecipe(parseImport(file) ?? {}, expectedImport), `import ${label}: theme file`);

  // 3. CSS variables.
  for (const darkMode of ['attribute', 'class', 'media']) {
    for (const lightMode of ['owned', 'full']) {
      const css = cssVariables(theme, { dark: darkMode, light: lightMode });
      const { balanced, blocks } = readCss(css);
      check(balanced, `css ${label} ${darkMode}/${lightMode}: unbalanced braces`);
      const lightBlock = blocks.find(b => b.path === 'html:root');
      const darkPath = { attribute: 'html:root[data-theme="dark"]', class: 'html:root.dark', media: '@media (prefers-color-scheme: dark) > html:root' }[darkMode];
      const darkBlock = blocks.find(b => b.path === darkPath);
      const lightNames = lightBlock?.decls.map(([k]) => k) ?? [];
      const want = lightMode === 'owned' ? theme.owned : Object.keys(theme.light);
      check(lightNames.length === want.length && new Set(lightNames).size === want.length && want.every(n => lightNames.includes(n)), `css ${label} ${darkMode}/${lightMode}: light block is not one declaration per token`);
      check(lightBlock?.decls.every(([k, v]) => theme.light[k] === v), `css ${label}: light values differ`);
      equalMaps(Object.fromEntries(darkBlock?.decls ?? []), theme.dark, `css ${label} ${darkMode} dark block`);
      if (darkMode === 'attribute' && lightMode === 'owned') {
        fs.writeFileSync(path.join(dir, 'theme.css'), css);
        check(sameRecipe(parseImport(css) ?? {}, expectedImport), `import ${label}: css`);
      }
    }
  }

  // 4. Design tokens.
  for (const scheme of ['light', 'dark']) {
    const json = dtcgTokens(theme, scheme);
    fs.writeFileSync(path.join(dir, `otherstates.${scheme}.tokens.json`), json);
    const data = JSON.parse(json);
    const tokens = [];
    walk(data, [], tokens);
    check(tokens.length === 124, `dtcg ${label} ${scheme}: ${tokens.length} tokens, expected 124`);
    check(tokens.every(([, t]) => DTCG_TYPES.has(t.$type) && t.$value !== undefined && t.$value !== null), `dtcg ${label} ${scheme}: invalid $type or $value`);
    const vars = tokens.map(([, t]) => t.$extensions?.['dev.otherstates.ui']?.cssVar);
    check(new Set(vars).size === 124 && Object.keys(theme[scheme]).every(n => vars.includes(n)), `dtcg ${label} ${scheme}: cssVar coverage`);
    const badColor = tokens.filter(([, t]) => t.$type === 'color').find(([, t]) => {
      const c = parseColor(theme[scheme][t.$extensions['dev.otherstates.ui'].cssVar]);
      return !c || t.$value.hex !== rgbToHex(c.r, c.g, c.b) || Math.abs(t.$value.alpha - c.a) > 1e-4;
    });
    check(!badColor, `dtcg ${label} ${scheme}: color ${badColor?.[0]} differs`);
    check(sameRecipe(parseImport(json) ?? {}, expectedImport), `import ${label}: dtcg ${scheme}`);
    if (scheme === 'dark') { // a hand-edited token value is ignored: only the recipe is trusted
      const tampered = JSON.parse(json);
      tampered.color.accent.moderate.$value.hex = '#123456';
      check(sameRecipe(parseImport(JSON.stringify(tampered)) ?? {}, expectedImport), `import ${label}: tampered dtcg`);
    }
  }

  // 5. Recipe, link, code, header.
  const snippet = recipeSnippet(theme);
  fs.writeFileSync(path.join(dir, 'recipe.ts'), snippet);
  check(sameRecipe(parseImport(snippet) ?? {}, expectedImport), `import ${label}: recipe snippet`);
  check(sameRecipe(parseImport(recipeToJson(theme.recipe)) ?? {}, expectedImport), `import ${label}: recipe JSON`);
  check(sameRecipe(parseImport(headerLines(theme)[0]) ?? {}, expectedImport), `import ${label}: header line`);
  check(sameRecipe(parseImport(theme.code) ?? {}, expectedImport), `import ${label}: code`);
  const link = shareUrl(theme, 'http://127.0.0.1:5180/ui/#component/menu');
  const url = new URL(link);
  check(url.hash === '#component/menu' && (url.searchParams.get('theme') ?? '') === encodeRecipe(theme.recipe), `link ${label}: ${link}`);
  check(sameRecipe(parseImport(link) ?? {}, expectedImport), `import ${label}: link`);
}
check(new URL(shareUrl(deriveTheme(PRESETS.ledger.recipe), 'https://example.test/ui/')).hash === '#docs/customize', 'link: missing hash is not #docs/customize');
for (const junk of ['', 'hello', '{', '{"a":1}', 'v2.a-harbor', 'https://example.test/?theme=v2', '/* nothing */', '\u0000']) {
  let result;
  try { result = parseImport(junk); } catch { result = 'threw'; }
  check(result === null, `import: junk ${JSON.stringify(junk)} gave ${JSON.stringify(result)}`);
}

const ledger = summaries.find(s => s.startsWith(deriveTheme(PRESETS.ledger.recipe).code + ':'));
console.log(`Exports applied to copies of the token files in ${scratch}`);
console.log(`${recipes.length} recipes (5 presets + 50 random) × patch, theme file, 6 CSS variants, 2 DTCG files, recipe, link, code`);
console.log(`Ledger changes ${ledger?.split(': ')[1]} tokens; House: ${summaries[0]}`);
if (failures.length) {
  console.log(`Failures (first 25 of ${failures.length}):`);
  for (const f of failures.slice(0, 25)) console.log(`  ✗ ${f}`);
}
console.log(`verify-export: ${failures.length === 0 ? 'PASS' : 'FAIL'} · ${checks} checks · ${failures.length} failures`);
process.exitCode = failures.length ? 1 : 0;
