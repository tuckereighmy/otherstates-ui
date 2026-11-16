'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode, Ref } from 'react';
import {
  Header, Keyboard, Menu as AriaMenu, MenuItem as AriaMenuItem, MenuSection as AriaMenuSection, MenuTrigger,
  Popover as AriaPopover, Separator, SubmenuTrigger, Text,
} from 'react-aria-components';
import type { MenuItemProps as AriaMenuItemProps, MenuSectionProps as AriaMenuSectionProps } from 'react-aria-components';
import { Icon } from './Icon';
import { Kbd } from './kbd';
import { ChoiceIndicator } from './internal/choice';
import { withClassName } from './internal/class-name';
import { overlayItemStyles, overlayStyles, popupPlacement, TriggerSlot, useOpenState, type MenuPopupProps as BasePopupProps, type OpenProps } from './internal/overlay';
import { tokens as t } from '../tokens.stylex';

// Menu (DESIGN_SPEC 1.9, 2.2 Menu): an anchored list of actions. Items are the spec 1.9 rows
// (36 tall, radius 10, 14/20 at 400) with the hover fill as their focus state; icons 16 in fg-muted;
// a Kbd `sm` shortcut, a check, a switch or a submenu chevron at the end.

const s = stylex.create({
  /** A flex column, so the list shrinks to the height React Aria leaves it (its inline max-height). */
  popover: { display: 'flex', flexDirection: 'column' },
  /** Pointer-anchored menus (ContextMenu) grow from the pointer: top left, top right in RTL. */
  pointerOrigin: { transformOrigin: 'var(--trigger-anchor-point, top left)' },
  /** Spec 1.9 Size and Items: gap 2, min 200, max min(320, 100vw - 24), at most 320 tall, scrolling inside. */
  list: {
    gap: t['--os-space-0-5'], minWidth: 200, maxWidth: 'min(320px, calc(100vw - 24px))',
    maxHeight: 320, minHeight: 0, flexShrink: 1, boxSizing: 'border-box', overscrollBehavior: 'contain',
  },
  /** 8px block padding keeps one line at 36 and gives a description or a wrapped label room. */
  item: { paddingBlock: t['--os-space-2'], WebkitTapHighlightColor: 'transparent' },
  text: { display: 'flex', flexDirection: 'column', flexGrow: 1, flexShrink: 1, minWidth: 0 },
  label: { minWidth: 0, overflowWrap: 'anywhere' },
  description: {
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    letterSpacing: t['--os-tracking-tight'], overflowWrap: 'anywhere',
  },
  end: { display: 'inline-flex', alignItems: 'center', gap: t['--os-space-2'], flexShrink: 0, color: t['--os-color-fg-muted'] },
  /** The 22px switch sits in a 20px slot so the row stays 36 tall. */
  switchSlot: { display: 'inline-flex', alignItems: 'center', height: 20 },
  /** The Keyboard slot around a Kbd: no look of its own. */
  shortcut: { display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1'], fontFamily: 'inherit', fontSize: 'inherit' },
  mutedDisabled: { color: t['--os-color-fg-disabled'] },
  danger: { color: t['--os-color-fg-danger'] },
  /** Destructive rows tint toward error on hover and keyboard focus (spec 3.1 Menu). */
  dangerActive: { backgroundColor: t['--os-color-bg-error'], color: t['--os-color-fg-error'] },
  dangerPressed: { backgroundColor: `color-mix(in srgb, ${t['--os-color-fg-error']} 12%, ${t['--os-color-bg-error']})`, color: t['--os-color-fg-error'] },
  dangerIcon: { color: 'inherit' },
  group: { display: 'grid', gap: t['--os-space-0-5'] },
  /** The hover-open wrapper takes no box of its own. */
  hoverTarget: { display: 'contents' },
});

export type MenuItemProps = Omit<AriaMenuItemProps, 'children' | 'className' | 'style'> & {
  children: ReactNode;
  /** A 16px Icon before the label, in fg-muted. */
  icon?: ReactNode;
  /** A secondary line under the label, 13/18 in fg-muted. */
  description?: ReactNode;
  /** The keyboard shortcut at the end. A string renders as a Kbd `sm`; pass Kbd elements for a combination. */
  shortcut?: ReactNode;
  /** Danger text, with an error tint on hover and focus. For actions that delete or cannot be undone. */
  destructive?: boolean;
  /** How a selectable item shows its state: a check (default) or a switch. */
  indicator?: 'check' | 'switch';
  /** Close the menu when this item is chosen. Defaults to the menu's setting. Same as `shouldCloseOnSelect`. */
  closeOnSelect?: boolean;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

export function MenuItem({ children, icon, description, shortcut, destructive = false, indicator = 'check', closeOnSelect, className, style, shouldCloseOnSelect, ...props }: MenuItemProps) {
  return <AriaMenuItem
    {...props}
    textValue={props.textValue ?? (typeof children === 'string' ? children : undefined)}
    shouldCloseOnSelect={shouldCloseOnSelect ?? closeOnSelect}
    style={style}
    className={({ isHovered, isFocused, isOpen, isPressed, isDisabled }) => withClassName(stylex.props(
      overlayItemStyles.item, s.item,
      destructive && s.danger,
      (isHovered || isFocused || isOpen) && !isDisabled && (destructive ? s.dangerActive : overlayItemStyles.active),
      isPressed && !isDisabled && (destructive ? s.dangerPressed : overlayItemStyles.pressed),
      isDisabled && overlayItemStyles.disabled,
    ), className)}>
    {({ hasSubmenu, isSelected, isDisabled, selectionMode }) => <>
      {icon && <span {...stylex.props(overlayItemStyles.icon, destructive && s.dangerIcon, isDisabled && s.mutedDisabled)}>{icon}</span>}
      <span {...stylex.props(s.text)}>
        <Text slot="label" {...stylex.props(s.label)}>{children}</Text>
        {description && <Text slot="description" {...stylex.props(s.description, isDisabled && s.mutedDisabled)}>{description}</Text>}
      </span>
      {(shortcut || hasSubmenu || selectionMode !== 'none') && <span {...stylex.props(s.end, isDisabled && s.mutedDisabled)}>
        {shortcut && <Keyboard {...stylex.props(s.shortcut)}>{typeof shortcut === 'string' ? <Kbd size="sm">{shortcut}</Kbd> : shortcut}</Keyboard>}
        {selectionMode !== 'none' && indicator === 'switch' && <span {...stylex.props(s.switchSlot)}><ChoiceIndicator kind="switch" size="sm" focusRing={false}
          state={{ isSelected, isDisabled, isPressed: false, isFocusVisible: false, isHovered: false }} /></span>}
        {selectionMode !== 'none' && indicator === 'check' && isSelected && <Icon name="check" size={16} />}
        {hasSubmenu && <Icon name="chevron-right" size={16} />}
      </span>}
    </>}
  </AriaMenuItem>;
}

export type MenuGroupProps = Omit<AriaMenuSectionProps<object>, 'children' | 'items'> & {
  /** The group label, 12/16 500 in fg-muted. It also names the group for assistive tech. */
  label?: string;
  children: ReactNode;
};

/** Related items under a label. Give it `selectionMode` to make its items checkboxes (`multiple`) or radios (`single`). */
export function MenuGroup({ label, children, className, ...props }: MenuGroupProps) {
  return <AriaMenuSection {...props} className={withClassName(stylex.props(s.group), className)} aria-label={props['aria-label'] ?? label}>
    {label && <Header {...stylex.props(overlayItemStyles.groupLabel)}>{label}</Header>}
    {children}
  </AriaMenuSection>;
}

export type MenuSeparatorProps = { className?: string; style?: CSSProperties };

/** A 1px border-subtle rule with 4px above and below. */
export function MenuSeparator({ className, style }: MenuSeparatorProps = {}) {
  return <Separator className={withClassName(stylex.props(overlayItemStyles.separator), className)} style={style} />;
}

export type MenuShortcutProps = { children: ReactNode; className?: string };

/** A shortcut in a Kbd `sm`, linked to its item as a description. `MenuItem shortcut` renders the same. */
export function MenuShortcut({ children, className }: MenuShortcutProps) {
  return <Keyboard className={withClassName(stylex.props(s.shortcut), className)}>{typeof children === 'string' ? <Kbd size="sm">{children}</Kbd> : children}</Keyboard>;
}

export type MenuPopupProps = BasePopupProps & {
  /** Classes for the popup surface. */
  className?: string;
  /** Inline styles for the popup surface. */
  style?: CSSProperties;
  /** The popup surface element. */
  ref?: Ref<HTMLDivElement>;
  /** Shift along the trigger's edge, in px. */
  crossOffset?: number;
  /** `trigger` (default) grows from the trigger side; `pointer` grows from the pointer (context menus). */
  origin?: 'trigger' | 'pointer';
  /** Leave the rest of the page interactive: no underlay, closes on blur. Hover-opened menus use it. */
  isNonModal?: boolean;
  onPointerEnter?: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerLeave?: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

/**
 * The popup surface (spec 1.9) and the list inside it. Menu, ContextMenu and MenuSubmenu render it;
 * use it directly only to compose with React Aria's MenuTrigger or SubmenuTrigger.
 */
export function MenuPopup({
  placement, offset, crossOffset, portalContainer, menuStyle, popoverStyle, className, style, ref,
  origin = 'trigger', isNonModal, onPointerEnter, onPointerLeave, ...menu
}: MenuPopupProps) {
  return <AriaPopover ref={ref} placement={placement} offset={offset} crossOffset={crossOffset} isNonModal={isNonModal}
    UNSTABLE_portalContainer={portalContainer} style={style} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}
    className={({ isExiting, placement: side }) => withClassName(stylex.props(
      overlayStyles.surface, overlayStyles.popup, s.popover, overlayStyles.popupMotion, popupPlacement(side),
      origin === 'pointer' && s.pointerOrigin, popoverStyle, isExiting && overlayStyles.exit,
    ), className)}>
    <AriaMenu {...menu} {...stylex.props(overlayStyles.menu, s.list, menuStyle)} />
  </AriaPopover>;
}

export type MenuProps = OpenProps & Omit<MenuPopupProps, 'origin' | 'isNonModal' | 'onPointerEnter' | 'onPointerLeave'> & {
  /** The element that opens the menu: a Button or any React Aria pressable. */
  trigger: ReactNode;
  /** `press` (default) opens on click, Enter, Space or the arrow keys; `hover` also opens while the pointer rests on the trigger. */
  openOn?: 'press' | 'hover';
  /** Close the menu when an item is chosen. Default true, false for checkbox menus. Same as `shouldCloseOnSelect`. */
  closeOnSelect?: boolean;
};

const hoverOpenDelay = 120;
const hoverCloseDelay = 200;

export function Menu({ trigger, isOpen, defaultOpen, onOpenChange, openOn = 'press', closeOnSelect, offset, shouldCloseOnSelect, autoFocus, ...popup }: MenuProps) {
  const [open, setOpen] = useOpenState({ isOpen, defaultOpen, onOpenChange });
  const [byHover, setByHover] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hover = openOn === 'hover';
  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const enter = (event: ReactPointerEvent) => {
    if (event.pointerType === 'touch') return;
    clear();
    if (!open) timer.current = setTimeout(() => { setByHover(true); setOpen(true); }, hoverOpenDelay);
  };
  const leave = (event: ReactPointerEvent) => {
    if (event.pointerType === 'touch') return;
    clear();
    if (open && byHover) timer.current = setTimeout(() => setOpen(false), hoverCloseDelay);
  };
  const triggerNode = <TriggerSlot>{trigger}</TriggerSlot>;
  return <MenuTrigger trigger="press" isOpen={open} onOpenChange={next => { clear(); setByHover(false); setOpen(next); }}>
    {hover ? <span {...stylex.props(s.hoverTarget)} onPointerEnter={enter} onPointerLeave={leave}>{triggerNode}</span> : triggerNode}
    <MenuPopup {...popup} offset={offset ?? 6} isNonModal={hover || undefined}
      shouldCloseOnSelect={shouldCloseOnSelect ?? closeOnSelect}
      autoFocus={hover && byHover ? false : autoFocus}
      onPointerEnter={hover ? enter : undefined} onPointerLeave={hover ? leave : undefined} />
  </MenuTrigger>;
}

export type MenuSubmenuProps = Omit<MenuPopupProps, 'origin' | 'isNonModal' | 'onPointerEnter' | 'onPointerLeave'> & {
  /** The label of the item that opens the submenu. */
  label: string;
  /** A 16px Icon before the label. */
  icon?: ReactNode;
  isDisabled?: boolean;
  /** Milliseconds of hover before the submenu opens. Default 200. */
  delay?: number;
};

const narrowQuery = '(max-width: 479px)';
function subscribeNarrow(onChange: () => void) {
  const list = matchMedia(narrowQuery);
  list.addEventListener('change', onChange);
  return () => list.removeEventListener('change', onChange);
}
/** Below 480px of viewport there is no room beside a menu, so a submenu opens over it instead. */
function useNarrowViewport() {
  return useSyncExternalStore(subscribeNarrow, () => matchMedia(narrowQuery).matches, () => false);
}

/** An item that opens a nested menu: on hover, on press, or with the arrow key toward the end. */
export function MenuSubmenu({ label, icon, isDisabled, delay, placement, offset, crossOffset, ...props }: MenuSubmenuProps) {
  const narrow = useNarrowViewport() && placement === undefined;
  return <SubmenuTrigger delay={delay}>
    <MenuItem icon={icon} isDisabled={isDisabled}>{label}</MenuItem>
    {/* Beside its parent, the item sits 7px inside the surface (1px edge + 6px padding): offset 13
        leaves the spec's 6px between the two surfaces, and crossOffset -7 lines the first item up
        with its trigger. On a phone the submenu drops over the parent, 16px in from the item. */}
    <MenuPopup {...props} placement={narrow ? 'bottom start' : placement}
      offset={offset ?? (narrow ? -4 : 13)} crossOffset={crossOffset ?? (narrow ? 16 : -7)} />
  </SubmenuTrigger>;
}
