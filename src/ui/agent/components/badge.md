# Badge

Mark a status or highlight a short label.

Category: Feedback · Exports: `Badge`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Badge } from '@/ui/components';

<Badge variant="success" withIcon>Paid</Badge>
```

## Badge

A short label in the shared control shape (a pill by default): a `<span>`, or an `<a>` when it has an `href`.

Extends: <span> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'neutral' \| 'secondary' \| 'outline' \| 'destructive' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'neutral'` | Color and weight. Defaults to `status` when one is given. |
| `status` | `'success' \| 'error' \| 'warning' \| 'info'` |  | Same as passing the tone as `variant`; kept for older code. Without children, the tone name is the label. |
| `contrast` | `'low' \| 'high'` | `'low'` | `high` fills a status badge with its strong color. Status tones only. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'md'` | Heights of 20, 24 and 28 px. `small`, `medium` and `large` are aliases. |
| `withIcon` | `boolean` | `false` | Shows the status icon before the label. Status tones only; use `icon` otherwise. |
| `icon` | `ReactNode` |  | A leading icon. An `Icon` without a size takes the badge's icon size: 12, 14 or 14 px. |
| `count` | `number` |  | A number after the label, in tabular figures. |
| `max` | `number` | `99` | Counts above this show as `max+`. |
| `href` | `string` |  | Renders the badge as a link, with a hover step and a focus ring. |
| `target` | `string` |  | The link's `target`, used with `href`. |
| `rel` | `string` |  | The link's `rel`, used with `href`. |
| `children` | `ReactNode` |  | The label. |
| `ref` | `Ref<HTMLElement>` |  | The `<span>`, or the `<a>` with `href`. |

## Accessibility

- A badge is plain text, so its label carries the meaning: never rely on the tone color alone. Status icons are decorative.
- Status text meets 4.5:1 on its tint in both themes.
- A count on its own, such as "12", needs context: keep a label beside it, or put it inside a control whose name explains it.
- With `href`, the badge is a link: it joins the tab order, shows the focus ring for keyboard focus and gets a 24px hit area, 44px on touch screens.

## Examples

### Default

`src/ui/catalog/docs/badge/default.tsx`

```tsx
import { Badge } from '../../../components';

export default function BadgeDefault() {
  return <Badge>New</Badge>;
}
```

### Secondary

A quiet neutral fill for labels that sit beside other content.

`src/ui/catalog/docs/badge/secondary.tsx`

```tsx
import { Badge } from '../../../components';

export default function BadgeSecondary() {
  return <Badge variant="secondary">Draft</Badge>;
}
```

### Outline

A hairline outline and no fill.

`src/ui/catalog/docs/badge/outline.tsx`

```tsx
import { Badge } from '../../../components';

export default function BadgeOutline() {
  return <Badge variant="outline">Internal</Badge>;
}
```

### Destructive

White text on the danger fill, for something that needs action now.

`src/ui/catalog/docs/badge/destructive.tsx`

```tsx
import { Badge } from '../../../components';

export default function BadgeDestructive() {
  return <Badge variant="destructive">Overdue</Badge>;
}
```

### Status

The four status tones: `info`, `success`, `warning` and `error`, each on its own tint.

`src/ui/catalog/docs/badge/status.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Badge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function BadgeStatus() {
  return (
    <div {...stylex.props(s.row)}>
      <Badge variant="info">Scheduled</Badge>
      <Badge variant="success">Paid</Badge>
      <Badge variant="warning">Expiring</Badge>
      <Badge variant="error">Failed</Badge>
    </div>
  );
}
```

### High contrast

`contrast="high"` fills a status badge with its strong color.

`src/ui/catalog/docs/badge/high-contrast.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Badge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function BadgeHighContrast() {
  return (
    <div {...stylex.props(s.row)}>
      <Badge variant="info" contrast="high">Scheduled</Badge>
      <Badge variant="success" contrast="high">Paid</Badge>
      <Badge variant="warning" contrast="high">Expiring</Badge>
      <Badge variant="error" contrast="high">Failed</Badge>
    </div>
  );
}
```

### Sizes

Heights of 20, 24 and 28 px. `md` is the default.

`src/ui/catalog/docs/badge/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Badge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function BadgeSizes() {
  return (
    <div {...stylex.props(s.row)}>
      <Badge size="sm" variant="secondary">Small</Badge>
      <Badge size="md" variant="secondary">Medium</Badge>
      <Badge size="lg" variant="secondary">Large</Badge>
    </div>
  );
}
```

### With icon

`withIcon` adds the status icon; `icon` takes any other icon, sized to the badge.

`src/ui/catalog/docs/badge/with-icon.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Badge, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function BadgeWithIcon() {
  return (
    <div {...stylex.props(s.row)}>
      <Badge variant="success" withIcon>Deployed</Badge>
      <Badge variant="warning" withIcon>Needs review</Badge>
      <Badge variant="secondary" icon={<Icon name="clock" />}>Due Friday</Badge>
    </div>
  );
}
```

### With link

With `href`, the badge renders a link with a hover step and a focus ring.

`src/ui/catalog/docs/badge/with-link.tsx`

```tsx
import { Badge, Icon } from '../../../components';

export default function BadgeWithLink() {
  return (
    <Badge href="#" variant="outline" icon={<Icon name="tag" />}>
      Release 2.4
    </Badge>
  );
}
```

### With count

`count` adds a number in tabular figures; counts above `max` show as `max+`.

`src/ui/catalog/docs/badge/with-count.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Badge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function BadgeWithCount() {
  return (
    <div {...stylex.props(s.row)}>
      <Badge variant="secondary" count={12}>Comments</Badge>
      <Badge variant="destructive" count={128}>Unread</Badge>
      <Badge variant="outline" count={1250} max={999}>Open tasks</Badge>
    </div>
  );
}
```
