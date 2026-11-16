'use client';

import * as stylex from '@stylexjs/stylex';
import { createContext, useContext, type ComponentPropsWithRef, type Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import { normalizeSize, rectPaddingStyles, textStyles, type ControlSize, type ControlSizeProp } from './internal/size';
import { surfaceStyles } from './internal/surface';

// Group (DESIGN_SPEC 2.2 Group): a raised shell (shadow-control, padding 6, gap 2) that visually joins
// related controls. The shell's radius is the control radius plus its 6px inset (spec 1.3), so every
// control inside, which takes the control radius, runs concentric: lg around md at a corner ladder, pills at Round.

export type GroupOrientation = 'horizontal' | 'vertical';
/** `outline` is the old name of `raised`. */
export type GroupVariant = 'raised' | 'flush' | 'outline';

type GroupContextValue = { orientation: GroupOrientation; size: ControlSize };
const GroupContext = createContext<GroupContextValue>({ orientation: 'horizontal', size: 'md' });

const s = stylex.create({
  // 4px either side, so with the shell's 2px gap the line sits 6px from its neighbors (Toolbar matches).
  separator: { flexShrink: 0, alignSelf: 'center', backgroundColor: t['--os-color-border-muted'] },
  separatorVertical: { width: 1, marginInline: t['--os-space-1'] },
  separatorHorizontal: { height: 1, alignSelf: 'stretch', marginBlock: t['--os-space-1'] },
  text: {
    display: 'inline-flex', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap',
    color: t['--os-color-fg-muted'], fontFamily: t['--os-font-family'], fontVariantNumeric: 'tabular-nums',
  },
});

// GroupText takes the height of the controls it sits beside (spec 1.2); GroupSeparator half of it.
const textHeight = stylex.create({
  xs: { height: t['--os-size-xs'] },
  sm: { height: t['--os-size-sm'] },
  md: { height: t['--os-size-md'] },
  lg: { height: t['--os-size-lg'] },
  xl: { height: t['--os-size-xl'] },
});

const separatorHeight = stylex.create({
  xs: { height: `calc(${t['--os-size-xs']} / 2)` },
  sm: { height: `calc(${t['--os-size-sm']} / 2)` },
  md: { height: `calc(${t['--os-size-md']} / 2)` },
  lg: { height: `calc(${t['--os-size-lg']} / 2)` },
  xl: { height: `calc(${t['--os-size-xl']} / 2)` },
});

export type GroupProps = ComponentPropsWithRef<'div'> & {
  /** The direction the controls run in. */
  orientation?: GroupOrientation;
  /** `raised` (default) draws the shell; `flush` drops it, for a group nested in another. `outline` is a deprecated alias of `raised`. */
  variant?: GroupVariant;
  /** The size of the controls inside (spec 1.2), so GroupText and GroupSeparator match them. `small | medium | large` are aliases. */
  size?: ControlSizeProp;
};

export function Group({ orientation = 'horizontal', variant = 'raised', size: sizeProp, className, ...props }: GroupProps) {
  const size = normalizeSize(sizeProp);
  const styles = stylex.props(
    surfaceStyles.surface, surfaceStyles.group,
    orientation === 'vertical' && surfaceStyles.vertical,
    variant === 'flush' && surfaceStyles.flush,
  );
  return (
    <GroupContext.Provider value={{ orientation, size }}>
      <div role="group" {...props} className={withClassName(styles, className)} />
    </GroupContext.Provider>
  );
}

export type GroupSeparatorProps = ComponentPropsWithRef<'div'>;

/** A hairline between sets of controls in a Group. It runs across the group's direction. */
export function GroupSeparator({ className, ...props }: GroupSeparatorProps) {
  const { orientation, size } = useContext(GroupContext);
  const across = orientation === 'horizontal';
  const styles = stylex.props(s.separator, across ? [s.separatorVertical, separatorHeight[size]] : s.separatorHorizontal);
  return <div role="separator" aria-orientation={across ? 'vertical' : 'horizontal'} {...props} className={withClassName(styles, className)} />;
}

export type GroupTextProps = Omit<ComponentPropsWithRef<'span'>, 'ref'> & {
  /** Render a `<label>` for this control id, so the text names the field beside it. */
  htmlFor?: string;
  ref?: Ref<HTMLElement>;
};

/** Static text inside a Group: a leading label, a unit or a count. */
export function GroupText({ htmlFor, className, ref, ...props }: GroupTextProps) {
  const { size } = useContext(GroupContext);
  const styles = stylex.props(s.text, textHeight[size], rectPaddingStyles[size], textStyles[size]);
  const merged = withClassName(styles, className);
  return htmlFor != null
    ? <label {...props} ref={ref as Ref<HTMLLabelElement>} htmlFor={htmlFor} className={merged} />
    : <span {...props} ref={ref as Ref<HTMLSpanElement>} className={merged} />;
}
