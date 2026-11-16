// DOM runtime: writes a derived theme as inline custom properties. No React, no StyleX.
// Inline properties on <html> beat both unlayered StyleX theme rules and reach every portal in <body> (§6.4).
import type { DerivedTheme, Scheme, TokenName } from './types.ts';

export type ApplyOptions = {
  readonly scheme: Scheme;
  /** Default `document.documentElement`. */
  readonly target?: HTMLElement;
  /** Write all 124 tokens instead of the 45 owned ones (needed when the target is not <html>). */
  readonly complete?: boolean;
};

/** The scheme's owned tokens (or every token with `complete`) as a custom-property map. */
export function toInlineStyle(theme: DerivedTheme, scheme: Scheme, options: { complete?: boolean } = {}): Record<TokenName, string> {
  const map = theme[scheme];
  const names = options.complete ? (Object.keys(map) as TokenName[]) : theme.owned;
  const out: Record<TokenName, string> = {};
  for (const name of names) if (map[name] !== undefined) out[name] = map[name];
  return out;
}

type TargetState = {
  /** Generation of the latest call on this target; a cleanup only acts while its generation is current. */
  generation: number;
  /** What this module wrote, by name. */
  written: Map<TokenName, string>;
  /** Inline values that were there before this module first wrote a name (restored on cleanup). */
  prior: Map<TokenName, string>;
  /** `data-os-theme` before the first call, or null when absent. */
  priorAttr: string | null | undefined;
};

const states = new WeakMap<HTMLElement, TargetState>();

function stateOf(target: HTMLElement): TargetState {
  let state = states.get(target);
  if (!state) {
    state = { generation: 0, written: new Map(), prior: new Map(), priorAttr: undefined };
    states.set(target, state);
  }
  return state;
}

/** Removes every property this module wrote on the target, restoring earlier inline values and the attribute. */
function restore(target: HTMLElement, state: TargetState): void {
  for (const name of state.written.keys()) {
    const before = state.prior.get(name);
    if (before !== undefined) target.style.setProperty(name, before);
    else target.style.removeProperty(name);
  }
  state.written.clear();
  state.prior.clear();
  if (state.priorAttr !== undefined) {
    if (state.priorAttr === null) delete target.dataset.osTheme;
    else target.dataset.osTheme = state.priorAttr;
    state.priorAttr = undefined;
  }
}

const noop = () => {};

/**
 * Writes the scheme's owned tokens (or all 124 with `complete`) as inline custom properties on the target
 * (default `document.documentElement`) and sets `data-os-theme="<code>|<scheme>"`, which the foundations
 * pages observe. Only changed values are written; names written earlier and absent now are removed; other
 * inline styles are never touched. `null` or an identity theme (without `complete`) removes this module's
 * writes. Returns a cleanup that undoes the writes, but only while no later call has written to the same
 * target, so React StrictMode's double effects are safe.
 *
 *   useLayoutEffect(() => applyTheme(theme, { scheme }), [theme, scheme]);
 */
export function applyTheme(theme: DerivedTheme | null, options: ApplyOptions): () => void {
  if (typeof document === 'undefined') return noop;
  const target = options.target ?? document.documentElement;
  if (!target) return noop;
  const state = stateOf(target);
  const generation = ++state.generation;

  if (theme === null || (theme.identity && !options.complete)) {
    restore(target, state);
    return noop;
  }

  const next = toInlineStyle(theme, options.scheme, { complete: options.complete });
  for (const name of [...state.written.keys()]) {
    if (name in next) continue;
    const before = state.prior.get(name);
    if (before !== undefined) target.style.setProperty(name, before);
    else target.style.removeProperty(name);
    state.written.delete(name);
    state.prior.delete(name);
  }
  for (const [key, value] of Object.entries(next)) {
    const name = key as TokenName;
    if (state.written.get(name) === value) continue;
    if (!state.written.has(name)) {
      const before = target.style.getPropertyValue(name);
      if (before !== '') state.prior.set(name, before);
    }
    target.style.setProperty(name, value);
    state.written.set(name, value);
  }
  if (state.priorAttr === undefined) state.priorAttr = target.dataset.osTheme ?? null;
  target.dataset.osTheme = `${theme.code}|${options.scheme}`;

  return () => {
    if (state.generation !== generation) return; // a later call owns the target now
    state.generation++;
    restore(target, state);
  };
}
