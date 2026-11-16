# Collapsible

Show or hide content with a single trigger.

Category: Layout · Exports: `Collapsible`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Collapsible } from '@/ui/components';

<Collapsible title="Sharing settings">
  Everyone in the workspace can view this page.
</Collapsible>
```

## Collapsible

A trigger that shows and hides one panel of content.

Extends: React Aria DisclosureProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` |  | The trigger’s label. The chevron follows it. |
| `children` (required) | `ReactNode` |  | The panel content, set in 14/20 `fg-muted`. |
| `variant` | `'filled' \| 'outline' \| 'plain'` | `'filled'` | `filled` for bg-subtle sections, `outline` adds a 1px hairline for canvas, `plain` has no surface. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` |  | Wraps the trigger in a heading element. Without it the trigger is a plain button. |
| `trigger` | `ReactNode \| ((state: CollapsibleTriggerState) => ReactNode)` |  | Replaces the trigger’s content (title and chevron). A function receives `isExpanded` and `isDisabled`. |
| `isExpanded` | `boolean` |  | Whether the panel is open (controlled). |
| `defaultExpanded` | `boolean` | `false` | Whether the panel starts open (uncontrolled). |
| `onExpandedChange` | `(isExpanded: boolean) => void` |  | Called when the trigger opens or closes the panel. |
| `isDisabled` | `boolean` | `false` | Blocks the trigger and dims its label. |
| `className` | `string` |  | Added to the root element. |
| `style` | `CSSProperties` |  | Inline styles for the root element. |
| `ref` | `Ref<HTMLDivElement>` |  | The root element. |

## Accessibility

- The trigger is a `button` with `aria-expanded` and `aria-controls` pointing at the panel.
- Enter and Space open and close the panel; a disabled trigger is skipped by Tab.
- Set `headingLevel` when the trigger names a section, so screen readers can jump to it.
- A custom `trigger` still renders inside the button: give it visible text, not just an icon.
- With reduced motion the panel and chevron change instantly.

## Examples

### Default

`src/ui/catalog/docs/collapsible/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Collapsible } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CollapsibleDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Collapsible title="Sharing settings">
        Everyone in the workspace can view this page. Only editors can change it.
      </Collapsible>
    </div>
  );
}
```

### Outline

A 1px hairline gives the surface an edge on a canvas background.

`src/ui/catalog/docs/collapsible/outline.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Collapsible } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CollapsibleOutline() {
  return (
    <div {...stylex.props(s.root)}>
      <Collapsible variant="outline" title="Release notes" headingLevel={3}>
        Faster project search, a new archive view, and fixes for invoice exports.
      </Collapsible>
    </div>
  );
}
```

### Plain

No surface: an inline text trigger with the panel straight below it.

`src/ui/catalog/docs/collapsible/plain.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Collapsible } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CollapsiblePlain() {
  return (
    <div {...stylex.props(s.root)}>
      <Collapsible variant="plain" title="Why was this deploy skipped?">
        No files changed since the last successful deploy, so the previous build was reused.
      </Collapsible>
    </div>
  );
}
```

### Open by default

Set `defaultExpanded` to start open and let the trigger take over.

`src/ui/catalog/docs/collapsible/default-expanded.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Collapsible } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CollapsibleDefaultExpanded() {
  return (
    <div {...stylex.props(s.root)}>
      <Collapsible title="Billing contact" defaultExpanded>
        Invoices go to Maya. Change the contact from the Billing page.
      </Collapsible>
    </div>
  );
}
```

### Controlled

Drive the panel from your own state with `isExpanded` and `onExpandedChange`.

`src/ui/catalog/docs/collapsible/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Collapsible } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'start', gap: t['--os-space-3'], width: 360, maxWidth: '100%' },
  full: { justifySelf: 'stretch' },
});

export default function CollapsibleControlled() {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <div {...stylex.props(s.root)}>
      <Button appearance="tertiary" size="sm" onClick={() => setExpanded(!isExpanded)}>
        {isExpanded ? 'Hide build details' : 'Show build details'}
      </Button>
      <div {...stylex.props(s.full)}>
        <Collapsible title="Build details" isExpanded={isExpanded} onExpandedChange={setExpanded}>
          Built in 48 seconds from the main branch. 214 files were uploaded.
        </Collapsible>
      </div>
    </div>
  );
}
```

### Disabled

A disabled trigger keeps its place but cannot be opened.

`src/ui/catalog/docs/collapsible/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Collapsible } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CollapsibleDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Collapsible title="Audit log" isDisabled>
        Every change to members, roles and billing from the last 90 days.
      </Collapsible>
    </div>
  );
}
```

### Custom trigger

Pass `trigger` to lay out the trigger yourself. A function receives the expanded state.

`src/ui/catalog/docs/collapsible/custom-trigger.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Badge, Collapsible, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
  trigger: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], width: '100%' },
  label: { flexGrow: 1 },
});

export default function CollapsibleCustomTrigger() {
  return (
    <div {...stylex.props(s.root)}>
      <Collapsible
        trigger={({ isExpanded }) => (
          <span {...stylex.props(s.trigger)}>
            <Icon name="file" size={16} />
            <span {...stylex.props(s.label)}>Attachments</span>
            <Badge variant="secondary" size="sm">{isExpanded ? 'Hide' : '3 files'}</Badge>
          </span>
        )}
      >
        brief-final.pdf, moodboard.png and budget-q3.csv
      </Collapsible>
    </div>
  );
}
```
