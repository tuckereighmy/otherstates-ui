# Agent identity

Show which agent is acting: its tile, name and model.

Category: Agents · Exports: `AgentIdentity`, `AgentGlyph`, `AgentColor`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { AgentIdentity } from '@/ui/components';

<AgentIdentity name="Researcher" model="Standard model" />
```

## AgentIdentity

An agent's tile, name and model on one row.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` |  | The agent's name. |
| `model` | `ReactNode` |  | The model or role under the name. Hidden at `sm`. |
| `icon` | `IconName` |  | A glyph from the icon set instead of the initial. |
| `color` | `1 \| 2 \| 3 \| 4 \| 5` |  | A chart color for the tile, when several agents share a view. |
| `size` | `'sm' \| 'md'` | `'md'` | `sm`: a 24 px tile beside one line. `md`: a 32 px tile beside the name and model. |
| `state` | `AgentState` |  | Puts a state dot on the tile and adds the state to the name for screen readers. |
| `end` | `ReactNode` |  | Trailing content: a StatusBadge, a cost, a menu. |

## AgentGlyph

An agent's tile: a rounded square with an initial or a glyph.

Extends: <span> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` |  | The source of the initial and the accessible name. |
| `icon` | `IconName` |  | A glyph instead of the initial. |
| `color` | `1 \| 2 \| 3 \| 4 \| 5` |  | A chart color. Default neutral. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | 20, 24, 32 or 40 px. |
| `state` | `AgentState` |  | A state dot at the bottom end. |
| `decorative` | `boolean` | `false` | Hides the tile from assistive tech when the name is written next to it. |

## Accessibility

- Agents are squares and people are circles, so the two never read as the same thing.
- `AgentGlyph` is an image named after the agent (and its state), unless it is `decorative`.
- In `AgentIdentity` the tile is decorative and the written name carries the identity and the state.
- Agent colors come from the chart palette, which is checked for color-vision differences; the name is always written too.

## Examples

### Default

`src/ui/catalog/docs/agent-identity/default.tsx`

```tsx
import { AgentIdentity } from '../../../components';

export default function AgentIdentityDefault() {
  return <AgentIdentity name="Researcher" model="Standard model" icon="search" />;
}
```

### With state and trailing content

`state` puts a dot on the tile; `end` holds a badge, a cost or a menu.

`src/ui/catalog/docs/agent-identity/with-state.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { AgentIdentity, StatusBadge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ column: { display: 'grid', gap: t['--os-space-4'], width: '100%', maxWidth: 320 } });

export default function AgentIdentityWithState() {
  return (
    <div {...stylex.props(s.column)}>
      <AgentIdentity name="Support lead" model="Large model" icon="message" state="running" end={<StatusBadge state="running" />} />
      <AgentIdentity name="Billing" model="Fast model" icon="credit-card" state="needs-input" end={<StatusBadge state="needs-input" />} />
    </div>
  );
}
```

### Colors

When several agents share a view, `color` tells them apart with the chart palette, in order.

`src/ui/catalog/docs/agent-identity/colors.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { AgentIdentity } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const crew = [
  { name: 'Planner', model: 'Large model', icon: 'list', color: 1 },
  { name: 'Researcher', model: 'Standard model', icon: 'search', color: 2 },
  { name: 'Writer', model: 'Standard model', icon: 'edit', color: 3 },
  { name: 'Reviewer', model: 'Large model', icon: 'eye', color: 4 },
] as const;

const s = stylex.create({ grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 160px))', gap: t['--os-space-4'] } });

export default function AgentIdentityColors() {
  return (
    <div {...stylex.props(s.grid)}>
      {crew.map(agent => <AgentIdentity key={agent.name} {...agent} />)}
    </div>
  );
}
```

### Glyph sizes

`AgentGlyph` alone at 20, 24, 32 and 40 px, with an initial or an icon.

`src/ui/catalog/docs/agent-identity/glyphs.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { AgentGlyph } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ row: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'] } });

export default function AgentIdentityGlyphs() {
  return (
    <div {...stylex.props(s.row)}>
      <AgentGlyph name="Triage" size="xs" />
      <AgentGlyph name="Triage" size="sm" />
      <AgentGlyph name="Triage" size="md" icon="inbox" />
      <AgentGlyph name="Triage" size="lg" icon="inbox" state="running" />
    </div>
  );
}
```

### Small

`size="sm"` sets a 24 px tile beside the name alone, for dense rows.

`src/ui/catalog/docs/agent-identity/small.tsx`

```tsx
import { AgentIdentity } from '../../../components';

export default function AgentIdentitySmall() {
  return <AgentIdentity size="sm" name="Release manager" icon="zap" color={2} />;
}
```
