import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import List from './list';
import listCode from './list.tsx?raw';
import TaskCard from './task-card';
import taskCardCode from './task-card.tsx?raw';

export default defineDoc({
  id: "agent-inbox",
  title: "Agent inbox",
  category: 'Agents',
  description: "Sort agent tasks by who they wait on, as a board or a list.",
  source: ["components/agent-task.tsx", "components/agent-identity.tsx", "components/agent-status.tsx", "components/badge.tsx", "components/button.tsx", "components/card.tsx", "components/Icon.tsx", "components/internal/agent-parts.tsx", "components/internal/choice.tsx", "components/internal/class-name.ts", "components/internal/control.ts", "components/internal/overlay.tsx", "components/internal/platform.ts", "components/internal/size.ts", "components/internal/spring.ts", "components/internal/sr-only.tsx", "components/internal/states.ts", "components/internal/surface.ts", "components/segmented-control.tsx", "tokens.stylex.ts"],
  exports: ["AgentInbox", "AgentTaskCard", "AgentTask"],
  usage: `import { AgentInbox } from '@/ui/components';

<AgentInbox label="Agent inbox" tasks={tasks} onApprove={approve} onReject={reject} />`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, align: "stretch", minHeight: 520 },
    { id: "list", title: "List view", description: "The same tasks as one list, needs you first.", Component: List, code: listCode, align: "stretch", minHeight: 340 },
    { id: "task-card", title: "Task card", description: "`AgentTaskCard` on its own, with run steps as its `detail`.", Component: TaskCard, code: taskCardCode, minHeight: 380 },
  ],
  api: [
    {
      name: "AgentInbox",
      description: "Agent tasks sorted into needs you, working and finished.",
      extends: "<div> attributes",
      props: [
        { name: "label", type: "string", required: true, description: "Names the inbox region." },
        { name: "tasks", type: "AgentTask[]", required: true, description: "Each task: `id`, `title`, `summary`, `agent`, `state`, `elapsed`, `cost` and `detail`." },
        { name: "view", type: "'board' | 'list'", description: "The view (controlled)." },
        { name: "defaultView", type: "'board' | 'list'", default: "'board'", description: "The view at first." },
        { name: "onViewChange", type: "(view: 'board' | 'list') => void", description: "Called when the view changes." },
        { name: "onApprove", type: "(id: string) => void", description: "Adds Approve to tasks that need you." },
        { name: "onReject", type: "(id: string) => void", description: "Adds Reject to tasks that need you." },
        { name: "toolbar", type: "ReactNode", description: "Trailing toolbar content: filters, a search field." },
      ],
    },
    {
      name: "AgentTaskCard",
      description: "One task: what it is, which agent has it, its state and time.",
      extends: "Card props (without heading, description, action, footer)",
      props: [
        { name: "task", type: "AgentTask", required: true, description: "The task to show." },
        { name: "actions", type: "ReactNode", description: "Actions in the footer, such as Approve and Reject." },
      ],
    },
  ],
  accessibility: [
    "The inbox is a named region; each board column is a section named by its heading.",
    "States are written in each card's badge, and list rows give their dot a label.",
    "Board columns stack into one column on narrow screens.",
  ],
});
