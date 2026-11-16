import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { ReactNode, RefObject } from 'react';
import { tokens } from '../../tokens.stylex';

// What the pages in this folder share: live token values, copy to clipboard, and a few small parts.
//
// Nothing on a foundations page is typed in by hand. The list of tokens comes from the contract
// itself (tokens.stylex.ts) and every value is read from the document with getComputedStyle, so a
// page shows the theme that is on screen and follows it when it changes.

/** Every token in the contract, in the order tokens.stylex.ts declares them. */
export const tokenNames: readonly string[] = Object.keys(tokens).filter(name => name.startsWith('--'));

export type TokenColor = {
  /** Six-digit hex: "#rrggbb". */
  hex: string;
  /** Red, green and blue, 0 to 255. */
  rgb: readonly [number, number, number];
  /** 0 to 1 */
  alpha: number;
  /** The hex, followed by " · 28%" (for example) when the color is translucent. */
  label: string;
};

export type TokenTable = {
  /** The token's value as the document resolves it: "6px", "120ms", a hex color. Empty when it is not set. */
  value: (name: string) => string;
  /** The token as a color, or null when its value is not one. */
  color: (name: string) => TokenColor | null;
  /** The token's value as a number of pixels or milliseconds, or null. */
  number: (name: string) => number | null;
};

// ---------- Following the theme ----------

// The theme is a set of classes on <html>; in development a token edit rewrites a <style> in <head>.
// Either one changes what the tokens resolve to.
let styleEdits = 0;

function subscribe(notify: () => void) {
  const root = new MutationObserver(notify);
  root.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-ui-theme', 'data-os-theme'] });
  const head = new MutationObserver(() => { styleEdits += 1; notify(); });
  head.observe(document.head, { childList: true, subtree: true, characterData: true });
  return () => { root.disconnect(); head.disconnect(); };
}

// A Customize recipe writes inline tokens and names itself in data-os-theme, so it counts too.
const themeKey = () => `${document.documentElement.className}|${document.documentElement.dataset.uiTheme ?? ''}|${document.documentElement.dataset.osTheme ?? ''}|${styleEdits}`;

/** Changes whenever the tokens may resolve to something new. Use it as a dependency. */
export function useThemeKey() {
  return useSyncExternalStore(subscribe, themeKey);
}

/** "light" or "dark": the theme the docs are showing. */
export function useThemeName() {
  useThemeKey();
  return document.documentElement.dataset.uiTheme === 'dark' ? 'dark' : 'light';
}

// ---------- Reading values ----------

const hex2 = (channel: number) => Math.round(Math.min(255, Math.max(0, channel))).toString(16).padStart(2, '0');

function parseColor(computed: string): TokenColor | null {
  // Browsers report a resolved color as rgb(), rgba() or color(srgb …).
  const rgb = computed.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
  const srgb = rgb ? null : computed.match(/^color\(srgb\s+([\d.e+-]+)\s+([\d.e+-]+)\s+([\d.e+-]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/);
  const match = rgb ?? srgb;
  if (!match) return null;
  const scale = rgb ? 1 : 255;
  const [red, green, blue] = [match[1], match[2], match[3]].map(part => Math.min(255, Math.max(0, Number(part) * scale)));
  const alphaText = match[4];
  const alpha = alphaText === undefined ? 1 : alphaText.endsWith('%') ? Number(alphaText.slice(0, -1)) / 100 : Number(alphaText);
  const hex = `#${hex2(red)}${hex2(green)}${hex2(blue)}`;
  return { hex, rgb: [red, green, blue], alpha, label: alpha < 1 ? `${hex} · ${Math.round(alpha * 100)}%` : hex };
}

// The build may minify a token's value: "120ms" becomes ".12s", and rgb(23 24 26 / .09) inside a
// shadow becomes #17181a17. Show them the way the contract writes them.
const alphaText = (byte: number) => String(Math.round((byte / 255) * 100) / 100).replace(/^0(?=\.)/, '');
function readable(value: string) {
  const seconds = value.match(/^(-?[\d.]+)s$/);
  if (seconds) return `${Math.round(Number(seconds[1]) * 1000)}ms`;
  // "-.01em" is written "-0.01em" in the contract.
  const bare = value.match(/^(-?)\.(\d+)([a-z%]*)$/);
  if (bare) return `${bare[1]}0.${bare[2]}${bare[3]}`;
  return value.replace(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})\b/gi, (_, r, g, b, a) =>
    `rgb(${parseInt(r, 16)} ${parseInt(g, 16)} ${parseInt(b, 16)} / ${alphaText(parseInt(a, 16))})`);
}

function readTable(): TokenTable {
  const style = getComputedStyle(document.documentElement);
  const values = new Map<string, string>();
  const colors = new Map<string, TokenColor | null>();
  // A probe resolves any color syntax (hex, rgb, a mix of other tokens) to one form.
  const probe = document.createElement('span');
  probe.style.display = 'none';
  document.body.append(probe);
  for (const name of tokenNames) {
    const value = readable(style.getPropertyValue(name).trim());
    values.set(name, value);
    if (value && CSS.supports('color', value)) {
      probe.style.color = `var(${name})`;
      colors.set(name, parseColor(getComputedStyle(probe).color));
    } else {
      colors.set(name, null);
    }
  }
  probe.remove();

  return {
    value: name => values.get(name) ?? '',
    color: name => colors.get(name) ?? null,
    number: name => {
      const parsed = parseFloat(values.get(name) ?? '');
      return Number.isFinite(parsed) ? parsed : null;
    },
  };
}

let cache: { key: string; table: TokenTable } | undefined;

/** The current value of every token. Re-renders the caller when the theme changes. */
export function useTokens(): TokenTable {
  const key = useThemeKey();
  if (cache?.key !== key) cache = { key, table: readTable() };
  return cache.table;
}

/** "calc(20px - 8px)" has no single computed value on a custom property; this resolves a length through an element. */
export function resolveLength(expression: string): number | null {
  const probe = document.createElement('span');
  probe.style.cssText = `position:absolute;visibility:hidden;width:${expression}`;
  document.body.append(probe);
  const width = parseFloat(getComputedStyle(probe).width);
  probe.remove();
  return Number.isFinite(width) ? width : null;
}

/** WCAG contrast between two opaque colors: 1 to 21. A translucent color is laid over the second one first. */
export function contrastRatio(foreground: TokenColor, background: TokenColor) {
  const over = foreground.rgb.map((channel, i) => channel * foreground.alpha + background.rgb[i] * (1 - foreground.alpha));
  const luminance = (rgb: readonly number[]) => {
    const [r, g, b] = rgb.map(channel => {
      const c = channel / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [light, dark] = [luminance(over), luminance(background.rgb)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

/** A measured length for display: 40 → "40px", 20.5 → "20.5px", null → "–". */
export const px = (value: number | null) => (value === null ? '–' : `${Math.round(value * 100) / 100}px`);

/** The size of an element's border box, kept up to date. */
export function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const box = element.getBoundingClientRect();
      setSize(current => (current && current.width === box.width && current.height === box.height ? current : { width: box.width, height: box.height }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

// ---------- Copy ----------

function legacyCopy(text: string) {
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
  document.body.append(field);
  field.select();
  let done = false;
  try { done = document.execCommand('copy'); } catch { /* Nothing more to try. */ }
  field.remove();
  return done;
}

/** Copies text and remembers which key was copied for a moment, so the control can say so. */
export function useCopy(resetAfter = 1400) {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(async (text: string, key: string = text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // No clipboard permission (an insecure origin, an embedded frame).
      if (!legacyCopy(text)) return;
    }
    setCopied(key);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(null), resetAfter);
  }, [resetAfter]);

  return { copied, copy };
}

/** A token's name as a button: click to copy it. The width holds while it says "Copied". */
export function TokenName({ name }: { name: string }) {
  const { copied, copy } = useCopy();
  const done = copied !== null;
  return (
    <span className="pg-token-wrap">
      <button type="button" className="pg-token" data-copied={done || undefined} aria-label={`Copy ${name}`} onClick={() => copy(name)}>
        <span className="pg-token-text">{name}</span>
        <span className="pg-token-done" aria-hidden="true">Copied</span>
      </button>
      <span className="docs-sr" role="status">{done ? `Copied ${name}.` : ''}</span>
    </span>
  );
}

// ---------- Small parts ----------

/** A token's short key: "--os-radius-md" is "md" under the prefix "--os-radius-". */
export const shortName = (name: string, prefix: string) => (name.startsWith(prefix) ? name.slice(prefix.length) : name);

/** Tokens whose names start with a prefix, in declared order. */
export const tokensWithPrefix = (prefix: string) => tokenNames.filter(name => name.startsWith(prefix));

/**
 * Tokens whose names start with a prefix, smallest value first, so a step added anywhere in the
 * contract lands in its place on the scale. Values that are not numbers go last, in declared order.
 */
export function tokensByValue(prefix: string, values: TokenTable) {
  const rank = (name: string) => values.number(name) ?? Number.POSITIVE_INFINITY;
  return tokensWithPrefix(prefix)
    .map((name, index) => ({ name, index }))
    .sort((a, b) => rank(a.name) - rank(b.name) || a.index - b.index)
    .map(entry => entry.name);
}

/** True while the reader's system asks for less motion. */
export function useReducedMotion() {
  return useSyncExternalStore(
    notify => {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      media.addEventListener('change', notify);
      return () => media.removeEventListener('change', notify);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
}

type SpecimenProps = {
  /** The screenshot harness crops each specimen by this name. */
  id?: string;
  children: ReactNode;
  align?: 'center' | 'start' | 'stretch';
  className?: string;
  /** Names the specimen for assistive tech when it holds controls. */
  label?: string;
};

/** A quiet panel for a live specimen. Prose styles stop at its edge. */
export function Specimen({ id, children, align = 'center', className, label }: SpecimenProps) {
  return (
    <div
      className={className ? `pg-specimen ${className}` : 'pg-specimen'}
      data-docs-raw=""
      data-example={id}
      data-align={align}
      role={label ? 'group' : undefined}
      aria-label={label}
    >
      {children}
    </div>
  );
}

/** A small label above a value: "Value", "Use for". */
export function Caption({ children }: { children: ReactNode }) {
  return <span className="pg-caption">{children}</span>;
}
