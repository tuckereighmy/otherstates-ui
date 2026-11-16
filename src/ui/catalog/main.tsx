import * as stylex from '@stylexjs/stylex';
import { useEffect, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '../base.css';
import { applyTheme } from '../customize';
import { darkTheme } from '../theme';
import { Catalog, type CatalogTheme } from './Catalog';
import { RecipeProvider, useRecipe } from './customize/RecipeProvider';
import { parsePreview } from './route';
import { TemplateFullScreen } from './templates/TemplatePages';

const themeKey = 'otherstates-ui-theme';
const base = import.meta.env.BASE_URL;

// A saved choice wins; a first visit follows the system setting.
function readTheme(): CatalogTheme {
  try {
    const saved = localStorage.getItem(themeKey);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch { /* Storage is blocked: fall through to the system setting. */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function OtherstatesUI() {
  const [theme, setTheme] = useState<CatalogTheme>(readTheme);

  // Another document on this origin switched the theme: another tab, or the docs around a template
  // preview frame. Follow it.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === themeKey || event.key === null) setTheme(readTheme());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function changeTheme(next: CatalogTheme) {
    setTheme(next);
    try { localStorage.setItem(themeKey, next); } catch { /* The theme still holds for this visit. */ }
  }

  return (
    <RecipeProvider scheme={theme}>
      <Shell theme={theme} onThemeChange={changeTheme} />
    </RecipeProvider>
  );
}

function Shell({ theme, onThemeChange }: { theme: CatalogTheme; onThemeChange: (theme: CatalogTheme) => void }) {
  const { theme: recipeTheme, showOriginal } = useRecipe();
  // Light is the tokens' own default and needs no class: the same setup "Get started" describes.
  const themeClass = theme === 'dark' ? stylex.props(darkTheme).className ?? '' : '';

  // The theme goes on <html> so dialogs and menus, which render outside the root, share it.
  useLayoutEffect(() => {
    const html = document.documentElement;
    const classes = themeClass.split(' ').filter(Boolean);
    html.dataset.uiTheme = theme;
    html.classList.add(...classes);
    // A Customize recipe goes on top of the theme class as inline tokens, in the same commit,
    // so no frame mixes one scheme's overrides with the other's tokens.
    const undo = applyTheme(showOriginal ? null : recipeTheme, { scheme: theme });
    // The tokens are in place: ui/index.html stops standing in for them.
    html.dataset.uiReady = '';
    return () => {
      undo();
      html.classList.remove(...classes);
    };
  }, [theme, themeClass, recipeTheme, showOriginal]);

  // #preview/<id> is a template on its own, with no docs around it: the template frames load it.
  const preview = usePreviewId();
  if (preview) return <TemplateFullScreen id={preview} />;
  return <Catalog theme={theme} onThemeChange={onThemeChange} homeHref={base} logo={{ long: `${base}brand/OS_LONG.svg`, small: `${base}brand/OS_SMALL.svg` }} />;
}

function usePreviewId() {
  const [id, setId] = useState(() => parsePreview(location.hash));
  useEffect(() => {
    const onHashChange = () => setId(parsePreview(location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return id;
}

const root = createRoot(document.getElementById('root')!);
root.render(<OtherstatesUI />);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
