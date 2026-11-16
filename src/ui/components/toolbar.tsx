'use client';

import * as stylex from '@stylexjs/stylex';
import { createContext, isValidElement, useContext, useEffect, useRef, useState, type ComponentPropsWithRef, type CSSProperties, type ReactNode } from 'react';
import { Button as AriaButton, Dialog as AriaDialog, DialogTrigger, Link as AriaLink, Popover as AriaPopover, Separator as AriaSeparator, ToggleButton as AriaToggleButton, Toolbar as AriaToolbar } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import { overlayStyles, popupPlacement } from './internal/overlay';
import { gapStyles, heightStyles, normalizeSize, radiusStyles, rectPaddingStyles, squareStyles, textStyles, type ControlSize, type ControlSizeProp } from './internal/size';
import { disabledStyles, focusStyles, hoverStyles, pressStyles, transitionStyles } from './internal/states';
import { surfaceStyles } from './internal/surface';

const reduce = '@media (prefers-reduced-motion: reduce)';
const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  toolbar: { flexWrap: 'nowrap', overflowX: 'auto', maxWidth: '100%' },
  toolbarGroup: { display: 'inline-flex', alignItems: 'center', gap: t['--os-space-0-5'], flexShrink: 0 },
  tool: {
    position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    boxSizing: 'border-box', borderWidth: 0, color: t['--os-color-fg-base'], fontFamily: t['--os-font-family'],
    whiteSpace: 'nowrap', textDecoration: 'none', cursor: 'pointer', outlineStyle: 'none',
  },
  toolPressed: { backgroundColor: t['--os-color-bg-interactive-secondary'] },
  toggledPressed: { backgroundColor: t['--os-color-accent-strong'] },
  // Coarse-pointer hit area (spec 1.14). Tools sit 2px apart, so it grows only across the toolbar.
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
  // RAC renders an <hr> in a vertical toolbar: zero the UA inset border (spec 2.0 row 13). Like GroupSeparator:
  // 4px either side, so with the 2px gap the line sits 6px from its neighbors, and half the tool height long.
  separator: { borderWidth: 0, borderStyle: 'none', flexShrink: 0, margin: 0, backgroundColor: t['--os-color-border-muted'] },
  separatorVertical: { width: 1, marginInline: t['--os-space-1'] },
  separatorHorizontal: { height: 1, marginBlock: t['--os-space-1'] },
  separatorFull: { width: '100%' },
});

const minWidthStyles = stylex.create({
  xs: { minWidth: t['--os-size-xs'] },
  sm: { minWidth: t['--os-size-sm'] },
  md: { minWidth: t['--os-size-md'] },
  lg: { minWidth: t['--os-size-lg'] },
  xl: { minWidth: t['--os-size-xl'] },
});

const separatorHeight = stylex.create({
  xs: { height: `calc(${t['--os-size-xs']} / 2)` },
  sm: { height: `calc(${t['--os-size-sm']} / 2)` },
  md: { height: `calc(${t['--os-size-md']} / 2)` },
  lg: { height: `calc(${t['--os-size-lg']} / 2)` },
  xl: { height: `calc(${t['--os-size-xl']} / 2)` },
});

type Orientation = 'horizontal' | 'vertical';
const ToolbarOrientation = createContext<Orientation>('horizontal');
const ToolbarSize = createContext<ControlSize>('md');

type ToolState = { selected?: boolean; current?: boolean; isDisabled: boolean; isPressed: boolean; isFocusVisible: boolean };

/** One look for every tool: transparent, hover bg-interactive-primary, toggled accent fill, inset ring. */
function toolClass(size: ControlSize, square: boolean, vertical: boolean, { selected, current, isDisabled, isPressed, isFocusVisible }: ToolState, className?: string) {
  return withClassName(stylex.props(
    s.tool, heightStyles[size], minWidthStyles[size], gapStyles[size], textStyles[size], radiusStyles[size],
    square ? squareStyles[size] : rectPaddingStyles[size],
    transitionStyles.colorsAndPress, hoverStyles.fill,
    current && surfaceStyles.current,
    selected && surfaceStyles.toggled,
    isPressed && !isDisabled && (selected ? s.toggledPressed : s.toolPressed),
    isPressed && !isDisabled && pressStyles.scale,
    isDisabled && (selected ? disabledStyles.filled : disabledStyles.text),
    vertical ? s.hitInline : s.hitBlock,
    // Inset ring (tools sit 2px apart). A toggled fill is the ring color, so it takes the outer ring.
    isFocusVisible && (selected ? focusStyles.ring : focusStyles.ringInset),
  ), className);
}

/** True when the tool shows only an icon (a single element child), so it is drawn square. */
function onlyIcon(children: unknown): boolean {
  return isValidElement(children) && typeof children.type !== 'symbol';
}

export type ToolbarProps = Omit<ComponentPropsWithRef<typeof AriaToolbar>, 'className' | 'render'> & {
  className?: string;
  /** Height of the tools inside, on the control scale. Default `md` (40). */
  size?: ControlSizeProp;
};

export function Toolbar({ orientation = 'horizontal', size, className, ...props }: ToolbarProps) {
  const styles = stylex.props(surfaceStyles.surface, surfaceStyles.group, s.toolbar, orientation === 'vertical' && surfaceStyles.vertical);
  return (
    <ToolbarOrientation.Provider value={orientation}>
      <ToolbarSize.Provider value={normalizeSize(size, 'md')}>
        <AriaToolbar {...props} orientation={orientation} className={withClassName(styles, className)} />
      </ToolbarSize.Provider>
    </ToolbarOrientation.Provider>
  );
}

type ToolProps = {
  className?: string;
  /** Overrides the toolbar's size for this tool. */
  size?: ControlSizeProp;
  /** Draws the tool square, with no inline padding. Default: true when the only child is an element, such as an Icon. */
  iconOnly?: boolean;
};

export type ToolbarButtonProps = Omit<ComponentPropsWithRef<typeof AriaButton>, 'className' | 'render'> & ToolProps;

/** A tool that runs an action. Set `aria-pressed` for a toggle you manage yourself, or use ToolbarToggleButton. */
export function ToolbarButton({ className, size, iconOnly, ...props }: ToolbarButtonProps) {
  const toolbarSize = useContext(ToolbarSize);
  const vertical = useContext(ToolbarOrientation) === 'vertical';
  const selected = props['aria-pressed'] === true || props['aria-pressed'] === 'true';
  const square = iconOnly ?? onlyIcon(props.children);
  return <AriaButton {...props} className={state => toolClass(normalizeSize(size, toolbarSize), square, vertical, { ...state, selected }, className)} />;
}

export type ToolbarToggleButtonProps = Omit<ComponentPropsWithRef<typeof AriaToggleButton>, 'className' | 'render'> & ToolProps;

/** A tool that stays on or off (`aria-pressed`), drawn as a toggled object when on. */
export function ToolbarToggleButton({ className, size, iconOnly, ...props }: ToolbarToggleButtonProps) {
  const toolbarSize = useContext(ToolbarSize);
  const vertical = useContext(ToolbarOrientation) === 'vertical';
  const square = iconOnly ?? onlyIcon(props.children);
  return <AriaToggleButton {...props} className={state => toolClass(normalizeSize(size, toolbarSize), square, vertical, { ...state, selected: state.isSelected }, className)} />;
}

export type ToolbarLinkProps = Omit<ComponentPropsWithRef<typeof AriaLink>, 'className' | 'render'> & ToolProps;

/** A tool that navigates. With `aria-current`, it is drawn as the current location. */
export function ToolbarLink({ className, size, iconOnly, ...props }: ToolbarLinkProps) {
  const toolbarSize = useContext(ToolbarSize);
  const vertical = useContext(ToolbarOrientation) === 'vertical';
  const square = iconOnly ?? onlyIcon(props.children);
  const current = props['aria-current'] != null && props['aria-current'] !== false && props['aria-current'] !== 'false';
  return <AriaLink {...props} className={state => toolClass(normalizeSize(size, toolbarSize), square, vertical, { ...state, current }, className)} />;
}

export type ToolbarGroupProps = ComponentPropsWithRef<'div'> & { orientation?: Orientation };

export function ToolbarGroup({ className, orientation, ...props }: ToolbarGroupProps) {
  const inheritedOrientation = useContext(ToolbarOrientation);
  const styles = stylex.props(s.toolbarGroup, (orientation ?? inheritedOrientation) === 'vertical' && surfaceStyles.vertical);
  return <div role="group" {...props} className={withClassName(styles, className)} />;
}

export type ToolbarSeparatorProps = { orientation?: Orientation; className?: string; style?: CSSProperties };

export function ToolbarSeparator({ orientation, className, style }: ToolbarSeparatorProps) {
  const toolbarOrientation = useContext(ToolbarOrientation);
  const size = useContext(ToolbarSize);
  const divider = orientation ?? (toolbarOrientation === 'vertical' ? 'horizontal' : 'vertical');
  const styles = stylex.props(s.separator, divider === 'vertical' ? [s.separatorVertical, separatorHeight[size]] : [s.separatorHorizontal, s.separatorFull]);
  return <AriaSeparator orientation={divider} className={withClassName(styles, className)} style={style} />;
}

// The palette rail is a group shell like Toolbar (spec 1.3): bg-surface with shadow-control, padding 6, gap 2,
// radius control + 6, holding md 40 tools at the control radius, so they run concentric (lg around md at a
// corner ladder, pills at Round). Its flyout is a popup surface (spec 1.9).
const palette = stylex.create({
  rail: {
    display: 'inline-flex', alignItems: 'center', gap: t['--os-space-0-5'], padding: t['--os-space-1-5'],
    borderRadius: `calc(${t['--os-radius-control']} + ${t['--os-space-1-5']})`, backgroundColor: t['--os-color-bg-surface'],
    boxShadow: t['--os-shadow-control'], color: t['--os-color-fg-base'], maxWidth: '100%', boxSizing: 'border-box',
  },
  tool: {
    position: 'relative', display: 'grid', placeItems: 'center', flex: `0 1 ${t['--os-size-md']}`, minWidth: t['--os-size-sm'],
    width: t['--os-size-md'], height: t['--os-size-md'], padding: 0,
    borderRadius: t['--os-radius-control'], backgroundColor: 'transparent', color: t['--os-color-fg-base'], cursor: 'pointer', outlineStyle: 'none',
    transitionProperty: 'color, background-color, transform',
    transitionDuration: { default: `${t['--os-motion-hover']}, ${t['--os-motion-hover']}, ${t['--os-motion-press']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  fill: {
    position: 'absolute', inset: 0, borderRadius: 'inherit', backgroundColor: t['--os-color-selection'], opacity: 0, scale: '.72',
    transitionProperty: { default: 'scale, opacity', [reduce]: 'opacity' }, transitionDuration: { default: t['--os-motion-popup'], [reduce]: t['--os-motion-press'] }, transitionTimingFunction: t['--os-ease-spring'],
  },
  activeFill: { opacity: 1, scale: '1' },
  active: { color: t['--os-color-fg-static-light'] },
  icon: { display: 'grid', placeItems: 'center', position: 'relative', transitionProperty: 'scale', transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-spring'] },
  iconActive: { scale: '1.05' },
  hovered: { backgroundColor: t['--os-color-bg-interactive-primary'] },
  // The same divider as ToolbarSeparator: 4px either side, half the tool height long.
  split: { width: 1, height: `calc(${t['--os-size-md']} / 2)`, flexShrink: 0, marginInline: t['--os-space-1'], backgroundColor: t['--os-color-border-muted'] },
  slot: { display: 'inline-flex', position: 'relative', flex: `0 1 ${t['--os-size-md']}`, minWidth: t['--os-size-sm'] },
  // The "more shapes" corner: an 8px button 4px in from the tool's corner, with a 24px hit area anchored on that corner (spec 1.14).
  notch: {
    position: 'absolute', right: t['--os-space-1'], bottom: t['--os-space-1'], display: 'grid', placeItems: 'end', width: 8, height: 8, minWidth: 0, padding: 0,
    borderRadius: t['--os-radius-xs'], backgroundColor: 'transparent', cursor: 'pointer', color: t['--os-color-fg-muted'], outlineStyle: 'none',
    '::after': { content: '""', position: 'absolute', right: `calc(-1 * ${t['--os-space-1']})`, bottom: `calc(-1 * ${t['--os-space-1']})`, width: t['--os-size-xs'], height: t['--os-size-xs'] },
  },
  notchOn: { color: `color-mix(in srgb, ${t['--os-color-fg-static-light']} 85%, transparent)` },
  corner: { display: 'block', pointerEvents: 'none' },
  // List-popup padding 6 (spec 1.9); the surface keeps its radius lg.
  popup: { padding: t['--os-space-1-5'], maxWidth: `calc(100vw - 2 * ${t['--os-space-3']})`, outlineStyle: 'none' },
  choices: { display: 'flex', gap: t['--os-space-0-5'], outlineStyle: 'none' },
});
export type PaletteTool = 'move'|'frame'|'rect'|'oval'|'line'|'star'|'text'|'pen'|'code';
const shapes: PaletteTool[] = ['rect','oval','line','star'];
const toolLabels: Record<PaletteTool, string> = { move: 'Move', frame: 'Frame', rect: 'Rectangle', oval: 'Oval', line: 'Line', star: 'Star', text: 'Text', pen: 'Pen', code: 'Code' };
function ToolIcon({ name }: { name: PaletteTool }) {
  const paths: Record<PaletteTool,ReactNode> = {
    move: <path d="m4 4 16 6.5-7 2-2 7Z"/>, frame: <path d="M2 6h20M2 18h20M6 2v20M18 2v20"/>,
    rect: <rect x="3" y="3" width="18" height="18" rx="2"/>, oval: <circle cx="12" cy="12" r="9"/>, line: <path d="M4 20 20 4"/>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>,
    text: <path d="M4 7V4h16v3M12 4v16M9 20h6"/>, pen: <><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><path d="M5 17A12 12 0 0 1 17 5"/></>, code: <path d="m8 6-6 6 6 6m8-12 6 6-6 6"/>,
  };
  // Local product glyphs (spec 1.15), drawn like Icon: 16px for an md tool, stroke 1.7 on the 24 grid.
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
export type ToolPaletteProps = { value?: PaletteTool; defaultValue?: PaletteTool; onChange?: (tool: PaletteTool)=>void; label?: string; className?: string; style?: CSSProperties };
export function ToolPalette({ value, defaultValue='move', onChange, label='Canvas tools', className, style }: ToolPaletteProps) {
  const [local,setLocal]=useState(defaultValue), [shape,setShape]=useState<PaletteTool>(shapes.includes(defaultValue)?defaultValue:'rect'), [open,setOpen]=useState(false);
  const slot=useRef<HTMLSpanElement>(null);
  const active=value??local;
  useEffect(()=>{if(shapes.includes(active))setShape(active);},[active]);
  const rememberedShape=shapes.includes(active)?active:shape;
  const choose=(tool: PaletteTool)=>{if(value===undefined)setLocal(tool);onChange?.(tool);setOpen(false);};
  const tool=(name:PaletteTool,autoFocus=false)=><AriaButton key={name} autoFocus={autoFocus} aria-label={toolLabels[name]} aria-pressed={name===active} onPress={()=>choose(name)} className={({isFocusVisible,isHovered,isPressed})=>stylex.props(palette.tool,name===active&&palette.active,isHovered&&name!==active&&palette.hovered,isPressed&&name!==active&&s.toolPressed,isPressed&&pressStyles.scale,isFocusVisible&&(name===active?focusStyles.ring:focusStyles.ringInsetOverlay)).className??''}><span aria-hidden="true" {...stylex.props(palette.fill,name===active&&palette.activeFill)}/><span {...stylex.props(palette.icon,name===active&&palette.iconActive)}><ToolIcon name={name}/></span></AriaButton>;
  const rail=stylex.props(palette.rail);
  // The flyout anchors on the shape tool's slot: offset 12 is the rail's 6px padding plus the standard 6px popup offset (spec 1.9).
  return <AriaToolbar aria-label={label} className={withClassName(rail,className)} style={style}>{tool('move')}{tool('frame')}<span ref={slot} {...stylex.props(palette.slot)}>{tool(rememberedShape)}<DialogTrigger isOpen={open} onOpenChange={setOpen}><AriaButton aria-label="More shapes" className={({isFocusVisible})=>stylex.props(palette.notch,hoverStyles.text,shapes.includes(active)&&palette.notchOn,isFocusVisible&&focusStyles.ring).className??''}><svg aria-hidden="true" width="6" height="6" viewBox="0 0 6 6" {...stylex.props(palette.corner)}><path d="M6 0V6H0Z" fill="currentColor"/></svg></AriaButton><AriaPopover triggerRef={slot} placement="top" offset={12} className={({isExiting,placement})=>stylex.props(overlayStyles.surface,overlayStyles.popupMotion,popupPlacement(placement),palette.popup,isExiting&&overlayStyles.exit).className??''}><AriaDialog aria-label="Choose shape" {...stylex.props(palette.choices)}><AriaToolbar aria-label="Shapes" {...stylex.props(palette.choices)}>{shapes.map(name=>tool(name,name===rememberedShape))}</AriaToolbar></AriaDialog></AriaPopover></DialogTrigger></span>{tool('text')}<span role="separator" aria-orientation="vertical" {...stylex.props(palette.split)}/>{tool('pen')}{tool('code')}</AriaToolbar>;
}
