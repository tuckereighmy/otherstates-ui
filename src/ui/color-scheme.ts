import * as stylex from '@stylexjs/stylex';
import { darkTheme } from './theme';

export type ColorScheme = 'light' | 'dark' | 'system';

// Whatever follows the system right now (the colorSchemeScript() script, or an earlier applyColorScheme('system'))
// leaves its stop function here, so the latest choice always wins.
const STOP = '__otherstatesColorScheme';
type WithStop = { [STOP]?: () => void };

/**
 * Applies light or dark to the whole app: the dark theme is a StyleX class on <html>, so popovers, menus and
 * toasts rendered in portals inherit it too. 'system' follows the operating system and keeps following it until
 * the next call. Returns a function that stops following.
 */
export function applyColorScheme(scheme: ColorScheme, root: HTMLElement = document.documentElement): () => void {
  (window as WithStop)[STOP]?.();
  delete (window as WithStop)[STOP];
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const classes = (stylex.props(darkTheme).className ?? '').split(' ').filter(Boolean);
  const update = () => {
    const dark = scheme === 'dark' || (scheme === 'system' && media.matches);
    for (const name of classes) root.classList.toggle(name, dark);
    root.style.colorScheme = dark ? 'dark' : 'light';
  };
  update();
  if (scheme !== 'system') return () => {};
  media.addEventListener('change', update);
  const stop = () => {
    media.removeEventListener('change', update);
    if ((window as WithStop)[STOP] === stop) delete (window as WithStop)[STOP];
  };
  (window as WithStop)[STOP] = stop;
  return stop;
}

/**
 * For server-rendered apps (Next.js): the source of a script for <head> that applies the scheme before the
 * first paint, so a dark-mode visitor never sees a light frame. For 'system' it keeps following the operating
 * system until applyColorScheme is called. Render it in the root layout, with suppressHydrationWarning on
 * <html> (the script changes its class and style before React hydrates):
 *
 *   <html lang="en" suppressHydrationWarning>
 *     <head><script dangerouslySetInnerHTML={{ __html: colorSchemeScript() }} /></head>
 */
export function colorSchemeScript(scheme: ColorScheme = 'system'): string {
  const classes = JSON.stringify((stylex.props(darkTheme).className ?? '').split(' ').filter(Boolean));
  const fixed = scheme === 'system' ? 'null' : String(scheme === 'dark');
  return `(function(){try{var r=document.documentElement,c=${classes},f=${fixed},m=matchMedia('(prefers-color-scheme: dark)');`
    + `function u(){var d=f===null?m.matches:f;for(var i=0;i<c.length;i++)r.classList.toggle(c[i],d);r.style.colorScheme=d?'dark':'light'}`
    + `u();if(f===null){m.addEventListener('change',u);window.${STOP}=function(){m.removeEventListener('change',u)}}}catch(e){}})()`;
}
