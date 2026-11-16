'use client';

import * as stylex from '@stylexjs/stylex';
import type { KeyboardEvent, ReactNode } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Button } from './button';
import { Card, type CardProps } from './card';
import { DiffStat, DiffView, type DiffLine } from './diff';
import { Icon } from './Icon';
import { cardStyles as c } from './internal/agent-parts';

// What an agent wants to change, one change at a time (spec 1.19): each change shows its lines and takes its
// own Accept or Reject, so a person keeps the good part of a run and drops the rest. Y accepts and N rejects
// the change that holds focus. A decided change folds to one line with Undo. Nothing applies until accepted.

export type ChangeStatus = 'pending' | 'accepted' | 'rejected';

export type Change = {
  id: string;
  /** The file, for a code or document change: "src/billing/plans.ts". */
  path?: string;
  /** A name for a change that is not a file: "Second paragraph", "Pricing table". */
  title?: ReactNode;
  lines: DiffLine[];
  status: ChangeStatus;
};

const s = stylex.create({
  list: { listStyleType: 'none', margin: 0, padding: 0, display: 'grid', gap: t['--os-space-3'] },
  change: { display: 'grid', gap: t['--os-space-2'], minWidth: 0, borderRadius: t['--os-radius-md'], outlineStyle: 'none' },
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minHeight: t['--os-size-sm'], minWidth: 0 },
  name: {
    flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'], color: t['--os-color-fg-base'],
  },
  dir: { color: t['--os-color-fg-subtle'] },
  decided: {
    display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1'], fontSize: t['--os-font-size-caption'],
    fontWeight: t['--os-font-weight-medium'], lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'],
  },
  accepted: { color: t['--os-color-fg-success'] },
  rejected: { color: t['--os-color-fg-muted'] },
  nameDone: { color: t['--os-color-fg-muted'] },
});

export type ChangeReviewProps = Omit<CardProps, 'heading' | 'description' | 'action' | 'footer' | 'children' | 'title'> & {
  /** Default "Review changes". */
  title?: ReactNode;
  changes: Change[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  /** Adds Accept all while anything is pending. */
  onAcceptAll?: () => void;
  /** Adds Reject all while anything is pending. */
  onRejectAll?: () => void;
  /** Adds Undo to decided changes: it puts the change back to pending. */
  onUndo?: (id: string) => void;
};

const added = (lines: DiffLine[]) => lines.filter(line => line.type === 'add').length;
const removed = (lines: DiffLine[]) => lines.filter(line => line.type === 'remove').length;

/** An agent's proposed changes, each with its own Accept and Reject. */
export function ChangeReview({
  title = 'Review changes', changes, onAccept, onReject, onAcceptAll, onRejectAll, onUndo, size = 'sm', ...props
}: ChangeReviewProps) {
  const pending = changes.filter(change => change.status === 'pending').length;
  const accepted = changes.filter(change => change.status === 'accepted').length;
  const keys = (change: Change) => (event: KeyboardEvent) => {
    if (change.status !== 'pending' || event.metaKey || event.ctrlKey || event.altKey) return;
    if ((event.target as HTMLElement).closest('input, textarea, [contenteditable="true"]')) return;
    if (event.key === 'y' || event.key === 'Y') { event.preventDefault(); onAccept(change.id); }
    if (event.key === 'n' || event.key === 'N') { event.preventDefault(); onReject(change.id); }
  };

  return (
    <Card size={size} aria-label={typeof title === 'string' ? title : undefined} {...props}>
      <div {...stylex.props(c.stack)}>
        <div {...stylex.props(c.head)}>
          <span {...stylex.props(c.headText)}>
            <span {...stylex.props(c.title)}>{title}</span>
            <span {...stylex.props(c.eyebrow)} aria-live="polite">
              {pending ? `${changes.length - pending} of ${changes.length} reviewed` : `All reviewed · ${accepted} accepted, ${changes.length - accepted} rejected`}
            </span>
          </span>
          {pending > 0 && (onAcceptAll || onRejectAll) && (
            <span {...stylex.props(c.headEnd)}>
              {onRejectAll && <Button size="sm" appearance="text" onClick={onRejectAll}>Reject all</Button>}
              {onAcceptAll && <Button size="sm" appearance="secondary" onClick={onAcceptAll}>Accept all</Button>}
            </span>
          )}
        </div>
        <ul {...stylex.props(s.list)}>
          {changes.map(change => {
            const cut = change.path ? change.path.lastIndexOf('/') + 1 : 0;
            const done = change.status !== 'pending';
            return (
              <li key={change.id} onKeyDown={keys(change)} {...stylex.props(s.change)}>
                <div {...stylex.props(s.row)}>
                  <span {...stylex.props(s.name, done && s.nameDone)} title={change.path}>
                    {change.path ? <><span {...stylex.props(s.dir)}>{change.path.slice(0, cut)}</span>{change.path.slice(cut)}</> : change.title}
                  </span>
                  <DiffStat added={added(change.lines)} removed={removed(change.lines)} />
                  {done ? (
                    <>
                      <span role="status" {...stylex.props(s.decided, change.status === 'accepted' ? s.accepted : s.rejected)}>
                        <Icon name={change.status === 'accepted' ? 'check' : 'x'} size={14} />
                        {change.status === 'accepted' ? 'Accepted' : 'Rejected'}
                      </span>
                      {onUndo && <Button size="xs" appearance="text" onClick={() => onUndo(change.id)}>Undo</Button>}
                    </>
                  ) : (
                    <>
                      <Button size="xs" appearance="secondary" aria-keyshortcuts="N" onClick={() => onReject(change.id)}>Reject</Button>
                      <Button size="xs" aria-keyshortcuts="Y" onClick={() => onAccept(change.id)}>Accept</Button>
                    </>
                  )}
                </div>
                {!done && <DiffView lines={change.lines} aria-label={`Changes to ${change.path ?? 'this part'}`} />}
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
