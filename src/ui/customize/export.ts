// Export generators. Pure: no DOM, no React, no StyleX. Every output is static literals, as StyleX
// requires, and starts with a header line that `parseImport` reads back.
import { BASE, DARK_OVERRIDE_NAMES, TOKEN_NAMES, parseTokenSource } from './base-values.ts';
import { parseColor, rgbToHex } from './color.ts';
import { DEFAULT_RECIPE, PRESETS, decodeRecipe, encodeRecipe, matchPreset, normalizeRecipe, recipeToJson } from './recipe.ts';
import type { BaseValues, DerivedTheme, Recipe, Scheme, TokenMap, TokenName } from './types.ts';

export type Change = { readonly token: TokenName; readonly from: string | undefined; readonly to: string };
export type PatchResult = { readonly tokens: string; readonly theme: string; readonly changed: { readonly light: Change[]; readonly dark: Change[] } };
export type CssOptions = { readonly dark?: 'attribute' | 'class' | 'media'; readonly light?: 'owned' | 'full' };

const EXT = 'dev.otherstates.ui';

// ---------------------------------------------------------------------------------------------
// Header

function presetLabel(theme: DerivedTheme): string {
  const id = matchPreset(theme.recipe);
  return id ? PRESETS[id].label : 'Custom mix';
}

/** The header lines every export starts with: the share code, then each visible adjustment and note. */
export function headerLines(theme: DerivedTheme): string[] {
  const lines = [`Otherstates UI theme ${theme.code} (${presetLabel(theme)})`];
  for (const a of theme.adjustments) if (a.visible) lines.push(`Accent adjusted in ${a.scheme}: ${a.from} → ${a.to}. ${a.message}`);
  for (const n of theme.notes) lines.push(`${n.severity === 'warning' ? 'Warning' : 'Note'} (${n.scheme}): ${n.message}`);
  return lines.map(line => line.replace(/\*\//g, '* /'));
}

// ---------------------------------------------------------------------------------------------
// 7.1 Edit your files: patch the literals of tokens.stylex.ts and theme.ts in place

const ENTRY = /"(--os-[a-z0-9-]+)":\s*"((?:[^"\\]|\\.)*)"/;
const quote = (value: string) => JSON.stringify(value);

function isComment(line: string): boolean {
  const s = line.trimStart();
  return s.startsWith('//') || s.startsWith('/*') || s.startsWith('*');
}

/**
 * Replaces the literal of every `wanted` entry whose value differs, keeping every other byte; inserts the
 * `insert` names that are missing before the closing `});`, matching the file's trailing-comma style.
 */
function patchSource(src: string, wanted: ReadonlyMap<TokenName, string>, insert: readonly TokenName[]): string {
  const lines = src.split('\n');
  const found = new Set<TokenName>();
  let last = -1;
  for (let i = 0; i < lines.length; i++) {
    if (isComment(lines[i])) continue;
    const m = ENTRY.exec(lines[i]);
    if (!m) continue;
    const name = m[1] as TokenName;
    found.add(name);
    last = i;
    const next = wanted.get(name);
    if (next === undefined) continue;
    const current = parseTokenSource(m[0])[name];
    if (current === next) continue;
    const prefix = m[0].slice(0, m[0].length - m[2].length - 2);
    lines[i] = lines[i].slice(0, m.index) + prefix + quote(next) + lines[i].slice(m.index + m[0].length);
  }
  const missing = insert.filter(name => !found.has(name) && wanted.has(name));
  if (missing.length === 0 || last === -1) return lines.join('\n');
  let close = -1;
  for (let i = lines.length - 1; i > last; i--) if (lines[i].trimStart().startsWith('}')) { close = i; break; }
  if (close === -1) return lines.join('\n');
  const m = ENTRY.exec(lines[last]) as RegExpExecArray;
  const end = m.index + m[0].length;
  const trailing = lines[last].slice(end).trimStart().startsWith(',');
  if (!trailing) lines[last] = lines[last].slice(0, end) + ',' + lines[last].slice(end);
  const indent = /^\s*/.exec(lines[last])?.[0] ?? '  ';
  const added = missing.map((name, i) => `${indent}"${name}": ${quote(wanted.get(name) as string)}${i < missing.length - 1 || trailing ? ',' : ''}`);
  lines.splice(close, 0, ...added);
  return lines.join('\n');
}

const INHERITED_ONLY = (name: TokenName) => name.startsWith('--os-radius-') || name === '--os-font-family';

/**
 * Full patched text of the reader's `tokens.stylex.ts` (light values, corners, typeface) and `theme.ts`
 * (dark values). Only literals change; comments and order are kept. Owned tokens missing from `theme.ts`
 * are inserted only when their dark value differs from the new light value; radius and font never go into
 * `theme.ts` (dark inherits them). House returns both files byte for byte.
 */
export function patchTokenSources(theme: DerivedTheme, sources: { tokensSrc: string; themeSrc: string }): PatchResult {
  const oldLight = parseTokenSource(sources.tokensSrc);
  const oldTheme = parseTokenSource(sources.themeSrc);
  const lightWanted = new Map<TokenName, string>(theme.owned.map(name => [name, theme.light[name]]));
  const tokens = patchSource(sources.tokensSrc, lightWanted, theme.owned);
  const newLight = { ...oldLight };
  for (const name of theme.owned) newLight[name] = theme.light[name];
  const darkWanted = new Map<TokenName, string>();
  const insert: TokenName[] = [];
  for (const name of theme.owned) {
    if (name in oldTheme) darkWanted.set(name, theme.dark[name]);
    else if (!INHERITED_ONLY(name) && theme.dark[name] !== newLight[name]) { darkWanted.set(name, theme.dark[name]); insert.push(name); }
  }
  const patchedTheme = patchSource(sources.themeSrc, darkWanted, insert);
  const oldDark = { ...oldLight, ...oldTheme };
  const light: Change[] = [], dark: Change[] = [];
  for (const name of theme.owned) {
    if (oldLight[name] !== theme.light[name]) light.push({ token: name, from: oldLight[name], to: theme.light[name] });
    if (oldDark[name] !== theme.dark[name]) dark.push({ token: name, from: oldDark[name], to: theme.dark[name] });
  }
  return { tokens, theme: patchedTheme, changed: { light, dark } };
}

// ---------------------------------------------------------------------------------------------
// 7.2 Theme file

function identifier(name: string): string {
  const words = name.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  const id = words.map((w, i) => (i === 0 ? w[0].toLowerCase() : w[0].toUpperCase()) + w.slice(1)).join('');
  return /^[A-Za-z_]/.test(id) ? id : `theme${id}`;
}

function objectLiteral(entries: readonly [TokenName, string][]): string {
  if (entries.length === 0) return '{}';
  return `{\n${entries.map(([k, v]) => `  ${quote(k)}: ${quote(v)},`).join('\n')}\n}`;
}

/**
 * `otherstates-theme.ts`: `<name>Light` holds every token whose light value differs from the stock default;
 * `<name>Dark` holds every stock `darkTheme` value merged with the derived dark values (written out in full,
 * because a theme resets every token it leaves out). Name: the preset id, else "custom". Pass the reader's
 * `theme.ts` text as `themeSrc` (and the matching `base`) to keep every key it lists; default: the snapshot.
 */
export function themeFile(theme: DerivedTheme, options: { name?: string; base?: BaseValues; themeSrc?: string } = {}): string {
  const base = options.base ?? BASE;
  const stock = new Set<string>(options.themeSrc !== undefined ? Object.keys(parseTokenSource(options.themeSrc)) : DARK_OVERRIDE_NAMES);
  const name = identifier(options.name ?? matchPreset(theme.recipe) ?? 'custom');
  const names = TOKEN_NAMES.filter(n => n in theme.light);
  const light = names.filter(n => theme.light[n] !== base.light[n]).map(n => [n, theme.light[n]] as [TokenName, string]);
  const dark = names.filter(n => stock.has(n) || base.dark[n] !== base.light[n] || theme.dark[n] !== base.light[n]).map(n => [n, theme.dark[n]] as [TokenName, string]);
  return [
    `import * as stylex from '@stylexjs/stylex';`,
    `import { tokens } from './tokens.stylex';`,
    '',
    ...headerLines(theme).map(line => `// ${line}`),
    `// Put ${name}Light or ${name}Dark on <html> instead of darkTheme, never together with it:`,
    `// a theme resets every token it leaves out to the light defaults, and themes do not stack.`,
    `// That is why the dark theme lists every dark value, not only the changed ones.`,
    `export const ${name}Light = stylex.createTheme(tokens, ${objectLiteral(light)});`,
    `export const ${name}Dark = stylex.createTheme(tokens, ${objectLiteral(dark)});`,
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------------------------
// 7.3 CSS variables

function declarations(map: TokenMap, names: readonly TokenName[], indent: string): string {
  return names.map(name => `${indent}${name}: ${map[name]};`).join('\n');
}

/**
 * Plain CSS custom properties. The light block holds the owned tokens (default) or the full contract; the
 * dark block is always complete. `html:root` (0,1,1) outranks the token defaults (:root, 0,1,0).
 */
export function cssVariables(theme: DerivedTheme, options: CssOptions = {}): string {
  const dark = options.dark ?? 'attribute';
  const lightNames = options.light === 'full' ? (Object.keys(theme.light) as TokenName[]) : theme.owned;
  const darkNames = Object.keys(theme.dark) as TokenName[];
  const head = headerLines(theme);
  const comment = [
    `/* ${head[0]}`,
    ...head.slice(1).map(line => `   ${line}`),
    '   Paste after base.css and use instead of the darkTheme class: these rules outrank the token defaults',
    '   (:root, 0,1,0) but not darkTheme (0,3,0). */',
  ].join('\n');
  const lightBlock = `html:root {\n${declarations(theme.light, lightNames, '  ')}\n}`;
  const darkBlock = dark === 'media'
    ? `@media (prefers-color-scheme: dark) {\n  html:root {\n${declarations(theme.dark, darkNames, '    ')}\n  }\n}`
    : `${dark === 'class' ? 'html:root.dark' : 'html:root[data-theme="dark"]'} {\n${declarations(theme.dark, darkNames, '  ')}\n}`;
  return `${comment}\n${lightBlock}\n${darkBlock}\n`;
}

// ---------------------------------------------------------------------------------------------
// 7.4 Design tokens (DTCG), recipe snippet, share link, import

const round = (x: number) => Math.round(x * 10000) / 10000;

function colorValue(value: string) {
  const c = parseColor(value);
  if (!c) return null;
  return { colorSpace: 'srgb', components: [round(c.r), round(c.g), round(c.b)], alpha: round(c.a), hex: rgbToHex(c.r, c.g, c.b) };
}

/** Splits on commas outside parentheses. */
function splitTop(text: string): string[] {
  const out: string[] = [];
  let depth = 0, start = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '(') depth++;
    else if (text[i] === ')') depth--;
    else if (text[i] === ',' && depth === 0) { out.push(text.slice(start, i).trim()); start = i + 1; }
  }
  out.push(text.slice(start).trim());
  return out.filter(Boolean);
}

const dim = (n: number) => ({ value: round(n), unit: 'px' });

function shadowValue(value: string) {
  return splitTop(value).map(layer => {
    const color = /rgba?\([^)]*\)|#[0-9a-f]{3,8}\b/i.exec(layer)?.[0] ?? 'transparent';
    const lengths = layer.replace(color, ' ').trim().split(/\s+/).filter(Boolean).map(parseFloat);
    const [x = 0, y = 0, blur = 0, spread = 0] = lengths;
    return { color: colorValue(color), offsetX: dim(x), offsetY: dim(y), blur: dim(blur), spread: dim(spread) };
  });
}

function gradientValue(value: string) {
  const inner = value.slice(value.indexOf('(') + 1, value.lastIndexOf(')'));
  const parts = splitTop(inner);
  const angle = parts[0] && /deg$/.test(parts[0]) ? parts.shift() as string : null;
  const stops = parts.map(part => {
    const color = /rgba?\([^)]*\)|#[0-9a-f]{3,8}\b/i.exec(part)?.[0] ?? 'transparent';
    const pos = /(-?[\d.]+)%/.exec(part.replace(color, ''));
    return { color, position: pos ? parseFloat(pos[1]) / 100 : null as number | null };
  });
  if (stops.length) {
    stops[0].position ??= 0;
    stops[stops.length - 1].position ??= 1;
    for (let i = 1; i < stops.length - 1; i++) {
      if (stops[i].position !== null) continue;
      let j = i; while (stops[j].position === null) j++;
      const a = stops[i - 1].position as number, b = stops[j].position as number;
      for (let k = i; k < j; k++) stops[k].position = round(a + ((b - a) * (k - i + 1)) / (j - i + 1));
    }
  }
  return { stops: stops.map(s => ({ color: colorValue(s.color), position: s.position })), angle };
}

/** DTCG path for a token: `--os-color-bg-interactive-primary` → color.bg.interactive-primary. */
export function tokenPath(name: TokenName): string[] {
  const rest = name.slice(5);
  if (rest === 'button-active-text') return ['color', 'button', 'active-text'];
  if (rest === 'focus-shadow') return ['shadow', 'focus'];
  if (rest === 'stroke') return ['stroke', 'default'];
  if (rest === 'font-family') return ['font', 'family'];
  let m = /^color-(fg|bg|border|accent)-(.+)$/.exec(rest);
  if (m) return ['color', m[1], m[2]];
  m = /^font-(size|weight)-(.+)$/.exec(rest);
  if (m) return ['font', m[1], m[2]];
  m = /^(line-height)-(.+)$/.exec(rest);
  if (m) return [m[1], m[2]];
  const dash = rest.indexOf('-');
  return dash === -1 ? [rest] : [rest.slice(0, dash), rest.slice(dash + 1)];
}

function dtcgToken(name: TokenName, value: string): Record<string, unknown> {
  const rest = name.slice(5);
  const ext: Record<string, unknown> = { cssVar: name };
  let type: string, out: unknown;
  if (rest.startsWith('color-') || rest === 'button-active-text') { type = 'color'; out = colorValue(value); }
  else if (rest.startsWith('shadow-') || rest === 'focus-shadow') { type = 'shadow'; out = shadowValue(value); }
  else if (rest.startsWith('gradient-')) { const g = gradientValue(value); type = 'gradient'; out = g.stops; ext.angle = g.angle; }
  else if (rest === 'font-family') { type = 'fontFamily'; out = splitTop(value).map(f => f.replace(/^["']|["']$/g, '')); }
  else if (rest.startsWith('font-weight-')) { type = 'fontWeight'; out = Number(value); }
  else if (rest.startsWith('motion-')) { type = 'duration'; out = { value: parseFloat(value), unit: 'ms' }; }
  else if (rest.startsWith('ease-')) { type = 'cubicBezier'; out = (/\(([^)]*)\)/.exec(value)?.[1] ?? '').split(',').map(Number); }
  else if (rest.startsWith('z-')) { type = 'number'; out = Number(value); }
  else if (rest.startsWith('tracking-')) { type = 'number'; out = parseFloat(value); ext.unit = 'em'; ext.css = value; }
  else if (/px$/.test(value)) { type = 'dimension'; out = { value: parseFloat(value), unit: 'px' }; }
  else { type = 'number'; out = parseFloat(value); ext.css = value; }
  const token: Record<string, unknown> = { $type: type, $value: out, $extensions: { [EXT]: ext } };
  if (rest === 'focus-shadow') token.$deprecated = 'No component should use the 3px halo. Use the focus ring as an outline.';
  return token;
}

/**
 * Design tokens in the DTCG format (module 2025.10) for one scheme: every token, `$extensions["dev.otherstates.ui"].cssVar`
 * on each, and the recipe, code and scheme in the root `$extensions`. Save as `otherstates.<scheme>.tokens.json`.
 */
export function dtcgTokens(theme: DerivedTheme, scheme: Scheme): string {
  const root: Record<string, unknown> = {
    $description: headerLines(theme).join(' '),
    $extensions: { [EXT]: { recipe: JSON.parse(recipeToJson(theme.recipe)), code: theme.code, scheme } },
  };
  const map = theme[scheme];
  for (const name of Object.keys(map) as TokenName[]) {
    let path = tokenPath(name);
    let node = root;
    const fits = path.slice(0, -1).every((_key, i) => {
      const at = path.slice(0, i + 1).reduce<Record<string, unknown> | undefined>((n, k) => n?.[k] as Record<string, unknown> | undefined, root);
      return at === undefined || !('$value' in at);
    }) && path.reduce<Record<string, unknown> | undefined>((n, k) => n?.[k] as Record<string, unknown> | undefined, root) === undefined;
    if (!fits) path = [name.slice(5)];
    for (const key of path.slice(0, -1)) node = (node[key] ??= {}) as Record<string, unknown>;
    node[path[path.length - 1]] = dtcgToken(name, map[name]);
  }
  return JSON.stringify(root, null, 2);
}

/** The Recipe export: the header, the recipe JSON and the runtime snippet. */
export function recipeSnippet(theme: DerivedTheme): string {
  return [
    ...headerLines(theme).map(line => `// ${line}`),
    `import { useLayoutEffect } from 'react';`,
    `import { applyTheme, deriveTheme, normalizeRecipe } from '@/ui/customize';`,
    '',
    `const recipe = ${recipeToJson(theme.recipe)};`,
    'const theme = deriveTheme(normalizeRecipe(recipe));',
    '',
    '// Next to the code that applies darkTheme:',
    'useLayoutEffect(() => applyTheme(theme, { scheme }), [theme, scheme]);',
    '',
  ].join('\n');
}

/** The share link: `?theme=<code>` before the hash (House has no parameter); `#docs/customize` when there is no hash. */
export function shareUrl(theme: DerivedTheme, pageUrl: string): string {
  try {
    const url = new URL(pageUrl);
    const code = encodeRecipe(theme.recipe);
    if (code) url.searchParams.set('theme', code);
    else url.searchParams.delete('theme');
    if (!url.hash) url.hash = '#docs/customize';
    return url.toString();
  } catch {
    return '';
  }
}

const HEADER = /Otherstates UI theme (v1(?:\.[a-z0-9-]+)*)/i;

/**
 * Re-opens a theme from anything the page exports: a share link, a share code or preset name, recipe JSON,
 * a DTCG file, or any file that carries the header line. Returns the recipe only: token values in the text
 * are ignored and re-derived, so a hand-edited export can never bring in incoherent values. Null when
 * nothing readable is found. Never throws.
 */
export function parseImport(text: string): Recipe | null {
  if (typeof text !== 'string') return null;
  const s = text.trim();
  if (s === '') return null;
  if (s.startsWith('{')) {
    try {
      const data: unknown = JSON.parse(s);
      if (data && typeof data === 'object') {
        const embedded = (data as { $extensions?: Record<string, { recipe?: unknown }> }).$extensions?.[EXT]?.recipe;
        if (embedded && typeof embedded === 'object') return normalizeRecipe(embedded);
        if ('otherstates' in data) return normalizeRecipe(data);
      }
    } catch {
      // not JSON: try the other formats
    }
  }
  const header = HEADER.exec(s);
  if (header) return decodeRecipe(header[1])?.recipe ?? null;
  if (/^https?:\/\//i.test(s) || /[?&]theme=/.test(s)) {
    try {
      const url = new URL(s, 'https://otherstates.invalid/');
      const code = url.searchParams.get('theme');
      if (code !== null) return decodeRecipe(code)?.recipe ?? null;
      if (/^https?:\/\//i.test(s)) return DEFAULT_RECIPE; // a link without a theme is House
    } catch {
      return null;
    }
  }
  return decodeRecipe(s)?.recipe ?? null;
}
