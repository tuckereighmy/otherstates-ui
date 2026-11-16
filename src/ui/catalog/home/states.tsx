import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { ApprovalCard, Button, FileChange, FileChanges, RunBlock, TextField, UsageBar, type RunStep } from '../../components';
import ContextWindowDefault from '../docs/context-window/default';
import ContextWindowOverLimit from '../docs/context-window/over-limit';
import HandoffListDefault from '../docs/handoff-list/default';
import HandoffListEmpty from '../docs/handoff-list/empty';
import UsageBarOverBudget from '../docs/usage-bar/over-budget';

// The homepage's state cards. Each card is one component from the library with the states it ships,
// shown live: the docs examples where one fits, otherwise a small composition with original content.
// A state's controls move the card on: Approve goes to Approving and then Approved, Stop to Stopped,
// Retry back to Running.

/** Moves the card to another state. With `onlyFrom`, only if the card is still in that state. */
export type Go = (next: string, onlyFrom?: string) => void;

export type ComponentState = { value: string; label: string; render: (go: Go) => ReactNode };

export type StateCard = {
  /** The component's docs id: /ui/#component/<id>. */
  id: string;
  title: string;
  description: string;
  /** Wide cards take half a row; narrow cards a third. */
  width: 'wide' | 'narrow';
  states: ComponentState[];
};

const s = stylex.create({
  run: { width: '100%', maxWidth: 480 },
  approval: { width: '100%', maxWidth: 420 },
  field: { width: 300, maxWidth: '100%' },
  usage: { width: '100%', maxWidth: 320 },
});

// One run, four ways it can stand.
const read: RunStep = { id: 'read', title: 'Read the bug report', state: 'done', tool: 'read_file', inputLabel: 'Path', input: 'issues/482.md', output: 'Checkout crashes when the cart is empty.', duration: '0.4s' };
const repro: RunStep = { id: 'repro', title: 'Reproduce the crash', state: 'done', tool: 'bash', inputLabel: 'Command', input: 'npm test -- checkout.test.ts', output: 'FAIL  checkout.test.ts\n  ✕ empty cart (12 ms)', duration: '8s' };

function Run({ state, go }: { state: 'running' | 'stopped' | 'failed' | 'done'; go: Go }) {
  if (state === 'running') {
    return (
      <RunBlock
        {...stylex.props(s.run)}
        title="Fixing the checkout crash"
        status="running"
        elapsed="12s"
        steps={[read, repro, { id: 'patch', title: 'Guard the empty cart', state: 'running', tool: 'edit_file', duration: '4s' }, { id: 'test', title: 'Run the tests again', state: 'pending' }]}
        onStop={() => go('stopped')}
      />
    );
  }
  if (state === 'stopped') {
    return (
      <RunBlock
        {...stylex.props(s.run)}
        title="Fixing the checkout crash"
        status="stopped"
        elapsed="14s"
        steps={[read, repro, { id: 'patch', title: 'Guard the empty cart', state: 'skipped' }, { id: 'test', title: 'Run the tests again', state: 'skipped' }]}
      />
    );
  }
  if (state === 'failed') {
    return (
      <RunBlock
        {...stylex.props(s.run)}
        title="Fixing the checkout crash"
        status="failed"
        elapsed="31s"
        steps={[
          read,
          { id: 'patch', title: 'Guard the empty cart', state: 'done', tool: 'edit_file', duration: '6s' },
          { id: 'test', title: 'Run the tests again', state: 'failed', tool: 'bash', inputLabel: 'Command', input: 'npm test', error: '2 tests failed: checkout.test.ts › applies the coupon', duration: '21s' },
        ]}
        onRetry={() => go('running')}
      />
    );
  }
  return (
    <RunBlock
      {...stylex.props(s.run)}
      title="Fixed the checkout crash"
      status="done"
      elapsed="1m 12s"
      summary="1 file changed"
      steps={[
        { id: 'patch', title: 'Guard the empty cart', state: 'done', duration: '6s', children: (
          <FileChanges aria-label="Changed files"><FileChange path="src/checkout/cart.ts" added={6} removed={1} /></FileChanges>
        ) },
        { id: 'test', title: 'Run the tests', state: 'done', tool: 'bash', inputLabel: 'Command', input: 'npm test', output: 'Tests  214 passed (214)', duration: '21s' },
      ]}
    />
  );
}

function Approval({ state, go }: { state: 'waiting' | 'approving' | 'approved' | 'denied'; go: Go }) {
  const decided = state === 'approved' || state === 'denied' ? state : undefined;
  return (
    <ApprovalCard
      {...stylex.props(s.approval)}
      title="Deploy the checkout fix to production"
      agent={{ name: 'Coder', icon: 'code' }}
      askVerb="wants to deploy it"
      risk="medium"
      details={[
        { label: 'Branch', value: 'fix/empty-cart' },
        { label: 'Checks', value: '214 passed' },
      ]}
      isApproving={state === 'approving'}
      status={decided}
      statusLabel={decided === 'approved' ? 'Approved by Mia at 9:02' : decided === 'denied' ? 'Denied by Mia at 9:02. Nothing ran.' : undefined}
      onApprove={() => {
        go('approving');
        window.setTimeout(() => go('approved', 'approving'), 1400);
      }}
      onDeny={() => go('denied')}
    />
  );
}

function Publish({ state, go }: { state: 'default' | 'loading' | 'disabled'; go: Go }) {
  return (
    <Button
      isLoading={state === 'loading'}
      isDisabled={state === 'disabled'}
      onClick={() => {
        go('loading');
        window.setTimeout(() => go('default', 'loading'), 1600);
      }}
    >
      Publish release
    </Button>
  );
}

function BillingEmail({ state }: { state: 'default' | 'invalid' | 'disabled' }) {
  return (
    <div {...stylex.props(s.field)}>
      <TextField
        label="Billing email"
        size="md"
        description="Invoices are sent here."
        defaultValue={state === 'invalid' ? 'maya.billing' : 'maya@example.com'}
        errorMessage={state === 'invalid' ? 'Enter an email address that includes an @.' : undefined}
        isDisabled={state === 'disabled'}
      />
    </div>
  );
}

function TokensPerMinute() {
  return (
    <UsageBar
      {...stylex.props(s.usage)}
      label="Tokens per minute"
      max={120000}
      valueLabel="93k of 120k"
      legend="chips"
      segments={[
        { id: 'triage', label: 'Inbox triage', value: 52000 },
        { id: 'leads', label: 'Lead research', value: 41000 },
      ]}
    />
  );
}

export const stateCards: StateCard[] = [
  {
    id: 'run-block',
    title: 'Run block',
    description: 'An agent’s run, step by step: the tools, their output and what went wrong.',
    width: 'wide',
    states: [
      { value: 'running', label: 'Running', render: go => <Run state="running" go={go} /> },
      { value: 'stopped', label: 'Stopped', render: go => <Run state="stopped" go={go} /> },
      { value: 'failed', label: 'Failed', render: go => <Run state="failed" go={go} /> },
      { value: 'done', label: 'Done', render: go => <Run state="done" go={go} /> },
    ],
  },
  {
    id: 'approval-card',
    title: 'Approval card',
    description: 'Ask a person before an agent acts: what happens, the risk and one decision.',
    width: 'wide',
    states: [
      { value: 'waiting', label: 'Waiting', render: go => <Approval state="waiting" go={go} /> },
      { value: 'approving', label: 'Approving', render: go => <Approval state="approving" go={go} /> },
      { value: 'approved', label: 'Approved', render: go => <Approval state="approved" go={go} /> },
      { value: 'denied', label: 'Denied', render: go => <Approval state="denied" go={go} /> },
    ],
  },
  {
    id: 'button',
    title: 'Button',
    description: 'Loading keeps the button’s width, so nothing around it moves.',
    width: 'narrow',
    states: [
      { value: 'default', label: 'Default', render: go => <Publish state="default" go={go} /> },
      { value: 'loading', label: 'Loading', render: go => <Publish state="loading" go={go} /> },
      { value: 'disabled', label: 'Disabled', render: go => <Publish state="disabled" go={go} /> },
    ],
  },
  {
    id: 'input',
    title: 'Text field',
    description: 'The error says what to fix, in place of the help text.',
    width: 'narrow',
    states: [
      { value: 'default', label: 'Default', render: () => <BillingEmail state="default" /> },
      { value: 'invalid', label: 'Invalid', render: () => <BillingEmail state="invalid" /> },
      { value: 'disabled', label: 'Disabled', render: () => <BillingEmail state="disabled" /> },
    ],
  },
  {
    id: 'usage-bar',
    title: 'Usage bar',
    description: 'One limit, split by who is using it, and how it reads once it runs over.',
    width: 'narrow',
    states: [
      { value: 'default', label: 'Default', render: () => <TokensPerMinute /> },
      { value: 'over', label: 'Over limit', render: () => <UsageBarOverBudget /> },
    ],
  },
  {
    id: 'context-window',
    title: 'Context window',
    description: 'What fills the model’s context, and what you can free before it runs out.',
    width: 'wide',
    states: [
      { value: 'nearly-full', label: 'Nearly full', render: () => <ContextWindowDefault /> },
      { value: 'over', label: 'Over limit', render: () => <ContextWindowOverLimit /> },
    ],
  },
  {
    id: 'handoff-list',
    title: 'Handoff list',
    description: 'Everything your agents are waiting on you for, in one place.',
    width: 'wide',
    states: [
      { value: 'waiting', label: 'Waiting', render: () => <HandoffListDefault /> },
      { value: 'empty', label: 'Empty', render: () => <HandoffListEmpty /> },
    ],
  },
];
