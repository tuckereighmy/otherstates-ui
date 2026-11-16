import * as stylex from '@stylexjs/stylex';
import { createContext, useContext, type ReactNode } from 'react';
import { FieldErrorContext, Text } from 'react-aria-components';
import { useChoiceSpring } from './spring';
import { focusStyles } from './states';
import { FieldContext } from './control';
import { normalizeSize, type ControlSizeProp, type LegacyControlSize } from './size';
import { tokens as t } from '../../tokens.stylex';

// Checkbox, radio and switch indicators plus the choice row they sit in (DESIGN_SPEC 1.7, 1.8, 1.11).
// Checkbox and radio rings are 1.5px inset box-shadows in border-control (3:1 against canvas).
// A choice row is 32 tall at every size: the indicator sits in a slot as tall as the label's line
// box, so it stays on the first line when the label wraps or a description follows.

const reduce = '@media (prefers-reduced-motion: reduce)';
const coarse = '@media (pointer: coarse)';
const ringOf = (color: string) => `inset 0 0 0 1.5px ${color}`;

/** Choice sizes. Rows stay 32 tall; the indicator and the text scale. */
export type ChoiceSize = 'sm' | 'md' | 'lg';
/** `sm | md | lg`, plus the legacy `small | medium | large`. */
export type ChoiceSizeProp = ChoiceSize | LegacyControlSize;
/**
 * `default` is a bare row; `card` puts the row in a bordered tile with room for a description; `row` is a
 * full-width settings row with the label leading and the control at the end, for lists with dividers.
 */
export type ChoiceVariant = 'default' | 'card' | 'row';
export type ChoiceKind = 'checkbox' | 'radio' | 'switch';

/** Maps legacy names (`small`, `medium`, `large`) and clamps xs/xl to the three choice sizes. */
export function normalizeChoiceSize(size: ChoiceSizeProp | ControlSizeProp | undefined, fallback: ChoiceSize = 'md'): ChoiceSize {
  const next = normalizeSize(size, fallback);
  return next === 'xs' ? 'sm' : next === 'xl' ? 'lg' : next;
}

/** Indicator widths (px): checkbox and radio box, switch track. The error line is indented by width + 12. */
export const choiceIndicatorWidth: Record<ChoiceKind, Record<ChoiceSize, number>> = {
  checkbox: { sm: 16, md: 18, lg: 20 },
  radio: { sm: 16, md: 18, lg: 20 },
  switch: { sm: 32, md: 40, lg: 48 },
};

/** Size and variant inherited by the choices inside a CheckboxGroup or RadioGroup. */
export const ChoiceGroupContext = createContext<{ size: ChoiceSize; variant: ChoiceVariant } | null>(null);

export function useChoiceGroup() {
  return useContext(ChoiceGroupContext);
}

/** The surrounding Field, if any (spec 1.11): its state and message ids apply to the choice. */
export function useChoiceField() {
  return useContext(FieldContext);
}

/** Joins id lists for aria-describedby. */
export function joinIds(...ids: Array<string | undefined | null | false>) {
  const list = ids.filter(Boolean).join(' ');
  return list || undefined;
}

export const choiceStyles = stylex.create({
  field: {
    display: 'grid',
    gap: t['--os-space-1'],
    minWidth: 0,
  },
  /** A compact choice row: 32 tall, indicator then label 12px apart, 14/20 at 400. */
  choice: {
    display: 'flex',
    alignItems: 'center',
    gap: t['--os-space-3'],
    minHeight: t['--os-size-sm'],
    width: 'fit-content',
    maxWidth: '100%',
    color: t['--os-color-fg-base'],
    fontSize: t['--os-font-size-sm'],
    fontWeight: t['--os-font-weight-regular'],
    letterSpacing: t['--os-tracking-tight'],
    lineHeight: t['--os-line-height-md'],
    cursor: 'pointer',
  },
  disabledText: {
    color: t['--os-color-fg-disabled'],
    cursor: 'default',
  },
  labelText: {
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
  /** Error line: 13/20 fg-error. */
  error: {
    margin: 0,
    color: t['--os-color-fg-error'],
    fontSize: t['--os-font-size-caption'],
    lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },
  indicator: {
    display: 'inline-grid',
    placeItems: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    width: 18,
    height: 18,
    backgroundColor: t['--os-color-bg-surface'],
    borderWidth: 0,
    transitionProperty: 'background-color, box-shadow, transform',
    transitionDuration: { default: `${t['--os-motion-hover']}, ${t['--os-motion-hover']}, ${t['--os-motion-press']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  /** Checkbox and radio ring at rest. */
  ring: { boxShadow: ringOf(t['--os-color-border-control']) },
  /** Hover on an unselected checkbox or radio: the ring steps toward fg (60% ink) and the fill goes bg-subtle. */
  ringHovered: {
    boxShadow: ringOf(`color-mix(in srgb, ${t['--os-color-fg-base']} 60%, transparent)`),
    backgroundColor: t['--os-color-bg-subtle'],
  },
  /** A selected radio is a solid disc: the fill carries the edge. */
  ringSelected: { boxShadow: 'none' },
  ringInvalid: { boxShadow: ringOf(t['--os-color-border-error']) },
  ringDisabled: { boxShadow: ringOf(t['--os-color-border-disabled']) },
  /** Read-only and unselected: the fill goes bg-subtle, like a read-only shell (spec 1.8). */
  readOnlyIndicator: { backgroundColor: t['--os-color-bg-subtle'] },
  checkbox: {
    position: 'relative', overflow: 'hidden', borderWidth: 0,
    borderRadius: t['--os-radius-sm'],
  },
  /** @deprecated The checkbox box now rests on bg-surface, like the radio. */
  checkboxSurface: { backgroundColor: 'transparent' },
  /** @deprecated Use `ringInvalid`. */
  checkboxInvalid: { boxShadow: ringOf(t['--os-color-border-error']) },
  checkboxFill: {
    position: 'absolute', inset: 0, transformOrigin: '50% 50%', backgroundColor: t['--os-color-accent-moderate'],
    transitionProperty: 'background-color',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  checkboxFillHovered: { backgroundColor: t['--os-color-accent-bold'] },
  checkboxFillScale: (scale: number) => ({ transform: `scale(${scale})` }),
  checkboxTick: { position: 'relative', width: '68%', height: '68%', color: t['--os-color-accent-on-accent'], fill: 'none', overflow: 'visible' },
  checkboxTickDisabled: { color: t['--os-color-fg-disabled'] },
  round: {
    borderRadius: t['--os-radius-full'],
  },
  /** @deprecated Switch hover now steps accent-muted -> accent-dim (`switchOffHovered`). */
  hovered: {
    backgroundColor: t['--os-color-bg-subtle'],
  },
  selected: {
    backgroundColor: t['--os-color-accent-moderate'],
    color: t['--os-color-accent-on-accent'],
  },
  selectedHovered: {
    backgroundColor: t['--os-color-accent-bold'],
  },
  /** Press scale for controls of 24px and up (segments, the switch track). */
  pressed: {
    transform: { default: 'scale(.97)', [reduce]: 'none' },
  },
  /** Press scale for indicators of 20px or less (checkbox, radio). */
  pressedIndicator: {
    transform: { default: 'scale(.9)', [reduce]: 'none' },
  },
  /** @deprecated Rings carry the invalid state now (`ringInvalid`). Kept for compositions that still pass it. */
  invalid: {
    borderColor: t['--os-color-border-error'],
  },
  disabledIndicator: {
    backgroundColor: t['--os-color-bg-disabled'],
    color: t['--os-color-fg-disabled'],
  },
  /** The focus ring (spec 1.8): 2px, focus-ring color, offset 2. */
  keyboardFocus: {
    outlineStyle: 'solid',
    outlineWidth: 2,
    outlineColor: t['--os-color-focus-ring'],
    outlineOffset: 2,
  },
  mark: {
    display: 'block',
    pointerEvents: 'none',
  },
  checkmark: {
    width: 5,
    height: 9,
    borderStyle: 'solid',
    borderColor: 'currentColor',
    borderWidth: '0 2px 2px 0',
    transform: 'translateY(-1px) rotate(45deg)',
  },
  dash: {
    width: 8,
    height: 2,
    borderRadius: t['--os-radius-full'],
    backgroundColor: 'currentColor',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: t['--os-radius-full'],
    backgroundColor: 'currentColor',
  },
  /**
   * The compact switch track: thumb plus 2px padding all round, and a travel of 16 (sm 12, lg 20), so the
   * tracks are 32 x 20, 40 x 24 and 48 x 28.
   */
  switchTrack: {
    display: 'flex',
    alignItems: 'center',
    width: 40,
    height: 24,
    padding: t['--os-space-0-5'],
    borderWidth: 0,
    backgroundColor: t['--os-color-accent-muted'],
    color: t['--os-color-fg-muted'],
  },
  /** Off-track hover steps toward fg (spec 2.2 Switch). */
  switchOffHovered: { backgroundColor: t['--os-color-accent-dim'] },
  switchTrackSmall: {
    width: 32,
    height: 20,
  },
  switchTrackLarge: {
    width: 48,
    height: 28,
  },
  switchThumb: {
    display: 'block',
    flexShrink: 0,
    width: 20,
    height: 20,
    marginInlineStart: 0,
    borderRadius: t['--os-radius-full'],
    backgroundColor: t['--os-color-bg-surface'],
    boxShadow: t['--os-shadow-control'],
    transitionProperty: 'margin-inline-start, background-color',
    transitionDuration: { default: `${t['--os-motion-popup']}, ${t['--os-motion-hover']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  switchThumbSmall: {
    width: 16,
    height: 16,
  },
  switchThumbLarge: {
    width: 24,
    height: 24,
  },
  switchThumbSmallSelected: {
    marginInlineStart: t['--os-space-3'],
  },
  switchThumbSelected: {
    marginInlineStart: t['--os-space-4'],
  },
  switchThumbLargeSelected: {
    marginInlineStart: t['--os-space-5'],
  },
  switchThumbOn: { backgroundColor: t['--os-color-accent-on-accent'] },
  /** A disabled switch that is on keeps a visible knob: fg-disabled on the bg-disabled track. */
  switchThumbDisabledOn: { backgroundColor: t['--os-color-fg-disabled'], boxShadow: 'none' },
});

const indicatorSizeStyles = stylex.create({
  sm: { width: 16, height: 16 },
  md: { width: 18, height: 18 },
  lg: { width: 20, height: 20 },
});

const dotSizeStyles = stylex.create({
  sm: { width: 6, height: 6 },
  md: { width: 7, height: 7 },
  lg: { width: 8, height: 8 },
});

export type ChoiceState = {
  isSelected: boolean;
  isDisabled: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
  isHovered: boolean;
  isInvalid?: boolean;
  isIndeterminate?: boolean;
  isReadOnly?: boolean;
};

function CheckboxMark({ selected, indeterminate, disabled, hovered }: { selected: boolean; indeterminate: boolean; disabled: boolean; hovered: boolean }) {
  const fill = useChoiceSpring(selected ? 1 : 0, 500, 20);
  const drawn = Math.max(0, Math.min(1, fill));
  return <>
    <span {...stylex.props(choiceStyles.checkboxFill, choiceStyles.checkboxFillScale(Math.max(0, fill)), hovered && choiceStyles.checkboxFillHovered, disabled && choiceStyles.disabledIndicator)}/>
    <svg aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...stylex.props(choiceStyles.checkboxTick, disabled && choiceStyles.checkboxTickDisabled)}>
      <path d={indeterminate ? 'M6 12h12' : 'M6 12.4 L10.3 16.7 L18 7.6'} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - drawn}/>
    </svg>
  </>;
}

export function ChoiceIndicator({
  kind,
  state,
  large = false,
  size,
  focusRing = true,
}: {
  kind: ChoiceKind;
  state: ChoiceState;
  /** @deprecated Use `size="lg"`. */
  large?: boolean;
  size?: ChoiceSize;
  /** Draw the keyboard focus ring on the indicator. Card rows draw it on the card instead. */
  focusRing?: boolean;
}) {
  const { isSelected, isDisabled, isPressed, isFocusVisible, isHovered, isInvalid, isIndeterminate, isReadOnly } = state;
  const resolved: ChoiceSize = size ?? (large ? 'lg' : 'md');
  const switchKind = kind === 'switch';
  const ringed = !switchKind;
  const selected = isSelected || isIndeterminate;
  const interactive = !isDisabled && !isReadOnly;
  const hovered = isHovered && interactive;

  return (
    <span aria-hidden="true" {...stylex.props(
      choiceStyles.indicator,
      ringed && indicatorSizeStyles[resolved],
      kind === 'checkbox' ? choiceStyles.checkbox : choiceStyles.round,
      switchKind && choiceStyles.switchTrack,
      switchKind && resolved === 'sm' && choiceStyles.switchTrackSmall,
      switchKind && resolved === 'lg' && choiceStyles.switchTrackLarge,
      ringed && choiceStyles.ring,
      ringed && isReadOnly && !selected && !isDisabled && choiceStyles.readOnlyIndicator,
      hovered && !selected && (ringed ? choiceStyles.ringHovered : choiceStyles.switchOffHovered),
      // The checkbox fill is the spring-scaled span inside; the box itself keeps its surface.
      selected && kind !== 'checkbox' && choiceStyles.selected,
      selected && kind !== 'checkbox' && hovered && choiceStyles.selectedHovered,
      selected && kind === 'radio' && choiceStyles.ringSelected,
      isPressed && interactive && (switchKind ? choiceStyles.pressed : choiceStyles.pressedIndicator),
      isInvalid && !isDisabled && choiceStyles.ringInvalid,
      isDisabled && choiceStyles.disabledIndicator,
      ringed && isDisabled && choiceStyles.ringDisabled,
      focusRing && isFocusVisible && choiceStyles.keyboardFocus,
    )}>
      {kind === 'checkbox' ? <CheckboxMark selected={!!selected} indeterminate={!!isIndeterminate} disabled={isDisabled} hovered={hovered}/> : switchKind ? (
        <span {...stylex.props(
          choiceStyles.switchThumb,
          resolved === 'sm' && choiceStyles.switchThumbSmall,
          resolved === 'lg' && choiceStyles.switchThumbLarge,
          selected && choiceStyles.switchThumbOn,
          selected && (resolved === 'sm' ? choiceStyles.switchThumbSmallSelected : resolved === 'lg' ? choiceStyles.switchThumbLargeSelected : choiceStyles.switchThumbSelected),
          selected && isDisabled && choiceStyles.switchThumbDisabledOn,
        )} />
      ) : selected ? (
        <span {...stylex.props(choiceStyles.mark, choiceStyles.dot, dotSizeStyles[resolved])} />
      ) : null}
    </span>
  );
}

// ---------------------------------------------------------------------------------------------
// The choice row: the clickable label that holds the indicator, the label text and a description.

const rowStyles = stylex.create({
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: t['--os-space-3'],
    boxSizing: 'border-box',
    width: 'fit-content',
    maxWidth: '100%',
    minWidth: 0,
    color: t['--os-color-fg-base'],
    fontWeight: t['--os-font-weight-regular'],
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
  },
  /** Standalone rows get a 44px hit area on coarse pointers (spec 1.14). */
  hitArea: {
    position: 'relative',
    '::after': {
      content: '""',
      position: 'absolute',
      insetInlineStart: 0,
      insetBlockStart: '50%',
      width: '100%',
      height: { default: '100%', [coarse]: 'max(100%, 44px)' },
      transform: 'translateY(-50%)',
    },
  },
  card: {
    width: '100%',
    // Longhands: the row's size style sets paddingBlock, which would outrank a `padding` shorthand.
    paddingBlock: t['--os-space-4'],
    paddingInline: t['--os-space-4'],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: t['--os-color-border-subtle'],
    borderRadius: t['--os-radius-lg'],
    backgroundColor: t['--os-color-bg-surface'],
    transitionProperty: 'border-color, background-color',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  cardSmall: { paddingBlock: t['--os-space-3'], paddingInline: t['--os-space-3'] },
  cardHovered: { borderColor: t['--os-color-border-muted'] },
  cardSelected: { borderColor: t['--os-color-accent-moderate'] },
  cardReadOnly: { backgroundColor: t['--os-color-bg-subtle'] },
  cardInvalid: { borderColor: t['--os-color-border-error'] },
  cardDisabled: { borderColor: t['--os-color-border-disabled'], backgroundColor: t['--os-color-bg-disabled'] },
  inert: { cursor: 'default' },
  slot: { display: 'flex', alignItems: 'center', flexShrink: 0 },
  /** A settings row: full width, the control centered at the end, 16px clear of the text. */
  rowWide: { width: '100%', alignItems: 'center', columnGap: t['--os-space-4'] },
  /** The switch sits at the end of a card row, settings-style. */
  slotEnd: { order: 1, marginInlineStart: 'auto' },
  text: { display: 'flex', flexDirection: 'column', minWidth: 0, flexGrow: 1 },
  label: { minWidth: 0, overflowWrap: 'anywhere', letterSpacing: t['--os-tracking-tight'] },
  labelCard: { fontWeight: t['--os-font-weight-medium'] },
  required: { color: t['--os-color-fg-muted'] },
  description: { margin: 0, minWidth: 0, overflowWrap: 'anywhere', color: t['--os-color-fg-muted'] },
  disabled: { color: t['--os-color-fg-disabled'] },
  hidden: {
    position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, borderWidth: 0,
    overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap',
  },
});

/** Block padding that makes a row 32 tall (the compact row) around one line of text: (32 - line height) / 2. */
const rowSizeStyles = stylex.create({
  sm: { paddingBlock: `calc((${t['--os-size-sm']} - ${t['--os-line-height-sm']}) / 2)`, fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'] },
  md: { paddingBlock: `calc((${t['--os-size-sm']} - ${t['--os-line-height-md']}) / 2)`, fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
  lg: { paddingBlock: `calc((${t['--os-size-sm']} - ${t['--os-line-height-md']}) / 2)`, fontSize: t['--os-font-size-md'], lineHeight: t['--os-line-height-md'] },
});

/** The indicator slot is as tall as the label's line box, so the indicator stays on the first line. */
const slotSizeStyles = stylex.create({
  sm: { height: t['--os-line-height-sm'] },
  md: { height: t['--os-line-height-md'] },
  lg: { height: t['--os-line-height-md'] },
});

const descriptionSizeStyles = stylex.create({
  sm: { fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], letterSpacing: 0 },
  md: { fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'] },
  lg: { fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'] },
});

/** The error line under a single choice: 8px below the label's line box, aligned with the label text. */
const errorStyles = stylex.create({
  // 2 below the row, whose own block padding (6) puts the line 8 below the label (spec 1.11).
  root: { display: 'block', marginBlockStart: t['--os-space-0-5'] },
  card: { marginBlockStart: t['--os-space-2'] },
  indent: (px: number) => ({ paddingInlineStart: px }),
});

export type ChoiceRowOptions = {
  kind: ChoiceKind;
  size: ChoiceSize;
  variant: ChoiceVariant;
  /** A choice on its own (not inside a group) gets the coarse-pointer hit area. */
  standalone?: boolean;
};

/** className for the RAC `CheckboxButton` / `RadioButton` / `SwitchButton` that forms the row. */
export function choiceRowClassName({ kind, size, variant, standalone = false }: ChoiceRowOptions) {
  return (state: ChoiceState) => {
    const card = variant === 'card';
    const inert = state.isDisabled || state.isReadOnly;
    return stylex.props(
      rowStyles.row,
      rowSizeStyles[size],
      standalone && !card && rowStyles.hitArea,
      card && rowStyles.card,
      variant === 'row' && rowStyles.rowWide,
      card && size === 'sm' && rowStyles.cardSmall,
      card && state.isHovered && !inert && rowStyles.cardHovered,
      card && kind !== 'switch' && (state.isSelected || state.isIndeterminate) && rowStyles.cardSelected,
      card && state.isReadOnly && rowStyles.cardReadOnly,
      card && state.isInvalid && rowStyles.cardInvalid,
      card && state.isDisabled && rowStyles.cardDisabled,
      inert && rowStyles.inert,
      card && state.isFocusVisible && focusStyles.ring,
    ).className ?? '';
  };
}

/**
 * The help text under a choice label. It hides while an error message shows, because the error
 * replaces it (spec 1.8). Option descriptions inside a group pass `persistent`.
 */
export function ChoiceDescription({ children, size, disabled, hasErrorMessage = false, persistent = false }: {
  children: ReactNode; size: ChoiceSize; disabled?: boolean; hasErrorMessage?: boolean; persistent?: boolean;
}) {
  const validation = useContext(FieldErrorContext);
  if (!persistent && validation?.isInvalid && (hasErrorMessage || validation.validationErrors.length > 0)) return null;
  return <Text slot="description" {...stylex.props(rowStyles.description, descriptionSizeStyles[size], disabled && rowStyles.disabled)}>{children}</Text>;
}

/** Indicator slot, label and description for a choice row. Render it inside the row's render prop. */
export function ChoiceContent({
  kind, state, size, variant, label, labelId, description, hideLabel = false, required = false,
  hasErrorMessage = false, persistentDescription = false,
}: {
  kind: ChoiceKind;
  state: ChoiceState;
  size: ChoiceSize;
  variant: ChoiceVariant;
  label?: ReactNode;
  labelId?: string;
  description?: ReactNode;
  hideLabel?: boolean;
  required?: boolean;
  hasErrorMessage?: boolean;
  persistentDescription?: boolean;
}) {
  const card = variant === 'card';
  const row = variant === 'row';
  return <>
    <span {...stylex.props(rowStyles.slot, slotSizeStyles[size], ((card && kind === 'switch') || row) && rowStyles.slotEnd)}>
      <ChoiceIndicator kind={kind} state={state} size={size} focusRing={!card} />
    </span>
    {label != null && label !== false && (
      <span {...stylex.props(rowStyles.text, hideLabel && rowStyles.hidden)}>
        <span id={labelId} {...stylex.props(rowStyles.label, (card || row) && rowStyles.labelCard, state.isDisabled && rowStyles.disabled)}>
          {label}{required && <span aria-hidden="true" {...stylex.props(rowStyles.required, state.isDisabled && rowStyles.disabled)}> *</span>}
        </span>
        {description != null && description !== false && (
          <ChoiceDescription size={size} disabled={state.isDisabled} hasErrorMessage={hasErrorMessage} persistent={persistentDescription}>{description}</ChoiceDescription>
        )}
      </span>
    )}
  </>;
}

/** Props for the error line of a single choice (`FieldError`): fg-error 13/20, indented to the label. */
export function choiceErrorProps({ kind, size, variant, hideLabel = false }: { kind: ChoiceKind; size: ChoiceSize; variant: ChoiceVariant; hideLabel?: boolean }) {
  const card = variant === 'card';
  const indent = card || variant === 'row' || hideLabel ? 0 : choiceIndicatorWidth[kind][size] + 12;
  return stylex.props(choiceStyles.error, errorStyles.root, card && errorStyles.card, indent > 0 && errorStyles.indent(indent));
}

// ---------------------------------------------------------------------------------------------
// Group layout shared by CheckboxGroup and RadioGroup.

export const choiceGroupStyles = stylex.create({
  /** Label, list and help text, 8px apart (spec 1.11). */
  root: { display: 'grid', gap: t['--os-space-2'], minWidth: 0 },
  label: {
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'],
  },
  labelDisabled: { color: t['--os-color-fg-disabled'] },
  required: { color: t['--os-color-fg-muted'] },
  /** Choice rows 4px apart: 32px rows on a 36px pitch. */
  list: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: t['--os-space-1'], minWidth: 0 },
  horizontal: { flexDirection: 'row', flexWrap: 'wrap', columnGap: t['--os-space-4'], rowGap: t['--os-space-1'] },
  /** Cards stack 8px apart and fill the row. */
  cards: { alignItems: 'stretch', gap: t['--os-space-2'] },
  cardsHorizontal: { flexDirection: 'row', flexWrap: 'wrap', gap: t['--os-space-2'] },
  cardItem: { flexGrow: 1, flexShrink: 1, flexBasis: 200, minWidth: 0 },
  help: {
    display: 'block', margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
  helpDisabled: { color: t['--os-color-fg-disabled'] },
  error: { color: t['--os-color-fg-error'] },
});

/** Group help text, 13/20 fg-muted. It hides while the group shows an error, which replaces it (spec 1.8). */
export function ChoiceGroupHelp({ children, disabled, hasErrorMessage = false }: { children: ReactNode; disabled?: boolean; hasErrorMessage?: boolean }) {
  const validation = useContext(FieldErrorContext);
  if (validation?.isInvalid && (hasErrorMessage || validation.validationErrors.length > 0)) return null;
  return <Text slot="description" {...stylex.props(choiceGroupStyles.help, disabled && choiceGroupStyles.helpDisabled)}>{children}</Text>;
}

/** Child rows under a "select all" parent start where the parent's label starts (indicator + 12). */
export const choiceIndentStyles = stylex.create({
  sm: { paddingInlineStart: `calc(16px + ${t['--os-space-3']})` },
  md: { paddingInlineStart: `calc(18px + ${t['--os-space-3']})` },
  lg: { paddingInlineStart: `calc(20px + ${t['--os-space-3']})` },
});

export type ToggleProps = {
  label: ReactNode;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

export function choiceClassName({ isDisabled }: { isDisabled: boolean }) {
  return stylex.props(choiceStyles.choice, isDisabled && choiceStyles.disabledText).className ?? '';
}

export type ChoiceOption = { value: string; label: string; disabled?: boolean };
