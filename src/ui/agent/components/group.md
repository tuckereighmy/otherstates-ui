# Group

Visually join a set of related controls.

Category: Layout · Exports: `Group`, `GroupSeparator`, `GroupText`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Button, Group } from '@/ui/components';

<Group aria-label="Edit history">
  <Button appearance="text">Undo</Button>
  <Button appearance="text">Redo</Button>
</Group>
```

## Group

A raised shell (bg-surface, `shadow-control`, radius 16, padding 6, gap 2) around related controls.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The direction the controls run in. |
| `variant` | `'raised' \| 'flush' \| 'outline'` | `'raised'` | `raised` draws the shell; `flush` drops it, for a group inside another. `outline` is a deprecated alias of `raised`. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | The size of the controls inside, so `GroupText` and `GroupSeparator` match them. `small`, `medium` and `large` are aliases. |
| `children` | `ReactNode` |  | Buttons, fields, triggers, `GroupText`, `GroupSeparator` or flush groups. |

## GroupSeparator

A `border-muted` hairline between sets of controls. It runs across the group, at half the control height.

Extends: <div> attributes

## GroupText

Static text inside a group, such as a leading label, a unit or a count. It takes the height, padding and type of the group size.

Extends: <span> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `htmlFor` | `string` |  | Renders a `<label>` for this control id, so the text names the field beside it. |
| `ref` | `Ref<HTMLElement>` |  | The rendered `<span>` or `<label>`. |

## Accessibility

- Renders `role="group"`. Name it with `aria-label` or `aria-labelledby`, so screen readers announce what the controls are for.
- Group only joins controls visually: each one keeps its own Tab stop and keyboard behavior. For one choice among options, use ToggleGroup, which adds selection semantics and arrow-key movement.
- A field inside a group still needs a name: an `aria-label`, or a `GroupText` with `htmlFor`.
- `GroupSeparator` renders `role="separator"` with the orientation across the group.
- Icon-only buttons need an `aria-label`.

## Examples

### Default

`src/ui/catalog/docs/group/default.tsx`

```tsx
import { Button, Group, Icon } from '../../../components';

export default function GroupDefault() {
  return (
    <Group aria-label="Edit history">
      <Button appearance="text" leadingIcon={<Icon name="undo" />}>
        Undo
      </Button>
      <Button appearance="text" leadingIcon={<Icon name="redo" />}>
        Redo
      </Button>
    </Group>
  );
}
```

### With input

A field and its action in one shell. Every control keeps the shared control radius and the shell adds its 6 px padding, so the corners stay concentric: pills inside a pill by default, 10 inside 16 on the Standard corners.

`src/ui/catalog/docs/group/with-input.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Group, Input } from '../../../components';

const s = stylex.create({
  group: { width: 380, maxWidth: '100%' },
  input: { flexGrow: 1, flexBasis: 160, minWidth: 0 },
});

export default function GroupWithInput() {
  return (
    <Group aria-label="Invite by email" {...stylex.props(s.group)}>
      <Input
        type="email"
        aria-label="Email address"
        placeholder="name@example.com"
        {...stylex.props(s.input)}
      />
      <Button>Send invite</Button>
    </Group>
  );
}
```

### Sizes

Match `size` to the controls inside, so `GroupText` and `GroupSeparator` take their height.

`src/ui/catalog/docs/group/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Group, GroupText, Icon } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const sizes = ['sm', 'md', 'lg'] as const;

const s = stylex.create({
  root: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: tokens['--os-space-4'] },
});

export default function GroupSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(size => (
        <Group key={size} size={size} aria-label={`Zoom, size ${size}`}>
          <Button size={size} appearance="text" iconOnly aria-label="Zoom out">
            <Icon name="minus" />
          </Button>
          <GroupText>100%</GroupText>
          <Button size={size} appearance="text" iconOnly aria-label="Zoom in">
            <Icon name="plus" />
          </Button>
        </Group>
      ))}
    </div>
  );
}
```

### With disabled button

A disabled control keeps its place; only its colors change.

`src/ui/catalog/docs/group/with-disabled-button.tsx`

```tsx
import { Button, Group, Icon } from '../../../components';

export default function GroupWithDisabledButton() {
  return (
    <Group aria-label="Pages">
      <Button appearance="text" isDisabled leadingIcon={<Icon name="chevron-left" />}>
        Previous
      </Button>
      <Button appearance="text" trailingIcon={<Icon name="chevron-right" />}>
        Next
      </Button>
    </Group>
  );
}
```

### With filled buttons

Buttons keep their own appearance inside the shell.

`src/ui/catalog/docs/group/with-filled-buttons.tsx`

```tsx
import { Button, Group } from '../../../components';

export default function GroupWithFilledButtons() {
  return (
    <Group aria-label="Draft">
      <Button appearance="secondary">Save draft</Button>
      <Button>Publish</Button>
    </Group>
  );
}
```

### With start text

`GroupText` with `htmlFor` renders a label that names the field beside it.

`src/ui/catalog/docs/group/with-start-text.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';
import { Button, Group, GroupText, Icon, Input } from '../../../components';

const s = stylex.create({
  group: { width: 400, maxWidth: '100%' },
  input: { flexGrow: 1, flexBasis: 140, minWidth: 0 },
});

export default function GroupWithStartText() {
  const id = useId();

  return (
    <Group aria-label="Share link" {...stylex.props(s.group)}>
      <GroupText htmlFor={id}>Link</GroupText>
      <Input id={id} isReadOnly defaultValue="example.com/p/8f2k" {...stylex.props(s.input)} />
      <Button appearance="secondary" leadingIcon={<Icon name="copy" />}>
        Copy
      </Button>
    </Group>
  );
}
```

### With end text

A unit after the value.

`src/ui/catalog/docs/group/with-end-text.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Group, GroupText, Input } from '../../../components';

const s = stylex.create({
  group: { width: 220, maxWidth: '100%' },
  input: { flexGrow: 1, flexBasis: 80, minWidth: 0 },
});

export default function GroupWithEndText() {
  return (
    <Group aria-label="Storage limit" {...stylex.props(s.group)}>
      <Input
        type="number"
        aria-label="Storage limit in gigabytes"
        defaultValue={50}
        min={1}
        {...stylex.props(s.input)}
      />
      <GroupText>GB</GroupText>
    </Group>
  );
}
```

### Vertical

With `orientation="vertical"` the controls stack and `GroupSeparator` turns horizontal.

`src/ui/catalog/docs/group/vertical.tsx`

```tsx
import { Button, Group, GroupSeparator, Icon } from '../../../components';

export default function GroupVertical() {
  return (
    <Group orientation="vertical" aria-label="Zoom">
      <Button appearance="text" iconOnly aria-label="Zoom in">
        <Icon name="plus" />
      </Button>
      <Button appearance="text" iconOnly aria-label="Zoom out">
        <Icon name="minus" />
      </Button>
      <GroupSeparator />
      <Button appearance="text" iconOnly aria-label="Fit to screen">
        <Icon name="maximize" />
      </Button>
    </Group>
  );
}
```

### Nested groups

Inner groups use `variant="flush"`, so only the outer shell is drawn.

`src/ui/catalog/docs/group/nested-groups.tsx`

```tsx
import { Button, Group, GroupSeparator, Icon, type IconName } from '../../../components';

const styles: { icon: IconName; label: string }[] = [
  { icon: 'bold', label: 'Bold' },
  { icon: 'italic', label: 'Italic' },
  { icon: 'underline', label: 'Underline' },
];

const alignments: { icon: IconName; label: string }[] = [
  { icon: 'align-left', label: 'Align left' },
  { icon: 'align-center', label: 'Align center' },
  { icon: 'align-right', label: 'Align right' },
];

function Tools({ label, tools }: { label: string; tools: typeof styles }) {
  return (
    <Group variant="flush" size="sm" aria-label={label}>
      {tools.map(tool => (
        <Button key={tool.icon} size="sm" appearance="text" iconOnly aria-label={tool.label}>
          <Icon name={tool.icon} />
        </Button>
      ))}
    </Group>
  );
}

export default function GroupNested() {
  return (
    <Group size="sm" aria-label="Formatting">
      <Tools label="Text style" tools={styles} />
      <GroupSeparator />
      <Tools label="Alignment" tools={alignments} />
    </Group>
  );
}
```

### With popup

A popover trigger can sit in a group like any other button.

`src/ui/catalog/docs/group/with-popup.tsx`

```tsx
'use client';

import { Button, Group, OverlayButton, Popover } from '../../../components';

export default function GroupWithPopup() {
  return (
    <Group aria-label="Post">
      <Button appearance="tertiary">Preview</Button>
      <Popover
        trigger={<OverlayButton>Schedule</OverlayButton>}
        title="Schedule post"
        description="It goes live for everyone in the workspace."
        placement="bottom end"
      >
        {close => (
          <Button size="sm" onClick={close}>
            Tomorrow at 9:00
          </Button>
        )}
      </Popover>
    </Group>
  );
}
```

### With input group

An `InputGroup` with a search icon, followed by its action.

`src/ui/catalog/docs/group/with-input-group.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Group, Icon, Input, InputGroup, InputGroupAddon } from '../../../components';

const s = stylex.create({
  group: { width: 400, maxWidth: '100%' },
  field: { flexGrow: 1, flexBasis: 180, minWidth: 0 },
});

export default function GroupWithInputGroup() {
  return (
    <Group aria-label="Search projects" {...stylex.props(s.group)}>
      <InputGroup {...stylex.props(s.field)}>
        <InputGroupAddon>
          <Icon name="search" />
        </InputGroupAddon>
        <Input type="search" aria-label="Search projects" placeholder="Search projects" />
      </InputGroup>
      <Button appearance="secondary">Search</Button>
    </Group>
  );
}
```

### With menu

A split button: the main action and a menu of the others.

`src/ui/catalog/docs/group/with-menu.tsx`

```tsx
import { Button, Group, Icon, Menu, MenuItem, OverlayButton } from '../../../components';

export default function GroupWithMenu() {
  return (
    <Group aria-label="Deploy">
      <Button appearance="tertiary">Deploy</Button>
      <Menu
        aria-label="More deploy options"
        placement="bottom end"
        trigger={
          <OverlayButton aria-label="More deploy options">
            <Icon name="chevron-down" size={16} />
          </OverlayButton>
        }
      >
        <MenuItem>Deploy to staging</MenuItem>
        <MenuItem>Deploy to a preview</MenuItem>
        <MenuItem>Schedule a deploy</MenuItem>
      </Menu>
    </Group>
  );
}
```

### With select

Pick an option, then act on it.

`src/ui/catalog/docs/group/with-select.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Group, Select } from '../../../components';

const environments = [
  { id: 'production', label: 'Production' },
  { id: 'staging', label: 'Staging' },
  { id: 'preview', label: 'Preview' },
];

const s = stylex.create({
  group: { width: 320, maxWidth: '100%' },
  select: { flexGrow: 1, flexBasis: 160, minWidth: 0 },
});

export default function GroupWithSelect() {
  return (
    <Group aria-label="Open an environment" {...stylex.props(s.group)}>
      <Select
        appearance="field"
        label="Environment"
        hideLabel
        options={environments}
        defaultValue="staging"
        {...stylex.props(s.select)}
      />
      <Button appearance="tertiary">Open</Button>
    </Group>
  );
}
```
