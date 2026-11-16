// deriveTheme: recipe → complete light and dark token maps. Pure: no DOM, no React, no StyleX.
// The docs, the runtime and every export call this one function, so they cannot drift.
import { atLuminance, contrast, deltaE, gamut, mixSrgb, parseColor, relLum, rgbChannels, toOklab, toOklch } from './color.ts';
import { BASE, TOKEN_NAMES } from './base-values.ts';
import { ALL_AVAILABLE, CORNER_LADDERS, NEUTRAL_FAMILIES, TYPEFACES, accentSeed, canonicalRecipe, normalizeRecipe, shareCode } from './recipe.ts';
import { RULES, auditTokens, measureRule, ruleApplies } from './audit.ts';
import type { Adjustment, AdjustmentReason, BaseValues, DerivedTheme, HexColor, Note, Recipe, Scheme, TokenMap, TokenName } from './types.ts';

const t = (name: string): TokenName => `--os-${name}`;
const c = (name: string): TokenName => `--os-color-${name}`;

/** In CORNER_LADDERS step order: the six-step ladder, then the control radius. */
const RADII = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'control'].map(step => t(`radius-${step}`));
const ACCENT_STEPS = [c('accent-moderate'), c('accent-bold'), c('accent-strong'), c('accent-intense')];

/** Tokens run through the neutral transfer (§3.3), per scheme, from that scheme's base. */
const TRANSFERRED: readonly TokenName[] = [
  'fg-base', 'fg-muted', 'fg-subtle', 'fg-disabled', 'fg-on-contrast', 'fg-link', 'focus-ring',
  'bg-canvas', 'bg-surface', 'bg-subtle', 'bg-muted', 'bg-raised', 'bg-elevated',
  'bg-interactive-primary', 'bg-interactive-secondary', 'bg-interactive-tertiary', 'bg-disabled', 'bg-contrast',
  'border-subtle', 'border-muted', 'border-control', 'border-interactive-primary', 'border-disabled',
  'accent-moderate', 'accent-bold', 'accent-strong', 'accent-intense', 'accent-on-accent',
  'accent-subtle', 'accent-muted', 'accent-dim',
].map(c);

const OWNED_SET = new Set<TokenName>([
  ...RADII, t('font-family'), ...TRANSFERRED, c('fg-static-dark'), c('bg-overlay'),
  t('button-active-text'), t('shadow-control'), t('shadow-popup'), t('gradient-progress'),
]);

/** The 45 tokens the runtime and the exports write, in contract order. */
export const OWNED_TOKENS: readonly TokenName[] = Object.freeze(TOKEN_NAMES.filter(name => OWNED_SET.has(name)));

/** Tokens the rounding repair may move (the movable side of a failing rule, §3.3). */
const MOVABLE = new Set<TokenName>([c('fg-base'), c('fg-muted'), c('fg-subtle'), c('fg-link'), c('focus-ring'), c('border-control'), c('border-interactive-primary')]);
const NOT_NEUTRAL = new Set<string>([...ACCENT_STEPS, c('accent-on-accent'), 'progress-track', 'progress-stop-1', 'progress-stop-2', 'progress-stop-3']);

const DANGER = [c('bg-danger-primary'), c('bg-danger-secondary'), c('fg-danger')];
const STATUS = [c('fg-success'), c('bg-success-contrast'), c('fg-warning'), c('bg-warning-contrast')];

type Map = Record<TokenName, string>;
type Family = { hue: number; peak: number } | null; // null = Paper (verbatim)

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

/** Chroma taper: none at white, black and the extremes, full chroma in the middle (§3.3). */
function taper(L: number): number {
  if (L >= 0.995 || L <= 0.02) return 0;
  return clamp(Math.min((1 - L) / 0.12, L / 0.45), 0, 1);
}

/** Luminance-locked transfer: same WCAG Y as the base value, the family's hue and tapered chroma. */
function transfer(value: string, family: { hue: number; peak: number }): string {
  const rgba = parseColor(value);
  if (!rgba || rgba.a < 1) return value;
  return atLuminance(relLum(value), family.peak * taper(toOklab(value)[0]), family.hue);
}

function familyOf(recipe: Recipe): Family {
  const def = NEUTRAL_FAMILIES[recipe.neutrals];
  if (recipe.neutrals === 'paper') return null;
  if (def.hue === 'accent') {
    const seed = accentSeed(recipe.accent);
    const lch = seed ? toOklch(seed) : null;
    if (!lch || lch[2] === null || lch[1] < 0.02) return null; // Tinted needs a hue; falls back to Paper
    return { hue: lch[2], peak: Math.min(def.peak, 0.1 * lch[1]) };
  }
  return { hue: def.hue ?? 0, peak: def.peak };
}

/** Contrast: More (§3.7): moves listed tokens toward more contrast, keeping their own C and h. */
function applyMore(map: Map, scheme: Scheme): void {
  const light = scheme === 'light';
  const edgeBg = light ? c('bg-canvas') : c('bg-elevated');
  const targets: readonly [TokenName, TokenName, number][] = [
    [c('fg-muted'), c('bg-muted'), light ? 7 : 9],
    [c('fg-subtle'), c('bg-muted'), light ? 5.5 : 7],
    [c('border-control'), edgeBg, 4.5],
    [c('border-muted'), edgeBg, light ? 2 : 2.4],
    [c('border-subtle'), edgeBg, light ? 1.5 : 1.8],
    [c('border-disabled'), edgeBg, light ? 1.5 : 1.8],
  ];
  for (const [token, bg, ratio] of targets) {
    if (contrast(map[token], map[bg]) >= ratio) continue;
    const yb = relLum(map[bg]);
    const target = light ? (yb + 0.05) / ratio - 0.05 : ratio * (yb + 0.05) - 0.05;
    const [, C, h] = toOklch(map[token]);
    map[token] = atLuminance(target, h === null ? 0 : C, h ?? 0); // an achromatic token stays achromatic
  }
  const bip = c('border-interactive-primary'), ctl = c('border-control');
  if (contrast(map[ctl], map[edgeBg]) > contrast(map[bip], map[edgeBg])) map[bip] = map[ctl];
}

/** Rounding repair (§3.3): nudges the movable side of a failing neutral rule by .002 L toward fg, ≤ 20 passes. */
function repair(map: Map, scheme: Scheme, skip: ReadonlySet<TokenName>, adjustments: Adjustment[]): void {
  const rules = RULES.filter(rule => ruleApplies(rule, scheme) && rule.kind === 'contrast' && !rule.finding
    && MOVABLE.has(rule.fg as TokenName) && !skip.has(rule.fg as TokenName) && !NOT_NEUTRAL.has(rule.bg));
  const state = new globalThis.Map<TokenName, { from: string; L: number; C: number; h: number }>();
  for (let pass = 0; pass < 20; pass++) {
    const failing = new Set<TokenName>();
    for (const rule of rules) if (!(measureRule(rule, map, scheme) >= rule.min)) failing.add(rule.fg as TokenName);
    if (failing.size === 0) break;
    for (const token of failing) {
      let s = state.get(token);
      if (!s) {
        const [L, C, h] = toOklch(map[token]);
        s = { from: map[token], L, C: h === null ? 0 : C, h: h ?? 0 };
        state.set(token, s);
      }
      s.L += scheme === 'light' ? -0.002 : 0.002;
      map[token] = gamut(s.L, s.C, s.h);
    }
  }
  for (const [token, s] of state) {
    adjustments.push({ scheme, token, from: s.from, to: map[token], reason: 'rounding', message: MESSAGES.rounding.light, visible: false });
  }
}

const MESSAGES: Readonly<Record<AdjustmentReason, { light: string; dark: string }>> = {
  'text-on-accent': {
    light: 'Darkened in light so white text on buttons reads at least 4.5:1.',
    dark: 'Moved into the dark range so ink text on buttons reads at least 4.5:1.',
  },
  'text-accent': {
    light: 'Darkened so links and accent text stay readable.',
    dark: 'Lightened in dark so links and accent text stay readable.',
  },
  'state-fill': {
    light: 'Darkened so checked boxes and switches stand out at least 3:1.',
    dark: 'Lightened in dark so checked boxes and switches stand out at least 3:1.',
  },
  'dark-band': {
    light: 'Moved into the dark range so ink text on buttons reads at least 4.5:1.',
    dark: 'Moved into the dark range so ink text on buttons reads at least 4.5:1.',
  },
  lifted: {
    light: 'Very dark colors are lifted so hover and press stay visible. For black, choose Ink.',
    dark: 'Very dark colors are lifted so hover and press stay visible. For black, choose Ink.',
  },
  chroma: { light: 'Saturation reduced to keep the look quiet.', dark: 'Saturation reduced to keep the look quiet.' },
  rounding: {
    light: 'Nudged so its contrast still clears the minimum after rounding to 8-bit color.',
    dark: 'Nudged so its contrast still clears the minimum after rounding to 8-bit color.',
  },
};

type Solved = { L: number; C: number; h: number; steps: HexColor[]; firstFail: AdjustmentReason | null };

/** The accent solver (§3.4) for one scheme against that scheme's finished neutral map. */
function solveAccent(seed: HexColor, scheme: Scheme, map: Map, on: string): Solved {
  const light = scheme === 'light';
  const [Ls, Cs, hs] = toOklch(seed);
  const C = Math.min(Cs, 0.2), h = hs ?? 0;
  const fills = [c('bg-canvas'), c('bg-surface'), c('bg-subtle'), c('bg-muted'), c('bg-elevated'), c('bg-raised')].map(n => map[n]);
  const textBgs = [c('bg-canvas'), c('bg-subtle'), c('bg-elevated'), c('accent-subtle'), c('accent-muted')].map(n => map[n]);
  const steps = (L: number): HexColor[] => {
    const d = light ? Math.min(0.04, (L - 0.12) / 3) : Math.min(0.04, (0.97 - L) / 3);
    return [0, 1, 2, 3].map(i => gamut(light ? L - i * d : L + i * d, C, h));
  };
  const fail = (s: HexColor[]): AdjustmentReason | null => {
    if (!(contrast(on, s[0]) >= 4.6 && contrast(on, s[1]) >= 4.6 && contrast(on, s[2]) >= 4.6)) return 'text-on-accent';
    if (!fills.every(bg => contrast(s[0], bg) >= 3.1)) return 'state-fill';
    if (!textBgs.every(bg => contrast(s[1], bg) >= 4.6)) return 'text-accent';
    return null;
  };
  const L0 = light ? clamp(Ls, 0.3, 0.95) : clamp(Ls, 0.72, 0.86);
  const firstFail = fail(steps(L0));
  let L = L0, s = steps(L0);
  for (let k = 1; firstFail !== null && fail(s) !== null; k++) {
    const next = light ? L0 - k / 1000 : L0 + k / 1000;
    if (light ? next < 0.13 : next > 0.97) break; // never observed: the audit then reports the failure
    L = next;
    s = steps(L);
  }
  return { L, C, h, steps: s, firstFail };
}

/** Progress gradient (§3.4): stops at hue ∓ 30, each moved toward fg until ≥ 3.1:1 on the track. */
function gradientFor(solved: Solved, scheme: Scheme, map: Map): string {
  const track = mixSrgb(map[c('fg-base')], map[c('bg-surface')], 0.12);
  const stop = (hue: number): HexColor => {
    let L = solved.L, hex = gamut(L, solved.C, hue);
    for (let i = 0; i < 500 && contrast(hex, track) < 3.1; i++) {
      L += scheme === 'light' ? -0.002 : 0.002;
      hex = gamut(L, solved.C, hue);
    }
    return hex;
  };
  return `linear-gradient(90deg,${stop(solved.h - 30)},${solved.steps[0]} 50%,${stop(solved.h + 30)})`;
}

function sameColor(a: string, b: string): boolean {
  const x = parseColor(a), y = parseColor(b);
  if (!x || !y) return false;
  const q = (v: number) => Math.round(v * 255);
  return q(x.r) === q(y.r) && q(x.g) === q(y.g) && q(x.b) === q(y.b) && Math.abs(x.a - y.a) < 1e-9;
}

function notesFor(moderate: string, scheme: Scheme, map: Map): Note[] {
  const notes: Note[] = [];
  const closest = (tokens: readonly TokenName[]) => tokens
    .map(token => ({ token, distance: deltaE(moderate, map[token]) }))
    .reduce((a, b) => (b.distance < a.distance ? b : a));
  const red = closest(DANGER);
  if (red.distance < 0.1) notes.push({ scheme, severity: 'warning', against: red.token, distance: red.distance, message: 'This accent is close to the red used for destructive actions. Give destructive buttons an icon or a confirm step.' });
  const status = closest(STATUS);
  if (status.distance < 0.1) notes.push({ scheme, severity: 'note', against: status.token, distance: status.distance, message: 'This accent is close to a status color, so status badges may read as primary.' });
  return notes;
}

function deriveUncached(input: Recipe, base: BaseValues): DerivedTheme {
  const recipe = canonicalRecipe(normalizeRecipe(input, ALL_AVAILABLE));
  const family = familyOf(recipe);
  const seed = accentSeed(recipe.accent);
  const ink = seed === null;
  const adjustments: Adjustment[] = [];
  const notes: Note[] = [];
  const maps = { light: { ...base.light } as Map, dark: { ...base.dark } as Map };
  const follow = new Set<TokenName>();
  if (!ink && recipe.focusFollowsAccent) follow.add(c('focus-ring'));
  if (!ink && recipe.linksFollowAccent) follow.add(c('fg-link'));

  // 1. Neutrals: transfer, Contrast: More, rounding repair. Each scheme from its own base.
  for (const scheme of ['light', 'dark'] as const) {
    const map = maps[scheme];
    if (family) for (const token of TRANSFERRED) map[token] = transfer(base[scheme][token], family);
    if (recipe.contrast === 'more') applyMore(map, scheme);
    if (family || recipe.contrast === 'more') repair(map, scheme, follow, adjustments);
  }

  // 2. Derived neutrals: the family ink, the light overlay and light shadows follow light fg-base.
  const ink8 = maps.light[c('fg-base')];
  const oldTriplet = rgbChannels(base.light[c('fg-base')]);
  const newTriplet = rgbChannels(ink8);
  maps.light[c('fg-static-dark')] = ink8;
  maps.dark[c('fg-static-dark')] = ink8;
  maps.dark[c('fg-on-contrast')] = ink8;
  if (oldTriplet && newTriplet && oldTriplet !== newTriplet) {
    maps.light[c('bg-overlay')] = base.light[c('bg-overlay')].replace(/rgb\(\s*\d+\s+\d+\s+\d+\s*\//, `rgb(${newTriplet} /`);
    for (const token of [t('shadow-control'), t('shadow-popup')]) maps.light[token] = base.light[token].split(oldTriplet).join(newTriplet);
  }

  // 3. Accent.
  for (const scheme of ['light', 'dark'] as const) {
    const map = maps[scheme];
    const on = scheme === 'light' ? (ink ? map[c('accent-on-accent')] : '#ffffff') : ink8;
    map[c('accent-on-accent')] = on;
    map[t('button-active-text')] = on;
    if (ink) continue;
    const schemeSeed = (scheme === 'dark' ? recipe.accentDark : null) ?? (seed as HexColor);
    const solved = solveAccent(schemeSeed, scheme, map, on);
    ACCENT_STEPS.forEach((token, i) => { map[token] = solved.steps[i]; });
    if (recipe.focusFollowsAccent) map[c('focus-ring')] = solved.steps[0];
    if (recipe.linksFollowAccent) map[c('fg-link')] = solved.steps[1];
    map[t('gradient-progress')] = gradientFor(solved, scheme, map);

    const [Ls, Cs] = toOklch(schemeSeed);
    let reason: AdjustmentReason | null = null;
    if (scheme === 'light' && Ls < 0.3) reason = 'lifted';
    else if (scheme === 'dark' && (Ls < 0.72 || Ls > 0.86)) reason = 'dark-band';
    else if (solved.firstFail) reason = solved.firstFail;
    else if (Cs > 0.2) reason = 'chroma';
    const distance = deltaE(schemeSeed, solved.steps[0]);
    if (reason !== null || distance >= 0.01) {
      const why = reason ?? 'chroma';
      adjustments.push({ scheme, token: c('accent-moderate'), from: schemeSeed, to: solved.steps[0], reason: why, message: MESSAGES[why][scheme], visible: distance >= 0.01 });
    }
    notes.push(...notesFor(solved.steps[0], scheme, map));
  }

  // 4. Corners and typeface (same in both schemes).
  const ladder = CORNER_LADDERS[recipe.corners];
  const stack = TYPEFACES[recipe.typeface].stack;
  for (const scheme of ['light', 'dark'] as const) {
    RADII.forEach((token, i) => { maps[scheme][token] = `${ladder[i]}px`; });
    maps[scheme][t('font-family')] = stack ?? base[scheme][t('font-family')];
  }

  // 5. A color that did not change keeps the base string, so patches change only real literals.
  let identity = true;
  for (const scheme of ['light', 'dark'] as const) {
    const map = maps[scheme];
    for (const token of OWNED_TOKENS) {
      if (map[token] !== base[scheme][token] && sameColor(map[token], base[scheme][token])) map[token] = base[scheme][token];
    }
    for (const token of Object.keys(base[scheme]) as TokenName[]) if (map[token] !== base[scheme][token]) identity = false;
  }

  const light = Object.freeze(maps.light) as TokenMap;
  const dark = Object.freeze(maps.dark) as TokenMap;
  return Object.freeze({
    recipe,
    code: shareCode(recipe),
    identity,
    light,
    dark,
    owned: OWNED_TOKENS,
    adjustments: Object.freeze(adjustments),
    notes: Object.freeze(notes),
    audit: Object.freeze({ light: auditTokens(light, 'light', { ink }), dark: auditTokens(dark, 'dark', { ink }) }),
  });
}

const cache: { code: string; base: BaseValues; theme: DerivedTheme }[] = [];

/**
 * Complete light and dark maps for a recipe (any input is normalized first; availability is not applied, so
 * every option can be derived and verified). `base` defaults to the BASE snapshot; the docs pass
 * `baseFromSources(...)` of the live token files. The last 8 results are memoized per base object.
 */
export function deriveTheme(recipe: Recipe, base: BaseValues = BASE): DerivedTheme {
  const code = shareCode(canonicalRecipe(normalizeRecipe(recipe, ALL_AVAILABLE)));
  const hit = cache.find(entry => entry.code === code && entry.base === base);
  if (hit) return hit.theme;
  const theme = deriveUncached(recipe, base);
  cache.unshift({ code, base, theme });
  if (cache.length > 8) cache.pop();
  return theme;
}
