'use client';

import { AgentInbox, type AgentTask } from '../../../components';

const tasks: AgentTask[] = [
  { id: 't1', title: 'Split the users table', summary: 'The dry run on staging passed. It wants to run on production.', state: 'needs-input', elapsed: '6m', agent: { name: 'Data agent', icon: 'layers', color: 1 } },
  { id: 't2', title: 'Merge duplicate contacts', summary: 'Matched 1,312 likely duplicates.', state: 'running', elapsed: '12m', agent: { name: 'CRM agent', icon: 'users', color: 2 } },
  { id: 't3', title: 'Translate the release notes', state: 'queued', agent: { name: 'Writer', icon: 'edit', color: 3 } },
  { id: 't4', title: 'Summarize churn calls', summary: '14 calls, 4 themes.', state: 'done', elapsed: '9m', cost: '$0.42', agent: { name: 'Researcher', icon: 'search', color: 4 } },
];

export default function AgentInboxDefault() {
  return <AgentInbox label="Agent inbox" tasks={tasks} onApprove={() => {}} onReject={() => {}} />;
}
