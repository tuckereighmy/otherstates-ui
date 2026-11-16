'use client';

import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { describeUndo } from './agent-format';
import { AlertDialog } from './alert-dialog';
import { Button } from './button';
import { Card, type CardProps } from './card';
import { Icon } from './Icon';
import { cardStyles as c } from './internal/agent-parts';
import { withStyles } from './internal/class-name';

// Restore points along a conversation (spec 1.19). An agent saves one before each step that changes
// something, so a person can go back to before it. Restoring always asks first and says exactly what it
// undoes: the file changes and the messages after the point. The latest checkpoint is the present.

export type Checkpoint = {
  id: string;
  /** What came after it: 'Before "Patch the checkout form"'. */
  label: ReactNode;
  /** A text version of the label, for the confirmation. Default: the label if it is a string. */
  textLabel?: string;
  /** "2:14 PM". */
  time?: ReactNode;
  /** What restoring to it would undo. */
  undoes?: { files?: number; messages?: number };
};

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** "Undoes 3 file changes and 2 messages", for a list row. */
const undoSummary = (undoes: NonNullable<Checkpoint['undoes']>) =>
  describeUndo(undoes).replace('This undoes ', 'Undoes ').replace(' made after it.', '');

const s = stylex.create({
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'] },
  // The present is not a saved point yet: a ring, not a wash, like a state that has not happened (spec 1.19).
  rowCurrent: { backgroundColor: 'transparent', boxShadow: `inset 0 0 0 ${t['--os-stroke']} ${t['--os-color-border-subtle']}` },
  icon: { display: 'flex', flexShrink: 0, color: t['--os-color-fg-muted'] },
  label: { fontWeight: t['--os-font-weight-regular'] },
  now: {
    flexShrink: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'],
  },

  marker: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'], minWidth: 0, color: t['--os-color-fg-muted'] },
  rule: { flex: '1 1 0', height: t['--os-stroke'], backgroundColor: t['--os-color-border-subtle'] },
  markerText: {
    display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1-5'], flexShrink: 1, minWidth: 0,
    fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'],
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
});

function RestoreButton({ checkpoint, onRestore, size }: { checkpoint: Checkpoint; onRestore: (id: string) => void | Promise<unknown>; size: 'xs' | 'sm' }) {
  const name = checkpoint.textLabel ?? (typeof checkpoint.label === 'string' ? checkpoint.label : 'this checkpoint');
  return (
    <AlertDialog
      trigger={<Button size={size} appearance="text" aria-label={`Restore to ${name}`}>Restore</Button>}
      title="Restore to this checkpoint?"
      description={`${name}. ${describeUndo(checkpoint.undoes)}`}
      confirmLabel="Restore"
      destructive
      onConfirm={() => onRestore(checkpoint.id)}
    />
  );
}

export type CheckpointListProps = Omit<CardProps, 'heading' | 'description' | 'action' | 'footer' | 'children' | 'title'> & {
  /** Default "Checkpoints". */
  title?: ReactNode;
  /** Oldest first. The last is the present and cannot be restored to. */
  checkpoints: Checkpoint[];
  /** Restores after the person confirms. Return a promise to keep the dialog open until it settles. */
  onRestore: (id: string) => void | Promise<unknown>;
};

/** A run's restore points, oldest first, each one restorable after a confirmation. */
export function CheckpointList({ title = 'Checkpoints', checkpoints, onRestore, size = 'sm', ...props }: CheckpointListProps) {
  return (
    <Card size={size} aria-label={typeof title === 'string' ? title : undefined} {...props}>
      <div {...stylex.props(c.stack)}>
        <div {...stylex.props(c.head)}>
          <span {...stylex.props(c.headText)}>
            <span {...stylex.props(c.title)}>{title}</span>
            <span {...stylex.props(c.eyebrow)}>{plural(checkpoints.length, 'restore point')}</span>
          </span>
        </div>
        <ol {...stylex.props(c.washList)}>
          {checkpoints.map((checkpoint, index) => {
            const current = index === checkpoints.length - 1;
            return (
              <li key={checkpoint.id} aria-current={current ? 'step' : undefined} {...stylex.props(c.wash, c.washRow, s.row, current && s.rowCurrent)}>
                <span {...stylex.props(s.icon)}><Icon name={current ? 'clock' : 'refresh'} size={16} /></span>
                <span {...stylex.props(c.rowText)}>
                  <span {...stylex.props(c.rowTitle, s.label)}>{checkpoint.label}</span>
                  <span {...stylex.props(c.meta, c.ellipsis)}>
                    {checkpoint.time}
                    {!current && checkpoint.undoes && <>{checkpoint.time && ' · '}{undoSummary(checkpoint.undoes)}</>}
                  </span>
                </span>
                {current ? <span {...stylex.props(s.now)}>Now</span> : <RestoreButton checkpoint={checkpoint} onRestore={onRestore} size="sm" />}
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}

export type CheckpointMarkerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ref?: Ref<HTMLDivElement>;
  checkpoint: Checkpoint;
  /** Adds Restore, after a confirmation. */
  onRestore?: (id: string) => void | Promise<unknown>;
};

/** A restore point between two messages in a thread: a hairline, the label and Restore. */
export function CheckpointMarker({ checkpoint, onRestore, className, style, ref, ...props }: CheckpointMarkerProps) {
  return (
    <div ref={ref} role="group" aria-label={`Checkpoint: ${checkpoint.textLabel ?? (typeof checkpoint.label === 'string' ? checkpoint.label : '')}`} {...props} {...withStyles(stylex.props(s.marker), className, style)}>
      <span aria-hidden {...stylex.props(s.rule)} />
      <span {...stylex.props(s.markerText)}>
        <Icon name="refresh" size={14} />
        {checkpoint.label}{checkpoint.time && <> · {checkpoint.time}</>}
      </span>
      {onRestore && <RestoreButton checkpoint={checkpoint} onRestore={onRestore} size="xs" />}
      <span aria-hidden {...stylex.props(s.rule)} />
    </div>
  );
}
