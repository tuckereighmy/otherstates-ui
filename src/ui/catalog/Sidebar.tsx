import { useCallback, useId, useLayoutEffect, useRef, type ReactNode } from 'react';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { DocsIcon } from './icons';
import { navGroups } from './nav';

type DocsNavProps = {
  /** The current page's hash path ("component/button"), or null when no page matches. */
  currentPath: string | null;
  /** Called when a row is followed, including the row for the page already open. */
  onNavigate?: () => void;
};

/** The grouped list of pages and components. Text rows only. */
export function DocsNav({ currentPath, onNavigate }: DocsNavProps) {
  const id = useId();
  return (
    <nav className="docs-nav" aria-label="Documentation">
      {navGroups.map((group, index) => (
        <div className="docs-nav-group" key={group.label}>
          <p className="docs-nav-label" id={`${id}-${index}`}>{group.label}</p>
          <ul className="docs-nav-list" role="list" aria-labelledby={`${id}-${index}`}>
            {group.items.map(item => (
              <li key={item.path}>
                <a className="docs-nav-link" href={item.href} aria-current={item.path === currentPath ? 'page' : undefined} onClick={onNavigate}>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** The sidebar on wide screens: sticky under the header, with its own scroll. */
export function Sidebar({ currentPath }: { currentPath: string | null }) {
  const ref = useRef<HTMLDivElement>(null);

  // Keep the current row visible. A row already in view stays where it is, so following a link in
  // the list never moves the list. A row out of view (a deep link, the pager, search) is brought to
  // the middle, with its neighbors around it, rather than pressed against an edge.
  useLayoutEffect(() => {
    const scroller = ref.current;
    const current = scroller?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!scroller || !current) return;
    const frame = scroller.getBoundingClientRect();
    const row = current.getBoundingClientRect();
    if (row.top >= frame.top + 16 && row.bottom <= frame.bottom - 16) return;
    scroller.scrollTop += row.top - frame.top - (frame.height - row.height) / 2;
    // Near the top of the list, start at the very top, so nothing is left half under the header.
    if (scroller.scrollTop <= parseFloat(getComputedStyle(scroller).paddingTop)) scroller.scrollTop = 0;
  }, [currentPath]);

  return (
    // The nav inside is the landmark; this is only its scrolling frame.
    <div className="docs-sidebar" ref={ref}>
      <DocsNav currentPath={currentPath} />
    </div>
  );
}

type NavSheetProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPath: string | null;
  /** The brand link, repeated at the top of the sheet. */
  brand: ReactNode;
  /** Links the header has no room for on a phone. */
  children?: ReactNode;
};

/** The same list on a phone: a sheet over the whole page, opened from the header. */
export function NavSheet({ isOpen, onOpenChange, currentPath, brand, children }: NavSheetProps) {
  const close = () => onOpenChange(false);

  // When the sheet opens, start the list where the reader is: the current row in the middle, with
  // its neighbors on both sides, rather than pressed against an edge.
  const showCurrent = useCallback((scroller: HTMLDivElement | null) => {
    const current = scroller?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!scroller || !current) return;
    const frame = scroller.getBoundingClientRect();
    const row = current.getBoundingClientRect();
    if (row.bottom <= frame.bottom - 96) return;
    scroller.scrollTop += row.top - frame.top - (frame.height - row.height) / 2;
  }, []);

  return (
    <ModalOverlay className="docs-layer docs-sheet-overlay" isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal className="docs-sheet">
        <Dialog className="docs-sheet-dialog" aria-label="Navigation">
          <div className="docs-sheet-bar">
            <button type="button" className="docs-icon-button" aria-label="Close navigation" onClick={close}>
              <DocsIcon name="close" />
            </button>
            {brand}
          </div>
          <div className="docs-sheet-scroll" ref={showCurrent}>
            <DocsNav currentPath={currentPath} onNavigate={close} />
            {children && <div className="docs-sheet-extra">{children}</div>}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
