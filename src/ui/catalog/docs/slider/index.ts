import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import WithoutLabelAndValue from './without-label-and-value';
import withoutLabelAndValueCode from './without-label-and-value.tsx?raw';
import Range from './range';
import rangeCode from './range.tsx?raw';
import Vertical from './vertical';
import verticalCode from './vertical.tsx?raw';
import FormattedValue from './formatted-value';
import formattedValueCode from './formatted-value.tsx?raw';
import WithMarks from './with-marks';
import withMarksCode from './with-marks.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import FormIntegration from './form-integration';
import formIntegrationCode from './form-integration.tsx?raw';
import Ticks from './ticks';
import ticksCode from './ticks.tsx?raw';

export default defineDoc({
  id: 'slider',
  title: 'Slider',
  category: 'Forms',
  description: 'Pick a value, or a range of values, along a track.',
  source: [
    'components/slider.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/field-styles.ts',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Slider'],
  usage: `import { Slider } from '@/ui/components';

<Slider label="Volume" defaultValue={40} />`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    { id: 'sizes', title: 'Sizes', description: 'Three rail sizes: the knob, the rail and the hit band grow together.', Component: Sizes, code: sizesCode },
    { id: 'without-label-and-value', title: 'Without label and value', description: 'Name the slider with `aria-label` and set `showValue` to false for a bare track.', Component: WithoutLabelAndValue, code: withoutLabelAndValueCode },
    { id: 'range', title: 'Range', description: 'A `[start, end]` value gives two thumbs that cannot cross.', Component: Range, code: rangeCode },
    { id: 'vertical', title: 'Vertical', description: '`orientation="vertical"` stands the rail up. Set the height with `style` or `className`.', Component: Vertical, code: verticalCode, minHeight: 300 },
    { id: 'formatted-value', title: 'Formatted value', description: '`formatOptions` formats the value text, here as a percentage.', Component: FormattedValue, code: formattedValueCode },
    { id: 'with-marks', title: 'With marks', description: '`marks` labels stops under the rail.', Component: WithMarks, code: withMarksCode },
    { id: 'disabled', title: 'Disabled', description: '`isDisabled` swaps the rail, knob and label to the disabled colors.', Component: Disabled, code: disabledCode },
    { id: 'controlled', title: 'Controlled', description: '`onChange` fires while dragging; `onChangeEnd` fires once the drag ends.', Component: Controlled, code: controlledCode },
    { id: 'form-integration', title: 'Form integration', description: '`name` submits the value with the form.', Component: FormIntegration, code: formIntegrationCode },
    { id: 'ticks', title: 'Ticks', description: 'The bar field: filled bars show the value, and a fast drag lifts the bars it passes.', Component: Ticks, code: ticksCode },
  ],
  api: [
    {
      name: 'Slider',
      description: 'A labeled track with one thumb, or two for a range.',
      props: [
        { name: 'label', type: 'string', description: 'Names the slider. Omit it inside a `Field`, which supplies the label.' },
        { name: 'value', type: 'number | [number, number]', description: 'The value (controlled). Pass a `[start, end]` pair for a range slider.' },
        { name: 'defaultValue', type: 'number | [number, number]', description: 'The starting value when uncontrolled.' },
        { name: 'onChange', type: '(value: T) => void', description: 'Fires on every change while dragging or stepping.' },
        { name: 'onChangeEnd', type: '(value: T) => void', description: 'Fires once a drag or key press ends.' },
        { name: 'minValue', type: 'number', default: '0', description: 'The smallest value.' },
        { name: 'maxValue', type: 'number', default: '100', description: 'The largest value.' },
        { name: 'step', type: 'number', default: '1', description: 'The distance between selectable values.' },
        { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formats the value text, for example as a percentage or a currency.' },
        { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'The direction of the rail. `ticks` is always horizontal.' },
        { name: 'appearance', type: "'rail' | 'ticks'", default: "'rail'", description: '`rail` is the form slider. `ticks` is the bar field with a ripple on drag.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Rail thickness, knob and hit band. `ticks` is always a 48 px bar field.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables the thumbs and swaps the slider to the disabled colors.' },
        { name: 'disabled', type: 'boolean', description: 'Deprecated. Use `isDisabled`.' },
        { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Hides the label row visually. The label still names the slider.' },
        { name: 'showValue', type: 'boolean', default: 'true', description: 'Shows the formatted value.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the slider.' },
        { name: 'marks', type: 'Array<number | { value: number; label?: ReactNode }>', description: 'Labeled stops under the rail, at their values.' },
        { name: 'name', type: 'string', description: 'Submits the value with a form under this name. A range submits two values under the same name.' },
        { name: 'form', type: 'string', description: 'The id of the form the value belongs to.' },
        { name: 'thumbLabels', type: '[string, string]', default: "['Minimum', 'Maximum']", description: 'Accessible names of the two thumbs of a range.' },
        { name: 'bars', type: 'number', default: '36', description: '`ticks` only: how many bars to draw, from 12 to 64.' },
        { name: 'ripple', type: 'number', default: '60', description: '`ticks` only: how strongly a fast drag lifts the bars it passes. 0 turns the ripple off.' },
        { name: 'id', type: 'string', description: 'The id of the slider group.' },
        { name: 'aria-label', type: 'string', description: 'Names the slider when there is no visible label.' },
        { name: 'aria-labelledby', type: 'string', description: 'Ids of the elements that name the slider.' },
        { name: 'aria-describedby', type: 'string', description: 'Ids of extra elements that describe the slider.' },
        { name: 'className', type: 'string', description: 'A class for the outer element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outer element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The outer element.' },
      ],
    },
  ],
  accessibility: [
    'Each thumb is a native range input: Arrow keys move one `step`, Page Up and Page Down move further, Home and End jump to the ends.',
    'The label names the slider group and every thumb. The thumbs of a range are named by `thumbLabels`.',
    'The value text uses `formatOptions`, so screen readers hear "80%" or "$200" rather than a bare number.',
    'Without a visible label, pass `aria-label`, or place the slider in a `Field`.',
    'Under reduced motion, the knob does not scale when pressed and the `ticks` ripple is off.',
  ],
});
