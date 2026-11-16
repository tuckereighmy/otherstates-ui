'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { AgentGlyph, type AgentColor } from './agent-identity';
import { Button } from './button';
import { Icon, type IconName } from './Icon';
import { withStyles } from './internal/class-name';
import { SrOnly } from './internal/sr-only';
import { Tooltip } from './tooltip';

// One message in a thread (spec 1.20). A person's message is a bubble on the end side; an assistant's reply
// is prose across the column, with no bubble and no avatar, its parts (reasoning, runs, text, cards) 16 px
// apart. Actions sit under a message: always on the newest reply, on hover or focus for the others.

const noHover = '@media (hover: none)';
const reduce = '@media (prefers-reduced-motion: reduce)';

const s = stylex.create({
  user: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: t['--os-space-1'], minWidth: 0 },
  bubble: {
    maxWidth: '75%', boxSizing: 'border-box', paddingBlock: t['--os-space-2'], paddingInline: t['--os-space-4'],
    borderRadius: `min(${t['--os-radius-control']}, ${t['--os-radius-xl']})`, backgroundColor: t['--os-color-bg-muted'],
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'],
    letterSpacing: t['--os-tracking-tight'], whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
  },
  assistant: { display: 'grid', gap: t['--os-space-1'], minWidth: 0 },
  parts: { display: 'grid', gap: t['--os-space-4'], minWidth: 0 },
  speaker: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], color: t['--os-color-fg-base'],
    fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },
  // 32px icon buttons with no gap; the first icon's glyph lands on the text edge (its 8px padding pulled back).
  actions: {
    display: 'flex', alignItems: 'center', gap: 0, minHeight: t['--os-size-sm'],
    transitionProperty: 'opacity', transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  actionsStart: { marginInlineStart: `calc(${t['--os-space-2']} * -1)` },
  actionsEnd: { marginInlineEnd: `calc(${t['--os-space-2']} * -1)` },
  actionsHidden: { opacity: { default: 0, [noHover]: 1 } },
  error: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], paddingBlock: t['--os-space-2'], paddingInline: t['--os-space-3'],
    borderRadius: t['--os-radius-md'], backgroundColor: t['--os-color-bg-error'], color: t['--os-color-fg-error'],
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
  errorText: { flex: '1 1 auto', minWidth: 0 },
  branch: {
    display: 'inline-flex', alignItems: 'center', color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'],
    lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'], fontVariantNumeric: 'tabular-nums',
  },
});

export type ChatRole = 'user' | 'assistant';

export type ChatMessageProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ref?: Ref<HTMLDivElement>;
  role: ChatRole;
  /** A person's text, or a reply's parts: Reasoning, RunBlock, Markdown, cards. */
  children: ReactNode;
  /** MessageActions under the message. */
  actions?: ReactNode;
  /** The newest reply keeps its actions visible. */
  isLast?: boolean;
  /** For threads with several agents: the speaker's name and tile above the reply. */
  speaker?: { name: string; icon?: IconName; color?: AgentColor };
  /** Why the reply failed. Shown under it in the error color, with `onRetry`. */
  error?: ReactNode;
  onRetry?: () => void;
};

/** One message: a person's bubble, or an assistant's reply as prose. */
export function ChatMessage({
  role, children, actions, isLast = false, speaker, error, onRetry, className, style, ref, onPointerEnter, onPointerLeave, onFocus, onBlur, ...props
}: ChatMessageProps) {
  const [shown, setShown] = useState(false);
  const user = role === 'user';
  const visible = shown || (isLast && !user);
  return (
    <div
      ref={ref}
      data-role={role}
      onPointerEnter={event => { onPointerEnter?.(event); setShown(true); }}
      onPointerLeave={event => { onPointerLeave?.(event); setShown(false); }}
      onFocus={event => { onFocus?.(event); setShown(true); }}
      onBlur={event => { onBlur?.(event); if (!event.currentTarget.contains(event.relatedTarget)) setShown(false); }}
      {...props}
      {...withStyles(stylex.props(user ? s.user : s.assistant), className, style)}
    >
      <SrOnly>{user ? 'You said:' : `${speaker?.name ?? 'Assistant'} said:`}</SrOnly>
      {user ? <div {...stylex.props(s.bubble)}>{children}</div> : (
        <div {...stylex.props(s.parts)}>
          {speaker && (
            <div {...stylex.props(s.speaker)} aria-hidden>
              <AgentGlyph name={speaker.name} icon={speaker.icon} color={speaker.color} size="xs" decorative />
              {speaker.name}
            </div>
          )}
          {children}
          {error && (
            <div role="alert" {...stylex.props(s.error)}>
              <Icon name="alert-circle" size={16} />
              <span {...stylex.props(s.errorText)}>{error}</span>
              {onRetry && <Button size="xs" appearance="secondary" onClick={onRetry}>Retry</Button>}
            </div>
          )}
        </div>
      )}
      {actions && <div {...stylex.props(s.actions, user ? s.actionsEnd : s.actionsStart, !visible && s.actionsHidden)}>{actions}</div>}
    </div>
  );
}

function ActionButton({ label, icon, onPress, pressed }: { label: string; icon: IconName; onPress: () => void; pressed?: boolean }) {
  return (
    <Tooltip trigger={<Button size="sm" appearance="text" iconOnly aria-label={label} aria-pressed={pressed} onClick={onPress}><Icon name={icon} /></Button>}>
      {label}
    </Tooltip>
  );
}

export type MessageActionsProps = {
  /** Adds Copy: the text it copies. */
  copyText?: string;
  /** Adds Retry (regenerate the reply). */
  onRetry?: () => void;
  /** Adds Edit, for a person's message. */
  onEdit?: () => void;
  /** The current feedback. Adds thumbs up and down with `onFeedback`. */
  feedback?: 'up' | 'down' | null;
  onFeedback?: (feedback: 'up' | 'down' | null) => void;
  /** Alternate versions of the reply: `‹ 2 of 3 ›`. */
  branch?: { index: number; total: number; onPrevious: () => void; onNext: () => void };
  /** More actions, after the built-in ones. */
  children?: ReactNode;
};

/** The actions under a message: copy, retry, edit, feedback and branches. */
export function MessageActions({ copyText, onRetry, onEdit, feedback = null, onFeedback, branch, children }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = () => {
    if (copyText === undefined) return;
    void navigator.clipboard?.writeText(copyText).then(() => {
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <>
      {branch && branch.total > 1 && (
        <span {...stylex.props(s.branch)} role="group" aria-label="Versions">
          <Button size="sm" appearance="text" iconOnly aria-label="Previous version" isDisabled={branch.index <= 1} onClick={branch.onPrevious}><Icon name="chevron-left" /></Button>
          <span aria-live="polite">{branch.index} of {branch.total}</span>
          <Button size="sm" appearance="text" iconOnly aria-label="Next version" isDisabled={branch.index >= branch.total} onClick={branch.onNext}><Icon name="chevron-right" /></Button>
        </span>
      )}
      {copyText !== undefined && <ActionButton label={copied ? 'Copied' : 'Copy'} icon={copied ? 'check' : 'copy'} onPress={copy} />}
      {onEdit && <ActionButton label="Edit" icon="edit" onPress={onEdit} />}
      {onFeedback && <ActionButton label="Good reply" icon="thumbs-up" pressed={feedback === 'up'} onPress={() => onFeedback(feedback === 'up' ? null : 'up')} />}
      {onFeedback && <ActionButton label="Bad reply" icon="thumbs-down" pressed={feedback === 'down'} onPress={() => onFeedback(feedback === 'down' ? null : 'down')} />}
      {onRetry && <ActionButton label="Retry" icon="refresh" onPress={onRetry} />}
      {children}
    </>
  );
}
