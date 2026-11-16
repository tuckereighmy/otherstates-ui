import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Comparison from './comparison';
import comparisonCode from './comparison.tsx?raw';
import MultipleSeries from './multiple-series';
import multipleSeriesCode from './multiple-series.tsx?raw';
import BarChart from './bar-chart';
import barChartCode from './bar-chart.tsx?raw';
import StackedBars from './stacked-bars';
import stackedBarsCode from './stacked-bars.tsx?raw';
import GroupedBars from './grouped-bars';
import groupedBarsCode from './grouped-bars.tsx?raw';
import Sparkline from './sparkline';
import sparklineCode from './sparkline.tsx?raw';

export default defineDoc({
  id: 'chart',
  title: 'Chart',
  category: 'Feedback',
  description: 'Show values over time or across categories, with a readout on hover and focus.',
  source: ['components/chart.tsx', 'components/internal/class-name.ts', 'components/internal/states.ts', 'tokens.stylex.ts', 'theme.ts'],
  exports: ['LineChart', 'BarChart', 'Sparkline'],
  usage: `import { LineChart } from '@/ui/components';

<LineChart
  aria-label="Visitors per month"
  area
  labels={['Jan', 'Feb', 'Mar']}
  series={[{ id: 'visitors', label: 'Visitors', values: [3120, 3410, 3290] }]}
/>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    { id: 'comparison', title: 'Comparison', description: 'A `muted` series draws the period before in gray and dashed, so the two read apart without color. The lead series keeps the accent.', Component: Comparison, code: comparisonCode },
    { id: 'multiple-series', title: 'Multiple series', description: 'Two or more lead series take the chart colors in a fixed order and show a legend. Keep to five; fold the rest into "Other".', Component: MultipleSeries, code: multipleSeriesCode },
    { id: 'bar-chart', title: 'Bar chart', description: '`highlight` leads with one bar, usually the current period: the rest step back and its value prints on its cap. `formatValue` formats the readout and data table.', Component: BarChart, code: barChartCode },
    { id: 'stacked-bars', title: 'Stacked bars', description: '`stacked` puts several series in one bar, cut apart by a 2px gap in the surface color. Only the top segment rounds.', Component: StackedBars, code: stackedBarsCode },
    { id: 'grouped-bars', title: 'Grouped bars', description: 'Without `stacked`, series stand side by side, 2px apart.', Component: GroupedBars, code: groupedBarsCode },
    { id: 'sparkline', title: 'Sparkline', description: 'A trend without axes for stat tiles: the history in gray, the latest point as an accent dot. Give it an `aria-label` that states the trend, or it stays decorative.', Component: Sparkline, code: sparklineCode },
  ],
  api: [
    {
      name: 'LineChart',
      description: 'Lines through each series on a shared axis, with a crosshair readout. One series uses the accent; several take the chart colors.',
      props: [
        { name: 'aria-label', type: 'string', required: true, description: 'Names the chart for assistive technology and captions its data table.' },
        { name: 'labels', type: 'string[]', required: true, description: 'One label per position along the x axis. Crowded labels thin out, keeping the latest.' },
        { name: 'series', type: 'ChartSeries[]', required: true, description: 'The data. `{ id, label, values, color?, muted? }`. Values start from zero.' },
        { name: 'area', type: 'boolean', default: 'false', description: 'Washes the area under each lead line in its color, fading to nothing at the baseline.' },
        { name: 'curve', type: "'smooth' | 'linear'", default: "'smooth'", description: '`smooth` bends through every point without overshooting it.' },
        { name: 'height', type: 'number', default: '200', description: 'Plot height in px, axes excluded. The width follows the container.' },
        { name: 'formatValue', type: '(value: number) => string', description: 'Formats values in the readout and data table. Axis ticks turn compact past 10,000.' },
        { name: 'hideLegend', type: 'boolean', default: 'false', description: 'Hides the legend that shows for two or more series. Name the series elsewhere if you do.' },
        { name: 'className', type: 'string', description: 'A class for the outer element.' },
      ],
    },
    {
      name: 'BarChart',
      description: 'Columns from a shared baseline: 24px wide at most, rounded at the data end, square at the baseline.',
      props: [
        { name: 'aria-label', type: 'string', required: true, description: 'Names the chart for assistive technology and captions its data table.' },
        { name: 'labels', type: 'string[]', required: true, description: 'One label per bar or group.' },
        { name: 'series', type: 'ChartSeries[]', required: true, description: 'The data, as for LineChart.' },
        { name: 'stacked', type: 'boolean', default: 'false', description: 'Stacks several series in one bar. Off, they stand side by side.' },
        { name: 'highlight', type: 'number', description: 'The index of a bar to lead with. The rest step back and its value prints on its cap. Single series only.' },
        { name: 'height', type: 'number', default: '200', description: 'Plot height in px, axes excluded.' },
        { name: 'formatValue', type: '(value: number) => string', description: 'Formats values in the readout, the cap label and the data table.' },
        { name: 'hideLegend', type: 'boolean', default: 'false', description: 'Hides the legend that shows for two or more series.' },
        { name: 'className', type: 'string', description: 'A class for the outer element.' },
      ],
    },
    {
      name: 'Sparkline',
      description: 'A small trend line with no axes, for stat tiles.',
      props: [
        { name: 'values', type: 'number[]', required: true, description: 'The trend, oldest first. Twelve points read best.' },
        { name: 'aria-label', type: 'string', description: 'States the trend. Without it the sparkline is decorative and hidden from assistive technology.' },
        { name: 'height', type: 'number', default: '32', description: 'Height in px. The width follows the container.' },
        { name: 'className', type: 'string', description: 'A class for the outer element.' },
      ],
    },
  ],
  accessibility: [
    'The plot is one tab stop. The arrow keys move the readout point by point, Home and End jump to the ends and Escape clears it; each point is announced.',
    'The readout shows the same values on focus as on hover, and every value is also in a visually hidden data table captioned by `aria-label`.',
    'Identity never rests on color alone: two or more series get a legend, and a muted series is also dashed.',
    'The chart colors are a fixed order, checked as a set for color-vision deficiency in both modes. Text always uses text colors, never the series color.',
    'Under reduced motion, bars and lines appear without growing or fading in.',
  ],
});
