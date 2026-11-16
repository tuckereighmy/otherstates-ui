# Frame

Give a group of related elements a visible boundary.

Category: Layout · Exports: `Frame`, `FramePanel`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Frame } from '@/ui/components';

<Frame label="Build log">
  Deployed to production in 42 seconds.
</Frame>
```

## Frame

A bg-subtle tray with an optional header bar, one or more surface panels and an optional footer bar.

Extends: <section> attributes (without `title`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | A short caption at the start of the header bar, in 12/16 `fg-muted`. |
| `title` | `ReactNode` |  | The frame title, rendered as a heading in the header bar. |
| `description` | `ReactNode` |  | A line of supporting text under the title, in 13/18 `fg-muted`. |
| `actions` | `ReactNode` |  | Controls at the end of the header bar. |
| `footer` | `ReactNode` |  | A muted bar under the panels. |
| `variant` | `'filled' \| 'outline'` | `'filled'` | `filled` is the bare tray; `outline` adds a 1px `border-subtle` hairline. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3` | The heading element used for `title`. |
| `children` | `ReactNode` |  | The content of a single panel, or several `FramePanel` elements. |

## FramePanel

One bg-surface panel inside a Frame, radius 8 by the nesting rule. Use several as direct children to separate them.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The panel content, padded 16 px. |

## Accessibility

- Renders a `<section>` with no landmark role of its own. Give it an `aria-label` only if it should appear as a region.
- The `title` is a real heading. Set `headingLevel` so it fits the page outline.
- `label` is plain text. Use `title` when the caption should be part of the heading outline.
- Separate panels are read in source order. Start a panel with its own heading when it needs a name of its own.

## Examples

### Default

`src/ui/catalog/docs/frame/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Frame } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FrameDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Frame label="Build log">
        Deployed to production in 42 seconds. Three warnings were reported
        during the build.
      </Frame>
    </div>
  );
}
```

### Title and description

A heading, a line of help and actions at the end of the header bar.

`src/ui/catalog/docs/frame/title-and-description.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Frame, Icon } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 400, maxWidth: '100%' },
  row: { display: 'flex', justifyContent: 'space-between', gap: tokens['--os-space-2'] },
  label: { color: tokens['--os-color-fg-muted'] },
  value: { fontVariantNumeric: 'tabular-nums' },
});

export default function FrameTitleAndDescription() {
  return (
    <div {...stylex.props(s.root)}>
      <Frame
        title="Usage this month"
        description="Resets on the first of each month"
        actions={
          <Button size="sm" appearance="text" leadingIcon={<Icon name="download" />}>
            Export
          </Button>
        }
      >
        <div {...stylex.props(s.row)}>
          <span {...stylex.props(s.label)}>Build minutes</span>
          <span {...stylex.props(s.value)}>1,284 of 3,000</span>
        </div>
      </Frame>
    </div>
  );
}
```

### Separated panels

Several `FramePanel` children sit 8 px apart on one tray.

`src/ui/catalog/docs/frame/separated-panels.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Frame, FramePanel } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const environments = [
  { name: 'Production', detail: 'Deployed 2 hours ago by Priya' },
  { name: 'Staging', detail: 'Deployed 25 minutes ago by Tomas' },
  { name: 'Preview', detail: 'Four open branches' },
];

const s = stylex.create({
  root: { width: 400, maxWidth: '100%' },
  name: { fontWeight: tokens['--os-font-weight-medium'] },
  detail: { color: tokens['--os-color-fg-muted'] },
});

export default function FrameSeparatedPanels() {
  return (
    <div {...stylex.props(s.root)}>
      <Frame title="Environments">
        {environments.map(environment => (
          <FramePanel key={environment.name}>
            <div {...stylex.props(s.name)}>{environment.name}</div>
            <div {...stylex.props(s.detail)}>{environment.detail}</div>
          </FramePanel>
        ))}
      </Frame>
    </div>
  );
}
```

### With footer

A muted bar under the panel for meta such as the last edit.

`src/ui/catalog/docs/frame/with-footer.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Frame } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FrameWithFooter() {
  return (
    <div {...stylex.props(s.root)}>
      <Frame label="Meeting notes" footer="Edited 4 minutes ago by Lena">
        Agreed to move the launch review to Thursday and share the draft
        timeline with the support team first.
      </Frame>
    </div>
  );
}
```

### Outline

`variant="outline"` adds a 1 px hairline around the tray. Insets and radii stay the same.

`src/ui/catalog/docs/frame/outline.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Frame } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FrameOutline() {
  return (
    <div {...stylex.props(s.root)}>
      <Frame variant="outline" label="Backup schedule">
        A full backup runs every night at 02:00 and is kept for 14 days.
      </Frame>
    </div>
  );
}
```
