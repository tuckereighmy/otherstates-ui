import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Badge, type BadgeSize } from './badge';
import { withStyles } from './internal/class-name';

// The one status vocabulary for agents, runs, steps and tasks (spec 1.19). Color carries meaning only:
// accent while working, warning when a person is needed, error on failure, success when done. Everything
// that is not happening yet, or no longer will, is gray.

export type AgentState = 'idle' | 'queued' | 'running' | 'needs-input' | 'paused' | 'done' | 'failed' | 'skipped' | 'canceled';

export const agentStateLabels: Record<AgentState, string> = {
  idle: 'Idle',
  queued: 'Queued',
  running: 'Running',
  'needs-input': 'Needs you',
  paused: 'Paused',
  done: 'Done',
  failed: 'Failed',
  skipped: 'Skipped',
  canceled: 'Canceled',
};

const reduce = '@media (prefers-reduced-motion: reduce)';
const pulse = stylex.keyframes({
  '0%': { transform: 'scale(1)', opacity: 0.5 },
  '70%, 100%': { transform: 'scale(2.6)', opacity: 0 },
});

const s = stylex.create({
  dot: { position: 'relative', display: 'inline-block', flexShrink: 0, borderRadius: t['--os-radius-full'], boxSizing: 'border-box' },
  sm: { width: 6, height: 6 },
  md: { width: 8, height: 8 },
  /** Not started yet: a ring, so "waiting to happen" never reads as a finished gray. */
  hollow: { borderWidth: t['--os-stroke-2'], borderStyle: 'solid', borderColor: t['--os-color-fg-disabled'] },
  gray: { backgroundColor: t['--os-color-fg-disabled'] },
  paused: { backgroundColor: t['--os-color-fg-muted'] },
  running: { backgroundColor: t['--os-color-accent-moderate'] },
  waiting: { backgroundColor: t['--os-color-fg-warning'] },
  failed: { backgroundColor: t['--os-color-fg-error'] },
  done: { backgroundColor: t['--os-color-fg-success'] },
  /** A ring that grows and fades once per two spinner periods. Reduced motion keeps the still dot. */
  pulse: {
    '::after': {
      content: '""', position: 'absolute', inset: 0, borderRadius: t['--os-radius-full'],
      backgroundColor: t['--os-color-accent-moderate'],
      animationName: { default: pulse, [reduce]: 'none' },
      animationDuration: `calc(${t['--os-motion-spin']} * 2)`,
      animationTimingFunction: t['--os-ease-exit'], animationIterationCount: 'infinite',
    },
  },
});

const text = stylex.create({
  root: {
    display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1-5'], flexShrink: 0, whiteSpace: 'nowrap',
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'],
  },
  warning: { color: t['--os-color-fg-warning'] },
  error: { color: t['--os-color-fg-error'] },
  success: { color: t['--os-color-fg-success'] },
});

const fill: Record<AgentState, stylex.StyleXStyles> = {
  idle: s.hollow, queued: s.hollow, running: s.running, 'needs-input': s.waiting, paused: s.paused,
  done: s.done, failed: s.failed, skipped: s.gray, canceled: s.gray,
};

export type StatusDotProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  ref?: Ref<HTMLSpanElement>;
  state: AgentState;
  /** 6 or 8 px. Default `md`. */
  size?: 'sm' | 'md';
  /**
   * Gives the dot a name for assistive tech ("Running"). Leave it out when the state is written next to
   * the dot, so it isn't read twice.
   */
  label?: string;
};

/** A dot in the state's color. Running pulses. */
export function StatusDot({ state, size = 'md', label, className, style, ref, ...props }: StatusDotProps) {
  return (
    <span
      ref={ref}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...props}
      {...withStyles(stylex.props(s.dot, s[size], fill[state], state === 'running' && s.pulse), className, style)}
    />
  );
}

const tone: Record<AgentState, 'secondary' | 'warning' | 'error' | 'success'> = {
  idle: 'secondary', queued: 'secondary', running: 'secondary', 'needs-input': 'warning', paused: 'secondary',
  done: 'success', failed: 'error', skipped: 'secondary', canceled: 'secondary',
};

export type StatusBadgeProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  ref?: Ref<HTMLElement>;
  state: AgentState;
  /** 20, 24 or 28 px tall. Default `sm`. Ignored by `text`. */
  size?: BadgeSize;
  /**
   * `badge` (default) is a pill, for tables and lists. `text` is the dot and the word alone, for the head of
   * an agent card, where a pill would compete with the card's content.
   */
  appearance?: 'badge' | 'text';
  /** Replaces the state's word, for example "Editing" or "Step 2 of 5". The color still follows `state`. */
  children?: ReactNode;
};

/** The state as a dot and a word. Only needs you, failed and done take a status color. */
export function StatusBadge({ state, size = 'sm', appearance = 'badge', children, className, ...props }: StatusBadgeProps) {
  if (appearance === 'text') {
    const toneStyle = tone[state] === 'secondary' ? null : text[tone[state] as 'warning' | 'error' | 'success'];
    return (
      <span {...(props as HTMLAttributes<HTMLSpanElement>)} className={[stylex.props(text.root, toneStyle).className, className].filter(Boolean).join(' ')}>
        <StatusDot state={state} size="sm" />{children ?? agentStateLabels[state]}
      </span>
    );
  }
  return (
    <Badge variant={tone[state]} size={size} icon={<StatusDot state={state} size="sm" />} className={className} {...props}>
      {children ?? agentStateLabels[state]}
    </Badge>
  );
}

/** How much an action can hurt if it goes wrong. High covers anything destructive or that spends money. */
export type RiskLevel = 'low' | 'medium' | 'high';

export const riskLabels: Record<RiskLevel, string> = { low: 'Low risk', medium: 'Medium risk', high: 'High risk' };
const riskTone: Record<RiskLevel, 'secondary' | 'warning' | 'error'> = { low: 'secondary', medium: 'warning', high: 'error' };

export type RiskBadgeProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  ref?: Ref<HTMLElement>;
  risk: RiskLevel;
  /** 20, 24 or 28 px tall. Default `sm`. Ignored by `text`. */
  size?: BadgeSize;
  /** `badge` (default) is a pill; `text` is the words alone in the risk's color, for the head of a card. */
  appearance?: 'badge' | 'text';
  /** Replaces the words, for example "Destructive". The color still follows `risk`. */
  children?: ReactNode;
};

/** An action's risk: gray for low, warning for medium, error for high. */
export function RiskBadge({ risk, size = 'sm', appearance = 'badge', children, className, ...props }: RiskBadgeProps) {
  if (appearance === 'text') {
    return (
      <span {...(props as HTMLAttributes<HTMLSpanElement>)} className={[stylex.props(text.root, risk === 'medium' && text.warning, risk === 'high' && text.error).className, className].filter(Boolean).join(' ')}>
        {children ?? riskLabels[risk]}
      </span>
    );
  }
  return <Badge variant={riskTone[risk]} size={size} className={className} {...props}>{children ?? riskLabels[risk]}</Badge>;
}
