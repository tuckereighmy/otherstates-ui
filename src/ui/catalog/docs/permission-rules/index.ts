import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';

export default defineDoc({
  id: "permission-rules",
  title: "Permission rules",
  category: 'Agents',
  description: "Set what an agent may do, tool by tool: allow, ask first or deny.",
  source: ["components/permission-rules.tsx", "components/agent-status.tsx", "components/badge.tsx", "components/Icon.tsx", "components/internal/agent-parts.tsx", "components/internal/choice.tsx", "components/internal/class-name.ts", "components/internal/control.ts", "components/internal/platform.ts", "components/internal/size.ts", "components/internal/spring.ts", "components/internal/states.ts", "components/internal/surface.ts", "components/permission-presets.ts", "components/segmented-control.tsx", "tokens.stylex.ts"],
  exports: ["PermissionRules", "PermissionRule", "PermissionPreset", "PermissionTool", "permissionPresets", "presetRule", "rulesFor"],
  usage: `import { PermissionRules } from '@/ui/components';

<PermissionRules label="Coder permissions" tools={tools} onChange={save} />`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, align: "stretch", minHeight: 520 },
  ],
  api: [
    {
      name: "PermissionRules",
      description: "Allow, ask or deny for each tool an agent can use, with presets.",
      extends: "<div> attributes",
      props: [
        { name: "label", type: "string", required: true, description: "Names the rules." },
        { name: "tools", type: "PermissionTool[]", required: true, description: "Each tool: `id`, `label`, `description` and `risk`." },
        { name: "value", type: "Record<string, PermissionRule>", description: "Each tool's rule by id (controlled)." },
        { name: "defaultValue", type: "Record<string, PermissionRule>", description: "Default: the Ask if risky preset." },
        { name: "onChange", type: "(rules: Record<string, PermissionRule>) => void", description: "Called when a rule or the preset changes." },
        { name: "showPresets", type: "boolean", default: "true", description: "Shows the presets above the tools." },
      ],
    },
  ],
  accessibility: [
    "Each tool's rule is a segmented control named after the tool, so arrow keys move between Allow, Ask and Deny.",
    "The summary (\"4 run on their own, 2 ask first\") is a polite live region.",
    "Risk is written as words beside each risky tool.",
    "A high-risk tool only runs without asking when a person sets it to Allow; no preset does.",
  ],
});
