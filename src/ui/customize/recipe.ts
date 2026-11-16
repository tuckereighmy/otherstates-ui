// Knobs, presets, availability, share codes and recipe JSON for the theme builder.
// Pure: no DOM, no React, no StyleX.
import { normalizeHex, toOklch } from './color.ts';
import type { AccentPreset, Availability, ContrastLevel, CornerLadder, HexColor, NeutralFamily, PresetId, Recipe, Typeface } from './types.ts';

export const DEFAULT_RECIPE: Recipe = Object.freeze({
  v: 1,
  accent: 'ink',
  accentDark: null,
  neutrals: 'paper',
  corners: 'round',
  typeface: 'inter',
  contrast: 'standard',
  focusFollowsAccent: true,
  linksFollowAccent: true,
});

export const ACCENT_PRESETS: Readonly<Record<Exclude<AccentPreset, 'ink'>, { seed: HexColor; label: string; hueName: string }>> = Object.freeze({
  harbor: Object.freeze({ seed: '#2a6ada', label: 'Harbor', hueName: 'blue' }),
  lagoon: Object.freeze({ seed: '#0a7893', label: 'Lagoon', hueName: 'teal' }),
  plum: Object.freeze({ seed: '#7b4fd6', label: 'Plum', hueName: 'violet' }),
  orchid: Object.freeze({ seed: '#a447b8', label: 'Orchid', hueName: 'magenta' }),
});

/** hue: a fixed OKLCH hue, 'accent' (Tinted: the accent seed's hue) or null (no hue). Paper is returned verbatim. */
export const NEUTRAL_FAMILIES: Readonly<Record<NeutralFamily, { label: string; hue: number | 'accent' | null; peak: number }>> = Object.freeze({
  paper: Object.freeze({ label: 'Paper', hue: null, peak: 0 }),
  pure: Object.freeze({ label: 'Pure', hue: null, peak: 0 }),
  slate: Object.freeze({ label: 'Slate', hue: 250, peak: 0.012 }),
  sage: Object.freeze({ label: 'Sage', hue: 155, peak: 0.01 }),
  tinted: Object.freeze({ label: 'Tinted', hue: 'accent', peak: 0.01 }),
});

/** The control radius at or above which every control is a pill (the Round ladder). */
export const ROUND_CONTROL = 9999;

/**
 * Set ladders, never a multiplier: nested radii rely on `md = lg − 6`, `sm = md − 4`. The seventh
 * step is `--os-radius-control`, every control's corners: md in the rect ladders, 9999 in Round, which keeps
 * the Standard radii for everything else. Listed in the order the docs show them.
 */
export const CORNER_LADDERS: Readonly<Record<CornerLadder, readonly [xs: number, sm: number, md: number, lg: number, xl: number, x2: number, control: number]>> = Object.freeze({
  round: Object.freeze([4, 6, 10, 16, 20, 24, ROUND_CONTROL] as const),
  soft: Object.freeze([4, 6, 14, 20, 24, 28, 14] as const),
  standard: Object.freeze([4, 6, 10, 16, 20, 24, 10] as const),
  tight: Object.freeze([2, 2, 6, 12, 16, 20, 6] as const),
});

/** stack null = the shipped Inter stack, verbatim. */
export const TYPEFACES: Readonly<Record<Typeface, { label: string; stack: string | null }>> = Object.freeze({
  inter: Object.freeze({ label: 'Inter', stack: null }),
  platform: Object.freeze({ label: 'Platform', stack: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }),
});

function preset(label: string, accent: Recipe['accent'], neutrals: NeutralFamily, corners: CornerLadder, typeface: Typeface) {
  return Object.freeze({ label, recipe: Object.freeze({ ...DEFAULT_RECIPE, accent, neutrals, corners, typeface }) as Recipe });
}

export const PRESETS: Readonly<Record<PresetId, { label: string; recipe: Recipe }>> = Object.freeze({
  house: preset('House', 'ink', 'paper', 'round', 'inter'),
  ledger: preset('Ledger', 'harbor', 'slate', 'tight', 'inter'),
  graphite: preset('Graphite', 'ink', 'pure', 'tight', 'platform'),
  tidepool: preset('Tidepool', 'lagoon', 'sage', 'standard', 'inter'),
  atelier: preset('Atelier', 'plum', 'tinted', 'soft', 'inter'),
});

/**
 * Phase switches. Flip one to false to switch that phase off: `normalizeRecipe` and
 * `decodeRecipe` then map the option back to its default, and the docs hide it.
 * - soft: off until component prerequisites B1 and B2 land and the Soft per-ladder probes pass.
 * - contrastMore: off (owner decision).
 * - chromatic: on so the builder can be built and verified. Owner decision: chromatic accents ship once
 *   prerequisites A2 to A4 land, so a production release before then must set it to false.
 */
export const AVAILABILITY: Availability = { soft: true, contrastMore: false, chromatic: true };

/** Every option on: what `deriveTheme` accepts. */
export const ALL_AVAILABLE: Readonly<Availability> = Object.freeze({ soft: true, contrastMore: true, chromatic: true });

const ACCENT_IDS: readonly AccentPreset[] = ['ink', 'harbor', 'lagoon', 'plum', 'orchid'];
const NEUTRAL_IDS: readonly NeutralFamily[] = ['paper', 'pure', 'slate', 'sage', 'tinted'];
// Round is appended, so no existing value moves.
const CORNER_IDS: readonly CornerLadder[] = ['tight', 'standard', 'soft', 'round'];
/** The corners a v1 code means when it has no `r-` pair: Standard, the default when v1 codes were first issued. */
const CODE_CORNERS: CornerLadder = 'standard';
const TYPEFACE_IDS: readonly Typeface[] = ['inter', 'platform'];
const CONTRAST_IDS: readonly ContrastLevel[] = ['standard', 'more'];
const PRESET_IDS: readonly PresetId[] = ['house', 'ledger', 'graphite', 'tidepool', 'atelier'];

function oneOf<T extends string>(ids: readonly T[], value: unknown): T | null {
  return typeof value === 'string' && (ids as readonly string[]).includes(value) ? (value as T) : null;
}

/** Accent preset name or hex (3 or 6 digits, `#` optional) → canonical accent; null when invalid. */
function readAccent(value: unknown): Recipe['accent'] | null {
  if (typeof value !== 'string') return null;
  const lower = value.trim().toLowerCase();
  return oneOf(ACCENT_IDS, lower) ?? normalizeHex(lower);
}

/** The seed hex of an accent (preset seed or custom hex), or null for Ink. */
export function accentSeed(accent: Recipe['accent']): HexColor | null {
  if (accent === 'ink') return null;
  if (accent in ACCENT_PRESETS) return ACCENT_PRESETS[accent as Exclude<AccentPreset, 'ink'>].seed;
  return normalizeHex(accent);
}

/** Tinted takes its hue from the accent, so it needs a seed with OKLCH chroma ≥ .02. */
export function tintedAvailable(accent: Recipe['accent']): boolean {
  const seed = accentSeed(accent);
  return seed !== null && toOklch(seed)[1] >= 0.02;
}

type Normalized = { recipe: Recipe; dropped: string[] };

function normalizeObject(input: Record<string, unknown>, availability: Availability, invalid: string[]): Normalized {
  const dropped = [...invalid];
  const pick = <T>(name: string, value: T | null, raw: unknown, fallback: T): T => {
    if (value !== null) return value;
    if (raw !== undefined && raw !== null) dropped.push(name);
    return fallback;
  };
  let accent = pick('accent', readAccent(input.accent), input.accent, DEFAULT_RECIPE.accent);
  const rawDark = input.accentDark;
  let accentDark = rawDark === null || rawDark === undefined ? null : pick<HexColor | null>('accentDark', typeof rawDark === 'string' ? normalizeHex(rawDark) : null, rawDark, null);
  let neutrals = pick('neutrals', oneOf(NEUTRAL_IDS, input.neutrals), input.neutrals, DEFAULT_RECIPE.neutrals);
  let corners = pick('corners', oneOf(CORNER_IDS, input.corners), input.corners, DEFAULT_RECIPE.corners);
  const typeface = pick('typeface', oneOf(TYPEFACE_IDS, input.typeface), input.typeface, DEFAULT_RECIPE.typeface);
  let contrast = pick('contrast', oneOf(CONTRAST_IDS, input.contrast), input.contrast, DEFAULT_RECIPE.contrast);
  // Recipe objects carry booleans; recipe JSON (§9.1) carries "focus"/"links": "neutral".
  const flag = (name: string, bool: unknown, word: unknown): boolean => {
    if (typeof bool === 'boolean') return bool;
    if (word === 'neutral') return false;
    if (word === 'accent') return true;
    if ((bool !== undefined && bool !== null) || (word !== undefined && word !== null)) dropped.push(name);
    return true;
  };
  const focusFollowsAccent = flag('focus', input.focusFollowsAccent, input.focus);
  const linksFollowAccent = flag('links', input.linksFollowAccent, input.links);

  if (corners === 'soft' && !availability.soft) { corners = DEFAULT_RECIPE.corners; dropped.push('corners'); }
  if (contrast === 'more' && !availability.contrastMore) { contrast = DEFAULT_RECIPE.contrast; dropped.push('contrast'); }
  if (accent !== 'ink' && !availability.chromatic) { accent = 'ink'; dropped.push('accent'); }
  if (!availability.chromatic && accentDark !== null) { accentDark = null; dropped.push('accentDark'); }
  if (neutrals === 'tinted' && !tintedAvailable(accent)) { neutrals = DEFAULT_RECIPE.neutrals; dropped.push('neutrals'); }

  const recipe: Recipe = Object.freeze({ v: 1, accent, accentDark, neutrals, corners, typeface, contrast, focusFollowsAccent, linksFollowAccent });
  return { recipe, dropped };
}

function normalizeAny(input: unknown, availability: Availability): Normalized {
  if (typeof input === 'string') {
    const text = input.trim();
    if (text.startsWith('{')) {
      try {
        return normalizeAny(JSON.parse(text), availability);
      } catch {
        return { recipe: DEFAULT_RECIPE, dropped: ['json'] };
      }
    }
    const decoded = decodeRecipe(text, availability);
    return decoded ? { recipe: decoded.recipe, dropped: decoded.partial ? ['code'] : [] } : { recipe: DEFAULT_RECIPE, dropped: ['code'] };
  }
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return { recipe: DEFAULT_RECIPE, dropped: input === undefined || input === null ? [] : ['input'] };
  return normalizeObject(input as Record<string, unknown>, availability, []);
}

/**
 * Any input → a valid, frozen Recipe. Accepts a Recipe, recipe JSON (§9.1, as an object or a string) or a
 * share code. Unknown or invalid values fall back to their defaults; options switched off in
 * `availability` (default AVAILABILITY) fall back too; Tinted falls back to Paper when the accent has no hue.
 * Never throws.
 */
export function normalizeRecipe(input: unknown, availability: Availability = AVAILABILITY): Recipe {
  return normalizeAny(input, availability).recipe;
}

/**
 * The recipe with fields that have no effect cleared: while the accent is Ink, the dark accent and the
 * focus and link switches do nothing, so they return to their defaults. Codes, JSON and comparisons use it.
 */
export function canonicalRecipe(recipe: Recipe): Recipe {
  if (recipe.accent !== 'ink' || (recipe.accentDark === null && recipe.focusFollowsAccent && recipe.linksFollowAccent)) return recipe;
  return Object.freeze({ ...recipe, accentDark: null, focusFollowsAccent: true, linksFollowAccent: true });
}

export function sameRecipe(a: Recipe, b: Recipe): boolean {
  const x = canonicalRecipe(a), y = canonicalRecipe(b);
  return x.accent === y.accent && x.accentDark === y.accentDark && x.neutrals === y.neutrals && x.corners === y.corners
    && x.typeface === y.typeface && x.contrast === y.contrast && x.focusFollowsAccent === y.focusFollowsAccent
    && x.linksFollowAccent === y.linksFollowAccent;
}

/** The preset this recipe matches exactly, or null ("Custom mix"). House matches the default recipe. */
export function matchPreset(recipe: Recipe): PresetId | null {
  for (const id of PRESET_IDS) if (sameRecipe(recipe, PRESETS[id].recipe)) return id;
  return null;
}

/**
 * The full share code (§9.2). Pairs in fixed order, defaults omitted. Corners are measured against Standard
 * (CODE_CORNERS), so every code issued before Round keeps its meaning: House (Round) is "v1.r-round" and a
 * bare "v1" is House with Standard corners.
 */
export function shareCode(recipe: Recipe): string {
  const r = canonicalRecipe(recipe);
  const pairs = ['v1'];
  if (r.accent !== 'ink') pairs.push(`a-${r.accent.startsWith('#') ? r.accent.slice(1) : r.accent}`);
  if (r.accentDark) pairs.push(`ad-${r.accentDark.slice(1)}`);
  if (r.neutrals !== 'paper') pairs.push(`n-${r.neutrals}`);
  if (r.corners !== CODE_CORNERS) pairs.push(`r-${r.corners}`);
  if (r.typeface !== 'inter') pairs.push(`f-${r.typeface}`);
  if (r.contrast !== 'standard') pairs.push(`c-${r.contrast}`);
  if (!r.focusFollowsAccent) pairs.push('fr-0');
  if (!r.linksFollowAccent) pairs.push('lk-0');
  return pairs.join('.');
}

/** The share code for a link's `?theme=` parameter: '' for the default recipe, otherwise `shareCode`. */
export function encodeRecipe(recipe: Recipe): string {
  return sameRecipe(recipe, DEFAULT_RECIPE) ? '' : shareCode(recipe);
}

/**
 * Reads a share code (or an unedited preset name such as "ledger"). '' is the default recipe; a code without
 * an `r-` pair has Standard corners, as it always had, so "v1" is House with Standard corners.
 * Unknown keys are ignored; an invalid or unavailable value falls back to its default and sets `partial`.
 * Returns null when the text is not a code at all. Never throws.
 */
export function decodeRecipe(code: string, availability: Availability = AVAILABILITY): { recipe: Recipe; partial: boolean } | null {
  if (typeof code !== 'string') return null;
  const text = code.trim().toLowerCase();
  if (text === '') return { recipe: DEFAULT_RECIPE, partial: false };
  const presetId = oneOf(PRESET_IDS, text);
  if (presetId) {
    const { recipe, dropped } = normalizeObject({ ...PRESETS[presetId].recipe }, availability, []);
    return { recipe, partial: dropped.length > 0 };
  }
  const [version, ...pairs] = text.split('.');
  if (version !== 'v1') return null;
  const fields: Record<string, unknown> = { corners: CODE_CORNERS };
  const invalid: string[] = [];
  for (const pair of pairs) {
    const dash = pair.indexOf('-');
    if (dash <= 0) continue; // not a key-value pair: unknown, ignored
    const key = pair.slice(0, dash);
    const value = pair.slice(dash + 1);
    switch (key) {
      case 'a': {
        const accent = readAccent(value);
        if (accent) fields.accent = accent;
        else invalid.push('accent');
        break;
      }
      case 'ad': {
        const hex = normalizeHex(value);
        if (hex) fields.accentDark = hex;
        else invalid.push('accentDark');
        break;
      }
      case 'n': if (oneOf(NEUTRAL_IDS, value)) fields.neutrals = value; else invalid.push('neutrals'); break;
      case 'r': if (oneOf(CORNER_IDS, value)) fields.corners = value; else invalid.push('corners'); break;
      case 'f': if (oneOf(TYPEFACE_IDS, value)) fields.typeface = value; else invalid.push('typeface'); break;
      case 'c': if (oneOf(CONTRAST_IDS, value)) fields.contrast = value; else invalid.push('contrast'); break;
      case 'fr': if (value === '0' || value === '1') fields.focusFollowsAccent = value === '1'; else invalid.push('focus'); break;
      case 'lk': if (value === '0' || value === '1') fields.linksFollowAccent = value === '1'; else invalid.push('links'); break;
      default: break; // unknown keys are ignored
    }
  }
  const { recipe, dropped } = normalizeObject(fields, availability, invalid);
  return { recipe, partial: dropped.length > 0 };
}

/**
 * Recipe JSON for storage and the Recipe export (§9.1): accent, neutrals, corners and typeface always;
 * accentDark, contrast, focus and links only when they differ from the defaults.
 */
export function recipeToJson(recipe: Recipe): string {
  const r = canonicalRecipe(recipe);
  const out: Record<string, string | number> = { otherstates: 1, accent: r.accent };
  if (r.accentDark) out.accentDark = r.accentDark;
  out.neutrals = r.neutrals;
  out.corners = r.corners;
  out.typeface = r.typeface;
  if (r.contrast !== 'standard') out.contrast = r.contrast;
  if (!r.focusFollowsAccent) out.focus = 'neutral';
  if (!r.linksFollowAccent) out.links = 'neutral';
  return JSON.stringify(out);
}
