import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithoutLabelAndValue from './without-label-and-value';
import withoutLabelAndValueCode from './without-label-and-value.tsx?raw';
import FormattedValue from './formatted-value';
import formattedValueCode from './formatted-value.tsx?raw';
import WithRange from './with-range';
import withRangeCode from './with-range.tsx?raw';
import ValueLabel from './value-label';
import valueLabelCode from './value-label.tsx?raw';
import Tones from './tones';
import tonesCode from './tones.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';

export default defineDoc({
  id: 'meter',
  title: 'Meter',
  category: 'Feedback',
  description: 'Show a measurement against a known limit.',
  source: ['components/meter.tsx', 'components/internal/class-name.ts', 'tokens.stylex.ts'],
  exports: ['Meter'],
  usage: `import { Meter } from '@/ui/components';

<Meter label="Storage used" value={72} />`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    { id: 'without-label-and-value', title: 'Without label and value', description: '`hideLabel` and `showValue={false}` leave the track. The label still names the meter.', Component: WithoutLabelAndValue, code: withoutLabelAndValueCode },
    { id: 'formatted-value', title: 'With formatted value', description: '`formatOptions` formats the value text, here as a currency.', Component: FormattedValue, code: formattedValueCode },
    { id: 'with-range', title: 'With range', description: '`minValue` and `maxValue` set the scale. The value text stays a percentage by default.', Component: WithRange, code: withRangeCode },
    { id: 'value-label', title: 'Custom value label', description: '`valueLabel` replaces the value text, for screen readers too.', Component: ValueLabel, code: valueLabelCode },
    { id: 'tones', title: 'Tones', description: 'Status tones for measurements that carry meaning.', Component: Tones, code: tonesCode },
    { id: 'sizes', title: 'Sizes', description: 'Track heights of 4, 6 and 8 px.', Component: Sizes, code: sizesCode },
  ],
  api: [
    {
      name: 'Meter',
      description: 'A label, a value and a track filled to the value.',
      extends: 'React Aria MeterProps',
      props: [
        { name: 'label', type: 'string', required: true, description: 'Names the measurement. Shown above the track unless `hideLabel` is set; it names the meter either way.' },
        { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Hides the label visually.' },
        { name: 'showValue', type: 'boolean', default: 'true', description: 'Shows the value text at the end of the header.' },
        { name: 'valueLabel', type: 'ReactNode', description: 'Replaces the formatted value, for example "36 of 50 GB". A string is also read out by screen readers.' },
        { name: 'tone', type: "'accent' | 'success' | 'warning' | 'error'", default: "'accent'", description: 'The fill color. Pick a status tone for meaning, not decoration.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Track height: 4, 6 or 8 px.' },
        { name: 'className', type: 'string', description: 'A class for the outer element.' },
      ],
    },
  ],
  accessibility: [
    'Renders `role="meter"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and a formatted `aria-valuetext`.',
    'The label names the meter through `aria-label`, so a hidden label still reaches screen readers.',
    'A string `valueLabel` becomes the `aria-valuetext`.',
    'Use a meter for a measurement within a known range; use Progress for a task moving toward completion.',
    'Under reduced motion, the fill changes without a transition.',
  ],
});
