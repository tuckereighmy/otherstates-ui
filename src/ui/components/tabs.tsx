'use client';

import * as stylex from '@stylexjs/stylex';
import { createContext, useContext, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref, type RefObject } from 'react';
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type TabListProps as AriaTabListProps,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  type TabsProps as AriaTabsProps,
} from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import { withClassName } from './internal/class-name';
import { gapStyles, heightStyles, normalizeSize, rectPaddingStyles, textStyles, type ControlSize, type ControlSizeProp } from './internal/size';
import { advanceChoiceSpring } from './internal/spring';
import { disabledStyles, focusStyles, hoverStyles, transitionStyles } from './internal/states';
import { surfaceStyles } from './internal/surface';

const reduce = '@media (prefers-reduced-motion: reduce)';
const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  root: { display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0, fontFamily: t['--os-font-family'] },
  rootVertical: { flexDirection: 'row', alignItems: 'flex-start', gap: t['--os-space-4'] },

  // `tile`: tabs on a bg-muted track, the selected one on a raised tile (spec 1.8 Selected 1).
  list: { position: 'relative', width: 'fit-content', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' },
  listVertical: { flexDirection: 'column', alignItems: 'stretch', flexShrink: 0 },
  // `underline`: a hairline separates the list from its panel; the selected tab carries a 2px line.
  underlineList: {
    position: 'relative', display: 'flex', alignItems: 'stretch', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: t['--os-color-border-subtle'],
  },
  underlineListVertical: {
    flexDirection: 'column', flexShrink: 0, borderBottomWidth: 0,
    borderInlineEndWidth: 1, borderInlineEndStyle: 'solid', borderInlineEndColor: t['--os-color-border-subtle'],
  },

  tab: {
    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1 1 auto', minWidth: 0,
    boxSizing: 'border-box', cursor: 'pointer', outlineStyle: 'none', fontFamily: t['--os-font-family'],
  },
  tabStart: { justifyContent: 'flex-start' },
  tabUnderline: { flex: '0 1 auto', borderRadius: t['--os-radius-control'] },
  selected: { color: t['--os-color-fg-base'] },
  // Coarse-pointer hit areas (spec 1.14), along the free axis only: neighbors sit 2px apart.
  hitBlock: {
    '::after': {
      content: '""', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: '100%', height: { default: '100%', [coarse]: 'max(100%, 44px)' },
    },
  },
  hitInline: {
    '::after': {
      content: '""', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      height: '100%', width: { default: '100%', [coarse]: 'max(100%, 44px)' },
    },
  },
  icon: { position: 'relative', display: 'inline-flex', flexShrink: 0 },
  label: { position: 'relative', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  indicatorMotion: {
    pointerEvents: 'none',
    transitionProperty: { default: 'translate, width, height', [reduce]: 'none' },
    transitionDuration: t['--os-motion-slow'], transitionTimingFunction: t['--os-ease-settle'],
  },
  tile: {
    position: 'absolute', insetBlockStart: 0, insetInlineStart: 0, width: '100%', height: '100%', borderRadius: 'inherit',
    backgroundColor: t['--os-color-bg-raised'], boxShadow: t['--os-shadow-control'],
    outlineStyle: { default: 'none', '@media (forced-colors: active)': 'solid' },
    outlineColor: { default: 'transparent', '@media (forced-colors: active)': 'Highlight' },
    outlineWidth: 1, outlineOffset: -1,
  },
  tileDisabled: { boxShadow: 'none' },
  underline: {
    position: 'absolute', insetInlineStart: 0, insetBlockEnd: -1, width: '100%', height: 2,
    borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-fg-base'],
  },
  underlineVertical: { insetInlineStart: 'auto', insetInlineEnd: -1, insetBlockStart: 0, insetBlockEnd: 'auto', width: 2, height: '100%' },
  underlineDisabled: { backgroundColor: t['--os-color-fg-disabled'] },

  panel: {
    paddingBlock: t['--os-space-4'], borderRadius: t['--os-radius-md'], outlineStyle: 'none', color: t['--os-color-fg-base'],
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
  panelVertical: { paddingBlock: 0, flex: '1 1 0', minWidth: 0 },
  noPanel: { paddingBlock: 0 },

  // ExpandingTabs: md 40 rows on the shared track (spec 1.8 Selected 1): bg-muted, padding 4,
  // gap 2, radius control + 6 (lg at a corner ladder, a pill at Round), with a spring-driven tile that takes
  // the nesting rule, control + 2, like every tile on a track.
  expandingRoot: { alignItems: 'stretch' },
  expandingWrap: { position: 'relative', display: 'inline-flex', alignSelf: 'center', maxWidth: '100%', isolation: 'isolate' },
  expandingList: {
    position: 'relative', display: 'inline-flex', width: 'fit-content', maxWidth: '100%', minWidth: 0,
    gap: t['--os-space-0-5'], padding: t['--os-space-1'],
    borderRadius: `calc(${t['--os-radius-control']} + ${t['--os-space-1-5']})`, backgroundColor: t['--os-color-bg-muted'],
  },
  springTile: {
    position: 'absolute', left: 0, top: t['--os-space-1'], bottom: t['--os-space-1'],
    borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-control']} + ${t['--os-space-0-5']}))`,
    backgroundColor: t['--os-color-bg-raised'], boxShadow: t['--os-shadow-control'], pointerEvents: 'none', zIndex: 0,
  },
  springTilePosition: (x: number, width: number) => ({ transform: `translateX(${x}px)`, width }),
  expandingItem: {
    zIndex: 1, display: 'flex', position: 'relative', justifyContent: 'center', alignItems: 'center', flex: '0 1 auto', minWidth: 0,
    height: t['--os-size-md'], paddingInline: t['--os-space-3'],
    borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-control']} + ${t['--os-space-0-5']}))`, cursor: 'pointer', outlineStyle: 'none', color: t['--os-color-fg-base'],
    fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'], lineHeight: t['--os-line-height-md'],
    transitionProperty: 'color, padding',
    transitionDuration: { default: `${t['--os-motion-hover']}, ${t['--os-motion-slow']}`, [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-settle'],
  },
  expandingItemActive: { paddingInlineEnd: t['--os-space-4'] },
  expandingLabel: {
    position: 'relative', display: 'grid', gridTemplateColumns: '0fr',
    transitionProperty: 'grid-template-columns', transitionDuration: { default: t['--os-motion-slow'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-settle'],
  },
  expandingLabelOpen: { gridTemplateColumns: '1fr' },
  expandingLabelText: {
    whiteSpace: 'nowrap', overflow: 'hidden', paddingInlineStart: 0, opacity: 0, translate: '-8px 0',
    transitionProperty: 'opacity, translate, padding',
    transitionDuration: { default: `${t['--os-motion-hover']}, ${t['--os-motion-layout']}, ${t['--os-motion-slow']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  expandingLabelTextOpen: {
    opacity: 1, translate: '0 0', paddingInlineStart: t['--os-space-2'],
    transitionDuration: { default: `${t['--os-motion-layout']}, ${t['--os-motion-slow']}, ${t['--os-motion-slow']}`, [reduce]: '0ms' },
    transitionDelay: { default: `${t['--os-motion-hover']}, ${t['--os-motion-hover']}, 0ms`, [reduce]: '0ms' },
  },
  expandingIcon: { position: 'relative', display: 'grid', placeItems: 'center', width: 16, height: 16, flexShrink: 0 },
  // A count on the icon's top-end corner: a 16px pill, 12/16 at weight 600 (numeric emphasis, spec 1.4).
  badge: {
    position: 'absolute', insetBlockStart: `calc(-1 * ${t['--os-space-1']})`, insetInlineEnd: `calc(-1 * ${t['--os-space-2']})`,
    display: 'grid', placeItems: 'center', height: 16, minWidth: 16, paddingInline: t['--os-space-1'], boxSizing: 'border-box',
    borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-bg-notification'], color: t['--os-color-fg-static-light'],
    fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], fontWeight: t['--os-font-weight-semibold'], fontVariantNumeric: 'tabular-nums', letterSpacing: 0,
  },
  dotBadge: { width: 8, height: 8, minWidth: 8, paddingInline: 0, insetBlockStart: 0, insetInlineEnd: `calc(-1 * ${t['--os-space-1']})` },
  expandingPanel: { order: -1 },
});

// A vertical panel starts level with the first tab's label: half of what the tab height adds to the panel's
// 20px line, plus the track padding (tile only).
const tilePanelOffset = stylex.create({
  xs: { paddingBlockStart: `calc((${t['--os-size-xs']} - ${t['--os-line-height-md']}) / 2 + ${t['--os-space-1']})` },
  sm: { paddingBlockStart: `calc((${t['--os-size-sm']} - ${t['--os-line-height-md']}) / 2 + ${t['--os-space-1']})` },
  md: { paddingBlockStart: `calc((${t['--os-size-md']} - ${t['--os-line-height-md']}) / 2 + ${t['--os-space-1']})` },
  lg: { paddingBlockStart: `calc((${t['--os-size-lg']} - ${t['--os-line-height-md']}) / 2 + ${t['--os-space-1']})` },
  xl: { paddingBlockStart: `calc((${t['--os-size-xl']} - ${t['--os-line-height-md']}) / 2 + ${t['--os-space-1']})` },
});
const underlinePanelOffset = stylex.create({
  xs: { paddingBlockStart: `calc((${t['--os-size-xs']} - ${t['--os-line-height-md']}) / 2)` },
  sm: { paddingBlockStart: `calc((${t['--os-size-sm']} - ${t['--os-line-height-md']}) / 2)` },
  md: { paddingBlockStart: `calc((${t['--os-size-md']} - ${t['--os-line-height-md']}) / 2)` },
  lg: { paddingBlockStart: `calc((${t['--os-size-lg']} - ${t['--os-line-height-md']}) / 2)` },
  xl: { paddingBlockStart: `calc((${t['--os-size-xl']} - ${t['--os-line-height-md']}) / 2)` },
});

type Variant = 'tile' | 'underline';
type Orientation = 'horizontal' | 'vertical';
type IndicatorGeometry = { left: number; top: number; width: number; height: number };
type TabsVisual = { variant: Variant; size: ControlSize; orientation: Orientation; memory?: { current: IndicatorGeometry | null } };
const TabsVisualContext = createContext<TabsVisual>({ variant: 'tile', size: 'md', orientation: 'horizontal' });

// The selected tab's tile (or underline). It remembers where the selected tab sat inside its list, and when another
// tab takes over it slides from there. Positions are measured against the list, never the viewport: when the panel
// below changes height and the whole tab row moves (a vertically centered container, a dialog), the tile still
// travels only along the row and never leaves the track.
function TabIndicator({ isDisabled }: { isDisabled: boolean }) {
  const { variant, orientation, memory } = useContext(TabsVisualContext);
  const ref = useRef<HTMLSpanElement>(null);
  const underline = variant === 'underline';
  const vertical = orientation === 'vertical';
  useLayoutEffect(() => {
    const el = ref.current;
    const tab = el?.parentElement;
    const list = tab?.closest('[role="tablist"]');
    if (!el || !tab || !list || !memory || typeof tab.getBoundingClientRect !== 'function') return;
    const measure = (): IndicatorGeometry => {
      const a = tab.getBoundingClientRect(), b = list.getBoundingClientRect();
      return { left: a.left - b.left, top: a.top - b.top, width: a.width, height: a.height };
    };
    const from = memory.current;
    const to = measure();
    const moved = from && (from.left !== to.left || from.top !== to.top || from.width !== to.width || from.height !== to.height);
    if (from && moved && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.transition = 'none';
      el.style.translate = `${from.left - to.left}px ${from.top - to.top}px`;
      if (!underline || !vertical) el.style.width = `${from.width}px`;
      if (!underline || vertical) el.style.height = `${from.height}px`;
      el.getBoundingClientRect();
      el.style.transition = el.style.translate = el.style.width = el.style.height = '';
    }
    memory.current = to;
    const observer = new ResizeObserver(() => { memory.current = measure(); });
    observer.observe(tab);
    observer.observe(list);
    return () => observer.disconnect();
  }, [memory, underline, vertical]);
  return (
    <span ref={ref} aria-hidden="true" data-tab-indicator {...stylex.props(
      s.indicatorMotion,
      underline ? [s.underline, vertical && s.underlineVertical, isDisabled && s.underlineDisabled] : [s.tile, isDisabled && s.tileDisabled],
    )} />
  );
}

export type TabItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  /** ExpandingTabs only: a count or a dot on the icon. Counts are read out with the label. */
  badge?: 'dot' | number;
  content: ReactNode;
  disabled?: boolean;
};

function badgeLabel(item: TabItem) {
  return typeof item.badge === 'number' ? `${item.label}, ${item.badge} notifications` : undefined;
}

export type TabListProps<T extends object = object> = Omit<AriaTabListProps<T>, 'className' | 'style'> & {
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

/** The row (or column) of tabs. Name it with `aria-label`. */
export function TabList<T extends object>({ className, style, ...props }: TabListProps<T>) {
  const { variant, orientation } = useContext(TabsVisualContext);
  const vertical = orientation === 'vertical';
  const styles = variant === 'underline'
    ? stylex.props(s.underlineList, vertical && s.underlineListVertical)
    : stylex.props(surfaceStyles.track, s.list, vertical && s.listVertical);
  return <AriaTabList {...props} className={withClassName(styles, className)} style={style} />;
}

export type TabProps = Omit<AriaTabProps, 'className' | 'style' | 'children'> & {
  /** An icon before the label. Size it to the tabs: 14 for `xs`, 16 for `sm` and `md`, 18 for `lg`, 20 for `xl`. */
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

/** One tab. Its `id` matches the `id` of its TabPanel. */
export function Tab({ icon, children, className, style, ...props }: TabProps) {
  const { variant, size, orientation } = useContext(TabsVisualContext);
  const vertical = orientation === 'vertical';
  const underline = variant === 'underline';
  return (
    <AriaTab
      {...props}
      style={style}
      className={({ isSelected, isDisabled, isFocusVisible }) => withClassName(stylex.props(
        s.tab, heightStyles[size], rectPaddingStyles[size], gapStyles[size], textStyles[size],
        underline ? s.tabUnderline : surfaceStyles.tileRadius,
        vertical && s.tabStart,
        transitionStyles.colors, hoverStyles.text,
        isSelected && s.selected,
        isDisabled && disabledStyles.text,
        vertical ? s.hitInline : s.hitBlock,
        // Inset ring: neighbors sit 2px away, and the tile would paint over an outline.
        isFocusVisible && focusStyles.ringInsetOverlay,
      ), className)}
    >
      {({ isDisabled, isSelected }) => <>
        {isSelected && <TabIndicator isDisabled={isDisabled} />}
        {icon != null && <span {...stylex.props(s.icon)}>{icon}</span>}
        {children != null && <span {...stylex.props(s.label)}>{children}</span>}
      </>}
    </AriaTab>
  );
}

export type TabPanelProps = Omit<AriaTabPanelProps, 'className' | 'style'> & {
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

/** The content for the tab with the same `id`. */
function panelLayout({ variant, size, orientation }: TabsVisual) {
  return orientation === 'vertical' && [s.panelVertical, (variant === 'underline' ? underlinePanelOffset : tilePanelOffset)[size]];
}

export function TabPanel({ className, style, ...props }: TabPanelProps) {
  const visual = useContext(TabsVisualContext);
  return <AriaTabPanel {...props} style={style} className={({ isFocusVisible }) => withClassName(stylex.props(s.panel, panelLayout(visual), isFocusVisible && focusStyles.ring), className)} />;
}

function ItemPanel({ item, expanding = false }: { item: TabItem; expanding?: boolean }) {
  const visual = useContext(TabsVisualContext);
  return (
    // An item without content gets a hidden panel, so it is not an empty tab stop.
    <AriaTabPanel id={item.id} hidden={item.content == null} className={({ isFocusVisible }) => stylex.props(s.panel, panelLayout(visual), expanding && s.expandingPanel, item.content == null && s.noPanel, isFocusVisible && focusStyles.ring).className ?? ''}>
      {item.content}
    </AriaTabPanel>
  );
}

type Selection = {
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (key: string) => void;
};

export type TabsProps = Omit<AriaTabsProps, 'className' | 'style' | 'children' | 'render' | 'selectedKey' | 'defaultSelectedKey' | 'onSelectionChange' | 'orientation'> & Selection & {
  /** Names the tab list when you pass `items`. With `children`, put `aria-label` on TabList. */
  label?: string;
  /** Tabs and panels from data. Leave it out to compose TabList, Tab and TabPanel yourself. */
  items?: TabItem[];
  children?: ReactNode;
  /** `tile` (default): tabs on a track. `underline`: a line under the selected tab. */
  variant?: Variant;
  /** Height of each tab on the control scale. Default `md` (40). */
  size?: ControlSizeProp;
  orientation?: Orientation;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

/** Panels on one page, one visible at a time, chosen with a row of tabs. */
export function Tabs({ label, items, children, variant = 'tile', size: sizeProp, orientation = 'horizontal', onSelectionChange, className, style, ...props }: TabsProps) {
  const memory = useRef<IndicatorGeometry | null>(null);
  const visual = { variant, size: normalizeSize(sizeProp, 'md'), orientation, memory };
  const root = stylex.props(s.root, orientation === 'vertical' && s.rootVertical);
  return (
    <TabsVisualContext.Provider value={visual}>
      <AriaTabs {...props} orientation={orientation} onSelectionChange={key => onSelectionChange?.(String(key))} className={withClassName(root, className)} style={style}>
        {items ? <>
          <TabList aria-label={label} items={items}>
            {item => <Tab id={item.id} icon={item.icon} isDisabled={item.disabled} aria-label={badgeLabel(item)}>{item.label}</Tab>}
          </TabList>
          {items.map(item => <ItemPanel key={item.id} item={item} />)}
        </> : children}
      </AriaTabs>
    </TabsVisualContext.Provider>
  );
}

function TabGlyph({ icon, badge }: { icon?: ReactNode; badge?: 'dot' | number }) {
  return <span {...stylex.props(s.expandingIcon)}>{icon ?? <Icon name="grid" size={16} />}{badge !== undefined && <span aria-hidden="true" {...stylex.props(s.badge, badge === 'dot' && s.dotBadge)}>{badge === 'dot' ? null : badge}</span>}</span>;
}

function SpringTabTile({ list, selection }: { list: RefObject<HTMLDivElement | null>; selection?: string }) {
  const motion = useRef<{ x: { position: number; velocity: number }; width: { position: number; velocity: number } } | null>(null);
  const [geometry, setGeometry] = useState({ x: 4, width: 0 });
  useLayoutEffect(() => {
    const container = list.current; if (!container) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, last = 0, quiet = 0;
    const target = () => { const tab = container.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]'); return tab ? { x: tab.offsetLeft, width: tab.offsetWidth } : null; };
    const snap = () => { const next = target(); if (!next) return; motion.current = { x: { position: next.x, velocity: 0 }, width: { position: next.width, velocity: 0 } }; setGeometry(next); };
    const update = (now: number) => {
      frame = 0; const next = target(); if (!next) return;
      if (media.matches || !motion.current) { snap(); return; }
      const seconds = last ? Math.min(.032, (now - last) / 1000) : 1 / 60; last = now;
      // Damping ratio .8: the tile travels a tab's width or more, so it settles with under 2% overshoot (no bounce on large travel).
      const damping = 2 * Math.sqrt(260) * .8;
      motion.current = { x: advanceChoiceSpring(motion.current.x, next.x, 260, damping, seconds, 1), width: advanceChoiceSpring(motion.current.width, next.width, 260, damping, seconds, 1) };
      const { x, width } = motion.current;
      setGeometry({ x: x.position, width: width.position });
      const settled = Math.abs(x.position - next.x) < .2 && Math.abs(width.position - next.width) < .2 && Math.abs(x.velocity) < 2 && Math.abs(width.velocity) < 2;
      quiet = settled ? quiet + 1 : 0;
      if (quiet < 6) frame = requestAnimationFrame(update); else snap();
    };
    const start = () => { if (media.matches) { snap(); return; } if (!frame) { last = 0; quiet = 0; frame = requestAnimationFrame(update); } };
    if (!motion.current) snap(); else start();
    const observer = new ResizeObserver(start); observer.observe(container); Array.from(container.children).forEach(child => observer.observe(child));
    const preference = () => { if (media.matches) { cancelAnimationFrame(frame); frame = 0; snap(); } else start(); }; media.addEventListener('change', preference);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); media.removeEventListener('change', preference); };
  }, [list, selection]);
  return <span aria-hidden="true" data-tab-spring-tile {...stylex.props(s.springTile, s.springTilePosition(geometry.x, geometry.width))} />;
}

export type ExpandingTabsProps = Selection & {
  label: string;
  items: TabItem[];
  /** Shows the selected tab's label beside its icon. Default true. */
  showLabels?: boolean;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

/** Compact icon tabs whose selected tab expands to show its label. */
export function ExpandingTabs({ label, items, defaultSelectedKey, selectedKey, onSelectionChange, showLabels = true, className, style, ref }: ExpandingTabsProps) {
  const list = useRef<HTMLDivElement>(null);
  const [internalKey, setInternalKey] = useState(defaultSelectedKey ?? items.find(item => !item.disabled)?.id);
  const key = selectedKey ?? internalKey;
  const root = stylex.props(s.root, s.expandingRoot);
  return (
    <TabsVisualContext.Provider value={{ variant: 'tile', size: 'md', orientation: 'horizontal' }}>
      <AriaTabs ref={ref} className={withClassName(root, className)} style={style} selectedKey={key} onSelectionChange={next => { if (selectedKey === undefined) setInternalKey(String(next)); onSelectionChange?.(String(next)); }}>
        <div {...stylex.props(s.expandingWrap)}>
          <AriaTabList ref={list} aria-label={label} items={items} {...stylex.props(s.expandingList)}>
            {item => (
              <AriaTab id={item.id} isDisabled={item.disabled} aria-label={badgeLabel(item) ?? item.label} className={({ isSelected, isDisabled, isFocusVisible }) => stylex.props(s.expandingItem, isSelected && s.expandingItemActive, isDisabled && disabledStyles.text, s.hitBlock, isFocusVisible && focusStyles.ringInsetOverlay).className ?? ''}>
                {({ isSelected }) => <>
                  <TabGlyph icon={item.icon} badge={item.badge} />
                  {showLabels && <span {...stylex.props(s.expandingLabel, isSelected && s.expandingLabelOpen)}><span {...stylex.props(s.expandingLabelText, isSelected && s.expandingLabelTextOpen)}>{item.label}</span></span>}
                </>}
              </AriaTab>
            )}
          </AriaTabList>
          <SpringTabTile list={list} selection={key} />
        </div>
        {items.map(item => <ItemPanel key={item.id} item={item} expanding />)}
      </AriaTabs>
    </TabsVisualContext.Provider>
  );
}
