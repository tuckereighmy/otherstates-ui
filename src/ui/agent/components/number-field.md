# Number Field

Type a number, or step it with the buttons, the arrow keys or a drag.

Category: Forms · Exports: `NumberField`, `ScrubStepper`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { NumberField } from '@/ui/components';

<NumberField label="Quantity" defaultValue={1} minValue={0} />
```

## NumberField

A labeled numeric input with decrement and increment buttons.

Extends: React Aria NumberFieldProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | The visible label. Omit it inside a `Field`, which supplies the label. |
| `description` | `ReactNode` |  | Help text under the field. The error message replaces it while the field is invalid. |
| `errorMessage` | `ReactNode \| ((validation: ValidationResult) => ReactNode)` |  | Shown under the field while it is invalid. |
| `error` | `ReactNode` |  | Deprecated. Use `isInvalid` with `errorMessage`. Setting it also marks the field invalid. |
| `size` | `undefined` | `'md'` | Height and type of the field. `small`, `medium` and `large` are aliases of `sm`, `md` and `lg`. |
| `scrub` | `boolean` | `false` | Drag the label horizontally to change the value. |
| `hideStepper` | `boolean` | `false` | Hides the decrement and increment buttons. The arrow keys still step. |
| `className` | `string` |  | A class for the outer element. |
| `style` | `CSSProperties` |  | Inline styles for the outer element. |
| `ref` | `Ref<HTMLDivElement>` |  | The outer element. |

## ScrubStepper

A stepper rail in the shared control shape (a pill by default): tap a side for one step, or hold a side and drag to sweep the range.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Names the control. Visually hidden unless `hideLabel` is false. |
| `value` | `number` |  | The value (controlled). |
| `defaultValue` | `number` | `24` | The starting value when uncontrolled. |
| `onChange` | `(value: number) => void` |  | Fires on every change, including each value passed during a sweep. |
| `onCommit` | `(value: number) => void` |  | Fires once per step, and once when a sweep is released. |
| `min` | `number` | `0` | The smallest value. |
| `max` | `number` | `100` | The largest value. |
| `step` | `number` | `1` | How far one tap or arrow key moves the value. |
| `size` | `'sm' \| 'md' \| 'small' \| 'medium'` | `'md'` | `md` is the 48px rail (control xl); `sm` is the 32px row. |
| `isDisabled` | `boolean` | `false` | Disables the buttons, gestures and keys. |
| `disabled` | `boolean` |  | Deprecated. Use `isDisabled`. |
| `isReadOnly` | `boolean` | `false` | Shows the value but hides the buttons and ignores gestures and keys. |
| `isInvalid` | `boolean` | `false` | Draws the invalid ring and links `errorMessage`. |
| `errorMessage` | `ReactNode` |  | Shown under the rail while `isInvalid` is set. |
| `hideLabel` | `boolean` | `true` | Hides the label visually. It still names the control. |
| `name` | `string` |  | Submits the value with a form under this name. |
| `form` | `string` |  | The id of the form the value belongs to. |
| `id` | `string` |  | The id of the spin button. |
| `className` | `string` |  | A class for the outer element. |
| `style` | `CSSProperties` |  | Inline styles for the outer element. |
| `ref` | `Ref<HTMLDivElement>` |  | The outer element. |

## Accessibility

- Arrow Up and Arrow Down step the value, Page Up and Page Down step further, and Home and End jump to `minValue` and `maxValue`.
- The steppers are labeled buttons that Tab skips, so keyboard users stay in the input.
- Give every field a `label`, a surrounding `Field`, or an `aria-label`.
- The error message replaces the help text and is linked to the input with `aria-describedby`.
- ScrubStepper is a `spinbutton` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`. Escape during a sweep restores the starting value.
- Under reduced motion, ScrubStepper drops its tilt and sweep scale.

## Examples

### Default

`src/ui/catalog/docs/number-field/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField label="Quantity" defaultValue={1} minValue={0} />
    </div>
  );
}
```

### Sizes

Five heights from the control scale. `md`, 40px, is the default.

`src/ui/catalog/docs/number-field/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 240, maxWidth: '100%' },
});

const sizes = [
  { size: 'xs', label: 'Extra small' },
  { size: 'sm', label: 'Small' },
  { size: 'md', label: 'Medium' },
  { size: 'lg', label: 'Large' },
  { size: 'xl', label: 'Extra large' },
] as const;

export default function NumberFieldSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, label }) => (
        <NumberField key={size} size={size} label={label} defaultValue={4} minValue={0} />
      ))}
    </div>
  );
}
```

### Disabled

`isDisabled` grays the label, the value and the steppers.

`src/ui/catalog/docs/number-field/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField label="Seats" defaultValue={5} isDisabled />
    </div>
  );
}
```

### With external label

Inside a `Field`, the field supplies the label and the help text.

`src/ui/catalog/docs/number-field/with-external-label.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldWithExternalLabel() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Retention period" description="Days to keep deleted projects.">
        <NumberField defaultValue={30} minValue={1} maxValue={90} />
      </Field>
    </div>
  );
}
```

### With scrub

Set `scrub` to change the value by dragging the label.

`src/ui/catalog/docs/number-field/with-scrub.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldWithScrub() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField
        label="Corner radius"
        description="Drag the label left or right."
        defaultValue={12}
        minValue={0}
        maxValue={48}
        scrub
      />
    </div>
  );
}
```

### With range

`minValue` and `maxValue` bound typing, stepping and the arrow keys.

`src/ui/catalog/docs/number-field/with-range.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldWithRange() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField
        label="Team size"
        description="From 1 to 12 people."
        defaultValue={4}
        minValue={1}
        maxValue={12}
      />
    </div>
  );
}
```

### With formatted value

`formatOptions` shows the value as a currency, a percentage or a unit.

`src/ui/catalog/docs/number-field/with-formatted-value.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 240, maxWidth: '100%' },
});

export default function NumberFieldWithFormattedValue() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField
        label="Hourly rate"
        defaultValue={85}
        minValue={0}
        formatOptions={{ style: 'currency', currency: 'EUR' }}
      />
      <NumberField
        label="Discount"
        defaultValue={0.15}
        minValue={0}
        maxValue={1}
        step={0.05}
        formatOptions={{ style: 'percent' }}
      />
    </div>
  );
}
```

### With step

`step` sets how far each press and arrow key moves the value.

`src/ui/catalog/docs/number-field/with-step.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldWithStep() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField
        label="Reminder"
        description="Minutes before the meeting, in steps of 5."
        defaultValue={15}
        minValue={0}
        maxValue={120}
        step={5}
      />
    </div>
  );
}
```

### Invalid

`isInvalid` draws the error edge, and `errorMessage` replaces the help text.

`src/ui/catalog/docs/number-field/invalid.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField
        label="Licenses"
        description="Seats you pay for each month."
        defaultValue={12}
        isInvalid
        errorMessage="Your plan includes up to 10 licenses."
      />
    </div>
  );
}
```

### Read-only

`isReadOnly` keeps the value selectable and hides the steppers.

`src/ui/catalog/docs/number-field/read-only.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField
        label="Invoice number"
        defaultValue={1042}
        formatOptions={{ useGrouping: false }}
        isReadOnly
      />
    </div>
  );
}
```

### Without steppers

`hideStepper` leaves a plain numeric input. The arrow keys still step.

`src/ui/catalog/docs/number-field/without-stepper.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldWithoutStepper() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField
        label="Fiscal year"
        defaultValue={2026}
        formatOptions={{ useGrouping: false }}
        hideStepper
      />
    </div>
  );
}
```

### Controlled

Pass `value` and `onChange` to own the value.

`src/ui/catalog/docs/number-field/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, NumberField } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', alignItems: 'flex-end', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
});

export default function NumberFieldControlled() {
  const [copies, setCopies] = useState(1);

  return (
    <div {...stylex.props(s.root)}>
      <NumberField label="Copies" value={copies} onChange={setCopies} minValue={1} maxValue={99} />
      <Button appearance="tertiary" onClick={() => setCopies(1)}>
        Reset
      </Button>
    </div>
  );
}
```

### Form integration

`name` submits the number with the form, and `isRequired` blocks an empty submit.

`src/ui/catalog/docs/number-field/form-integration.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Form, NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function NumberFieldFormIntegration() {
  const [saved, setSaved] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSaved(String(new FormData(event.currentTarget).get('seats')));
        }}
      >
        <NumberField
          label="Seats"
          name="seats"
          description={saved ? `Plan updated to ${saved} seats.` : 'Between 1 and 50.'}
          defaultValue={5}
          minValue={1}
          maxValue={50}
          isRequired
        />
        <Button type="submit">Update plan</Button>
      </Form>
    </div>
  );
}
```

### Scrub stepper

Tap a side for one step, or hold a side and drag to sweep the range.

`src/ui/catalog/docs/number-field/scrub-stepper.tsx`

```tsx
import { ScrubStepper } from '../../../components';

export default function NumberFieldScrubStepper() {
  return <ScrubStepper label="Quantity" defaultValue={24} />;
}
```

### Scrub stepper states

The 32px size, read-only and invalid.

`src/ui/catalog/docs/number-field/scrub-stepper-states.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ScrubStepper } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-6'] },
});

export default function NumberFieldScrubStepperStates() {
  return (
    <div {...stylex.props(s.root)}>
      <ScrubStepper label="Copies" hideLabel={false} size="sm" defaultValue={2} min={1} />
      <ScrubStepper label="Seats" hideLabel={false} defaultValue={12} isReadOnly />
      <ScrubStepper
        label="Guests"
        hideLabel={false}
        defaultValue={0}
        isInvalid
        errorMessage="Add at least one guest."
      />
    </div>
  );
}
```
