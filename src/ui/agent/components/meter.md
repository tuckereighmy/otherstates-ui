# Meter

Show a measurement against a known limit.

Category: Feedback · Exports: `Meter`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Meter } from '@/ui/components';

<Meter label="Storage used" value={72} />
```

## Meter

A label, a value and a track filled to the value.

Extends: React Aria MeterProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Names the measurement. Shown above the track unless `hideLabel` is set; it names the meter either way. |
| `hideLabel` | `boolean` | `false` | Hides the label visually. |
| `showValue` | `boolean` | `true` | Shows the value text at the end of the header. |
| `valueLabel` | `ReactNode` |  | Replaces the formatted value, for example "36 of 50 GB". A string is also read out by screen readers. |
| `tone` | `'accent' \| 'success' \| 'warning' \| 'error'` | `'accent'` | The fill color. Pick a status tone for meaning, not decoration. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'md'` | Track height: 4, 6 or 8 px. |
| `className` | `string` |  | A class for the outer element. |

## Accessibility

- Renders `role="meter"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and a formatted `aria-valuetext`.
- The label names the meter through `aria-label`, so a hidden label still reaches screen readers.
- A string `valueLabel` becomes the `aria-valuetext`.
- Use a meter for a measurement within a known range; use Progress for a task moving toward completion.
- Under reduced motion, the fill changes without a transition.

## Examples

### Default

`src/ui/catalog/docs/meter/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Meter } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function MeterDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Meter label="Storage used" value={72} />
    </div>
  );
}
```

### Without label and value

`hideLabel` and `showValue={false}` leave the track. The label still names the meter.

`src/ui/catalog/docs/meter/without-label-and-value.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Meter } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function MeterWithoutLabelAndValue() {
  return (
    <div {...stylex.props(s.root)}>
      <Meter label="Storage used" value={72} hideLabel showValue={false} />
    </div>
  );
}
```

### With formatted value

`formatOptions` formats the value text, here as a currency.

`src/ui/catalog/docs/meter/formatted-value.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Meter } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function MeterFormattedValue() {
  return (
    <div {...stylex.props(s.root)}>
      <Meter
        label="Monthly budget"
        value={1240}
        maxValue={2000}
        formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
      />
    </div>
  );
}
```

### With range

`minValue` and `maxValue` set the scale. The value text stays a percentage by default.

`src/ui/catalog/docs/meter/with-range.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Meter } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function MeterWithRange() {
  return (
    <div {...stylex.props(s.root)}>
      <Meter label="Seats in use" value={7} minValue={0} maxValue={10} />
    </div>
  );
}
```

### Custom value label

`valueLabel` replaces the value text, for screen readers too.

`src/ui/catalog/docs/meter/value-label.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Meter } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function MeterValueLabel() {
  return (
    <div {...stylex.props(s.root)}>
      <Meter label="Storage used" value={36} maxValue={50} valueLabel="36 of 50 GB" />
    </div>
  );
}
```

### Tones

Status tones for measurements that carry meaning.

`src/ui/catalog/docs/meter/tones.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Meter } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-5'], width: 300, maxWidth: '100%' },
});

export default function MeterTones() {
  return (
    <div {...stylex.props(s.root)}>
      <Meter label="Uptime this month" value={99} tone="success" />
      <Meter label="API quota" value={84} tone="warning" />
      <Meter label="Disk space" value={96} tone="error" />
    </div>
  );
}
```

### Sizes

Track heights of 4, 6 and 8 px.

`src/ui/catalog/docs/meter/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Meter } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-5'], width: 300, maxWidth: '100%' },
});

export default function MeterSizes() {
  return (
    <div {...stylex.props(s.root)}>
      <Meter label="Small" size="sm" value={40} />
      <Meter label="Medium" value={60} />
      <Meter label="Large" size="lg" value={80} />
    </div>
  );
}
```
