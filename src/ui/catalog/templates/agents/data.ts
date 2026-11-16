import type { AgentColor, Change, HandoffKind, IconName, RiskLevel } from '../../../components';

// Sample data for the agent dashboard. Every name, number and run is invented. Runs are plans of steps; the
// template moves time forward once a second, so steps finish, runs reach a person and wait, and spend grows.

export type AgentKey = 'coder' | 'researcher' | 'reviewer' | 'writer' | 'support';

export const agents: Record<AgentKey, { name: string; icon: IconName; color: AgentColor }> = {
  coder: { name: 'Coder', icon: 'code', color: 1 },
  researcher: { name: 'Researcher', icon: 'globe', color: 2 },
  reviewer: { name: 'Reviewer', icon: 'eye', color: 3 },
  writer: { name: 'Writer', icon: 'edit', color: 4 },
  support: { name: 'Support', icon: 'message', color: 5 },
};

export const nav: { id: string; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  { id: 'runs', label: 'Runs', icon: 'play' },
  { id: 'agents', label: 'Agents', icon: 'users' },
  { id: 'chat', label: 'Chat', icon: 'message' },
];

export const workspaceNav: { id: string; label: string; icon: IconName }[] = [
  { id: 'permissions', label: 'Permissions', icon: 'lock' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export type Wait = { kind: HandoffKind; title: string; subject: string; risk?: RiskLevel };

export type PlanStep = {
  id: string;
  label: string;
  tool?: string;
  /** ms. Waiting steps take as long as the person does. */
  duration: number;
  tokens?: number;
  cost?: number;
  detail?: string;
  /** Starts with this step instead of after the one before: a helper working in parallel. */
  startsWith?: string;
  depth?: number;
  /** The step fails when it ends, with this error. */
  fails?: string;
  /** Set once it has failed. */
  failed?: string;
  /** What Retry runs in place of a failed step. */
  retryAs?: { label: string; duration: number; detail?: string; tokens?: number; cost?: number };
  /** The run stops here until a person decides. */
  wait?: Wait;
  /** How long the person took, once decided. */
  waited?: number;
  /** "Approved by you". */
  decided?: string;
  /** The decision stopped the run. */
  declined?: boolean;
};

export type RunStatus = 'running' | 'needs-input' | 'queued' | 'done' | 'failed' | 'canceled';

export type Run = {
  id: string;
  title: string;
  agent: AgentKey;
  status: RunStatus;
  /** ms since the run started. */
  elapsed: number;
  /** "2:04 PM". */
  started: string;
  plan: PlanStep[];
  /** What a finished or stopped run left behind: "Notes are in docs/releases/2.4.md". */
  result?: string;
};

const sec = (n: number) => n * 1000;
const min = (n: number) => n * 60_000;

export const initialRuns: Run[] = [
  {
    id: 'checkout', title: 'Fix the checkout crash', agent: 'coder', status: 'running', elapsed: sec(41), started: '2:04 PM',
    plan: [
      { id: 'read', label: 'Read the bug report', tool: 'read_file', duration: sec(2), tokens: 3100, cost: 0.01, detail: 'issues/482.md' },
      { id: 'repro', label: 'Reproduce the crash', tool: 'bash', duration: sec(9), tokens: 5200, cost: 0.03, detail: 'npm test -- checkout.test.ts' },
      { id: 'explore', label: 'Read how the cart builds a summary', tool: 'read_file', duration: sec(6), tokens: 14_000, cost: 0.06, detail: 'src/checkout/cart.ts' },
      { id: 'patch', label: 'Guard the empty cart', tool: 'edit_file', duration: sec(14), tokens: 9000, cost: 0.08, detail: 'src/checkout/cart.ts: return an empty summary when the cart has no items' },
      { id: 'test', label: 'Run the tests', tool: 'bash', duration: sec(18), tokens: 4000, cost: 0.03, detail: 'npm test' },
      {
        id: 'approve', label: 'Wait for approval to deploy', duration: 0,
        wait: { kind: 'approval', title: 'Deploy the checkout fix to staging', subject: 'npm run deploy -- --env staging', risk: 'medium' },
      },
      { id: 'build', label: 'Build the app', tool: 'bash', duration: sec(16), tokens: 2000, cost: 0.02, detail: 'npm run build' },
      { id: 'deploy', label: 'Deploy to staging', tool: 'bash', duration: sec(12), tokens: 1500, cost: 0.01, detail: 'npm run deploy -- --env staging' },
    ],
    result: 'Live on staging',
  },
  {
    id: 'churn', title: 'Summarize this week’s churn calls', agent: 'researcher', status: 'running', elapsed: sec(52), started: '1:58 PM',
    plan: [
      { id: 'find', label: 'Find this week’s call notes', tool: 'search', duration: sec(5), tokens: 2400, cost: 0.01, detail: 'calls where reason = "cancel" and week = 46' },
      { id: 'split', label: 'Hand the calls to two helpers', tool: 'agents', duration: sec(62), tokens: 1200, cost: 0.01, detail: '14 calls, 7 each' },
      { id: 'a', label: 'Summarize calls 1 to 7', tool: 'helper', duration: sec(54), tokens: 48_000, cost: 0.22, startsWith: 'split', depth: 1, detail: 'Helper A' },
      { id: 'b', label: 'Summarize calls 8 to 14', tool: 'helper', duration: sec(62), tokens: 51_000, cost: 0.24, startsWith: 'split', depth: 1, detail: 'Helper B' },
      { id: 'group', label: 'Group the reasons into themes', duration: sec(14), tokens: 11_000, cost: 0.05 },
      { id: 'write', label: 'Write the summary', duration: sec(17), tokens: 8000, cost: 0.04 },
    ],
    result: 'Four themes, in the chat',
  },
  {
    id: 'pr', title: 'Review pull request #482', agent: 'reviewer', status: 'needs-input', elapsed: sec(41) + min(12), started: '1:51 PM',
    plan: [
      { id: 'diff', label: 'Read the diff', tool: 'read_file', duration: sec(12), tokens: 18_000, cost: 0.07, detail: '3 files, +42 −6' },
      { id: 'lint', label: 'Run the linters', tool: 'bash', duration: sec(8), tokens: 1800, cost: 0.01, detail: 'npm run lint' },
      { id: 'cover', label: 'Check the tests cover the change', tool: 'bash', duration: sec(21), tokens: 6400, cost: 0.03, detail: 'npm test -- --coverage' },
      {
        id: 'review', label: 'Wait for your review', duration: 0,
        wait: { kind: 'review', title: 'Review 3 suggested changes in #482', subject: 'src/checkout/cart.ts and 2 more files', risk: 'low' },
      },
      { id: 'post', label: 'Post the review', tool: 'github', duration: sec(4), tokens: 900, cost: 0.01 },
    ],
    result: 'Review posted',
  },
  {
    id: 'refund', title: 'Refund order #1183', agent: 'support', status: 'needs-input', elapsed: sec(11) + min(22), started: '1:42 PM',
    plan: [
      { id: 'message', label: 'Read the customer’s message', tool: 'inbox', duration: sec(3), tokens: 1600, cost: 0.01, detail: '“The jacket arrived torn. I would like my money back.”' },
      { id: 'order', label: 'Look up order #1183', tool: 'orders', duration: sec(2), tokens: 700, cost: 0.01, detail: '1 jacket, $84.00, delivered Nov 10' },
      { id: 'policy', label: 'Check the refund policy', tool: 'search', duration: sec(6), tokens: 3300, cost: 0.02, detail: 'Damaged items: full refund within 30 days' },
      {
        id: 'approve', label: 'Wait for approval to refund', duration: 0,
        wait: { kind: 'approval', title: 'Refund $84.00 for order #1183', subject: 'payments.refund --order 1183 --amount 84.00', risk: 'high' },
      },
      { id: 'send', label: 'Send the refund', tool: 'payments', duration: sec(3), tokens: 500, cost: 0.01 },
      { id: 'reply', label: 'Reply to the customer', tool: 'inbox', duration: sec(8), tokens: 2100, cost: 0.01 },
    ],
    result: 'Refunded and replied',
  },
  {
    id: 'pricing', title: 'Draft the pricing page copy', agent: 'writer', status: 'needs-input', elapsed: sec(22) + min(3), started: '2:01 PM',
    plan: [
      { id: 'read', label: 'Read the current pricing page', tool: 'browse', duration: sec(4), tokens: 6100, cost: 0.03, detail: 'halden.example/pricing' },
      { id: 'draft', label: 'Draft three headlines', duration: sec(18), tokens: 7400, cost: 0.04 },
      {
        id: 'ask', label: 'Wait for your answer', duration: 0,
        wait: { kind: 'question', title: 'Show the Team plan monthly or yearly first?', subject: 'Yearly is 20% cheaper, but the number reads higher' },
      },
      { id: 'final', label: 'Write the final copy', duration: sec(22), tokens: 9800, cost: 0.05 },
    ],
    result: 'Copy is in the doc',
  },
  {
    id: 'crm', title: 'Sync new sign-ups to the CRM', agent: 'researcher', status: 'failed', elapsed: sec(45), started: '1:12 PM', result: '183 contacts created',
    plan: [
      { id: 'export', label: 'Export today’s sign-ups', tool: 'database', duration: sec(6), tokens: 1200, cost: 0.01, detail: '214 new sign-ups' },
      { id: 'match', label: 'Match them to CRM contacts', tool: 'crm', duration: sec(11), tokens: 8800, cost: 0.04, detail: '31 already exist, 183 are new' },
      {
        id: 'update', label: 'Create 183 contacts', tool: 'crm', duration: sec(28), tokens: 3100, cost: 0.02,
        failed: 'The CRM refused after 100 contacts: it allows 100 changes a minute. 83 were not created.',
        retryAs: { label: 'Create the other 83, paced', duration: sec(56), detail: '90 changes a minute, under the CRM limit', tokens: 2600, cost: 0.02 },
      },
    ],
  },
  {
    id: 'notes', title: 'Write the 2.4 release notes', agent: 'writer', status: 'done', elapsed: sec(47), started: '1:40 PM',
    plan: [
      { id: 'prs', label: 'Read merged pull requests', tool: 'github', duration: sec(9), tokens: 21_000, cost: 0.08 },
      { id: 'group', label: 'Group changes by what customers notice', duration: sec(12), tokens: 6000, cost: 0.03 },
      { id: 'write', label: 'Write the notes', duration: sec(26), tokens: 9200, cost: 0.05 },
    ],
    result: 'docs/releases/2.4.md',
  },
  {
    id: 'triage', title: 'Triage new issues', agent: 'coder', status: 'done', elapsed: sec(27), started: '12:58 PM',
    plan: [
      { id: 'read', label: 'Read 12 new issues', tool: 'github', duration: sec(14), tokens: 26_000, cost: 0.1 },
      { id: 'label', label: 'Label and assign them', tool: 'github', duration: sec(9), tokens: 3000, cost: 0.02 },
      { id: 'dupes', label: 'Close 3 duplicates', tool: 'github', duration: sec(4), tokens: 1100, cost: 0.01 },
    ],
    result: '9 open, 3 closed as duplicates',
  },
  {
    id: 'digest', title: 'Weekly metrics digest', agent: 'researcher', status: 'queued', elapsed: 0, started: 'Queued',
    plan: [
      { id: 'pull', label: 'Pull this week’s numbers', tool: 'database', duration: sec(10), tokens: 4000, cost: 0.02 },
      { id: 'write', label: 'Write the digest', duration: sec(20), tokens: 7000, cost: 0.04 },
    ],
    result: 'Sent to #metrics',
  },
];

/** Spend from runs earlier today that are no longer listed, by agent, in US dollars. */
export const earlierSpend: Record<AgentKey, number> = { coder: 6.1, researcher: 4.4, reviewer: 2.2, writer: 1.9, support: 1.6 };

export const budget = 40;

/** Runs finished on each of the last 12 days, today last. */
export const finishedTrend = [22, 25, 24, 28, 30, 27, 31, 33, 29, 34, 36, 35];

export const finishedEarlier = 31;

export const pricingOptions = [
  { id: 'yearly', label: 'Yearly first', description: 'Leads with the better deal: $16 a month, billed yearly.', recommended: true },
  { id: 'monthly', label: 'Monthly first', description: 'Matches how most visitors pay today: $20 a month.' },
];

export const prChanges: Change[] = [
  {
    id: 'guard', path: 'src/checkout/cart.ts', status: 'pending',
    lines: [
      { type: 'context', text: 'export function summary(cart?: Cart) {', number: 12 },
      { type: 'remove', text: '  return { total: cart.total, items: cart.items.length };', number: 13 },
      { type: 'add', text: '  if (!cart || cart.items.length === 0) return emptySummary;', number: 13 },
      { type: 'add', text: '  return { total: cart.total, items: cart.items.length };', number: 14 },
    ],
  },
  {
    id: 'test', path: 'src/checkout/cart.test.ts', status: 'pending',
    lines: [
      { type: 'add', text: "it('returns an empty summary for an empty cart', () => {", number: 40 },
      { type: 'add', text: '  expect(summary({ items: [] })).toEqual(emptySummary);', number: 41 },
      { type: 'add', text: '});', number: 42 },
    ],
  },
  {
    id: 'type', path: 'src/checkout/types.ts', status: 'pending',
    lines: [
      { type: 'remove', text: 'export const emptySummary = { total: 0 };', number: 8 },
      { type: 'add', text: 'export const emptySummary = { total: 0, items: 0 };', number: 8 },
    ],
  },
];

