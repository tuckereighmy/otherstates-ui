'use client';

import * as stylex from '@stylexjs/stylex';
import { RunBlock, type RunStep } from '../../../components';

const steps: RunStep[] = [
  { id: 'read', title: 'Read the bug report', state: 'done', tool: 'read_file', inputLabel: 'Path', input: 'issues/482.md', output: 'Checkout crashes when the cart is empty.', duration: '0.4s' },
  { id: 'repro', title: 'Reproduce the crash', state: 'done', tool: 'bash', inputLabel: 'Command', input: 'npm test -- checkout.test.ts', output: 'FAIL  checkout.test.ts\n  ✕ empty cart (12 ms)\n    TypeError: Cannot read properties of undefined (reading \'total\')', duration: '8s' },
  { id: 'patch', title: 'Guard the empty cart', state: 'running', tool: 'edit_file', duration: '4s' },
  { id: 'test', title: 'Run the tests again', state: 'pending' },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 480 } });

export default function RunBlockDefault() {
  return <RunBlock {...stylex.props(s.box)} title="Fixing the checkout crash" status="running" elapsed="12s" steps={steps} onStop={() => {}} />;
}
