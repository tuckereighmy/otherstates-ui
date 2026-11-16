# Avatar

Represent a person with an image or initials.

Category: Layout · Exports: `Avatar`, `AvatarGroup`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Avatar, AvatarGroup } from '@/ui/components';

<Avatar name="Hana Sato" src="/people/hana.jpg" />

<AvatarGroup
  label="Workspace members"
  max={3}
  items={[{ name: 'Hana Sato' }, { name: 'Dele Adeyemi', fallback: 'gradient' }]}
/>
```

## Avatar

A round or square image of a person, with a fallback.

Extends: <span> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` |  | The person's name: the accessible name and the source of the initial. |
| `src` | `string` |  | Image URL. The fallback shows while it is missing or if it fails to load. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | 24, 32, 40, 48, 64 or 80 px. `small`, `medium` and `large` are aliases of `sm`, `md` and `lg`. |
| `shape` | `'circle' \| 'square'` | `'circle'` | A square's radius follows the size, from `radius-sm` to `radius-xl`. |
| `fallback` | `'initial' \| 'icon' \| 'gradient'` | `'initial'` | What shows without an image: the first initial on bg-muted, a person glyph, or a gradient seeded by `name`. |
| `status` | `'online' \| 'away' \| 'busy' \| 'offline'` |  | Shows a presence dot and adds its word to the accessible name. |
| `statusLabel` | `string` |  | Replaces the status word in the accessible name. |
| `decorative` | `boolean` | `false` | Hides the avatar from assistive tech when the name is written next to it. |
| `colors` | `string[]` |  | Colors for the `gradient` fallback. |

## AvatarGroup

Overlapping avatars, each reachable by keyboard, with a name tip on hover and focus.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `AvatarProps[]` |  | The people, in order. Each takes the Avatar props. |
| `label` | `string` | `'People'` | Names the group for assistive tech. |
| `max` | `number` |  | Shows at most this many faces, then a "+N" count that names the rest. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` |  | One size for every face, overriding each item's own. The overlap scales with it: about a fifth of the diameter, 8 px at `md`. |
| `lastOnTop` | `boolean` | `true` | Later faces overlap earlier ones; set false to stack the first face on top. |

## Accessibility

- An Avatar is an `img` named by `name` (plus its status). Set `decorative` when the name is already written beside it.
- In a group, every face is a focusable `img` with its name, so Tab walks the people; the count names everyone it hides.
- The name tip shows on hover and on keyboard focus. It repeats the accessible name, so it is hidden from assistive tech.
- Status is never color alone: the word is part of the accessible name.
- Under reduced motion the lift and tip slide are off; the tip only fades.

## Examples

### Default

`src/ui/catalog/docs/avatar/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Avatar } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', gap: t['--os-space-3'] },
});

export default function AvatarDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Avatar name="Hana Sato" />
      <Avatar name="Arjun Mehta" />
      <Avatar name="Omar Farouk" />
    </div>
  );
}
```

### Sizes

Six diameters from 24 to 80 px (24, 32, 40, 48, 64, 80); the initial scales with them on the type scale.

`src/ui/catalog/docs/avatar/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Avatar } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const s = stylex.create({
  root: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-3'] },
});

export default function AvatarSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(size => (
        <Avatar key={size} size={size} name="Amara Diallo" />
      ))}
    </div>
  );
}
```

### Fallback only

Without an image, or when it fails to load, an avatar shows an initial, a gradient seeded by the name, or a person glyph.

`src/ui/catalog/docs/avatar/fallbacks.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Avatar } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', gap: t['--os-space-3'] },
});

export default function AvatarFallbacks() {
  return (
    <div {...stylex.props(s.root)}>
      <Avatar name="Dele Adeyemi" fallback="initial" />
      <Avatar name="Dele Adeyemi" fallback="gradient" />
      <Avatar fallback="icon" />
    </div>
  );
}
```

### Shapes

`shape="square"` rounds the corners by size: 6, 10 or 16 px here.

`src/ui/catalog/docs/avatar/shapes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Avatar } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = ['sm', 'md', 'xl'] as const;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'] },
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'] },
});

export default function AvatarShapes() {
  return (
    <div {...stylex.props(s.root)}>
      <div {...stylex.props(s.row)}>
        {sizes.map(size => <Avatar key={size} size={size} name="Ines Okafor" fallback="gradient" />)}
      </div>
      <div {...stylex.props(s.row)}>
        {sizes.map(size => <Avatar key={size} size={size} shape="square" name="Ines Okafor" fallback="gradient" />)}
      </div>
    </div>
  );
}
```

### Status

A presence dot at the bottom end; its word is added to the accessible name.

`src/ui/catalog/docs/avatar/status.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Avatar } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', gap: t['--os-space-4'] },
});

export default function AvatarStatus() {
  return (
    <div {...stylex.props(s.root)}>
      <Avatar name="Mei Tanaka" status="online" />
      <Avatar name="Rafael Costa" status="away" />
      <Avatar name="Lena Fischer" status="busy" />
      <Avatar name="Kofi Mensah" status="offline" />
    </div>
  );
}
```

### Group

`AvatarGroup` overlaps faces with a surface ring, lifts the one under the pointer or focus, and folds the rest into a count with `max`.

`src/ui/catalog/docs/avatar/group.tsx`

```tsx
import { AvatarGroup } from '../../../components';

export default function AvatarGroupExample() {
  return (
    <AvatarGroup
      label="Project members"
      max={4}
      items={[
        { name: 'Hana Sato', fallback: 'gradient' },
        { name: 'Arjun Mehta', fallback: 'gradient' },
        { name: 'Omar Farouk', fallback: 'gradient' },
        { name: 'Amara Diallo', fallback: 'gradient' },
        { name: 'Dele Adeyemi', fallback: 'gradient' },
        { name: 'Mei Tanaka', fallback: 'gradient' },
      ]}
    />
  );
}
```

### Stacking order

Later faces sit on top by default; `lastOnTop={false}` puts the first face on top.

`src/ui/catalog/docs/avatar/stacking.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { AvatarGroup } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const people = [
  { name: 'Ines Okafor' },
  { name: 'Tomas Berg' },
  { name: 'Mei Tanaka' },
  { name: 'Rafael Costa' },
];

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

export default function AvatarStacking() {
  return (
    <div {...stylex.props(s.root)}>
      <AvatarGroup label="Reviewers" size="sm" items={people} />
      <AvatarGroup label="Approvers" size="sm" items={people} lastOnTop={false} />
    </div>
  );
}
```
