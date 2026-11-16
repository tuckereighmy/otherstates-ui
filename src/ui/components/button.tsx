'use client';

import * as stylex from '@stylexjs/stylex';
import { cloneElement, isValidElement } from 'react';
import type { ComponentPropsWithRef, MouseEvent, ReactElement, ReactNode, Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import type { ButtonProps as AriaButtonProps } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import type { IconProps } from './Icon';
import { overlayButtonAppearance } from './internal/overlay';
import {
  normalizeSize, sizeScale, heightStyles, squareStyles, gapStyles, textStyles, radiusStyles,
  pillPaddingStyles, pillIconPaddingStartStyles, pillIconPaddingEndStyles,
} from './internal/size';
import type { ControlSize, ControlSizeProp } from './internal/size';
import { disabledStyles, focusStyles, loadingStyles, pressStyles, transitionStyles } from './internal/states';

export type ButtonAppearance = 'primary' | 'secondary' | 'tertiary' | 'text' | 'destructive' | 'destructive-outline' | 'link';

const canHover = '@media (hover: hover)';
const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  base: {
    position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    boxSizing: 'border-box', margin: 0, borderWidth: 0, borderStyle: 'none', borderRadius: t['--os-radius-control'],
    fontFamily: t['--os-font-family'], whiteSpace: 'nowrap', textDecorationLine: 'none', userSelect: 'none',
    cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
    // Hit area (spec 1.14): at least 24px under a fine pointer and 44px under a coarse one.
    '::after': {
      content: '""', position: 'absolute', insetBlockStart: '50%', insetInlineStart: '50%',
      width: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      height: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      transform: 'translate(-50%, -50%)',
    },
  },
  full: { width: '100%' },
  // Fills (spec 1.8): rest -> hover -> pressed. The pressed step repeats the hover media query: a
  // media-wrapped :hover rule compiles with doubled specificity and would beat a plain :active.
  primary: {
    color: t['--os-color-accent-on-accent'],
    backgroundColor: {
      default: t['--os-color-accent-moderate'],
      ':hover': { default: null, [canHover]: t['--os-color-accent-bold'] },
      ':active': { default: t['--os-color-accent-strong'], [canHover]: t['--os-color-accent-strong'] },
    },
  },
  secondary: {
    color: t['--os-color-fg-base'],
    backgroundColor: {
      default: t['--os-color-accent-subtle'],
      ':hover': { default: null, [canHover]: t['--os-color-accent-muted'] },
      ':active': { default: t['--os-color-accent-dim'], [canHover]: t['--os-color-accent-dim'] },
    },
  },
  ghost: {
    color: t['--os-color-fg-base'],
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [canHover]: t['--os-color-bg-interactive-primary'] },
      ':active': { default: t['--os-color-bg-interactive-secondary'], [canHover]: t['--os-color-bg-interactive-secondary'] },
    },
  },
  outlineRing: { boxShadow: `inset 0 0 0 1px ${t['--os-color-border-muted']}` },
  outlineRingDisabled: { boxShadow: `inset 0 0 0 1px ${t['--os-color-border-disabled']}` },
  noRing: { boxShadow: 'none' },
  destructive: {
    color: t['--os-color-fg-static-light'],
    backgroundColor: {
      default: t['--os-color-bg-danger-secondary'],
      ':hover': { default: null, [canHover]: t['--os-color-bg-danger-tertiary'] },
      ':active': {
        default: `color-mix(in srgb, ${t['--os-color-bg-danger-tertiary']} 86%, ${t['--os-color-fg-static-dark']})`,
        [canHover]: `color-mix(in srgb, ${t['--os-color-bg-danger-tertiary']} 86%, ${t['--os-color-fg-static-dark']})`,
      },
    },
  },
  destructiveOutline: {
    color: t['--os-color-fg-error'],
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [canHover]: t['--os-color-bg-error'] },
      ':active': {
        default: `color-mix(in srgb, ${t['--os-color-fg-error']} 12%, ${t['--os-color-bg-error']})`,
        [canHover]: `color-mix(in srgb, ${t['--os-color-fg-error']} 12%, ${t['--os-color-bg-error']})`,
      },
    },
  },
  link: {
    height: 'auto', paddingInline: 0, borderRadius: t['--os-radius-xs'],
    color: t['--os-color-fg-link'], backgroundColor: 'transparent',
    textDecorationLine: { default: 'none', ':hover': { default: null, [canHover]: 'underline' } },
    textDecorationThickness: '1px', textUnderlineOffset: '3px',
  },
  linkDisabled: { textDecorationLine: 'none' },
  contents: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 },
  icon: { display: 'inline-flex', flexShrink: 0 },
  loading: { transform: 'none' },
  // A 2px ring, as Spinner draws at 16px. Chromium floors fractional border widths, so the helper's
  // size/9 stroke would render at 1px.
  spinnerStroke: { borderWidth: 2 },
});

const appearanceStyles = {
  primary: [s.primary],
  secondary: [s.secondary],
  tertiary: [s.ghost, s.outlineRing],
  text: [s.ghost],
  destructive: [s.destructive],
  'destructive-outline': [s.destructiveOutline, s.outlineRing],
  link: [s.link],
} satisfies Record<ButtonAppearance, stylex.StyleXStyles[]>;

const filled: ReadonlySet<ButtonAppearance> = new Set(['primary', 'secondary', 'destructive']);
const outlined: ReadonlySet<ButtonAppearance> = new Set(['tertiary', 'destructive-outline']);

type StyleOptions = {
  appearance: ButtonAppearance;
  size: ControlSize;
  iconOnly?: boolean;
  leading?: boolean;
  trailing?: boolean;
  fullWidth?: boolean;
  toggledOn?: boolean;
  disabled?: boolean;
};

function buttonStyles({ appearance, size, iconOnly, leading, trailing, fullWidth, toggledOn, disabled }: StyleOptions) {
  // aria-pressed on a transparent appearance takes the toggled-object fill (spec 1.8 Selected 2).
  const toggled = !!toggledOn && (appearance === 'text' || appearance === 'tertiary');
  return [
    s.base,
    // The control radius by size (spec 1.3); `link` sets its own radius-xs below.
    radiusStyles[size],
    heightStyles[size],
    textStyles[size],
    gapStyles[size],
    transitionStyles.colorsAndPress,
    // Pill padding from the spec 1.2 table; the icon side takes the next smaller padding.
    iconOnly ? squareStyles[size] : pillPaddingStyles[size],
    !iconOnly && appearance !== 'link' && leading && pillIconPaddingStartStyles[size],
    !iconOnly && appearance !== 'link' && trailing && pillIconPaddingEndStyles[size],
    ...appearanceStyles[appearance],
    toggled && [s.primary, s.noRing],
    fullWidth && s.full,
    disabled && (filled.has(appearance) || toggled ? disabledStyles.filled : disabledStyles.text),
    disabled && outlined.has(appearance) && !toggled && s.outlineRingDisabled,
    disabled && appearance === 'link' && s.linkDisabled,
  ];
}

/** Gives an `<Icon>` without an explicit size the icon size of the control (spec 1.2). */
function sizedIcon(node: ReactNode, px: number): ReactNode {
  if (isValidElement(node) && node.type === Icon && (node.props as IconProps).size === undefined) {
    return cloneElement(node as ReactElement<IconProps>, { size: px });
  }
  return node;
}

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  /** Visual style. Default `primary`. */
  appearance?: ButtonAppearance;
  /** Control size (spec 1.2). Default `md`. `small`, `medium` and `large` are aliases of `sm`, `md` and `lg`. */
  size?: ControlSizeProp;
  /** Stretches the button to the width of its container. */
  fullWidth?: boolean;
  /** Shows a spinner in place of the label and ignores presses. The button keeps its size and fill. */
  isLoading?: boolean;
  /** @deprecated Use `isLoading`. */
  loading?: boolean;
  /** Disables the button. Same as the native `disabled`. */
  isDisabled?: boolean;
  /** A square button whose only child is an icon. Give it an `aria-label`. */
  iconOnly?: boolean;
  /** An icon before the label. An `<Icon>` without a size takes the control's icon size. */
  leadingIcon?: ReactNode;
  /** An icon after the label. An `<Icon>` without a size takes the control's icon size. */
  trailingIcon?: ReactNode;
  /** Renders an `<a>` with the button's look. */
  href?: string;
  /** The link's `target`, with `href`. */
  target?: string;
  /** The link's `rel`, with `href`. */
  rel?: string;
  /** The link's `download`, with `href`. */
  download?: boolean | string;
};

export function Button({
  appearance = 'primary', size: sizeProp, fullWidth, isLoading, loading, isDisabled, disabled, iconOnly,
  leadingIcon, trailingIcon, children, className, style, type = 'button', onClick, href, target, rel, download,
  ref, ...props
}: ButtonProps) {
  const size = normalizeSize(sizeProp);
  const icon = sizeScale[size].icon;
  const busy = !!(isLoading ?? loading);
  const off = !!(isDisabled ?? disabled);
  // `aria-busy` from the caller marks a custom loading composition (a Spinner in an icon slot): the label stays,
  // presses are ignored and the cursor is the plain arrow (spec 1.8 Loading).
  const ariaBusy = busy || props['aria-busy'] === true || props['aria-busy'] === 'true';
  const ariaDisabled = ariaBusy || props['aria-disabled'] === true || props['aria-disabled'] === 'true';
  const pressed = props['aria-pressed'] === true || props['aria-pressed'] === 'true';
  const sx = stylex.props(
    buttonStyles({ appearance, size, iconOnly, leading: !!leadingIcon, trailing: !!trailingIcon, fullWidth, toggledOn: pressed, disabled: off }),
    appearance !== 'link' && pressStyles.scaleActive,
    ariaBusy && !off && [loadingStyles.control, s.loading],
    focusStyles.ringVisible,
  );
  const content = <>
    <span {...stylex.props(s.contents, gapStyles[size], busy && loadingStyles.label)}>
      {leadingIcon && <span {...stylex.props(s.icon)}>{sizedIcon(leadingIcon, icon)}</span>}
      {iconOnly ? sizedIcon(children, icon) : children}
      {trailingIcon && <span {...stylex.props(s.icon)}>{sizedIcon(trailingIcon, icon)}</span>}
    </span>
    {busy && <span aria-hidden="true" {...stylex.props(loadingStyles.spinner, s.spinnerStroke, loadingStyles.spinnerCentered, loadingStyles.spinnerSize(icon))} />}
  </>;
  const classes = [sx.className, className].filter(Boolean).join(' ');
  const styles = sx.style || style ? { ...sx.style, ...style } : undefined;

  if (href !== undefined) {
    const { form: _form, formAction: _formAction, formEncType: _formEncType, formMethod: _formMethod, formNoValidate: _formNoValidate, formTarget: _formTarget, name: _name, value: _value, ...anchorProps } = props;
    return (
      <a
        {...(anchorProps as unknown as ComponentPropsWithRef<'a'>)}
        ref={ref as unknown as Ref<HTMLAnchorElement>}
        href={off ? undefined : href}
        target={target}
        rel={rel}
        download={download}
        role={off ? 'link' : undefined}
        aria-disabled={off || ariaDisabled || undefined}
        aria-busy={ariaBusy || undefined}
        className={classes}
        style={styles}
        onClick={event => {
          if (off || ariaDisabled) { event.preventDefault(); return; }
          onClick?.(event as unknown as MouseEvent<HTMLButtonElement>);
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={off}
      aria-busy={ariaBusy || undefined}
      aria-disabled={ariaDisabled || undefined}
      className={classes}
      style={styles}
      onClick={event => {
        if (ariaDisabled) { event.preventDefault(); return; }
        onClick?.(event);
      }}
    >
      {content}
    </button>
  );
}

export type OverlayButtonProps = Omit<AriaButtonProps, 'className' | 'style'> & {
  tone?: 'neutral' | 'primary' | 'danger';
  /** Extra StyleX styles, merged last. */
  appearanceStyles?: stylex.StyleXStyles;
};

/**
 * @deprecated The overlay button is retired (spec 2.1 G). It renders a React Aria button with the
 * Button look at size md: `tone` neutral maps to `tertiary`, primary to `primary`, danger to `destructive`.
 * Use `Button` for actions; keep this only where a React Aria trigger needs a pressable child.
 */
export function OverlayButton({ tone = 'neutral', appearanceStyles, ...props }: OverlayButtonProps) {
  const appearance = overlayButtonAppearance[tone];
  return (
    <AriaButton
      {...props}
      className={({ isFocusVisible, isDisabled, isPressed }) =>
        stylex.props(
          buttonStyles({ appearance, size: 'md', disabled: isDisabled }),
          isPressed && !isDisabled && pressStyles.scale,
          isFocusVisible ? focusStyles.ring : focusStyles.none,
          appearanceStyles,
        ).className ?? ''
      }
    />
  );
}
