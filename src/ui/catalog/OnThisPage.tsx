import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { slug } from './PageParts';

type TocHeading = { id: string; text: string; level: 2 | 3 };

type OnThisPageProps = {
  /** The element that holds the page. Its h2 and h3 headings become the list. */
  container: RefObject<HTMLElement | null>;
  /** The page's hash path: "component/button". */
  path: string;
  /** The heading the shell last jumped to. It stays marked until the reader scrolls. */
  jumped?: { id: string; count: number };
};

// Headings inside a live example or a code block belong to the example, not to the page.
const notPageContent = '.docs-stage, .docs-code, [data-docs-raw]';

function readHeadings(root: HTMLElement): TocHeading[] {
  const headings: TocHeading[] = [];
  for (const element of root.querySelectorAll<HTMLElement>('h2, h3')) {
    if (element.closest(notPageContent)) continue;
    const text = element.textContent?.trim();
    if (!text) continue;
    // Pages written as plain JSX do not have to number their own headings.
    if (!element.id) {
      const base = slug(text) || 'section';
      let id = base;
      for (let n = 2; document.getElementById(id); n++) id = `${base}-${n}`;
      element.id = id;
    }
    headings.push({ id: element.id, text, level: element.tagName === 'H2' ? 2 : 3 });
  }
  return headings;
}

const sameHeadings = (a: TocHeading[], b: TocHeading[]) =>
  a.length === b.length && a.every((heading, i) => heading.id === b[i].id && heading.text === b[i].text && heading.level === b[i].level);

/** Scroll `scroller` by the least amount that brings `target` inside it. */
export function keepInView(scroller: HTMLElement, target: HTMLElement, margin = 8) {
  const frame = scroller.getBoundingClientRect();
  const box = target.getBoundingClientRect();
  if (box.top < frame.top + margin) scroller.scrollTop -= frame.top + margin - box.top;
  else if (box.bottom > frame.bottom - margin) scroller.scrollTop += box.bottom - (frame.bottom - margin);
}

export function OnThisPage({ container, path, jumped }: OnThisPageProps) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const holdUntil = useRef(0);
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const markerShown = useRef(false);
  const markedHeadings = useRef<TocHeading[]>([]);

  // Read the headings as soon as a page is on screen, and again whenever its content changes.
  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const next = readHeadings(root);
      setHeadings(current => (sameHeadings(current, next) ? current : next));
    };
    read();
    const observer = new MutationObserver(() => { frame ||= requestAnimationFrame(read); });
    observer.observe(root, { childList: true, subtree: true });
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [container, path]);

  // Scroll-spy: the current section is the last heading that has passed under the header.
  useEffect(() => {
    if (headings.length === 0) { setActive(null); return; }
    let frame = 0;
    const update = () => {
      frame = 0;
      if (performance.now() < holdUntil.current) return;
      const page = document.documentElement;
      const first = document.getElementById(headings[0].id);
      const line = (first ? parseFloat(getComputedStyle(first).scrollMarginTop) || 0 : 0) + 8;
      let current: string | null = null;
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top > line) break;
        current = heading.id;
      }
      const scrollable = page.scrollHeight > window.innerHeight + 1;
      if (scrollable && window.innerHeight + window.scrollY >= page.scrollHeight - 2) current = headings[headings.length - 1].id;
      setActive(current);
    };
    const schedule = () => { frame ||= requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [headings]);

  // A jump can land on a heading too close to the end of the page to reach the top. Mark the
  // heading the reader asked for, and let scroll-spy take over at their next scroll.
  useEffect(() => {
    if (!jumped) return;
    holdUntil.current = performance.now() + 250;
    setActive(jumped.id);
  }, [jumped]);

  // Put the marker on the current link. It slides only between two sections; when it appears
  // or the list itself changes, it is simply there.
  useLayoutEffect(() => {
    const list = listRef.current;
    const sameList = markedHeadings.current === headings;
    markedHeadings.current = headings;
    if (!list) { markerShown.current = false; return; }
    const link = list.querySelector<HTMLElement>('[aria-current]');
    list.toggleAttribute('data-slide', sameList && markerShown.current && link !== null);
    markerShown.current = link !== null;
    list.style.setProperty('--docs-toc-marker-opacity', link ? '1' : '0');
    if (!link) return;
    list.style.setProperty('--docs-toc-marker-top', `${link.offsetTop}px`);
    list.style.setProperty('--docs-toc-marker-height', `${link.offsetHeight}px`);
    if (navRef.current) keepInView(navRef.current, link, 24);
  }, [active, headings]);

  // One heading is not a table of contents.
  if (headings.length < 2) return null;

  return (
    <nav className="docs-toc" aria-label="On this page" ref={navRef}>
      <p className="docs-toc-label" aria-hidden="true">On this page</p>
      <ul ref={listRef} role="list">
        {headings.map(heading => (
          <li key={heading.id} data-level={heading.level}>
            <a href={`#${path}/${heading.id}`} aria-current={active === heading.id ? 'location' : undefined}>
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
