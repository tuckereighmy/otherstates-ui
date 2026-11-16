# Skeleton

Reserve space while content loads.

Category: Feedback · Exports: `Skeleton`, `SkeletonReveal`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Skeleton } from '@/ui/components';

<div aria-busy="true">
  <Skeleton shape="circle" />
  <Skeleton width="40%" />
  <Skeleton lines={2} />
</div>
```

## Skeleton

A breathing placeholder in the track color. Hidden from assistive tech.

Extends: <span> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `shape` | `'rectangle' \| 'circle' \| 'image'` | `'rectangle'` | A block or text line, a circle, or a fluid image box with an aspect ratio. |
| `width` | `number \| string` | `'100%'` | Width in px or any CSS length. A circle defaults to its `size`. |
| `height` | `number \| string` |  | Height in px or any CSS length. Without it a rectangle is one 20px text line drawn as a 14px bar. |
| `radius` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' \| number` | `'sm'` | A radius token or px value. Circles are `full`. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | Circle diameter, matching Avatar: 24, 32, 44, 48, 64 or 80 px. The old rectangle presets (`display`, `heading`, `body`, `button`) still work but are deprecated. |
| `ratio` | `'1:1' \| '3:2' \| '2:3' \| '4:3' \| '3:4' \| '5:4' \| '4:5' \| '16:9' \| '9:16'` | `'16:9'` | Aspect ratio of an `image` placeholder. |
| `lines` | `number` |  | Draws this many text lines; the last of several is 60% wide. |

## SkeletonReveal

Holds real content in place while placeholder bars cover it, then grows the bars into the content and fades them.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ready` (required) | `boolean` |  | Set to true when the content has loaded. |
| `children` (required) | `ReactNode` |  | The real content. It keeps its layout while hidden, so nothing shifts. |
| `blocks` | `{ width: number \| string; height: number \| string; top?: number; radius?: number \| string }[]` | `[{ width: '100%', height: 14, top: 3 }]` | Bars over the content box; the radius defaults to `radius-sm`. |
| `order` | `number` | `0` | Step in a staged reveal; each step waits `stagger` ms. |
| `stagger` | `number` | `160` | Delay between reveal steps in ms. |
| `fullWidth` | `boolean` | `false` | Stretches the wrapper to its container instead of fitting the content. |

## Accessibility

- Placeholders are `aria-hidden`. Set `aria-busy="true"` on the region that is loading and remove it when the content arrives.
- If loading takes more than a moment, add a visually hidden status message such as "Loading notes".
- SkeletonReveal marks its wrapper `aria-busy` and makes the hidden content `inert` until `ready`, so nothing unseen takes focus.
- Under reduced motion the fill stops breathing, and SkeletonReveal only fades.

## Examples

### Default

`src/ui/catalog/docs/skeleton/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Skeleton } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'], width: 320, maxWidth: '100%' },
  text: { flex: 1, minWidth: 0 },
});

export default function SkeletonDefault() {
  return (
    <div aria-busy="true" {...stylex.props(s.root)}>
      <Skeleton shape="circle" />
      <div {...stylex.props(s.text)}>
        <Skeleton width="40%" />
        <Skeleton />
      </div>
    </div>
  );
}
```

### Shapes

Images, circles, text lines and pills: the placeholders on their own, before any content arrives.

`src/ui/catalog/docs/skeleton/shapes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Skeleton } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 360, maxWidth: '100%' },
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'] },
});

export default function SkeletonShapes() {
  return (
    <div {...stylex.props(s.root)}>
      <Skeleton shape="image" ratio="16:9" radius="lg" />
      <div {...stylex.props(s.row)}>
        <Skeleton shape="circle" size="sm" />
        <Skeleton width="50%" />
      </div>
      <Skeleton lines={2} />
      <Skeleton width={120} height={40} radius="full" />
    </div>
  );
}
```

### Text lines

`lines` draws a paragraph: 14px bars on 20px lines, the last one shorter.

`src/ui/catalog/docs/skeleton/text-lines.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Skeleton } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-5'], width: 360, maxWidth: '100%' },
});

export default function SkeletonTextLines() {
  return (
    <div {...stylex.props(s.root)}>
      <Skeleton width="55%" height={24} />
      <Skeleton lines={4} />
    </div>
  );
}
```

### Width, height and radius

Any width and height in px or CSS units, and a radius token or px value.

`src/ui/catalog/docs/skeleton/custom-size.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Skeleton } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 360, maxWidth: '100%' },
  row: { display: 'flex', gap: t['--os-space-3'] },
});

export default function SkeletonCustomSize() {
  return (
    <div {...stylex.props(s.root)}>
      <Skeleton height={140} radius="lg" />
      <div {...stylex.props(s.row)}>
        <Skeleton height={64} radius="md" />
        <Skeleton height={64} radius="md" />
        <Skeleton height={64} radius="md" />
      </div>
      <Skeleton width={96} height={32} radius="full" />
    </div>
  );
}
```

### Swap for content

Render placeholders in place of the content and mark the container `aria-busy` until it arrives.

`src/ui/catalog/docs/skeleton/loading-list.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Button, Skeleton } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const notes = ['Launch checklist', 'Hiring plan', 'Design review notes'];

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'start', gap: t['--os-space-4'], width: 320, maxWidth: '100%' },
  list: { display: 'grid', gap: t['--os-space-2'], width: '100%', margin: 0, padding: 0, listStyle: 'none', fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
});

export default function SkeletonLoadingList() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoading(false), 1200);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <div {...stylex.props(s.root)}>
      <ul aria-busy={loading} aria-label="Recent notes" {...stylex.props(s.list)}>
        {notes.map((note, index) => (
          <li key={note}>{loading ? <Skeleton width={`${70 - index * 12}%`} /> : note}</li>
        ))}
      </ul>
      <Button appearance="secondary" size="sm" isDisabled={loading} onClick={() => setLoading(true)}>
        Reload
      </Button>
    </div>
  );
}
```

### Reveal content

`SkeletonReveal` keeps the real content in layout and grows each bar into it when `ready` turns true.

`src/ui/catalog/docs/skeleton/reveal.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Avatar, Button, SkeletonReveal } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  card: { boxSizing: 'border-box', display: 'grid', justifyItems: 'start', gap: t['--os-space-3'], width: 300, maxWidth: '100%', padding: t['--os-space-5'], borderRadius: t['--os-radius-xl'], backgroundColor: t['--os-color-bg-surface'] },
  head: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'] },
  name: { margin: 0, fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'], fontWeight: t['--os-font-weight-medium'] },
  bio: { margin: 0, fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], color: t['--os-color-fg-muted'] },
});

export default function SkeletonRevealExample() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const timer = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(timer);
  }, [ready]);

  return (
    <article aria-label="Profile" {...stylex.props(s.card)}>
      <div {...stylex.props(s.head)}>
        <SkeletonReveal ready={ready} blocks={[{ width: 40, height: 40, radius: '50%' }]}>
          <Avatar name="Noor Halden" fallback="gradient" />
        </SkeletonReveal>
        <SkeletonReveal ready={ready} blocks={[{ width: 110, height: 14, top: 5 }]}>
          <h3 {...stylex.props(s.name)}>Noor Halden</h3>
        </SkeletonReveal>
      </div>
      <SkeletonReveal ready={ready} order={1} fullWidth blocks={[{ width: '100%', height: 14, top: 3 }, { width: '62%', height: 14, top: 23 }]}>
        <p {...stylex.props(s.bio)}>Leads onboarding for new teams and answers every thread.</p>
      </SkeletonReveal>
      <Button appearance="secondary" size="sm" onClick={() => setReady(false)}>Reload</Button>
    </article>
  );
}
```
