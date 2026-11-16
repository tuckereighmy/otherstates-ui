# Toolbar

Group frequent actions in a keyboard-friendly row.

Category: Navigation · Exports: `Toolbar`, `ToolbarGroup`, `ToolbarButton`, `ToolbarToggleButton`, `ToolbarLink`, `ToolbarSeparator`, `ToolPalette`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Icon, Toolbar, ToolbarButton, ToolbarSeparator } from '@/ui/components';

<Toolbar aria-label="Document">
  <ToolbarButton aria-label="Undo">
    <Icon name="undo" size={16} />
  </ToolbarButton>
  <ToolbarSeparator />
  <ToolbarButton>Share</ToolbarButton>
</Toolbar>
```

## Toolbar

A raised group shell that holds tools and moves focus between them with the arrow keys.

Extends: React Aria ToolbarProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Height of the tools inside on the control scale. `small`, `medium` and `large` are accepted as aliases. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The direction of the tools and of arrow-key navigation. |
| `className` | `string` |  | A class added to the toolbar element. |

## ToolbarButton

A tool that runs an action. Set `aria-pressed` for a toggle you manage yourself.

Extends: React Aria ButtonProps

## ToolbarToggleButton

A tool that stays on or off, drawn as a toggled object when on.

Extends: React Aria ToggleButtonProps

## ToolbarLink

A tool that navigates. With `aria-current` it is drawn as the current location.

Extends: React Aria LinkProps

## ToolbarGroup

A `role="group"` run of tools inside the toolbar. Name it with `aria-label`.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` |  | Overrides the direction inherited from the toolbar. |

## ToolbarSeparator

A hairline between runs of tools. It turns horizontal in a vertical toolbar.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` |  | Overrides the direction, which defaults to across the toolbar. |
| `className` | `string` |  | A class added to the separator. |
| `style` | `CSSProperties` |  | Inline styles merged after the computed length. |

## ToolPalette

A composed tool rail for a drawing canvas with a flyout of shapes.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `PaletteTool` |  | The active tool (controlled). |
| `defaultValue` | `PaletteTool` | `'move'` | The tool active at first (uncontrolled). |
| `onChange` | `(tool: PaletteTool) => void` |  | Called with the tool the user picks. |
| `label` | `string` | `'Canvas tools'` | Names the toolbar for assistive tech. |
| `className` | `string` |  | A class added to the rail. |
| `style` | `CSSProperties` |  | Inline styles on the rail. |

## Accessibility

- Renders `role="toolbar"`: Tab moves focus into the toolbar and out again, and the arrow keys move between tools.
- Name the toolbar and each `ToolbarGroup` with `aria-label`, and give every icon-only tool an `aria-label`.
- Toggle tools expose `aria-pressed`; a `ToolbarLink` with `aria-current` announces the current location.
- Separators are exposed as `role="separator"` with the right orientation.
- In ToolPalette the corner button is its own tool named "More shapes", so the flyout opens from the keyboard too.

## Examples

### Default

`src/ui/catalog/docs/toolbar/default.tsx`

```tsx
import { Icon, Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from '../../../components';

export default function ToolbarDefault() {
  return (
    <Toolbar aria-label="Document">
      <ToolbarGroup aria-label="History">
        <ToolbarButton aria-label="Undo"><Icon name="undo" size={16} /></ToolbarButton>
        <ToolbarButton aria-label="Redo"><Icon name="redo" size={16} /></ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="Insert">
        <ToolbarButton aria-label="Attach file"><Icon name="paperclip" size={16} /></ToolbarButton>
        <ToolbarButton aria-label="Insert image"><Icon name="image" size={16} /></ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton>Share</ToolbarButton>
    </Toolbar>
  );
}
```

### With toggle buttons

`ToolbarToggleButton` stays on or off and fills when it is on; plain `ToolbarButton`s run an action.

`src/ui/catalog/docs/toolbar/with-toggle-buttons.tsx`

```tsx
import { Icon, Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarToggleButton } from '../../../components';

export default function ToolbarWithToggleButtons() {
  return (
    <Toolbar aria-label="Formatting">
      <ToolbarGroup aria-label="Text style">
        <ToolbarToggleButton aria-label="Bold" defaultSelected><Icon name="bold" size={16} /></ToolbarToggleButton>
        <ToolbarToggleButton aria-label="Italic"><Icon name="italic" size={16} /></ToolbarToggleButton>
        <ToolbarToggleButton aria-label="Underline"><Icon name="underline" size={16} /></ToolbarToggleButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Insert link"><Icon name="link" size={16} /></ToolbarButton>
      <ToolbarButton aria-label="Insert code block"><Icon name="code" size={16} /></ToolbarButton>
    </Toolbar>
  );
}
```

### With links

`ToolbarLink` navigates. With `aria-current` it is drawn as the current location.

`src/ui/catalog/docs/toolbar/with-link.tsx`

```tsx
import { Icon, Toolbar, ToolbarLink, ToolbarSeparator } from '../../../components';

export default function ToolbarWithLink() {
  return (
    <Toolbar aria-label="Deployment">
      <ToolbarLink href="#" aria-current="page">Overview</ToolbarLink>
      <ToolbarLink href="#">Logs</ToolbarLink>
      <ToolbarLink href="#">Settings</ToolbarLink>
      <ToolbarSeparator />
      <ToolbarLink href="#" aria-label="Open preview"><Icon name="external-link" size={16} /></ToolbarLink>
    </Toolbar>
  );
}
```

### Sizes

`size` sets the height of every tool: `sm` 32, `md` 40 (the default) and `lg` 44.

`src/ui/catalog/docs/toolbar/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, Toolbar, ToolbarButton, ToolbarSeparator } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = [
  { size: 'sm', icon: 16 },
  { size: 'md', icon: 16 },
  { size: 'lg', icon: 18 },
] as const;

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

export default function ToolbarSizes() {
  return (
    <div {...stylex.props(s.stack)}>
      {sizes.map(({ size, icon }) => (
        <Toolbar key={size} size={size} aria-label={`Editing, ${size}`}>
          <ToolbarButton aria-label="Undo"><Icon name="undo" size={icon} /></ToolbarButton>
          <ToolbarButton aria-label="Redo"><Icon name="redo" size={icon} /></ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton>Comment</ToolbarButton>
        </Toolbar>
      ))}
    </div>
  );
}
```

### Vertical

With `orientation="vertical"` the tools stack, the separator turns horizontal and the arrow keys move up and down.

`src/ui/catalog/docs/toolbar/vertical.tsx`

```tsx
import { Icon, Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggleButton } from '../../../components';

export default function ToolbarVertical() {
  return (
    <Toolbar orientation="vertical" aria-label="View">
      <ToolbarToggleButton aria-label="Show sidebar" defaultSelected><Icon name="panel-left" size={16} /></ToolbarToggleButton>
      <ToolbarToggleButton aria-label="Show details"><Icon name="panel-right" size={16} /></ToolbarToggleButton>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Zoom in"><Icon name="plus" size={16} /></ToolbarButton>
      <ToolbarButton aria-label="Zoom out"><Icon name="minus" size={16} /></ToolbarButton>
    </Toolbar>
  );
}
```

### Disabled

A disabled tool keeps its place, takes the disabled text color and is skipped by the arrow keys.

`src/ui/catalog/docs/toolbar/disabled.tsx`

```tsx
import { Icon, Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from '../../../components';

export default function ToolbarDisabled() {
  return (
    <Toolbar aria-label="Invoice">
      <ToolbarGroup aria-label="History">
        <ToolbarButton aria-label="Undo" isDisabled><Icon name="undo" size={16} /></ToolbarButton>
        <ToolbarButton aria-label="Redo" isDisabled><Icon name="redo" size={16} /></ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Download"><Icon name="download" size={16} /></ToolbarButton>
      <ToolbarButton isDisabled>Send</ToolbarButton>
    </Toolbar>
  );
}
```

### Tool palette

A composed tool rail for a drawing canvas. The corner of the shape tool opens more shapes.

`src/ui/catalog/docs/toolbar/tool-palette.tsx`

```tsx
import { ToolPalette } from '../../../components';

export default function ToolbarToolPalette() {
  return <ToolPalette />;
}
```
