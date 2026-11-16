// Types for the Otherstates UI theme builder. Pure data: no DOM, no React, no StyleX.

export type Scheme = 'light' | 'dark';
/** A token's custom-property name, exactly as `tokens.stylex.ts` declares it. */
export type TokenName = `--os-${string}`;
export type TokenMap = Readonly<Record<TokenName, string>>;
/** Complete light and dark maps (124 tokens each). Dark = light merged with `theme.ts`. */
export type BaseValues = { readonly light: TokenMap; readonly dark: TokenMap };

export type AccentPreset = 'ink' | 'harbor' | 'lagoon' | 'plum' | 'orchid';
/** Lowercase `#rrggbb` once normalized. */
export type HexColor = `#${string}`;
export type NeutralFamily = 'paper' | 'pure' | 'slate' | 'sage' | 'tinted';
export type CornerLadder = 'round' | 'soft' | 'standard' | 'tight';
export type Typeface = 'inter' | 'platform';
export type ContrastLevel = 'standard' | 'more';
export type PresetId = 'house' | 'ledger' | 'graphite' | 'tidepool' | 'atelier';

export type Recipe = {
  readonly v: 1;
  readonly accent: AccentPreset | HexColor;
  /** Advanced → Dark accent: Custom. `null` derives dark from the main accent. */
  readonly accentDark: HexColor | null;
  readonly neutrals: NeutralFamily;
  readonly corners: CornerLadder;
  readonly typeface: Typeface;
  readonly contrast: ContrastLevel;
  /** Default true. Ignored while the accent is Ink. */
  readonly focusFollowsAccent: boolean;
  /** Default true. Ignored while the accent is Ink. */
  readonly linksFollowAccent: boolean;
};

/**
 * Phase switches. `normalizeRecipe` and `decodeRecipe` map an unavailable option back to its default.
 * `deriveTheme` ignores them, so every option can still be derived and verified.
 */
export type Availability = {
  /** The Soft corner ladder (needs component prerequisites B1 and B2). */
  soft: boolean;
  /** The Contrast: More knob (owner decision: off). */
  contrastMore: boolean;
  /** Every accent other than Ink (needs component prerequisites A2 to A4 before a production release). */
  chromatic: boolean;
};

export type AdjustmentReason = 'text-on-accent' | 'text-accent' | 'state-fill' | 'dark-band' | 'lifted' | 'chroma' | 'rounding';
export type Adjustment = {
  readonly scheme: Scheme;
  readonly token: TokenName;
  readonly from: string;
  readonly to: string;
  readonly reason: AdjustmentReason;
  readonly message: string;
  /** Shown to readers. False for rounding repairs and for moves under ΔE_OK .01. */
  readonly visible: boolean;
};
export type Note = {
  readonly scheme: Scheme;
  readonly severity: 'warning' | 'note';
  /** The closest status token. */
  readonly against: TokenName;
  /** ΔE_OK between the accent and `against`. */
  readonly distance: number;
  readonly message: string;
};

export type AuditKind = 'contrast' | 'order' | 'edge' | 'distinct' | 'corners';
/** What an audit rule compares: a token, the Progress track, or one of the three progress gradient stops. */
export type AuditRef = TokenName | 'progress-track' | 'progress-stop-1' | 'progress-stop-2' | 'progress-stop-3';
export type AuditRule = {
  readonly id: string;
  /** The docs label of the rule's group, e.g. "Secondary text". */
  readonly group: string;
  readonly scheme: Scheme | 'both';
  readonly fg: AuditRef;
  readonly bg: AuditRef;
  /**
   * contrast / edge: minimum WCAG ratio. distinct: minimum ΔE_OK. order: 1 (fg must sit strictly further
   * toward the text color than bg). corners: 1 (the ladder passes `checkCorners`).
   */
  readonly min: number;
  readonly kind: AuditKind;
  /**
   * What happens under the Ink accent: 'skip' leaves the rule out (accent steps have no hue to separate),
   * 'finding' still measures it but never gates (the shipped progress gradient).
   */
  readonly whenInk?: 'skip' | 'finding';
  /** A shipped status pair the builder does not change: measured and listed, never gating. */
  readonly finding?: boolean;
};
export type AuditRow = {
  readonly id: string;
  readonly group: string;
  readonly scheme: Scheme;
  readonly label: string;
  /** False for shipped findings: listed, but `AuditResult.ok` ignores them. */
  readonly gating: boolean;
  /** contrast / edge: ratio. distinct: ΔE_OK. order: luminance ratio in the required direction (<1 when reversed). corners: 1 pass, 0 fail. */
  readonly value: number;
  readonly min: number;
  readonly ok: boolean;
};
export type AuditResult = { ok: boolean; rows: AuditRow[] };

export type DerivedTheme = {
  readonly recipe: Recipe;
  /** Share code, e.g. "v1.a-harbor.n-slate.r-tight"; "v1.r-round" for House. */
  readonly code: string;
  /** True when both maps equal the base maps (House): `applyTheme` then writes nothing. */
  readonly identity: boolean;
  /** Complete. */
  readonly light: TokenMap;
  /** Complete. */
  readonly dark: TokenMap;
  readonly owned: readonly TokenName[];
  readonly adjustments: readonly Adjustment[];
  readonly notes: readonly Note[];
  readonly audit: { readonly light: AuditResult; readonly dark: AuditResult };
};
