import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Required from './required';
import requiredCode from './required.tsx?raw';
import Optional from './optional';
import optionalCode from './optional.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import WithCheckbox from './with-checkbox';
import withCheckboxCode from './with-checkbox.tsx?raw';

export default defineDoc({
  id: 'label',
  title: 'Label',
  category: 'Forms',
  description: 'Give a control a visible, accessible name.',
  source: [
    'components/label.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Label'],
  usage: `import { Input, Label } from '@/ui/components';

<>
  <Label htmlFor="display-name">Display name</Label>
  <Input id="display-name" />
</>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'required',
      title: 'Required',
      description: '`isRequired` appends a muted asterisk. Mark the control required as well; the asterisk is hidden from screen readers.',
      Component: Required,
      code: requiredCode,
    },
    {
      id: 'optional',
      title: 'Optional',
      description: 'When most fields are required, `isOptional` marks the few that are not.',
      Component: Optional,
      code: optionalCode,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: '`isDisabled` dims the label to match its disabled control.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'with-checkbox',
      title: 'With checkboxes',
      description: 'As a `span`, a Label names a group of checkboxes through `aria-labelledby`.',
      Component: WithCheckbox,
      code: withCheckboxCode,
    },
  ],
  api: [
    {
      name: 'Label',
      description: 'A 14px medium label for one control, with optional required and optional markers.',
      extends: '<label> attributes',
      props: [
        { name: 'htmlFor', type: 'string', description: 'The id of the control it labels.' },
        { name: 'isRequired', type: 'boolean', default: 'false', description: 'Appends ` *` in `fg-muted`, hidden from assistive tech.' },
        { name: 'isOptional', type: 'boolean', default: 'false', description: 'Appends "(optional)" in `fg-muted`. Ignored when `isRequired` is set.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Dims the label to `fg-disabled` to match a disabled control.' },
        { name: 'elementType', type: "'label' | 'span'", default: "'label'", description: '`span` names something a `<label>` cannot, such as a group, through `aria-labelledby`.' },
      ],
    },
  ],
  accessibility: [
    'A `<label>` with `htmlFor` names its control, and clicking it focuses or toggles the control.',
    'Inside a Field, use the Field `label` prop or `FieldLabel`: the ids are wired for you.',
    'The required asterisk is decorative; set `required` or `isRequired` on the control so assistive tech announces it.',
    'For a group, render the Label as a `span` and point the group at it with `aria-labelledby`.',
  ],
});
