// Base token values for the theme builder. Pure data, no DOM, no StyleX imports.
//
// BASE is a literal snapshot of `tokens.stylex.ts` (light) and `theme.ts` (dark overrides). The docs never
// use it: they read both files through Vite's `?raw` and call `baseFromSources`, so they cannot drift.
// Apps that theme at runtime use BASE (or pass their own base). `scripts/verify-theme.mjs` fails when this
// snapshot and the files disagree, so re-generate it whenever a token changes.
import type { BaseValues, TokenMap, TokenName } from './types.ts';

const LIGHT = {
  "--os-radius-xs": "4px",
  "--os-radius-sm": "6px",
  "--os-radius-md": "10px",
  "--os-radius-lg": "16px",
  "--os-radius-xl": "20px",
  "--os-radius-2xl": "24px",
  "--os-radius-full": "999px",
  "--os-radius-control": "9999px",
  "--os-radius-none": "0px",
  "--os-stroke": "1px",
  "--os-stroke-2": "2px",
  "--os-size-2xs": "16px",
  "--os-size-xs": "24px",
  "--os-size-sm": "32px",
  "--os-size-md": "40px",
  "--os-size-lg": "44px",
  "--os-size-xl": "48px",
  "--os-space-0-5": "2px",
  "--os-space-1": "4px",
  "--os-space-1-5": "6px",
  "--os-space-2": "8px",
  "--os-space-3": "12px",
  "--os-space-4": "16px",
  "--os-space-5": "20px",
  "--os-space-6": "24px",
  "--os-space-8": "32px",
  "--os-space-10": "40px",
  "--os-space-12": "48px",
  "--os-space-14": "56px",
  "--os-font-size-xs": "12px",
  "--os-font-size-caption": "13px",
  "--os-font-size-sm": "14px",
  "--os-font-size-md": "15px",
  "--os-font-size-body": "16px",
  "--os-font-size-lg": "18px",
  "--os-font-size-xl": "22px",
  "--os-font-size-2xl": "29px",
  "--os-line-height-xs": "16px",
  "--os-line-height-sm": "18px",
  "--os-line-height-md": "20px",
  "--os-line-height-lg": "24px",
  "--os-tracking-tight": "-0.01em",
  "--os-font-weight-regular": "400",
  "--os-font-weight-medium": "500",
  "--os-font-weight-semibold": "600",
  "--os-font-weight-bold": "700",
  "--os-font-family": "\"Inter Variable\", \"Inter\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
  "--os-color-fg-base": "#17181a",
  "--os-color-fg-muted": "#5c5b56",
  "--os-color-fg-subtle": "#6f6e68",
  "--os-color-fg-disabled": "#85847e",
  "--os-color-fg-on-contrast": "#fff",
  "--os-color-fg-static-dark": "#17181a",
  "--os-color-fg-static-light": "#fff",
  "--os-color-fg-link": "#17181a",
  "--os-color-focus-ring": "#17181a",
  "--os-color-bg-canvas": "#fff",
  "--os-color-bg-surface": "#fff",
  "--os-color-bg-subtle": "#f7f7f6",
  "--os-color-bg-muted": "#f1f1f0",
  "--os-color-bg-raised": "#ffffff",
  "--os-color-bg-elevated": "#ffffff",
  "--os-color-bg-interactive-primary": "#f1f1f0",
  "--os-color-bg-interactive-secondary": "#ecebe7",
  "--os-color-bg-interactive-tertiary": "#deddd8",
  "--os-color-bg-disabled": "#f1f1f0",
  "--os-color-bg-contrast": "#17181a",
  "--os-color-bg-overlay": "rgb(23 24 26 / .28)",
  "--os-color-border-subtle": "#e8e8e6",
  "--os-color-border-muted": "#d8d8d5",
  "--os-color-border-control": "#93928d",
  "--os-color-border-interactive-primary": "#85847e",
  "--os-color-border-disabled": "#e8e8e6",
  "--os-color-border-error": "#e46358",
  "--os-color-selection": "#0d99ff",
  "--os-color-accent-moderate": "#17181a",
  "--os-color-accent-bold": "#0e0f11",
  "--os-color-accent-strong": "#000",
  "--os-color-accent-intense": "#000",
  "--os-color-accent-on-accent": "#fff",
  "--os-color-accent-subtle": "#efefef",
  "--os-color-accent-muted": "#e2e2e2",
  "--os-color-accent-dim": "#d6d6d5",
  "--os-color-fg-error": "#c2352c",
  "--os-color-fg-danger": "#c2352c",
  "--os-color-bg-error": "#fff0ee",
  "--os-color-bg-error-contrast": "#c2352c",
  "--os-color-bg-danger-primary": "#f0443a",
  "--os-color-bg-danger-secondary": "#c2352c",
  "--os-color-bg-danger-tertiary": "#a32821",
  "--os-color-bg-notification": "#f0443a",
  "--os-color-fg-info": "#235cc1",
  "--os-color-bg-info": "#eef4ff",
  "--os-color-bg-info-contrast": "#235cc1",
  "--os-color-fg-success": "#15803d",
  "--os-color-bg-success": "#edf8f0",
  "--os-color-bg-success-contrast": "#15803d",
  "--os-color-chart-1": "#2a78d6",
  "--os-color-chart-2": "#eb6834",
  "--os-color-chart-3": "#1baf7a",
  "--os-color-chart-4": "#eda100",
  "--os-color-chart-5": "#e87ba4",
  "--os-color-fg-warning": "#92500d",
  "--os-color-bg-warning": "#fff6e8",
  "--os-color-bg-warning-contrast": "#bf771b",
  "--os-button-active-text": "#fff",
  "--os-focus-shadow": "0 0 0 3px rgb(13 153 255 / .24)",
  "--os-shadow-control": "0 1px 2px rgb(23 24 26 / .09), 0 0 0 .5px rgb(23 24 26 / .05)",
  "--os-shadow-popup": "0 2px 4px rgb(23 24 26 / .04), 0 8px 24px rgb(23 24 26 / .08), 0 0 0 .5px rgb(23 24 26 / .05)",
  "--os-motion-press": "120ms",
  "--os-motion-hover": "160ms",
  "--os-motion-popup": "220ms",
  "--os-motion-modal": "280ms",
  "--os-motion-sheet": "360ms",
  "--os-motion-layout": "420ms",
  "--os-motion-slow": "600ms",
  "--os-motion-spin": "800ms",
  "--os-ease-settle": "cubic-bezier(.22,1,.36,1)",
  "--os-ease-spring": "cubic-bezier(.24,1.34,.38,1)",
  "--os-ease-exit": "cubic-bezier(.4,0,1,1)",
  "--os-z-modal": "80",
  "--os-z-toast": "110",
  "--os-z-tooltip": "120",
  "--os-gradient-progress": "linear-gradient(90deg,#6b5cff,#e9388e 50%,#be6d00)",
} as const satisfies Record<TokenName, string>;

const DARK_OVERRIDES = {
  "--os-color-fg-base": "#fff",
  "--os-color-fg-muted": "#b4b4b4",
  "--os-color-fg-subtle": "#9a9a9a",
  "--os-color-fg-disabled": "#828282",
  "--os-color-fg-on-contrast": "#17181a",
  "--os-color-fg-link": "#fff",
  "--os-color-focus-ring": "#ffffff",
  "--os-color-bg-canvas": "#0a0a0a",
  "--os-color-bg-surface": "#0e0f11",
  "--os-color-bg-subtle": "#1a1a1a",
  "--os-color-bg-muted": "#202020",
  "--os-color-bg-raised": "#2a2a2b",
  "--os-color-bg-elevated": "#1c1c1e",
  "--os-color-bg-interactive-primary": "#303030",
  "--os-color-bg-interactive-secondary": "#393939",
  "--os-color-bg-interactive-tertiary": "#484848",
  "--os-color-bg-disabled": "#202020",
  "--os-color-bg-contrast": "#fff",
  "--os-color-bg-overlay": "rgb(0 0 0 / .6)",
  "--os-color-border-subtle": "#383838",
  "--os-color-border-muted": "#484848",
  "--os-color-border-control": "#6c6c6c",
  "--os-color-border-interactive-primary": "#828282",
  "--os-color-border-disabled": "#383838",
  "--os-color-border-error": "#d97066",
  "--os-color-accent-moderate": "#fff",
  "--os-color-accent-bold": "#f1f1f0",
  "--os-color-accent-strong": "#e7e7e5",
  "--os-color-accent-intense": "#ddd",
  "--os-color-accent-on-accent": "#17181a",
  "--os-color-accent-subtle": "#353535",
  "--os-color-accent-muted": "#434343",
  "--os-color-accent-dim": "#515151",
  "--os-color-fg-error": "#ff9c91",
  "--os-color-fg-danger": "#ff9b91",
  "--os-color-bg-error": "#3c2523",
  "--os-color-bg-error-contrast": "#b53229",
  "--os-color-bg-danger-primary": "#f0443a",
  "--os-color-bg-danger-secondary": "#b53229",
  "--os-color-bg-danger-tertiary": "#9a2b23",
  "--os-color-bg-notification": "#f0443a",
  "--os-color-fg-info": "#a6c9ff",
  "--os-color-bg-info": "#243146",
  "--os-color-bg-info-contrast": "#315e9e",
  "--os-color-fg-success": "#73d89a",
  "--os-color-bg-success": "#23372b",
  "--os-color-bg-success-contrast": "#267042",
  "--os-color-chart-1": "#3987e5",
  "--os-color-chart-2": "#d95926",
  "--os-color-chart-3": "#199e70",
  "--os-color-chart-4": "#c98500",
  "--os-color-chart-5": "#d55181",
  "--os-color-fg-warning": "#efc17f",
  "--os-color-bg-warning": "#3a3022",
  "--os-color-bg-warning-contrast": "#aa7628",
  "--os-button-active-text": "#17181a",
  "--os-focus-shadow": "0 0 0 3px rgb(58 169 255 / .38)",
  "--os-shadow-control": "0 1px 2px rgb(0 0 0 / .25), 0 0 0 1px rgb(255 255 255 / .08)",
  "--os-shadow-popup": "0 2px 4px rgb(0 0 0 / .16), 0 8px 24px rgb(0 0 0 / .28), 0 0 0 .5px rgb(255 255 255 / .06)",
} as const satisfies Record<TokenName, string>;


function freezeMap(entries: Iterable<readonly [string, string]>): TokenMap {
  const map: Record<TokenName, string> = {};
  for (const [name, value] of entries) map[name as TokenName] = value;
  return Object.freeze(map);
}

/** Every token of the contract, in contract order (the order of `tokens.stylex.ts`). */
export const TOKEN_NAMES: readonly TokenName[] = Object.freeze(Object.keys(LIGHT) as TokenName[]);

/** Literal snapshot of `tokens.stylex.ts` + `theme.ts`: complete light and dark maps, 124 tokens each. */
export const BASE: BaseValues = Object.freeze({
  light: freezeMap(Object.entries(LIGHT)),
  dark: freezeMap(Object.entries({ ...LIGHT, ...DARK_OVERRIDES })),
});

// ---------------------------------------------------------------------------------------------
// Source parsing

type Lexeme = { readonly kind: 'string'; readonly value: string } | { readonly kind: 'punct'; readonly value: string };

const SIMPLE_ESCAPES: Readonly<Record<string, string>> = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', v: '\v', '0': '\0' };

/** Reads a JS string literal starting at `start` (the opening quote). Returns its value and the index after it. */
function readString(src: string, start: number): { value: string; end: number } {
  const quote = src[start];
  let value = '';
  let i = start + 1;
  while (i < src.length) {
    const ch = src[i];
    if (ch === quote) return { value, end: i + 1 };
    if (ch === '\n' && quote !== '`') return { value, end: i }; // unterminated: stop at the line end
    if (ch === '\\') {
      const next = src[i + 1] ?? '';
      if (next === 'u') {
        const braced = /^\{([0-9a-fA-F]+)\}/.exec(src.slice(i + 2));
        if (braced) {
          value += String.fromCodePoint(parseInt(braced[1], 16));
          i += 3 + braced[0].length - 1;
          continue;
        }
        const four = src.slice(i + 2, i + 6);
        if (/^[0-9a-fA-F]{4}$/.test(four)) {
          value += String.fromCharCode(parseInt(four, 16));
          i += 6;
          continue;
        }
      }
      if (next === 'x' && /^[0-9a-fA-F]{2}$/.test(src.slice(i + 2, i + 4))) {
        value += String.fromCharCode(parseInt(src.slice(i + 2, i + 4), 16));
        i += 4;
        continue;
      }
      if (next === '\r' || next === '\n') { // line continuation
        i += next === '\r' && src[i + 2] === '\n' ? 3 : 2;
        continue;
      }
      value += SIMPLE_ESCAPES[next] ?? next;
      i += 2;
      continue;
    }
    value += ch;
    i += 1;
  }
  return { value, end: i };
}

/** Splits source into string literals and single punctuation characters, skipping comments and whitespace. */
function lex(src: string): Lexeme[] {
  const out: Lexeme[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i);
      i = nl === -1 ? src.length : nl + 1;
    } else if (ch === '/' && src[i + 1] === '*') {
      const close = src.indexOf('*/', i + 2);
      i = close === -1 ? src.length : close + 2;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      const { value, end } = readString(src, i);
      out.push({ kind: 'string', value });
      i = end;
    } else if (ch === ':' || ch === ',' || ch === '{' || ch === '}' || ch === '(' || ch === ')') {
      out.push({ kind: 'punct', value: ch });
      i += 1;
    } else {
      i += 1;
    }
  }
  return out;
}

const TOKEN_KEY = /^--os-[a-z0-9-]+$/;

/**
 * Reads every `"--os-x": "value"` entry from the text of a token file (`tokens.stylex.ts`, `theme.ts`, or a
 * reader's copy). Handles escaped quotes (the font stack), either quote style, and ignores entries inside
 * comments. A key that appears twice keeps its last value, as in a JS object literal.
 */
export function parseTokenSource(src: string): Partial<Record<TokenName, string>> {
  const out: Partial<Record<TokenName, string>> = {};
  if (typeof src !== 'string') return out;
  const lexemes = lex(src);
  for (let i = 0; i + 2 < lexemes.length; i++) {
    const key = lexemes[i], colon = lexemes[i + 1], value = lexemes[i + 2];
    if (key.kind === 'string' && TOKEN_KEY.test(key.value) && colon.kind === 'punct' && colon.value === ':' && value.kind === 'string') {
      out[key.value as TokenName] = value.value;
      i += 2;
    }
  }
  return out;
}

/**
 * Builds complete base maps from the text of `tokens.stylex.ts` and `theme.ts`. Light is the token file
 * (any contract token it lacks falls back to the BASE snapshot, so the maps stay complete); dark is light
 * merged with the theme file, which is what `stylex.createTheme` does. Key order: contract order, then
 * any token the file adds.
 */
export function baseFromSources(tokensSrc: string, themeSrc: string): BaseValues {
  const parsedLight = parseTokenSource(tokensSrc);
  const parsedDark = parseTokenSource(themeSrc);
  const light: Record<TokenName, string> = {};
  for (const name of TOKEN_NAMES) light[name] = parsedLight[name] ?? BASE.light[name];
  for (const [name, value] of Object.entries(parsedLight)) if (value !== undefined) light[name as TokenName] = value;
  const dark: Record<TokenName, string> = { ...light };
  for (const [name, value] of Object.entries(parsedDark)) if (value !== undefined) dark[name as TokenName] = value;
  return Object.freeze({ light: freezeMap(Object.entries(light)), dark: freezeMap(Object.entries(dark)) });
}

/** The tokens `theme.ts` lists, in file order (some repeat the light value on purpose). */
export const DARK_OVERRIDE_NAMES: readonly TokenName[] = Object.freeze(Object.keys(DARK_OVERRIDES) as TokenName[]);
