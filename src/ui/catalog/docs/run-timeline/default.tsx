import { RunTimeline, type TimelineSpan } from '../../../components';

const spans: TimelineSpan[] = [
  { id: 'read', label: 'Read the bug report', tool: 'read_file', start: 0, duration: 2000, state: 'done', tokens: 3100, cost: 0.01, detail: 'issues/482.md' },
  { id: 'repro', label: 'Reproduce the crash', tool: 'bash', start: 2000, duration: 9000, state: 'done', tokens: 5200, cost: 0.03, detail: 'npm test -- checkout.test.ts' },
  { id: 'patch', label: 'Guard the empty cart', tool: 'edit_file', start: 11000, duration: 14000, state: 'done', tokens: 9000, cost: 0.08, detail: 'src/checkout/cart.ts' },
  { id: 'test', label: 'Run the tests', tool: 'bash', start: 25000, duration: 18000, state: 'done', tokens: 4000, cost: 0.03, detail: 'npm test' },
  { id: 'approve', label: 'Approved by you', start: 43000, duration: 41000, state: 'done', waiting: true, detail: 'npm run deploy -- --env staging' },
  { id: 'deploy', label: 'Deploy to staging', tool: 'bash', start: 84000, state: 'running', tokens: 900, cost: 0.01 },
];

export default function RunTimelineDefault() {
  return <RunTimeline label="Steps of Fix the checkout crash" spans={spans} now={92000} />;
}
