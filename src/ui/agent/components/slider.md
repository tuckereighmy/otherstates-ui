# Slider

Pick a value, or a range of values, along a track.

Category: Forms · Exports: `Slider`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Slider } from '@/ui/components';

<Slider label="Volume" defaultValue={40} />
```

## Slider

A labeled track with one thumb, or two for a range.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the slider. Omit it inside a `Field`, which supplies the label. |
| `value` | `number \| [number, number]` |  | The value (controlled). Pass a `[start, end]` pair for a range slider. |
| `defaultValue` | `number \| [number, number]` |  | The starting value when uncontrolled. |
| `onChange` | `(value: T) => void` |  | Fires on every change while dragging or stepping. |
| `onChangeEnd` | `(value: T) => void` |  | Fires once a drag or key press ends. |
| `minValue` | `number` | `0` | The smallest value. |
| `maxValue` | `number` | `100` | The largest value. |
| `step` | `number` | `1` | The distance between selectable values. |
| `formatOptions` | `Intl.NumberFormatOptions` |  | Formats the value text, for example as a percentage or a currency. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The direction of the rail. `ticks` is always horizontal. |
| `appearance` | `'rail' \| 'ticks'` | `'rail'` | `rail` is the form slider. `ticks` is the bar field with a ripple on drag. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'md'` | Rail thickness, knob and hit band. `ticks` is always a 48 px bar field. |
| `isDisabled` | `boolean` | `false` | Disables the thumbs and swaps the slider to the disabled colors. |
| `disabled` | `boolean` |  | Deprecated. Use `isDisabled`. |
| `hideLabel` | `boolean` | `false` | Hides the label row visually. The label still names the slider. |
| `showValue` | `boolean` | `true` | Shows the formatted value. |
| `description` | `ReactNode` |  | Help text under the slider. |
| `marks` | `Array<number \| { value: number; label?: ReactNode }>` |  | Labeled stops under the rail, at their values. |
| `name` | `string` |  | Submits the value with a form under this name. A range submits two values under the same name. |
| `form` | `string` |  | The id of the form the value belongs to. |
| `thumbLabels` | `[string, string]` | `['Minimum', 'Maximum']` | Accessible names of the two thumbs of a range. |
| `bars` | `number` | `36` | `ticks` only: how many bars to draw, from 12 to 64. |
| `ripple` | `number` | `60` | `ticks` only: how strongly a fast drag lifts the bars it passes. 0 turns the ripple off. |
| `id` | `string` |  | The id of the slider group. |
| `aria-label` | `string` |  | Names the slider when there is no visible label. |
| `aria-labelledby` | `string` |  | Ids of the elements that name the slider. |
| `aria-describedby` | `string` |  | Ids of extra elements that describe the slider. |
| `className` | `string` |  | A class for the outer element. |
| `style` | `CSSProperties` |  | Inline styles for the outer element. |
| `ref` | `Ref<HTMLDivElement>` |  | The outer element. |

## Accessibility

- Each thumb is a native range input: Arrow keys move one `step`, Page Up and Page Down move further, Home and End jump to the ends.
- The label names the slider group and every thumb. The thumbs of a range are named by `thumbLabels`.
- The value text uses `formatOptions`, so screen readers hear "80%" or "$200" rather than a bare number.
- Without a visible label, pass `aria-label`, or place the slider in a `Field`.
- Under reduced motion, the knob does not scale when pressed and the `ticks` ripple is off.

## Examples

### Default

`src/ui/catalog/docs/slider/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider label="Volume" defaultValue={40} />
    </div>
  );
}
```

### Sizes

Three rail sizes: the knob, the rail and the hit band grow together.

`src/ui/catalog/docs/slider/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-5'], width: 280, maxWidth: '100%' },
});

export default function SliderSizes() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider label="Small" size="sm" defaultValue={30} />
      <Slider label="Medium" defaultValue={50} />
      <Slider label="Large" size="lg" defaultValue={70} />
    </div>
  );
}
```

### Without label and value

Name the slider with `aria-label` and set `showValue` to false for a bare track.

`src/ui/catalog/docs/slider/without-label-and-value.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderWithoutLabelAndValue() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider aria-label="Zoom" defaultValue={60} showValue={false} />
    </div>
  );
}
```

### Range

A `[start, end]` value gives two thumbs that cannot cross.

`src/ui/catalog/docs/slider/range.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderRange() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider
        label="Budget"
        defaultValue={[200, 800]}
        maxValue={1000}
        step={10}
        formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
      />
    </div>
  );
}
```

### Vertical

`orientation="vertical"` stands the rail up. Set the height with `style` or `className`.

`src/ui/catalog/docs/slider/vertical.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', gap: t['--os-space-8'] },
});

export default function SliderVertical() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider label="Bass" orientation="vertical" defaultValue={60} />
      <Slider label="Mid" orientation="vertical" defaultValue={45} />
      <Slider label="Treble" orientation="vertical" defaultValue={70} />
    </div>
  );
}
```

### Formatted value

`formatOptions` formats the value text, here as a percentage.

`src/ui/catalog/docs/slider/formatted-value.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderFormattedValue() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider
        label="Opacity"
        defaultValue={0.8}
        maxValue={1}
        step={0.01}
        formatOptions={{ style: 'percent' }}
      />
    </div>
  );
}
```

### With marks

`marks` labels stops under the rail.

`src/ui/catalog/docs/slider/with-marks.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderWithMarks() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider
        label="Priority"
        defaultValue={50}
        step={50}
        showValue={false}
        marks={[
          { value: 0, label: 'Low' },
          { value: 50, label: 'Normal' },
          { value: 100, label: 'High' },
        ]}
      />
    </div>
  );
}
```

### Disabled

`isDisabled` swaps the rail, knob and label to the disabled colors.

`src/ui/catalog/docs/slider/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider label="Brightness" defaultValue={70} isDisabled />
    </div>
  );
}
```

### Controlled

`onChange` fires while dragging; `onChangeEnd` fires once the drag ends.

`src/ui/catalog/docs/slider/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderControlled() {
  const [seconds, setSeconds] = useState(30);
  const [saved, setSaved] = useState(30);

  return (
    <div {...stylex.props(s.root)}>
      <Slider
        label="Autosave every"
        value={seconds}
        onChange={value => typeof value === 'number' && setSeconds(value)}
        onChangeEnd={value => typeof value === 'number' && setSaved(value)}
        minValue={5}
        maxValue={120}
        step={5}
        formatOptions={{ style: 'unit', unit: 'second' }}
        description={`Saved setting: ${saved} seconds.`}
      />
    </div>
  );
}
```

### Form integration

`name` submits the value with the form.

`src/ui/catalog/docs/slider/form-integration.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Form, Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderFormIntegration() {
  const [submitted, setSubmitted] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSubmitted(String(new FormData(event.currentTarget).get('retention')));
        }}
      >
        <Slider
          label="Log retention"
          name="retention"
          defaultValue={30}
          minValue={7}
          maxValue={90}
          formatOptions={{ style: 'unit', unit: 'day', unitDisplay: 'long' }}
          description={submitted ? `Saved: ${submitted} days.` : 'How long to keep deployment logs.'}
        />
        <Button type="submit">Save</Button>
      </Form>
    </div>
  );
}
```

### Ticks

The bar field: filled bars show the value, and a fast drag lifts the bars it passes.

`src/ui/catalog/docs/slider/ticks.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function SliderTicks() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider label="Volume" hideLabel appearance="ticks" defaultValue={50} />
    </div>
  );
}
```
