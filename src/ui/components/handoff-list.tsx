'use client';

import * as stylex from '@stylexjs/stylex';
import { useLayoutEffect, useRef, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { formatWait } from './agent-format';
import { AgentGlyph, type AgentColor } from './agent-identity';
import { RiskBadge, type RiskLevel } from './agent-status';
import { Button } from './button';
import { Icon, type IconName } from './Icon';
import { cardStyles as c } from './internal/agent-parts';
import { withStyles } from './internal/class-name';

// What agents are waiting on a person for (spec 1.21): approvals, questions, reviews and runs that are stuck.
// The longest wait comes first and a wait past `lateAfter` turns amber, because every minute here is a run
// standing still. Each row shows the literal thing (the command, the question) and decides in place:
// Approve and Deny for an approval, Answer, Review or Open for the rest.

const reduce = '@media (prefers-reduced-motion: reduce)';

const enter = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(4px)' }, to: { opacity: 1, transform: 'none' } });

const s = stylex.create({
  /** A handoff is a wash row whose content wraps: 12 all round. */
  row: {
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: t['--os-space-3'], rowGap: t['--os-space-2'],
    animationName: { default: enter, [reduce]: 'none' }, animationDuration: t['--os-motion-slow'], animationTimingFunction: t['--os-ease-settle'],
  },
  who: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'], flex: '1 1 240px', minWidth: 0 },
  meta: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: t['--os-space-2'] },
  late: { color: t['--os-color-fg-warning'], fontWeight: t['--os-font-weight-medium'] },
  // The literal command or question: a chip on the wash, set like the meta line, 2 under it.
  subject: {
    justifySelf: 'start', maxWidth: '100%', boxSizing: 'border-box', marginBlockStart: t['--os-space-0-5'],
    paddingBlock: t['--os-space-0-5'], paddingInline: t['--os-space-1-5'], borderRadius: t['--os-radius-xs'],
    backgroundColor: t['--os-color-bg-surface'], color: t['--os-color-fg-base'],
    fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'],
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  actions: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], flexShrink: 0, marginInlineStart: 'auto' },
  outcome: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minHeight: t['--os-size-sm'], marginInlineStart: 'auto',
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
  outcomeIcon: { display: 'flex', flexShrink: 0, color: t['--os-color-fg-success'] },
  empty: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], margin: 0, minHeight: t['--os-size-xl'],
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
});

export type HandoffKind = 'approval' | 'question' | 'review' | 'blocked';

export type Handoff = {
  id: string;
  agent: { name: string; icon?: IconName; color?: AgentColor };
  kind: HandoffKind;
  /** What it is about: "Deploy the checkout fix to staging". */
  title: ReactNode;
  /** The literal thing, on one line: the command, the question, the files. */
  subject?: ReactNode;
  /** How long the agent has waited, in ms. The list puts the longest first. */
  waited: number;
  risk?: RiskLevel;
  /** Set once decided ("Approved. Coder is deploying."): the row shows it in place of its actions. */
  outcome?: ReactNode;
};

export type HandoffListProps = Omit<HTMLAttributes<HTMLUListElement>, 'children'> & {
  ref?: Ref<HTMLUListElement>;
  /** Names the list: "Waiting on you". */
  label: string;
  items: Handoff[];
  /** Adds Approve to approvals. */
  onApprove?: (id: string) => void;
  /** Adds Deny to approvals. */
  onDeny?: (id: string) => void;
  /** Adds Answer, Review or Open to the other kinds, and Open to approvals without onApprove. */
  onOpen?: (id: string) => void;
  /** A wait longer than this, in ms, turns amber. Default 10 minutes. */
  lateAfter?: number;
  /** Shown when nothing is waiting. Default "Nothing is waiting on you." */
  empty?: ReactNode;
};

const verbs: Record<HandoffKind, string> = { approval: 'wants approval', question: 'has a question', review: 'wants a review', blocked: 'is stuck' };
const openLabels: Record<HandoffKind, string> = { approval: 'Open', question: 'Answer', review: 'Review', blocked: 'Open' };

/** What agents are waiting on you for, longest first, each decided in place. */
export function HandoffList({
  label, items, onApprove, onDeny, onOpen, lateAfter = 600_000, empty = 'Nothing is waiting on you.', className, style, ref, ...props
}: HandoffListProps) {
  const sorted = [...items].sort((a, b) => b.waited - a.waited);

  // Deciding a row replaces its buttons with the outcome, and the row may leave soon after. Without help,
  // keyboard focus would fall to the page. It goes to the outcome, then to the next row's first action,
  // then to the empty note.
  const root = useRef<HTMLElement | null>(null);
  const handled = useRef<{ id: string; index: number } | null>(null);
  const decide = (run: (id: string) => void, id: string, index: number) => () => {
    handled.current = { id, index };
    run(id);
  };
  useLayoutEffect(() => {
    const last = handled.current;
    const node = root.current;
    if (!last || !node) return;
    const active = document.activeElement;
    // Focus is somewhere real already: in this list, or wherever the person moved it.
    if (active && active !== document.body) {
      if (!node.contains(active)) handled.current = null;
      return;
    }
    const row = node.querySelector<HTMLElement>(`[data-handoff="${CSS.escape(last.id)}"]`);
    const outcome = row?.querySelector<HTMLElement>('[data-handoff-outcome]');
    if (outcome) { outcome.focus(); return; }
    const rows = node.querySelectorAll<HTMLElement>('[data-handoff]');
    const next = rows[Math.min(last.index, rows.length - 1)];
    (next?.querySelector<HTMLElement>('button') ?? next?.querySelector<HTMLElement>('[data-handoff-outcome]') ?? node).focus();
    handled.current = null;
  });
  const setRoot = (node: HTMLElement | null) => {
    root.current = node;
  };
  const setList = (node: HTMLUListElement | null) => {
    root.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  if (sorted.length === 0) {
    return (
      <p ref={setRoot} tabIndex={-1} {...withStyles(stylex.props(c.wash, c.washRow, s.empty), className, style)}>
        <span {...stylex.props(s.outcomeIcon)}><Icon name="check" size={16} /></span>{empty}
      </p>
    );
  }
  return (
    <ul ref={setList} tabIndex={-1} aria-label={label} {...props} {...withStyles(stylex.props(c.washList), className, style)}>
      {sorted.map((item, index) => {
        const late = item.waited >= lateAfter;
        const name = typeof item.title === 'string' ? item.title : undefined;
        return (
          <li key={item.id} data-handoff={item.id} {...stylex.props(c.wash, c.washRich, s.row)}>
            <div {...stylex.props(s.who)}>
              <AgentGlyph name={item.agent.name} icon={item.agent.icon} color={item.agent.color} size="md" decorative />
              <div {...stylex.props(c.rowText)}>
                <span {...stylex.props(c.rowTitle)}>{item.title}</span>
                <span {...stylex.props(c.meta, s.meta)}>
                  <span>{item.agent.name} {verbs[item.kind]}</span>
                  <span aria-hidden>·</span>
                  <span {...stylex.props(late && s.late)}>waited {formatWait(item.waited)}</span>
                  {item.risk && item.risk !== 'low' && <><span aria-hidden>·</span><RiskBadge risk={item.risk} appearance="text" /></>}
                </span>
                {item.subject && <span {...stylex.props(s.subject)}>{item.subject}</span>}
              </div>
            </div>
            {item.outcome ? (
              <span role="status" tabIndex={-1} data-handoff-outcome="" {...stylex.props(s.outcome)}>
                <span {...stylex.props(s.outcomeIcon)}><Icon name="check" size={16} /></span>{item.outcome}
              </span>
            ) : (
              <span {...stylex.props(s.actions)}>
                {item.kind === 'approval' && onDeny && (
                  <Button size="sm" appearance="secondary" aria-label={name ? `Deny: ${name}` : undefined} onClick={decide(onDeny, item.id, index)}>Deny</Button>
                )}
                {item.kind === 'approval' && onApprove ? (
                  <Button size="sm" aria-label={name ? `Approve: ${name}` : undefined} onClick={decide(onApprove, item.id, index)}>Approve</Button>
                ) : onOpen && (
                  <Button size="sm" appearance={item.kind === 'blocked' ? 'secondary' : 'primary'} aria-label={name ? `${openLabels[item.kind]}: ${name}` : undefined} onClick={decide(onOpen, item.id, index)}>
                    {openLabels[item.kind]}
                  </Button>
                )}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
