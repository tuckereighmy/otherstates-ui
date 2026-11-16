import { useCallback, useSyncExternalStore } from 'react';

// Facts about the browser a server can't know: the platform and media queries. Components read them through
// useSyncExternalStore with a server value, so a server-rendered page (Next.js) hydrates with the markup it was
// sent and updates right after. An app rendered only in the browser (Vite) gets the real value from the first frame.

const never = () => () => {};

/** Whether the device is a Mac, iPhone or iPad, where shortcuts use ⌘ instead of Ctrl. For event handlers. */
export const isApplePlatform = () => typeof navigator !== 'undefined' && /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);

/** `isApplePlatform()` for rendering: false on the server and while hydrating. */
export function useIsApple(): boolean {
  return useSyncExternalStore(never, isApplePlatform, () => false);
}

/** Whether a media query matches, kept current. False on the server and while hydrating. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

/**
 * False on the server and while hydrating, true once React runs in the browser. Components that read the clock
 * as they render (React Aria's calendars and date fields do) show a placeholder until then: a prerendered page
 * (Next.js Cache Components) refuses the current time, and a date baked in at build time would no longer match.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(never, () => true, () => false);
}

/** Whether the person asked for reduced motion. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
