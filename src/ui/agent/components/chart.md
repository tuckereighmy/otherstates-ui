# Chart

Show values over time or across categories, with a readout on hover and focus.

Category: Feedback · Exports: `LineChart`, `BarChart`, `Sparkline`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { LineChart } from '@/ui/components';

<LineChart
  aria-label="Visitors per month"
  area
  labels={['Jan', 'Feb', 'Mar']}
  series={[{ id: 'visitors', label: 'Visitors', values: [3120, 3410, 3290] }]}
/>
```

## LineChart

Lines through each series on a shared axis, with a crosshair readout. One series uses the accent; several take the chart colors.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` (required) | `string` |  | Names the chart for assistive technology and captions its data table. |
| `labels` (required) | `string[]` |  | One label per position along the x axis. Crowded labels thin out, keeping the latest. |
| `series` (required) | `ChartSeries[]` |  | The data. `{ id, label, values, color?, muted? }`. Values start from zero. |
| `area` | `boolean` | `false` | Washes the area under each lead line in its color, fading to nothing at the baseline. |
| `curve` | `'smooth' \| 'linear'` | `'smooth'` | `smooth` bends through every point without overshooting it. |
| `height` | `number` | `200` | Plot height in px, axes excluded. The width follows the container. |
| `formatValue` | `(value: number) => string` |  | Formats values in the readout and data table. Axis ticks turn compact past 10,000. |
| `hideLegend` | `boolean` | `false` | Hides the legend that shows for two or more series. Name the series elsewhere if you do. |
| `className` | `string` |  | A class for the outer element. |

## BarChart

Columns from a shared baseline: 24px wide at most, rounded at the data end, square at the baseline.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` (required) | `string` |  | Names the chart for assistive technology and captions its data table. |
| `labels` (required) | `string[]` |  | One label per bar or group. |
| `series` (required) | `ChartSeries[]` |  | The data, as for LineChart. |
| `stacked` | `boolean` | `false` | Stacks several series in one bar. Off, they stand side by side. |
| `highlight` | `number` |  | The index of a bar to lead with. The rest step back and its value prints on its cap. Single series only. |
| `height` | `number` | `200` | Plot height in px, axes excluded. |
| `formatValue` | `(value: number) => string` |  | Formats values in the readout, the cap label and the data table. |
| `hideLegend` | `boolean` | `false` | Hides the legend that shows for two or more series. |
| `className` | `string` |  | A class for the outer element. |

## Sparkline

A small trend line with no axes, for stat tiles.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `values` (required) | `number[]` |  | The trend, oldest first. Twelve points read best. |
| `aria-label` | `string` |  | States the trend. Without it the sparkline is decorative and hidden from assistive technology. |
| `height` | `number` | `32` | Height in px. The width follows the container. |
| `className` | `string` |  | A class for the outer element. |

## Accessibility

- The plot is one tab stop. The arrow keys move the readout point by point, Home and End jump to the ends and Escape clears it; each point is announced.
- The readout shows the same values on focus as on hover, and every value is also in a visually hidden data table captioned by `aria-label`.
- Identity never rests on color alone: two or more series get a legend, and a muted series is also dashed.
- The chart colors are a fixed order, checked as a set for color-vision deficiency in both modes. Text always uses text colors, never the series color.
- Under reduced motion, bars and lines appear without growing or fading in.

## Examples

### Default

`src/ui/catalog/docs/chart/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { LineChart } from '../../../components';

const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
const visitors = [3120, 3410, 3290, 3860, 4120, 3980, 4470, 4810, 4630, 5140, 5520, 5890];

const s = stylex.create({
  root: { width: 640, maxWidth: '100%' },
});

export default function ChartDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <LineChart aria-label="Visitors per month" area labels={months} series={[{ id: 'visitors', label: 'Visitors', values: visitors }]} />
    </div>
  );
}
```

### Comparison

A `muted` series draws the period before in gray and dashed, so the two read apart without color. The lead series keeps the accent.

`src/ui/catalog/docs/chart/comparison.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { LineChart } from '../../../components';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const s = stylex.create({
  root: { width: 640, maxWidth: '100%' },
});

export default function ChartComparison() {
  return (
    <div {...stylex.props(s.root)}>
      <LineChart
        aria-label="Orders, this week against last week"
        area
        labels={days}
        series={[
          { id: 'this-week', label: 'This week', values: [184, 212, 198, 241, 268, 152, 131] },
          { id: 'last-week', label: 'Last week', values: [171, 186, 190, 204, 236, 160, 118], muted: true },
        ]}
      />
    </div>
  );
}
```

### Multiple series

Two or more lead series take the chart colors in a fixed order and show a legend. Keep to five; fold the rest into "Other".

`src/ui/catalog/docs/chart/multiple-series.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { LineChart } from '../../../components';

const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

const s = stylex.create({
  root: { width: 640, maxWidth: '100%' },
});

export default function ChartMultipleSeries() {
  return (
    <div {...stylex.props(s.root)}>
      <LineChart
        aria-label="Sign-ups by channel"
        labels={months}
        series={[
          { id: 'search', label: 'Search', values: [420, 460, 445, 510, 560, 540, 610, 650, 640, 700, 760, 820] },
          { id: 'referral', label: 'Referral', values: [210, 240, 260, 250, 300, 330, 320, 360, 410, 430, 450, 500] },
          { id: 'social', label: 'Social', values: [160, 150, 190, 210, 200, 240, 260, 250, 230, 280, 300, 290] },
        ]}
      />
    </div>
  );
}
```

### Bar chart

`highlight` leads with one bar, usually the current period: the rest step back and its value prints on its cap. `formatValue` formats the readout and data table.

`src/ui/catalog/docs/chart/bar-chart.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { BarChart } from '../../../components';

const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const s = stylex.create({
  root: { width: 640, maxWidth: '100%' },
});

export default function ChartBar() {
  return (
    <div {...stylex.props(s.root)}>
      <BarChart
        aria-label="Revenue per month"
        labels={months}
        highlight={months.length - 1}
        formatValue={value => currency.format(value)}
        series={[{ id: 'revenue', label: 'Revenue', values: [18200, 19400, 17800, 21000, 22600, 21900, 24100, 25800, 24900, 27400, 28800, 31200] }]}
      />
    </div>
  );
}
```

### Stacked bars

`stacked` puts several series in one bar, cut apart by a 2px gap in the surface color. Only the top segment rounds.

`src/ui/catalog/docs/chart/stacked-bars.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { BarChart } from '../../../components';

const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

const s = stylex.create({
  root: { width: 640, maxWidth: '100%' },
});

export default function ChartStackedBars() {
  return (
    <div {...stylex.props(s.root)}>
      <BarChart
        aria-label="Tickets closed by priority"
        stacked
        labels={weeks}
        series={[
          { id: 'low', label: 'Low', values: [42, 38, 45, 51, 40, 47, 53, 49] },
          { id: 'medium', label: 'Medium', values: [28, 31, 26, 34, 37, 30, 35, 39] },
          { id: 'high', label: 'High', values: [9, 12, 8, 14, 11, 7, 10, 13] },
        ]}
      />
    </div>
  );
}
```

### Grouped bars

Without `stacked`, series stand side by side, 2px apart.

`src/ui/catalog/docs/chart/grouped-bars.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { BarChart } from '../../../components';

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

const s = stylex.create({
  root: { width: 640, maxWidth: '100%' },
});

export default function ChartGroupedBars() {
  return (
    <div {...stylex.props(s.root)}>
      <BarChart
        aria-label="New and returning customers per quarter"
        labels={quarters}
        series={[
          { id: 'new', label: 'New', values: [320, 410, 380, 470] },
          { id: 'returning', label: 'Returning', values: [540, 590, 640, 720] },
        ]}
      />
    </div>
  );
}
```

### Sparkline

A trend without axes for stat tiles: the history in gray, the latest point as an accent dot. Give it an `aria-label` that states the trend, or it stays decorative.

`src/ui/catalog/docs/chart/sparkline.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Badge, Card, Sparkline } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 260, maxWidth: '100%' },
  tile: { display: 'grid', gap: t['--os-space-2'] },
  top: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: t['--os-space-2'] },
  label: { color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], fontWeight: t['--os-font-weight-medium'] },
  value: { fontSize: t['--os-font-size-xl'], lineHeight: t['--os-line-height-lg'], fontWeight: t['--os-font-weight-semibold'], letterSpacing: '-0.02em' },
});

export default function ChartSparkline() {
  return (
    <div {...stylex.props(s.root)}>
      <Card>
        <div {...stylex.props(s.tile)}>
          <div {...stylex.props(s.top)}>
            <span {...stylex.props(s.label)}>Active members</span>
            <Badge variant="success" size="sm">+9.6%</Badge>
          </div>
          <span {...stylex.props(s.value)}>142</span>
          <Sparkline aria-label="Active members rose from 104 to 142 over twelve weeks" values={[104, 112, 109, 118, 121, 126, 124, 133, 138, 135, 140, 142]} />
        </div>
      </Card>
    </div>
  );
}
```
