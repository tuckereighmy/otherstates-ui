# Switch

Turn a setting on or off immediately.

Category: Forms · Exports: `Switch`, `StretchSwitch`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Switch } from '@/ui/components';

<Switch label="Notifications" />
```

## Switch

A labeled switch row. It also takes React Aria's `isSelected`, `defaultSelected`, `onChange`, `value`, `name`, `form`, `isDisabled`, `isReadOnly`, `isRequired`, `isInvalid`, `validate`, `inputRef` and `autoFocus`.

Extends: React Aria SwitchFieldProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | The visible label. Without one, pass `aria-label`. |
| `description` | `ReactNode` |  | Help text under the label. The error message replaces it while the switch is invalid. |
| `errorMessage` | `ReactNode \| ((validation: ValidationResult) => ReactNode)` |  | Shown under the row while the switch is invalid. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'md'` | Compact tracks of 32 x 20, 40 x 24 or 48 x 28 px; rows stay 32 px tall. For `stretch`, see StretchSwitch. |
| `variant` | `'default' \| 'card' \| 'row'` | `'default'` | `card` puts the row in a bordered tile with the switch at the end; `row` puts it at the end of a full-width row with no tile, for settings lists. Compact only. |
| `appearance` | `'compact' \| 'stretch'` | `'compact'` | `stretch` renders StretchSwitch. |
| `hideLabel` | `boolean` | `false` | Hides the label visually and keeps it as the accessible name. |
| `speed` | `number` | `50` | Stretch appearance only: spring speed, 0 to 100. |
| `stretch` | `number` | `36` | Stretch appearance only: how far the thumb stretches with velocity, 0 to 100. |
| `className` | `string` |  | Added to the outermost element. |
| `style` | `CSSProperties` |  | Inline styles for the outermost element. |
| `ref` | `Ref<HTMLDivElement>` |  | The outermost element. Use `inputRef` for the input. |
| `error` | `ReactNode` |  | Deprecated: use `isInvalid` with `errorMessage`. Setting it also marks the switch invalid. |
| `checked` | `boolean` |  | Deprecated alias of `isSelected`. |
| `defaultChecked` | `boolean` |  | Deprecated alias of `defaultSelected`. |
| `disabled` | `boolean` |  | Deprecated alias of `isDisabled`. |
| `readOnly` | `boolean` |  | Deprecated alias of `isReadOnly`. |
| `required` | `boolean` |  | Deprecated alias of `isRequired`. |

## StretchSwitch

The switch whose thumb stretches with its velocity. `Switch appearance="stretch"` renders it.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | The visible label. Without one, pass `aria-label`. |
| `description` | `ReactNode` |  | Help text under the label. The error message replaces it while the switch is invalid. |
| `errorMessage` | `ReactNode \| ((validation: ValidationResult) => ReactNode)` |  | Shown under the row while the switch is invalid. A required switch shows the browser message on submit without it. |
| `isSelected` | `boolean` |  | Whether the switch is on (controlled). |
| `defaultSelected` | `boolean` | `false` | Whether the switch starts on (uncontrolled). |
| `onChange` | `(isSelected: boolean) => void` |  | Called when the switch turns on or off. |
| `name` | `string` |  | Submits the switch with its form under this name. |
| `value` | `string` | `'on'` | The value submitted when the switch is on. |
| `form` | `string` |  | The id of a `<form>` to submit with. |
| `id` | `string` |  | The id of the switch button. Generated when omitted. |
| `isDisabled` | `boolean` | `false` | Fades the track (a composite visual) and turns the label `fg-disabled`. |
| `isReadOnly` | `boolean` | `false` | Keeps the switch focusable but stops it changing; sets `aria-readonly`. |
| `isRequired` | `boolean` | `false` | Requires the switch to be on to submit the form. |
| `isInvalid` | `boolean` |  | Draws the `border-error` ring and shows `errorMessage`. |
| `autoFocus` | `boolean` |  | Focuses the switch on mount. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'lg'` | `sm` 64 x 32, `md` 80 x 40, `lg` 96 x 48 (the default), on the control heights. |
| `hideLabel` | `boolean` | `false` | Hides the label visually and keeps it as the accessible name. |
| `speed` | `number` | `50` | Spring speed, 0 to 100. |
| `stretch` | `number` | `36` | How far the thumb stretches with velocity, 0 to 100. |
| `aria-label` | `string` |  | The accessible name when there is no visible label. |
| `aria-describedby` | `string` |  | Extra ids that describe the switch. |
| `onFocus` | `(event: FocusEvent<HTMLButtonElement>) => void` |  | Called when the switch takes focus. |
| `onBlur` | `(event: FocusEvent<HTMLButtonElement>) => void` |  | Called when the switch loses focus. |
| `className` | `string` |  | Added to the outermost element. |
| `style` | `CSSProperties` |  | Inline styles for the outermost element. |
| `ref` | `Ref<HTMLDivElement>` |  | The outermost element. |
| `error` | `ReactNode` |  | Deprecated: use `isInvalid` with `errorMessage`. |
| `checked` | `boolean` |  | Deprecated alias of `isSelected`. |
| `defaultChecked` | `boolean` |  | Deprecated alias of `defaultSelected`. |
| `disabled` | `boolean` |  | Deprecated alias of `isDisabled`. |
| `readOnly` | `boolean` |  | Deprecated alias of `isReadOnly`. |
| `required` | `boolean` |  | Deprecated alias of `isRequired`. |

## Accessibility

- The compact switch is a native checkbox with `role="switch"` inside a `label`; the stretch switch is a `button` with `role="switch"` and `aria-checked`.
- Space toggles the focused switch, and Enter toggles the stretch one. The 2 px focus ring shows only for keyboard focus.
- The description and the error message are linked with `aria-describedby`; the error replaces the description.
- A switch without a visible label needs `aria-label`. `hideLabel` keeps the label for assistive technology.
- Under reduced motion the thumb moves without travel, stretch or press scale.

## Examples

### Default

`src/ui/catalog/docs/switch/default.tsx`

```tsx
import { Switch } from '../../../components';

export default function SwitchDefault() {
  return <Switch label="Notifications" />;
}
```

### With description

Help text sits under the label in `fg-muted`.

`src/ui/catalog/docs/switch/with-description.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Switch } from '../../../components';

const s = stylex.create({
  root: { width: 340, maxWidth: '100%' },
});

export default function SwitchWithDescription() {
  return (
    <div {...stylex.props(s.root)}>
      <Switch
        label="Auto-merge"
        description="Merge pull requests once every check passes."
        defaultSelected
      />
    </div>
  );
}
```

### Sizes

Tracks of 32 x 20, 40 x 24 and 48 x 28 px with 13, 14 and 15 px labels. Every size keeps the 32 px row.

`src/ui/catalog/docs/switch/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Switch } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-1'] },
});

export default function SwitchSizes() {
  return (
    <div {...stylex.props(s.column)}>
      <Switch size="sm" label="Small" defaultSelected />
      <Switch size="md" label="Medium" defaultSelected />
      <Switch size="lg" label="Large" defaultSelected />
    </div>
  );
}
```

### Disabled

The track, thumb and label swap to the disabled tokens; nothing fades.

`src/ui/catalog/docs/switch/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Switch } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-1'] },
});

export default function SwitchDisabled() {
  return (
    <div {...stylex.props(s.column)}>
      <Switch label="Maintenance mode" isDisabled />
      <Switch label="Encrypted backups" isDisabled defaultSelected />
    </div>
  );
}
```

### Read-only

The state shows and stays focusable but cannot change.

`src/ui/catalog/docs/switch/read-only.tsx`

```tsx
import { Switch } from '../../../components';

export default function SwitchReadOnly() {
  return <Switch label="Audit logging" description="Required on the scale plan." isReadOnly defaultSelected />;
}
```

### Invalid

The track takes a `border-error` ring and the message sits under the label.

`src/ui/catalog/docs/switch/invalid.tsx`

```tsx
import { Switch } from '../../../components';

export default function SwitchInvalid() {
  return (
    <Switch
      label="Allow production deploys"
      isRequired
      isInvalid
      errorMessage="Turn this on to finish the release."
    />
  );
}
```

### Card

`variant="card"` puts the row in a bordered tile with the switch at the end, settings-style.

`src/ui/catalog/docs/switch/card.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Switch } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-2'], width: 380, maxWidth: '100%' },
});

export default function SwitchCard() {
  return (
    <div {...stylex.props(s.column)}>
      <Switch
        variant="card"
        label="Branch protection"
        description="Require a review before changes reach the main branch."
        defaultSelected
      />
      <Switch
        variant="card"
        label="Weekly digest"
        description="A summary of activity every Monday morning."
      />
    </div>
  );
}
```

### Settings rows

`variant="row"` puts the switch at the end of a full-width row with no tile. Stack rows in a list and divide them with hairlines, as on a settings page.

`src/ui/catalog/docs/switch/settings-rows.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Switch } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  list: { display: 'grid', width: 440, maxWidth: '100%' },
  // 16 above and below each row's text, a hairline between rows and none outside the list.
  row: {
    paddingBlockStart: { default: t['--os-space-4'], ':first-child': 0 },
    paddingBlockEnd: { default: t['--os-space-4'], ':last-child': 0 },
    borderTopWidth: { default: 1, ':first-child': 0 },
    borderTopStyle: 'solid',
    borderTopColor: t['--os-color-border-subtle'],
  },
});

const row = stylex.props(s.row).className;

export default function SwitchSettingsRows() {
  return (
    <div {...stylex.props(s.list)}>
      <Switch variant="row" className={row} label="Mentions" description="When someone mentions you in a comment." defaultSelected />
      <Switch variant="row" className={row} label="Due date reminders" description="A day before something you own is due." defaultSelected />
      <Switch variant="row" className={row} label="Weekly summary" description="Monday morning: what moved last week." />
    </div>
  );
}
```

### Controlled

Drive the state with `isSelected` and `onChange`.

`src/ui/catalog/docs/switch/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Switch } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: tokens['--os-space-2'] },
  status: {
    margin: 0,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

export default function SwitchControlled() {
  const [paused, setPaused] = useState(false);

  return (
    <div {...stylex.props(s.column)}>
      <Switch label="Pause deployments" isSelected={paused} onChange={setPaused} />
      <p {...stylex.props(s.status)}>{paused ? 'New commits wait in the queue.' : 'Every commit deploys.'}</p>
    </div>
  );
}
```

### Form integration

A switch that is on submits its `value` under its `name`; one that is off submits nothing.

`src/ui/catalog/docs/switch/form-integration.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Form, FormActions, Switch } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 320, maxWidth: '100%' },
  choices: { display: 'grid', gap: tokens['--os-space-1'] },
  status: {
    margin: 0,
    minHeight: 20,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

export default function SwitchFormIntegration() {
  const [saved, setSaved] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSaved(`Saved. Previews ${data.get('previews') ? 'on' : 'off'}, comments ${data.get('comments') ? 'on' : 'off'}.`);
        }}
      >
        <div {...stylex.props(s.choices)}>
          <Switch name="previews" value="enabled" label="Preview deployments" defaultSelected />
          <Switch name="comments" value="enabled" label="Comments on previews" />
        </div>
        <FormActions>
          <Button type="submit">Save settings</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{saved}</p>
    </div>
  );
}
```

### Stretch

`appearance="stretch"` is the 96 x 48 switch whose thumb stretches with its real velocity. Drag it or press Space.

`src/ui/catalog/docs/switch/stretch.tsx`

```tsx
import { Switch } from '../../../components';

export default function SwitchStretch() {
  return <Switch appearance="stretch" label="Focus mode" defaultSelected />;
}
```

### Stretch sizes

The stretch switch at `sm` 64 x 32 and `md` 80 x 40; without a size it is `lg`, 96 x 48. Every size pads its thumb 4 px.

`src/ui/catalog/docs/switch/stretch-sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Switch } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', justifyItems: 'start', gap: t['--os-space-3'] },
});

export default function SwitchStretchSizes() {
  return (
    <div {...stylex.props(s.column)}>
      <Switch appearance="stretch" size="sm" label="Small" defaultSelected />
      <Switch appearance="stretch" size="md" label="Medium" defaultSelected />
      <Switch appearance="stretch" label="Large, the default" defaultSelected />
    </div>
  );
}
```
