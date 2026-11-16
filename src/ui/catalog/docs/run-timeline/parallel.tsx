import { RunTimeline, type TimelineSpan } from '../../../components';

const spans: TimelineSpan[] = [
  { id: 'find', label: 'Find the call notes', tool: 'search', start: 0, duration: 5000, state: 'done' },
  { id: 'split', label: 'Hand the calls to two helpers', tool: 'agents', start: 5000, duration: 62000, state: 'done' },
  { id: 'a', label: 'Summarize calls 1 to 7', tool: 'helper', start: 5000, duration: 54000, state: 'done', depth: 1, tokens: 48000, cost: 0.22 },
  { id: 'b', label: 'Summarize calls 8 to 14', tool: 'helper', start: 5000, duration: 62000, state: 'done', depth: 1, tokens: 51000, cost: 0.24 },
  { id: 'sync', label: 'Save the themes to the CRM', tool: 'crm', start: 67000, duration: 9000, state: 'failed', detail: 'The CRM refused: it allows 100 changes a minute.' },
];

export default function RunTimelineParallel() {
  return <RunTimeline label="Steps of Summarize the churn calls" spans={spans} defaultSelectedId="sync" />;
}
