'use client';

import * as stylex from '@stylexjs/stylex';
import {
  createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore,
  type CSSProperties, type ReactElement, type ReactNode, type Ref,
} from 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Button } from './button';
import { Icon, type IconName } from './Icon';
import { withClassName } from './internal/class-name';
import { mergeSurfaceProps } from './internal/overlay';
import { useIsApple, useMediaQuery } from './internal/platform';
import { focusStyles, transitionStyles } from './internal/states';
import { Sheet } from './sheet';
import { Tooltip } from './tooltip';

// Sidebar: a navigation panel that folds to its icons.
//
// Collapse is staged. The labels leave first (opacity and a 6px slide over --os-motion-press, ease-exit);
// then the panel width closes over --os-motion-layout with ease-settle (a panel never overshoots). Expanding
// reverses it: the width opens at once and the labels return after --os-motion-hover. Everything inside
// the panel is anchored to its start edge, so the icon column never moves while the width changes, and
// the current-item fill (the row's own background, radius --os-radius-control) narrows with the row
// until it is a square on the icon: a circle at Round, a rounded square on a corner ladder.
// Reduced motion: every duration and delay is 0, so the panel changes at once.
//
// Rows are the default 36 row of a nav list (spec 1.12; 44 on coarse pointers), with the menu item's geometry:
// a 16px icon centered in the row's height (padding-inline 10, 14 on touch), an 8px gap, 2px between rows. The
// collapsed panel is the icon column plus 8px insets: 52 (60). Section labels are the §1.9 group label (12/16,
// 28 tall) aligned with the icons. Below 768px the panel moves into a left Sheet that SidebarTrigger opens.

const reduce = '@media (prefers-reduced-motion: reduce)';
const coarse = '@media (pointer: coarse)';
const mobileQuery = '(max-width: 767.98px)';

const s = stylex.create({
  provider: {
    display: 'flex', alignItems: 'stretch', width: '100%', height: '100%', minWidth: 0, minHeight: 0,
    boxSizing: 'border-box', fontFamily: t['--os-font-family'],
  },

  panel: {
    position: 'relative', display: 'flex', flexDirection: 'column', flexShrink: 0, boxSizing: 'border-box', overflow: 'hidden',
    width: 'var(--os-sidebar-width, 240px)',
    backgroundColor: t['--os-color-bg-surface'], color: t['--os-color-fg-base'], fontFamily: t['--os-font-family'],
    transitionProperty: 'width',
    transitionDuration: { default: t['--os-motion-layout'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
    transitionDelay: '0ms',
  },
  // The labels leave first; the width starts closing once they are gone.
  panelCollapsed: {
    width: { default: `calc(36px + 2 * ${t['--os-space-2']})`, [coarse]: `calc(${t['--os-size-lg']} + 2 * ${t['--os-space-2']})` },
    transitionDelay: { default: t['--os-motion-press'], [reduce]: '0ms' },
  },
  // Floating: a surface 8px from the frame. It grows from the control radius (control + inset), capped at xl,
  // so rows stay concentric on a corner ladder. shadow-control carries a 1px hairline in dark.
  floating: {
    alignSelf: 'stretch', marginBlock: t['--os-space-2'], marginInlineStart: t['--os-space-2'],
    borderRadius: `min(calc(${t['--os-radius-control']} + ${t['--os-space-2']}), ${t['--os-radius-xl']})`,
    boxShadow: t['--os-shadow-control'],
  },
  docked: {
    alignSelf: 'stretch',
    borderInlineEndWidth: 1, borderInlineEndStyle: 'solid', borderInlineEndColor: t['--os-color-border-subtle'],
  },
  sheetColumn: { display: 'flex', flexDirection: 'column', gap: t['--os-space-2'], minWidth: 0, marginInline: `calc(-1 * ${t['--os-space-3']})` },

  header: { display: 'flex', flexDirection: 'column', gap: t['--os-space-1'], flexShrink: 0, padding: t['--os-space-2'], minWidth: 0 },
  // The brand row is a row tall, and its logo column is the icon column, so the logo stays put while collapsed.
  brand: { display: 'flex', alignItems: 'center', minWidth: 0, height: { default: 36, [coarse]: t['--os-size-lg'] } },
  logo: { display: 'grid', placeItems: 'center', flexShrink: 0, width: { default: 36, [coarse]: t['--os-size-lg'] }, height: '100%' },
  brandText: { display: 'grid', flex: '1 1 auto', minWidth: 0, paddingInlineEnd: t['--os-space-2'] },
  brandTitle: {
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], fontWeight: t['--os-font-weight-medium'],
    letterSpacing: t['--os-tracking-tight'], color: t['--os-color-fg-base'],
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  brandDescription: {
    fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], color: t['--os-color-fg-muted'],
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },

  content: {
    display: 'flex', flexDirection: 'column', gap: t['--os-space-3'], flex: '1 1 0', minWidth: 0, minHeight: 0,
    overflowX: 'hidden', overflowY: 'auto', overscrollBehavior: 'contain', paddingInline: t['--os-space-2'], paddingBlock: t['--os-space-1'], scrollbarWidth: 'thin',
  },
  contentCollapsed: { scrollbarWidth: 'none' },
  contentSheet: { flex: '0 0 auto', overflowY: 'visible' },

  section: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  sectionLabel: {
    position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0, height: 28,
    // os-allow raw-space: spec 1.9 item padding-inline 10 centers a 16px icon in a 36px row; the label starts on the icons
    paddingInline: { default: 10, [coarse]: `calc((${t['--os-size-lg']} - ${t['--os-size-2xs']}) / 2)` },
  },
  sectionText: {
    minWidth: 0, fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], fontWeight: t['--os-font-weight-medium'],
    color: t['--os-color-fg-muted'], whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  // The collapsed section marker: a 24px hairline centered on the icon column.
  hairline: {
    position: 'absolute', insetInlineStart: { default: t['--os-space-1-5'], [coarse]: `calc((${t['--os-size-lg']} - ${t['--os-size-xs']}) / 2)` },
    top: '50%', width: t['--os-size-xs'], height: 1,
    backgroundColor: t['--os-color-border-subtle'], pointerEvents: 'none',
  },
  list: { display: 'flex', flexDirection: 'column', gap: t['--os-space-0-5'], minWidth: 0, margin: 0, padding: 0, listStyleType: 'none' },
  itemWrap: { display: 'block', minWidth: 0 },

  item: {
    position: 'relative', display: 'flex', alignItems: 'center', gap: t['--os-space-2'], boxSizing: 'border-box', width: '100%',
    minWidth: { default: 36, [coarse]: t['--os-size-lg'] }, height: { default: 36, [coarse]: t['--os-size-lg'] },
    // os-allow raw-space: spec 1.9 item padding-inline 10 centers the 16px icon in the 36px row (14 in the 44px touch row)
    paddingInline: { default: 10, [coarse]: `calc((${t['--os-size-lg']} - ${t['--os-size-2xs']}) / 2)` },
    margin: 0, borderWidth: 0, borderStyle: 'none', overflow: 'hidden', borderRadius: t['--os-radius-control'],
    backgroundColor: 'transparent', color: t['--os-color-fg-muted'],
    fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    fontWeight: t['--os-font-weight-regular'], letterSpacing: t['--os-tracking-tight'],
    textAlign: 'start', textDecorationLine: 'none', cursor: 'pointer', outlineStyle: 'none', WebkitTapHighlightColor: 'transparent',
  },
  itemHovered: { backgroundColor: t['--os-color-bg-interactive-primary'], color: t['--os-color-fg-base'] },
  // Current location (spec 1.8 Selected 3): bg-interactive-primary, fg-base 500, no shadow.
  itemCurrent: { backgroundColor: t['--os-color-bg-interactive-primary'], color: t['--os-color-fg-base'], fontWeight: t['--os-font-weight-medium'] },
  itemCurrentHovered: { backgroundColor: t['--os-color-bg-interactive-secondary'] },
  itemPressed: { backgroundColor: t['--os-color-bg-interactive-secondary'] },
  itemDisabled: { color: t['--os-color-fg-disabled'], cursor: 'default' },
  itemIcon: { position: 'relative', display: 'grid', placeItems: 'center', flexShrink: 0, width: 16, height: 16 },
  label: { position: 'relative', flex: '1 1 auto', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  count: {
    flexShrink: 0, marginInlineStart: 'auto', fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'],
    fontWeight: t['--os-font-weight-medium'], fontVariantNumeric: 'tabular-nums', color: t['--os-color-fg-muted'],
  },
  shortcut: {
    flexShrink: 0, marginInlineStart: 'auto', fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'],
    color: t['--os-color-fg-muted'], fontVariantNumeric: 'tabular-nums',
  },
  dot: {
    position: 'absolute', top: `calc(-1 * ${t['--os-space-0-5']})`, insetInlineEnd: `calc(-1 * ${t['--os-space-0-5']})`, width: 6, height: 6,
    borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-bg-notification'], pointerEvents: 'none',
  },

  // Words: shown after the width has opened; leave at once, quickly, when it folds.
  fade: {
    opacity: 1, translate: '0 0',
    transitionProperty: 'opacity, translate',
    transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' },
    transitionDelay: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  fadeOut: {
    opacity: 0, translate: { default: '-6px 0', [reduce]: '0 0' },
    transitionDuration: { default: t['--os-motion-press'], [reduce]: '0ms' },
    transitionDelay: '0ms',
    transitionTimingFunction: t['--os-ease-exit'],
  },
  // Collapsed-only marks (badge dot, section hairline): appear once the width has mostly closed.
  reveal: {
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: { default: t['--os-motion-press'], [reduce]: '0ms' },
    transitionDelay: '0ms',
    transitionTimingFunction: t['--os-ease-exit'],
  },
  revealShown: {
    opacity: 1,
    transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' },
    transitionDelay: { default: `calc(${t['--os-motion-press']} * 2)`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  srOnly: {
    position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden',
    clipPath: 'inset(50%)', whiteSpace: 'nowrap', borderWidth: 0,
  },

  footer: {
    display: 'flex', flexDirection: 'column', gap: t['--os-space-0-5'], flexShrink: 0, minWidth: 0, padding: t['--os-space-2'],
    borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: t['--os-color-border-subtle'],
  },
  inset: { position: 'relative', display: 'flex', flexDirection: 'column', flex: '1 1 0', minWidth: 0, minHeight: 0, overflow: 'auto' },
});

/* ------------------------------------------------------------------------------------------------ */
/* State                                                                                            */
/* ------------------------------------------------------------------------------------------------ */

export type SidebarContextValue = {
  /** True while the desktop panel shows only its icons. */
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  /** Folds or unfolds the panel; below the breakpoint it opens or closes the sheet instead. */
  toggle: () => void;
  /** True below 768px (or when the provider's `mobile` forces it): the panel lives in a Sheet. */
  isMobile: boolean;
  /** Whether the mobile sheet is open. */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  /** The id of the panel, for `aria-controls`. */
  panelId: string;
  /** Whether ⌘B / Ctrl+B is wired up for this provider. */
  keyboardShortcut: boolean;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

/** The nearest SidebarProvider's state. Throws outside a provider. */
export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used inside a SidebarProvider.');
  return context;
}

type PanelState = { collapsed: boolean; inSheet: boolean };
const expandedPanel: PanelState = { collapsed: false, inSheet: false };
const collapsedPanel: PanelState = { collapsed: true, inSheet: false };
const sheetPanel: PanelState = { collapsed: false, inSheet: true };
const PanelContext = createContext<PanelState>(expandedPanel);
const ListContext = createContext(false);

// Every mounted provider that listens for ⌘B. One key press toggles one sidebar: the one that holds focus,
// or else the first on the page.
type ShortcutOwner = { root: () => HTMLElement | null; toggle: () => void };
const shortcutOwners: ShortcutOwner[] = [];

function isTextEntry(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || target.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"], [role="textbox"]') !== null;
}

function readStored(key: string | undefined): boolean | undefined {
  if (!key) return undefined;
  try {
    const value = window.localStorage.getItem(key);
    return value === 'collapsed' ? true : value === 'expanded' ? false : undefined;
  } catch {
    return undefined;
  }
}

// A provider that hasn't been folded or unfolded on this page follows the saved state, including changes from
// another provider with the same persistKey or another tab (the storage event). Once toggled, its own state wins.
const storageListeners = new Set<() => void>();
function subscribeStored(onChange: () => void) {
  storageListeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    storageListeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function writeStored(key: string | undefined, collapsed: boolean) {
  if (!key) return;
  try {
    window.localStorage.setItem(key, collapsed ? 'collapsed' : 'expanded');
  } catch {
    /* storage unavailable: the state still changes for this page */
  }
  for (const listener of storageListeners) listener();
}

/** The collapsed state saved under `key`. Nothing on the server, so a server-rendered page hydrates with the
 *  default and then takes the saved state; a page rendered in the browser has it from the first frame. */
function useStored(key: string | undefined) {
  return useSyncExternalStore(subscribeStored, () => readStored(key), () => undefined);
}

export type SidebarProviderProps = {
  /** Collapsed state (controlled). */
  collapsed?: boolean;
  /** Collapsed state at first (uncontrolled). A stored value under `persistKey` wins. */
  defaultCollapsed?: boolean;
  /** Called with the new state when the panel folds or unfolds. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** A localStorage key. The collapsed state is saved there and read back on the next visit. */
  persistKey?: string;
  /** ⌘B on Apple platforms, Ctrl+B elsewhere, toggles the panel while focus is outside a text field. */
  keyboardShortcut?: boolean;
  /** Forces the mobile sheet on (`true`) or off (`false`). By default it follows a 768px media query. */
  mobile?: boolean;
  /** The sidebar and its SidebarInset, laid out in a row. */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

/** Holds the collapsed state and lays the sidebar and its page out side by side. */
export function SidebarProvider({
  collapsed: collapsedProp, defaultCollapsed = false, onCollapsedChange, persistKey, keyboardShortcut = true, mobile,
  children, className, style, ref,
}: SidebarProviderProps) {
  const stored = useStored(persistKey);
  // Undefined until the panel is folded or unfolded here; until then the saved state, then the default, apply.
  const [internal, setInternal] = useState<boolean>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const narrow = useMediaQuery(mobileQuery);
  const isMobile = mobile ?? narrow;
  const collapsed = collapsedProp ?? internal ?? stored ?? defaultCollapsed;
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const setCollapsed = useCallback((next: boolean) => {
    if (collapsedProp === undefined) setInternal(next);
    writeStored(persistKey, next);
    onCollapsedChange?.(next);
  }, [collapsedProp, persistKey, onCollapsedChange]);

  const toggle = useCallback(() => {
    if (isMobile) setMobileOpen(open => !open);
    else setCollapsed(!collapsed);
  }, [isMobile, collapsed, setCollapsed]);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const toggleRef = useRef(toggle);
  useEffect(() => { toggleRef.current = toggle; }, [toggle]);

  useEffect(() => {
    if (!keyboardShortcut) return;
    const owner: ShortcutOwner = { root: () => rootRef.current, toggle: () => toggleRef.current() };
    shortcutOwners.push(owner);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'b' || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey || event.repeat) return;
      if (isTextEntry(event.target)) return;
      const active = document.activeElement;
      const target = shortcutOwners.find(o => { const root = o.root(); return !!root && !!active && root.contains(active); }) ?? shortcutOwners[0];
      if (target !== owner) return;
      event.preventDefault();
      owner.toggle();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      shortcutOwners.splice(shortcutOwners.indexOf(owner), 1);
    };
  }, [keyboardShortcut]);

  const setRoot = useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const value = useMemo<SidebarContextValue>(() => ({
    collapsed, setCollapsed, toggle, isMobile, mobileOpen, setMobileOpen, panelId, keyboardShortcut,
  }), [collapsed, setCollapsed, toggle, isMobile, mobileOpen, panelId, keyboardShortcut]);

  return (
    <SidebarContext.Provider value={value}>
      <div ref={setRoot} data-sidebar-state={collapsed ? 'collapsed' : 'expanded'} {...mergeSurfaceProps(stylex.props(s.provider), className, style)}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* Parts                                                                                            */
/* ------------------------------------------------------------------------------------------------ */

type PartProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

export type SidebarProps = Omit<PartProps, 'ref'> & {
  /** `floating`: a raised surface 8px from the frame. `docked`: full height with an edge hairline. */
  variant?: 'floating' | 'docked';
  /** Names the navigation landmark, and titles the mobile sheet. */
  label?: string;
  ref?: Ref<HTMLElement>;
};

/** The navigation panel. Below 768px it renders inside a left Sheet. */
export function Sidebar({ variant = 'floating', label = 'Navigation', children, className, style, ref }: SidebarProps) {
  const { collapsed, isMobile, mobileOpen, setMobileOpen, panelId } = useSidebar();
  if (isMobile) {
    return (
      <Sheet isOpen={mobileOpen} onOpenChange={setMobileOpen} edge="left" size="sm" title={label} showCloseButton closeLabel={`Close ${label.toLowerCase()}`}>
        <PanelContext.Provider value={sheetPanel}>
          <nav id={panelId} ref={ref} aria-label={label} data-sidebar-mode="sheet" {...mergeSurfaceProps(stylex.props(s.sheetColumn), className, style)}>
            {children}
          </nav>
        </PanelContext.Provider>
      </Sheet>
    );
  }
  return (
    <PanelContext.Provider value={collapsed ? collapsedPanel : expandedPanel}>
      <nav
        id={panelId}
        ref={ref}
        aria-label={label}
        data-sidebar-state={collapsed ? 'collapsed' : 'expanded'}
        data-variant={variant}
        {...mergeSurfaceProps(stylex.props(s.panel, variant === 'floating' ? s.floating : s.docked, collapsed && s.panelCollapsed), className, style)}
      >
        {children}
      </nav>
    </PanelContext.Provider>
  );
}

export type SidebarHeaderProps = PartProps & {
  /** An Avatar or logo, centered on the icon column. Keep it 24 to 32px. */
  logo?: ReactNode;
  /** The product or workspace name beside the logo. */
  title?: ReactNode;
  /** A second line under the title, 12/16 in fg-muted. */
  description?: ReactNode;
};

/** The brand row on top. Its words fold away with the labels; extra children are inert while collapsed. */
export function SidebarHeader({ logo, title, description, children, className, style, ref }: SidebarHeaderProps) {
  const { collapsed } = useContext(PanelContext);
  const hasText = title != null || description != null;
  return (
    <div ref={ref} {...mergeSurfaceProps(stylex.props(s.header), className, style)}>
      {(logo != null || hasText) && (
        <div {...stylex.props(s.brand)}>
          <span {...stylex.props(s.logo)}>{logo}</span>
          {hasText && (
            <span {...stylex.props(s.brandText, s.fade, collapsed && s.fadeOut)}>
              {title != null && <span {...stylex.props(s.brandTitle)}>{title}</span>}
              {description != null && <span {...stylex.props(s.brandDescription)}>{description}</span>}
            </span>
          )}
        </div>
      )}
      {children != null && <div inert={collapsed || undefined} {...stylex.props(s.fade, collapsed && s.fadeOut)}>{children}</div>}
    </div>
  );
}

/** The scrolling middle of the panel. Holds SidebarSections. */
export function SidebarContent({ children, className, style, ref }: PartProps) {
  const { collapsed, inSheet } = useContext(PanelContext);
  return (
    <div ref={ref} {...mergeSurfaceProps(stylex.props(s.content, collapsed && s.contentCollapsed, inSheet && s.contentSheet), className, style)}>
      {children}
    </div>
  );
}

export type SidebarSectionProps = PartProps & {
  /** A heading for the group, 12/16 500 in fg-muted. While collapsed it becomes a hairline. */
  label?: ReactNode;
};

/** A list of SidebarItems, optionally under a label. */
export function SidebarSection({ label, children, className, style, ref }: SidebarSectionProps) {
  const { collapsed } = useContext(PanelContext);
  const labelId = useId();
  const labeled = label != null;
  return (
    <div
      ref={ref}
      role={labeled ? 'group' : undefined}
      aria-labelledby={labeled ? labelId : undefined}
      {...mergeSurfaceProps(stylex.props(s.section), className, style)}
    >
      {labeled && (
        <div {...stylex.props(s.sectionLabel)}>
          <span aria-hidden="true" {...stylex.props(s.hairline, s.reveal, collapsed && s.revealShown)} />
          <span id={labelId} {...stylex.props(s.sectionText, s.fade, collapsed && s.fadeOut)}>{label}</span>
        </div>
      )}
      <ListContext.Provider value={true}>
        <ul {...stylex.props(s.list)}>{children}</ul>
      </ListContext.Provider>
    </div>
  );
}

type RowState = { isHovered: boolean; isPressed: boolean; isFocusVisible: boolean; isDisabled: boolean };

function rowClassName(isCurrent: boolean, className?: string) {
  return ({ isHovered, isPressed, isFocusVisible, isDisabled }: RowState) => withClassName(stylex.props(
    s.item, transitionStyles.colors,
    isCurrent && s.itemCurrent,
    isHovered && !isDisabled && (isCurrent ? s.itemCurrentHovered : s.itemHovered),
    isPressed && !isDisabled && s.itemPressed,
    isDisabled && s.itemDisabled,
    // Inset ring: rows sit 2px apart and clip their content.
    isFocusVisible && focusStyles.ringInsetOverlay,
  ), className);
}

export type SidebarItemProps = {
  /** The 16px glyph: an Icon name or an element. It stays visible while the panel is collapsed. */
  icon: IconName | ReactElement;
  /** The label. Visually hidden while collapsed, and shown in a tooltip then. */
  children: ReactNode;
  /** Renders a link to this URL. Leave it out for a button. */
  href?: string;
  /** The link's target, with `href`. */
  target?: string;
  /** The link's rel, with `href`. */
  rel?: string;
  /** Called on click, tap or Enter. Below the breakpoint the sheet also closes. */
  onPress?: () => void;
  /** Marks the current page: the bg-interactive-primary fill, weight 500 and `aria-current="page"`. */
  isCurrent?: boolean;
  /** A count at the end of the row. While collapsed it becomes a dot on the icon. */
  badge?: ReactNode;
  /** Words for the badge, read after the label instead of the bare count: "4 unread". */
  badgeLabel?: string;
  isDisabled?: boolean;
  className?: string;
  style?: CSSProperties;
  /** The link or button element. */
  ref?: Ref<HTMLElement>;
};

/** One destination: a link with `href`, otherwise a button. */
export function SidebarItem({
  icon, children, href, target, rel, onPress, isCurrent = false, badge, badgeLabel, isDisabled = false, className, style, ref,
}: SidebarItemProps) {
  const { collapsed, inSheet } = useContext(PanelContext);
  const { setMobileOpen } = useSidebar();
  const inList = useContext(ListContext);
  const Wrap = inList ? 'li' : 'div';
  const press = () => {
    onPress?.();
    if (inSheet) setMobileOpen(false);
  };
  const hasBadge = badge != null && badge !== false;
  const body = <>
    <span {...stylex.props(s.itemIcon)}>
      {typeof icon === 'string' ? <Icon name={icon} size={16} /> : icon}
      {hasBadge && <span aria-hidden="true" data-sidebar-dot {...stylex.props(s.dot, s.reveal, collapsed && s.revealShown)} />}
    </span>
    <span data-sidebar-label {...stylex.props(s.label, s.fade, collapsed && s.fadeOut)}>{children}</span>
    {hasBadge && <span aria-hidden={badgeLabel ? true : undefined} {...stylex.props(s.count, s.fade, collapsed && s.fadeOut)}>{badge}</span>}
    {hasBadge && badgeLabel && <span {...stylex.props(s.srOnly)}>{`, ${badgeLabel}`}</span>}
  </>;
  const shared = {
    isDisabled,
    onPress: press,
    'aria-current': isCurrent ? 'page' as const : undefined,
    className: rowClassName(isCurrent, className),
    style,
  };
  const trigger = href !== undefined
    ? <AriaLink {...shared} ref={ref as Ref<HTMLAnchorElement>} href={href} target={target} rel={rel}>{body}</AriaLink>
    : <AriaButton {...shared} ref={ref as Ref<HTMLButtonElement>}>{body}</AriaButton>;
  // The tooltip clears the panel: 8px from the row to the panel edge, then the standard 6px offset (spec 1.9).
  return (
    <Wrap {...stylex.props(s.itemWrap)}>
      <Tooltip trigger={trigger} placement="right" offset={14} isDisabled={!collapsed || isDisabled}>{children}</Tooltip>
    </Wrap>
  );
}

/** The bottom row, under a hairline: the collapse button, settings or an account. */
export function SidebarFooter({ children, className, style, ref }: PartProps) {
  return <div ref={ref} {...mergeSurfaceProps(stylex.props(s.footer), className, style)}>{children}</div>;
}

export type SidebarCollapseButtonProps = {
  /** The row's label while expanded. Default "Collapse". */
  collapseLabel?: string;
  /** The button's name and tooltip while collapsed. Default "Expand". */
  expandLabel?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLButtonElement>;
};

/** Folds and unfolds the panel. Hidden in the mobile sheet. */
export function SidebarCollapseButton({ collapseLabel = 'Collapse', expandLabel = 'Expand', className, style, ref }: SidebarCollapseButtonProps) {
  const { collapsed, inSheet } = useContext(PanelContext);
  const { setCollapsed, panelId, keyboardShortcut } = useSidebar();
  // React Aria's Button does not forward aria-keyshortcuts, so it is set on the element.
  const apple = useIsApple();
  const keys = keyboardShortcut ? (apple ? 'Meta+B' : 'Control+B') : null;
  const setButton = useCallback((node: HTMLButtonElement | null) => {
    if (node) {
      if (keys) node.setAttribute('aria-keyshortcuts', keys);
      else node.removeAttribute('aria-keyshortcuts');
    }
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [keys, ref]);
  if (inSheet) return null;
  const name = collapsed ? expandLabel : collapseLabel;
  const trigger = (
    <AriaButton
      ref={setButton}
      aria-label={name}
      aria-expanded={!collapsed}
      aria-controls={panelId}
      onPress={() => setCollapsed(!collapsed)}
      className={rowClassName(false, className)}
      style={style}
    >
      <span {...stylex.props(s.itemIcon)}><Icon name="panel-left" size={16} /></span>
      {/* The visible word stays "Collapse": it is only seen while expanded, and fades out unchanged. */}
      <span aria-hidden="true" {...stylex.props(s.label, s.fade, collapsed && s.fadeOut)}>{collapseLabel}</span>
      {keyboardShortcut && <span aria-hidden="true" {...stylex.props(s.shortcut, s.fade, collapsed && s.fadeOut)}>{apple ? '⌘B' : 'Ctrl+B'}</span>}
    </AriaButton>
  );
  return <Tooltip trigger={trigger} placement="right" offset={14} isDisabled={!collapsed}>{expandLabel}</Tooltip>;
}

/** The page area beside the sidebar. It fills the rest of the row and scrolls on its own. */
export function SidebarInset({ children, className, style, ref }: PartProps) {
  return <div ref={ref} {...mergeSurfaceProps(stylex.props(s.inset), className, style)}>{children}</div>;
}

export type SidebarTriggerProps = {
  /** The button's accessible name. Default "Open navigation". */
  label?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLButtonElement>;
};

/** Opens the mobile sheet. Renders nothing at desktop widths, where the panel is always on screen. */
export function SidebarTrigger({ label = 'Open navigation', className, style, ref }: SidebarTriggerProps) {
  const { isMobile, mobileOpen, setMobileOpen } = useSidebar();
  if (!isMobile) return null;
  return (
    <Button
      ref={ref}
      appearance="text"
      size="sm"
      iconOnly
      aria-label={label}
      aria-expanded={mobileOpen}
      aria-haspopup="dialog"
      onClick={() => setMobileOpen(true)}
      className={className}
      style={style}
    >
      <Icon name="panel-left" size={16} />
    </Button>
  );
}
