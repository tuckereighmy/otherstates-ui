# Label

Give a control a visible, accessible name.

Category: Forms · Exports: `Label`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Input, Label } from '@/ui/components';

<>
  <Label htmlFor="display-name">Display name</Label>
  <Input id="display-name" />
</>
```

## Label

A 14px medium label for one control, with optional required and optional markers.

Extends: <label> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `htmlFor` | `string` |  | The id of the control it labels. |
| `isRequired` | `boolean` | `false` | Appends ` *` in `fg-muted`, hidden from assistive tech. |
| `isOptional` | `boolean` | `false` | Appends "(optional)" in `fg-muted`. Ignored when `isRequired` is set. |
| `isDisabled` | `boolean` | `false` | Dims the label to `fg-disabled` to match a disabled control. |
| `elementType` | `'label' \| 'span'` | `'label'` | `span` names something a `<label>` cannot, such as a group, through `aria-labelledby`. |

## Accessibility

- A `<label>` with `htmlFor` names its control, and clicking it focuses or toggles the control.
- Inside a Field, use the Field `label` prop or `FieldLabel`: the ids are wired for you.
- The required asterisk is decorative; set `required` or `isRequired` on the control so assistive tech announces it.
- For a group, render the Label as a `span` and point the group at it with `aria-labelledby`.

## Examples

### Default

`src/ui/catalog/docs/label/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Input, Label } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'], width: 320, maxWidth: '100%' },
});

export default function LabelDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Label htmlFor="display-name">Display name</Label>
      <Input id="display-name" name="displayName" placeholder="How teammates see you" />
    </div>
  );
}
```

### Required

`isRequired` appends a muted asterisk. Mark the control required as well; the asterisk is hidden from screen readers.

`src/ui/catalog/docs/label/required.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Input, Label } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'], width: 320, maxWidth: '100%' },
});

export default function LabelRequired() {
  return (
    <div {...stylex.props(s.root)}>
      <Label htmlFor="team-name" isRequired>Team name</Label>
      <Input id="team-name" name="team" isRequired />
    </div>
  );
}
```

### Optional

When most fields are required, `isOptional` marks the few that are not.

`src/ui/catalog/docs/label/optional.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Input, Label } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'], width: 320, maxWidth: '100%' },
});

export default function LabelOptional() {
  return (
    <div {...stylex.props(s.root)}>
      <Label htmlFor="purchase-order" isOptional>Purchase order number</Label>
      <Input id="purchase-order" name="purchaseOrder" />
    </div>
  );
}
```

### Disabled

`isDisabled` dims the label to match its disabled control.

`src/ui/catalog/docs/label/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Input, Label } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'], width: 320, maxWidth: '100%' },
});

export default function LabelDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Label htmlFor="billing-plan" isDisabled>Billing plan</Label>
      <Input id="billing-plan" defaultValue="Team, yearly" isDisabled />
    </div>
  );
}
```

### With checkboxes

As a `span`, a Label names a group of checkboxes through `aria-labelledby`.

`src/ui/catalog/docs/label/with-checkbox.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Checkbox, Label } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'] },
  list: { display: 'grid', gap: t['--os-space-1'] },
});

export default function LabelWithCheckbox() {
  return (
    <div role="group" aria-labelledby="digest-label" {...stylex.props(s.root)}>
      <Label id="digest-label" elementType="span">Email me about</Label>
      <div {...stylex.props(s.list)}>
        <Checkbox label="Comments on my notes" name="comments" defaultSelected />
        <Checkbox label="Changes to shared projects" name="projects" />
      </div>
    </div>
  );
}
```
