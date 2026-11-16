import type { Change, IconName, PromptSuggestion, RunStep } from '../../../components';

export type Reply = {
  reasoning?: { text: string; duration?: number; streaming?: boolean };
  run?: { title: string; status: 'running' | 'done' | 'failed' | 'stopped'; steps: RunStep[]; elapsed?: string; summary?: string };
  text?: string;
  approval?: 'pending' | 'approved' | 'denied';
  changes?: Change[];
  streaming?: boolean;
  stopped?: boolean;
  feedback?: 'up' | 'down' | null;
};

export type Message = { id: string; role: 'user'; text: string } | ({ id: string; role: 'assistant' } & Reply) | { id: string; role: 'checkpoint'; label: string; time: string };

export const conversations: { id: string; title: string; icon: IconName; group: 'Today' | 'Earlier' }[] = [
  { id: 'checkout', title: 'Fix the checkout crash', icon: 'message', group: 'Today' },
  { id: 'pricing', title: 'Pricing page copy', icon: 'message', group: 'Today' },
  { id: 'churn', title: 'Churn call themes', icon: 'message', group: 'Earlier' },
  { id: 'onboarding', title: 'Onboarding email draft', icon: 'message', group: 'Earlier' },
];

export const suggestions: PromptSuggestion[] = [
  { id: 'test', label: 'Fix a failing test', icon: 'code' },
  { id: 'review', label: 'Review a pull request', icon: 'eye' },
  { id: 'notes', label: 'Write release notes', icon: 'edit' },
  { id: 'feedback', label: 'Summarize feedback', icon: 'message' },
];

const answer = `Found it. \`summary()\` read \`cart.total\` before an empty cart had one, so the first visit to checkout threw.

**What I changed**
- Return an empty summary when the cart has no items
- Added two tests: an empty cart and a single item

\`\`\`ts
export function summary(cart?: Cart) {
  if (!cart || cart.items.length === 0) return emptySummary;
  return { total: cart.total, items: cart.items.length };
}
\`\`\`

All 214 tests pass. Want me to ship it to staging?`;

export const initialMessages: Message[] = [
  { id: 'm1', role: 'user', text: 'Checkout crashes when the cart is empty. Can you find out why and fix it?' },
  {
    id: 'm2', role: 'assistant', feedback: null,
    reasoning: { text: 'The error is a TypeError on `total`, so something reads the cart before it exists. I will reproduce it first, then read how cart.ts builds the summary.', duration: 9000 },
    run: {
      title: 'Fixed the checkout crash', status: 'done', elapsed: '1m 12s', summary: '2 files changed',
      steps: [
        { id: 'read', title: 'Read the bug report', state: 'done', tool: 'read_file', inputLabel: 'Path', input: 'issues/482.md', output: 'Checkout crashes when the cart is empty.', duration: '0.4s' },
        { id: 'repro', title: 'Reproduce the crash', state: 'done', tool: 'bash', inputLabel: 'Command', input: 'npm test -- checkout.test.ts', output: "FAIL  checkout.test.ts\n  ✕ empty cart (12 ms)\n    TypeError: Cannot read properties of undefined (reading 'total')", duration: '8s' },
        { id: 'patch', title: 'Guard the empty cart', state: 'done', tool: 'edit_file', inputLabel: 'Path', input: 'src/checkout/cart.ts', output: 'Edited 1 function, added 2 tests.', duration: '6s' },
        { id: 'test', title: 'Run the tests again', state: 'done', tool: 'bash', inputLabel: 'Command', input: 'npm test', output: 'Tests  214 passed (214)', duration: '21s' },
      ],
    },
    text: answer,
  },
  { id: 'c1', role: 'checkpoint', label: 'After "Fixed the checkout crash"', time: '2:09 PM' },
  { id: 'm3', role: 'user', text: 'Yes, ship it to staging.' },
  { id: 'm4', role: 'assistant', text: 'I will deploy the fix to staging. This runs a deploy, so it needs your go-ahead.', approval: 'pending' },
];

export const deploySteps: RunStep[] = [
  { id: 'build', title: 'Build the app', state: 'done', tool: 'bash', inputLabel: 'Command', input: 'npm run build', output: 'Built in 41s', duration: '41s' },
  { id: 'deploy', title: 'Deploy to staging', state: 'running', tool: 'bash', inputLabel: 'Command', input: 'npm run deploy -- --env staging' },
];

/** Canned replies for new messages, by keyword. */
export function replyFor(prompt: string): { thinking: string; text: string } {
  const lower = prompt.toLowerCase();
  if (lower.includes('test')) return {
    thinking: 'Start from the failing test output, then find the smallest change that makes it pass without hiding the cause.',
    text: 'Send me the test name or paste its output and I will:\n\n1. Run it on its own to confirm it fails\n2. Find the line that throws\n3. Propose the smallest fix, with a test that covers it\n\nI will ask before changing anything outside the test file.',
  };
  if (lower.includes('release')) return {
    thinking: 'Release notes read best grouped by what a customer notices: new, improved, fixed.',
    text: '**Release notes, version 2.4**\n\n- **New:** export any report to CSV in one click\n- **Improved:** the dashboard loads twice as fast\n- **Fixed:** checkout no longer crashes with an empty cart\n\nWant a shorter version for the in-app banner?',
  };
  return {
    thinking: 'Work out what a good first step is, and what I would need to check before acting.',
    text: 'Here is how I would approach it:\n\n- Read what exists today and note anything surprising\n- Make one small change at a time, each with a checkpoint\n- Show you every change before it is applied\n\nTell me where to start, or say **go** and I will begin with the first step.',
  };
}
