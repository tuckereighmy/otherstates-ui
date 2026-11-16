# OTP Field

Enter a short, segmented verification code.

Category: Forms · Exports: `OtpField`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { OtpField } from '@/ui/components';

<OtpField label="Verification code" onComplete={code => console.log(code)} />
```

## OtpField

A row of cells over one text input. Typing, deleting, selecting and pasting work as in any input.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the field. Omit it inside a `Field`, which supplies the label. |
| `length` | `number` | `6` | How many characters the code has. |
| `value` | `string` |  | The code (controlled). |
| `defaultValue` | `string` | `''` | The starting code when uncontrolled. |
| `onChange` | `(value: string) => void` |  | Fires with the filtered code on every edit. |
| `type` | `'numeric' \| 'alphanumeric'` | `'numeric'` | Which characters a cell accepts: digits, or letters and digits. |
| `normalize` | `(value: string) => string` |  | Rewrites typed or pasted text before the characters are filtered by `type`, for example to uppercase it. |
| `placeholder` | `string` |  | One hint character per cell, shown in empty cells. |
| `groupSize` | `number` |  | Splits the cells into groups of this many, with a separator between groups. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'md'` | Cell size: `sm` 32 by 40 or `md` 40 by 48. `small` and `medium` are aliases; `lg` and `large` are deprecated aliases of `md`. |
| `id` | `string` |  | The id of the input. Inside a `Field`, the field sets it. |
| `name` | `string` |  | Submits the code with a form under this name. |
| `form` | `string` |  | The id of the form the code belongs to. |
| `isRequired` | `boolean` |  | Blocks a form submit while the code is empty. |
| `required` | `boolean` |  | Deprecated. Use `isRequired`. |
| `description` | `ReactNode` |  | Help text under the cells. The error message replaces it while the field is invalid. |
| `hint` | `string` |  | Deprecated. Use `description`. |
| `isInvalid` | `boolean` |  | Rings the cells in the error color. Set by default while `errorMessage` is set. |
| `errorMessage` | `ReactNode` |  | Shown under the cells while the field is invalid. |
| `error` | `string` |  | Deprecated. Use `errorMessage`. |
| `isDisabled` | `boolean` | `false` | Disables the input and swaps the cells to the disabled colors. |
| `disabled` | `boolean` |  | Deprecated. Use `isDisabled`. |
| `masked` | `boolean` | `false` | Shows a dot for every character and uses a password input. |
| `hideLabel` | `boolean` | `false` | Hides the label visually. It still names the input. |
| `autoFocus` | `boolean` |  | Focuses the input on mount. |
| `validate` | `(code: string) => boolean \| Promise<boolean>` |  | Called with a complete code. True merges the cells into a verified pill; false shakes and clears them. |
| `onComplete` | `(code: string) => void` |  | Called once each time the code becomes complete. |
| `onVerified` | `(code: string) => void` |  | Called after `validate` accepts a code. |
| `verifiedLabel` | `string` | `'Verified'` | The text in the verified pill, also announced. |
| `rejectedLabel` | `string` | `'Code not accepted. Try again.'` | Announced when `validate` rejects a code. |
| `aria-label` | `string` |  | Names the input when there is no visible label. |
| `aria-describedby` | `string` |  | Ids of extra elements that describe the input. |
| `className` | `string` |  | A class for the outer element. |
| `style` | `CSSProperties` |  | Inline styles for the outer element. |
| `ref` | `Ref<HTMLDivElement>` |  | The outer element. |

## Accessibility

- One native text input holds the code, so the keyboard, selection, paste and `autocomplete="one-time-code"` suggestions work as in any input.
- The cells are drawn for sighted users and hidden from assistive tech; the label names the input.
- While `validate` runs, a status region announces "Checking code", then the verified label or `rejectedLabel`.
- The error message replaces the help text and is linked with `aria-describedby`; the input sets `aria-invalid`.
- Under reduced motion, the digit entrance, caret pulse, shake and merge become instant.

## Examples

### Default

`src/ui/catalog/docs/otp-field/default.tsx`

```tsx
import { OtpField } from '../../../components';

export default function OtpFieldDefault() {
  return <OtpField label="Verification code" />;
}
```

### Sizes

Two cell sizes on the control scale: `sm`, 32 by 40, and `md`, 40 by 48, the default.

`src/ui/catalog/docs/otp-field/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { OtpField } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'start', gap: t['--os-space-5'] },
});

export default function OtpFieldSizes() {
  return (
    <div {...stylex.props(s.root)}>
      <OtpField label="Small" size="sm" length={4} />
      <OtpField label="Medium" length={4} />
    </div>
  );
}
```

### With separator

`groupSize` splits the cells into groups with a separator between them.

`src/ui/catalog/docs/otp-field/with-separator.tsx`

```tsx
import { OtpField } from '../../../components';

export default function OtpFieldWithSeparator() {
  return <OtpField label="Recovery code" groupSize={3} />;
}
```

### With help text

`description` sits under the cells and tells people where the code comes from.

`src/ui/catalog/docs/otp-field/with-help-text.tsx`

```tsx
import { OtpField } from '../../../components';

export default function OtpFieldWithHelpText() {
  return (
    <OtpField
      label="Verification code"
      description="We sent a 6-digit code to your email."
    />
  );
}
```

### Custom normalization

`normalize` rewrites typed and pasted text before the cells filter it.

`src/ui/catalog/docs/otp-field/custom-normalization.tsx`

```tsx
'use client';

import { OtpField } from '../../../components';

export default function OtpFieldCustomNormalization() {
  return (
    <OtpField
      label="Invite code"
      type="alphanumeric"
      normalize={text => text.toUpperCase()}
      description="Letters are uppercased as you type or paste."
    />
  );
}
```

### Auto validation

`validate` runs when the last cell fills: a match merges the cells into a verified pill, a miss shakes and clears them.

`src/ui/catalog/docs/otp-field/auto-validation.tsx`

```tsx
'use client';

import { OtpField } from '../../../components';

export default function OtpFieldAutoValidation() {
  return (
    <OtpField
      label="Verification code"
      length={4}
      validate={code => code === '2468'}
      description="Try 2468, or any other code to see it rejected."
    />
  );
}
```

### Alphanumeric

`type="alphanumeric"` accepts letters as well as digits.

`src/ui/catalog/docs/otp-field/alphanumeric.tsx`

```tsx
import { OtpField } from '../../../components';

export default function OtpFieldAlphanumeric() {
  return <OtpField label="Device code" type="alphanumeric" />;
}
```

### Placeholder hints

`placeholder` puts one hint character in each empty cell.

`src/ui/catalog/docs/otp-field/placeholder-hints.tsx`

```tsx
import { OtpField } from '../../../components';

export default function OtpFieldPlaceholderHints() {
  return <OtpField label="Verification code" placeholder="000000" />;
}
```

### Masked entry

`masked` shows a dot for every character and uses a password input.

`src/ui/catalog/docs/otp-field/masked-entry.tsx`

```tsx
import { OtpField } from '../../../components';

export default function OtpFieldMaskedEntry() {
  return <OtpField label="Account PIN" length={4} masked />;
}
```

### Invalid

`isInvalid` rings the cells in the error color, and `errorMessage` replaces the help text.

`src/ui/catalog/docs/otp-field/invalid.tsx`

```tsx
import { OtpField } from '../../../components';

export default function OtpFieldInvalid() {
  return (
    <OtpField
      label="Verification code"
      defaultValue="481920"
      isInvalid
      errorMessage="That code has expired. Request a new one."
    />
  );
}
```

### Disabled

`isDisabled` swaps the cells, digits and label to the disabled colors.

`src/ui/catalog/docs/otp-field/disabled.tsx`

```tsx
import { OtpField } from '../../../components';

export default function OtpFieldDisabled() {
  return <OtpField label="Verification code" length={4} defaultValue="4819" isDisabled />;
}
```

### Controlled

Pass `value` and `onChange` to own the code.

`src/ui/catalog/docs/otp-field/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, OtpField } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'start', gap: t['--os-space-3'] },
});

export default function OtpFieldControlled() {
  const [code, setCode] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <OtpField
        label="Verification code"
        length={4}
        value={code}
        onChange={setCode}
        description={code.length === 4 ? 'Ready to verify.' : `${4 - code.length} digits to go.`}
      />
      <Button appearance="tertiary" size="sm" onClick={() => setCode('')}>
        Clear
      </Button>
    </div>
  );
}
```

### Form integration

Inside a `Field`, the field supplies the label and the error. `name` submits the code with the form.

`src/ui/catalog/docs/otp-field/form-integration.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, OtpField } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function OtpFieldFormIntegration() {
  const [submitted, setSubmitted] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSubmitted(String(new FormData(event.currentTarget).get('code')));
        }}
      >
        <Field
          label="Authenticator code"
          description={submitted ? `Submitted ${submitted}.` : 'Open your authenticator app to find it.'}
          errorMessage={validity => (validity.validationDetails.valueMissing ? 'Enter the code.' : 'Enter all 6 digits.')}
        >
          <OtpField name="code" isRequired />
        </Field>
        <Button type="submit">Verify</Button>
      </Form>
    </div>
  );
}
```
