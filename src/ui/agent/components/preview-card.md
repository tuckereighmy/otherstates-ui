# Preview Card

A card that previews a link when it is hovered or focused.

Category: Overlays · Exports: `PreviewCard`, `PeoplePreview`, `PreviewProfile`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { PreviewCard } from '@/ui/components';

<PreviewCard href="/handbook" trigger="Release handbook">
  Steps, owners and rollback plans for every release.
</PreviewCard>
```

## PreviewCard

A link and the card it shows on hover or focus.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` (required) | `string` |  | Where the link goes. |
| `trigger` (required) | `ReactNode` |  | The link text. |
| `children` (required) | `ReactNode` |  | The card content. Keep it non-interactive. |
| `placement` | `Placement` | `'top'` | The side of the link the card opens on. It flips when there is no room. |
| `offset` | `number` | `6` | Distance from the link in px. |
| `crossOffset` | `number` |  | Shift along the link’s edge, in px. |
| `width` | `number \| string` | `256` | Card width in px or any CSS length. The default is the popover width. |
| `delay` | `number` |  | Milliseconds of hover before the card opens. Focus opens it at once. |
| `closeDelay` | `number` |  | Milliseconds before it closes after the pointer leaves. |
| `isDisabled` | `boolean` | `false` | Never show the card; the link still works. |
| `isOpen` | `boolean` |  | Whether the card is open, controlled. |
| `defaultOpen` | `boolean` | `false` | Whether the card starts open, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` |  | Called when the card opens or closes. |
| `portalContainer` | `Element` | `document.body` | Where the card renders. |
| `className` | `string` |  | Classes for the card surface. |
| `style` | `CSSProperties` |  | Inline styles for the card surface. |
| `ref` | `Ref<HTMLDivElement>` |  | The card surface element. |

## PeoplePreview

A showcase: a 48 px row of faces that share one profile card, up to 320 px wide.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `profiles` (required) | `PreviewProfile[]` |  | The people, in order. Each has an id, name, handle, bio, counts and optional mutual followers. |
| `summary` (required) | `string` |  | The line beside the faces. |
| `caption` | `string` | `'liked your post'` | The muted line under the summary. |
| `delay` | `number` | `400` | Milliseconds of hover before the first card opens. |
| `followedIds` | `readonly string[]` |  | The followed profiles, controlled. |
| `defaultFollowedIds` | `readonly string[]` | `[]` | The followed profiles at the start, uncontrolled. |
| `onFollowChange` | `(ids: string[]) => void` |  | Called with every follow or unfollow. |
| `className` | `string` |  | Classes for the root. |
| `style` | `CSSProperties` |  | Inline styles for the root. |
| `ref` | `Ref<HTMLDivElement>` |  | The root element. |

## Accessibility

- The trigger is a real link: Enter follows it, and the card is extra context for sighted pointer and keyboard users.
- The card opens on hover after `delay` and at once on keyboard focus, and closes on blur, pointer leave or Escape.
- Screen readers do not reach the card, so never put information or actions only there.
- In PeoplePreview each face is a button with `aria-expanded`; Escape closes the card and Follow is a toggle with `aria-pressed`.
- Under reduced motion the cards only fade.

## Examples

### Default

`src/ui/catalog/docs/preview-card/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { PreviewCard } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  text: { margin: 0, maxWidth: 420, fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'] },
  title: { margin: 0, fontWeight: tokens['--os-font-weight-medium'] },
  meta: { margin: 0, marginBlockStart: tokens['--os-space-1'], fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

export default function PreviewCardDefault() {
  return (
    <p {...stylex.props(s.text)}>
      The launch checklist now lives in{' '}
      <PreviewCard href="#" trigger="Release handbook">
        <p {...stylex.props(s.title)}>Release handbook</p>
        <p {...stylex.props(s.meta)}>Steps, owners and rollback plans for every release. Updated 2 days ago.</p>
      </PreviewCard>
      , next to last quarter’s notes.
    </p>
  );
}
```

### Placement and delay

Open below the link, and tune how long the pointer must rest and how long the card lingers.

`src/ui/catalog/docs/preview-card/placement.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { PreviewCard } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  title: { margin: 0, fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'], fontWeight: tokens['--os-font-weight-medium'] },
  meta: { margin: 0, marginBlockStart: tokens['--os-space-1'], fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

export default function PreviewCardPlacement() {
  return (
    <PreviewCard href="#" trigger="Invoice 2041" placement="bottom" delay={300} closeDelay={200}>
      <p {...stylex.props(s.title)}>Invoice 2041 · €1,280.00</p>
      <p {...stylex.props(s.meta)}>Due 30 November. Sent to the finance team on 2 November.</p>
    </PreviewCard>
  );
}
```

### Width

Set `width` for richer content; the card never exceeds the viewport less 24px.

`src/ui/catalog/docs/preview-card/width.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Avatar, PreviewCard } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  head: { display: 'flex', alignItems: 'center', gap: tokens['--os-space-3'] },
  name: { margin: 0, fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'], fontWeight: tokens['--os-font-weight-medium'] },
  role: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
  bio: { margin: 0, marginBlockStart: tokens['--os-space-3'], fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

export default function PreviewCardWidth() {
  return (
    <PreviewCard href="#" trigger="Ines Moreau" width={320}>
      <div {...stylex.props(s.head)}>
        <Avatar name="Ines Moreau" fallback="gradient" />
        <div>
          <p {...stylex.props(s.name)}>Ines Moreau</p>
          <p {...stylex.props(s.role)}>Product designer, Platform</p>
        </div>
      </div>
      <p {...stylex.props(s.bio)}>Owns the settings redesign and the design review on Thursdays.</p>
    </PreviewCard>
  );
}
```

### People preview

A composite showcase: one shared card that follows the pointer across a row of faces.

`src/ui/catalog/docs/preview-card/people-preview.tsx`

```tsx
import { PeoplePreview } from '../../../components';
import type { PreviewProfile } from '../../../components';

const profiles: PreviewProfile[] = [
  {
    id: 'anouk', name: 'Anouk Verbeek', handle: '@anoukverbeek', avatar: { fallback: 'gradient' },
    bio: 'Design lead for the launch team. Collects buttons that almost shipped.',
    followingCount: 128, followersCount: 964, mutualLabel: 'Followed by Dele and Hana',
    mutualAvatars: [{ name: 'Dele Adeyemi', fallback: 'gradient' }, { name: 'Hana Sato', fallback: 'gradient' }],
  },
  {
    id: 'dele', name: 'Dele Adeyemi', handle: '@deleadeyemi', avatar: { fallback: 'gradient' },
    bio: 'Engineer on the sync team. Happiest when a flaky test finally stays green.',
    followingCount: 203, followersCount: 1512, mutualLabel: 'Followed by Anouk and Rafael',
    mutualAvatars: [{ name: 'Anouk Verbeek', fallback: 'gradient' }, { name: 'Rafael Ortiz', fallback: 'gradient' }],
  },
  {
    id: 'hana', name: 'Hana Sato', handle: '@hanasato', avatar: { fallback: 'gradient' },
    bio: 'Writes the release notes. Believes every error message deserves an editor.',
    followingCount: 86, followersCount: 2340, mutualLabel: 'Followed by Anouk and Dele',
    mutualAvatars: [{ name: 'Anouk Verbeek', fallback: 'gradient' }, { name: 'Dele Adeyemi', fallback: 'gradient' }],
  },
  {
    id: 'rafael', name: 'Rafael Ortiz', handle: '@rafaelortiz', avatar: { fallback: 'gradient' },
    bio: 'Researcher. Runs the Thursday interviews and shares the quotes.',
    followingCount: 175, followersCount: 731,
  },
];

export default function PreviewCardPeoplePreview() {
  return <PeoplePreview profiles={profiles} summary="Anouk and 3 others" />;
}
```
