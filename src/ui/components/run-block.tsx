'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Button } from './button';
import { Card, type CardProps } from './card';
import { Icon, type IconName } from './Icon';
import { cardStyles as c } from './internal/agent-parts';
import { SrOnly } from './internal/sr-only';
import { focusStyles, hoverStyles, loadingStyles, transitionStyles } from './internal/states';
import { Step, Steps, type StepState } from './steps';
import { ToolCall } from './tool-call';

// An agent's run inside a chat message (spec 1.19). While it runs, it is open: the steps on a rail, the
// current one with a spinner, each step's tool call one click away. When it finishes it closes to one line
// (what it did, how long, what changed) that opens again on a click. A failed step keeps its error and a
// retry in view; a running block can be stopped from its head.

export type RunStatus = 'running' | 'needs-input' | 'done' | 'failed' | 'stopped';

export type RunStep = {
  id: string;
  title: ReactNode;
  state: StepState;
  /** The tool it called: "bash", "read_file". With `input`, `output` or `error`, the title opens the ToolCall. */
  tool?: string;
  input?: string;
  /** Names the input: "Command", "Query", "Path". */
  inputLabel?: string;
  output?: string;
  error?: ReactNode;
  /** "1.4s". */
  duration?: ReactNode;
  /** One line under the title: a finding, a result. */
  detail?: ReactNode;
  /** Content under the step, always shown: FileChanges, a link to a result. */
  children?: ReactNode;
};

const statusIcon: Partial<Record<RunStatus, IconName>> = { done: 'check', failed: 'x', stopped: 'stop', 'needs-input': 'pause' };
const statusWord: Record<RunStatus, string> = { running: 'Running', 'needs-input': 'Needs you', done: 'Done', failed: 'Failed', stopped: 'Stopped' };

const reduce = '@media (prefers-reduced-motion: reduce)';

const s = stylex.create({
  head: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minWidth: 0 },
  // A ghost row: its hover wash bleeds 8 past the text at the sides and 4 above and below, so the text stays on
  // the card's 16 px padding.
  trigger: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-3'], flex: '1 1 auto', minWidth: 0, minHeight: t['--os-size-sm'], margin: 0,
    marginBlock: `calc(${t['--os-space-1']} * -1)`, marginInline: `calc(${t['--os-space-2']} * -1)`,
    paddingBlock: t['--os-space-1'], paddingInline: t['--os-space-2'], borderWidth: 0, borderRadius: t['--os-radius-md'],
    color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit', textAlign: 'start', cursor: 'pointer',
  },
  mark: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 20, height: 20,
    borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-bg-muted'], color: t['--os-color-fg-base'],
  },
  markRunning: { backgroundColor: 'transparent', color: t['--os-color-accent-moderate'] },
  markWaiting: { backgroundColor: t['--os-color-bg-warning'], color: t['--os-color-fg-warning'] },
  markFailed: { backgroundColor: t['--os-color-bg-error'], color: t['--os-color-fg-error'] },
  chevron: {
    display: 'flex', flexShrink: 0, color: t['--os-color-fg-subtle'],
    transitionProperty: 'transform', transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  chevronOpen: { transform: 'rotate(180deg)' },
  body: { marginBlockStart: t['--os-space-4'] },
});

export type RunBlockProps = Omit<CardProps, 'heading' | 'description' | 'action' | 'footer' | 'children' | 'title'> & {
  /** What the run is doing or did: "Fixing the checkout crash". */
  title: ReactNode;
  status: RunStatus;
  steps: RunStep[];
  /** "1m 12s". */
  elapsed?: ReactNode;
  /** What it changed, after the step count: "3 files changed". */
  summary?: ReactNode;
  /** Open (controlled). Default: open while running, waiting or failed; closed once done or stopped. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Adds Stop to the head while running. */
  onStop?: () => void;
  /** Adds Retry to failed steps. */
  onRetry?: (stepId: string) => void;
};

/** An agent run in a message: open while it works, one line once it ends. */
export function RunBlock({
  title, status, steps, elapsed, summary, expanded, onExpandedChange, onStop, onRetry, variant = 'outline', size = 'sm', ...props
}: RunBlockProps) {
  const live = status === 'running' || status === 'needs-input';
  // Open while it works and when it fails (the error is the point); closed once it is done or stopped.
  const wantsOpen = live || status === 'failed';
  const [own, setOwn] = useState(wantsOpen);
  const touched = useRef(false);
  const was = useRef(wantsOpen);
  // Follow the run, unless the person opened or closed it themselves.
  useEffect(() => {
    if (was.current !== wantsOpen && !touched.current) setOwn(wantsOpen);
    was.current = wantsOpen;
  }, [wantsOpen]);
  const open = expanded ?? own;
  const bodyId = useId();
  const done = steps.filter(step => step.state === 'done').length;
  const failedStep = steps.find(step => step.state === 'failed');
  const meta = [
    live ? `Step ${Math.min(done + 1, steps.length)} of ${steps.length}` : `${done} of ${steps.length} steps`,
    elapsed, summary,
  ].filter(Boolean);
  const toggle = () => { touched.current = true; setOwn(!open); onExpandedChange?.(!open); };

  return (
    <Card variant={variant} size={size} aria-label={typeof title === 'string' ? title : undefined} aria-busy={live || undefined} {...props}>
      <div {...stylex.props(s.head)}>
        <button type="button" aria-expanded={open} aria-controls={bodyId} onClick={toggle} {...stylex.props(s.trigger, hoverStyles.fill, transitionStyles.colors, focusStyles.ringVisible)}>
          <span aria-hidden {...stylex.props(s.mark, status === 'running' && s.markRunning, status === 'needs-input' && s.markWaiting, status === 'failed' && s.markFailed)}>
            {status === 'running' ? <span {...stylex.props(loadingStyles.spinner, loadingStyles.spinnerSize(14))} /> : <Icon name={statusIcon[status]!} size={12} strokeWidth={2.4} />}
          </span>
          <span {...stylex.props(c.rowText)}>
            <span {...stylex.props(c.rowTitle)}>{title}<SrOnly>{`, ${statusWord[status].toLowerCase()}`}</SrOnly></span>
            <span {...stylex.props(c.meta, c.ellipsis)}>{meta.map((part, index) => <span key={index}>{index > 0 && ' · '}{part}</span>)}</span>
          </span>
          <span aria-hidden {...stylex.props(s.chevron, open && s.chevronOpen)}><Icon name="chevron-down" size={16} /></span>
        </button>
        {live && onStop && <Button size="sm" appearance="secondary" onClick={onStop}>Stop</Button>}
      </div>
      {open && (
        <div id={bodyId} {...stylex.props(s.body)}>
          <Steps aria-label="Run steps" density="compact">
            {steps.map(step => {
              const hasCall = step.tool && (step.input !== undefined || step.output !== undefined || step.error);
              return (
                <Step
                  key={step.id}
                  state={step.state}
                  title={step.title}
                  detail={step.detail ?? (step.tool && !hasCall ? step.tool : undefined)}
                  meta={step.duration}
                  defaultExpanded={step === failedStep}
                  details={hasCall ? (
                    <ToolCall tool={step.tool!} input={step.input} inputLabel={step.inputLabel} output={step.output} error={step.error}
                      onRetry={onRetry && step.state === 'failed' ? () => onRetry(step.id) : undefined} />
                  ) : undefined}
                >
                  {step.children}
                </Step>
              );
            })}
          </Steps>
        </div>
      )}
    </Card>
  );
}

