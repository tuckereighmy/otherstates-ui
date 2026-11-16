# Spinner

Show that work is underway.

Category: Feedback · Exports: `Spinner`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Spinner } from '@/ui/components';

<Spinner label="Syncing files" />
```

## Spinner

A ring with a turning arc, and optional text beside it.

Extends: <span> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | Visible text beside the ring. It also names the status for assistive tech. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'md'` | A ring of 16, 24 or 32 px; the stroke is 2 px, and 2.5 px at `lg`. `small`, `medium` and `large` are aliases. |
| `tone` | `'default' \| 'muted' \| 'current'` | `'default'` | The arc color: the accent, secondary text, or the surrounding text color. |

## Accessibility

- With `label` or `aria-label`, the spinner renders `role="status"`, so screen readers announce it without moving focus.
- Without either, it is hidden from assistive tech. Use that only where the surrounding control already says it is busy, such as a button with `aria-disabled` and a visible label.
- The arc turns once every 800 ms. With reduced motion it stops and shows a still three-quarter ring.
- The track and arc are decorative; the label carries the meaning.

## Examples

### Default

`src/ui/catalog/docs/spinner/default.tsx`

```tsx
import { Spinner } from '../../../components';

export default function SpinnerDefault() {
  return <Spinner aria-label="Loading projects" />;
}
```

### With label

`label` shows text beside the ring and names the status for assistive tech.

`src/ui/catalog/docs/spinner/with-label.tsx`

```tsx
import { Spinner } from '../../../components';

export default function SpinnerWithLabel() {
  return <Spinner label="Syncing files" />;
}
```

### Sizes

Rings of 16, 24 and 32 px. `md` is the default.

`src/ui/catalog/docs/spinner/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Spinner } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-6'] },
});

export default function SpinnerSizes() {
  return (
    <div {...stylex.props(s.row)}>
      <Spinner size="sm" aria-label="Loading" />
      <Spinner size="md" aria-label="Loading" />
      <Spinner size="lg" aria-label="Loading" />
    </div>
  );
}
```

### Tones

`default` draws the arc in the accent, `muted` in secondary text, and `current` follows the color around it.

`src/ui/catalog/docs/spinner/tones.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Spinner } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', justifyItems: 'start', gap: tokens['--os-space-4'] },
  info: { color: tokens['--os-color-fg-info'] },
});

export default function SpinnerTones() {
  return (
    <div {...stylex.props(s.column)}>
      <Spinner size="sm" label="Building preview" />
      <Spinner size="sm" tone="muted" label="Waiting for a runner" />
      <span {...stylex.props(s.info)}>
        <Spinner size="sm" tone="current" label="Importing contacts" />
      </span>
    </div>
  );
}
```

### In an input group

A small muted spinner in the trailing addon while a value is checked. InputGroup's `isLoading` does the same for you.

`src/ui/catalog/docs/spinner/input-group.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Input, InputGroup, InputGroupAddon, Spinner } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function SpinnerInputGroup() {
  return (
    <div {...stylex.props(s.root)}>
      <InputGroup>
        <Input defaultValue="maple-studio" aria-label="Workspace address" />
        <InputGroupAddon align="end">
          <Spinner size="sm" tone="muted" aria-label="Checking the address" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
```

### In a button

With `tone="current"`, a spinner in the leading slot takes the button's text color. Button's `isLoading` replaces the label instead.

`src/ui/catalog/docs/spinner/button.tsx`

```tsx
import { Button, Spinner } from '../../../components';

export default function SpinnerInButton() {
  return (
    <Button appearance="secondary" aria-disabled leadingIcon={<Spinner size="sm" tone="current" />}>
      Generating report
    </Button>
  );
}
```
