'use client';

import * as stylex from '@stylexjs/stylex';
import { Children, createContext, isValidElement, useContext, useLayoutEffect, useRef, useState, type ComponentPropsWithRef, type CSSProperties, type ReactNode } from 'react';
import { Radio, RadioGroup, ToggleButton as AriaToggleButton, ToggleButtonGroup as AriaToggleButtonGroup } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Icon, type IconName } from './Icon';
import { withClassName } from './internal/class-name';
import { gapStyles, heightStyles, normalizeSize, pillPaddingStyles, radiusStyles, rectPaddingStyles, squareStyles, textStyles, type ControlSize, type ControlSizeProp } from './internal/size';
import { useChoiceSpring } from './internal/spring';
import { disabledStyles, focusStyles, hoverStyles, pressStyles, transitionStyles } from './internal/states';
import { surfaceStyles } from './internal/surface';

const reduce = '@media (prefers-reduced-motion: reduce)';
const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  item: {
    position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    boxSizing: 'border-box', borderWidth: 0, fontFamily: t['--os-font-family'], whiteSpace: 'nowrap',
    textDecoration: 'none', cursor: 'pointer', outlineStyle: 'none',
  },
  /** Items on a track: text-only hover (fg-muted -> fg-base), no fill of their own. Nesting rule against the track. */
  pill: { borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-control']} + 2px))`, backgroundColor: 'transparent' },
  pillSelected: { color: t['--os-color-fg-base'] },
  /** Items in a raised or flush group: transparent compact controls (hover bg-interactive-primary). */
  plain: { color: t['--os-color-fg-base'] },
  plainPressed: { backgroundColor: t['--os-color-bg-interactive-secondary'] },
  toggledPressed: { backgroundColor: t['--os-color-accent-strong'] },
  // Coarse-pointer hit area (spec 1.14). Neighbors sit 2px apart, so it grows only across the group.
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
  /** The selected tile of a pill (spec 1.8 Selected 1): bg-raised plus shadow-control, springs in. */
  fill: {
    position: 'absolute', inset: 0, borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-control']} + 2px))`, pointerEvents: 'none',
    backgroundColor: t['--os-color-bg-raised'], boxShadow: t['--os-shadow-control'],
    opacity: 0, scale: '.7',
    transitionProperty: { default: 'opacity, scale, inset, border-radius, background-color', [reduce]: 'opacity' },
    transitionDuration: { default: t['--os-motion-popup'], [reduce]: t['--os-motion-press'] },
    transitionTimingFunction: t['--os-ease-spring'],
  },
  fillOn: { opacity: 1, scale: '1' },
  // bg-disabled equals the bg-muted track, so a disabled selected tile keeps bg-raised and drops its shadow.
  fillDisabled: { boxShadow: 'none' },
  // Neighboring selected pills join into one run: the tile reaches into the 2px gap and squares off.
  joinStart: { insetInlineStart: -1, borderStartStartRadius: 0, borderEndStartRadius: 0 },
  joinEnd: { insetInlineEnd: -1, borderStartEndRadius: 0, borderEndEndRadius: 0 },
  joinTop: { insetBlockStart: -1, borderStartStartRadius: 0, borderStartEndRadius: 0 },
  joinBottom: { insetBlockEnd: -1, borderEndStartRadius: 0, borderEndEndRadius: 0 },
  content: { position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'inherit' },
  separator: { flexShrink: 0, alignSelf: 'center', backgroundColor: t['--os-color-border-muted'] },
  separatorVertical: { width: 1, marginInline: t['--os-space-1'] },
  separatorHorizontal: { height: 1, marginBlock: t['--os-space-1'] },
});

// A separator is half the item height, like GroupSeparator and ToolbarSeparator (12 / 16 / 20 / 22 / 24).
const separatorLength = stylex.create({
  xs: { height: `calc(${t['--os-size-xs']} / 2)` },
  sm: { height: `calc(${t['--os-size-sm']} / 2)` },
  md: { height: `calc(${t['--os-size-md']} / 2)` },
  lg: { height: `calc(${t['--os-size-lg']} / 2)` },
  xl: { height: `calc(${t['--os-size-xl']} / 2)` },
});
const separatorWidth = stylex.create({
  xs: { width: `calc(${t['--os-size-xs']} / 2)` },
  sm: { width: `calc(${t['--os-size-sm']} / 2)` },
  md: { width: `calc(${t['--os-size-md']} / 2)` },
  lg: { width: `calc(${t['--os-size-lg']} / 2)` },
  xl: { width: `calc(${t['--os-size-xl']} / 2)` },
});

// The control heights (spec 1.2) as a minimum width, so a short label never draws narrower than square.
const minWidthStyles = stylex.create({
  xs: { minWidth: t['--os-size-xs'] },
  sm: { minWidth: t['--os-size-sm'] },
  md: { minWidth: t['--os-size-md'] },
  lg: { minWidth: t['--os-size-lg'] },
  xl: { minWidth: t['--os-size-xl'] },
});

type Look = 'pills' | 'raised' | 'flush';
type Orientation = 'horizontal' | 'vertical';
type GroupVisual = { look: Look; size: ControlSize; orientation: Orientation; selected: Set<string>; order: string[] };
const ToggleGroupVisual = createContext<GroupVisual>({ look: 'pills', size: 'sm', orientation: 'horizontal', selected: new Set(), order: [] });

/** The id an item answers to, also when it is wrapped (in a Tooltip trigger, for example). */
function itemId(node: ReactNode, depth = 0): string {
  if (!isValidElement(node) || depth > 3) return '';
  const props = node.props as { id?: string | number; trigger?: ReactNode; children?: ReactNode };
  if (props.id != null) return String(props.id);
  return itemId(props.trigger, depth + 1) || itemId(props.children, depth + 1);
}

/** True when the item shows only an icon (a single element child), so it is drawn square. */
function onlyIcon(children: unknown): boolean {
  return isValidElement(children) && typeof children.type !== 'symbol';
}

export type ToggleGroupProps = Omit<ComponentPropsWithRef<typeof AriaToggleButtonGroup>, 'className' | 'render'> & {
  className?: string;
  /**
   * `pills` (default): pills on a bg-muted track. `raised`: transparent items in a raised group shell.
   * `flush`: the same items with no shell. `outline` is the old name of `raised`.
   */
  variant?: 'pills' | 'raised' | 'flush' | 'outline';
  /** Height of each item on the control scale. The pill track adds 4px around them. Default `sm` (32 in a 40 track). */
  size?: ControlSizeProp;
};

export function ToggleGroup({ orientation = 'horizontal', selectionMode = 'multiple', variant = 'pills', size: sizeProp, className, selectedKeys, defaultSelectedKeys, onSelectionChange, children, ...props }: ToggleGroupProps) {
  const size = normalizeSize(sizeProp, 'sm');
  const look: Look = variant === 'outline' ? 'raised' : variant;
  const [localKeys, setLocalKeys] = useState(new Set(defaultSelectedKeys));
  const selected = new Set(Array.from(selectedKeys ?? localKeys).map(String));
  const order = Children.toArray(children as ReactNode).filter(isValidElement).map(child => child.type === ToggleGroupSeparator ? '' : itemId(child));
  const vertical = orientation === 'vertical';
  const styles = look === 'pills'
    ? stylex.props(surfaceStyles.track, surfaceStyles.trackPill, vertical && surfaceStyles.vertical)
    : stylex.props(surfaceStyles.surface, surfaceStyles.group, vertical && surfaceStyles.vertical, look === 'flush' && surfaceStyles.flush);
  return (
    <ToggleGroupVisual.Provider value={{ look, size, orientation, selected, order }}>
      <AriaToggleButtonGroup
        {...props}
        orientation={orientation}
        selectionMode={selectionMode}
        selectedKeys={selectedKeys ?? localKeys}
        onSelectionChange={keys => { setLocalKeys(keys); onSelectionChange?.(keys); }}
        className={withClassName(styles, className)}
      >
        {children}
      </AriaToggleButtonGroup>
    </ToggleGroupVisual.Provider>
  );
}

export type ToggleGroupItemProps = Omit<ComponentPropsWithRef<typeof AriaToggleButton>, 'className' | 'render'> & {
  className?: string;
  /** Draws the item square, with no inline padding. Default: true when the only child is an element, such as an Icon. */
  iconOnly?: boolean;
};

export function ToggleGroupItem({ className, children, iconOnly, ...props }: ToggleGroupItemProps) {
  const group = useContext(ToggleGroupVisual);
  const { look, size, orientation } = group;
  const pills = look === 'pills';
  const square = iconOnly ?? onlyIcon(children);
  const index = group.order.indexOf(String(props.id));
  const joinsBefore = index > 0 && group.selected.has(group.order[index - 1]);
  const joinsAfter = index >= 0 && group.selected.has(group.order[index + 1]);
  const vertical = orientation === 'vertical';
  return (
    <AriaToggleButton
      {...props}
      className={({ isSelected, isDisabled, isPressed, isFocusVisible }) => withClassName(stylex.props(
        s.item, heightStyles[size], minWidthStyles[size], gapStyles[size], textStyles[size],
        square ? squareStyles[size] : pills ? pillPaddingStyles[size] : rectPaddingStyles[size],
        pills ? s.pill : radiusStyles[size],
        transitionStyles.colorsAndPress,
        pills ? hoverStyles.text : [s.plain, hoverStyles.fill],
        isSelected && (pills ? s.pillSelected : surfaceStyles.toggled),
        isPressed && !isDisabled && (pills ? null : isSelected ? s.toggledPressed : s.plainPressed),
        isPressed && !isDisabled && pressStyles.scale,
        isDisabled && (isSelected && !pills ? disabledStyles.filled : disabledStyles.text),
        vertical ? s.hitInline : s.hitBlock,
        // Inset ring (neighbors 2px away). A toggled fill is the ring color, so it takes the outer ring.
        isFocusVisible && (pills ? focusStyles.ringInsetOverlay : isSelected ? focusStyles.ring : focusStyles.ringInset),
      ), className)}
    >
      {state => <>
        {pills && <span aria-hidden="true" {...stylex.props(
          s.fill,
          state.isSelected && s.fillOn,
          state.isSelected && state.isDisabled && s.fillDisabled,
          state.isSelected && joinsBefore && (vertical ? s.joinTop : s.joinStart),
          state.isSelected && joinsAfter && (vertical ? s.joinBottom : s.joinEnd),
        )}/>}
        <span {...stylex.props(s.content)}>{typeof children === 'function' ? children(state) : children}</span>
      </>}
    </AriaToggleButton>
  );
}

export type ToggleGroupSeparatorProps = { className?: string; style?: CSSProperties };

/** A hairline between runs of items. Decorative: neighboring selected pills do not join across it. */
export function ToggleGroupSeparator({ className, style }: ToggleGroupSeparatorProps) {
  const { size, orientation } = useContext(ToggleGroupVisual);
  const styles = orientation === 'vertical'
    ? stylex.props(s.separator, s.separatorHorizontal, separatorWidth[size])
    : stylex.props(s.separator, s.separatorVertical, separatorLength[size]);
  return <span aria-hidden="true" className={withClassName(styles, className)} style={{ ...styles.style, ...style }} />;
}

// FormatToggles: a card (padding 20, radius xl) holding two 40px tracks 12 apart and the sample text 16 below.
const format = stylex.create({
  root: {
    width: '100%', maxWidth: 340, minWidth: 0, boxSizing: 'border-box', padding: t['--os-space-5'],
    backgroundColor: t['--os-color-bg-surface'], color: t['--os-color-fg-base'], borderRadius: t['--os-radius-xl'], fontFamily: t['--os-font-family'],
  },
  controls: { display: 'flex', gap: t['--os-space-3'], alignItems: 'center', flexWrap: 'wrap' },
  // The alignment track (spec 1.8 Selected 1): bg-muted, padding 4, gap 2, radius control + 6; tiles control + 2.
  alignment: {
    display: 'inline-flex', position: 'relative', gap: t['--os-space-0-5'], padding: t['--os-space-1'],
    borderRadius: `calc(${t['--os-radius-control']} + ${t['--os-space-1-5']})`, backgroundColor: t['--os-color-bg-muted'],
  },
  radio: {
    display: 'grid', placeItems: 'center', width: t['--os-size-sm'], height: t['--os-size-sm'], position: 'relative', cursor: 'pointer',
    borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-control']} + 2px))`, outlineStyle: 'none',
    transitionProperty: 'color, transform', transitionDuration: { default: `${t['--os-motion-hover']}, ${t['--os-motion-press']}`, [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-settle'],
  },
  thumb: {
    position: 'absolute', left: t['--os-space-1'], top: t['--os-space-1'], width: t['--os-size-sm'], height: t['--os-size-sm'],
    borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-control']} + 2px))`, backgroundColor: t['--os-color-bg-raised'], boxShadow: t['--os-shadow-control'],
  },
  thumbAt: (x: number) => ({ transform: `translateX(${x}px)` }),
  // Sample prose: 16/24 at 400; the bold mark is 600.
  text: {
    margin: 0, marginBlockStart: t['--os-space-4'], fontSize: t['--os-font-size-body'], fontWeight: t['--os-font-weight-regular'],
    lineHeight: t['--os-line-height-lg'], letterSpacing: t['--os-tracking-tight'],
    transitionProperty: 'font-weight', transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-settle'],
  },
  bold: { fontWeight: t['--os-font-weight-semibold'] },
  align: (align: 'left'|'center'|'right'|'justify') => ({ textAlign: align }),
  word: { display: 'inline-block' },
  ink: { display: 'inline-block', position: 'relative', transformOrigin: '0 100%', transitionProperty: 'transform', transitionDuration: { default: t['--os-motion-layout'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-spring'] },
  italic: { transform: 'skewX(-9deg)' },
  underline: { position: 'absolute', height: 1.5, width: 'calc(100% + .28em)', left: 0, bottom: 2, borderRadius: t['--os-radius-full'], backgroundColor: 'currentColor', transform: 'scaleX(0)', transformOrigin: '0 50%', transitionProperty: 'transform', transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-settle'] },
  last: { width: '100%' },
  under: { transform: 'scaleX(1)' },
});

const formatIcons: Record<string, IconName> = {
  bold: 'bold', italic: 'italic', underline: 'underline',
  left: 'align-left', center: 'align-center', right: 'align-right', justify: 'align-justify',
};

/** A 16px formatting glyph: `bold`, `italic`, `underline`, `left`, `center`, `right` or `justify` (or any Icon name). */
export function FormatIcon({ name }: { name: string }) {
  return <Icon name={formatIcons[name] ?? (name as IconName)} size={16} />;
}

const FLIP_STIFFNESS = 420;
const FLIP_DAMPING = 2 * Math.sqrt(FLIP_STIFFNESS) * .8;

export type FormatValue = { marks: string[]; alignment: 'left'|'center'|'right'|'justify' };
export type FormatTogglesProps = { text: string; value?: FormatValue; defaultValue?: FormatValue; onChange?: (value: FormatValue) => void; label?: string; className?: string; style?: CSSProperties };

/** Formatting state is controlled or uncontrolled; words retain their identity through alignment changes. */
export function FormatToggles({ text, value, defaultValue = { marks: ['bold'], alignment: 'left' }, onChange, label = 'Text formatting', className, style }: FormatTogglesProps) {
  const [local, setLocal] = useState(defaultValue);
  const current = value ?? local;
  const words = useRef<HTMLParagraphElement>(null);
  const previous = useRef<DOMRect[]>([]);
  const change = (next: FormatValue) => {
    previous.current = Array.from(words.current?.querySelectorAll<HTMLElement>('[data-format-word]') ?? []).map(e => e.getBoundingClientRect());
    if (value === undefined) setLocal(next); onChange?.(next);
  };
  // The thumb and the words travel well over 40px, so they settle at damping ratio .8 like ExpandingTabs's tile (no bounce).
  const indicatorX = useChoiceSpring(['left','center','right','justify'].indexOf(current.alignment)*34, FLIP_STIFFNESS, FLIP_DAMPING);
  useLayoutEffect(() => {
    const elements = Array.from(words.current?.querySelectorAll<HTMLElement>('[data-format-word]') ?? []);
    // change() captured the current visual positions. Remove the previous
    // FLIP transforms before measuring the new, untransformed destinations.
    elements.forEach(el => el.getAnimations().forEach(animation => animation.cancel()));
    const next = elements.map(e => e.getBoundingClientRect());
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) elements.forEach((el, i) => {
      const before = previous.current[i];
      if (!before) return;
      const dx = before.x-next[i].x, dy = before.y-next[i].y;
      if (dx || dy) {
        // The closed-form response of the same spring as the thumb.
        const decay = FLIP_DAMPING / 2;
        const frequency = Math.sqrt(FLIP_STIFFNESS - decay*decay);
        const frames = Array.from({length:61}, (_,i) => {
          const seconds=i/60;
          const remaining=i===60 ? 0 : Math.exp(-decay*seconds)*(Math.cos(frequency*seconds)+decay/frequency*Math.sin(frequency*seconds));
          return {transform:`translate(${dx*remaining}px,${dy*remaining}px)`};
        });
        el.animate(frames, {duration:1000,easing:'linear'});
      }
    });
    previous.current = next;
  }, [current.alignment, current.marks.join(','), text]);
  const alignments = ['left','center','right','justify'] as const;
  const split = text.split(' ');
  const root = stylex.props(format.root);
  return <section aria-label={label} className={withClassName(root, className)} style={style}>
    <div {...stylex.props(format.controls)}>
      <ToggleGroup aria-label="Text style" selectedKeys={current.marks} onSelectionChange={keys => change({...current, marks: [...keys].map(String)})}>
        {['bold','italic','underline'].map(mark => <ToggleGroupItem id={mark} key={mark} aria-label={mark[0].toUpperCase()+mark.slice(1)}><FormatIcon name={mark}/></ToggleGroupItem>)}
      </ToggleGroup>
      <RadioGroup aria-label="Alignment" orientation="horizontal" value={current.alignment} onChange={alignment => change({...current, alignment: alignment as FormatValue['alignment']})} {...stylex.props(format.alignment)}>
        <span aria-hidden="true" {...stylex.props(format.thumb, format.thumbAt(indicatorX))}/>
        {alignments.map(align => <Radio key={align} value={align} aria-label={align === 'justify' ? 'Justify' : `Align ${align}`} className={({isSelected,isFocusVisible,isPressed})=>stylex.props(format.radio,hoverStyles.text,isSelected&&hoverStyles.textActive,isPressed&&pressStyles.scale,s.hitBlock,isFocusVisible&&focusStyles.ringInset).className ?? ''}><FormatIcon name={align}/></Radio>)}
      </RadioGroup>
    </div>
    <p ref={words} {...stylex.props(format.text,current.marks.includes('bold')&&format.bold,format.align(current.alignment))}>{split.map((word,i)=><span key={i}><span data-format-word {...stylex.props(format.word)}><span {...stylex.props(format.ink,current.marks.includes('italic')&&format.italic)}>{word}<span aria-hidden="true" {...stylex.props(format.underline,i===split.length-1&&format.last,current.marks.includes('underline')&&format.under)}/></span></span>{i<split.length-1?' ':''}</span>)}</p>
  </section>;
}
