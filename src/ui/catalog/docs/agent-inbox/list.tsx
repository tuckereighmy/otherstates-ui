'use client';

import { AgentInbox, type AgentTask } from '../../../components';

const tasks: AgentTask[] = [
  { id: 't1', title: 'Approve a $240 refund', state: 'needs-input', elapsed: '4m', agent: { name: 'Support agent', icon: 'message' } },
  { id: 't2', title: 'Rotate the signing keys', state: 'running', elapsed: '2m', agent: { name: 'Ops agent', icon: 'lock' } },
  { id: 't3', title: 'Sync the calendar', state: 'failed', elapsed: '1m', agent: { name: 'Scheduler', icon: 'calendar' } },
  { id: 't4', title: 'Tag 14 tickets as billing', state: 'done', elapsed: '40s', agent: { name: 'Triage', icon: 'tag' } },
];

export default function AgentInboxList() {
  return <AgentInbox label="Agent inbox" tasks={tasks} defaultView="list" onApprove={() => {}} onReject={() => {}} />;
}
