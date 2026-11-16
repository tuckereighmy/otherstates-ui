import type { ComponentType } from 'react';
import Agents from './agents';
import agentsCode from './agents/index.tsx?raw';
import Chat from './chat';
import chatCode from './chat/index.tsx?raw';
import Overview from './overview';
import overviewCode from './overview/index.tsx?raw';
import Projects from './projects';
import projectsCode from './projects/index.tsx?raw';
import Settings from './settings';
import settingsCode from './settings/index.tsx?raw';

// Full screens built only from the library's components. Routes: #templates/<id> in the docs, and
// #preview/<id> for the screen alone. Each template lives in ./<id>/: index.tsx is the screen (its
// default export) and data.ts its sample data. To add one: write those two files, then add an entry here.

export type Template = {
  /** kebab-case route id. */
  id: string;
  title: string;
  /** One line for the gallery card. */
  summary: string;
  /** One or two sentences under the title on the template's page. */
  description: string;
  Component: ComponentType;
  /** index.tsx, for the Code tab. */
  code: string;
  /** Component page ids (docs/registry), in the order the screen uses them. */
  components: string[];
};

export const templates: Template[] = [
  {
    id: 'chat',
    title: 'Agent chat',
    summary: 'A conversation with an agent: thinking, real tool runs, an approval and a streamed answer.',
    description: 'An agent chat. A finished turn shows the reasoning, the run with every tool call, a checkpoint and a Markdown answer; the next asks to deploy and runs on approval. New messages stream, and the composer steers, queues and stops a run.',
    Component: Chat,
    code: chatCode,
    components: ['chat-thread', 'chat-message', 'markdown', 'reasoning', 'run-block', 'approval-card', 'checkpoints', 'composer', 'prompt-suggestions', 'sidebar', 'menu', 'button'],
  },
  {
    id: 'agents',
    title: 'Agent dashboard',
    summary: 'What agents are doing, what waits on you, and where each run’s time and money went.',
    description: 'An agent dashboard. Decisions waiting on you come first, longest wait first, and are made in place. Runs move in real time: open one to see its steps on a time axis, stop a run or retry a failure, and watch spend against the daily budget.',
    Component: Agents,
    code: agentsCode,
    components: ['stat', 'handoff-list', 'run-timeline', 'usage-bar', 'table', 'agent-status', 'agent-identity', 'decision-card', 'change-review', 'sheet', 'toast', 'segmented-control', 'sidebar', 'button'],
  },
  {
    id: 'overview',
    title: 'Analytics',
    summary: 'A dashboard with key numbers, a trend chart, recent activity and goals.',
    description: 'An analytics dashboard: four key numbers with sparklines, a line chart of this period against the last, a table of recent activity and progress towards this quarter’s goals.',
    Component: Overview,
    code: overviewCode,
    components: ['sidebar', 'segmented-control', 'input-group', 'input', 'menu', 'avatar', 'card', 'chart', 'badge', 'table', 'progress', 'meter', 'button'],
  },
  {
    id: 'projects',
    title: 'Projects',
    summary: 'A sortable project list with filters, a board view and an editable detail sheet.',
    description: 'A project list: search, a status filter and a switch between table and board. The table sorts, selects and pages; a row opens a sheet to edit the project, and New project opens a dialog.',
    Component: Projects,
    code: projectsCode,
    components: ['sidebar', 'button', 'dialog', 'field', 'input', 'input-group', 'select', 'textarea', 'segmented-control', 'table', 'checkbox', 'pagination', 'badge', 'avatar', 'progress', 'card', 'sheet', 'toast'],
  },
  {
    id: 'settings',
    title: 'Settings',
    summary: 'Workspace settings in tabs: general, members, notifications and billing.',
    description: 'A settings page in four tabs. Forms use Field, Input, Select, Switch and RadioGroup; members have row actions; deleting the workspace asks first; saving confirms with a toast.',
    Component: Settings,
    code: settingsCode,
    components: ['sidebar', 'tabs', 'card', 'field', 'input', 'input-group', 'select', 'radio-group', 'switch', 'table', 'avatar', 'badge', 'menu', 'meter', 'button', 'alert-dialog', 'toast'],
  },
];

export const templatesById: ReadonlyMap<string, Template> = new Map(templates.map(template => [template.id, template]));
