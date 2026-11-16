import * as stylex from '@stylexjs/stylex';
import { useEffect, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '../../base.css';
import { applyTheme } from '../../customize';
import { darkTheme } from '../../theme';
import { RecipeProvider, useRecipe } from '../customize/RecipeProvider';
import { Home, type HomeTheme } from './Home';

// The Otherstates UI homepage at /. It shares the docs' theme choice and Customize recipe, so a
// reader who switched to dark or built a theme in /ui/ sees the same thing here.

const themeKey = 'otherstates-ui-theme';
const base = import.meta.env.BASE_URL;

function readTheme(): HomeTheme {
  try {
    const saved = localStorage.getItem(themeKey);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch { /* Storage is blocked: fall through to the system setting. */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function HomePage() {
  const [theme, setTheme] = useState<HomeTheme>(readTheme);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === themeKey || event.key === null) setTheme(readTheme());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function changeTheme(next: HomeTheme) {
    setTheme(next);
    try { localStorage.setItem(themeKey, next); } catch { /* The theme still holds for this visit. */ }
  }

  return (
    <RecipeProvider scheme={theme}>
      <Themed theme={theme} onThemeChange={changeTheme} />
    </RecipeProvider>
  );
}

function Themed({ theme, onThemeChange }: { theme: HomeTheme; onThemeChange: (theme: HomeTheme) => void }) {
  const { theme: recipeTheme, showOriginal } = useRecipe();
  const themeClass = theme === 'dark' ? stylex.props(darkTheme).className ?? '' : '';

  // On <html>, so menus and popovers rendered outside the root share the theme.
  useLayoutEffect(() => {
    const html = document.documentElement;
    const classes = themeClass.split(' ').filter(Boolean);
    html.dataset.uiTheme = theme;
    html.classList.add(...classes);
    const undo = applyTheme(showOriginal ? null : recipeTheme, { scheme: theme });
    html.dataset.uiReady = '';
    return () => {
      undo();
      html.classList.remove(...classes);
    };
  }, [theme, themeClass, recipeTheme, showOriginal]);

  return <Home theme={theme} onThemeChange={onThemeChange} docsHref={`${base}ui/`} logo={`${base}brand/OS_LONG.svg`} />;
}

const root = createRoot(document.getElementById('root')!);
root.render(<HomePage />);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
