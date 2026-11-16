'use client';

import * as stylex from '@stylexjs/stylex';
import { Children, createContext, isValidElement, useContext, useId, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import { withStyles } from './internal/class-name';
import { SrOnly } from './internal/sr-only';
import { focusStyles, hoverStyles, loadingStyles, transitionStyles } from './internal/states';

// A run's steps on a rail: what an agent did, is doing and will do (spec 1.19). Done steps are quiet,
// so the eye lands on the running step or the one waiting for a person.

export type StepState = 'pending' | 'running' | 'needs-input' | 'done' | 'failed' | 'skipped';

const stateWords: Record<StepState, string> = {
  pending: 'not started', running: 'in progress', 'needs-input': 'needs you', done: 'done', failed: 'failed', skipped: 'skipped',
};

const reduce = '@media (prefers-reduced-motion: reduce)';
/** The state marker: a 20 px indicator, the rail centered under it. */
const marker = '20px';

const s = stylex.create({
  list: { listStyleType: 'none', margin: 0, padding: 0, display: 'grid' },
  step: { position: 'relative', display: 'grid', gridTemplateColumns: `${marker} minmax(0, 1fr)`, columnGap: t['--os-space-3'] },
  gapDefault: { paddingBlockEnd: t['--os-space-4'] },
  gapCompact: { paddingBlockEnd: t['--os-space-2'] },
  last: { paddingBlockEnd: 0 },
  /** The rail runs from 2 px under this marker to 2 px above the next one. */
  rail: {
    position: 'absolute', insetInlineStart: `calc(${marker} / 2 - ${t['--os-stroke']} / 2)`,
    insetBlockStart: `calc(${marker} + ${t['--os-space-0-5']})`, insetBlockEnd: t['--os-space-0-5'],
    width: t['--os-stroke'], backgroundColor: t['--os-color-border-subtle'],
  },
  marker: {
    position: 'relative', boxSizing: 'border-box', width: marker, height: marker, borderRadius: t['--os-radius-full'],
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: t['--os-color-fg-base'],
    fontSize: t['--os-font-size-xs'], fontWeight: t['--os-font-weight-medium'], lineHeight: 1, fontVariantNumeric: 'tabular-nums',
  },
  // Not started yet: a ring in the agent gray (fg-disabled, as StatusDot), so it never reads as finished.
  pending: { borderWidth: t['--os-stroke-2'], borderStyle: 'solid', borderColor: t['--os-color-fg-disabled'], color: t['--os-color-fg-muted'] },
  skipped: { borderWidth: t['--os-stroke-2'], borderStyle: 'dashed', borderColor: t['--os-color-fg-disabled'] },
  done: { backgroundColor: t['--os-color-bg-muted'] },
  running: { color: t['--os-color-accent-moderate'] },
  waiting: { backgroundColor: t['--os-color-bg-warning'], color: t['--os-color-fg-warning'] },
  failed: { backgroundColor: t['--os-color-bg-error'], color: t['--os-color-fg-error'] },

  body: { minWidth: 0, display: 'grid', gap: t['--os-space-0-5'] },
  head: { display: 'flex', alignItems: 'flex-start', gap: t['--os-space-3'], minHeight: marker },
  title: {
    flex: '1 1 auto', minWidth: 0, color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
  titleActive: { fontWeight: t['--os-font-weight-medium'] },
  titleQuiet: { color: t['--os-color-fg-muted'] },
  titleSkipped: { color: t['--os-color-fg-subtle'], textDecorationLine: 'line-through' },
  // 13/18 on the title's 20 px line: the box keeps the title's line height so the two share a baseline row.
  meta: {
    flexShrink: 0, display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minHeight: t['--os-line-height-md'],
    color: t['--os-color-fg-subtle'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    letterSpacing: t['--os-tracking-tight'], fontVariantNumeric: 'tabular-nums',
  },
  detail: {
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    letterSpacing: t['--os-tracking-tight'],
  },
  children: { marginBlockStart: t['--os-space-2'], minWidth: 0 },
  // A ghost disclosure: its hover wash bleeds 4 past the title at the sides.
  toggle: {
    display: 'flex', alignItems: 'flex-start', gap: t['--os-space-2'], flex: '1 1 auto', minWidth: 0, margin: 0,
    marginInline: `calc(${t['--os-space-1']} * -1)`, paddingInline: t['--os-space-1'], borderWidth: 0, borderRadius: t['--os-radius-xs'],
    color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit', textAlign: 'start', cursor: 'pointer',
  },
  // The chevron's box is the title's line, so it centers on the first line.
  chevron: {
    display: 'flex', alignItems: 'center', flexShrink: 0, height: t['--os-line-height-md'], color: t['--os-color-fg-subtle'],
    transitionProperty: 'transform', transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  chevronOpen: { transform: 'rotate(90deg)' },
  details: { marginBlockStart: t['--os-space-2'], minWidth: 0 },
});

type Position = { index: number; last: boolean; numbered: boolean; compact: boolean };
const PositionContext = createContext<Position>({ index: 0, last: true, numbered: false, compact: false });

export type StepsProps = Omit<HTMLAttributes<HTMLOListElement>, 'children'> & {
  ref?: Ref<HTMLOListElement>;
  /** Names the list for assistive tech: "Run steps", "Plan". */
  'aria-label'?: string;
  /** Pending steps show their number instead of an empty ring. */
  numbered?: boolean;
  /** 8 px between steps instead of 16. */
  density?: 'default' | 'compact';
  children: ReactNode;
};

/** An ordered list of steps on a rail. */
export function Steps({ numbered = false, density = 'default', children, className, style, ref, ...props }: StepsProps) {
  const items = Children.toArray(children).filter(isValidElement);
  return (
    <ol ref={ref} {...props} {...withStyles(stylex.props(s.list), className, style)}>
      {items.map((child, index) => (
        <PositionContext.Provider key={child.key ?? index} value={{ index, last: index === items.length - 1, numbered, compact: density === 'compact' }}>
          {child}
        </PositionContext.Provider>
      ))}
    </ol>
  );
}

export type StepProps = Omit<HTMLAttributes<HTMLLIElement>, 'children' | 'title'> & {
  ref?: Ref<HTMLLIElement>;
  /** Default `pending`. */
  state?: StepState;
  title: ReactNode;
  /** One line under the title, such as the tool or the result. */
  detail?: ReactNode;
  /** Trailing text on the title's line: a duration, a cost, a badge. */
  meta?: ReactNode;
  /** Replaces the state marker, for example with an AgentGlyph. */
  marker?: ReactNode;
  /** Content under the step, indented to the title: sub-steps, file changes, actions. */
  children?: ReactNode;
  /** Content the title opens and closes, such as the step's ToolCall. The title becomes a disclosure button. */
  details?: ReactNode;
  /** Details open at first. Default false. */
  defaultExpanded?: boolean;
  /** Details open (controlled). */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
};

/** One step. Its marker shows the state; the running step's title is set in medium weight. */
export function Step({ state = 'pending', title, detail, meta, marker, children, details, defaultExpanded = false, expanded, onExpandedChange, className, style, ref, ...props }: StepProps) {
  const [ownOpen, setOwnOpen] = useState(defaultExpanded);
  const open = expanded ?? ownOpen;
  const panelId = useId();
  const { index, last, numbered, compact } = useContext(PositionContext);
  const spinner = <span {...stylex.props(loadingStyles.spinner, loadingStyles.spinnerSize(14))} />;
  const glyph = marker ?? {
    pending: numbered ? index + 1 : null,
    running: spinner,
    'needs-input': <Icon name="pause" size={12} strokeWidth={2.4} />,
    done: <Icon name="check" size={12} strokeWidth={2.4} />,
    failed: <Icon name="x" size={12} strokeWidth={2.4} />,
    skipped: null,
  }[state];
  const markerTone = marker ? null : {
    pending: s.pending, running: s.running, 'needs-input': s.waiting, done: s.done, failed: s.failed, skipped: s.skipped,
  }[state];
  const titleText = (
    <span
      {...stylex.props(
        s.title,
        (state === 'running' || state === 'needs-input') && s.titleActive,
        state === 'pending' && s.titleQuiet,
        state === 'skipped' && s.titleSkipped,
      )}
    >
      {title}<SrOnly>{`, ${stateWords[state]}`}</SrOnly>
    </span>
  );
  return (
    <li
      ref={ref}
      aria-current={state === 'running' ? 'step' : undefined}
      {...props}
      {...withStyles(stylex.props(s.step, compact ? s.gapCompact : s.gapDefault, last && s.last), className, style)}
    >
      {!last && <span aria-hidden {...stylex.props(s.rail)} />}
      <span aria-hidden {...stylex.props(s.marker, markerTone)}>{glyph}</span>
      <div {...stylex.props(s.body)}>
        <div {...stylex.props(s.head)}>
          {details ? (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => { setOwnOpen(!open); onExpandedChange?.(!open); }}
              {...stylex.props(s.toggle, hoverStyles.fill, transitionStyles.colors, focusStyles.ringVisible)}
            >
              <span aria-hidden {...stylex.props(s.chevron, open && s.chevronOpen)}><Icon name="chevron-right" size={16} /></span>
              {titleText}
            </button>
          ) : titleText}
          {meta !== undefined && <span {...stylex.props(s.meta)}>{meta}</span>}
        </div>
        {detail && <div {...stylex.props(s.detail)}>{detail}</div>}
        {children && <div {...stylex.props(s.children)}>{children}</div>}
        {details && open && <div id={panelId} {...stylex.props(s.details)}>{details}</div>}
      </div>
    </li>
  );
}
