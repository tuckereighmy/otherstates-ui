// V1 · Core verifier for the theme builder. Run with plain node from the repo root:
//   node scripts/verify-theme.mjs
// Node strips the TypeScript types of the pure customize modules, so they are imported directly.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mod = p => import(new URL(`../src/ui/customize/${p}`, import.meta.url).href);
const { BASE, TOKEN_NAMES, baseFromSources, parseTokenSource } = await mod('base-values.ts');
const { PRESETS, ACCENT_PRESETS, CORNER_LADDERS, ALL_AVAILABLE, DEFAULT_RECIPE, normalizeRecipe, encodeRecipe, decodeRecipe, recipeToJson, sameRecipe, matchPreset } = await mod('recipe.ts');
const { deriveTheme, OWNED_TOKENS } = await mod('derive.ts');
const { checkCorners } = await mod('audit.ts');
const { deltaE, parseColor } = await mod('color.ts');

let checks = 0;
const failures = [];
function check(ok, message) {
  checks++;
  if (!ok) failures.push(message);
  return ok;
}
const sameColor = (a, b) => {
  const x = parseColor(a), y = parseColor(b);
  return !!x && !!y && ['r', 'g', 'b'].every(k => Math.round(x[k] * 255) === Math.round(y[k] * 255)) && x.a === y.a;
};
const copyBase = () => ({ light: { ...BASE.light }, dark: { ...BASE.dark } });
const C = n => `--os-color-${n}`;

// Identity -------------------------------------------------------------------------------------
const house = deriveTheme(PRESETS.house.recipe);
check(house.identity === true, 'identity: House is not flagged identity');
for (const scheme of ['light', 'dark']) {
  const keys = Object.keys(BASE[scheme]);
  check(JSON.stringify(Object.keys(house[scheme])) === JSON.stringify(keys), `identity: ${scheme} key order differs`);
  for (const k of keys) check(house[scheme][k] === BASE[scheme][k], `identity: ${scheme} ${k} ${house[scheme][k]} ≠ ${BASE[scheme][k]}`);
}
check(house.code === 'v1.r-round' && encodeRecipe(house.recipe) === '', `identity: House code is ${house.code}, not v1.r-round / empty`);

// Drift ----------------------------------------------------------------------------------------
const tokensSrc = fs.readFileSync(path.join(root, 'src/ui/tokens.stylex.ts'), 'utf8');
const themeSrc = fs.readFileSync(path.join(root, 'src/ui/theme.ts'), 'utf8');
const live = baseFromSources(tokensSrc, themeSrc);
for (const scheme of ['light', 'dark']) {
  check(JSON.stringify(live[scheme]) === JSON.stringify(BASE[scheme]), `drift: BASE.${scheme} differs from the token files`);
}
check(Object.keys(parseTokenSource(tokensSrc)).length === 124, 'drift: tokens.stylex.ts does not hold 124 tokens');

// Coverage -------------------------------------------------------------------------------------
check(TOKEN_NAMES.length === 124, `coverage: ${TOKEN_NAMES.length} contract tokens, expected 124`);
check(OWNED_TOKENS.length === 45, `coverage: ${OWNED_TOKENS.length} owned tokens, expected 45`);
check(OWNED_TOKENS.includes('--os-radius-control'), 'coverage: --os-radius-control is not owned');
check(OWNED_TOKENS.every(n => TOKEN_NAMES.includes(n)), 'coverage: an owned token is not in the contract');
check(Object.isFrozen(OWNED_TOKENS), 'coverage: OWNED_TOKENS is not frozen');
const order = TOKEN_NAMES.filter(n => OWNED_TOKENS.includes(n));
check(JSON.stringify(order) === JSON.stringify(OWNED_TOKENS), 'coverage: OWNED_TOKENS is not in contract order');

// Corners --------------------------------------------------------------------------------------
const nested = {
  'Popup and listbox item': ([, , , lg]) => lg - 6,
  'Tile on track': ([, , , lg]) => lg - 4,
  'ExpandingTabs tile': ([, , , , xl]) => xl - 5,
  'Select morph row': ([, , , , xl]) => xl - 6,
  'Tabs tab on its track': ([, sm, , lg]) => Math.max(sm, lg - 4),
  'Frame body': ([, , , lg]) => lg - 8,
  'Inline field button': ([, sm, md]) => Math.max(sm, md - 4),
  'Checkbox, Kbd': ([, sm]) => sm,
};
const table = { // Tight / Standard / Soft
  'Popup and listbox item': [6, 10, 14], 'Tile on track': [8, 12, 16], 'ExpandingTabs tile': [11, 15, 19], 'Select morph row': [10, 14, 18],
  'Tabs tab on its track': [8, 12, 16], 'Frame body': [4, 8, 12], 'Inline field button': [2, 6, 10], 'Checkbox, Kbd': [2, 6, 6],
};
const column = { round: 1, soft: 2, standard: 1, tight: 0 }; // Round keeps the Standard radii
check(JSON.stringify(Object.keys(CORNER_LADDERS)) === JSON.stringify(Object.keys(column)), `corners: ladder order is ${Object.keys(CORNER_LADDERS).join(', ')}`);
for (const [ladder, i] of Object.entries(column)) {
  const steps = CORNER_LADDERS[ladder];
  check(steps.length === 7, `corners: ${ladder} has ${steps.length} steps, expected 7`);
  check(checkCorners(steps).length === 0, `corners: ${ladder} breaks ${checkCorners(steps).join(' ')}`);
  for (const [shape, rule] of Object.entries(nested)) check(rule(steps) === table[shape][i], `corners: ${ladder} ${shape} = ${rule(steps)}, table says ${table[shape][i]}`);
  check(ladder === 'round' ? steps[6] >= 9999 : steps[6] === steps[2], `corners: ${ladder} control = ${steps[6]}`);
  const map = deriveTheme(normalizeRecipe({ ...DEFAULT_RECIPE, corners: ladder }, ALL_AVAILABLE)).light;
  check(['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'control'].every((s, k) => map[`--os-radius-${s}`] === `${steps[k]}px`), `corners: ${ladder} derives other radii`);
}
check(JSON.stringify(CORNER_LADDERS.round.slice(0, 6)) === JSON.stringify(CORNER_LADDERS.standard.slice(0, 6)), 'corners: Round does not keep the Standard radii');
check(DEFAULT_RECIPE.corners === 'round' && PRESETS.house.recipe.corners === 'round', 'corners: House is not Round');
check(['ledger', 'graphite', 'tidepool', 'atelier'].map(id => PRESETS[id].recipe.corners).join() === 'tight,tight,standard,soft', 'corners: a preset changed ladder');
const broken = [[4, 6, 10, 16, 21, 24, 10], [3, 6, 10, 16, 20, 24, 10], [4, 6, 10, 16, 20, 24, 12], [4, 6, 10, 16, 20, 24, 500], [4, 6, 10, 16, 20, 24]];
check(broken.every(l => checkCorners(l).length > 0), 'corners: a broken ladder passes');

// Reference values (prototype results) --------------------------------------------
// tolerance 1 per channel only where the prototype carried float-noise hue on an achromatic token (More, dark
// Paper grays: #b4b4b4 has no hue, so it stays a pure gray here; the prototype drifted one step).
const near = (a, b, tol) => { const x = parseColor(a), y = parseColor(b); return !!x && !!y && ['r', 'g', 'b'].every(k => Math.abs(Math.round(x[k] * 255) - Math.round(y[k] * 255)) <= tol); };
const expect = (label, theme, scheme, values, tol = 0) => {
  for (const [name, hex] of Object.entries(values)) {
    const got = name === 'gradient-progress' ? theme[scheme]['--os-gradient-progress'] : theme[scheme][C(name)];
    check(name === 'gradient-progress' ? got === hex : tol ? near(got, hex, tol) : sameColor(got, hex), `reference: ${label} ${scheme} ${name} = ${got}, plan says ${hex}`);
  }
};
const r = fields => normalizeRecipe({ ...DEFAULT_RECIPE, ...fields }, ALL_AVAILABLE);
const slate = deriveTheme(r({ neutrals: 'slate' }));
expect('Slate', slate, 'light', { 'fg-base': '#16181b', 'fg-muted': '#565c62', 'fg-subtle': '#696e75', 'bg-subtle': '#f6f7f9', 'bg-muted': '#eff1f4', 'border-subtle': '#e5e8ed', 'border-control': '#8c9399',
  'accent-moderate': '#16181b', 'accent-bold': '#0e0f11', 'accent-strong': '#000000', 'accent-intense': '#000000', 'accent-subtle': '#edeff2', 'accent-muted': '#dee3e8', 'accent-dim': '#d0d7de' });
expect('Slate', slate, 'dark', { 'bg-canvas': '#090a0c', 'bg-surface': '#0e0f11', 'bg-subtle': '#181a1d', 'bg-elevated': '#1a1c1f', 'bg-muted': '#1e2023', 'bg-raised': '#272b2e', 'border-subtle': '#35383d', 'fg-muted': '#aeb5bb' });
expect('Pure', deriveTheme(r({ neutrals: 'pure' })), 'light', { 'fg-base': '#181818', 'fg-muted': '#5b5b5b', 'fg-subtle': '#6e6e6e' });
const ramps = {
  harbor: [['#2a6ada', '#1d5dcc', '#0f51bf', '#0044b0'], ['#6fa4ff', '#84b2ff', '#99bfff', '#aeccff']],
  lagoon: [['#0a7893', '#006c85', '#005f76', '#005368'], ['#58b2cf', '#65bfdc', '#72cce9', '#7fd9f7']],
  plum: [['#7b4fd6', '#7042c8', '#6534bb', '#5a26ad'], ['#ae93ff', '#b9a4ff', '#c4b4ff', '#d0c4ff']],
  orchid: [['#a447b8', '#973aab', '#8b2d9e', '#7e1e91'], ['#df7ff3', '#eb8eff', '#efa5ff', '#f3bbff']],
};
const stepNames = ['accent-moderate', 'accent-bold', 'accent-strong', 'accent-intense'];
for (const [accent, [lightRamp, darkRamp]] of Object.entries(ramps)) {
  const theme = deriveTheme(r({ accent }));
  expect(accent, theme, 'light', Object.fromEntries(stepNames.map((n, i) => [n, lightRamp[i]])));
  expect(accent, theme, 'dark', Object.fromEntries(stepNames.map((n, i) => [n, darkRamp[i]])));
  check(!theme.adjustments.some(a => a.scheme === 'light' && a.visible), `presets: ${accent} reports a visible light adjustment`);
}
expect('Harbor', deriveTheme(r({ accent: 'harbor' })), 'light', { 'gradient-progress': 'linear-gradient(90deg,#007ca5,#2a6ada 50%,#7555d2)' });
const yellow = deriveTheme(r({ accent: '#f2c230' }));
expect('#f2c230', yellow, 'light', { 'accent-moderate': '#896b00' });
expect('#f2c230', yellow, 'dark', { 'accent-moderate': '#f2c230' });
check(yellow.adjustments.some(a => a.scheme === 'light' && a.visible && a.reason === 'text-on-accent'), 'reference: #f2c230 does not report its light adjustment');
expect('Ledger', deriveTheme(PRESETS.ledger.recipe), 'dark', { 'accent-moderate': '#70a4ff', 'accent-on-accent': '#16181b' });
const more = deriveTheme(r({ contrast: 'more' }));
expect('More', more, 'light', { 'fg-muted': '#52514d', 'fg-subtle': '#62615b', 'border-subtle': '#d3d3d1', 'border-muted': '#b8b7b5', 'border-control': '#777772' });
expect('More', more, 'dark', { 'fg-muted': '#c1c0c0', 'fg-subtle': '#aaaaa9', 'border-subtle': '#464645', 'border-muted': '#595858', 'border-control': '#848383' }, 1);
const moreDark = ['fg-muted', 'fg-subtle', 'border-subtle', 'border-muted', 'border-control'].map(n => more.dark[C(n)]);
check(moreDark.every(v => { const x = parseColor(v); return x.r === x.g && x.g === x.b; }), `reference: More dark grays gained a hue: ${moreDark.join(' ')}`);
const swatches = { house: ['#17181a', '#f7f7f6', '#5c5b56'], ledger: ['#2a6ada', '#f6f7f9', '#565c62'], graphite: ['#181818', '#f7f7f7', '#5b5b5b'], tidepool: ['#0a7893', '#f6f7f6', '#575c58'], atelier: ['#7b4fd6', '#f7f7f8', '#5c5a61'] };
for (const [id, [accent, subtle, muted]] of Object.entries(swatches)) {
  const theme = deriveTheme(PRESETS[id].recipe);
  expect(`preset ${id}`, theme, 'light', { 'accent-moderate': accent, 'bg-subtle': subtle, 'fg-muted': muted });
  check(matchPreset(PRESETS[id].recipe) === id, `presets: matchPreset(${id}) fails`);
  check(theme.audit.light.ok && theme.audit.dark.ok, `presets: ${id} fails its audit`);
}

// Combinatorial audit --------------------------------------------------------------------------
let seed = 0x5eed1234;
const rand = () => { seed = (seed + 0x6d2b79f5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
const randomHex = () => '#' + Array.from({ length: 3 }, () => Math.floor(rand() * 256).toString(16).padStart(2, '0')).join('');
const pick = list => list[Math.floor(rand() * list.length)];
const extremes = ['#ffff00', '#00ff00', '#ff0000', '#0000ff', '#00ffff', '#ff00ff', '#f2c230', '#0b1a3a', '#777777', '#ffffff', '#000000', '#e8590c', '#2b8a3e', '#c2352c', '#101010', '#fefefe'];
const accents = ['ink', ...Object.keys(ACCENT_PRESETS), ...Array.from({ length: 600 }, randomHex), ...extremes];
const ladders = Object.keys(CORNER_LADDERS), faces = ['inter', 'platform'];
let themes = 0, rows = 0, rounding = 0, visibleAdjustments = 0, warnings = 0, statusNotes = 0, time = 0, n = 0;
for (const accent of accents) {
  for (const neutrals of ['paper', 'pure', 'slate', 'sage', 'tinted']) {
    for (const contrast of ['standard', 'more']) {
      for (const follow of [true, false]) {
        const recipe = r({ accent, neutrals, contrast, focusFollowsAccent: follow, linksFollowAccent: follow, corners: ladders[n % ladders.length], typeface: faces[n % 2] });
        n++;
        const start = performance.now();
        const theme = deriveTheme(recipe, copyBase());
        time += performance.now() - start;
        themes++;
        for (const scheme of ['light', 'dark']) {
          for (const row of theme.audit[scheme].rows) {
            if (!row.gating) continue;
            rows++;
            check(row.ok, `audit: ${theme.code} ${scheme} ${row.label} = ${row.value.toFixed(3)} < ${row.min}`);
          }
          const keys = Object.keys(theme[scheme]);
          check(keys.length === 124, `audit: ${theme.code} ${scheme} map has ${keys.length} tokens`);
        }
        for (const a of theme.adjustments) {
          if (a.reason === 'rounding') { rounding++; check(!a.visible, `adjustments: rounding move shown for ${theme.code}`); continue; }
          if (a.visible) visibleAdjustments++;
          check(a.visible === deltaE(a.from, a.to) >= 0.01, `adjustments: ${theme.code} ${a.scheme} visible=${a.visible} at ΔE ${deltaE(a.from, a.to).toFixed(4)}`);
        }
        warnings += theme.notes.filter(x => x.severity === 'warning').length;
        statusNotes += theme.notes.filter(x => x.severity === 'note').length;
      }
    }
  }
}
const meanMs = time / themes;
check(meanMs < 5, `timing: mean derive ${meanMs.toFixed(2)} ms ≥ 5 ms`);

// Share codes and recipe JSON ------------------------------------------------------------------
for (let i = 0; i < 1000; i++) {
  const recipe = normalizeRecipe({
    accent: rand() < 0.4 ? pick(['ink', 'harbor', 'lagoon', 'plum', 'orchid']) : randomHex(),
    accentDark: rand() < 0.25 ? randomHex() : null,
    neutrals: pick(['paper', 'pure', 'slate', 'sage', 'tinted']), corners: pick(ladders), typeface: pick(faces),
    contrast: pick(['standard', 'more']), focusFollowsAccent: rand() < 0.5, linksFollowAccent: rand() < 0.5,
  }, ALL_AVAILABLE);
  const decoded = decodeRecipe(encodeRecipe(recipe), ALL_AVAILABLE);
  check(decoded !== null && !decoded.partial && sameRecipe(decoded.recipe, recipe), `codes: round trip fails for ${encodeRecipe(recipe)}`);
  check(sameRecipe(normalizeRecipe(recipeToJson(recipe), ALL_AVAILABLE), recipe), `codes: JSON round trip fails for ${recipeToJson(recipe)}`);
}
const garbage = [undefined, null, 42, NaN, '', ' ', 'v2', 'v1.', 'v1..', 'v1.a-', 'v1.a-zzzzzz.n-blue.r-', '{', '{"accent":5}', '[]', {}, [], { accent: {} }, { neutrals: 'tinted' },
  'ledger', 'LEDGER', '#ggg', 'v1.a-harbor.r-soft.c-more', '?theme=v1', '\u0000', 'v1.' + 'x-'.repeat(5000), { toString() { throw new Error('x'); } }];
for (const g of garbage) {
  let ok = true;
  try { decodeRecipe(g); normalizeRecipe(g); deriveTheme(normalizeRecipe(g)); } catch (error) { ok = false; }
  check(ok, `codes: garbage input throws: ${String(typeof g === 'object' ? JSON.stringify(g) : g).slice(0, 40)}`);
}
check(decodeRecipe('v1.a-harbor.c-more')?.partial === true, 'codes: an unavailable option (contrast More) does not set partial');
check(decodeRecipe('v2.a-harbor') === null, 'codes: a foreign version decodes');
// Codes issued before Round keep their meaning: a v1 code without an r- pair has Standard corners.
check(decodeRecipe('')?.recipe.corners === 'round' && decodeRecipe('house')?.recipe.corners === 'round', 'codes: an empty code or "house" is not Round');
check(decodeRecipe('v1')?.recipe.corners === 'standard' && !decodeRecipe('v1').partial, 'codes: a bare v1 code no longer opens Standard');
check(matchPreset(decodeRecipe('v1.a-lagoon.n-sage').recipe) === 'tidepool', 'codes: an old Tidepool code does not open Tidepool');
check(matchPreset(decodeRecipe('v1.a-harbor.n-slate.r-tight').recipe) === 'ledger', 'codes: an old Ledger code does not open Ledger');
check(decodeRecipe('v1.r-soft')?.recipe.corners === 'soft' && decodeRecipe('v1.r-round')?.recipe.corners === 'round', 'codes: an r- value is misread');
check(decodeRecipe('v1.r-blob')?.recipe.corners === 'standard', 'codes: an invalid r- value does not fall back to Standard');
check(encodeRecipe(r({ corners: 'standard' })) === 'v1', 'codes: House with Standard corners does not encode as v1');
check(normalizeRecipe('{"otherstates":1,"accent":"ink","neutrals":"paper","corners":"standard","typeface":"inter"}').corners === 'standard', 'codes: saved Standard JSON is misread');

// Determinism ----------------------------------------------------------------------------------
const snapshot = () => JSON.stringify(Object.values(PRESETS).map(p => deriveTheme(p.recipe, copyBase())).concat(deriveTheme(r({ accent: '#f2c230', neutrals: 'tinted', contrast: 'more' }), copyBase())));
check(snapshot() === snapshot(), 'determinism: two runs differ');

// Shipped findings (never gating) --------------------------------------------------------------
const findings = ['light', 'dark'].flatMap(s => house.audit[s].rows.filter(row => !row.gating && !row.ok).map(row => `${s} ${row.label} ${row.value.toFixed(2)}:1 (min ${row.min})`));
const thin = ['light', 'dark'].flatMap(s => house.audit[s].rows.filter(row => row.gating && row.ok && row.min >= 3 && row.value < row.min + 0.05).map(row => `${s} ${row.label} ${row.value.toFixed(2)}:1`));

console.log(`Shipped findings in House (listed, not gating): ${findings.length}`);
for (const f of findings) console.log(`  - ${f}`);
if (thin.length) console.log(`Thin margins in House: ${thin.join('; ')}`);
console.log(`Combinatorial: ${themes} themes (${accents.length} accents × 5 neutrals × 2 contrast × 2 switch states; ladders and typefaces cycled), ${rows} gating audit rows, ${rounding} rounding repairs, ${visibleAdjustments} visible accent adjustments, ${warnings} red warnings, ${statusNotes} status notes, mean derive ${meanMs.toFixed(2)} ms`);
if (failures.length) {
  console.log(`Failures (first 25 of ${failures.length}):`);
  for (const f of failures.slice(0, 25)) console.log(`  ✗ ${f}`);
}
console.log(`verify-theme: ${failures.length === 0 ? 'PASS' : 'FAIL'} · ${checks} checks · ${failures.length} failures`);
process.exitCode = failures.length ? 1 : 0;
