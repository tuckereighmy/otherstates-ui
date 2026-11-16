'use client';

import * as stylex from '@stylexjs/stylex';
import { useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { AgentIdentity, type AgentColor } from './agent-identity';
import { agentStateLabels, StatusBadge, StatusDot, type AgentState } from './agent-status';
import { Badge } from './badge';
import { Button } from './button';
import { Card, type CardProps } from './card';
import type { IconName } from './Icon';
import { cardStyles as c } from './internal/agent-parts';
import { withStyles } from './internal/class-name';
import { SegmentedControl } from './segmented-control';

// A unit of agent work and the board that sorts it by who it waits on (spec 1.19): you, the agent, or
// nobody, because it is finished.

const s = stylex.create({
  headRow: { display: 'flex', alignItems: 'flex-start', gap: t['--os-space-3'] },
  /** The state's line box matches the title's first line (24), so the two center on each other. */
  state: { marginInlineStart: 'auto', minHeight: t['--os-line-height-lg'] },
  meta: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'] },
  metaEnd: { marginInlineStart: 'auto', display: 'flex', gap: t['--os-space-3'], flexShrink: 0 },

  inbox: { display: 'grid', gap: t['--os-space-4'], minWidth: 0 },
  toolbar: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'], flexWrap: 'wrap' },
  board: { display: 'grid', gap: t['--os-space-4'], gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'start' },
  column: { display: 'grid', gap: t['--os-space-4'], minWidth: 0 },
  columnHead: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], margin: 0, color: t['--os-color-fg-base'],
    fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },
  list: { gridColumn: '1 / -1' },
  row: { display: 'grid', gridTemplateColumns: '8px minmax(0, 1fr) auto', alignItems: 'center', columnGap: t['--os-space-3'] },
  rowEnd: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'] },
});

export type AgentTask = {
  id: string;
  title: ReactNode;
  summary?: ReactNode;
  agent: { name: string; model?: ReactNode; icon?: IconName; color?: AgentColor };
  state: AgentState;
  /** How long it has run or waited: "6m 12s". */
  elapsed?: ReactNode;
  /** "$0.42". */
  cost?: ReactNode;
  /** Extra content: Steps, FileChanges. Shown on the card, not in list rows. */
  detail?: ReactNode;
};

export type AgentTaskCardProps = Omit<CardProps, 'heading' | 'description' | 'action' | 'footer' | 'children' | 'title'> & {
  task: AgentTask;
  /** Actions in the footer, such as Approve and Reject. */
  actions?: ReactNode;
};

/** One task: what it is, which agent has it, its state and how long it has taken. */
export function AgentTaskCard({ task, actions, size = 'sm', ...props }: AgentTaskCardProps) {
  return (
    <Card size={size} aria-label={typeof task.title === 'string' ? task.title : undefined} {...props}>
      <div {...stylex.props(c.stack)}>
        <div {...stylex.props(c.titleBlock)}>
          <div {...stylex.props(s.headRow)}>
            <p {...stylex.props(c.title)}>{task.title}</p>
            <StatusBadge state={task.state} appearance="text" {...stylex.props(s.state)} />
          </div>
          {task.summary && <p {...stylex.props(c.lead)}>{task.summary}</p>}
        </div>
        {task.detail}
        <div {...stylex.props(s.meta, c.meta)}>
          <AgentIdentity size="sm" name={task.agent.name} icon={task.agent.icon} color={task.agent.color} />
          {(task.elapsed || task.cost) && (
            <span {...stylex.props(s.metaEnd)}>{task.elapsed && <span>{task.elapsed}</span>}{task.cost && <span>{task.cost}</span>}</span>
          )}
        </div>
        {actions && <div {...stylex.props(c.actionsFill)}>{actions}</div>}
      </div>
    </Card>
  );
}

type Column = { id: 'waiting' | 'working' | 'finished'; label: string; states: AgentState[] };
const columns: Column[] = [
  { id: 'waiting', label: 'Needs you', states: ['needs-input'] },
  { id: 'working', label: 'Working', states: ['running', 'queued', 'paused', 'idle'] },
  { id: 'finished', label: 'Finished', states: ['done', 'failed', 'canceled', 'skipped'] },
];

export type AgentInboxProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ref?: Ref<HTMLDivElement>;
  /** Names the inbox: "Agent inbox". */
  label: string;
  tasks: AgentTask[];
  view?: 'board' | 'list';
  /** Default `board`. */
  defaultView?: 'board' | 'list';
  onViewChange?: (view: 'board' | 'list') => void;
  /** Adds Approve to tasks that need you. */
  onApprove?: (id: string) => void;
  /** Adds Reject to tasks that need you. */
  onReject?: (id: string) => void;
  /** Trailing toolbar content: filters, a search field. */
  toolbar?: ReactNode;
};

/** Agent tasks sorted into needs you, working and finished, as a board or a list. */
export function AgentInbox({
  label, tasks, view, defaultView = 'board', onViewChange, onApprove, onReject, toolbar, className, style, ref, ...props
}: AgentInboxProps) {
  const [own, setOwn] = useState(defaultView);
  const mode = view ?? own;
  const decide = (task: AgentTask) => task.state === 'needs-input' && (onApprove || onReject) ? (
    <>
      {onReject && <Button size="sm" appearance="secondary" onClick={() => onReject(task.id)}>Reject</Button>}
      {onApprove && <Button size="sm" onClick={() => onApprove(task.id)}>Approve</Button>}
    </>
  ) : undefined;

  return (
    <div ref={ref} role="region" aria-label={label} {...props} {...withStyles(stylex.props(s.inbox), className, style)}>
      <div {...stylex.props(s.toolbar)}>
        <SegmentedControl
          label="View"
          options={[{ value: 'board', label: 'Board' }, { value: 'list', label: 'List' }]}
          value={mode}
          onChange={next => { setOwn(next as 'board' | 'list'); onViewChange?.(next as 'board' | 'list'); }}
        />
        {toolbar}
      </div>
      {mode === 'board' ? (
        <div {...stylex.props(s.board)}>
          {columns.map(column => {
            const items = tasks.filter(task => column.states.includes(task.state));
            return (
              <section key={column.id} aria-label={column.label} {...stylex.props(s.column)}>
                <h3 {...stylex.props(s.columnHead)}>{column.label} <Badge variant="secondary" size="sm" count={items.length} /></h3>
                {items.length ? items.map(task => <AgentTaskCard key={task.id} task={task} actions={decide(task)} />)
                  : <p {...stylex.props(c.empty)}>Nothing here.</p>}
              </section>
            );
          })}
        </div>
      ) : (
        <div {...stylex.props(s.board)}>
          <ul {...stylex.props(c.washList, s.list)}>
            {columns.flatMap(column => tasks.filter(task => column.states.includes(task.state))).map(task => (
              <li key={task.id} {...stylex.props(c.wash, c.washRow, s.row)}>
                <StatusDot state={task.state} label={agentStateLabels[task.state]} />
                <span {...stylex.props(c.rowText)}>
                  <span {...stylex.props(c.rowTitle)}>{task.title}</span>
                  <span {...stylex.props(c.meta, c.ellipsis)}>{task.agent.name}{task.elapsed && <> · {task.elapsed}</>}</span>
                </span>
                <span {...stylex.props(s.rowEnd)}>{decide(task) ?? <StatusBadge state={task.state} />}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
