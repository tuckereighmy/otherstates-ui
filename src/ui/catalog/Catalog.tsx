import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type RefObject } from 'react';
import { Button, Popover } from '../components';
import { CommandPalette } from './CommandPalette';
import { ComponentDoc } from './ComponentDoc';
import { useRecipe } from './customize/RecipeProvider';
import { ThemeControls } from './customize/ThemeControls';
import { docsById } from './docs/registry';
import { DocsIcon } from './icons';
import { OnThisPage } from './OnThisPage';
import { Boundary, PageHead, Pager } from './PageParts';
import { pages, pagesById } from './pages/registry';
import type { DocPage } from './pages/types';
import { canonicalHash, homePageId, pageHref, parseRoute, routePath, type Route } from './route';
import { NavSheet, Sidebar } from './Sidebar';
import { templatesById } from './templates/registry';
import { TemplateRoute } from './templates/TemplatePages';
import './catalog.css';

export type CatalogTheme = 'light' | 'dark';

type CatalogProps = {
  theme: CatalogTheme;
  onThemeChange: (theme: CatalogTheme) => void;
  /** URLs of the long and small logos, used as masks so they take the theme's colors. The small one is for
   *  tight spaces (a phone header). */
  logo: { long: string; small: string };
  /** Where the "Home" link goes: the Otherstates UI homepage. */
  homeHref?: string;
};

const siteName = 'Otherstates UI';
const phone = '(max-width: 767px)';
const isApple = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

/** Which page a route shows. Two routes with the same view differ only by anchor. */
const viewOf = (route: Route) => (route.kind === 'missing' ? 'missing' : `${route.kind}/${route.id}`);
const anchorOf = (route: Route) => (route.kind === 'missing' ? undefined : route.anchor);

// The browser tells us when a navigation is back or forward, where the reader expects their old
// scroll position rather than the top of the page. Browsers without the Navigation API go to the top.
type NavigationLike = EventTarget & { currentEntry?: { key?: string } | null };
const navigation = typeof window !== 'undefined' ? (window as unknown as { navigation?: NavigationLike }).navigation : undefined;

export function Catalog({ theme, onThemeChange, logo, homeHref = '/' }: CatalogProps) {
  const [route, setRoute] = useState<Route>(() => parseRoute(location.hash));
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [jumped, setJumped] = useState<{ id: string; count: number }>();
  const { customized, reset, shared } = useRecipe();

  const routeRef = useRef(route);
  const paletteOpenRef = useRef(paletteOpen);
  paletteOpenRef.current = paletteOpen;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLButtonElement>(null);
  // Set by a navigation, read once the new page is on screen.
  const arrival = useRef<{ restore: number | null } | null>(null);
  const traversing = useRef(false);
  const scrollByEntry = useRef(new Map<string, number>());
  const entryKey = useRef(navigation?.currentEntry?.key);

  const view = viewOf(route);
  const path = routePath(route);
  const doc = route.kind === 'component' ? docsById.get(route.id) : undefined;
  // A template route: the gallery (empty id) or one template.
  const templateId = route.kind === 'template' ? route.id : undefined;
  const page: DocPage | undefined = doc || templateId !== undefined ? undefined : pagesById.get(route.kind === 'page' ? route.id : homePageId) ?? pages[0];
  const templateTitle = templateId === undefined ? undefined : templateId ? templatesById.get(templateId)?.title : 'Templates';
  const pageTitle = doc?.title ?? templateTitle ?? page?.title ?? siteName;

  const findHeading = useCallback((id: string) => pageRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id)}`) ?? null, []);

  const jumpTo = useCallback((id: string) => {
    const target = findHeading(id);
    if (!target) return false;
    target.scrollIntoView({ block: 'start' });
    if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
    target.focus({ preventScroll: true });
    setJumped(previous => ({ id, count: (previous?.count ?? 0) + 1 }));
    return true;
  }, [findHeading]);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    // An older link (#catalog, #usage) keeps working and leaves with the address it has today.
    const modernize = () => {
      const canonical = canonicalHash(location.hash);
      if (canonical) history.replaceState(history.state, '', canonical);
    };
    modernize();
    const onNavigate = (event: Event) => { traversing.current = (event as Event & { navigationType?: string }).navigationType === 'traverse'; };
    navigation?.addEventListener('navigate', onNavigate);

    function onHashChange() {
      modernize();
      const previous = routeRef.current;
      const next = parseRoute(location.hash);
      const key = navigation?.currentEntry?.key;
      if (entryKey.current) scrollByEntry.current.set(entryKey.current, window.scrollY);
      entryKey.current = key;
      routeRef.current = next;
      setSheetOpen(false);
      setRoute(next);
      if (viewOf(previous) !== viewOf(next)) {
        arrival.current = { restore: traversing.current && key ? scrollByEntry.current.get(key) ?? null : null };
      } else {
        // Same page: only the anchor changed.
        const anchor = anchorOf(next);
        if (!anchor || !jumpTo(anchor)) window.scrollTo(0, 0);
      }
      traversing.current = false;
    }

    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      navigation?.removeEventListener('navigate', onNavigate);
    };
  }, [jumpTo]);

  // A new page: name the tab, go to the right place, and move focus to the title so keyboard
  // and screen-reader users start where the content starts.
  useLayoutEffect(() => {
    document.title = `${pageTitle} — ${siteName}`;
    const arrived = arrival.current;
    arrival.current = null;
    const anchor = anchorOf(routeRef.current);
    if (!arrived) {
      // First load. Leave focus on the document, but honor a deep link.
      if (!anchor || !jumpTo(anchor)) return;
      const frame = requestAnimationFrame(() => findHeading(anchor)?.scrollIntoView({ block: 'start' }));
      return () => cancelAnimationFrame(frame);
    }
    titleRef.current?.focus({ preventScroll: true });
    const restore = arrived.restore;
    if (restore !== null) window.scrollTo(0, restore);
    else if (!anchor || !jumpTo(anchor)) window.scrollTo(0, 0);
    // Examples finish laying out just after they mount, which moves everything below them.
    // Set the position once more before the first paint, now that the page has its real height.
    if (restore === null && !anchor) return;
    const frame = requestAnimationFrame(() => {
      if (restore !== null) window.scrollTo(0, restore);
      else if (anchor) findHeading(anchor)?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [view, pageTitle, jumpTo, findHeading]);

  // ⌘K or Ctrl K opens search from anywhere, unless another dialog has the page.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.isComposing || event.altKey || event.shiftKey) return;
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
      const modal = document.querySelector('[aria-modal="true"], [role="dialog"], [role="alertdialog"]');
      if (modal && !modal.closest('.docs-layer')) return;
      event.preventDefault();
      setSheetOpen(false);
      // Opening from the keyboard: start from the search button so focus has a home to return to.
      if (!paletteOpenRef.current) searchRef.current?.focus({ preventScroll: true });
      setPaletteOpen(!paletteOpenRef.current);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // The sheet only exists on phones. Leaving that width closes it.
  useEffect(() => {
    const media = window.matchMedia(phone);
    const onChange = () => { if (!media.matches) setSheetOpen(false); };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  function choose(nextPath: string) {
    setPaletteOpen(false);
    if (`#${nextPath}` !== location.hash) location.hash = nextPath;
  }

  // A link to the address already in the bar changes nothing, so the browser does nothing.
  // The reader still expects to be taken there: to the heading, or to the top of the page.
  function followSameAddress(event: MouseEvent<HTMLElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest?.('a[href^="#"]');
    if (!link || link.getAttribute('href') !== location.hash || link.hasAttribute('download') || link.getAttribute('target') === '_blank') return;
    event.preventDefault();
    const anchor = anchorOf(routeRef.current);
    if (!anchor || !jumpTo(anchor)) window.scrollTo(0, 0);
  }

  const logoStyle = (url: string) => ({ '--docs-logo': `url("${url}")` }) as CSSProperties;
  const brand = (onClick?: () => void) => (
    <a className="docs-brand" href={pageHref(homePageId)} onClick={onClick} aria-label={siteName}>
      <span className="docs-brand-logo docs-brand-logo-long" style={logoStyle(logo.long)} aria-hidden="true" />
      <span className="docs-brand-logo docs-brand-logo-small" style={logoStyle(logo.small)} aria-hidden="true" />
      <span className="docs-brand-name" aria-hidden="true">UI</span>
    </a>
  );
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const currentPath = route.kind === 'missing' ? null : path;

  return (
    <div className="docs-app" onClick={followSameAddress}>
      <a className="docs-skip" href="#main" onClick={event => { event.preventDefault(); mainRef.current?.focus(); }}>Skip to content</a>

      <header className="docs-header">
        <div className="docs-header-inner">
          <button type="button" className="docs-icon-button docs-menu-button" aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={sheetOpen} onClick={() => setSheetOpen(true)}>
            <DocsIcon name="menu" />
          </button>
          {brand()}
          <div className="docs-header-actions">
            <button type="button" className="docs-search" ref={searchRef} aria-label="Search" aria-haspopup="dialog" aria-keyshortcuts="Meta+K Control+K" onClick={() => setPaletteOpen(true)}>
              <DocsIcon name="search" />
              <span className="docs-search-label">Search…</span>
              <kbd className="docs-kbd" aria-hidden="true">{isApple ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
            <a className="docs-header-link" href={homeHref}>Home</a>
            <Popover
              trigger={(
                <button type="button" className="docs-icon-button docs-customize-button" aria-label={customized ? 'Customize theme (customized)' : 'Customize theme'} aria-haspopup="dialog">
                  <DocsIcon name="swatch" />
                  {customized && <span className="docs-customize-dot" aria-hidden="true" />}
                </button>
              )}
              title="Customize"
              description="Changes apply to every page."
              placement="bottom end"
              footer={close => (
                <div className="cz-pop-foot">
                  <a className="cz-pop-link" href={pageHref('customize')} onClick={close}>Open the full builder</a>
                  <Button appearance="text" size="sm" isDisabled={!customized} onClick={reset}>Reset</Button>
                </div>
              )}
            >
              <ThemeControls variant="compact" />
            </Popover>
            <button type="button" className="docs-icon-button" aria-label={`Switch to ${nextTheme} theme`} onClick={() => onThemeChange(nextTheme)}>
              <DocsIcon name={theme === 'dark' ? 'sun' : 'moon'} />
            </button>
          </div>
        </div>
      </header>

      <div className="docs-shell" data-layout={templateId !== undefined || (!doc && page?.layout === 'wide') ? 'wide' : undefined}>
        <Sidebar currentPath={currentPath} />

        <main id="main" className="docs-main" ref={mainRef} tabIndex={-1}>
          <div className="docs-page" ref={pageRef}>
            {shared.active && (
              <div className="docs-note docs-shared-banner" role="status">
                <span>
                  {shared.error ?? `You're viewing a shared theme: ${shared.label}.`}
                  {shared.partial && ' Part of that theme link could not be read; the rest is applied.'}
                </span>
                <span className="docs-shared-banner-actions">
                  {!shared.error && <Button size="sm" onClick={shared.keep}>Keep it</Button>}
                  <Button size="sm" appearance="secondary" onClick={shared.discard}>{shared.error ? 'Dismiss' : 'Discard'}</Button>
                </span>
              </div>
            )}
            {route.kind === 'missing' && (
              <p className="docs-note" role="status">That page could not be found. Here is the introduction instead.</p>
            )}
            <Boundary key={view} fallback={<PageError titleRef={titleRef} />}>
              {doc ? <ComponentDoc doc={doc} titleRef={titleRef} />
                : templateId !== undefined ? <TemplateRoute id={templateId} path={path} titleRef={titleRef} />
                : page ? <PageView page={page} path={path} titleRef={titleRef} /> : <PageError titleRef={titleRef} />}
            </Boundary>
          </div>
        </main>

        <div className="docs-aside">
          <OnThisPage container={pageRef} path={path} jumped={jumped} />
        </div>
      </div>

      <CommandPalette isOpen={paletteOpen} onOpenChange={setPaletteOpen} onChoose={choose} />
      <NavSheet isOpen={sheetOpen} onOpenChange={setSheetOpen} currentPath={currentPath} brand={brand(() => setSheetOpen(false))}>
        <a className="docs-nav-link" href={homeHref}>Home</a>
        <a className="docs-nav-link" href={pageHref('customize')}>Customize</a>
      </NavSheet>
    </div>
  );
}

type PageViewProps = { page: DocPage; path: string; titleRef: RefObject<HTMLHeadingElement | null> };

function PageView({ page, path, titleRef }: PageViewProps) {
  const titleId = useId();
  const Body = page.Component;
  return (
    <article className="docs-prose" aria-labelledby={titleId}>
      <PageHead eyebrow={page.section} title={page.title} lead={page.description} titleId={titleId} titleRef={titleRef} />
      <Body />
      <Pager path={path} />
    </article>
  );
}

function PageError({ titleRef }: { titleRef: RefObject<HTMLHeadingElement | null> }) {
  return (
    <article className="docs-prose">
      <h1 className="docs-title" ref={titleRef} tabIndex={-1}>Something went wrong</h1>
      <p className="docs-lead">This page could not be shown. Choose another from the sidebar.</p>
    </article>
  );
}
