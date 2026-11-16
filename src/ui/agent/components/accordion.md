# Accordion

Reveal related sections one at a time.

Category: Layout · Exports: `Accordion`, `AccordionGroup`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Accordion, AccordionGroup } from '@/ui/components';

<AccordionGroup defaultExpandedKeys={['access']}>
  <Accordion id="access" title="Who can see a workspace?">
    Only the people you invite.
  </Accordion>
  <Accordion id="roles" title="Can roles be changed later?">
    Owners and admins can change any role.
  </Accordion>
</AccordionGroup>
```

## AccordionGroup

Holds the items and decides which are open. One at a time unless `allowsMultipleExpanded` is set.

Extends: React Aria DisclosureGroupProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `allowsMultipleExpanded` | `boolean` | `false` | Lets more than one item be open at a time. |
| `expandedKeys` | `Iterable<Key>` |  | The ids of the open items (controlled). |
| `defaultExpandedKeys` | `Iterable<Key>` |  | The ids of the items open at first (uncontrolled). |
| `onExpandedChange` | `(keys: Set<Key>) => void` |  | Called with the new set of open ids. |
| `isDisabled` | `boolean` | `false` | Disables every item. |
| `appearance` | `'list' \| 'card'` | `'list'` | The default `appearance` of every item. |
| `icon` | `'plus' \| 'chevron'` | `'plus'` | The default `icon` of every item. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3` | The default heading level of every trigger. |
| `ref` | `Ref<HTMLDivElement>` |  | The group element. |

## Accordion

One item with a title and an answer, the common case. A string answer arrives word by word as the item opens.

Extends: React Aria DisclosureProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `ReactNode` |  | The question or section name in the trigger. It stays on one line and truncates. |
| `children` (required) | `ReactNode` |  | The answer, set in 14/20 `fg-muted`. |

## AccordionItem

One item for custom content. Put an `AccordionTrigger` and an `AccordionPanel` inside it.

Extends: React Aria DisclosureProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` |  | An `AccordionTrigger` followed by an `AccordionPanel`. |

## AccordionTrigger

The heading and button that open an item.

Extends: <h3> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` |  | The trigger’s label. |
| `icon` | `'plus' \| 'chevron'` |  | Overrides the item’s icon. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` |  | Overrides the item’s heading level. |

## AccordionPanel

The content of an item. Its height animates as the item opens and closes.

Extends: React Aria DisclosurePanelProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` |  | The panel content, set in 14/20 `fg-muted`. |
| `className` | `string` |  | Added to the panel element. |

## Accessibility

- Each trigger is a `button` inside a heading (h3 by default), with `aria-expanded` and `aria-controls` pointing at its panel.
- Tab moves between triggers; Enter and Space open and close the focused item. Disabled items are skipped.
- Choose `headingLevel` so the triggers fit the page’s heading outline.
- Panels have the `group` role and are hidden from assistive technology while closed.
- With reduced motion the panel, icon and word reveal change instantly.

## Examples

### Default

`src/ui/catalog/docs/accordion/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Accordion, AccordionGroup } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function AccordionDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <AccordionGroup defaultExpandedKeys={['access']}>
        <Accordion id="access" title="Who can see a workspace?">
          Only the people you invite. Guests see just the projects you share.
        </Accordion>
        <Accordion id="roles" title="Can roles be changed later?">
          Owners and admins can change any role from the Members page.
        </Accordion>
        <Accordion id="archive" title="Where do archived files go?">
          They move to the Archive, stay searchable, and can be restored.
        </Accordion>
        <Accordion id="export" title="How do I export my data?">
          Request an export in Settings and a download link arrives by email.
        </Accordion>
      </AccordionGroup>
    </div>
  );
}
```

### Multiple

Set `allowsMultipleExpanded` to let several items stay open at once.

`src/ui/catalog/docs/accordion/multiple.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Accordion, AccordionGroup } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function AccordionMultiple() {
  return (
    <div {...stylex.props(s.root)}>
      <AccordionGroup allowsMultipleExpanded defaultExpandedKeys={['trial', 'seats']}>
        <Accordion id="trial" title="How long is the trial?">
          Fourteen days with every feature. No card is needed to start.
        </Accordion>
        <Accordion id="seats" title="Do guests count as seats?">
          No. Guests are free and can be invited to as many projects as you like.
        </Accordion>
        <Accordion id="cancel" title="Can I cancel at any time?">
          Yes. Your plan stays active until the end of the billing period.
        </Accordion>
      </AccordionGroup>
    </div>
  );
}
```

### Controlled

Hold the open items in state with `expandedKeys` and `onExpandedChange`.

`src/ui/catalog/docs/accordion/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Accordion, AccordionGroup, Button } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sections = ['schedule', 'alerts', 'retention'];

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 360, maxWidth: '100%' },
  actions: { display: 'flex', gap: t['--os-space-2'] },
});

export default function AccordionControlled() {
  const [expandedKeys, setExpandedKeys] = useState(new Set<string | number>(['schedule']));

  return (
    <div {...stylex.props(s.root)}>
      <div {...stylex.props(s.actions)}>
        <Button appearance="tertiary" size="sm" onClick={() => setExpandedKeys(new Set(sections))}>Expand all</Button>
        <Button appearance="tertiary" size="sm" onClick={() => setExpandedKeys(new Set())}>Collapse all</Button>
      </div>
      <AccordionGroup allowsMultipleExpanded expandedKeys={expandedKeys} onExpandedChange={setExpandedKeys}>
        <Accordion id="schedule" title="Backup schedule">Every night at 02:00 in the workspace time zone.</Accordion>
        <Accordion id="alerts" title="Failure alerts">Owners get an email when a backup fails twice in a row.</Accordion>
        <Accordion id="retention" title="Retention">Daily backups are kept for 30 days, monthly ones for a year.</Accordion>
      </AccordionGroup>
    </div>
  );
}
```

### Cards

With `appearance="card"` each item sits on its own surface.

`src/ui/catalog/docs/accordion/card.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Accordion, AccordionGroup } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function AccordionCard() {
  return (
    <div {...stylex.props(s.root)}>
      <AccordionGroup appearance="card" defaultExpandedKeys={['domain']}>
        <Accordion id="domain" title="Connect a custom domain">
          Add a CNAME record that points to your project, then verify it here.
        </Accordion>
        <Accordion id="ssl" title="Certificates">
          Certificates are issued and renewed for every verified domain.
        </Accordion>
        <Accordion id="redirects" title="Redirects">
          Send old paths to new ones with permanent or temporary redirects.
        </Accordion>
      </AccordionGroup>
    </div>
  );
}
```

### Chevron icon

Use `icon="chevron"` for settings-style sections.

`src/ui/catalog/docs/accordion/chevron.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Accordion, AccordionGroup } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function AccordionChevron() {
  return (
    <div {...stylex.props(s.root)}>
      <AccordionGroup icon="chevron">
        <Accordion id="profile" title="Profile">Name, photo and the time zone shown to teammates.</Accordion>
        <Accordion id="notifications" title="Notifications">Choose which updates reach you by email.</Accordion>
        <Accordion id="security" title="Security">Passkeys, sessions and two-step sign-in.</Accordion>
      </AccordionGroup>
    </div>
  );
}
```

### Disabled item

A disabled item keeps its place in the list but cannot be opened.

`src/ui/catalog/docs/accordion/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Accordion, AccordionGroup } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function AccordionDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <AccordionGroup>
        <Accordion id="usage" title="Usage this month">1,240 build minutes of the 3,000 included.</Accordion>
        <Accordion id="invoices" title="Invoices">Download any invoice from the last two years.</Accordion>
        <Accordion id="tax" title="Tax details" isDisabled>Only owners can view tax details.</Accordion>
      </AccordionGroup>
    </div>
  );
}
```

### Custom content

Compose items from `AccordionItem`, `AccordionTrigger` and `AccordionPanel` to put any content in the trigger and panel.

`src/ui/catalog/docs/accordion/custom-content.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { AccordionGroup, AccordionItem, AccordionPanel, AccordionTrigger, Badge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
  trigger: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'] },
  list: { margin: 0, paddingInlineStart: t['--os-space-5'], listStyleType: 'disc' },
});

export default function AccordionCustomContent() {
  return (
    <div {...stylex.props(s.root)}>
      <AccordionGroup headingLevel={2} defaultExpandedKeys={['review']}>
        <AccordionItem id="review">
          <AccordionTrigger>
            <span {...stylex.props(s.trigger)}>In review <Badge variant="secondary" size="sm">3</Badge></span>
          </AccordionTrigger>
          <AccordionPanel>
            <ul {...stylex.props(s.list)}>
              <li>Pricing page copy</li>
              <li>Onboarding checklist</li>
              <li>Invoice email template</li>
            </ul>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem id="done">
          <AccordionTrigger>
            <span {...stylex.props(s.trigger)}>Done <Badge variant="secondary" size="sm">12</Badge></span>
          </AccordionTrigger>
          <AccordionPanel>Twelve tasks were closed this week.</AccordionPanel>
        </AccordionItem>
      </AccordionGroup>
    </div>
  );
}
```
