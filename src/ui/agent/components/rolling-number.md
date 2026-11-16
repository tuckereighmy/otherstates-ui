# Rolling number

Show a figure that counts its way to a new value.

Category: Agents · Exports: `RollingNumber`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { RollingNumber } from '@/ui/components';

<RollingNumber value="$1.62" />
```

## RollingNumber

A figure that counts to its new value.

Extends: <span> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `string` |  | The figure as it should read: "175.6k", "$1.62", "74%". |
| `direction` | `'up' \| 'down'` |  | Deprecated, no effect: the figure counts toward its new value. |
| `stagger` | `number` |  | Deprecated, no effect. |

## Accessibility

- The final value is read as one piece of visually hidden text; the counting figure is hidden from assistive tech, so only the value it lands on is announced.
- Put it inside a live region (or one you already have) when a change should be announced.
- The count takes `--os-motion-layout` on `--os-ease-settle`, read from the theme. Under reduced motion the figure swaps without counting.

## Examples

### Default

`src/ui/catalog/docs/rolling-number/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, formatCost, RollingNumber } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-4'] },
  figure: { fontSize: t['--os-font-size-2xl'], fontWeight: t['--os-font-weight-medium'], letterSpacing: '-0.02em' },
});

export default function RollingNumberDefault() {
  const [cost, setCost] = useState(1.62);
  return (
    <div {...stylex.props(s.row)}>
      <RollingNumber value={formatCost(cost)} {...stylex.props(s.figure)} />
      <Button size="sm" appearance="secondary" onClick={() => setCost(value => value + 0.37)}>Add a step</Button>
      <Button size="sm" appearance="text" onClick={() => setCost(1.62)}>Reset</Button>
    </div>
  );
}
```

### When the unit changes

The number counts while the words around it stay the same (24.4k to 102.6k to 980k). When they change (980k to 1.3M), the figure swaps at once, since counting across units would show values that never existed.

`src/ui/catalog/docs/rolling-number/units.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, formatTokens, RollingNumber } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-4'] },
  figure: { fontSize: t['--os-font-size-xl'], fontWeight: t['--os-font-weight-medium'], letterSpacing: '-0.02em' },
});

const steps = [24400, 102600, 980000, 1300000];

export default function RollingNumberUnits() {
  const [step, setStep] = useState(0);
  return (
    <div {...stylex.props(s.row)}>
      <RollingNumber value={formatTokens(steps[step])} {...stylex.props(s.figure)} />
      <Button size="sm" appearance="secondary" onClick={() => setStep(value => (value + 1) % steps.length)}>Next</Button>
    </div>
  );
}
```
