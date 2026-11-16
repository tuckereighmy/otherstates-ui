# Kbd

Display the keys for a shortcut.

Category: Navigation · Exports: `Kbd`, `KbdGroup`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Kbd, KbdGroup } from '@/ui/components';

<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
```

## Kbd

One keycap: a `<kbd>` on a muted fill with a soft edge, in 12/16 Inter.

Extends: <kbd> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'small' \| 'medium'` | `'md'` | 20 or 24 px tall. Inside a `KbdGroup` with a size, the group's size is the default. `small` and `medium` are aliases. |

## KbdGroup

A key combination: a `<kbd>` that holds `Kbd` keys in a row.

Extends: <kbd> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'small' \| 'medium'` |  | The size of every `Kbd` inside that sets none. |

## Accessibility

- Renders `<kbd>`, which marks keyboard input. A `KbdGroup` nests the keys in an outer `<kbd>`, the HTML pattern for a key combination.
- Kbd is not interactive and takes no focus.
- Symbols such as ⌘ and ⌥ are read differently by each screen reader. Spell out keys where you can, or say the shortcut in visible text nearby.
- A shortcut hint does not create the shortcut: register the key handler yourself, and keep a visible control for the same action.

## Examples

### Default

`src/ui/catalog/docs/kbd/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Kbd } from '../../../components';

const s = stylex.create({
  text: { margin: 0 },
});

export default function KbdDefault() {
  return (
    <p {...stylex.props(s.text)}>
      Press <Kbd>Esc</Kbd> to close the panel.
    </p>
  );
}
```

### Key combination

`KbdGroup` holds the keys of one shortcut, 4px apart. Text between keys, such as "+", is muted.

`src/ui/catalog/docs/kbd/group.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Kbd, KbdGroup } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', justifyItems: 'center', gap: t['--os-space-3'] },
});

export default function KbdGroupExample() {
  return (
    <div {...stylex.props(s.column)}>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>+<Kbd>Shift</Kbd>+<Kbd>P</Kbd>
      </KbdGroup>
    </div>
  );
}
```

### Sizes

`sm` is 20px, for menus and command footers; `md` is 24px. A size on the group reaches every key in it.

`src/ui/catalog/docs/kbd/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Kbd, KbdGroup } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-6'] },
});

export default function KbdSizes() {
  return (
    <div {...stylex.props(s.row)}>
      <KbdGroup size="sm">
        <Kbd>Shift</Kbd>
        <Kbd>Enter</Kbd>
      </KbdGroup>
      <KbdGroup size="md">
        <Kbd>Shift</Kbd>
        <Kbd>Enter</Kbd>
      </KbdGroup>
    </div>
  );
}
```

### In an input group

A shortcut hint at the end of a search field.

`src/ui/catalog/docs/kbd/input-group.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, Input, InputGroup, InputGroupAddon, Kbd, KbdGroup } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function KbdInputGroup() {
  return (
    <div {...stylex.props(s.root)}>
      <InputGroup>
        <InputGroupAddon>
          <Icon name="search" size={16} />
        </InputGroupAddon>
        <Input type="search" placeholder="Search notes" aria-label="Search notes" />
        <InputGroupAddon align="end">
          <KbdGroup size="sm">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
```
