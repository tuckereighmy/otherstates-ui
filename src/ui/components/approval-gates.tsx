'use client';

import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { tokens as t } from '../tokens.stylex';
import { AccordionGroup, AccordionItem, AccordionPanel, AccordionTrigger } from './accordion';
import { StatusBadge } from './agent-status';
import { Button } from './button';
import { Card, type CardProps } from './card';
import { Icon } from './Icon';
import { cardStyles as c } from './internal/agent-parts';
import { Progress } from './progress';

// A run that stops at gates: steps that wait for a person before they happen (spec 1.19). The card says
// how many gates are open, and each gate opens to show what it would change and the decision.

export type GateStatus = 'waiting' | 'approved' | 'rejected';

export type Gate = {
  id: string;
  title: ReactNode;
  /** Who asks and what kind of change: "Coder · File change · 1m ago". */
  meta?: ReactNode;
  /** Other steps wait on this gate. */
  blocking?: boolean;
  status: GateStatus;
  /** What it would change: a sentence, FileChanges or a DiffView. */
  content?: ReactNode;
};

const s = stylex.create({
  blocking: {
    flexShrink: 0, color: t['--os-color-fg-warning'], fontSize: t['--os-font-size-caption'], fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'],
  },
  trigger: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'], minWidth: 0, flex: '1 1 auto', textAlign: 'start' },
  icon: { display: 'flex', flexShrink: 0 },
  waiting: { color: t['--os-color-fg-warning'] },
  approved: { color: t['--os-color-fg-success'] },
  rejected: { color: t['--os-color-fg-muted'] },
  title: { overflow: 'visible', whiteSpace: 'normal' },
  titleDone: { color: t['--os-color-fg-muted'], fontWeight: t['--os-font-weight-regular'] },
  meta: { fontWeight: t['--os-font-weight-regular'] },
  panel: { display: 'grid', gap: t['--os-space-4'] },
});

const gateIcon = { waiting: 'pause', approved: 'check-circle', rejected: 'x-circle' } as const;
const gateWord = { waiting: 'waiting for you', approved: 'approved', rejected: 'rejected' } as const;

export type ApprovalGatesProps = Omit<CardProps, 'heading' | 'description' | 'action' | 'footer' | 'children' | 'title'> & {
  /** The run: "Launch the new pricing page". */
  title: ReactNode;
  gates: Gate[];
  onDecide?: (id: string, decision: 'approve' | 'reject') => void;
  /** Gates open at first. Default: the first gate waiting for you. */
  defaultExpanded?: string[];
};

/** A run's approval gates, each with what it would change and a decision. */
export function ApprovalGates({ title, gates, onDecide, defaultExpanded, size = 'sm', ...props }: ApprovalGatesProps) {
  const waiting = gates.filter(gate => gate.status === 'waiting').length;
  const decided = gates.length - waiting;
  const first = gates.find(gate => gate.status === 'waiting');
  return (
    <Card size={size} aria-label={typeof title === 'string' ? title : undefined} {...props}>
      <div {...stylex.props(c.stack)}>
        <div {...stylex.props(c.head)}>
          <span {...stylex.props(c.headText)}>
            <span {...stylex.props(c.title)}>{title}</span>
            <span {...stylex.props(c.eyebrow)}>{waiting ? `Paused until you decide ${waiting === 1 ? 'one gate' : `${waiting} gates`}` : 'Every gate is decided'}</span>
          </span>
          <span {...stylex.props(c.headEnd)}><StatusBadge appearance="text" state={waiting ? 'needs-input' : 'running'}>{waiting ? `${waiting} waiting` : 'Running'}</StatusBadge></span>
        </div>
        <Progress label="Decided" value={decided} maxValue={gates.length || 1} valueLabel={`${decided} of ${gates.length}`} size="sm" showLabel showValue />
        <AccordionGroup allowsMultipleExpanded defaultExpandedKeys={defaultExpanded ?? (first ? [first.id] : [])}>
          {gates.map(gate => (
            <AccordionItem key={gate.id} id={gate.id} icon="chevron">
              <AccordionTrigger>
                <span {...stylex.props(s.trigger)}>
                  <span {...stylex.props(s.icon, s[gate.status])}><Icon name={gateIcon[gate.status]} size={16} title={gateWord[gate.status]} /></span>
                  <span {...stylex.props(c.rowText)}>
                    <span {...stylex.props(c.rowTitle, s.title, gate.status !== 'waiting' && s.titleDone)}>{gate.title}</span>
                    {gate.meta && <span {...stylex.props(c.meta, s.meta)}>{gate.meta}</span>}
                  </span>
                  {gate.blocking && gate.status === 'waiting' && <span {...stylex.props(s.blocking)}>Blocking</span>}
                </span>
              </AccordionTrigger>
              <AccordionPanel>
                <div {...stylex.props(s.panel)}>
                  {gate.content}
                  {gate.status === 'waiting' ? onDecide && (
                    <div {...stylex.props(c.actionsFill)}>
                      <Button size="sm" appearance="secondary" onClick={() => onDecide(gate.id, 'reject')}>Reject</Button>
                      <Button size="sm" onClick={() => onDecide(gate.id, 'approve')}>Approve</Button>
                    </div>
                  ) : <span {...stylex.props(c.outcome)}>{gate.status === 'approved' ? 'Approved.' : 'Rejected. The run skips this step.'}</span>}
                </div>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </AccordionGroup>
      </div>
    </Card>
  );
}
