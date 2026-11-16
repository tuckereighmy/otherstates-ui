// The audit: one data row per rule. The docs table, the exports and the verifier all read RULES.
// Pure: no DOM, no React, no StyleX. Every check runs on the final 8-bit strings.
import { contrast, contrastOfLuminances, deltaE, mixSrgb, relLum } from './color.ts';
import { ROUND_CONTROL } from './recipe.ts';
import type { AuditKind, AuditRef, AuditResult, AuditRow, AuditRule, DerivedTheme, Scheme, TokenMap, TokenName } from './types.ts';

const t = (name: string): TokenName => `--os-${name}`;
const c = (name: string): TokenName => `--os-color-${name}`;

const rules: AuditRule[] = [];

function short(ref: AuditRef): string {
  return ref.startsWith('--os-color-') ? ref.slice(11) : ref.startsWith('--os-') ? ref.slice(5) : ref;
}

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

type Extra = Pick<AuditRule, 'whenInk' | 'finding'>;

function add(group: string, scheme: AuditRule['scheme'], kind: AuditKind, fg: AuditRef, bgs: readonly AuditRef[], min: number, extra: Extra = {}): void {
  for (const bg of bgs) rules.push(Object.freeze({ id: `${slug(group)}.${short(fg)}.${short(bg)}`, group, scheme, fg, bg, min, kind, ...extra }));
}

// Text (4.5:1).
add('Primary text', 'light', 'contrast', c('fg-base'), [c('bg-canvas'), c('bg-subtle'), c('bg-muted'), c('bg-elevated')], 4.5);
add('Primary text', 'dark', 'contrast', c('fg-base'), [c('bg-canvas'), c('bg-surface'), c('bg-subtle'), c('bg-elevated')], 4.5);
add('Secondary text', 'light', 'contrast', c('fg-muted'), [c('bg-canvas'), c('bg-subtle'), c('bg-muted'), c('bg-elevated'), c('bg-interactive-primary')], 4.5);
add('Secondary text', 'dark', 'contrast', c('fg-muted'), [c('bg-canvas'), c('bg-surface'), c('bg-subtle'), c('bg-elevated'), c('bg-interactive-primary')], 4.5);
add('Tertiary text', 'light', 'contrast', c('fg-subtle'), [c('bg-canvas'), c('bg-subtle'), c('bg-muted'), c('bg-elevated')], 4.5);
add('Tertiary text', 'dark', 'contrast', c('fg-subtle'), [c('bg-canvas'), c('bg-surface'), c('bg-subtle'), c('bg-elevated')], 4.5);
add('Text on quiet fills', 'both', 'contrast', c('fg-base'), [c('accent-subtle'), c('accent-muted'), c('accent-dim'), c('bg-interactive-tertiary')], 4.5);
add('Links and accent text', 'both', 'contrast', c('fg-link'), [c('bg-canvas'), c('bg-subtle'), c('bg-elevated')], 4.5);
add('Links and accent text', 'both', 'contrast', c('accent-bold'), [c('bg-canvas'), c('bg-subtle'), c('bg-elevated'), c('accent-subtle'), c('accent-muted')], 4.5);
add('Text on primary', 'both', 'contrast', c('accent-on-accent'), [c('accent-moderate'), c('accent-bold'), c('accent-strong')], 4.5);
// State boundaries (3:1).
add('Primary as a state fill', 'both', 'contrast', c('accent-moderate'), [c('bg-canvas'), c('bg-surface'), c('bg-subtle'), c('bg-muted'), c('bg-elevated')], 3);
add('Focus ring', 'both', 'contrast', c('focus-ring'), [c('bg-canvas'), c('bg-subtle'), c('bg-muted'), c('bg-elevated'), c('bg-raised')], 3);
add('Selection rings', 'both', 'contrast', c('border-control'), [c('bg-canvas'), c('bg-surface'), c('bg-elevated')], 3);
add('Contrast fill', 'both', 'contrast', c('fg-on-contrast'), [c('bg-contrast')], 4.5);
// Dark edges: regression floors under the shipped 1.45 and 1.14.
add('Dark edges', 'dark', 'edge', c('border-subtle'), [c('bg-elevated')], 1.4);
add('Dark edges', 'dark', 'edge', c('bg-raised'), [c('bg-muted')], 1.12);
// Surface order: each level strictly further toward the text color than the one before.
const LIGHT_ORDER = ['bg-canvas', 'bg-subtle', 'bg-muted', 'bg-interactive-secondary', 'bg-interactive-tertiary'];
const DARK_ORDER = ['bg-canvas', 'bg-surface', 'bg-subtle', 'bg-elevated', 'bg-muted', 'bg-raised', 'bg-interactive-primary', 'bg-interactive-secondary', 'bg-interactive-tertiary'];
for (let i = 1; i < LIGHT_ORDER.length; i++) add('Surface order', 'light', 'order', c(LIGHT_ORDER[i]), [c(LIGHT_ORDER[i - 1])], 1);
for (let i = 1; i < DARK_ORDER.length; i++) add('Surface order', 'dark', 'order', c(DARK_ORDER[i]), [c(DARK_ORDER[i - 1])], 1);
// Chromatic accents only.
add('Accent steps', 'both', 'distinct', c('accent-bold'), [c('accent-moderate')], 0.03, { whenInk: 'skip' });
add('Accent steps', 'both', 'distinct', c('accent-strong'), [c('accent-bold')], 0.03, { whenInk: 'skip' });
add('Progress fill', 'both', 'contrast', 'progress-stop-1', ['progress-track'], 3, { whenInk: 'finding' });
add('Progress fill', 'both', 'contrast', 'progress-stop-2', ['progress-track'], 3, { whenInk: 'finding' });
add('Progress fill', 'both', 'contrast', 'progress-stop-3', ['progress-track'], 3, { whenInk: 'finding' });
add('Corners', 'both', 'corners', t('radius-lg'), [t('radius-md')], 1);
// Shipped status pairs (spec 1.7: ≥4.6 light, ≥7.0 dark on their tint). Listed, never gating.
for (const status of ['error', 'info', 'success', 'warning']) {
  add('Status text (shipped)', 'light', 'contrast', c(`fg-${status}`), [c(`bg-${status}`)], 4.6, { finding: true });
  add('Status text (shipped)', 'dark', 'contrast', c(`fg-${status}`), [c(`bg-${status}`)], 7, { finding: true });
}
add('Status fills (shipped)', 'both', 'contrast', c('fg-static-light'), [c('bg-danger-secondary')], 4.5, { finding: true });
add('Status fills (shipped)', 'dark', 'contrast', c('fg-static-dark'), [c('bg-warning-contrast')], 4.5, { finding: true });

export const RULES: readonly AuditRule[] = Object.freeze(rules);

/** Whether a rule is checked in this scheme. */
export function ruleApplies(rule: AuditRule, scheme: Scheme): boolean {
  return rule.scheme === 'both' || rule.scheme === scheme;
}

const HEXISH = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi;

/** The Progress track a gradient stop sits on: `color-mix(in srgb, fg-base 12%, bg-surface)`. */
export function progressTrack(map: TokenMap): string {
  return mixSrgb(map[c('fg-base')], map[c('bg-surface')], 0.12);
}

/** The color stops of a `linear-gradient(…)` string, in order. */
export function gradientStops(value: string): string[] {
  return typeof value === 'string' ? value.match(HEXISH) ?? [] : [];
}

/** The value an audit reference resolves to in a map (undefined when missing). */
export function resolveRef(ref: AuditRef, map: TokenMap): string | undefined {
  if (ref === 'progress-track') return progressTrack(map);
  if (ref.startsWith('progress-stop-')) return gradientStops(map[t('gradient-progress')])[Number(ref.slice(14)) - 1];
  return map[ref as TokenName];
}

function px(value: string | undefined): number {
  return value !== undefined && /^-?\d+(\.\d+)?px$/.test(value.trim()) ? parseFloat(value) : NaN;
}

/** The corner ladder in a map: xs, sm, md, lg, xl, 2xl and control, in px. */
export function ladderOf(map: TokenMap): number[] {
  return ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'control'].map(step => px(map[t(`radius-${step}`)]));
}

/**
 * Ladder invariants: lg = md + 6, xl = lg + 4, 2xl = xl + 4, sm = clamp(md − 4, 2, 6),
 * xs = min(4, sm), integers, non-decreasing. The seventh step, control, equals md in a rect ladder, where
 * lg = control + 6 (tracks, Group shells) and xl = control + 10; Round sets it to at least 9999 (pills).
 * Returns one message per broken invariant; [] when valid.
 */
export function checkCorners(ladder: readonly number[]): string[] {
  const errors: string[] = [];
  if (ladder.length !== 7) return ['A corner ladder has seven steps: xs, sm, md, lg, xl, 2xl and control.'];
  const [xs, sm, md, lg, xl, x2, control] = ladder;
  if (!ladder.every(n => Number.isInteger(n) && n >= 0)) errors.push('Every step is a whole number of pixels.');
  for (let i = 1; i < 6; i++) if (!(ladder[i] >= ladder[i - 1])) { errors.push('Steps never get smaller.'); break; }
  if (control < ROUND_CONTROL) {
    if (control !== md) errors.push('control = md, or at least 9999 for round controls.');
    if (lg !== control + 6) errors.push('lg = control + 6, so tracks and Group shells stay concentric.');
    if (xl !== control + 10) errors.push('xl = control + 10.');
  }
  if (lg !== md + 6) errors.push('lg = md + 6, so popup items (lg − 6) equal md.');
  if (xl !== lg + 4) errors.push('xl = lg + 4.');
  if (x2 !== xl + 4) errors.push('2xl = xl + 4.');
  if (sm !== Math.min(6, Math.max(2, md - 4))) errors.push('sm = md − 4, between 2 and 6.');
  if (xs !== Math.min(4, sm)) errors.push('xs = min(4, sm).');
  return errors;
}

/** The measured value of one rule against a complete map (see AuditRow.value). NaN when unmeasurable. */
export function measureRule(rule: AuditRule, map: TokenMap, scheme: Scheme): number {
  if (rule.kind === 'corners') return checkCorners(ladderOf(map)).length === 0 ? 1 : 0;
  const fg = resolveRef(rule.fg, map), bg = resolveRef(rule.bg, map);
  if (fg === undefined || bg === undefined) return NaN;
  if (rule.kind === 'distinct') return deltaE(fg, bg);
  if (rule.kind === 'order') {
    const yf = relLum(fg), yb = relLum(bg);
    const ratio = contrastOfLuminances(yf, yb);
    const right = scheme === 'light' ? yf < yb : yf > yb;
    return right ? ratio : 1 / ratio;
  }
  return contrast(fg, bg);
}

function labelOf(rule: AuditRule): string {
  const fg = short(rule.fg), bg = short(rule.bg);
  switch (rule.kind) {
    case 'contrast': return rule.min >= 4.5 ? `${fg} on ${bg}` : `${fg} against ${bg}`;
    case 'edge': return `${fg} against ${bg}`;
    case 'order': return `${bg} → ${fg}`;
    case 'distinct': return `${bg} → ${fg}`;
    case 'corners': return 'Corner ladder';
  }
}

/**
 * Runs every rule for one scheme. `ink` (the Ink accent) skips the accent-step rules and turns the
 * progress gradient into a finding. Shipped findings are listed with `gating: false`; `ok` ignores them.
 */
export function auditTokens(map: TokenMap, scheme: Scheme, options: { ink?: boolean } = {}): AuditResult {
  const rows: AuditRow[] = [];
  for (const rule of RULES) {
    if (!ruleApplies(rule, scheme)) continue;
    if (options.ink && rule.whenInk === 'skip') continue;
    const value = measureRule(rule, map, scheme);
    const ok = rule.kind === 'order' ? value > rule.min : value >= rule.min;
    const gating = !rule.finding && !(options.ink && rule.whenInk === 'finding');
    rows.push({ id: rule.id, group: rule.group, scheme, label: labelOf(rule), gating, value, min: rule.min, ok });
  }
  return { ok: rows.every(row => !row.gating || row.ok), rows };
}

/** The worst row of each group per scheme (lowest value ÷ min), in rule order. */
export function summarize(theme: DerivedTheme): { group: string; light: AuditRow | null; dark: AuditRow | null }[] {
  const groups: string[] = [];
  for (const rule of RULES) if (!groups.includes(rule.group)) groups.push(rule.group);
  const worst = (rows: readonly AuditRow[], group: string): AuditRow | null => {
    let pick: AuditRow | null = null;
    for (const row of rows) {
      if (row.group !== group) continue;
      const score = Number.isNaN(row.value) ? -Infinity : row.value / row.min;
      const best = pick === null ? Infinity : Number.isNaN(pick.value) ? -Infinity : pick.value / pick.min;
      if (pick === null || score < best) pick = row;
    }
    return pick;
  };
  return groups
    .map(group => ({ group, light: worst(theme.audit.light.rows, group), dark: worst(theme.audit.dark.rows, group) }))
    .filter(entry => entry.light !== null || entry.dark !== null);
}
