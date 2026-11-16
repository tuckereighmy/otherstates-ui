import * as stylex from '@stylexjs/stylex';
import { FileChange, FileChanges, RunBlock, type RunStep } from '../../../components';

const steps: RunStep[] = [
  { id: 'patch', title: 'Guard the empty cart', state: 'done', duration: '6s', children: (
    <FileChanges aria-label="Changed files"><FileChange path="src/checkout/cart.ts" added={6} removed={1} /></FileChanges>
  ) },
  { id: 'test', title: 'Run the tests', state: 'done', tool: 'bash', inputLabel: 'Command', input: 'npm test', output: 'Tests  214 passed (214)', duration: '21s' },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 480 } });

export default function RunBlockFinished() {
  return <RunBlock {...stylex.props(s.box)} title="Fixed the checkout crash" status="done" elapsed="1m 12s" summary="1 file changed" steps={steps} />;
}
