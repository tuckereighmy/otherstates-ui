# Writing a component page

How to write the docs page for one component in Otherstates UI. The docs site is served at `/ui/`;
component pages live at `#component/<id>`. This guide covers what the shell renders, the rules every
page follows, and how to check your work.

The contract is `types.ts` in this folder. The source of truth for every pixel decision is
`src/ui/DESIGN_SPEC.md`: examples show components the way the spec describes them.

## Where a page lives

```
src/ui/catalog/docs/<id>/
  index.ts            default-exports defineDoc({ ... })
  default.tsx         the hero example
  <kebab-id>.tsx      one file per further example
```

`registry.ts` picks up every folder that has an `index.ts`. Nothing else registers a page: the
sidebar, search, previous and next links and the introduction's component count all follow from it.

Every example is a real module. The page renders its default export in the Preview tab and shows the
same file, imported with `?raw`, in the Code tab, so the code a reader copies is always the code on
screen.

## What the page shows

The shell renders a component page in this order. Every `h2` and `h3` is listed under "On this page",
and every heading links to itself.

| Part | From | Anchor |
|---|---|---|
| Category, title, description | `category`, `title`, `description` | |
| Hero stage (Preview and Code tabs) | `examples[0]` | |
| Installation: the files to copy | `source` | `#component/<id>/installation` |
| Usage | `usage` | `#component/<id>/usage` |
| Examples: one `h3` per example, its description, then Preview and Code | `examples[1…]` | `#component/<id>/<example-id>` |
| API reference: one `h3` per part, its description, an "Extends" line, the props table | `api` | `#component/<id>/api-<name>` |
| Accessibility: a bulleted list | `accessibility` | `#component/<id>/accessibility` |
| Previous and next page | the sidebar order | |

The hero is not repeated under Examples. A section with nothing in it is left out. An example whose id
is one of the section ids (`installation`, `usage`, `examples`, `api-reference`, `accessibility`) gets
the anchor `example-<id>`. Don't start an example id with `api-`.

In `description` fields, in prop descriptions and in accessibility notes, put a name between
backticks to set it as code: ``"Set `isDisabled` to block every option."`` In `extends`, a type
ending in `Props` or `Attributes` and an element such as `<input>` are set as code for you.

## Rules

### Examples

- `examples[0]`, the hero, is the plain, most common use of the main export with default props.
  Signature or composite showcases are not the hero: FormatToggles, ToolPalette, TaskChecklist,
  SkeletonReveal, ExpandingTabs, PeoplePreview, TextField `floating="notch"`, ScrubStepper, StretchSwitch,
  SegmentedControl `elastic` and AvatarGroup come later, as named examples.
- Then examples for the ways people actually use the component, with original content.
- Cover the states the spec defines, where they apply: sizes, variants or appearances, with an icon,
  disabled, invalid with a message, loading, read-only, controlled, inside a Field or a form, and
  composition with other components.
- One file per example: `docs/<id>/<kebab-id>.tsx` with a default export. Import only from
  `'../../../components'`, plus `react` and `@internationalized/date` when needed. If the layout around
  the component needs a token, import `tokens` from `'../../../tokens.stylex'`: StyleX resolves a var
  only when it is imported straight from a `.stylex.ts` file. The Code tab shows both imports as
  `@/ui/components` and `@/ui/tokens.stylex`, the paths a project would use.
- Write each file as documentation readers will copy: short (aim for 40 lines or fewer), clear names,
  no narrating comments, and `stylex` only for layout around the component, never to restyle it.
  StyleX 0.19 emits nothing for `border`, `background`, `animation` and the other shorthands in spec
  §1.0, so write longhands.
- Content is original and neutral: projects, invoices, team settings, deployments, notes, with invented
  first names. No brands, real people, third-party marks or copy. UI copy is in sentence case, with no
  all-caps labels, no exclamation marks and no placeholder Latin.

### Example entries

```ts
{ id, title, description?, Component, code, align?, minHeight?, stage? }
```

| Field | Rule |
|---|---|
| `id` | kebab-case, unique on the page, and the file name: `./<id>.tsx`. |
| `title` | Short, sentence case: "Sizes", "With icon", "Invalid". |
| `description` | One sentence saying what the example shows. Omit it for the hero. |
| `Component`, `code` | `import Sizes from './sizes'` and `import sizesCode from './sizes.tsx?raw'`. |
| `align` | `'center'` (default), `'start'` or `'stretch'`. Use `'stretch'` for full-width parts such as a table or a form. |
| `minHeight` | Stage height in px. The default is 280 for the hero and 200 for the rest. Give a popup enough room to open inside the stage: a Select, Menu, Combobox or DatePicker usually needs 320 to 420. |
| `stage` | `'subtle'` (default) or `'canvas'`. Use `'canvas'` when a part of the example is itself filled with `bg-subtle` and would vanish on the default stage: Frame, a Card footer, Kbd, an InputGroup addon, a trigger drawn in `bg-subtle`. The canvas stage is `bg-canvas` with a 1px `border-subtle` hairline. |

### API reference

- One `DocApi` per public part, for example `Select` and `SelectItem`.
- List every prop the component itself declares, with its type as written in TypeScript (a shortened
  union is fine), its default, whether it is required, and a one-sentence description. Read the props
  type in the component file: the table must match it exactly.
- Point inherited React Aria props at their type with `extends` (`"React Aria ButtonProps"`,
  `"<input> attributes"`) instead of listing them.

```ts
{
  name: 'Select',
  description: 'A labeled field that opens a list of options.',
  extends: 'React Aria SelectProps',
  props: [
    { name: 'label', type: 'string', required: true, description: 'Names the field. Always shown.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'The height of the field.' },
  ],
}
```

### Accessibility, usage and source

- `accessibility`: 3 to 6 short bullets covering keyboard interaction, roles and ARIA, labeling
  requirements, and reduced motion where it applies.
- `usage`: a minimal import plus JSX that compiles against the current API. It imports from
  `'@/ui/components'`.
- `source`: the exact import closure of the component file or files, as paths relative to `src/ui/`.
  Walk the relative imports, and include the internal helpers and the other components it imports
  (for example `components/Icon.tsx`). `exports`: the public names the page documents.

## How the stage behaves

- The stage shows a component as an app would: it sets the library's base type (16px, line height 1.5,
  Inter), not the docs' reading type, and the reset in `base.css` applies.
- Popovers, menus, dialogs and tooltips render into `body`, outside the stage, and get the same base
  type. The stage never clips, so a popup can leave it; give it room with `minHeight` anyway, so it
  does not cover the next section.
- The theme is on `<html>`, so overlays share it.
- A link with `href="#"` inside an example does nothing when followed, so a demo never leaves the page.
- If an example throws, the stage shows "This example could not be rendered" and the rest of the page
  still works.
- While the Code tab is open, the code block is at least as tall as the stage, so the page below does
  not move. Files longer than 24 lines start collapsed.

## Index template

```ts
import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';

export default defineDoc({
  id: 'toggle',
  title: 'Toggle',
  category: 'Forms',
  description: 'A button that turns one option on or off.',
  source: ['components/toggle.tsx'],
  exports: ['Toggle'],
  usage: `import { Toggle } from '@/ui/components';

<Toggle aria-label="Pin note">Pin</Toggle>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    { id: 'sizes', title: 'Sizes', description: 'Three heights that line up with buttons and fields.', Component: Sizes, code: sizesCode },
  ],
  api: [
    { name: 'Toggle', extends: 'React Aria ToggleButtonProps', props: [] },
  ],
  accessibility: [
    'Renders a `button` with `aria-pressed`, which reflects the on state.',
    'Space and Enter toggle it.',
    'An icon-only toggle needs an `aria-label`.',
  ],
});
```

The names, props and copy above show the shape only; read the real component before you write a page.

## Checking your work

1. Typecheck from the repository root: `npx tsc --noEmit -p .`
2. Look at the page in light and dark, at 1440 and 375 wide (`npm run dev`, then `/ui/#component/<id>`).
   Check for horizontal overflow and console errors, and look at every example. `npm run visual`
   compares every example with the screenshot baseline.
3. Open every popup in its stage, and tab through every example with the keyboard.
4. Before you finish, check:
   - the hero is the plain default, and the common uses are covered;
   - every example file is short, imports only what the rules allow, and shows original content;
   - every popup has room to open, and parts filled with `bg-subtle` sit on a canvas stage;
   - the props tables match the props types exactly;
   - `usage` compiles, and `source` is the full import closure.
