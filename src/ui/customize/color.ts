// Color math for the theme builder. Pure functions, no dependencies.
// Implemented from the public formulas: the sRGB transfer function (IEC 61966-2-1), Björn Ottosson's
// OKLab matrices (as used by CSS Color 4) and WCAG 2.x relative luminance and contrast ratio.
import type { HexColor } from './types.ts';

/** Gamma-encoded sRGB channels in 0..1 plus alpha in 0..1. */
export type Rgba = { readonly r: number; readonly g: number; readonly b: number; readonly a: number };
export type Oklab = readonly [L: number, a: number, b: number];
/** h is null when the color has no hue (C < 1e-4). */
export type Oklch = readonly [L: number, C: number, h: number | null];

// ---------------------------------------------------------------------------------------------
// sRGB transfer

/** Gamma-encoded channel (0..1) to linear light. */
export function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Linear light to gamma-encoded channel. */
export function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

// Linear value of every 8-bit code, so luminance of a hex string needs no pow at all.
const LINEAR_8BIT: readonly number[] = Array.from({ length: 256 }, (_, i) => srgbToLinear(i / 255));

// ---------------------------------------------------------------------------------------------
// Parsing and formatting

const HEX_DIGITS = /^[0-9a-f]+$/;

/** `#abc`, `abc`, `#aabbcc` or `aabbcc` (any case, surrounding space allowed) → lowercase `#aabbcc`; else null. */
export function normalizeHex(input: string): HexColor | null {
  if (typeof input !== 'string') return null;
  let s = input.trim().toLowerCase();
  if (s.startsWith('#')) s = s.slice(1);
  if (!HEX_DIGITS.test(s)) return null;
  if (s.length === 3) return `#${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`;
  if (s.length === 6) return `#${s}`;
  return null;
}

function byte(hex: string, at: number): number {
  return parseInt(hex.slice(at, at + 2), 16);
}

const RGB_FUNCTION = /^rgba?\(\s*([^)]*)\)$/;

function parseChannel(token: string): number {
  if (token.endsWith('%')) return (parseFloat(token) / 100) * 255;
  return parseFloat(token);
}

function parseAlpha(token: string | undefined): number {
  if (token === undefined) return 1;
  const value = token.endsWith('%') ? parseFloat(token) / 100 : parseFloat(token);
  return Math.min(1, Math.max(0, value));
}

/**
 * Parses `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, `rgb()` / `rgba()` (space or comma syntax, optional
 * alpha) and `transparent`. Returns null for anything else (gradients, shadows, keywords).
 */
export function parseColor(value: string): Rgba | null {
  if (typeof value !== 'string') return null;
  const s = value.trim().toLowerCase();
  if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (s.startsWith('#')) {
    const h = s.slice(1);
    if (!HEX_DIGITS.test(h)) return null;
    if (h.length === 3 || h.length === 4) {
      const d = (i: number) => parseInt(h[i] + h[i], 16) / 255;
      return { r: d(0), g: d(1), b: d(2), a: h.length === 4 ? d(3) : 1 };
    }
    if (h.length === 6 || h.length === 8) {
      return { r: byte(h, 0) / 255, g: byte(h, 2) / 255, b: byte(h, 4) / 255, a: h.length === 8 ? byte(h, 6) / 255 : 1 };
    }
    return null;
  }
  const fn = RGB_FUNCTION.exec(s);
  if (!fn) return null;
  const body = fn[1].trim();
  let parts: string[];
  let alpha: string | undefined;
  if (body.includes(',')) {
    parts = body.split(',').map(p => p.trim());
    if (parts.length === 4) alpha = parts.pop();
  } else {
    const [channels, a] = body.split('/');
    parts = channels.trim().split(/\s+/);
    alpha = a?.trim();
  }
  if (parts.length !== 3) return null;
  const [r, g, b] = parts.map(parseChannel);
  const a = parseAlpha(alpha);
  if (![r, g, b, a].every(Number.isFinite)) return null;
  const unit = (c: number) => Math.min(1, Math.max(0, c / 255));
  return { r: unit(r), g: unit(g), b: unit(b), a };
}

/** Clamps each 0..1 channel, rounds to 8 bits and formats lowercase `#rrggbb`. */
export function rgbToHex(r: number, g: number, b: number): HexColor {
  const part = (c: number) => {
    const n = Math.round(Math.min(1, Math.max(0, Number.isFinite(c) ? c : 0)) * 255);
    return (n < 16 ? '0' : '') + n.toString(16);
  };
  return `#${part(r)}${part(g)}${part(b)}`;
}

/** The color's 8-bit channels as "R G B", for `rgb(R G B / a)` strings. Null if unparseable. */
export function rgbChannels(color: string): string | null {
  const c = parseColor(color);
  if (!c) return null;
  return [c.r, c.g, c.b].map(v => Math.round(v * 255)).join(' ');
}

// ---------------------------------------------------------------------------------------------
// WCAG 2.x luminance and contrast

function luminanceOf(r: number, g: number, b: number): number {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/** WCAG relative luminance Y (alpha ignored). NaN when the color cannot be parsed. */
export function relLum(color: string): number {
  // Fast path for the canonical form every derived value uses.
  if (color.length === 7 && color.charCodeAt(0) === 35) {
    const r = byte(color, 1), g = byte(color, 3), b = byte(color, 5);
    if (r >= 0 && g >= 0 && b >= 0) return 0.2126 * LINEAR_8BIT[r] + 0.7152 * LINEAR_8BIT[g] + 0.0722 * LINEAR_8BIT[b];
  }
  const c = parseColor(color);
  return c ? luminanceOf(c.r, c.g, c.b) : NaN;
}

/** Contrast ratio of two luminances, lighter on top. */
export function contrastOfLuminances(y1: number, y2: number): number {
  return y1 >= y2 ? (y1 + 0.05) / (y2 + 0.05) : (y2 + 0.05) / (y1 + 0.05);
}

/**
 * WCAG 2.x contrast ratio. A translucent foreground is composited over the background first (in
 * gamma-encoded sRGB, as browsers paint it). The background's own alpha is ignored. NaN if unparseable.
 */
export function contrast(fg: string, bg: string): number {
  const f = parseColor(fg);
  const b = parseColor(bg);
  if (!f || !b) return NaN;
  const yb = luminanceOf(b.r, b.g, b.b);
  const over = (cf: number, cb: number) => cf * f.a + cb * (1 - f.a);
  const yf = f.a >= 1 ? luminanceOf(f.r, f.g, f.b) : luminanceOf(over(f.r, b.r), over(f.g, b.g), over(f.b, b.b));
  return contrastOfLuminances(yf, yb);
}

// ---------------------------------------------------------------------------------------------
// OKLab / OKLCH

function linearToOklab(r: number, g: number, b: number): Oklab {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToLinear(L: number, a: number, b: number): [number, number, number] {
  const l = L + 0.3963377774 * a + 0.2158037573 * b;
  const m = L - 0.1055613458 * a - 0.0638541728 * b;
  const s = L - 0.0894841775 * a - 1.291485548 * b;
  const l3 = l * l * l, m3 = m * m * m, s3 = s * s * s;
  return [
    4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
  ];
}

/** OKLab of a color (alpha ignored). NaNs when unparseable. */
export function toOklab(color: string): Oklab {
  const c = parseColor(color);
  if (!c) return [NaN, NaN, NaN];
  return linearToOklab(srgbToLinear(c.r), srgbToLinear(c.g), srgbToLinear(c.b));
}

/** OKLCH of a color, h in degrees [0, 360), or null when C < 1e-4. */
export function toOklch(color: string): Oklch {
  const [L, a, b] = toOklab(color);
  const C = Math.sqrt(a * a + b * b);
  if (!(C >= 1e-4)) return [L, Number.isFinite(C) ? C : NaN, null];
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return [L, C, h];
}

/** ΔE_OK: Euclidean distance in OKLab. */
export function deltaE(x: string, y: string): number {
  const p = toOklab(x), q = toOklab(y);
  const dL = p[0] - q[0], da = p[1] - q[1], db = p[2] - q[2];
  return Math.sqrt(dL * dL + da * da + db * db);
}

// ---------------------------------------------------------------------------------------------
// Gamut mapping and luminance targeting

const GAMUT_EPSILON = 1e-6;

function inGamut(rgb: readonly [number, number, number]): boolean {
  return rgb[0] >= -GAMUT_EPSILON && rgb[0] <= 1 + GAMUT_EPSILON
    && rgb[1] >= -GAMUT_EPSILON && rgb[1] <= 1 + GAMUT_EPSILON
    && rgb[2] >= -GAMUT_EPSILON && rgb[2] <= 1 + GAMUT_EPSILON;
}

/**
 * OKLCH → 8-bit hex. Holds L and h; when the color is outside sRGB, bisects C over [0, C] for 30
 * iterations and keeps the largest in-gamut chroma. L ≥ 1 → white, L ≤ 0 → black.
 */
export function gamut(L: number, C: number, h: number): HexColor {
  if (!Number.isFinite(L) || L <= 0) return '#000000';
  if (L >= 1) return '#ffffff';
  const chroma = Number.isFinite(C) && C > 0 ? C : 0;
  const rad = ((Number.isFinite(h) ? h : 0) * Math.PI) / 180;
  const cos = Math.cos(rad), sin = Math.sin(rad);
  let rgb = oklabToLinear(L, chroma * cos, chroma * sin);
  if (!inGamut(rgb)) {
    let lo = 0, hi = chroma;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklabToLinear(L, mid * cos, mid * sin))) lo = mid;
      else hi = mid;
    }
    rgb = oklabToLinear(L, lo * cos, lo * sin);
  }
  const clamp = (c: number) => Math.min(1, Math.max(0, c));
  return rgbToHex(linearToSrgb(clamp(rgb[0])), linearToSrgb(clamp(rgb[1])), linearToSrgb(clamp(rgb[2])));
}

/**
 * The 8-bit color of chroma C and hue h whose WCAG luminance is closest to Y. Bisects L over [0, 1]
 * for 40 iterations on the gamut-mapped hex, then returns whichever bracketing result is closer in Y
 * (the darker one on a tie).
 */
export function atLuminance(Y: number, C: number, h: number): HexColor {
  if (Y >= 0.9999) return '#ffffff';
  if (!(Y > 0.0001)) return '#000000';
  let lo = 0, hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (relLum(gamut(mid, C, h)) < Y) lo = mid;
    else hi = mid;
  }
  const below = gamut(lo, C, h), above = gamut(hi, C, h);
  return Math.abs(relLum(below) - Y) <= Math.abs(relLum(above) - Y) ? below : above;
}

/** `color-mix(in srgb, a t, b)`: per-channel a·t + b·(1 − t) on gamma-encoded sRGB, rounded to 8 bits. */
export function mixSrgb(a: string, b: string, t: number): HexColor {
  const x = parseColor(a), y = parseColor(b);
  if (!x || !y) return '#000000';
  const mix = (p: number, q: number) => p * t + q * (1 - t);
  return rgbToHex(mix(x.r, y.r), mix(x.g, y.g), mix(x.b, y.b));
}
