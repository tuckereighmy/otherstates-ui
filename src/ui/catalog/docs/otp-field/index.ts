import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import WithSeparator from './with-separator';
import withSeparatorCode from './with-separator.tsx?raw';
import WithHelpText from './with-help-text';
import withHelpTextCode from './with-help-text.tsx?raw';
import CustomNormalization from './custom-normalization';
import customNormalizationCode from './custom-normalization.tsx?raw';
import AutoValidation from './auto-validation';
import autoValidationCode from './auto-validation.tsx?raw';
import Alphanumeric from './alphanumeric';
import alphanumericCode from './alphanumeric.tsx?raw';
import PlaceholderHints from './placeholder-hints';
import placeholderHintsCode from './placeholder-hints.tsx?raw';
import MaskedEntry from './masked-entry';
import maskedEntryCode from './masked-entry.tsx?raw';
import Invalid from './invalid';
import invalidCode from './invalid.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import FormIntegration from './form-integration';
import formIntegrationCode from './form-integration.tsx?raw';

export default defineDoc({
  id: 'otp-field',
  title: 'OTP Field',
  category: 'Forms',
  description: 'Enter a short, segmented verification code.',
  source: [
    'components/otp-field.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/field-styles.ts',
    'components/internal/platform.ts',
    'components/internal/size.ts',
    'tokens.stylex.ts',
  ],
  exports: ['OtpField'],
  usage: `import { OtpField } from '@/ui/components';

<OtpField label="Verification code" onComplete={code => console.log(code)} />`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    { id: 'sizes', title: 'Sizes', description: 'Two cell sizes on the control scale: `sm`, 32 by 40, and `md`, 40 by 48, the default.', Component: Sizes, code: sizesCode },
    { id: 'with-separator', title: 'With separator', description: '`groupSize` splits the cells into groups with a separator between them.', Component: WithSeparator, code: withSeparatorCode },
    { id: 'with-help-text', title: 'With help text', description: '`description` sits under the cells and tells people where the code comes from.', Component: WithHelpText, code: withHelpTextCode },
    { id: 'custom-normalization', title: 'Custom normalization', description: '`normalize` rewrites typed and pasted text before the cells filter it.', Component: CustomNormalization, code: customNormalizationCode },
    { id: 'auto-validation', title: 'Auto validation', description: '`validate` runs when the last cell fills: a match merges the cells into a verified pill, a miss shakes and clears them.', Component: AutoValidation, code: autoValidationCode },
    { id: 'alphanumeric', title: 'Alphanumeric', description: '`type="alphanumeric"` accepts letters as well as digits.', Component: Alphanumeric, code: alphanumericCode },
    { id: 'placeholder-hints', title: 'Placeholder hints', description: '`placeholder` puts one hint character in each empty cell.', Component: PlaceholderHints, code: placeholderHintsCode },
    { id: 'masked-entry', title: 'Masked entry', description: '`masked` shows a dot for every character and uses a password input.', Component: MaskedEntry, code: maskedEntryCode },
    { id: 'invalid', title: 'Invalid', description: '`isInvalid` rings the cells in the error color, and `errorMessage` replaces the help text.', Component: Invalid, code: invalidCode },
    { id: 'disabled', title: 'Disabled', description: '`isDisabled` swaps the cells, digits and label to the disabled colors.', Component: Disabled, code: disabledCode },
    { id: 'controlled', title: 'Controlled', description: 'Pass `value` and `onChange` to own the code.', Component: Controlled, code: controlledCode },
    { id: 'form-integration', title: 'Form integration', description: 'Inside a `Field`, the field supplies the label and the error. `name` submits the code with the form.', Component: FormIntegration, code: formIntegrationCode },
  ],
  api: [
    {
      name: 'OtpField',
      description: 'A row of cells over one text input. Typing, deleting, selecting and pasting work as in any input.',
      props: [
        { name: 'label', type: 'string', description: 'Names the field. Omit it inside a `Field`, which supplies the label.' },
        { name: 'length', type: 'number', default: '6', description: 'How many characters the code has.' },
        { name: 'value', type: 'string', description: 'The code (controlled).' },
        { name: 'defaultValue', type: 'string', default: "''", description: 'The starting code when uncontrolled.' },
        { name: 'onChange', type: '(value: string) => void', description: 'Fires with the filtered code on every edit.' },
        { name: 'type', type: "'numeric' | 'alphanumeric'", default: "'numeric'", description: 'Which characters a cell accepts: digits, or letters and digits.' },
        { name: 'normalize', type: '(value: string) => string', description: 'Rewrites typed or pasted text before the characters are filtered by `type`, for example to uppercase it.' },
        { name: 'placeholder', type: 'string', description: 'One hint character per cell, shown in empty cells.' },
        { name: 'groupSize', type: 'number', description: 'Splits the cells into groups of this many, with a separator between groups.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Cell size: `sm` 32 by 40 or `md` 40 by 48. `small` and `medium` are aliases; `lg` and `large` are deprecated aliases of `md`.' },
        { name: 'id', type: 'string', description: 'The id of the input. Inside a `Field`, the field sets it.' },
        { name: 'name', type: 'string', description: 'Submits the code with a form under this name.' },
        { name: 'form', type: 'string', description: 'The id of the form the code belongs to.' },
        { name: 'isRequired', type: 'boolean', description: 'Blocks a form submit while the code is empty.' },
        { name: 'required', type: 'boolean', description: 'Deprecated. Use `isRequired`.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the cells. The error message replaces it while the field is invalid.' },
        { name: 'hint', type: 'string', description: 'Deprecated. Use `description`.' },
        { name: 'isInvalid', type: 'boolean', description: 'Rings the cells in the error color. Set by default while `errorMessage` is set.' },
        { name: 'errorMessage', type: 'ReactNode', description: 'Shown under the cells while the field is invalid.' },
        { name: 'error', type: 'string', description: 'Deprecated. Use `errorMessage`.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables the input and swaps the cells to the disabled colors.' },
        { name: 'disabled', type: 'boolean', description: 'Deprecated. Use `isDisabled`.' },
        { name: 'masked', type: 'boolean', default: 'false', description: 'Shows a dot for every character and uses a password input.' },
        { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Hides the label visually. It still names the input.' },
        { name: 'autoFocus', type: 'boolean', description: 'Focuses the input on mount.' },
        { name: 'validate', type: '(code: string) => boolean | Promise<boolean>', description: 'Called with a complete code. True merges the cells into a verified pill; false shakes and clears them.' },
        { name: 'onComplete', type: '(code: string) => void', description: 'Called once each time the code becomes complete.' },
        { name: 'onVerified', type: '(code: string) => void', description: 'Called after `validate` accepts a code.' },
        { name: 'verifiedLabel', type: 'string', default: "'Verified'", description: 'The text in the verified pill, also announced.' },
        { name: 'rejectedLabel', type: 'string', default: "'Code not accepted. Try again.'", description: 'Announced when `validate` rejects a code.' },
        { name: 'aria-label', type: 'string', description: 'Names the input when there is no visible label.' },
        { name: 'aria-describedby', type: 'string', description: 'Ids of extra elements that describe the input.' },
        { name: 'className', type: 'string', description: 'A class for the outer element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outer element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The outer element.' },
      ],
    },
  ],
  accessibility: [
    'One native text input holds the code, so the keyboard, selection, paste and `autocomplete="one-time-code"` suggestions work as in any input.',
    'The cells are drawn for sighted users and hidden from assistive tech; the label names the input.',
    'While `validate` runs, a status region announces "Checking code", then the verified label or `rejectedLabel`.',
    'The error message replaces the help text and is linked with `aria-describedby`; the input sets `aria-invalid`.',
    'Under reduced motion, the digit entrance, caret pulse, shake and merge become instant.',
  ],
});
