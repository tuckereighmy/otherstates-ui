// Litmus: a stress theme and a DOM sweep that prove every component reads its tokens.
//
// Every color token gets its own saturated hue (light) and the opposite hue (dark), so any gray, black
// or white pixel is a hard-coded value and any color from the other scheme's table is a mode leak.
// Radii move to ladders where no value equals a shipped one, the typeface becomes a sentinel and every
// duration an odd number of milliseconds. `sweep` then classifies computed styles.
//
// Dev-only: imported by catalog/pages/token-audit.tsx, never by components/ or by customize/index.ts.
import { BASE, TOKEN_NAMES } from './base-values.ts';
import { deltaE, gamut, parseColor, toOklab, toOklch } from './color.ts';
import type { BaseValues, Scheme, TokenMap, TokenName } from './types.ts';

export type LitmusPass = 'high' | 'low';
export type Severity = 'error' | 'warning' | 'info';
export type FindingKind = 'color' | 'mode-leak' | 'mix' | 'role' | 'radius' | 'font' | 'motion' | 'focus';

/**
 * Diagnostic ladders (xs, sm, md, lg, xl, 2xl, control): High puts no value on a shipped radius, Low makes
 * floors bind. Control equals md, as in the rect ladders, so controls are measured instead of being pills.
 */
export const LITMUS_LADDERS: Readonly<Record<LitmusPass, readonly number[]>> = Object.freeze({
  high: [5, 7, 11, 25, 29, 34, 11],
  low: [1, 2, 3, 5, 7, 13, 3],
});
export const LITMUS_FONT = '"Litmus Sentinel", ui-monospace, monospace';
const MOTION: Readonly<Record<string, number>> = { press: 113, hover: 167, popup: 229, modal: 283, sheet: 367, layout: 431, slow: 613, spin: 821 };
/** Spec-named duration exceptions (ms): skeleton loop, sheet exit, tooltip out; and the indeterminate Progress sweep, 2 × spin. */
const DURATION_EXCEPTIONS = [1400, 240, 100, 2 * 821];
const STEPS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'control'] as const;
/** Insets the code nests by (spec 1.3 nesting rule: max(sm, outer − inset)). 12 is TaskChecklist's card. */
const INSETS = [2, 3, 4, 5, 6, 8, 12];

type Entry = { readonly name: string; readonly r: number; readonly g: number; readonly b: number; readonly a: number; readonly lab: readonly number[] };

export type LitmusTheme = {
  readonly pass: LitmusPass;
  readonly light: TokenMap;
  readonly dark: TokenMap;
  /** hex (no alpha) → token, per scheme. Shadow and gradient colors are named `<token>#<n>`. */
  readonly reverse: Readonly<Record<Scheme, Map<string, string>>>;
  readonly entries: Readonly<Record<Scheme, readonly Entry[]>>;
  readonly ladder: readonly number[];
  readonly durations: readonly number[];
};

export type Finding = {
  readonly severity: Severity;
  readonly kind: FindingKind;
  readonly group: string;
  readonly property: string;
  readonly value: string;
  readonly detail: string;
  readonly path: string;
  count: number;
};

export type Report = {
  readonly pass: LitmusPass;
  readonly scheme: Scheme;
  readonly elements: number;
  readonly findings: Finding[];
  readonly totals: Record<Severity, number>;
};

export type LitmusContext = {
  readonly theme: LitmusTheme;
  readonly scheme: Scheme;
  /** The report group of an element (component/example, or "shell"). */
  readonly groupOf: (el: Element) => string;
};

const COLOR_RE = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi;
const CSS_COLOR_RE = /rgba?\([^)]*\)|color\(srgb[^)]*\)|oklab\([^)]*\)|oklch\([^)]*\)/gi;

const hex2 = (n: number) => Math.round(Math.min(1, Math.max(0, n)) * 255).toString(16).padStart(2, '0');
const keyOf = (r: number, g: number, b: number) => `#${hex2(r)}${hex2(g)}${hex2(b)}`;

function entry(name: string, hex: string): Entry {
  const c = parseColor(hex)!;
  return { name, r: c.r * 255, g: c.g * 255, b: c.b * 255, a: c.a, lab: toOklab(keyOf(c.r, c.g, c.b)) };
}

/** A saturated, distinct color near lightness `L`, starting at hue `h`. */
function distinct(L: number, h: number, used: string[]): string {
  const Lc = Math.min(0.86, Math.max(0.4, L));
  for (let k = 0; k < 400; k++) {
    const hex = gamut(Lc + [0, 0.05, -0.05, 0.09, -0.09][Math.floor(k / 3) % 5], [0.14, 0.18, 0.11][k % 3], (h + k * 7.3) % 360);
    const [, C] = toOklch(hex);
    if (C < 0.08) continue;
    if (used.every(u => deltaE(u, hex) >= 0.03)) { used.push(hex); return hex; }
  }
  throw new Error('Litmus: no distinct color left');
}

/**
 * The stress theme for one radius pass. Built from TOKEN_NAMES, so new tokens are covered automatically.
 * Color token i gets hue i × 137.508° in light and that hue + 180° in dark at its own base lightness
 * (clamped so a hue fits), translucent tokens keep their alpha, and every shadow and gradient stop gets
 * its own hue. All values, in both schemes, are at least .03 ΔE_OK apart.
 */
export function litmusTheme(pass: LitmusPass, base: BaseValues = BASE): LitmusTheme {
  const used: string[] = [];
  const ladder = LITMUS_LADDERS[pass];
  const maps: Record<Scheme, Record<string, string>> = { light: { ...base.light }, dark: { ...base.dark } };
  const reverse: Record<Scheme, Map<string, string>> = { light: new Map(), dark: new Map() };
  const entries: Record<Scheme, Entry[]> = { light: [], dark: [] };
  let i = 0;
  for (const scheme of ['light', 'dark'] as const) {
    i = 0;
    const map = maps[scheme];
    const stress = (name: string, value: string): string => {
      const c = parseColor(value);
      if (!c) return value;
      const [L] = toOklab(keyOf(c.r, c.g, c.b));
      const hex = distinct(L, (i++ * 137.508 + (scheme === 'dark' ? 180 : 0)) % 360, used);
      reverse[scheme].set(hex, name);
      entries[scheme].push(entry(name, hex));
      return c.a < 1 ? hex + hex2(c.a) : hex;
    };
    for (const name of TOKEN_NAMES) {
      const value = base[scheme][name];
      if (name.startsWith('--os-color-')) map[name] = stress(name, value);
      else if (/^--os-(shadow-|focus-shadow|gradient-)/.test(name)) {
        let n = 0;
        map[name] = value.replace(COLOR_RE, m => stress(`${name}#${++n}`, m));
      } else if (name === '--os-font-family') map[name] = LITMUS_FONT;
      else if (name.startsWith('--os-motion-')) {
        const ms = MOTION[name.slice(12)];
        if (ms) map[name] = `${ms}ms`;
      } else if (name.startsWith('--os-ease-')) {
        const k = TOKEN_NAMES.filter(t => t.startsWith('--os-ease-')).indexOf(name);
        map[name] = `cubic-bezier(.${11 + k * 7},.${61 + k * 3},.${31 + k * 5},1)`;
      } else {
        const step = STEPS.findIndex(s => name === `--os-radius-${s}`);
        if (step >= 0) map[name] = `${ladder[step]}px`;
      }
    }
  }
  const durations = [...Object.values(MOTION), ...DURATION_EXCEPTIONS, 0];
  return { pass, light: maps.light as TokenMap, dark: maps.dark as TokenMap, reverse, entries, ladder, durations };
}

// Computed-style parsing -----------------------------------------------------------------------

/** rgb()/rgba()/color(srgb …)/oklab()/oklch() as Chrome serializes computed colors; null otherwise. */
export function parseComputed(value: string): { r: number; g: number; b: number; a: number } | null {
  const s = value.trim().toLowerCase();
  if (s === 'transparent' || s === 'none' || s === '') return null;
  if (s.startsWith('rgb')) { const c = parseColor(s); return c && { r: c.r * 255, g: c.g * 255, b: c.b * 255, a: c.a }; }
  const m = /^(color\(srgb|oklab\(|oklch\()\s*([^)]*)\)$/.exec(s);
  if (!m) return null;
  const [chan, al] = m[2].split('/');
  const p = chan.trim().split(/\s+/).map(v => (v.endsWith('%') ? parseFloat(v) / 100 : v === 'none' ? 0 : parseFloat(v)));
  const a = al === undefined ? 1 : al.trim().endsWith('%') ? parseFloat(al) / 100 : parseFloat(al);
  if (m[1] === 'color(srgb') return { r: p[0] * 255, g: p[1] * 255, b: p[2] * 255, a };
  const [L, x, y] = p;
  const C = m[1] === 'oklab(' ? Math.hypot(x, y) : x;
  const h = m[1] === 'oklab(' ? ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360 : y;
  const c = parseColor(gamut(L, C, h))!;
  return { r: c.r * 255, g: c.g * 255, b: c.b * 255, a };
}

const near = (e: Entry, c: { r: number; g: number; b: number }) => Math.abs(e.r - c.r) <= 1.01 && Math.abs(e.g - c.g) <= 1.01 && Math.abs(e.b - c.b) <= 1.01;

type ColorVerdict = { kind: 'ok' } | { kind: 'mode-leak' | 'mix' | 'color'; detail: string } | { kind: 'token'; name: string };

const verdicts = new Map<string, ColorVerdict>();

function judgeColor(value: string, theme: LitmusTheme, scheme: Scheme): ColorVerdict {
  const key = `${theme.pass}|${scheme}|${value}`;
  const hit = verdicts.get(key);
  if (hit) return hit;
  const v = judgeUncached(value, theme, scheme);
  verdicts.set(key, v);
  return v;
}

function judgeUncached(value: string, theme: LitmusTheme, scheme: Scheme): ColorVerdict {
  const c = parseComputed(value);
  if (!c || c.a === 0) return { kind: 'ok' };
  const own = theme.entries[scheme];
  const match = own.find(e => near(e, c));
  if (match) return { kind: 'token', name: match.name };
  const other = theme.entries[scheme === 'light' ? 'dark' : 'light'].find(e => near(e, c));
  if (other) return { kind: 'mode-leak', detail: `matches the ${scheme === 'light' ? 'dark' : 'light'} value of ${short(other.name)}` };
  // A mix of two tokens (sRGB or OKLab, t by projection), within ΔE_OK .01.
  const hex = keyOf(c.r / 255, c.g / 255, c.b / 255);
  const lab = toOklab(hex);
  let best: { d: number; a: Entry; b: Entry; t: number } | null = null;
  for (let i = 0; i < own.length; i++) for (let j = i + 1; j < own.length; j++) {
    const A = own[i], B = own[j];
    for (const space of ['srgb', 'oklab'] as const) {
      const pa = space === 'srgb' ? [A.r, A.g, A.b] : A.lab, pb = space === 'srgb' ? [B.r, B.g, B.b] : B.lab;
      const pc = space === 'srgb' ? [c.r, c.g, c.b] : lab;
      const ab = pb.map((v, k) => v - pa[k]), ac = pc.map((v, k) => v - pa[k]);
      const len = ab.reduce((s, v) => s + v * v, 0);
      if (len === 0) continue;
      const t = Math.min(1, Math.max(0, ac.reduce((s, v, k) => s + v * ab[k], 0) / len));
      const q = pa.map((v, k) => v + t * ab[k]);
      const d = space === 'srgb' ? deltaE(hex, keyOf(q[0] / 255, q[1] / 255, q[2] / 255)) : Math.hypot(q[0] - lab[0], q[1] - lab[1], q[2] - lab[2]);
      if (!best || d < best.d) best = { d, a: A, b: B, t };
    }
  }
  if (best && best.d <= 0.01) return { kind: 'mix', detail: `${short(best.a.name)} ${Math.round((1 - best.t) * 100)}% + ${short(best.b.name)}` };
  return { kind: 'color', detail: `${hex} is no ${scheme} token` };
}

const short = (name: string) => name.replace(/^--os-(color-)?/, '');

// Classification -------------------------------------------------------------------------------

function pathOf(el: Element): string {
  const parts: string[] = [];
  for (let node: Element | null = el, k = 0; node && k < 4 && !node.hasAttribute('data-litmus-example'); node = node.parentElement, k++) {
    const role = node.getAttribute('role');
    const names = Array.from(node.classList).filter(c => c.includes('__')).join(' ');
    parts.unshift(`${node.tagName.toLowerCase()}${role ? `[${role}]` : ''}${names ? `{${names}}` : ''}`);
  }
  return parts.join(' > ');
}

function px(value: string, basis: number): number {
  const first = value.trim().split(/\s+/)[0];
  return first.endsWith('%') ? (parseFloat(first) / 100) * basis : parseFloat(first);
}

/** Whether a computed radius follows the corner contract at the theme's ladder. */
export function radiusOk(v: number, box: { w: number; h: number }, ladder: readonly number[]): boolean {
  const eq = (x: number) => Math.abs(v - x) <= 0.01;
  if (eq(0) || eq(999)) return true;
  if (box.w > 0 && box.h > 0 && v >= Math.min(box.w, box.h) / 2 - 0.01) return true;
  if (ladder.some(eq)) return true;
  const sm = ladder[1];
  for (const outer of ladder.slice(2)) for (const inset of INSETS) if (eq(Math.max(sm, outer - inset))) return true;
  // Tracks, Group shells and rails sit outside a control: control + inset (10 for the ExpandingTabs and Toolbar rails).
  const control = ladder[6];
  if (control !== undefined) for (const inset of [...INSETS, 10]) if (eq(control + inset)) return true;
  // The inner edge of a 1px hairline: outer − 1, concentric with the border.
  return ladder.some(outer => eq(outer - 1));
}

const durationsOf = (value: string) => value.split(',').map(v => (v.trim().endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000));

/** Findings for one element (and its ::before / ::after when they render). */
export function classify(el: Element, ctx: LitmusContext): Finding[] {
  const out: Finding[] = [];
  const group = ctx.groupOf(el);
  const path = pathOf(el);
  const add = (severity: Severity, kind: FindingKind, property: string, value: string, detail: string) =>
    out.push({ severity, kind, group, property, value, detail, path, count: 1 });
  const color = (property: string, value: string) => {
    const v = judgeColor(value, ctx.theme, ctx.scheme);
    if (v.kind === 'ok') return;
    if (v.kind === 'token') {
      const n = v.name;
      if (property === 'color' && n.startsWith('--os-color-bg-')) add('warning', 'role', property, value, `${short(n)} used as text`);
      if (property === 'background-color' && n.startsWith('--os-color-fg-')) add('warning', 'role', property, value, `${short(n)} used as a fill`);
      if (property === 'outline-color' && n !== '--os-color-focus-ring') add('warning', 'role', property, value, `${short(n)} outline where focus-ring is expected`);
      return;
    }
    add(v.kind === 'mix' ? 'warning' : 'error', v.kind, property, value, v.detail);
  };
  const html = el instanceof HTMLElement;
  const svgShape = el instanceof SVGElement && !(el instanceof SVGSVGElement) && /^(path|circle|rect|line|polyline|polygon|ellipse|text)$/.test(el.tagName);
  for (const pseudo of [null, '::before', '::after'] as const) {
    const cs = getComputedStyle(el, pseudo);
    if (pseudo && (cs.content === 'none' || cs.content === 'normal')) continue;
    const prop = (p: string) => (pseudo ? `${pseudo} ${p}` : p);
    if (cs.display === 'none') continue;
    if (html || pseudo) {
      color(prop('color'), cs.color);
      color(prop('background-color'), cs.backgroundColor);
      for (const side of ['top', 'right', 'bottom', 'left']) {
        if (parseFloat(cs.getPropertyValue(`border-${side}-width`)) > 0 && cs.getPropertyValue(`border-${side}-style`) !== 'none') color(prop(`border-${side}-color`), cs.getPropertyValue(`border-${side}-color`));
      }
      if (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) color(prop('outline-color'), cs.outlineColor);
      for (const m of cs.boxShadow.match(CSS_COLOR_RE) ?? []) color(prop('box-shadow'), m);
      for (const m of cs.backgroundImage.match(CSS_COLOR_RE) ?? []) color(prop('background-image'), m);
      const box = html && !pseudo ? { w: (el as HTMLElement).offsetWidth, h: (el as HTMLElement).offsetHeight } : { w: 0, h: 0 };
      for (const corner of ['top-left', 'top-right', 'bottom-right', 'bottom-left']) {
        const raw = cs.getPropertyValue(`border-${corner}-radius`);
        const v = px(raw, box.w);
        if (Number.isFinite(v) && !radiusOk(v, box, ctx.theme.ladder)) { add('error', 'radius', prop(`border-${corner}-radius`), raw, `${+v.toFixed(2)}px is no token and no nesting result`); break; }
      }
    }
    if (svgShape && !pseudo) {
      if (cs.fill !== 'none') color('fill', cs.fill);
      if (cs.stroke !== 'none') color('stroke', cs.stroke);
    }
    const texty = !pseudo && (/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName) || Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent!.trim() !== ''));
    if ((texty || (pseudo && cs.content.length > 2)) && !cs.fontFamily.replace(/['"]/g, '').startsWith('Litmus Sentinel')) add('error', 'font', prop('font-family'), cs.fontFamily, 'not --os-font-family');
    const check = (property: string, value: string) => {
      for (const ms of durationsOf(value)) if (Number.isFinite(ms) && !ctx.theme.durations.some(d => Math.abs(d - ms) < 0.5)) add('error', 'motion', prop(property), value, `${+ms.toFixed(1)}ms is no motion token`);
    };
    if (cs.transitionProperty !== 'none') check('transition-duration', cs.transitionDuration);
    if (cs.animationName !== 'none') check('animation-duration', cs.animationDuration);
  }
  return out;
}

/** The focused element's ring: an outline in focus-ring (or a focus-ring box-shadow) and no focus-shadow halo. */
export function classifyFocus(el: Element, ctx: LitmusContext): Finding[] {
  const out: Finding[] = [];
  const ring = ctx.theme.entries[ctx.scheme].find(e => e.name === '--os-color-focus-ring')!;
  const halo = ctx.theme.entries[ctx.scheme].filter(e => e.name.startsWith('--os-focus-shadow'));
  const add = (severity: Severity, value: string, detail: string, at: Element) =>
    out.push({ severity, kind: 'focus', group: ctx.groupOf(el), property: 'focus', value, detail, path: pathOf(at), count: 1 });
  let seen = false;
  const chain: Element[] = [];
  for (let n: Element | null = el, k = 0; n && k < 4; n = n.parentElement, k++) chain.push(n);
  for (const node of chain) for (const pseudo of [null, '::before', '::after'] as const) {
    const cs = getComputedStyle(node, pseudo);
    if (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) {
      const c = parseComputed(cs.outlineColor);
      if (c && c.a > 0) { seen = true; if (!near(ring, c)) add('error', cs.outlineColor, 'focus outline is not focus-ring', node); }
    }
    for (const m of cs.boxShadow.match(CSS_COLOR_RE) ?? []) {
      const c = parseComputed(m);
      if (!c) continue;
      if (near(ring, c)) seen = true;
      if (halo.some(h => near(h, c))) add('error', m, 'deprecated --os-focus-shadow halo', node);
    }
  }
  if (!seen) add('info', 'none', 'no focus-ring outline found on the element or its 3 nearest ancestors', el);
  return out;
}

/** Classifies `root` and every descendant (or every node in `nodes`), merging identical findings. */
export function sweep(roots: Element | readonly Element[], ctx: LitmusContext, pass: LitmusPass = ctx.theme.pass): Report {
  const merged = new Map<string, Finding>();
  let elements = 0;
  const hidden = (el: Element) => {
    if (el.hasAttribute('data-litmus-ignore')) return true;
    if (!(el instanceof HTMLElement)) return false;
    if (el.getClientRects().length === 0 && !(el instanceof HTMLInputElement)) return true;
    // Visually hidden (1×1 clipped) text for assistive technology renders no pixels.
    const cs = getComputedStyle(el);
    if (cs.opacity === '0') return true;
    return el.offsetWidth <= 1 && el.offsetHeight <= 1 && (cs.overflow === 'hidden' || cs.clipPath !== 'none' || cs.clip !== 'auto');
  };
  const walk = function* (el: Element): Generator<Element> {
    if (hidden(el)) return;
    yield el;
    for (const child of Array.from(el.children)) yield* walk(child);
  };
  for (const root of Array.isArray(roots) ? roots : [roots as Element]) {
    for (const el of walk(root)) {
      elements++;
      for (const f of classify(el, ctx)) {
        const key = `${f.group}|${f.kind}|${f.property}|${f.value}|${f.path}`;
        const prev = merged.get(key);
        if (prev) prev.count++;
        else merged.set(key, f);
      }
    }
  }
  const findings = [...merged.values()];
  const totals: Record<Severity, number> = { error: 0, warning: 0, info: 0 };
  for (const f of findings) totals[f.severity]++;
  return { pass, scheme: ctx.scheme, elements, findings, totals };
}

/** Writes a litmus map as inline custom properties on `target`; returns the cleanup. */
export function applyLitmus(map: TokenMap, target: HTMLElement = document.documentElement): () => void {
  const previous = TOKEN_NAMES.map(name => [name, target.style.getPropertyValue(name)] as const);
  for (const name of TOKEN_NAMES) target.style.setProperty(name, map[name as TokenName]);
  return () => { for (const [name, value] of previous) value ? target.style.setProperty(name, value) : target.style.removeProperty(name); };
}
