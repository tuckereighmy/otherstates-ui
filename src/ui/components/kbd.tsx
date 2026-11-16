'use client';

import * as stylex from '@stylexjs/stylex';
import { createContext, useContext } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';

export type KbdSize = 'sm' | 'md';

const s = stylex.create({
  // A keycap (spec 2.2 Kbd): bg-muted fill and shadow-control, no border; 12/16 Inter, padding 0 4, radius 6.
  keycap: {
    boxSizing: 'border-box',
    display: 'inline-grid',
    placeItems: 'center',
    flexShrink: 0,
    paddingBlock: 0,
    paddingInline: t['--os-space-1'],
    borderWidth: 0,
    borderRadius: t['--os-radius-sm'],
    boxShadow: t['--os-shadow-control'],
    backgroundColor: t['--os-color-bg-muted'],
    color: t['--os-color-fg-base'],
    fontFamily: t['--os-font-family'],
    fontSize: t['--os-font-size-xs'],
    fontWeight: t['--os-font-weight-regular'],
    lineHeight: t['--os-line-height-xs'],
    letterSpacing: 0,
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  sm: { minWidth: 20, height: 20 },
  md: { minWidth: 24, height: 24 },
  // Nested <kbd> elements mark a key combination (HTML spec). Text between keys, such as "+", is fg-muted.
  group: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: t['--os-space-1'],
    color: t['--os-color-fg-muted'],
    fontFamily: t['--os-font-family'],
    fontSize: t['--os-font-size-xs'],
    lineHeight: t['--os-line-height-xs'],
    letterSpacing: 0,
    whiteSpace: 'nowrap',
  },
});

const KbdSizeContext = createContext<KbdSize | undefined>(undefined);
const legacy = { small: 'sm', medium: 'md' } as const;
const normalize = (size: KbdSizeProp | undefined): KbdSize | undefined => size ? (size in legacy ? legacy[size as keyof typeof legacy] : size as KbdSize) : undefined;

/** `small` and `medium` are aliases of `sm` and `md`. */
export type KbdSizeProp = KbdSize | keyof typeof legacy;

export type KbdProps = ComponentPropsWithRef<'kbd'> & {
  /** `sm` (20) inside menus and command footers, `md` (24) elsewhere. Default `md`, or the group's size. */
  size?: KbdSizeProp;
};

export function Kbd({ size, className, ...props }: KbdProps) {
  const groupSize = useContext(KbdSizeContext);
  const styles = stylex.props(s.keycap, s[normalize(size) ?? groupSize ?? 'md']);
  return <kbd {...props} className={withClassName(styles, className)} />;
}

export type KbdGroupProps = ComponentPropsWithRef<'kbd'> & {
  /** Size for every Kbd inside that sets none. */
  size?: KbdSizeProp;
};

/** A key combination: a `<kbd>` that holds Kbd keys, 4px apart. */
export function KbdGroup({ size, className, ...props }: KbdGroupProps) {
  const styles = stylex.props(s.group);
  const group = <kbd {...props} className={withClassName(styles, className)} />;
  const groupSize = normalize(size);
  return groupSize ? <KbdSizeContext.Provider value={groupSize}>{group}</KbdSizeContext.Provider> : group;
}
