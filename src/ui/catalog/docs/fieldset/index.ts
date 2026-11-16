import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithDescription from './with-description';
import withDescriptionCode from './with-description.tsx?raw';
import Plain from './plain';
import plainCode from './plain.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import WithError from './with-error';
import withErrorCode from './with-error.tsx?raw';
import LegendPart from './legend-part';
import legendPartCode from './legend-part.tsx?raw';

export default defineDoc({
  id: 'fieldset',
  title: 'Fieldset',
  category: 'Forms',
  description: 'Group related fields under one legend.',
  source: [
    'components/fieldset.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Fieldset', 'FieldsetLegend'],
  usage: `import { Field, Fieldset, Input } from '@/ui/components';

<Fieldset legend="Billing address">
  <Field label="Street">
    <Input name="street" />
  </Field>
</Fieldset>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'with-description',
      title: 'With description',
      description: 'A line of help text sits 4px under the legend and describes the whole group.',
      Component: WithDescription,
      code: withDescriptionCode,
    },
    {
      id: 'plain',
      title: 'Plain',
      description: '`variant="plain"` drops the outline and keeps the legend and the 16px rhythm.',
      Component: Plain,
      code: plainCode,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: '`isDisabled` disables every control inside and dims the legend, the description and each Field.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'with-error',
      title: 'With error',
      description: 'An `errorMessage` for the group replaces its description; the Fields inside show the invalid edge without repeating it.',
      Component: WithError,
      code: withErrorCode,
    },
    {
      id: 'legend-part',
      title: 'Custom legend',
      description: 'Pass a `FieldsetLegend` as the first child when the legend needs more than text.',
      Component: LegendPart,
      code: legendPartCode,
      stage: 'canvas',
    },
  ],
  api: [
    {
      name: 'Fieldset',
      description: 'A native `<fieldset>` with a legend, one message line and 16px between its fields. Inside a Form, a Fieldset that follows another child starts a section 24px below it.',
      extends: '<fieldset> attributes',
      props: [
        { name: 'legend', type: 'ReactNode', description: 'The visible name of the group, rendered as its `<legend>`.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the legend, linked with `aria-describedby`. The error replaces it.' },
        { name: 'errorMessage', type: 'ReactNode', description: 'An error for the whole group, shown under the legend in place of the description while it is set.' },
        { name: 'variant', type: "'outline' | 'plain'", default: "'outline'", description: '`outline` draws a 1px `border-subtle` frame at radius 16; `plain` keeps the legend and spacing without it.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables every control inside and dims the legend, the message and each Field. Same as the native `disabled`.' },
      ],
    },
    {
      name: 'FieldsetLegend',
      description: 'The legend of the surrounding Fieldset, for content beyond the `legend` prop. It must be the first child.',
      extends: '<legend> attributes',
      props: [],
    },
  ],
  accessibility: [
    'A native `<fieldset>` has the `group` role, and its `<legend>` names the group, so each control inside is announced with it.',
    'The description, or the error in its place, is linked to the group with `aria-describedby`.',
    'A disabled fieldset disables every native control inside it; they leave the tab order.',
    'Use a fieldset for related controls that share a question or a purpose, such as an address or a time range.',
  ],
});
