import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import WithExternalLabel from './with-external-label';
import withExternalLabelCode from './with-external-label.tsx?raw';
import WithScrub from './with-scrub';
import withScrubCode from './with-scrub.tsx?raw';
import WithRange from './with-range';
import withRangeCode from './with-range.tsx?raw';
import WithFormattedValue from './with-formatted-value';
import withFormattedValueCode from './with-formatted-value.tsx?raw';
import WithStep from './with-step';
import withStepCode from './with-step.tsx?raw';
import Invalid from './invalid';
import invalidCode from './invalid.tsx?raw';
import ReadOnly from './read-only';
import readOnlyCode from './read-only.tsx?raw';
import WithoutStepper from './without-stepper';
import withoutStepperCode from './without-stepper.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import FormIntegration from './form-integration';
import formIntegrationCode from './form-integration.tsx?raw';
import ScrubStepperExample from './scrub-stepper';
import scrubStepperCode from './scrub-stepper.tsx?raw';
import ScrubStepperStates from './scrub-stepper-states';
import scrubStepperStatesCode from './scrub-stepper-states.tsx?raw';

const sizeType = "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large'";

export default defineDoc({
  id: 'number-field',
  title: 'Number Field',
  category: 'Forms',
  description: 'Type a number, or step it with the buttons, the arrow keys or a drag.',
  source: [
    'components/number-field.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/field-styles.ts',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['NumberField', 'ScrubStepper'],
  usage: `import { NumberField } from '@/ui/components';

<NumberField label="Quantity" defaultValue={1} minValue={0} />`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    { id: 'sizes', title: 'Sizes', description: 'Five heights from the control scale. `md`, 40px, is the default.', Component: Sizes, code: sizesCode },
    { id: 'disabled', title: 'Disabled', description: '`isDisabled` grays the label, the value and the steppers.', Component: Disabled, code: disabledCode },
    { id: 'with-external-label', title: 'With external label', description: 'Inside a `Field`, the field supplies the label and the help text.', Component: WithExternalLabel, code: withExternalLabelCode },
    { id: 'with-scrub', title: 'With scrub', description: 'Set `scrub` to change the value by dragging the label.', Component: WithScrub, code: withScrubCode },
    { id: 'with-range', title: 'With range', description: '`minValue` and `maxValue` bound typing, stepping and the arrow keys.', Component: WithRange, code: withRangeCode },
    { id: 'with-formatted-value', title: 'With formatted value', description: '`formatOptions` shows the value as a currency, a percentage or a unit.', Component: WithFormattedValue, code: withFormattedValueCode },
    { id: 'with-step', title: 'With step', description: '`step` sets how far each press and arrow key moves the value.', Component: WithStep, code: withStepCode },
    { id: 'invalid', title: 'Invalid', description: '`isInvalid` draws the error edge, and `errorMessage` replaces the help text.', Component: Invalid, code: invalidCode },
    { id: 'read-only', title: 'Read-only', description: '`isReadOnly` keeps the value selectable and hides the steppers.', Component: ReadOnly, code: readOnlyCode },
    { id: 'without-stepper', title: 'Without steppers', description: '`hideStepper` leaves a plain numeric input. The arrow keys still step.', Component: WithoutStepper, code: withoutStepperCode },
    { id: 'controlled', title: 'Controlled', description: 'Pass `value` and `onChange` to own the value.', Component: Controlled, code: controlledCode },
    { id: 'form-integration', title: 'Form integration', description: '`name` submits the number with the form, and `isRequired` blocks an empty submit.', Component: FormIntegration, code: formIntegrationCode },
    { id: 'scrub-stepper', title: 'Scrub stepper', description: 'Tap a side for one step, or hold a side and drag to sweep the range.', Component: ScrubStepperExample, code: scrubStepperCode },
    { id: 'scrub-stepper-states', title: 'Scrub stepper states', description: 'The 32px size, read-only and invalid.', Component: ScrubStepperStates, code: scrubStepperStatesCode },
  ],
  api: [
    {
      name: 'NumberField',
      description: 'A labeled numeric input with decrement and increment buttons.',
      extends: 'React Aria NumberFieldProps',
      props: [
        { name: 'label', type: 'ReactNode', description: 'The visible label. Omit it inside a `Field`, which supplies the label.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the field. The error message replaces it while the field is invalid.' },
        { name: 'errorMessage', type: 'ReactNode | ((validation: ValidationResult) => ReactNode)', description: 'Shown under the field while it is invalid.' },
        { name: 'error', type: 'ReactNode', description: 'Deprecated. Use `isInvalid` with `errorMessage`. Setting it also marks the field invalid.' },
        { name: 'size', type: sizeType, default: "'md'", description: 'Height and type of the field. `small`, `medium` and `large` are aliases of `sm`, `md` and `lg`.' },
        { name: 'scrub', type: 'boolean', default: 'false', description: 'Drag the label horizontally to change the value.' },
        { name: 'hideStepper', type: 'boolean', default: 'false', description: 'Hides the decrement and increment buttons. The arrow keys still step.' },
        { name: 'className', type: 'string', description: 'A class for the outer element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outer element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The outer element.' },
      ],
    },
    {
      name: 'ScrubStepper',
      description: 'A stepper rail in the shared control shape (a pill by default): tap a side for one step, or hold a side and drag to sweep the range.',
      props: [
        { name: 'label', type: 'string', required: true, description: 'Names the control. Visually hidden unless `hideLabel` is false.' },
        { name: 'value', type: 'number', description: 'The value (controlled).' },
        { name: 'defaultValue', type: 'number', default: '24', description: 'The starting value when uncontrolled.' },
        { name: 'onChange', type: '(value: number) => void', description: 'Fires on every change, including each value passed during a sweep.' },
        { name: 'onCommit', type: '(value: number) => void', description: 'Fires once per step, and once when a sweep is released.' },
        { name: 'min', type: 'number', default: '0', description: 'The smallest value.' },
        { name: 'max', type: 'number', default: '100', description: 'The largest value.' },
        { name: 'step', type: 'number', default: '1', description: 'How far one tap or arrow key moves the value.' },
        { name: 'size', type: "'sm' | 'md' | 'small' | 'medium'", default: "'md'", description: '`md` is the 48px rail (control xl); `sm` is the 32px row.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables the buttons, gestures and keys.' },
        { name: 'disabled', type: 'boolean', description: 'Deprecated. Use `isDisabled`.' },
        { name: 'isReadOnly', type: 'boolean', default: 'false', description: 'Shows the value but hides the buttons and ignores gestures and keys.' },
        { name: 'isInvalid', type: 'boolean', default: 'false', description: 'Draws the invalid ring and links `errorMessage`.' },
        { name: 'errorMessage', type: 'ReactNode', description: 'Shown under the rail while `isInvalid` is set.' },
        { name: 'hideLabel', type: 'boolean', default: 'true', description: 'Hides the label visually. It still names the control.' },
        { name: 'name', type: 'string', description: 'Submits the value with a form under this name.' },
        { name: 'form', type: 'string', description: 'The id of the form the value belongs to.' },
        { name: 'id', type: 'string', description: 'The id of the spin button.' },
        { name: 'className', type: 'string', description: 'A class for the outer element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outer element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The outer element.' },
      ],
    },
  ],
  accessibility: [
    'Arrow Up and Arrow Down step the value, Page Up and Page Down step further, and Home and End jump to `minValue` and `maxValue`.',
    'The steppers are labeled buttons that Tab skips, so keyboard users stay in the input.',
    'Give every field a `label`, a surrounding `Field`, or an `aria-label`.',
    'The error message replaces the help text and is linked to the input with `aria-describedby`.',
    'ScrubStepper is a `spinbutton` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`. Escape during a sweep restores the starting value.',
    'Under reduced motion, ScrubStepper drops its tilt and sweep scale.',
  ],
});
