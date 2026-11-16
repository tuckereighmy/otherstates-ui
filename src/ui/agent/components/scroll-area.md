# Scroll Area

Let long content scroll inside a bounded region.

Category: Layout · Exports: `ScrollArea`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { ScrollArea } from '@/ui/components';

<ScrollArea aria-label="Project files" maxHeight={180} padding={6}>
  <ul>
    <li>Project brief</li>
    <li>Audience research</li>
    <li>Interview notes</li>
  </ul>
</ScrollArea>
```

## ScrollArea

A bg-surface box, radius 16, around a native scrolling viewport. `className` and `style` go to the box; `ref` and the other props go to the viewport.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `maxHeight` | `number \| string` | `160 ('none' when horizontal)` | The height the area grows to before it scrolls. |
| `orientation` | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | The axes that scroll. The other axis clips. |
| `fade` | `boolean` | `false` | Fades the content out over 24 px at each edge that has more to scroll to. |
| `padding` | `number \| string` |  | Space between the edge and the content. The content scrolls through it. |
| `gutter` | `'stable' \| 'both-edges' \| 'auto'` | `'stable'` | Reserves room for the vertical scrollbar so content does not shift when it appears. |
| `overscroll` | `'contain' \| 'auto'` | `'contain'` | `contain` stops a scroll that reaches the end from scrolling the page behind. |
| `bordered` | `boolean` | `false` | Adds a 1px `border-subtle` hairline, for an area that sits straight on the canvas. |
| `ref` | `Ref<HTMLDivElement>` |  | The scrolling viewport, so `scrollTo()` and `scrollTop` work. |
| `children` | `ReactNode` |  | The content that scrolls. |

## Accessibility

- The viewport takes a Tab stop only while its content overflows. Then arrow keys, Page Up, Page Down, Home, End and Space scroll it, and the focus ring shows on the box.
- With an `aria-label` or `aria-labelledby` the viewport becomes a `region`, so screen readers can find it and say what scrolls.
- Content inside stays in reading order; focusable children scroll into view when they take focus.
- `fade` is a static mask that follows the scroll position, with no animation, so it needs no reduced-motion branch.

## Examples

### Default

`src/ui/catalog/docs/scroll-area/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const files = [
  'Project brief', 'Audience research', 'Interview notes', 'Journey maps',
  'Launch checklist', 'Visual references', 'Meeting notes', 'Budget overview',
];

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
  list: { margin: 0, padding: 0, listStyle: 'none' },
  row: {
    display: 'flex', alignItems: 'center', gap: tokens['--os-space-2'], height: 36,
    paddingInline: tokens['--os-space-3'], fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'],
  },
  icon: { display: 'flex', color: tokens['--os-color-fg-muted'] },
});

export default function ScrollAreaDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <ScrollArea aria-label="Project files" maxHeight={180} padding={6}>
        <ul role="list" {...stylex.props(s.list)}>
          {files.map(file => (
            <li key={file} {...stylex.props(s.row)}>
              <span {...stylex.props(s.icon)}><Icon name="file" size={16} /></span>
              {file}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
```

### Scroll fade

With `fade`, content fades out at each edge that has more to scroll to. The fill stays crisp.

`src/ui/catalog/docs/scroll-area/fade.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const notes = [
  'The launch review moves to Thursday so the support team can read the draft first.',
  'Pricing pages stay as they are until the new plans are approved.',
  'Onboarding emails go out in three steps instead of five.',
  'The mobile menu gets a search field at the top.',
  'Exports older than 30 days are removed automatically from now on.',
  'Next check-in is on the first Monday of the month.',
];

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
  text: { display: 'grid', gap: tokens['--os-space-3'], fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'] },
  note: { margin: 0 },
});

export default function ScrollAreaFade() {
  return (
    <div {...stylex.props(s.root)}>
      <ScrollArea aria-label="Meeting notes" fade maxHeight={180} padding={16}>
        <div {...stylex.props(s.text)}>
          {notes.map(note => <p key={note} {...stylex.props(s.note)}>{note}</p>)}
        </div>
      </ScrollArea>
    </div>
  );
}
```

### Horizontal

`orientation="horizontal"` scrolls sideways and clips the other axis.

`src/ui/catalog/docs/scroll-area/horizontal.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const projects = ['Office redesign', 'Spring campaign', 'Website audit', 'Help center', 'Mobile app', 'Annual report'];

const s = stylex.create({
  root: { width: 420, maxWidth: '100%' },
  row: { display: 'flex', gap: tokens['--os-space-2'], width: 'max-content' },
  tile: {
    display: 'flex', alignItems: 'flex-end', width: 132, height: 88, padding: tokens['--os-space-3'],
    borderRadius: tokens['--os-radius-md'], backgroundColor: tokens['--os-color-bg-muted'],
    fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], fontWeight: tokens['--os-font-weight-medium'],
  },
});

export default function ScrollAreaHorizontal() {
  return (
    <div {...stylex.props(s.root)}>
      <ScrollArea aria-label="Recent projects" orientation="horizontal" padding={8}>
        <div {...stylex.props(s.row)}>
          {projects.map(project => <div key={project} {...stylex.props(s.tile)}>{project}</div>)}
        </div>
      </ScrollArea>
    </div>
  );
}
```

### Scrollbar gutter

The default `gutter="stable"` keeps room for the scrollbar, so an area that scrolls lines up with one that does not.

`src/ui/catalog/docs/scroll-area/gutter.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const members = ['Ada', 'Bruno', 'Chiara', 'Dev', 'Elif', 'Farid', 'Greta', 'Hiro', 'Ines'];

const s = stylex.create({
  root: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: tokens['--os-space-4'] },
  area: { width: 200 },
  row: {
    display: 'flex', justifyContent: 'space-between', height: 36, alignItems: 'center', paddingInline: tokens['--os-space-3'],
    fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'],
  },
  meta: { color: tokens['--os-color-fg-muted'] },
});

function Members({ label, names }: { label: string; names: string[] }) {
  return (
    <ScrollArea aria-label={label} maxHeight={156} padding={6} {...stylex.props(s.area)}>
      {names.map(name => (
        <div key={name} {...stylex.props(s.row)}>{name}<span {...stylex.props(s.meta)}>Editor</span></div>
      ))}
    </ScrollArea>
  );
}

export default function ScrollAreaGutter() {
  return (
    <div {...stylex.props(s.root)}>
      <Members label="Design team" names={members.slice(0, 3)} />
      <Members label="Whole workspace" names={members} />
    </div>
  );
}
```

### Both scrollbars

`orientation="both"` scrolls a grid that is taller and wider than its area.

`src/ui/catalog/docs/scroll-area/both.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
  grid: {
    display: 'grid', gridTemplateColumns: `56px repeat(${days.length}, 88px)`, gap: tokens['--os-space-0-5'],
    fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], fontVariantNumeric: 'tabular-nums',
  },
  head: { paddingBlock: tokens['--os-space-1'], color: tokens['--os-color-fg-muted'], fontWeight: tokens['--os-font-weight-medium'] },
  cell: { height: 32, borderRadius: tokens['--os-radius-sm'], backgroundColor: tokens['--os-color-bg-muted'] },
});

export default function ScrollAreaBoth() {
  return (
    <div {...stylex.props(s.root)}>
      <ScrollArea aria-label="Room bookings" orientation="both" maxHeight={220} padding={8}>
        <div {...stylex.props(s.grid)}>
          <span />
          {days.map(day => <span key={day} {...stylex.props(s.head)}>{day}</span>)}
          {hours.map(hour => [
            <span key={hour} {...stylex.props(s.head)}>{hour}</span>,
            ...days.map(day => <span key={hour + day} {...stylex.props(s.cell)} />),
          ])}
        </div>
      </ScrollArea>
    </div>
  );
}
```

### Fill a flex column

Set `maxHeight="none"` and let `className` grow the area into the space a flex layout leaves.

`src/ui/catalog/docs/scroll-area/fill.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const events = Array.from({ length: 14 }, (_, i) => `Build ${120 - i} finished in ${38 + ((i * 7) % 20)} s`);

const s = stylex.create({
  panel: { display: 'flex', flexDirection: 'column', gap: tokens['--os-space-2'], width: 320, maxWidth: '100%', height: 240 },
  title: { margin: 0, fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'], fontWeight: tokens['--os-font-weight-medium'] },
  fill: { flexGrow: 1, minHeight: 0 },
  row: { paddingBlock: tokens['--os-space-2'], fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], fontVariantNumeric: 'tabular-nums' },
});

export default function ScrollAreaFill() {
  return (
    <section {...stylex.props(s.panel)}>
      <h3 {...stylex.props(s.title)}>Activity</h3>
      <ScrollArea aria-label="Activity" maxHeight="none" padding="4px 16px" {...stylex.props(s.fill)}>
        {events.map(event => <div key={event} {...stylex.props(s.row)}>{event}</div>)}
      </ScrollArea>
    </section>
  );
}
```

### Overscroll

`overscroll="contain"`, the default, stops at the end; `auto` passes the rest of the scroll to the page.

`src/ui/catalog/docs/scroll-area/overscroll.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const steps = ['Draft', 'Review', 'Legal check', 'Design pass', 'Translation', 'Scheduled', 'Published', 'Archived'];

const modes = [
  { overscroll: 'contain', label: 'Stops at the end' },
  { overscroll: 'auto', label: 'Then scrolls the page' },
] as const;

const s = stylex.create({
  root: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: tokens['--os-space-4'] },
  area: { width: 200 },
  label: { margin: 0, paddingInline: tokens['--os-space-3'], paddingBlock: tokens['--os-space-1'], color: tokens['--os-color-fg-muted'], fontSize: tokens['--os-font-size-xs'], lineHeight: tokens['--os-line-height-xs'] },
  row: { display: 'flex', alignItems: 'center', height: 36, paddingInline: tokens['--os-space-3'], fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'] },
});

export default function ScrollAreaOverscroll() {
  return (
    <div {...stylex.props(s.root)}>
      {modes.map(({ overscroll, label }) => (
        <ScrollArea key={overscroll} aria-label={label} overscroll={overscroll} maxHeight={150} padding={6} {...stylex.props(s.area)}>
          <p {...stylex.props(s.label)}>{label}</p>
          {steps.map(step => <div key={step} {...stylex.props(s.row)}>{step}</div>)}
        </ScrollArea>
      ))}
    </div>
  );
}
```

### Content min-width

Content with a minimum width scrolls sideways on narrow screens instead of squeezing.

`src/ui/catalog/docs/scroll-area/content-min-width.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const columns = [
  { title: 'Backlog', tasks: ['Audit icons', 'Draft FAQ'] },
  { title: 'In progress', tasks: ['Billing page', 'Search filters'] },
  { title: 'Review', tasks: ['Invite flow'] },
  { title: 'Done', tasks: ['Dark theme', 'Export to CSV'] },
];

const s = stylex.create({
  root: { width: 420, maxWidth: '100%' },
  board: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: tokens['--os-space-2'], minWidth: 600 },
  column: { display: 'grid', alignContent: 'start', gap: tokens['--os-space-1-5'], fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'] },
  title: { margin: 0, color: tokens['--os-color-fg-muted'], fontSize: tokens['--os-font-size-xs'], lineHeight: tokens['--os-line-height-xs'], fontWeight: tokens['--os-font-weight-medium'] },
  task: { padding: tokens['--os-space-2'], borderRadius: tokens['--os-radius-md'], backgroundColor: tokens['--os-color-bg-muted'] },
});

export default function ScrollAreaContentMinWidth() {
  return (
    <div {...stylex.props(s.root)}>
      <ScrollArea aria-label="Task board" orientation="horizontal" padding={12}>
        <div {...stylex.props(s.board)}>
          {columns.map(column => (
            <div key={column.title} {...stylex.props(s.column)}>
              <h4 {...stylex.props(s.title)}>{column.title}</h4>
              {column.tasks.map(task => <div key={task} {...stylex.props(s.task)}>{task}</div>)}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
```

### Bordered

On the canvas, `bordered` adds the 1 px hairline that marks the edge.

`src/ui/catalog/docs/scroll-area/bordered.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const releases = [
  { version: '2.4.0', date: 'Nov 10' }, { version: '2.3.2', date: 'Oct 28' }, { version: '2.3.1', date: 'Oct 21' },
  { version: '2.3.0', date: 'Oct 14' }, { version: '2.2.0', date: 'Sep 30' }, { version: '2.1.1', date: 'Sep 16' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
  row: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 36, paddingInline: tokens['--os-space-3'],
    fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'], fontVariantNumeric: 'tabular-nums',
  },
  meta: { color: tokens['--os-color-fg-muted'] },
});

export default function ScrollAreaBordered() {
  return (
    <div {...stylex.props(s.root)}>
      <ScrollArea aria-label="Releases" bordered maxHeight={168} padding={6}>
        {releases.map(({ version, date }) => (
          <div key={version} {...stylex.props(s.row)}>
            Version {version}<span {...stylex.props(s.meta)}>{date}</span>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
```
