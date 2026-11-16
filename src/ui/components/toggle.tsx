'use client';

import * as stylex from '@stylexjs/stylex';
import { Children, cloneElement, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { ToggleButton as AriaToggleButton } from 'react-aria-components';
import type { ToggleButtonProps as AriaToggleButtonProps } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import type { IconProps } from './Icon';
import {
  normalizeSize, sizeScale, heightStyles, squareStyles, rectPaddingStyles, gapStyles, textStyles, radiusStyles,
  rectIconPaddingStartStyles, rectIconPaddingEndStyles,
} from './internal/size';
import type { ControlSizeProp } from './internal/size';
import { disabledStyles, focusStyles, hoverStyles, pressStyles, transitionStyles } from './internal/states';

export type ToggleVariant = 'ghost' | 'outline';

const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  base: {
    position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    boxSizing: 'border-box', margin: 0, borderWidth: 0, outlineStyle: 'none', cursor: 'pointer', userSelect: 'none',
    fontFamily: t['--os-font-family'], whiteSpace: 'nowrap', color: t['--os-color-fg-base'],
    backgroundColor: 'transparent', WebkitTapHighlightColor: 'transparent',
    // Hit area (spec 1.14): 44px under a coarse pointer.
    '::after': {
      content: '""', position: 'absolute', insetBlockStart: '50%', insetInlineStart: '50%',
      width: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      height: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      transform: 'translate(-50%, -50%)',
    },
  },
  outline: { boxShadow: `inset 0 0 0 1px ${t['--os-color-border-muted']}` },
  outlineDisabled: { boxShadow: `inset 0 0 0 1px ${t['--os-color-border-disabled']}` },
  // A toggled object (spec 1.8 Selected 2): accent-moderate fill, accent-on-accent content.
  selected: { backgroundColor: t['--os-color-accent-moderate'], color: t['--os-color-accent-on-accent'], boxShadow: 'none' },
  selectedHovered: { backgroundColor: t['--os-color-accent-bold'] },
  selectedPressed: { backgroundColor: t['--os-color-accent-strong'] },
});

const isIcon = (node: ReactNode) => isValidElement(node) && node.type === Icon;

function sizedIcon(node: ReactNode, px: number): ReactNode {
  if (isIcon(node) && ((node as ReactElement<IconProps>).props).size === undefined) {
    return cloneElement(node as ReactElement<IconProps>, { size: px });
  }
  return node;
}

export type ToggleProps = AriaToggleButtonProps & {
  /** Control size (spec 1.2). Default `md`. `small`, `medium` and `large` are aliases of `sm`, `md` and `lg`. */
  size?: ControlSizeProp;
  /** `ghost` is transparent at rest; `outline` adds a hairline. Default `ghost`. */
  variant?: ToggleVariant;
  /** A square toggle whose only child is an icon. Give it an `aria-label`. */
  iconOnly?: boolean;
};

export function Toggle({ size: sizeProp, variant = 'ghost', iconOnly, className, children, ...props }: ToggleProps) {
  const size = normalizeSize(sizeProp);
  const icon = sizeScale[size].icon;
  const parts = typeof children === 'function' ? [] : Children.toArray(children);
  const leading = !iconOnly && parts.length > 1 && isIcon(parts[0]);
  const trailing = !iconOnly && parts.length > 1 && isIcon(parts[parts.length - 1]);
  return (
    <AriaToggleButton
      {...props}
      className={state => [
        stylex.props(
          s.base, heightStyles[size], radiusStyles[size], textStyles[size], gapStyles[size], transitionStyles.colorsAndPress,
          iconOnly ? squareStyles[size] : rectPaddingStyles[size],
          // The icon side of a rect takes the next smaller padding (spec 1.2).
          leading && rectIconPaddingStartStyles[size],
          trailing && rectIconPaddingEndStyles[size],
          variant === 'outline' && s.outline,
          state.isHovered && hoverStyles.fillActive,
          state.isPressed && pressStyles.fill,
          state.isSelected && s.selected,
          state.isSelected && state.isHovered && s.selectedHovered,
          state.isSelected && state.isPressed && s.selectedPressed,
          state.isPressed && pressStyles.scale,
          state.isDisabled && (state.isSelected ? disabledStyles.filled : disabledStyles.text),
          state.isDisabled && variant === 'outline' && !state.isSelected && s.outlineDisabled,
          state.isFocusVisible && focusStyles.ring,
        ).className,
        typeof className === 'function' ? className(state) : className,
      ].filter(Boolean).join(' ')}
    >
      {typeof children === 'function' ? children : Children.map(children, child => sizedIcon(child, icon))}
    </AriaToggleButton>
  );
}

/** @deprecated Use `Toggle`. */
export type ToggleButtonProps = ToggleProps;
/** @deprecated Use `Toggle`. */
export const ToggleButton = Toggle;
