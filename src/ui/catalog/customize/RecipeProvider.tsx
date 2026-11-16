import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import tokensSrc from '../../tokens.stylex.ts?raw';
import themeSrc from '../../theme.ts?raw';
import {
  DEFAULT_RECIPE, PRESETS, baseFromSources, decodeRecipe, deriveTheme, matchPreset, normalizeRecipe, recipeToJson, sameRecipe,
  type BaseValues, type DerivedTheme, type PresetId, type Recipe, type Scheme,
} from '../../customize';

// The docs' theme recipe: one recipe for the whole site, saved per viewer, opened from a
// share link, and derived against the live token files so the docs can never drift from them.

const storageKey = 'otherstates-ui-recipe';

/** The docs' base values, read from the token files themselves. */
export const BASE_VALUES: BaseValues = baseFromSources(tokensSrc, themeSrc);
/** The token files as source text, for the "Edit your files" export. */
export const SOURCES = { tokensSrc, themeSrc } as const;

export type SharedTheme = {
  /** A `?theme=` link is open and not yet kept or discarded. */
  active: boolean;
  /** The shared theme's name: a preset or "Custom mix". */
  label: string;
  /** Part of the link could not be read; the rest is applied. */
  partial: boolean;
  /** The link could not be read at all. */
  error: string | null;
  keep: () => void;
  discard: () => void;
};

export type RecipeState = {
  recipe: Recipe;
  theme: DerivedTheme;
  /** The scheme on screen. */
  scheme: Scheme;
  setRecipe: (recipe: Recipe) => void;
  update: (partial: Partial<Recipe>) => void;
  reset: () => void;
  preset: PresetId | null;
  /** The recipe differs from the shipped theme. */
  customized: boolean;
  showOriginal: boolean;
  setShowOriginal: (value: boolean) => void;
  shared: SharedTheme;
};

type Shared = { recipe: Recipe | null; partial: boolean; error: string | null } | null;

function readSaved(): Recipe {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) return normalizeRecipe(raw);
  } catch { /* Storage is blocked: the shipped theme. */ }
  return DEFAULT_RECIPE;
}

function writeSaved(recipe: Recipe) {
  try {
    if (sameRecipe(recipe, DEFAULT_RECIPE)) localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, recipeToJson(recipe));
  } catch { /* The recipe still holds for this visit. */ }
}

function readShared(): Shared {
  const code = new URLSearchParams(location.search).get('theme');
  if (code === null) return null;
  const decoded = decodeRecipe(code);
  if (!decoded) return { recipe: null, partial: false, error: 'That theme link could not be read.' };
  return { recipe: decoded.recipe, partial: decoded.partial, error: null };
}

function stripParam() {
  const url = new URL(location.href);
  url.searchParams.delete('theme');
  history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
}

export function labelOf(recipe: Recipe): string {
  const id = matchPreset(recipe);
  return id ? PRESETS[id].label : 'Custom mix';
}

const RecipeContext = createContext<RecipeState | null>(null);

export function RecipeProvider({ scheme, children }: { scheme: Scheme; children: ReactNode }) {
  // A link previews its theme without saving it; otherwise the saved recipe; otherwise House.
  const [saved, setSaved] = useState<Recipe>(readSaved);
  const [shared, setShared] = useState<Shared>(readShared);
  const [showOriginal, setShowOriginal] = useState(false);
  const recipe = shared?.recipe ?? saved;

  // Another document on this origin saved a recipe: another tab, or the docs around a template
  // preview frame. Follow it, so every open page shows the same theme.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === storageKey || event.key === null) setSaved(readSaved());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  const theme = useMemo(() => deriveTheme(recipe, BASE_VALUES), [recipe]);

  const setRecipe = useCallback((next: Recipe) => {
    const normal = normalizeRecipe(next);
    setSaved(normal);
    writeSaved(normal);
    // Changing anything while a shared theme is open counts as keeping it.
    setShared(current => {
      if (current) stripParam();
      return null;
    });
  }, []);

  const update = useCallback((partial: Partial<Recipe>) => setRecipe({ ...recipe, ...partial }), [recipe, setRecipe]);
  const reset = useCallback(() => setRecipe(DEFAULT_RECIPE), [setRecipe]);

  const keep = useCallback(() => {
    if (shared?.recipe) {
      setSaved(shared.recipe);
      writeSaved(shared.recipe);
    }
    setShared(null);
    stripParam();
  }, [shared]);

  const discard = useCallback(() => {
    setShared(null);
    stripParam();
  }, []);

  const value = useMemo<RecipeState>(() => {
    const preset = matchPreset(recipe);
    return {
      recipe,
      theme,
      scheme,
      setRecipe,
      update,
      reset,
      preset,
      customized: !sameRecipe(recipe, DEFAULT_RECIPE),
      showOriginal,
      setShowOriginal,
      shared: {
        active: shared !== null,
        label: shared?.recipe ? labelOf(shared.recipe) : '',
        partial: shared?.partial ?? false,
        error: shared?.error ?? null,
        keep,
        discard,
      },
    };
  }, [recipe, theme, scheme, setRecipe, update, reset, showOriginal, shared, keep, discard]);

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
}

export function useRecipe(): RecipeState {
  const value = useContext(RecipeContext);
  if (!value) throw new Error('useRecipe needs a RecipeProvider above it.');
  return value;
}
