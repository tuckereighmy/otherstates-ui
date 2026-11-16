# Permission rules

Set what an agent may do, tool by tool: allow, ask first or deny.

Category: Agents · Exports: `PermissionRules`, `PermissionRule`, `PermissionPreset`, `PermissionTool`, `permissionPresets`, `presetRule`, `rulesFor`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { PermissionRules } from '@/ui/components';

<PermissionRules label="Coder permissions" tools={tools} onChange={save} />
```

## PermissionRules

Allow, ask or deny for each tool an agent can use, with presets.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Names the rules. |
| `tools` (required) | `PermissionTool[]` |  | Each tool: `id`, `label`, `description` and `risk`. |
| `value` | `Record<string, PermissionRule>` |  | Each tool's rule by id (controlled). |
| `defaultValue` | `Record<string, PermissionRule>` |  | Default: the Ask if risky preset. |
| `onChange` | `(rules: Record<string, PermissionRule>) => void` |  | Called when a rule or the preset changes. |
| `showPresets` | `boolean` | `true` | Shows the presets above the tools. |

## Accessibility

- Each tool's rule is a segmented control named after the tool, so arrow keys move between Allow, Ask and Deny.
- The summary ("4 run on their own, 2 ask first") is a polite live region.
- Risk is written as words beside each risky tool.
- A high-risk tool only runs without asking when a person sets it to Allow; no preset does.

## Examples

### Default

`src/ui/catalog/docs/permission-rules/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Card, PermissionRules, type PermissionTool } from '../../../components';

const tools: PermissionTool[] = [
  { id: 'read', label: 'Read files', description: 'Anything in this repository', risk: 'low' },
  { id: 'search', label: 'Search the web', risk: 'low' },
  { id: 'edit', label: 'Edit files', description: 'Changes stay local until you commit', risk: 'medium' },
  { id: 'bash', label: 'Run shell commands', description: 'npm, git and test scripts', risk: 'medium' },
  { id: 'push', label: 'Push to the remote', risk: 'high' },
  { id: 'deploy', label: 'Deploy to production', risk: 'high' },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 600, marginInline: 'auto' } });

export default function PermissionRulesDefault() {
  return (
    <Card heading="Coder" description="What it may do without asking you." {...stylex.props(s.box)}>
      <PermissionRules label="Coder permissions" tools={tools} />
    </Card>
  );
}
```
