import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import ValidationErrors from './validation-errors';
import validationErrorsCode from './validation-errors.tsx?raw';
import CustomValidation from './custom-validation';
import customValidationCode from './custom-validation.tsx?raw';
import Actions from './actions';
import actionsCode from './actions.tsx?raw';
import Sections from './sections';
import sectionsCode from './sections.tsx?raw';

export default defineDoc({
  id: 'form',
  title: 'Form',
  category: 'Forms',
  description: 'Collect fields, validate them and submit them together.',
  source: ['components/form.tsx', 'components/internal/class-name.ts', 'tokens.stylex.ts'],
  exports: ['Form', 'FormActions'],
  usage: `import { Button, Field, Form, FormActions, Input } from '@/ui/components';

<Form onSubmit={event => event.preventDefault()}>
  <Field label="Email" isRequired>
    <Input type="email" name="email" />
  </Field>
  <FormActions>
    <Button type="submit">Send invite</Button>
  </FormActions>
</Form>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'validation-errors',
      title: 'Validation errors',
      description: 'Errors returned by a server go in `validationErrors`, keyed by control name, and clear as soon as the value is edited.',
      Component: ValidationErrors,
      code: validationErrorsCode,
    },
    {
      id: 'custom-validation',
      title: 'Custom validation',
      description: 'Validate every value in one function on submit, the way a schema library would, and pass the result to `validationErrors`.',
      Component: CustomValidation,
      code: customValidationCode,
      minHeight: 320,
    },
    {
      id: 'actions',
      title: 'Actions row',
      description: '`FormActions` sits 24px under the last field; `align="end"` moves the buttons to the end, and a reset button clears every Field.',
      Component: Actions,
      code: actionsCode,
    },
    {
      id: 'sections',
      title: 'Sections',
      description: 'Group a long form into Fieldsets: each one after the first starts 24px down, and the actions row follows 24px under the last.',
      Component: Sections,
      code: sectionsCode,
    },
  ],
  api: [
    {
      name: 'Form',
      description: 'A native `<form>` laid out as a column with 16px between fields.',
      extends: 'React Aria FormProps',
      props: [
        { name: 'validationErrors', type: 'Record<string, string | string[]>', description: 'Errors keyed by control name, usually from a server. Each Field shows the one for its control until the value changes.' },
        { name: 'validationBehavior', type: "'native' | 'aria'", default: "'native'", description: '`native` lets the browser block submission while a constraint fails; `aria` submits anyway and leaves the checks to you.' },
        { name: 'ref', type: 'Ref<HTMLFormElement>', description: 'The `<form>` element.' },
      ],
    },
    {
      name: 'FormActions',
      description: 'The row of buttons at the end of a form: 24px under the last field, buttons 8px apart, wrapping on narrow screens.',
      extends: '<div> attributes',
      props: [
        { name: 'align', type: "'start' | 'end'", default: "'start'", description: 'Where the buttons sit in the row.' },
      ],
    },
  ],
  accessibility: [
    'Renders a native `<form>`: Enter in a text field submits it, and a reset button restores every value.',
    'With `validationBehavior="native"`, a failed constraint blocks submission; each Field shows its message and focus moves to the first invalid control.',
    'Messages from `validationErrors` are linked to their controls with `aria-describedby` through each Field.',
    'When a page has more than one form, name each with `aria-label` or `aria-labelledby`.',
  ],
});
