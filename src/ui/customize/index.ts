// Public entry of the Otherstates UI theme builder. Deliberately NOT re-exported from
// components/index.ts, so apps that do not theme at runtime never ship the color math.
export type {
  AccentPreset, Adjustment, AdjustmentReason, AuditKind, AuditRef, AuditResult, AuditRow, AuditRule, Availability,
  BaseValues, ContrastLevel, CornerLadder, DerivedTheme, HexColor, NeutralFamily, Note, PresetId, Recipe, Scheme,
  TokenMap, TokenName, Typeface,
} from './types.ts';
export {
  ACCENT_PRESETS, ALL_AVAILABLE, AVAILABILITY, CORNER_LADDERS, DEFAULT_RECIPE, NEUTRAL_FAMILIES, PRESETS, ROUND_CONTROL, TYPEFACES,
  accentSeed, canonicalRecipe, decodeRecipe, encodeRecipe, matchPreset, normalizeRecipe, recipeToJson, sameRecipe,
  shareCode, tintedAvailable,
} from './recipe.ts';
export { BASE, TOKEN_NAMES, baseFromSources, parseTokenSource } from './base-values.ts';
export { OWNED_TOKENS, deriveTheme } from './derive.ts';
export { RULES, auditTokens, checkCorners, summarize } from './audit.ts';
export { contrast, deltaE, normalizeHex, relLum } from './color.ts';
export { applyTheme, toInlineStyle } from './apply.ts';
export type { ApplyOptions } from './apply.ts';
export { ScopedTheme } from './ScopedTheme.tsx';
export type { ScopedThemeProps } from './ScopedTheme.tsx';
export { cssVariables, dtcgTokens, parseImport, patchTokenSources, recipeSnippet, shareUrl, themeFile } from './export.ts';
export type { Change, CssOptions, PatchResult } from './export.ts';
