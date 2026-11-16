'use client';

import * as stylex from '@stylexjs/stylex';
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { Link as AriaLink, RadioButton, RadioField, RadioGroup as AriaRadioGroup, SelectionIndicator, SharedElement, SharedElementTransition } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import type { ChoiceOption } from './internal/choice';
import { gapStyles, heightStyles, normalizeSize, pillPaddingStyles, squareStyles, textStyles, type ControlSize, type ControlSizeProp } from './internal/size';
import { useChoiceSpring } from './internal/spring';
import { disabledStyles, focusStyles, hoverStyles, pressStyles, transitionStyles } from './internal/states';
import { surfaceStyles } from './internal/surface';

const reduce = '@media (prefers-reduced-motion: reduce)';
const coarse = '@media (pointer: coarse)';
const canHover = '@media (hover: hover)';

const s = stylex.create({
  // `connected` and navigation mode: segments on a bg-muted track with a raised tile (spec 1.8 Selected 1).
  // The track takes control + 6, the segments and tile the nesting rule against it (pills at Round).
  track: { display: 'flex', flexWrap: 'nowrap', isolation: 'isolate', boxSizing: 'border-box', width: 'fit-content', maxWidth: '100%', minWidth: 0, fontFamily: t['--os-font-family'] },
  segment: {
    position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '1 1 auto', minWidth: 0,
    boxSizing: 'border-box', borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-control']} + 2px))`, whiteSpace: 'nowrap', textDecoration: 'none', cursor: 'pointer', outlineStyle: 'none',
    // Coarse-pointer hit area (spec 1.14). Neighbors sit 2px apart, so it grows only across the track.
    '::after': {
      content: '""', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: '100%', height: { default: '100%', [coarse]: 'max(100%, 44px)' },
    },
  },
  selected: { color: t['--os-color-fg-base'] },
  content: { position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'inherit', minWidth: 0 },
  label: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' },
  icon: { display: 'inline-flex', flexShrink: 0 },
  tile: {
    position: 'absolute', insetBlockStart: 0, insetInlineStart: 0, width: '100%', height: '100%', pointerEvents: 'none',
    backgroundColor: t['--os-color-bg-raised'], boxShadow: t['--os-shadow-control'], borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-control']} + 2px))`,
    // The tile travels more than 40px between segments, so it settles without overshoot (no ease-spring).
    transitionProperty: { default: 'translate, width, height', [reduce]: 'none' },
    transitionDuration: t['--os-motion-layout'], transitionTimingFunction: t['--os-ease-settle'],
    outlineStyle: { default: 'none', '@media (forced-colors: active)': 'solid' },
    outlineColor: { default: 'transparent', '@media (forced-colors: active)': 'Highlight' },
    outlineWidth: 1, outlineOffset: -1,
  },
  tileDisabled: { boxShadow: 'none' },

  // `withSurface`: a labeled bg-surface panel around the control, the same card as Card size sm: padding 16, radius xl,
  // the label 8 above the track (spec 1.11).
  surface: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: t['--os-space-2'], padding: t['--os-space-4'], width: 'fit-content', maxWidth: '100%', minWidth: 0,
    boxSizing: 'border-box', backgroundColor: t['--os-color-bg-surface'], borderRadius: t['--os-radius-xl'], fontFamily: t['--os-font-family'],
  },
  surfaceLabel: { color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], fontWeight: t['--os-font-weight-regular'], lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'] },

  // `elastic`: separate chips on a spring. The chips sit 4 apart, and the row's 4px block padding holds
  // the selected chip's 1.2 scale, so the row is 40 tall like a connected track.
  elasticRow: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: t['--os-space-1'], paddingBlock: t['--os-space-1'], maxWidth: '100%', minWidth: 0, boxSizing: 'border-box', fontFamily: t['--os-font-family'] },
  elasticPadding: (padding: number) => ({ paddingInline: padding }),
  elasticSlot: { flex: '0 0 auto', position: 'relative' },
  elasticPosition: (x: number, sx: number, sy: number) => ({ transform: `translateX(${x}px) scale(${sx}, ${sy})` }),
  field: { display: 'flex', minWidth: 0 },
  // A chip on the control scale: sm (32 tall, pill padding 12, 13/18 500) with the control radius, a pill at Round.
  elasticSegment: {
    position: 'relative', display: 'grid', placeItems: 'center', height: t['--os-size-sm'], paddingInline: t['--os-space-3'], boxSizing: 'border-box',
    borderRadius: t['--os-radius-control'], whiteSpace: 'nowrap', cursor: 'pointer', outlineStyle: 'none',
    fontSize: t['--os-font-size-caption'], fontWeight: t['--os-font-weight-medium'], lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'], fontVariantNumeric: 'tabular-nums',
    // A chip (spec 1.8 neutral filled): accent-subtle, accent-muted on hover.
    backgroundColor: { default: t['--os-color-accent-subtle'], ':hover': { default: null, [canHover]: t['--os-color-accent-muted'] } },
    color: { default: t['--os-color-fg-muted'], ':hover': { default: null, [canHover]: t['--os-color-fg-base'] } },
  },
  // Pressed steps the chip fill once more (spec 1.8: accent-subtle -> accent-muted -> accent-dim).
  elasticPressed: { backgroundColor: t['--os-color-accent-dim'] },
  elasticSelected: { backgroundColor: t['--os-color-accent-moderate'], color: t['--os-color-accent-on-accent'], cursor: 'default' },
  elasticDisabled: { backgroundColor: t['--os-color-bg-disabled'], color: t['--os-color-fg-disabled'], cursor: 'default' },
});

export type SegmentedOption = ChoiceOption & {
  /** An icon before the label. Size it to the control: 14 for `xs`, 16 for `sm` and `md`, 18 for `lg`, 20 for `xl`. */
  icon?: ReactNode;
  /** Shows only the icon; `label` stays the accessible name. */
  hideLabel?: boolean;
  /** Renders the option as a link. Give every option an `href` to use the control as navigation. */
  href?: string;
};

export type SegmentedControlProps = {
  /** Names the group for assistive tech. Shown above the control with `withSurface`. */
  label: string;
  options: SegmentedOption[];
  /** The selected value (controlled). In navigation mode, the current page. */
  value?: string;
  /** The value selected at first (uncontrolled). Default: the first enabled option. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** `connected` (default): pills on a track. `elastic`: separate chips with a spring. */
  appearance?: 'connected' | 'elastic';
  /** Height of each segment on the control scale; the track adds 4px around them. Default `sm` (32 in a 40 track). Ignored by `elastic`. */
  size?: ControlSizeProp;
  isDisabled?: boolean;
  /** @deprecated Use `isDisabled`. */
  disabled?: boolean;
  /** Form field name for the selected value. */
  name?: string;
  /** The id of a `<form>` to submit with, when the control sits outside it. */
  form?: string;
  /** Wraps the control in a labeled surface panel. */
  withSurface?: boolean;
  /** Spring wobble for `elastic`, 0 to 100. */
  wobble?: number;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

type SegmentState = { size: ControlSize; square: boolean; isSelected: boolean; isDisabled: boolean; isPressed: boolean; isFocusVisible: boolean };

function segmentClass({ size, square, isSelected, isDisabled, isPressed, isFocusVisible }: SegmentState) {
  return stylex.props(
    s.segment, heightStyles[size], gapStyles[size], textStyles[size], square ? squareStyles[size] : pillPaddingStyles[size],
    transitionStyles.colorsAndPress, hoverStyles.text,
    isSelected && s.selected,
    isPressed && !isDisabled && pressStyles.scale,
    isDisabled && disabledStyles.text,
    // Inset ring: neighbors sit 2px away, and the tile would paint over an outline.
    isFocusVisible && focusStyles.ringInsetOverlay,
  ).className ?? '';
}

function SegmentContent({ option }: { option: SegmentedOption }) {
  return (
    <span {...stylex.props(s.content)}>
      {option.icon && <span {...stylex.props(s.icon)}>{option.icon}</span>}
      {!option.hideLabel && <span {...stylex.props(s.label)}>{option.label}</span>}
    </span>
  );
}

function ElasticOption({ option, index, selectedIndex, selectedWidth, reportWidth, instant, wobble }: { option: SegmentedOption; index: number; selectedIndex: number; selectedWidth: number; instant: boolean; wobble: number; reportWidth: (index: number, width: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const selected = index === selectedIndex;
  const direction = Math.sign(index - selectedIndex);
  // Each axis carries its own momentum; the neighbors soften with distance instead of replaying one
  // shared keyframe.
  const distance = Math.abs(index - selectedIndex);
  const stiffness = 580 * (1 - .12 * Math.min(distance, 3));
  const give = Math.max(0, Math.min(100, wobble)) / 100 * 1.5;
  const xK = stiffness / .9;
  const sxK = stiffness * (1 + .24 * give) / (.9 - .1 * give);
  const syK = stiffness * (1 - .14 * give) / (.9 + .05 * give);
  const x = useChoiceSpring(direction * (selectedWidth * .1 + 6), xK, 1.5 * Math.sqrt(xK), distance * 22, instant, 8);
  const sx = useChoiceSpring(selected ? 1.2 : .95, sxK, 2 * Math.sqrt(sxK) * (1 - Math.min(.85, .25 + .3 * give)), distance * 22, instant, 8);
  const sy = useChoiceSpring(selected ? 1.2 : .95, syK, 1.5 * Math.sqrt(syK), distance * 22, instant, 8, 50 * give);
  useLayoutEffect(() => {
    const measure = () => { if (ref.current) reportWidth(index, ref.current.offsetWidth); };
    measure();
    const observer = new ResizeObserver(measure);
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index, reportWidth]);
  return <div ref={ref} {...stylex.props(s.elasticSlot, s.elasticPosition(x, sx, sy))}>
    <RadioField value={option.value} isDisabled={option.disabled} aria-label={option.hideLabel ? option.label : undefined} {...stylex.props(s.field)}>
      <RadioButton className={({ isSelected, isDisabled, isFocusVisible, isPressed }) => stylex.props(s.elasticSegment, transitionStyles.colorsAndPress,
        isSelected && s.elasticSelected, isDisabled && s.elasticDisabled,
        isPressed && !isSelected && !isDisabled && [s.elasticPressed, pressStyles.scale], isFocusVisible && focusStyles.ring).className ?? ''}>
        <SegmentContent option={option} />
      </RadioButton>
    </RadioField>
  </div>;
}

/**
 * A short row of mutually exclusive choices. A radio group by default; when every option has an
 * `href`, a row of links with `aria-current` on the current one.
 */
export function SegmentedControl({ label, name, form, options, value, defaultValue, onChange, isDisabled, disabled, appearance = 'connected', size: sizeProp, wobble = 67, withSurface = false, className, style, ref }: SegmentedControlProps) {
  const size = normalizeSize(sizeProp, 'sm');
  const groupDisabled = isDisabled ?? disabled ?? false;
  const firstEnabled = options.find(option => !option.disabled)?.value;
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabled);
  const [instant, setInstant] = useState(false);
  const [widths, setWidths] = useState<Record<number, number>>({});
  const selectedValue = value ?? internalValue;
  const selectedIndex = options.findIndex(option => option.value === selectedValue);
  const navigation = options.length > 0 && options.every(option => option.href !== undefined);
  const elastic = appearance === 'elastic' && !navigation;
  const reportWidth = useRef((index: number, width: number) => setWidths(current => current[index] === width ? current : { ...current, [index]: width })).current;
  const select = (next: string) => { if (value === undefined) setInternalValue(next); onChange?.(next); };

  // Without a surface, the track is the outermost element and takes className, style and ref.
  const own = elastic
    ? stylex.props(s.elasticRow, s.elasticPadding(Math.ceil(Math.max(49, ...Object.values(widths)) * .13 + 6) + 2))
    : stylex.props(surfaceStyles.track, surfaceStyles.trackPill, s.track);
  const trackProps = withSurface
    ? { className: own.className, style: own.style }
    : { ref, className: withClassName(own, className), style: { ...own.style, ...style } };
  const instantProps = { onKeyDownCapture: () => setInstant(true), onPointerDownCapture: () => setInstant(false) };

  const control = navigation ? (
    <nav aria-label={label} {...trackProps}>
      <SharedElementTransition>
        {options.map(option => {
          const current = option.value === selectedValue;
          return (
            <AriaLink
              key={option.value}
              href={option.href}
              aria-current={current ? 'page' : undefined}
              aria-label={option.hideLabel ? option.label : undefined}
              isDisabled={groupDisabled || option.disabled}
              onPress={() => select(option.value)}
              className={state => segmentClass({ ...state, size, square: !!option.hideLabel, isSelected: current })}
            >
              <SharedElement name="segment-tile" isVisible={current} {...stylex.props(s.tile, groupDisabled && s.tileDisabled)} />
              <SegmentContent option={option} />
            </AriaLink>
          );
        })}
      </SharedElementTransition>
    </nav>
  ) : (
    <AriaRadioGroup
      aria-label={label} name={name} form={form} value={selectedValue ?? null} onChange={select} isDisabled={groupDisabled} orientation="horizontal"
      {...(withSurface ? {} : instantProps)}
      {...trackProps}
    >
      {options.map((option, index) => elastic
        ? <ElasticOption key={option.value} option={option} index={index} selectedIndex={selectedIndex} selectedWidth={widths[selectedIndex] ?? 49} reportWidth={reportWidth} instant={instant} wobble={wobble} />
        : <RadioField key={option.value} value={option.value} isDisabled={option.disabled} aria-label={option.hideLabel ? option.label : undefined} {...stylex.props(s.field)}>
            <RadioButton className={state => segmentClass({ ...state, size, square: !!option.hideLabel })}>
              {({ isDisabled: segmentDisabled }) => <>
                <SelectionIndicator aria-hidden="true" {...stylex.props(s.tile, segmentDisabled && s.tileDisabled)} />
                <SegmentContent option={option} />
              </>}
            </RadioButton>
          </RadioField>)}
    </AriaRadioGroup>
  );

  if (!withSurface) return control;
  const panel = stylex.props(s.surface);
  return (
    <div ref={ref} className={withClassName(panel, className)} style={style} {...instantProps}>
      <span aria-hidden="true" {...stylex.props(s.surfaceLabel)}>{label}</span>
      {control}
    </div>
  );
}
