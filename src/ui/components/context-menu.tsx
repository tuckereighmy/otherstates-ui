'use client';

import { isValidElement, useLayoutEffect, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { MenuTrigger, Pressable } from 'react-aria-components';
import { MenuPopup, type MenuProps } from './menu';

// ContextMenu (DESIGN_SPEC 2.2 ContextMenu): a Menu that opens at the pointer on right click, on
// long press, and from the keyboard with Shift+F10 or the Menu key. It grows from the pointer
// (top left, top right in RTL) and otherwise shares every Menu rule.

export type ContextMenuProps = Omit<MenuProps, 'openOn'>;

/**
 * The element that receives the context menu. React Aria pressables take the trigger's handlers
 * themselves; any other element (a native `div`, the library Button) is wrapped in React Aria
 * `Pressable`, which makes it focusable so Shift+F10 can reach it. React Aria elements carry
 * `data-rac`; the check runs in a layout effect, before paint.
 */
function ContextTarget({ children }: { children: ReactNode }) {
  const marker = useRef<HTMLSpanElement>(null);
  const native = isValidElement(children) && typeof children.type === 'string';
  const [wrap, setWrap] = useState(native);
  useLayoutEffect(() => {
    if (wrap) return;
    const el = marker.current?.previousElementSibling;
    if (el && !el.hasAttribute('data-rac')) setWrap(true);
  }, [wrap]);
  if (wrap && isValidElement(children)) return <Pressable>{children as ReactElement<Record<string, unknown>, string>}</Pressable>;
  return <>{children}{!wrap && <span hidden ref={marker} />}</>;
}

export function ContextMenu({ trigger, isOpen, defaultOpen, onOpenChange, closeOnSelect, shouldCloseOnSelect, ...popup }: ContextMenuProps) {
  return <MenuTrigger trigger="contextMenu" isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    <ContextTarget>{trigger}</ContextTarget>
    <MenuPopup {...popup} origin="pointer" shouldCloseOnSelect={shouldCloseOnSelect ?? closeOnSelect} />
  </MenuTrigger>;
}
