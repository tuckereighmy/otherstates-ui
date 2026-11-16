import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithLabelAndValue from './with-label-and-value';
import withLabelAndValueCode from './with-label-and-value.tsx?raw';
import FormattedValue from './formatted-value';
import formattedValueCode from './formatted-value.tsx?raw';
import Indeterminate from './indeterminate';
import indeterminateCode from './indeterminate.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import Tones from './tones';
import tonesCode from './tones.tsx?raw';
import Circular from './circular';
import circularCode from './circular.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import TaskChecklistExample from './task-checklist';
import taskChecklistCode from './task-checklist.tsx?raw';

const sizeType = "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'";

export default defineDoc({
  id: 'progress',
  title: 'Progress',
  category: 'Feedback',
  description: 'Show how far along a task is.',
  source: ['components/progress.tsx', 'components/internal/class-name.ts', 'components/internal/states.ts', 'tokens.stylex.ts'],
  exports: ['Progress', 'TaskChecklist'],
  usage: `import { Progress } from '@/ui/components';

<Progress label="Uploading files" value={64} />`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    { id: 'with-label-and-value', title: 'With label and value', description: '`showLabel` and `showValue` put the label and the value above the bar.', Component: WithLabelAndValue, code: withLabelAndValueCode },
    { id: 'formatted-value', title: 'With formatted value', description: '`formatOptions` formats the value; `valueLabel` replaces it with your own text.', Component: FormattedValue, code: formattedValueCode },
    { id: 'indeterminate', title: 'Indeterminate', description: '`isIndeterminate` sweeps a segment along the track when the length of a task is unknown.', Component: Indeterminate, code: indeterminateCode },
    { id: 'sizes', title: 'Sizes', description: 'Track heights of 4, 6 and 8 px.', Component: Sizes, code: sizesCode },
    { id: 'tones', title: 'Tones', description: '`brand` is the product gradient; the status tones carry meaning.', Component: Tones, code: tonesCode },
    { id: 'circular', title: 'Circular', description: '`variant="circular"` draws a ring, with the value in the center.', Component: Circular, code: circularCode },
    { id: 'controlled', title: 'Controlled', description: 'Update `value` as the task moves; the fill eases to each new value.', Component: Controlled, code: controlledCode },
    { id: 'task-checklist', title: 'Task checklist', description: 'A checklist card: each checked step fills the bar and is struck through.', Component: TaskChecklistExample, code: taskChecklistCode, minHeight: 420 },
  ],
  api: [
    {
      name: 'Progress',
      description: 'A determinate or indeterminate bar or ring.',
      extends: 'React Aria ProgressBarProps',
      props: [
        { name: 'label', type: 'string', required: true, description: 'Names the task. It always names the progress bar; `showLabel` also shows it.' },
        { name: 'variant', type: "'bar' | 'circular'", default: "'bar'", description: 'A bar, or a ring.' },
        { name: 'showLabel', type: 'boolean', default: 'false', description: 'Shows the label above the bar, or under the ring.' },
        { name: 'showValue', type: 'boolean', default: 'false', description: 'Shows the formatted value: at the end of the header for a bar, in the center of a ring.' },
        { name: 'valueLabel', type: 'ReactNode', description: 'Replaces the formatted value, for example "3 of 8 files". A string is also read out by screen readers.' },
        { name: 'size', type: sizeType, default: "'md'", description: 'Bar height (4, 6 or 8 px) or ring diameter (64, 120 or 160 px).' },
        { name: 'tone', type: "'accent' | 'brand' | 'success' | 'warning' | 'error'", default: "'accent'", description: 'The fill. `brand` is the product gradient on bars; a ring falls back to `accent`.' },
        { name: 'className', type: 'string', description: 'A class for the outer element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outer element.' },
      ],
    },
    {
      name: 'TaskChecklist',
      description: 'A checklist card with a count, a gradient bar and checkable steps.',
      props: [
        { name: 'title', type: 'string', required: true, description: 'The heading of the card; it also names the list and the bar.' },
        { name: 'items', type: '{ id: string; label: string; disabled?: boolean }[]', required: true, description: 'The steps, in order. A disabled step cannot be checked or unchecked.' },
        { name: 'checkedKeys', type: 'readonly string[]', description: 'The checked step ids (controlled).' },
        { name: 'defaultCheckedKeys', type: 'readonly string[]', default: '[]', description: 'The checked step ids when uncontrolled.' },
        { name: 'onCheckedChange', type: '(keys: string[]) => void', description: 'Fires with the checked ids after each toggle.' },
        { name: 'sparks', type: 'boolean', default: 'true', description: 'Sprays a few particles from a step as it is checked. Off under reduced motion.' },
        { name: 'className', type: 'string', description: 'A class for the card.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the card.' },
        { name: 'ref', type: 'Ref<HTMLElement>', description: 'The card element.' },
      ],
    },
  ],
  accessibility: [
    'Renders `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and a formatted `aria-valuetext`; an indeterminate bar leaves out `aria-valuenow`.',
    'The label names the bar through `aria-label`, so it reaches screen readers even when it is not shown.',
    'TaskChecklist steps are buttons with `role="checkbox"` and `aria-checked`; Space and Enter toggle them, and the focus ring sits inside each row.',
    'Under reduced motion, fills change without a transition, the indeterminate segment rests in the middle of the track, and the ring stops spinning.',
  ],
});
