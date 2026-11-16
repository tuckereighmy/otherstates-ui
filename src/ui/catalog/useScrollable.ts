import { useLayoutEffect, useState, type RefObject } from 'react';

/**
 * True while the element's content is wider than the element, so it scrolls sideways.
 * A region that scrolls has to be reachable by keyboard; one that does not should not be a tab stop.
 */
export function useScrollsSideways(ref: RefObject<HTMLElement | null>) {
  const [scrolls, setScrolls] = useState(false);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setScrolls(element.scrollWidth > element.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => observer.disconnect();
  }, [ref]);
  return scrolls;
}
