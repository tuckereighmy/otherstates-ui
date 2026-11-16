import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Permission from './permission';
import permissionCode from './permission.tsx?raw';
import Command from './command';
import commandCode from './command.tsx?raw';
import Decided from './decided';
import decidedCode from './decided.tsx?raw';
import Approving from './approving';
import approvingCode from './approving.tsx?raw';

export default defineDoc({
  id: "approval-card",
  title: "Approval card",
  category: 'Agents',
  description: "Ask a person before an agent acts: what will happen, how risky it is and one decision.",
  source: ["components/approval-card.tsx", "components/agent-identity.tsx", "components/agent-status.tsx", "components/badge.tsx", "components/button.tsx", "components/card.tsx", "components/Icon.tsx", "components/internal/agent-parts.tsx", "components/internal/choice.tsx", "components/internal/class-name.ts", "components/internal/control.ts", "components/internal/overlay.tsx", "components/internal/platform.ts", "components/internal/size.ts", "components/internal/spring.ts", "components/internal/sr-only.tsx", "components/internal/states.ts", "components/internal/surface.ts", "components/kbd.tsx", "components/segmented-control.tsx", "components/tool-call.tsx", "tokens.stylex.ts"],
  exports: ["ApprovalCard", "ApprovalAgent", "ApprovalScope", "ApprovalStatus", "RiskBadge", "RiskLevel"],
  usage: `import { ApprovalCard } from '@/ui/components';

<ApprovalCard
  title="Send the October newsletter"
  risk="medium"
  onApprove={() => send()}
  onDeny={() => cancel()}
/>`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, minHeight: 380 },
    { id: "permission", title: "Permission with a scope", description: "`scopes` asks how long the permission lasts; `onApprove` receives the choice. Children show what will change.", Component: Permission, code: permissionCode, minHeight: 460 },
    { id: "command", title: "Exact command", description: "`command` shows exactly what will run, with copy, so the person approves the literal action. `tool` names what runs it.", Component: Command, code: commandCode, minHeight: 440 },
    { id: "decided", title: "Decided", description: "`status` replaces the buttons with the outcome once someone has decided; `statusLabel` says who and when.", Component: Decided, code: decidedCode },
    { id: "approving", title: "Starting the action", description: "`isApproving` shows the approve button as loading while the action starts.", Component: Approving, code: approvingCode },
  ],
  api: [
    {
      name: "ApprovalCard",
      description: "An agent's request for permission, with the details and one decision.",
      extends: "Card props (without heading, description, action, footer)",
      props: [
        { name: "title", type: "ReactNode", required: true, description: "What will happen, as a short action." },
        { name: "description", type: "ReactNode", description: "Why, or for whom: one or two sentences." },
        { name: "agent", type: "{ name: string; icon?: IconName; color?: AgentColor }", description: "The agent asking, in the head row." },
        { name: "askVerb", type: "ReactNode", default: "'asks'", description: "The words after the agent's name." },
        { name: "risk", type: "'low' | 'medium' | 'high'", description: "Shows the risk in words at the end of the head row." },
        { name: "command", type: "string", description: "Exactly what will run, as the agent will send it. Shown in full with a copy button." },
        { name: "tool", type: "string", description: "The tool that runs `command`: \"bash\", \"sql\"." },
        { name: "commandLabel", type: "string", default: "'Command'", description: "Names `command`." },
        { name: "details", type: "{ label: ReactNode; value: ReactNode }[]", description: "The figures that matter, as wash tiles. Two or three read best." },
        { name: "children", type: "ReactNode", description: "More content under the tiles, such as FileChanges or a DiffView." },
        { name: "scopes", type: "{ id: string; label: string }[]", description: "Choices for how long the approval lasts." },
        { name: "scope", type: "string", description: "The chosen scope (controlled)." },
        { name: "defaultScope", type: "string", description: "The scope chosen at first. Default: the first." },
        { name: "onScopeChange", type: "(scope: string) => void", description: "Called when the scope changes." },
        { name: "approveLabel", type: "string", default: "'Approve'", description: "The approve button." },
        { name: "denyLabel", type: "string", default: "'Deny'", description: "The deny button." },
        { name: "onApprove", type: "(scope?: string) => void", description: "Adds the approve button. Receives the scope when there are `scopes`." },
        { name: "onDeny", type: "() => void", description: "Adds the deny button." },
        { name: "status", type: "'pending' | 'approved' | 'denied'", default: "'pending'", description: "A decided status replaces the buttons with the outcome." },
        { name: "statusLabel", type: "ReactNode", description: "Replaces the outcome line." },
        { name: "isApproving", type: "boolean", default: "false", description: "Shows the approve button as loading." },
        { name: "shortcuts", type: "boolean", default: "true", description: "Listens for Mod+Enter and Escape while focus is inside." },
      ],
    },
    {
      name: "RiskBadge",
      description: "An action's risk: gray for low, warning for medium, error for high.",
      extends: "<span> attributes",
      props: [
        { name: "risk", type: "'low' | 'medium' | 'high'", required: true, description: "The risk level." },
        { name: "size", type: "'sm' | 'md' | 'lg'", default: "'sm'", description: "Badge height. Ignored by `text`." },
        { name: "appearance", type: "'badge' | 'text'", default: "'badge'", description: "A pill, or the words alone in the risk's color for the head of a card." },
        { name: "children", type: "ReactNode", description: "Replaces the words, for example \"Destructive\"." },
      ],
    },
  ],
  accessibility: [
    "The card is an `<article>` named by its title.",
    "While focus is inside the card, Mod+Enter approves and Escape denies; the buttons carry `aria-keyshortcuts`.",
    "The outcome line is a status region, so assistive tech hears the decision when it lands.",
    "Risk is written as words (\"High risk\"), never shown by color alone.",
  ],
});
