# Otherstates UI design specification

Version 1 · 2026-11-12 · Scope: everything in `src/ui/` (library and docs stage).

This file is the single source of truth for pixel decisions. When it disagrees with component code,
this file wins and the code is the deviation.
Part 1 is the rulebook. Part 2 is the record of an audit against it: each place the library departed
from the rulebook, with its fix. Most of those fixes have landed, and component comments cite them by
number. Part 3 lists API surface still missing.

**Signature components.** Some components are built around one interaction: a spring, a drag, a stack
or a staged reveal. Their geometry sits on the scales of this spec like everything else: heights on the
control and row scales (§1.2), spacing on the rhythm (§1.11), radii from §1.3 and the corner ladder
(§1.17), type from §1.4, and springs under the §1.10 damping floor (no bounce on big things). The ones
that are controls or control containers (Select `morph`, SegmentedControl `elastic`, ScrubStepper,
TextField `floating="notch"`, OtpField cells, ExpandingTabs, FormatToggles, ToolPalette) take the control
radius, so they are pills at Round. Their geometry:

- Select `morph`: an md 40 control; comfortable 40 rows, 2 apart, 14/20 with text 16 from the surface
  edge; default `maxWidth` 256 (`fullWidth` lifts it).
- SegmentedControl `elastic`: sm chips (32 tall, padding 12, 13/18 500) in a 40 tall row, 4 apart.
- StretchSwitch: 64 × 32 sm, 80 × 40 md, 96 × 48 lg, thumb inset 4.
- ScrubStepper: a 48 rail (control xl): 48 sides around a 56 value, icons 20, press .97 over
  `--os-motion-press`.
- Slider `ticks`: a 48 bar field with a 24 thumb.
- TextField `floating="notch"`: an xl field, 48 tall. Value and label sit at the 16 px xl inset; the raised
  label is 12 px (scale .75) centered on the top stroke, with the notch 4 px either side of it, and on round
  corners the notch cuts into the corner arc. The stroke clamps its radius to 24.
- Composer: 240 × 48 → 340 × 116 as default max widths; inside a ChatThread it spans the column (§1.20).
  Attachment chips are sm 32, so the attachment row adds 32.
- OtpField: md cells 40 × 48 (control xl), 8 apart; sm 32 × 40, 6 apart. `lg` and `large` are deprecated
  aliases of md. The verified merge is a squash-and-stretch spring; the cells' travel is clamped, so they
  never overshoot.
- AvatarGroup: faces on the avatar scale (md 40); each overlaps the one before by about a fifth of its
  diameter: 4 / 6 / 8 / 8 / 12 / 16.
- ExpandingTabs: 40 rows on the standard 4 px track.
- PeoplePreview: a 48 row, max 320, with a radius-`lg` popup card.
- ToolPalette: md 40 tools at the control radius, 6 px rail padding, 2 px gaps.
- TaskChecklist, SkeletonReveal, FormatToggles and ToastRegion are staged: each part moves on its own
  beat. ToastRegion is 300 wide with 64 rows, a 14 peek, a 10 fan gap, a scale progression and 28 px
  buttons (with a 44 px touch area).

Everything else in this spec applies to them: color tokens, focus, states, contrast, motion tokens, dark
theme and hit areas.

---

## Part 1: The spec

### 1.0 Authoring rule: longhands only (StyleX)

StyleX 0.19 runs with `styleResolution: 'property-specificity'` and `propertyValidationMode: 'silent'`
by default. In that mode the babel plugin rejects these shorthands and **silently emits nothing**:
`all`, `animation`, `background`, `border`, `borderTop`, `borderRight`, `borderBottom`, `borderLeft`,
`borderInline`, `borderInlineStart`, `borderInlineEnd`, `borderBlock`, plus their aliases
`borderBlockStart`, `borderBlockEnd`, `borderStart`, `borderEnd`, `borderHorizontal` and `borderVertical`.
You get no CSS, no warning and no type error. Other multi-value properties are kept as written:
`padding: '9px 16px'`, `margin`, `inset`, `outline`, `font`, `flex`, `gridArea`, `listStyle` and
`textDecoration`.

Rules:

1. Write longhands only:
   - Borders: `borderWidth` / `borderStyle` / `borderColor`. For one side, use `borderBottomWidth` /
     `borderBottomStyle` / `borderBottomColor`, or the logical `borderInlineStartWidth`… forms.
   - Backgrounds: `backgroundColor`, `backgroundImage`, `backgroundSize`, `backgroundPosition` and
     `backgroundRepeat`.
   - Animation: `animationName`, `animationDuration`, `animationTimingFunction`, `animationDelay`,
     `animationIterationCount`, `animationFillMode` and `animationDirection`.
2. To remove a user-agent border, write `borderWidth: 0` (and `borderStyle: 'none'` on `<hr>` and
   `<fieldset>`). Don't write `border: 0` on `<button>`, `<input>` or `<textarea>` either: the global
   reset already zeroes those.
3. Prefer `outlineWidth` / `outlineStyle` / `outlineColor` / `outlineOffset` to `outline: '2px solid …'`.
   The shorthand works, but the focus spec in §1.8 is written in longhands, so ring changes stay greppable.
4. Enforcement. Clear the list in §2.0, then add `propertyValidationMode: 'throw'` to the `stylex.vite({…})`
   options in `vite.config.ts`. The unplugin forwards unknown options to the babel plugin, and from then
   on a shorthand fails the build. While declarations are still being migrated, use `'warn'` first so
   the shared dev server does not fall over. Do **not** switch `styleResolution` to
   `'legacy-expand-shorthands'`: that changes merge order in every file.
5. No raw colors outside `tokens.stylex.ts` and `theme.ts`. `color-mix()` of tokens is allowed, but
   prefer the named tokens in §1.1. Prefer `forced-colors` system colors, such as `Highlight`, only
   inside `@media (forced-colors: active)`.

### 1.1 Tokens: additions and changes

Existing tokens keep their names and values unless they are listed here.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--os-color-focus-ring` **new** | `#17181a` | `#ffffff` | The one focus ring (§1.8). Theme it to brand blue if you want; it must stay ≥3:1 against canvas. |
| `--os-color-border-control` **new** | `#93928d` (3.12:1 on white) | `#6c6c6c` (3.65:1 on surface) | Unselected checkbox and radio rings, TaskChecklist check ring, Slider unfilled ticks. These are boundaries you need to see the state, so they must meet 3:1. |
| `--os-color-bg-raised` **new** | `#ffffff` | `#2a2a2b` | The selected tile on a track (Tabs, SegmentedControl `connected`, ToggleGroup pills, FormatToggles thumb). In dark it must be lighter than its track. |
| `--os-color-bg-elevated` **new** | `#ffffff` | `#1c1c1e` | Surfaces of popups, dialogs, sheets, drawers and toasts. In dark, elevation means lighter, and today's `#0e0f11` popups sit darker than `bg-subtle`. |
| `--os-shadow-control` **change, dark only** | unchanged | `0 1px 2px rgb(0 0 0 / .25), 0 0 0 1px rgb(255 255 255 / .08)` | The dark .5px/6% ring is invisible. Groups, Kbd and selected tiles lose their edge. |
| `--os-focus-shadow` **deprecate** | unchanged | unchanged | No component uses it once §2.1-A lands. Delete it in the next major. |
| `--os-space-0-5` **new** | `2px` | `2px` | Gaps inside tracks, groups and toolbars. |
| `--os-space-1-5` **new** | `6px` | `6px` | Popup list padding, xs–sm gaps. |
| `--os-space-5` **new** | `20px` | `20px` | Card, dialog and sheet padding, Button md padding. Written as a literal today. |
| `--os-space-10` **new** | `40px` | `40px` | Section rhythm in docs and empty states. |
| `--os-radius-xs` **new** | `4px` | `4px` | Date segments, inline code, tiny chips. |
| `--os-radius-2xl` **new** | `24px` | `24px` | Composer. Replaces `calc(xl + 4px)` and `calc(xl * 1.1)`. |
| `--os-font-size-caption` **new** | `13px` | `13px` | Help and error text, sm controls, table body, toast description. Written as a literal 18 times today. |
| `--os-font-size-body` **new** | `16px` | `16px` | xl controls, card headings, touch-pointer field text. Written as a literal 10 times today. |
| `--os-line-height-xs` / `-sm` / `-md` / `-lg` **new** | `16px` / `18px` / `20px` / `24px` | same | The only line heights components may use (§1.4). |
| `--os-tracking-tight` **new** | `-0.01em` | same | Default letter-spacing for 13–18 px UI text. Written by hand 42 times today. |
| `--os-motion-hover` **new** | `160ms` | same | Color, background and border transitions. Overlay exits. |
| `--os-motion-popup` **change** | `220ms` (was 180) | same | Entry of anchored popups and backdrop fades. |
| `--os-motion-modal` **new** | `280ms` | same | Entry of Dialog, AlertDialog and Command. |
| `--os-motion-sheet` **new** | `360ms` | same | Sheet and Drawer slide-in. Exit is 240 ms. |
| `--os-motion-layout` **new** | `420ms` | same | Size and position changes: panels expanding, the composer growing, meter fills. |
| `--os-motion-slow` **new** | `600ms` | same | Long travel: progress fills, the tab tile, staged reveals. |
| `--os-motion-spin` **new** | `800ms` | same | One period for every spinner. Today it is 700 in Spinner and 800 in Button. |
| `--os-ease-spring` **new** | `cubic-bezier(.24,1.34,.38,1)` | same | Small objects that overshoot: pills, fills, chips. Written by hand 10 times today. |
| `--os-ease-exit` **new** | `cubic-bezier(.4,0,1,1)` | same | Everything that leaves the screen. |
| `--os-z-modal` / `--os-z-toast` / `--os-z-tooltip` **new** | `80` / `110` / `120` | same | Only for layers React Aria does not position. RAC popovers set an inline `z-index: 100000`, so don't put `zIndex` on them. |

`--os-color-bg-muted` (`#f1f1f0` / `#202020`) is **the track color**. The 6 % and 13 % ink `color-mix()`
tracks are retired in its favor; the 6 % mix and `#f1f1f0` differ by less than 1 %.

### 1.2 Control sizes

| Size | Height | Pill pad-x | Rect pad-x | Field text inset¹ | Gap | Icon | Text (size/line/weight) | Radius (§1.3) |
|---|---|---|---|---|---|---|---|---|
| xs | 24 | 10 | 8 | 8 | 4 | 14 | 12/16/500 | `control − md + sm`: 6 Standard, pill Round |
| sm | 32 | 12 | 10 | 12 | 6 | 16 | 13/18/500 | `radius-control`: 10 Standard, pill Round |
| **md** (default) | 40 | 20 | 12 | 14 | 8 | 16 | 14/20/500 | `radius-control` |
| lg | 44 | 24 | 16 | 16 | 8 | 18 | 15/20/500 | `radius-control` |
| xl | 48 | 28 | 16 | 16 | 8 | 20 | 16/24/500 | `radius-control` |

¹ Inset is measured from the outer edge, so it includes the 1 px border. With a 1 px border,
`paddingInline` is inset − 1: sm 11, md 13, lg 15, xl 15. Field values are weight 400. On
`@media (pointer: coarse)` every text-entry field renders its value at 16 px; below that, iOS zooms the
page when the field takes focus.

- **Heights are outer heights.** The shell of a control owns the height, and a bordered shell's inner
  `<input>` is `height: 100%` with no `minHeight`. Today the inner input carries `minHeight: 40` inside a
  bordered shell, so the shell measures 42 px.
- **The icon side of a pill or rect** uses the next smaller padding: md pill 20 → 16 on the icon side.
  Pills 8 / 10 / 16 / 20 / 24 and rects 6 / 8 / 10 / 12 / 12 (xs → xl), written once in `size.ts` as
  `pillIconPadding*` and `rectIconPadding*`; Button, Toggle, Pagination and the Composer chips compose them,
  and no component keeps its own copy of the table.
- **Icon-only** controls are square: width = height, padding 0.
- **Inline buttons inside a field** (chevron, clear, steppers, calendar, the spinner slot) are size sm
  (32 × 32) from md up, centered in the shell: inset 4 at md, 6 at lg and 8 at xl, so a circle stays
  concentric with a pill shell. sm fields hold a 24 × 24 button and xs fields a 16 × 16 one
  (`--os-size-2xs`), inset 4. Radius max(`sm`, control − 4): 6 at Standard, a circle at Round. Every field
  uses this geometry (`fieldButtonSizeStyles` in `control.ts`): InputGroup, Combobox, Autocomplete,
  NumberField and DatePicker.
  - States: icon `fg-muted` → `fg-base` and fill `bg-interactive-primary` on hover;
    `bg-interactive-secondary` plus scale .97 pressed; a disabled button gets no hover and no press; the
    hit area is 24, 44 on coarse pointers (§1.14). Focus is the inset ring.
- **Who uses which size by default:**
  - md 40: Button, Input, Combobox, Autocomplete, NumberField, InputGroup, DatePicker, Select
    `appearance="field"`, Textarea (min-height 80), Toggle, ToolbarButton, Tabs rows.
  - sm 32: items inside a 40 px track (ToggleGroup, SegmentedControl `connected`), Pagination items,
    inline field buttons, Calendar navigation, Composer tools, Toast actions.
  - xs 24: Kbd (md), Badge (md).
  - xl 48: TextField. It is the 48 px field today and becomes `Input size="xl"`.
- **Row scale inside surfaces:**

  | Row | Height | Used by |
  |---|---|---|
  | compact | 32 | choice rows (checkbox, radio, switch), compact table header, legend rows, one-line washes |
  | default | 36 | menu, listbox and command items, empty and loading rows, nav rows, calendar day cells, compact table body |
  | comfortable | 40 | Select `morph` rows, table header |
  | table body | 48 | table body rows, disclosure rows (Accordion, Collapsible), list washes in agent cards |

  32, 40 and 48 are written `--os-size-sm`, `-md` and `-xl`. 36 has no token: write it as a literal
  (`rowHeights.default` in `size.ts` names it).
- **Signature components are on this scale too.** A showcase control larger than md is xl 48
  (ScrubStepper, OtpField md cells, StretchSwitch lg, Slider `ticks`, the notch TextField); a tool in a
  toolbar is md 40 (ToolPalette); a list row is 36 or 40 (Select `morph` rows).

### 1.3 Radius

- **Scale:**

  | Token | Value | Used for |
  |---|---|---|
  | `xs` | 4 | date segments, inline code |
  | `sm` | 6 | checkbox (replaces 5.76), Kbd, menu shortcuts, minimum inner radius; xs controls on a ladder |
  | `md` | 10 | list items, tooltips; equals `control` on a ladder |
  | `lg` | 16 | popups, dialogs, sheets, fieldsets, calendar panels, scroll areas, table wrappers, alerts |
  | `xl` | 20 | cards, empty states, toasts, showcase cards (FormatToggles, TaskChecklist, SegmentedControl `withSurface`) |
  | `2xl` | 24 | Composer |
  | `full` | 999 | intrinsic shapes: Switch, Radio, Avatar, Slider track and knob, Spinner, Progress and Meter bars, Skeleton pills |
  | `control` **new** | 9999 | the one corner every control shares (below). 9999 is Round, the shipped default: every control a pill. A corner ladder sets it to `md`: Tight 6, Standard 10, Soft 14 |

- **The control radius** (`--os-radius-control`) gives buttons and fields one shape language: all pills
  (Round) or all the current corner. By kind:
  1. **Controls** take it by size: sm, md, lg and xl `var(--os-radius-control)`; xs
     `calc(control − md + sm)`, which is `sm` on a ladder (6 Standard, 2 Tight) and still a pill at Round
     (`radiusStyles`, `components/internal/size.ts`). Button (every appearance but `link`, which keeps
     `xs`), Toggle, ToolbarButton, every field shell (Input, Select `appearance="field"`, Combobox,
     Autocomplete, NumberField, InputGroup, DatePicker, TextField including `floating="notch"`),
     Pagination items, Badge (sm and md take the xs rule, lg the control radius), calendar days and their
     navigation, Toast actions.
  2. **Nested in a control:** max(`sm`, control − inset). Inline field buttons and InputGroup buttons
     (inset 4), chips in a Combobox (their remove button max(`xs`, control − 10)). A chip in a Combobox is
     inset (shell − chip) / 2 from the outer edge: 4 sm, 8 md, 10 lg, 12 xl; xs shells hold a 20 px chip,
     inset 2. Pills inside a pill stay concentric.
  3. **Control containers** add their inset: control + 6 for every track and shell: the Group shell (also
     Toolbar, ToggleGroup `raised` and the ToolPalette rail) and the tracks of Tabs, ExpandingTabs,
     SegmentedControl, ToggleGroup and FormatToggles. Tiles on a track keep the nesting rule against it:
     control + 2, ExpandingTabs included. ToolPalette tools take the control radius. On a ladder these equal
     `lg` (lg = md + 6), so Standard is unchanged; at Round they are pills. The Select `morph` is a control while closed: min(control, 20), so
     6, 10 or 14 on a ladder and a pill at Round, like Button and Input. Open, it becomes a popup:
     min(control + 10, `xl`), never a stadium; its rows take that less the 6 px inset.
  4. **Surfaces** keep `lg` and `xl`: popovers, menus, dialogs, sheets, drawers, toasts, tooltips, cards,
     frames, the calendar panel, table wrappers, scroll areas and alerts. Items inside a popup keep the
     nesting rule from the popup.
  5. **Intrinsic shapes** never take it: Switch, Radio, Avatar, Slider, Spinner, Progress and Meter bars,
     Skeleton. Checkbox and Kbd stay `sm`.
  6. **Tall fields** cap it: Textarea, a multiline InputGroup and a wrapping chip Combobox take
     min(control, `lg`), so they never become a stadium. OtpField cells take control + 2 (sm cells
     control). Composer keeps its own radius.

- **Nesting rule:** inner radius = max(`radius-sm`, outer radius − inset). Examples: a popup at 16 with
  6 px padding gives 10 px items; Select's `morph` surface at 20 with 6 px inset gives 14 px rows; a tab
  track at 16 with 4 px padding gives 12 px tabs; Frame at 16 with 8 px padding gives an 8 px body. Write
  the rule as `calc(var(--outer) - var(--inset))`, not as a literal. Around controls, write it from the
  control radius (`calc(var(--os-radius-control) + 2px)` for a tile on a track) so Round stays a pill.
- **Containers grow from the control, not the other way round.** A Group shell or a track is control +
  inset, so a pill inside it is concentric with a pill shell, and a 10 px field with a 16 px shell. Nothing
  inside a Group changes shape; `NestedRadiusContext` (`components/internal/nest.ts`) is kept only as a
  no-op export.
- **One radius per control.** A state never changes the radius: Tabs today drops to 6 px while focused.
  A pill stays a pill in every state.
- **No fractional or off-scale radii.** Off-scale values in use today: 3 px, 5.76 px, 7 px, 12 px, 14 px as
  a literal, 15 px, 18 px, 22 px and `calc(xl * .6)`. They are only allowed when the nesting formula
  produces them.

### 1.4 Type

- **Family:** Inter (`--os-font-family`), or the platform UI face when a customization selects it (§1.17). Nothing else. `<kbd>` must set it too, because the user-agent default
  is monospace.
- **Scale for component text:**

  | px | Use |
  |---|---|
  | 12 | badges, tooltips, group labels, table headers, captions |
  | 13 | help and error text, sm controls, table body, secondary lines |
  | 14 | body, labels, md controls, menu items |
  | 15 | lg controls |
  | 16 | xl controls, card and empty headings, touch field values |
  | 18 | overlay titles |
  | 20 | numeric displays (ScrubStepper, OtpField, the Progress ring figure) |

  The 20 has no token: write `fontSize: 20` with `// os-allow raw-type: spec 1.4 numeric display`, at
  weight 500, −0.02em, tabular. Display figures above it use `xl` (22) or `2xl` (29). 11 px and 10 px are
  not allowed: Calendar weekdays and the ExpandingTabs badge are 12.
- **Line height** is always an integer px value from `--os-line-height-*`: 16 for 12 px text, 18 for 13,
  20 for 14 and 15, 24 for 16 and 18. Unitless 1.2, 1.35, 1.4 and 1.5 are banned: they give fractional
  boxes (18.9 px labels, 19.5 px help text), which put rows on half pixels. Single-line controls may use
  `lineHeight: 1` only when the control's height is fixed.
- **Weight:** 400 for values, list items, body and descriptions. 500 for labels, buttons, tabs, headings
  and the selected option. 600 and 700 are for docs prose and numeric emphasis only. Menu items move
  from 500 to 400 so that they match listbox options.
- **Tracking:** `--os-tracking-tight` (−0.01em) on 13–18 px, overlay titles included. 0 on 12 px and
  below (reset it on 12 px text inside tracked prose). −0.02em on 20 px and above.
- `font-variant-numeric: tabular-nums` on every changing number: values, counters, pagination, table
  numbers, steppers, timers.

### 1.5 Borders and fills

- **Fill first.** A control or surface is defined by its fill. Add a 1 px hairline only where it explains
  a boundary that fill cannot. The allowed hairlines are:
  1. **Text-entry shells** (Input, Textarea, Combobox, Autocomplete, NumberField, InputGroup, DatePicker,
     Select `appearance="field"`): `border-subtle` at rest, `border-muted` on hover. These are the only
     controls that wear a border at rest.
  2. **Overlay surfaces** (popups, dialogs, sheets, drawers, toasts, tooltips in dark): `border-subtle`
     together with `shadow-popup`. In dark, shadows don't show, so the hairline is the edge.
  3. **Structural dividers that separate different kinds of content:** accordion items, the table head
     from the body, a command search field from its results, input-group addons, menu separators.
     Never between body rows of a table and never between list items.
  4. **Opt-in outlines:** Fieldset, Calendar standalone, `variant="outline"` on Card and Frame, and
     `bordered` on ScrollArea.
- **Shadows.** `shadow-control` marks a raised control inside a group: a selected tile, a keycap, a
  group shell. `shadow-popup` marks elevation. Never use both on one element, and never use a shadow
  plus a border as the edge of a control.
- **Hairline colors:**
  - `border-subtle` for dividers and shells at rest.
  - `border-muted` for shells on hover and for separators inside dense toolbars.
  - `border-control` for selection indicators.
  - `border-error` for invalid shells.
  - `border-disabled` for disabled shells.

  No `color-mix()` hairlines: Accordion's 12 % and the notch field's 32 % move to tokens.

### 1.6 Surfaces and levels

| Level | Token (light / dark) | Sits on | Holds |
|---|---|---|---|
| canvas | `bg-canvas` `#fff` / `#0a0a0a` | n/a | page |
| subtle | `bg-subtle` `#f7f7f6` / `#1a1a1a` | canvas | sunken sections, docs stage, card footer |
| surface | `bg-surface` `#fff` / `#0e0f11` | subtle, or canvas with a hairline | cards, fields, tiles |
| muted | `bg-muted` `#f1f1f0` / `#202020` | canvas or surface | tracks, icon tiles, keycaps |
| raised | `bg-raised` (new) | muted (tracks) | selected tile |
| elevated | `bg-elevated` (new) | anything, with backdrop or shadow | overlays |

Rules:

- In light, canvas and surface are both `#fff`, and in dark they differ by 1.03:1. **A surface placed
  directly on canvas must carry a hairline or sit inside a subtle section.** Card, Frame and Collapsible
  therefore get `variant: 'filled' | 'outline'`, with `filled` meant for subtle backgrounds.
- **Never place a component on its own fill.** If a component's fill is `bg-subtle` (Frame outer, Card
  footer, Kbd, input-group addon), it vanishes on a `bg-subtle` docs stage. Those docs examples need a
  canvas stage, or the component moves to `bg-muted`.
- Hover and selected fills must step **toward fg**: lighter → darker in light, darker → lighter in dark.
  A hover that moves toward canvas is a bug.

### 1.7 Text colors and contrast

| Role | Token | Light on canvas / subtle | Dark on surface / subtle |
|---|---|---|---|
| Primary text, values | `fg-base` | 17.8 / 16.6 | 19.2 / 17.4 |
| Secondary: descriptions, placeholders, inactive tabs, field icons | `fg-muted` | 6.81 / 6.35 | 9.25 / 8.4 |
| Tertiary: meta, captions, separators that carry meaning | `fg-subtle` | 5.11 / 4.77 | 6.81 / 6.19 |
| Disabled | `fg-disabled` | 3.75 (exempt) | 4.99 (exempt) |
| Error, info, success and warning text on their tint | `fg-*` on `bg-*` | ≥4.6 | ≥7.0 |

- Text ≥4.5:1 against the surface it sits on. Placeholders are text, so placeholders use `fg-muted`:
  Composer's 52 % mix measures 3.60:1 and fails.
- Icons, indicator rings and slider ticks that carry state must be ≥3:1. Hence `border-control`: the
  checkbox and radio rings at 28 % ink measure 1.86:1 today.
- Field borders (1.23:1) are exempt: a field is identified by its label and fill, and its focus edge
  is 17:1. Never use a field border as the only cue for state.
- Replace the free `color-mix()` text tints (72 %, 55 % and 52 % ink) with `fg-muted`.
- On a colored fill, use static colors: `fg-static-light` on `bg-danger-secondary` measures 5.47:1.
  Black text on `bg-danger-primary`, which is what Button `destructive` does at rest, is retired.

### 1.8 States

**Hover.** Wrap hover in `@media (hover: hover)`. Transition `--os-motion-hover` with `--os-ease-settle`.

| Element | Rest → hover |
|---|---|
| Transparent compact controls and list items (ghost Button, Toggle, ToolbarButton, inline field buttons, menu, listbox and command items, Pagination, calendar days) | → `bg-interactive-primary` (light `#f1f1f0`, dark `#303030`) |
| Large rows (table row, Collapsible header) | → `bg-subtle` |
| Neutral filled (Button `secondary`, chips) | `accent-subtle` → `accent-muted` |
| Primary | `accent-moderate` → `accent-bold` |
| Field shells | border `border-subtle` → `border-muted` |
| Text-only (inactive tabs, segments, pills, breadcrumb, sort header, accordion icon) | `fg-muted` → `fg-base` |

**Pressed.** Fill steps once more (`bg-interactive-secondary`, `accent-strong`, `accent-dim`) over
`--os-motion-press`. Scale `.97` for controls ≥24 px and `.9` for indicators of 20 px or less. Nothing
else: `.966`, `.96`, `.93` and `.92` are retired. No scale on list rows or with reduced motion.

**Focus-visible: one ring.**
```
outlineStyle: solid; outlineWidth: 2px; outlineColor: var(--os-color-focus-ring); outlineOffset: 2px;
```
- The radius follows the element's own radius, and it is never changed on focus.
- The ring shows only for keyboard modality: RAC `isFocusVisible`, or `:focus-visible` on native elements.
- Two placements of the same ring, and no others:
  - **Edge ring for text-entry shells:** `borderColor: focus-ring` plus
    `boxShadow: inset 0 0 0 1px focus-ring`. It reads as a 2 px edge. It shows on every focus, because the
    caret is already visible, and an invalid shell uses `border-error` instead.
  - **Inset ring (`outlineOffset: -2px`):** only for items whose neighbors are less than 4 px away or
    which sit inside an `overflow: hidden` parent. That covers tabs in a track, pills, toolbar tools,
    TaskChecklist rows and table cells.
- Virtual-focus widgets show the hover fill as their focus state, with no ring: menu, listbox, command
  list and the Select `morph`.
- No `box-shadow` halos. The 3 px 24 % blue `--os-focus-shadow` measures 1.25:1 against white. Button
  today draws the halo **and** the reset outline, two rings at once.
- `base.css`'s fallback `:focus-visible` moves from offset 3 to offset 2 so that it matches.

**Selected.** Three patterns, chosen by context:

1. **Tile on a track** (Tabs, SegmentedControl `connected`, ToggleGroup pills, FormatToggles, ExpandingTabs):
   - track `bg-muted`, padding 4, gap 2, radius control + 6
   - tile `bg-raised` plus `shadow-control` (light only), radius from the nesting rule (control + 2)
   - text `fg-base` 500; unselected text `fg-muted` 500
   - a tile that moves between positions travels more than 40 px, so it settles without visible
     overshoot: `--os-ease-settle` (SegmentedControl, over `--os-motion-layout`) or a physics spring at a
     damping ratio of .8 or more (ExpandingTabs, FormatToggles). A fill that scales in place (ToggleGroup pills) may
     keep `--os-ease-spring`.
2. **Toggled object** (Toggle, ToolbarButton, calendar day, `elastic` segments, checkbox, radio and switch
   on): `accent-moderate` fill, `accent-on-accent` content. Never `fg-base`/`bg-surface` directly.
   ToolPalette may use `--os-color-selection` blue as its single exception, with `fg-static-light`
   content.
3. **Current location** (Pagination, Sidebar nav rows, the ReviewQueue master list):
   `bg-interactive-primary` fill, `fg-base` 500, no shadow. Hover on the current item:
   `bg-interactive-secondary`.

The selected option in a list gets a check icon (16 px, `fg-base`) at the end and weight 500, and no fill.

**Disabled.** Swap colors; don't fade.
- text `fg-disabled`
- fills `bg-disabled`
- borders `border-disabled`
- transparent controls stay transparent
- the label of a disabled control also goes `fg-disabled`
- `cursor: default`; no hover and no press

`opacity: .4` is allowed only for composite visuals that have no tokenized parts: StretchSwitch, Slider
`ticks`, ToolPalette tools and avatars. The opacities in use today are .35, .4 and .5 on seven
components.

**Invalid.**
- **Shells:** 1 px `border-error`; hover keeps `border-error`. Focus shows the edge ring in `border-error`.
  No background tint. Today TextField, Textarea and Select add `bg-error`, and TextField adds a 2 px edge
  at rest.
- **Indicators** (checkbox, radio): their ring takes `border-error`.
- **Borderless shells** (Select `morph`, OtpField cells, Composer): `boxShadow: inset 0 0 0 1px border-error`.
- **Message:** 13/20 `fg-error`, 8 px below the control. It **replaces** the help text, so the two never
  show together, and it is linked with `aria-describedby`.
- **Timing:** invalid styles appear on blur or submit (`validationBehavior="aria"`), never on first
  keystroke.

**Loading.**
- The control keeps its size and fill. The label goes `opacity: 0` and stays in the layout.
- A spinner sits centered, sized like the control's icon (14/16/16/18/20), in `currentColor`.
- `aria-busy="true"`; presses are ignored; `cursor: default`. Never `progress` or `wait`: the spinner already shows the wait, and the native cursor would add a second spinning wheel.
- Fields put the spinner in the trailing slot. Lists show a 36 px "Loading…" row, 14/20 `fg-muted` on the
  item inset, with a 16 px spinner 8 before the label (§1.9 Items).
- Button today switches the fill to gray while loading, which reads as disabled. It keeps its appearance
  under this spec.

**Read-only.**
- shell `bg-subtle`, border `border-subtle` (no hover change)
- text `fg-base`
- steppers, chevrons and clear buttons hidden
- focus ring still shown; the value stays selectable
- `aria-readonly`

### 1.9 Overlays

| Property | Spec |
|---|---|
| Surface | `bg-elevated`, 1 px `border-subtle`, `shadow-popup`. Radius `lg` 16 for popups, dialogs, sheet corners and drawer corners; `xl` 20 for Toast; `md` 10 for Tooltip. |
| Padding | List popups 6. Content popups (Popover, PreviewCard): 16. Dialog, AlertDialog, Sheet, Drawer: 20. |
| Items | Height 36, radius 10 (16 − 6), padding-inline 10, so text sits 16 px from the surface edge. Gap between items 2. Icon 16 in `fg-muted` with an 8 px gap. Shortcut: Kbd `sm` at the end. Check or submenu: Icon 16 `fg-muted` at the end, `marginInlineStart: auto`. Empty and loading rows: 36 tall on the item inset (padding-inline 10), 14/20 `fg-muted`, a 16 px spinner 8 before the label (`overlayItemStyles.empty`; Combobox and Autocomplete use the same row). |
| Group label | 12/16 500, `fg-muted`, padding 6 10. |
| Separator | 1 px `border-subtle`, `marginBlock: 4`. |
| Size | Menus min-width 200 and max-width `min(320px, 100vw − 24px)`. Anchored lists take the trigger width (wrap the shell in RAC `Group` so `--trigger-width` measures the shell). Max-height `min(var(--available-height), 320px)`, with the list scrolling inside. |
| Placement | Offset 6 for every anchored popup and the tooltip. 12 px viewport margin. Flip and shift via RAC. A tooltip on a row inside a padded panel (Sidebar collapsed) offsets by the panel inset plus 6 (8 + 6 = 14), so it sits 6 from the panel edge; the ToolPalette flyout does the same from its rail (6 + 6 = 12). |
| Widths | Tooltip max 240. Popover 256 by default (`width` prop). Dialog and AlertDialog 400 (sizes 320/400/560). Command 480. Sheet 384 on the left or right. Drawer top or bottom: 100 %, max 640. |
| Header | Title 18/24 500 at `--os-tracking-tight` (§1.4: tight on 13–18 px), then description 14/20 `fg-muted`, 4 px apart, start-aligned. Popover title 14/20 500, description 13/18. |
| Body and footer | 16 between sections. Footer: one row, end-aligned, gap 8, Buttons size md. Below 480 px of viewport the footer stacks full-width, with the primary action at the bottom. |
| Backdrop | `bg-overlay` (light 28 % ink, dark 60 % black), no blur. Fades in over `--os-motion-popup`. |
| Enter, anchored | `--os-motion-popup` (220) with `--os-ease-settle`. Opacity 0 → 1, scale .96 → 1, plus a 4 px translate **away from the trigger**: bottom placement starts at `translateY(-4px)`, top at `+4px`, left and right on X. `transform-origin` sits on the trigger side. |
| Enter, modal | `--os-motion-modal` (280) with ease-settle: `translateY(8px) scale(.98)` → none. Command enters from `translateY(-8px)` because it is top-anchored. |
| Enter, sheet and drawer | `--os-motion-sheet` (360) slide from the edge with ease-settle. |
| Exit, all | `--os-motion-hover` (160) with `--os-ease-exit`: opacity → 0, scale .98, no translate. Sheet and Drawer slide out over 240; Tooltip and the AvatarGroup name tip leave over 120 (`--os-motion-press`). Never play the entry keyframes in reverse at full length: today menus exit over 260 and dialogs over 280. |
| Tooltip | 32 tall (min-height `--os-size-sm`), padding 8 12 from the outer edge, 12/16 500, radius `md`. 160 in (opacity, 2 px translate, scale .96), 120 out (`--os-motion-press`). Delay 250, close delay 100. The AvatarGroup name tip is the same chip, and the chart readout and AnchoredToast take the same 8 / 12 padding. |
| Reduced motion | Opacity only, 120 ms or less, written `--os-motion-press`. No transforms. |
| Layering | RAC popovers: don't author `zIndex` (RAC writes 100000 inline). Modal layers use `--os-z-modal`, the toast region `--os-z-toast`, and non-RAC floating layers such as Composer suggestions and the Select `morph` use `--os-z-tooltip` − 10. |

### 1.10 Motion

| Token | ms | Easing | Used for |
|---|---|---|---|
| `--os-motion-press` | 120 | settle | press scale, fill step |
| `--os-motion-hover` | 160 | settle (in) / exit (out) | hover colors, focus, overlay exits, tooltip entry |
| `--os-motion-popup` | 220 | settle | anchored popup entry, backdrop, small reveals (chevron rotation, check draw) |
| `--os-motion-modal` | 280 | settle | dialog entry |
| `--os-motion-sheet` | 360 | settle | sheet and drawer entry (exit 240 with `ease-exit`) |
| `--os-motion-layout` | 420 | settle for surfaces and panels; spring only for small objects | height and width changes: Accordion and Collapsible panels, the Composer, the SegmentedControl tile (settle); meter fills, segments, fills (spring allowed) |
| `--os-motion-slow` | 600 | settle | progress fills, tab tiles, staged content reveals |
| `--os-motion-spin` | 800 | linear, infinite | every spinner |
| skeleton breathe | 1400 | ease-in-out, infinite | Skeleton only, paused under reduced motion |

- **Durations come from tokens only.** 140, 180, 200, 260, 300, 320, 460, 560, 700 and 1100 are retired.
  The two spec values with no token are the sheet exit (240) and the skeleton breathe (1400); write them
  as named constants with a comment. JS timers that must match a CSS exit read `motion` from
  `components/internal/spring.ts`, never a literal.
- **No bounce on big things.** Surfaces and large travel (popups, the Select `morph`, sheets, panels, cards,
  toasts, the Composer, tiles that move more than about 40 px) settle without visible overshoot: at most
  about 2 %, and never a second swing. They take `--os-ease-settle` (or `--os-ease-exit` when leaving),
  never `--os-ease-spring`. `--os-ease-spring` is for small objects only: pills, chips, fills, knobs,
  thumbs, dots and check pops.
- **Physics springs** (`useChoiceSpring`, `useSurfaceSpring`): the damping ratio is
  damping / (2 × √stiffness). Big surfaces take their constants from `springs` in
  `components/internal/spring.ts`, at .85 or more: `springs.surface` 380/34 (toasts, profile cards),
  `springs.surfaceOpen` 520/39 and `springs.surfaceClose` 420/35 (the Select `morph`), under 1 % overshoot.
  Tiles that travel use .8 or more (ExpandingTabs at stiffness 260, FormatToggles at 420: under 2 %). Raise damping,
  keep stiffness, so the speed stays the same. Small objects keep their own springs, overshoot
  included: the checkbox fill (500/20) and the SegmentedControl `elastic` chips (set by `wobble`).
- **Animate the object that changes.** Color changes never take longer than
  160 ms, and layout changes never less than 220 ms.
- **Reduced motion:** every transition and keyframe has a `prefers-reduced-motion: reduce` branch that
  removes transforms and keeps opacity at 120 ms or less (`--os-motion-press`, or `motion.reduced` in JS).
  Spinners stop rotating and show a static three-quarter ring.

### 1.11 Spacing

**The rhythm.** Spacing uses these steps only, written as `--os-space-*` tokens, and the same step does
the same job everywhere:

| px | Token | Job |
|---|---|---|
| 2 | `space-0-5` | between tiles in a track, group or toolbar; between popup list items and nav rows; a second line under a row's first (14/20 over 13/18) |
| 4 | `space-1` | title to its description; washes in a list; choice rows (vertical); badge and kbd internals; icon–text gap in xs controls; track padding |
| 6 | `space-1-5` | popup list padding; group shell and toolbar padding; icon–text gap in sm controls and chips |
| 8 | `space-2` | label to control; control to help text; icon–text gap in md+ controls; buttons and chips side by side |
| 12 | `space-3` | items in a row (meta, toolbar clusters); indicator to choice label; inline padding of rows, washes and floating readouts (tooltip, chart readout, AnchoredToast) |
| 16 | `space-4` | parts inside a card or panel (Card header to body at every size, Dialog); card padding at sm; popover padding; field to field; toolbar to content, columns and panes in a region |
| 20 | `space-5` | card padding md; dialog, sheet and drawer padding; showcase cards (FormatToggles) |
| 24 | `space-6` | sections inside a page or a large card; last field to actions; card padding lg; page gutters |
| 32 | `space-8` | page sections; settings sections; chat messages |
| 40+ | `space-10`… | empty states, docs rhythm |

- **Formula values** are allowed and never moved to the scale: the §1.2 control table (pill pad-x
  10 / 12 / 20 / 24 / 28, rect pad-x 8 / 10 / 12 / 16, the field inset less its 1 px border 7 / 11 / 13 / 15),
  the §1.9 item padding 10, and whatever the nesting rule produces. Write them from tokens with `calc()`
  (`calc(var(--os-space-4) - 1px)`, `calc((var(--os-size-xl) - var(--os-line-height-lg)) / 2)`); where
  that is not possible, keep the literal with `// os-allow raw-space: spec 1.2 <why>` on the line above.
- **Negative values** are `calc(-1 * token)` or a difference of tokens, never a raw negative.
- Every other off-scale value (3, 5, 7, 9, 10, 11, 13, 14, 15, 18, 22 …) moves to the step that does the same
  job. `npm run check` enforces this, with the raw-radius, raw-type and raw-shadow rules, in the library
  itself as well as in product code.

**Forms.**

| Between | px |
|---|---|
| Label → control | 8 |
| Control → help or error text | 8 |
| Group label → first choice | 8 (label `marginBlockEnd` 4 plus list gap 4) |
| Choice rows (checkbox, radio, switch), vertical | 4 (32 px rows, so a 36 px pitch) |
| Choice items, horizontal | 16 |
| Indicator → choice label | 12 |
| Field → field (Form, Fieldset) | 16 |
| Fieldset padding / legend inset | 16 / legend `paddingInline 4`, `marginInlineStart −4` |
| Section → section | 24 |
| Last field → actions row | 24 |

- **Labels:** 14/20 500 `fg-base`. Use the label component on every control, choices included.
- **Help text:** 13/20 `fg-muted`.
- **Required:** append ` *` in `fg-muted` and set `aria-required`. When most fields are required, use
  "(optional)" on the rest instead.
- **One field system:** Field, Label, Input and the help/error slots, driven by context. TextField,
  Textarea, Select, DatePicker, RadioGroup, CheckboxGroup and Switch read the same context instead of
  each rendering its own label, hint and error.

**Label alignment.** Field labels, descriptions and error messages start at the field's outer edge at every
corner setting, Round included; they are not indented to the curve or to the value text (decided 2026-11-12).

**Settings pages** (the settings template is the reference):

- Three spacing tiers: 8 inside a field (label to control), 20 between fields and between rows, 32 between
  sections. The section gap must beat the card's own 20px padding, or neighboring cards read as one block.
- Typed fields sit in a two-column grid (16 apart, one column on phones) inside a column of at most 768px;
  they never stretch across a wide screen.
- On/off settings are rows: label and description leading, the switch at the end (`Switch variant="row"`),
  16 above and below the text, a `border-subtle` hairline between rows and none outside the list.
- One save model per card. Switches and single choices save as they change, and the card description says
  so; typed fields save from the card footer, a hint on the start side and one small button on the end
  side. The action never floats in the body. Destructive cards follow the same footer layout.

### 1.12 Density: tables and lists

- **Table, comfortable (default):**
  - header 40 px: 12/16 500 `fg-muted`, with a 1 px `border-subtle` below
  - body rows 48 px: 13/20 `fg-base`, no row dividers, hover `bg-subtle`
  - cell padding-inline 12; the first and last cells get 16 so they align with a 16 px container radius
  - numbers `tabular-nums` and end-aligned
- **Table, compact:** header 32, body 36, the same type.
- **Body text** wraps unless `nowrap` is requested. Truncation is opt-in per column.
- **Lists:**

  | List | Row | Gap | Container padding |
  |---|---|---|---|
  | menu, listbox, command | 36 | 2 | 6 |
  | nav (Sidebar) | 36 (44 coarse) | 2 | 8 |
  | choice lists | 32 | 4 | — |
  | TaskChecklist | 36 | 2 | — |
  | list washes (agent cards) | 48 | 4 | — |

- **Nav rows** share the menu item geometry: 36 tall (44 on coarse pointers), padding-inline 10 (14), an
  8 px icon gap, 2 between rows. A collapsed Sidebar is 52 wide (36 + 2 × 8), 60 on coarse pointers.
- **Empty list state:** a 36 px row on the item inset, 14/20 `fg-muted` (§1.9 Items).

### 1.13 Dark theme

1. **Elevation is lighter.** Overlays use `bg-elevated`, and selected tiles use `bg-raised`, lighter than
   their track. A selected tile darker than its track reads as a hole: Tabs, ExpandingTabs and the ToggleGroup
   pills do this today.
2. **Shadows don't separate in dark.** Every elevated surface keeps its 1 px `border-subtle`, and
   `shadow-control`'s ring is 1 px at 8 % white (§1.1).
3. **Primary inverts** (white fill, ink text) through the accent tokens. Never hard-code white or black.
   ToolPalette's `#fff` and TaskChecklist's `#ffffff8c` move to `fg-static-light` and
   `color-mix(in srgb, var(--os-color-fg-static-light) 55%, transparent)`.
4. **Status** uses the dark tint and foreground pairs, all ≥7:1. Destructive is
   `fg-static-light` on `bg-danger-secondary` in both themes.
5. **Fills step toward white** on hover and selection: `#0e0f11` → `#1a1a1a` → `#202020` → `#303030` →
   `#393939`. A hover that darkens is a bug; compact Switch hover does this today.
6. **No opacity-based states.** Opacity on dark surfaces produces muddy, unthemed grays.
7. **The focus ring is white** (`--os-color-focus-ring` dark), at 19.8:1 on canvas.
8. **Check every new token pair in both themes** against §1.7.

### 1.14 Touch targets

- **Hit areas:** every interactive element has one of at least 44 × 44 under `@media (pointer: coarse)`
  and 24 × 24 under fine pointers (WCAG 2.5.8). The visual size does not change. Implementation: the
  element is `position: relative`, and a `::after` pseudo-element with
  `{ content: ''; position: absolute; inset: 50% auto auto 50%; width: max(100%, 44px);
  height: max(100%, 44px); transform: translate(-50%, -50%) }` provides the hit area.
- **Adjacent targets** whose expanded areas would overlap expand only along the free axis.
- **Exempt:** text links inside sentences, and date segments, which belong to a group of 40 px or more.
- **Below 24 px today:**

  | Element | Size (px) |
  |---|---|
  | ToolPalette "More shapes" notch | 8 × 8 (now with a 24 px hit area on the tool corner) |
  | Breadcrumb links | 19.6 tall |

- **Below 44 px today (need the coarse-pointer expansion):** Button sm; ToggleGroup items (32); Toast
  actions (28); Calendar nav (32) and days (36); field inline buttons (32 × 32); Composer tools (32);
  Pagination (32); menu items (36).

### 1.15 Icons

- **Source:** use the `Icon` component (24 grid, stroke 1.7) for every glyph. **Inline `<svg>`
  glyphs to replace**, with the Icon each one should become:

  | Inline glyph today | Replace with Icon |
  |---|---|
  | Accordion plus | `plus` |
  | Alert status glyphs | `info`, `check-circle`, `alert-triangle`, `alert-circle` |
  | Badge glyphs | the same status icons |
  | Pagination chevrons | `chevron-left`, `chevron-right` |
  | DatePicker calendar and month arrows | `calendar`, `chevron-left`, `chevron-right` |
  | NumberField "−" / "+" text glyphs | `minus`, `plus` |
  | ScrubStepper glyphs | `minus`, `plus` |
  | Menu "›" / "✓" text glyphs | `chevron-right`, `check` |
  | Table ↑ ↓ ↕ text glyphs | `arrow-up`, `arrow-down`, `chevrons-up-down` |
  | Toast status glyphs | the status icons |
  | Composer attach / mic / send | `plus`, `mic`, `arrow-up` |
  | OtpField check | `check` |
  | FormatIcon set | add these glyphs to `Icon` |

  The `ToolIcon` set may stay local as product-specific glyphs.
- **Size** follows the control (§1.2: 14/16/16/18/20); 16 in rows, popups and sm chips; 14 next to a 13 px
  figure or label, with a 4 px gap. Glyphs inside indicators of 20 px or less (step markers, run marks,
  decision keys, AgentGlyph xs) are 12 at stroke 2.4, and a spinner there is 14. Never rotate a chevron to
  make another direction: the Icon set has all four.
- **Alignment:** the icon box equals the icon size, centered on the text line box with
  `align-items: center` and a pixel line height. Never align to baseline.
- **Color:** icons inherit `currentColor`. Decorative icons inside controls use `fg-muted`, and move to
  `fg-base` on hover or selection.

### 1.16 Layout and width

- Components are fluid: `width: 100%` of their container, or intrinsic for Button, Badge, Toggle, Kbd
  and Avatar.
- Hard-coded content widths are not allowed in reusable components: 361, 196, 296, 300, 320, 340 and
  323.1. A component that needs a default cap takes one from the §1.9 width set as a `maxWidth` and
  accepts `className` or `fullWidth`: a fluid control 256 (the Select `morph`, PreviewCard), a showcase
  composite 320 (PeoplePreview, TaskChecklist). FormatToggles 340 and the Composer's 240 → 340 are
  their default max widths.
- No component may cause horizontal overflow at 320 px viewport width.

### 1.17 Customization bounds

The theme builder (`#docs/customize`, `src/ui/customize/`) changes tokens only, never component code, and
only inside these bounds. Anything it cannot reach is fixed by this spec.

- **Knobs.** Accent: Ink (the shipped monochrome accent), Harbor `#2a6ada`, Lagoon `#0a7893`, Plum `#7b4fd6`,
  Orchid `#a447b8`, or a custom hex. Neutrals: Paper (shipped), Pure, Slate, Sage, Tinted. Corners: Round
  (shipped: the Standard ladder with every control a pill), Tight, Standard, Soft. Typeface: Inter (shipped) or Platform. Advanced: focus ring follows the accent,
  links follow the accent, and a custom dark accent. Contrast "More" stays off until it is approved.
  Presets (House, Ledger, Graphite, Tidepool, Atelier) are named mixes of these knobs. House is the
  shipped theme and derives every token byte-for-byte.
- **Corner ladders** (xs, sm, md, lg, xl, 2xl): Tight 2, 2, 6, 12, 16, 20; Standard 4, 6, 10, 16, 20, 24;
  Soft 4, 6, 14, 20, 24, 28. Never a slider. Every ladder keeps `lg = md + 6`, `xl = lg + 4`,
  `2xl = xl + 4`, `sm = clamp(md − 4, 2, 6)` and `xs = min(4, sm)`, in whole pixels, so popup items
  (lg − 6) always equal `md`. `radius-full` and `radius-none` never move: intrinsic pills and circles stay
  pills and circles. **Control radius** (`--os-radius-control`): Round 9999 (shipped, with the Standard
  ladder); Tight 6, Standard 10, Soft 14, equal to `md` in each, so controls, tracks and Group shells
  (control + 6 = `lg`) follow the ladder.
- **Every radius follows the ladder.** A radius is a token, 0, a pill or circle, a §1.3 control
  expression (control, control ± inset, min(control, `lg`)), or the §1.3 nesting
  rule `max(radius-sm, outer − inset)` written from tokens; the inner edge of a 1px hairline may use
  `outer − 1px`. No `max(6px, …)` floors and no multipliers. Signature components follow the ladder for
  their radii too; at Standard their radii are unchanged.
- **Owned tokens.** The builder writes 44 tokens: the colors the accent and neutral knobs derive
  (accent steps, neutral text, surface and border colors, focus ring, link, button active text, the
  colors inside `shadow-control` and `shadow-popup`, and the progress gradient), the six moving radius
  steps and `--os-font-family`. Everything else keeps its shipped value.
- **What stays fixed.** Status colors, the selection blue, overlay in dark, the type scale, line
  heights, weights, `--os-tracking-tight`, spacing, control and row sizes, shadows' geometry, motion
  (durations, easings and the `springs` constants), and the signature components' interactions: their
  sizes sit on the control scale (§1.2), and their staging and travel are fixed. Density is the
  `size` prop and Table `compact`, not a theme.
- **Audit thresholds** (every derived theme, both schemes; a failing row blocks export): text 4.5:1 on
  every surface it sits on; the accent on its surfaces, the focus ring and selection rings 3:1; text on
  the primary fill 4.5:1 in every state; the progress gradient's stops 3:1 on the Progress track; accent
  steps at least .03 ΔE_OK apart; dark edges no weaker than the shipped `border-subtle` on `bg-elevated`
  (1.4:1) and `bg-raised` on `bg-muted` (1.12:1); surfaces strictly ordered toward the text color. The
  status pairs keep §1.7: 4.6:1 light and 7.0:1 dark on their tints, and 4.5:1 for the filled badges.
- **The dark accent rule.** Accent steps always move toward the text color: darker in light, lighter
  in dark. A chromatic dark accent starts between L .72 and .86 (OKLCH) and steps up until ink text on it
  reads 4.6:1, so its hover and press always have room. Ink keeps the shipped dark ramp.
- **Proof.** `scripts/verify-theme.mjs` and `scripts/verify-export.mjs` check the math and the exports.
  The token audit (`#docs/token-audit`, development only) applies a stress theme where every token has a
  unique value and checks every example's computed colors, radii, typeface, durations and focus rings;
  a value that matches no token is a hard-coded value.

---

### 1.18 Charts

`LineChart`, `BarChart` and `Sparkline` (`components/chart.tsx`) are plain SVG drawn at the measured pixel
width, so strokes and corners never stretch.

- **Color by job.** One lead series uses `accent-moderate`, so a custom accent recolors it. Two or more
  take `--os-color-chart-1…5` in that fixed order, never cycled: a sixth series folds into "Other". A
  comparison series (`muted`) is `fg-disabled` and dashed on a line, `accent-dim` as a bar. Status colors
  are never series colors.
- **The slots are checked as a set** for color-vision deficiency and against `bg-surface` in each mode
  (light `#2a78d6 #eb6834 #1baf7a #eda100 #e87ba4`, dark `#3987e5 #d95926 #199e70 #c98500 #d55181`). Three
  light slots sit under 3:1 on white, so every chart ships its legend, readout and data table.
- **Marks.** Lines 2px with round joins; area washes fade from 14% (8% with several) to 0 at the baseline.
  Bars at most 24px wide, 4px round at the data end and square on the baseline; side-by-side bars and
  stacked segments are cut apart by a 2px gap. Dots are r=4 with a 2px ring.
- **Rings and gaps use the color behind the chart**: `--os-chart-surface`, `bg-surface` by default (a
  card). A chart on another fill sets it, as the docs stage does.
- **Chrome is recessive.** Gridlines are 1px `border-subtle`, solid; the baseline is `border-muted`. Ticks
  are 12px `fg-subtle` in tabular figures, four even intervals on a round step, compact past 10,000.
  Crowded x labels thin out from the latest one. All text uses text colors, never a series color.
- **Legend** for two or more series only, 16px above the plot: line keys for lines, 8px square boxes for
  bars (radius 0: a rounded corner turns an 8px key into a dot), the same key as UsageBar and ContextWindow.
- **Readout.** A crosshair snaps to the nearest x on lines; a `bg-muted` column marks the bar under the
  pointer. One tooltip lists every series: value first in `fg-base` medium, name after in `fg-muted`.
  The same readout follows keyboard focus (arrow keys, Home, End, Escape).
- **Motion.** Bars grow from the baseline and lines fade in over `--os-motion-slow`, again when the data
  changes; nothing moves under reduced motion.

### 1.19 Agents

Interfaces for AI agents: what they are doing, what they need from a person, and what they changed. Every
agent component is built from five shared parts, so a status, an agent or a number looks the same
everywhere. Build new agent UI from these parts; never draw a new status color, agent tile or diff.

- **States** (`AgentState`): idle, queued, running, needs-input, paused, done, failed, skipped, canceled.
  Color carries meaning only: running takes the accent, needs-input warning, failed error, done success.
  Everything not happening yet, or no longer happening, is gray; not-started states are rings, not fills.
  `StatusBadge` writes the state as words ("Needs you"); `StatusDot` beside text that already says it.
  `appearance="text"` on StatusBadge and RiskBadge is 13/18 medium. Running pulses once per two spinner
  periods; reduced motion stops it.
- **Risk** (`RiskLevel`): low, medium, high, as `RiskBadge` (gray, warning, error), always written as words.
  High risk covers anything destructive, public or that spends money. High-risk actions always ask a
  person unless someone sets that tool to Allow themselves (`PermissionRules`, `presetRule`).
- **Agents are squares, people are circles.** `AgentGlyph` is a rounded square (20, 24, 32, 40 px) with
  an initial or an icon. It is neutral; when several agents share a view, `color` gives each a chart color,
  in order, and the name is always written too.
- **Steps** sit on a rail: done steps are quiet (a muted check), the running step has a 14 px spinner and
  a medium-weight title, needs-input and failed take their status tint. Not-started and skipped rings use
  `fg-disabled`, the same agent gray as StatusDot (not `border-muted`). 16 px between steps, 8 when
  compact.
- **Changes**: additions green, removals red, with + and − signs so they read without color. Code in a
  `DiffView` is set in Inter with tabular figures (1.4: Inter only).
- **Numbers**: `formatTokens` (36k, 175.6k, 1.3M), `formatCost` ($1.62, <$0.01) and `formatDuration`
  (628ms, 1.4s, 2m 06s, or 2:55 as a clock), in tabular figures.
- **Budgets**: `UsageBar` splits one budget into parts in the chart colors, 2 px gaps, the rest as the
  empty track, as one pill cut into pieces: round at its two ends, square where pieces meet. A part that is about to be freed (`pending`) shows that share
  hatched in its own color, as a preview; nothing changes until it is committed, and then the share
  narrows away in place (`motion-slow`, `ease-settle`), so the order never changes. Over the limit the
  whole bar turns to the error color and the header says so in words. Key rows in the list legend are 32
  tall; key chips sit 8 apart and press at .97. `ContextWindow` leads with the room left, not the room
  used, and says how full it is in words.
- **Working with a run.** These carry real work, so they show the literal thing, never a summary:
  - A run in a message is a `RunBlock`: open while it runs, waits or fails; closed to one line (steps, time,
    what changed) once done or stopped. Every tool step opens to its `ToolCall`: the tool, the literal input
    with copy, the output (scrolls past eight lines, with Show all) and any error as an alert with Retry.
  - A running agent is steered from the `Composer`: Enter sends to the run (`onSteer`), Option+Enter queues
    (`onQueue`), Escape stops (`onStop`). Queued messages sit above the field, in order, with Send now.
  - A permission shows the exact command or payload (`ApprovalCard command`), never only a description.
  - Proposed changes are reviewed one at a time (`ChangeReview`): Accept or Reject each (Y and N), Accept
    all, Undo. Nothing applies until it is accepted.
  - Restoring a checkpoint (`CheckpointList`, `CheckpointMarker`) always confirms first and says what it
    undoes, in files and messages.
  - What an agent may do is set per tool (`PermissionRules`): allow, ask or deny, with presets. No preset
    lets a high-risk tool run without asking.
- **The agent card language.** Every agent component is one object, read top to bottom, and never a stack
  of generic parts:
  - A Card at size sm (16 padding, xl radius) with no header or footer strips and no lines inside: space
    and washes separate the parts.
  - A head row: the agent's tile and name (or the title, 16 medium) on the start, the state or the risk as
    words (`appearance="text"`) or the one action on the end. Pills belong in tables and lists, not here.
  - One hero: a big figure (2xl, medium, -0.02em, tabular, `RollingNumber`), the question, or the data
    drawn large (`UsageBar size="xl"`).
  - Washes, not lines: secondary figures as tiles, keys and filters as chips (`radius-control`, 32 tall,
    padding 12, 13/18 500, swatch, label and value 6 apart, chips 8 apart), options as rows, all on
    `bg-muted`; hover one step up (`bg-interactive-secondary`); a chosen row is `bg-surface` with a 1.5 px
    `fg-base` ring.
  - Wash geometry: radius `md`, padding-inline 12. A row of one or two lines that don't wrap is 48 tall
    (padding-block 4); a row whose text wraps pads 12 all round; a one-line wash or outcome is 32 tall.
    Washes in a list sit 4 apart. A title sits 4 above its description; the second line of a row or head
    sits 2 under the first (14/20 over 13/18). Meta and captions are 13/18 with tight tracking and
    tabular figures. Figures inside a wash are flat (no tile fill on the wash).
  - Point to inspect: pointing at (or focusing) a part holds it while the rest fall back to 22%. The held
    part's own row or wash is the readout; the hero figure stays on the whole.
  - Actions at the foot of the body, side by side and equal width: secondary first, the commit last.
    Mod+Enter commits and Escape dismisses while focus is in the card; the buttons carry
    `aria-keyshortcuts`. A decided card replaces them with the outcome on a wash, in a status region.

### 1.20 Chat

A conversation with an assistant or an agent. The rules follow what the best open chat interfaces share
(assistant-ui, AI Elements, prompt-kit), set on this system's tokens.

- **One column.** The thread and the composer share one centered column, 720 px at most (`maxWidth`), with
  24 px side gutters (16 on phones). Every edge lands on it: assistant text starts on its start edge, user
  bubbles end on its end edge, and the composer's surface spans it exactly. ChatThread gives a Composer
  `fullWidth` unless it sets it.
- **Two speakers, two shapes.** A person's message is a bubble on the end side, at most 75% of the column:
  `bg-muted`, `min(radius-control, radius-xl)` corners, 8 px block and 16 px inline padding, 16/24 text. An
  assistant's reply has no bubble and no avatar: it is prose across the column, because a reply is a
  document, not a remark. An avatar appears only when several agents speak in one thread.
- **Rhythm.** 32 px between messages; 16 px between the parts of one reply (reasoning, tool runs, text,
  cards); 4 px from a message to its actions.
- **Actions** sit under a message, 32 px icon buttons with no gap, their first icon's glyph on the text
  edge. The newest reply always shows them; older messages show them on hover or focus. Replies take Copy,
  Retry, feedback and, with branches, `‹ 2 of 3 ›`; a person's messages take Copy and Edit.
- **Prose** (`Markdown`): 16/24 body, 16 px between blocks, headings 18 and 16 semibold, lists indented
  20 px, inline code on a wash one type step below its prose (14 in 16, 13 in 14), code blocks on
  `bg-muted` with the language and Copy on top and 13/18 rows like ToolCall and DiffView, tables with
  hairline rows. Links use `fg-link`. Raw HTML is never rendered.
- **Reasoning** opens while the model thinks ("Thinking", animated) and folds to one line when it is done
  ("Thought for 12s"). Its text is muted caption on a 2 px rail.
- **The bottom.** The composer is sticky at the foot of the thread on `bg-canvas`, with an optional
  caption under it. The thread stays pinned to the newest text while it streams, unless the person scrolls
  up; then a round button above the composer jumps back down.
- **The empty thread** is a centered greeting (22 medium), the composer, and up to four suggestion chips.

### 1.21 Dashboards

A dashboard answers what needs a person now, then what is happening, then how it went. It is read
top to bottom in that order, and every number on it is one press from the work it counts.

- **Stats** (`Stat`) open a dashboard, four across (two under 1024 px, one under 520): the label in muted
  sm, the figure in 2xl medium tabular, and one thing that gives the figure meaning, which is a change
  since the last period (an arrow and words, green or red by whether it is good news, not by direction),
  a limit (a 4 px bar, amber past 80%, red at 100%) or a trend (a sparkline). A stat that needs attention
  takes a tone dot before its label. A stat with `onPress` is one button with an arrow, and opens the list
  it counts.
- **Waiting on a person comes first.** For agents that is a `HandoffList`: approvals, questions, reviews
  and stuck runs, longest wait first, as washes. Each row writes the agent, what it wants and how long it
  has waited (amber past ten minutes), shows the literal command or question on one line, and decides in
  place: Deny and Approve for an approval, Answer, Review or Open for the rest. A decided row shows its
  outcome for a moment, then leaves.
- **Runs** are a plain table: the run and its agent, the state as a badge, what it is doing now (or what
  it left), time and cost in tabular figures, and the one action that fits (Stop while it runs, Retry once
  it fails). A run opens in place to a `RunTimeline`.
- **Run timelines** put every step on one time axis (ticks on a round step, as a clock): finished work in
  gray, the running step in the accent with a line at now, waiting on a person as an amber wash with a
  ring, a failure in red; helpers indent under the step that started them. Pointing at a step holds it
  (the rest fall back to 22%) and the wash underneath gives its start, duration, tokens, cost and literal
  input; pressing keeps it. With nothing held, the wash names the slowest step and how much of the run
  was spent waiting on people, because that is the first question about a slow run. Bars are 8 px pills
  (radius full) and the shortest step shows as an 8 px dot; rows are 32 tall with text inset 12; the time
  column is 56 (`space-14`); the readout wash pads 12 all round and its figures are flat.
- **Live, not refreshed.** Values that change in place count to their new value (`RollingNumber`),
  timelines grow, and a run that finishes, fails or starts waiting says so in a toast. Spend is drawn
  against the budget, never alone.

## Part 2: Deviations

Severity: **high** means broken, invisible or an accessibility failure; **medium** means visibly
inconsistent with Part 1; **low** means polish.

### 2.0 StyleX dropped declarations (all of `src/ui`)

The audit found 30 dropped declarations: 29 in components and 1 in the docs. None of them rendered.

The verdicts compare how each component looked without the declaration with how it would look if the
declaration rendered. The look without them was the approved one, so a border was restored only when it
fixed something broken or brought one outlier into line with its family.

| # | Component (style) | Dropped declaration | Today | Verdict |
|---|---|---|---|---|
| 1 | Shared surface style (Card, Collapsible, Frame outer and body, Group, ToggleGroup, Toolbar, ScrollArea `bordered`, Table wrapper) | `border: 1px solid border-subtle` | All borderless; approved | **Delete.** Card and Frame body already set `borderWidth: 0`; Group and Toolbar have `shadow-control`. ScrollArea gets its own opt-in longhands (Part 2 › ScrollArea). |
| 2 | Shared surface style, `flush` (Group, ToggleGroup) | `border: 'none'` | No-op | **Delete.** |
| 3 | Alert | `border: 1px solid border-subtle` | Borderless | **Delete.** The card-surface style it merges with sets `borderWidth: 0`, so it could never render. Also delete the `error` tone's `borderColor`, which lands on the icon disc. |
| 4 | Dialog (window) | `border: 1px solid border-subtle` | The only overlay with no hairline; in dark its edge is lost | **Restore:** `borderWidth: 1, borderStyle: 'solid', borderColor: border-subtle`. This matches AlertDialog, Popover, Menu, Command and Sheet. |
| 5 | Kbd (keycap) | `border: 1px solid border-muted` | Fill plus `shadow-control`; approved in light, near-invisible in dark | **Delete.** Fix dark through the `--os-shadow-control` change (§1.1). |
| 6 | Spinner (ring) | `border: 2px solid border-muted` | **The spinner is invisible**; only the label renders | **Restore:** `borderWidth: 2, borderStyle: 'solid', borderColor: border-muted`, keeping `borderTopColor: currentColor`. |
| 7 | Table (cell) | `borderBottom: 1px solid border-subtle` | No dividers | **Restore on header cells only**, as `borderBottomWidth: 1`, `borderBottomStyle: 'solid'`, `borderBottomColor: border-subtle` in the header-cell style. **Delete** for body cells. |
| 8 | Command (search) | `borderBottom: '1px solid'` (its color longhand exists) | No divider between search and results | **Restore:** `borderBottomWidth: 1, borderBottomStyle: 'solid'`. |
| 9 | Command (footer) | `borderTop: '1px solid'` | No divider | **Delete,** together with the orphaned `borderTopColor`. Spacing and muted hints are enough. |
| 10 | Command (input) | `border: 0` | Reset already zeroes it | **Delete.** |
| 11 | Menu (separator) | `border: 0` | RAC renders a `div` in menus | **Delete.** |
| 12 | Separator | `border: 0` | `div` | **Delete.** |
| 13 | Toolbar (separator) | `border: 0` | **In a vertical Toolbar, RAC renders an `<hr>` and the UA inset border draws a 2–3 px groove** | **Restore:** `borderWidth: 0, borderStyle: 'none'`. |
| 14 | ToolPalette (tool) | `border: 0` | Button reset | **Delete.** |
| 15 | ToolPalette (notch) | `border: 0` | Button reset | **Delete.** |
| 16 | ToolPalette (triangle) | `borderLeft: '5px solid transparent'` | **The "more shapes" triangle is not drawn**, so the flyout has no affordance | **Restore:** `borderInlineStartWidth: 5, borderInlineStartStyle: 'solid', borderInlineStartColor: 'transparent'`. Better: replace with a 6 × 6 SVG corner. |
| 17 | ToolPalette (triangle) | `borderBottom: '5px solid currentColor'` | As above | **Restore:** `borderBottomWidth: 5, borderBottomStyle: 'solid', borderBottomColor: 'currentColor'`. |
| 18 | Empty | `border: 'none'` | No-op | **Delete.** |
| 19 | PeoplePreview (face) | `border: 0` | Button reset | **Delete.** |
| 20 | PeoplePreview (face) | `background: 'transparent'` | **The UA `buttonface` (#efefef) shows around the avatars** | **Restore:** `backgroundColor: 'transparent'`. |
| 21 | PeoplePreview (follow) | `border: 0` | Button reset | **Delete.** |
| 22 | TaskChecklist (step) | `border: 0` | Button reset | **Delete.** |
| 23 | CheckboxGroup (box) | `border: 0` | A `span` has none | **Delete.** |
| 24 | Composer (tool) | `border: 0` | Button reset | **Delete.** |
| 25 | Composer (send) | `border: 0` | Button reset | **Delete.** |
| 26 | ScrubStepper (side button) | `border: 0` | Button reset | **Delete.** |
| 27 | Toast (surface) | `border: 0` | `borderWidth: 0` is already set | **Delete.** |
| 28 | Toast (action) | `border: 0` | `borderWidth: 0` is already set | **Delete.** |
| 29 | Toast (close) | `border: 0` | `borderWidth: 0` is already set | **Delete.** |
| 30 | Docs › Skeleton example (reload button) | `border: 0` | Button reset | **Delete** (owned by the docs). |

Once all 30 rows are done, `grep -rnE "\b(border|borderTop|borderRight|borderBottom|borderLeft|borderInline|borderBlock|background|animation)\s*:" src/ui --include=*.ts --include=*.tsx`
must return nothing except prose. Then turn on `propertyValidationMode: 'throw'` (§1.0).

### 2.1 Cross-cutting fixes (fix once, many components improve)

| ID | Severity | Issue | Fix |
|---|---|---|---|
| A | high | **Five focus treatments.** (1) 3 px blue halo (`--os-focus-shadow`): Button, Accordion, Collapsible, Select, Switch `stretch`, ScrubStepper, ToggleGroup, Composer, Slider knob, DatePicker days, PeoplePreview, field shells. (2) 2 px ink outline at offset 2: overlay buttons, Avatar, Calendar days. (3) The same at offset 3: checkbox, radio, switch, Toggle, the reset fallback. (4) An inset ring that also changes the radius: Tabs. (5) A blue outline: ToolPalette. Button draws (1) and the reset outline together. | Apply §1.8 everywhere. Delete every `boxShadow: --os-focus-shadow`. Set `outlineStyle: 'none'` only where the edge-ring or hover-fill pattern replaces the ring. |
| B | high | **Field heights 40 / 42 / 46 / 48 / 52.** Input is 40. Combobox, Autocomplete, NumberField and InputGroup are 42 (a 40 px inner input plus two 1 px borders). TextField and DatePicker are 48. The notch field is 52. | The shell owns the height (§1.2); the inner input is `height: 100%` with no `minHeight`. A `size` prop on every field. DatePicker defaults to md 40. |
| C | medium | **Hover and keyboard highlights in `bg-subtle`** measure 1.07:1 in light and 1.10:1 in dark, almost invisible: menu items, listbox options, Toggle, Combobox chevron, ToolPalette, calendar days, toast close. | `bg-interactive-primary`. Keep `bg-subtle` only on large rows (§1.8). |
| D | medium | **Four invalid treatments:** a 1 px red border (shared control style); a 2 px red edge plus tinted fill (shared field style: TextField, DatePicker, Select); a 1 px red border plus tint (Textarea); tinted cells plus red digits (OtpField). | §1.8 Invalid. |
| E | medium | **Disabled by opacity:** Select .4, Switch `stretch` .4 (label included), Slider `ticks` .4, Toggle .5, the shared overlay button .5, ScrubStepper sides .35, Composer send .4. | Swap color tokens; keep opacity only for the §1.8 composite list. |
| F | medium | **Fractional line heights:** labels 1.35 (18.9 px), help 1.5 (19.5 px), choices 1.2 or 1.4, Textarea 1.45 (21.75 px), overlay title 1.3 (23.4 px), toast 18 and 17 px, inputs 22 px, Composer 21 px, Accordion and Tabs 21 px. | Pixel line heights from §1.4. |
| G | medium | **Two button families.** Button (pill, 32 / 40 / 44) and the shared overlay button (rect radius 10, 36 tall, 1 px border plus `shadow-control`, used by AlertDialog, Toast and every docs trigger). Dialog's demo uses Button, AlertDialog uses the overlay button. | Retire the overlay button. Map `tone` neutral → Button `tertiary`, primary → `primary`, danger → `destructive`, and use size md in overlay footers. Keep the export as a deprecated alias for one release. |
| H | medium | **Track colors:** 6 % ink (ToggleGroup, FormatToggles), 13 % ink (Tabs, ExpandingTabs), `bg-subtle` (SegmentedControl `connected`), `accent-subtle` (`elastic` chips, Switch). Selected tiles are `bg-surface`, which is darker than the track in dark. | Tracks `bg-muted`, tiles `bg-raised` (§1.8 Selected 1). |
| I | medium | **Overlay motion.** Anchored popups enter from `translateY(+4px)` whatever the placement, so a popup below its trigger rises *toward* the trigger. Every overlay exits by reversing its 260 / 280 / 360 ms entry. DatePicker's popup and ToolPalette's flyout have no motion. | §1.9 entry and exit rows. The suggestion-input popup (Combobox and Autocomplete) already follows the right pattern: 220 ms in from −4 px, 140 ms out. Generalize it. |
| J | low | **Raw colors:** ToolPalette `#fff` twice, TaskChecklist `#ffffff8c`. | §1.13 item 3. |
| K | low | **Magic widths:** Accordion 361, Progress 361, Slider 361 and 323.1, DatePicker 361, Skeleton rectangles 361 / 160, Select 196, Toast 300, PeoplePreview 300, TaskChecklist 320, FormatToggles 340, SegmentedControl 360. | §1.16. Select (default `maxWidth` 256) and PeoplePreview (320) are resolved. |
| L | low | **Dead z-index** on RAC popovers (65, 50, 100). | Delete it (§1.9 Layering). |
| M | low | **The docs stage is `bg-subtle`**, so `bg-subtle` parts vanish on it: Frame outer, Card footer, Kbd and input-group addon in dark, and the Dialog and Tooltip demo triggers. | Docs-owned: show these examples on a canvas stage, or move the component parts to `bg-muted` as listed below. |
| N | low | **API reference tables are empty for all 56 pages** (`api: []`). | Docs-owned. Part 3 lists the props each table needs. |

### 2.2 Per component

Every component is also subject to 2.1 A–N where they apply; the bullets here are the component-specific
work.

**Accordion**
- medium. The trigger's focus is a rectangular halo on a 0-radius, full-width button, and it bleeds over
  the divider. Fix: trigger `borderRadius: radius-sm`, ring per §1.8.
- medium. The trigger has no hover. Fix: the plus or chevron goes `fg-muted` → `fg-base` on hover.
- low. The divider is `color-mix` 12 % ink. Fix: `border-subtle`.
- low. The answer text is a 72 % ink mix. Fix: `fg-muted`, 14/20.
- low. The plus is an inline SVG at stroke 2. Fix (done): `Icon` `plus` 16, stroke 1.7, still rotating 135°
  into a cross (the chevron 180°) over `--os-motion-popup` with ease-settle.
- low. Rows were 52 tall. Fix (done): xl 48 with padding 12, the same row as Collapsible.
- low. `appearance="card"` items touch each other: the group gap is 0. Fix: group gap 8 when items are
  cards.
- low. The 361 px `maxWidth`. Fix: remove it.
- low. Disabled items have no style. Fix: pass `isDisabled` through and apply §1.8 Disabled.

**Alert**
- medium. The container has no fill: the tone color only reaches a 28 px icon disc, so on canvas the
  alert reads as loose text. Fix: container fill `bg-subtle` for neutral and `bg-info`, `bg-success`,
  `bg-warning` or `bg-error` for the tones; radius `lg` 16 (today `xl` 20 through the card-surface style);
  padding 12 16.
- medium. The icon sits 4 px low: a 28 px disc centered at 14 against a first line centered at 10. Fix:
  drop the disc and use a 16 px icon in the tone foreground with `marginTop: 2` on a 20 px line.
- low. Warning and error share one inline glyph. Fix: use the status icons per §1.15.
- low. The dropped border and the error `borderColor` on the icon. Fix: §2.0 row 3.

**AlertDialog**
- medium. Actions use the overlay button (36 px, rect) and confirm uses a soft red tint. Fix: Button md,
  `tertiary` and `primary` or `destructive` (2.1 G).
- medium. Its width is 420 where Dialog is 380. Fix: 400 for both.
- low. The title is 18/1.3. Fix: 18/24.
- low. Exit reverses for 280 ms. Fix: §1.9.
- low. The footer does not stack under 480 px. Fix: §1.9.

**Autocomplete**
- high. The shell is 42 px. Fix: 2.1 B.
- medium. Description and error can both show. Fix: the error replaces the description.
- medium. Option padding is 12 where menu items use 10, and the active row is `bg-subtle`. Fix: 10, and
  2.1 C.
- low. A disabled shell still changes border on hover. Fix: suppress hover when disabled.
- low. The popup is 2 px narrower than the shell. Fix: wrap the shell in RAC `Group`.

**Avatar**
- medium. The 2 px surface ring (`box-shadow`) is applied to every Avatar, including a lone one. Fix: move
  the ring to the AvatarGroup member.
- low. Initial font sizes were 14 / 14 / 16 / 18 / 24 / 24 for 24 / 32 / 44 / 48 / 64 / 80. Fix (done):
  diameters 24 / 32 / 40 / 48 / 64 / 80 (md on the control scale) and initials 12 / 13 / 16 / 18 / 22 / 29,
  type tokens at about 0.4 × diameter. Anything that mirrors an avatar (Skeleton circles) uses the same
  diameters.
- low. The fallback fill is a 12 % mix. Fix: `bg-muted`.
- low. The AvatarGroup tooltip is a full pill with an inverted fill, while Tooltip is radius 10 with a
  subtle fill. Fix (done): one tooltip chip (§1.9): 32 tall, padding 12, radius `md`, the contrast fill,
  160 in and 120 out.

**Badge**
- high. A 32 px tall badge with 14 px text and 14 px padding is a chip. Fix: sizes sm 20 / md 24 / lg 28;
  12/16 500 (lg 13/18); padding-inline 6 / 8 / 12; gap 4; icon 12 / 14 / 14; md is the default. Badge sm 20
  and lg 28 (and Kbd sm 20) stay off the control scale on purpose: they are labels that fit inside 36 px
  rows, not controls.
- medium. There is no neutral, outline or secondary variant: `status` is required. Fix: Part 3.
- low. Custom status glyphs. Fix: §1.15.

**Breadcrumb**
- medium. Links are 19.6 px tall with a 0-radius focus box tight on the glyphs. Fix: line height 20,
  `paddingBlock: 2`, `borderRadius: radius-xs`, the §1.8 ring, and the §1.14 hit area.
- low. The "/" is `border-muted`, at 1.33:1. Fix: `fg-subtle` with `aria-hidden`, or `Icon`
  `chevron-right` 14.

**Button**
- high. The focus draws the halo and the reset outline together. Fix: 2.1 A.
- high. `destructive` puts black text on `#f0443a` and flips to white on hover. Fix: `fg-static-light`
  on `bg-danger-secondary`, hover `bg-danger-tertiary`.
- medium. The default size is `large` (44) and sizes stop at three. Fix: xs / sm / md / lg / xl from
  §1.2, md default; keep `small`, `medium` and `large` as aliases.
- medium. The 1 px transparent border on every appearance pushes the visual insets to 13 / 21 / 25 px,
  off the grid. The icon-side calculations subtract the stroke inconsistently: small with a leading icon
  insets 8 at the start and 12 at the end, medium with a trailing icon insets 20 at the end against 21
  for text. Fix: `borderWidth: 0` on every appearance; `tertiary` draws its outline with
  `boxShadow: inset 0 0 0 1px border-muted`; paddings from §1.2.
- medium. The disabled style forces a `bg-disabled` fill onto `text` and `tertiary`. Fix: transparent
  stays transparent, and `tertiary` takes `border-disabled`.
- medium. Loading replaces the fill with `accent-subtle`, which looks disabled, and uses an 18 px spinner
  at every size. Fix: §1.8 Loading.
- low. `paddingBlock` 5 / 7 / 9 alongside `minHeight`, and `lineHeight: 1`. Fix: fixed `height`, no
  block padding, line height from §1.2.

**Calendar**
- medium. The navigation buttons are 30 × 30 and draw chevrons rotated ±90°. Fix: sm 32 × 32 with
  `chevron-left` and `chevron-right`; header columns 32.
- medium. Weekdays are 11 px. Fix: 12/16 500 `fg-muted`.
- medium. Day cells are 34 tall and DatePicker uses its own grid. Fix: 36 × 36 cells at the control
  radius, row gap 2; DatePicker reuses Calendar.
- low. The weekday header row was 28. Fix (done): 32, the compact table header (§1.12).
- low. A selected day has no hover step. Fix: hover `accent-bold`, as DatePicker already does.
- low. Days use `lineHeight: 1` and the month heading 1.3. Fix: days 13/18 tabular, month 14/20 500.

**Card**
- medium. On canvas a Card has no boundary: surface equals canvas, and its border is set to 0 on purpose.
  Fix: `variant: 'filled' | 'outline'`; `outline` adds a 1 px `border-subtle`; document that `filled`
  belongs on subtle sections.
- low. The footer fill is `bg-subtle`, the same as the docs stage. Fix: §2.1 M; the footer stays
  `bg-subtle`.
- low. Header to body was 20 at md and 24 at lg. Fix (done): 16 at every size (padding sm 16 / md 20 /
  lg 24), as in a dialog.

**Checkbox**
- high. The unchecked ring is 28 % ink at 1.86:1. Fix: `border-control`, 1.5 px inset.
- medium. There is no hover: the merged checkbox surface style resets the hover background to transparent,
  and the hover border color never applies because the ring is a box-shadow. Fix: on hover the ring
  turns `fg-base` 60 % and the fill `bg-subtle`.
- medium. The error text is 12 px. Fix: 13/20, 8 px below.
- low. Radius 5.76. Fix: `radius-sm` 6.
- low. Disabled keeps the 28 % ring. Fix: `border-disabled`.
- low. The label line height is 1.2. Fix: 20 px.

**CheckboxGroup**
- medium. It re-implements the indicator, so it has no hover, no per-item invalid ring and a different
  disabled fill. Fix: render the same indicator as Checkbox.
- low. The horizontal column gap is 12. Fix: 16 (§1.11).
- low. The dropped `border: 0`. Fix: §2.0 row 23.

**Collapsible**
- medium. The trigger keeps a 16 px radius on its bottom corners while expanded, so the hover fill shows
  rounded corners in mid-surface. Fix: `borderEndStartRadius` and `borderEndEndRadius` 0 while expanded.
- medium. There is no boundary on canvas, for the reason given under Card. Fix: `variant` as for Card.
- low. Rows are 52 tall. Fix: xl 48. Collapsible is not a signature component.
- low. Focus is the halo. Fix: 2.1 A, with an inset ring because the trigger fills the surface edge.

**Combobox**
- high. The shell is 42 px. Fix: 2.1 B.
- medium. The chevron button is 32 × 36 with radius 10, 2 px inside a 10-radius shell, so its corners
  cross the shell's curvature. Fix: 32 × 32, inset 4, radius 6.
- medium. The active option is `bg-subtle` and the check is 14 px. Fix: 2.1 C and a 16 px check.
- low. The popup width is off by 2 px. Fix: RAC `Group` around the shell.

**Command**
- high. The search input inherits the reset's 2 px ink focus outline, which draws a heavy black box inside
  the palette. Fix: `outlineStyle: 'none'` on the input; the palette is the focus context.
- medium. The search divider is dropped. Fix: §2.0 row 8.
- medium. The search text sits 18 px in while the items sit 16 px in. Fix: search padding 8, input
  padding-inline 8, plus a 16 px `search` icon at the start in `fg-muted`.
- low. Footer keys use the bordered overlay key style, not Kbd. Fix: Kbd `sm`.
- low. Width 470. Fix: 480.

**Composer**
- high. The placeholder and tool text are a 52 % mix, at 3.60:1. Fix: `fg-muted`.
- medium. There is no focus indicator other than the expansion. Fix: the edge ring per §1.8 on the outer
  surface, with `:has(textarea:focus)`.
- medium. The model menu is a hand-rolled popup with radius 14, padding 4, a 1 px ring and no shadow,
  with 32 px rows. Fix: an RAC Menu or ListBox with §1.9 surface and 36 px rows.
- low. Radius `calc(xl + 4px)`. Fix: `radius-2xl`.
- low. Textarea padding 13.5 / 0 with line height 21. Fix: padding 14 / 0 with line height 20.
- low. The suggestions offset is 5. Fix: 6.
- Done: the surface and width grow on ease-settle (no bounce on big things); 240 × 48 → 340 × 116 are
  default max widths, and inside a ChatThread it spans the column. Attachment chips are sm 32 (were 28):
  padding 12 with 10 on the icon side, a 16 px icon 6 from the name, a concentric 20 px remove button.
  Help, error and hint text start at the outer edge.

**ContextMenu**
- low. `transform-origin` is "top center" for a pointer-anchored menu. Fix: "top left", or "top right" in
  RTL.
- Everything else is as Menu.

**DatePicker**
- high. It is a second calendar implementation that disagrees with Calendar: one-letter weekdays, hidden
  outside-month days, a 4 px row gap, 36 px round navigation, its own hover and selected styles. Fix:
  compose Calendar inside the popover.
- medium. The shell is 48 tall with 15 px text. Fix: md 40, 14 px (2.1 B).
- medium. The calendar button is a 36 px circle inside a 10-radius rect shell. Fix: a 32 px square with
  radius 6 and `Icon` `calendar` 16.
- medium. The popup has no entry or exit motion. Fix: 2.1 I.
- low. Segment radius 3. Fix: `radius-xs`.
- low. The label is not dimmed when disabled. Fix: §1.8 Disabled.

**Dialog**
- medium. No hairline. Fix: §2.0 row 4.
- medium. It duplicates the overlay styles: z-index 80 against 90 elsewhere, its own fade and rise
  keyframes. Fix: use the shared overlay styles and `--os-z-modal`.
- medium. A centered title at 18/1.2 with `pre-line`, copy gap 8, body gap 20 and stacked full-width
  actions disagree with AlertDialog and Sheet. Fix: §1.9 header and footer, start-aligned; keep the
  centered layout only with `media`.
- low. Unreachable `sheet` appearances: `default`, `flush`, `inset`, `cards`, `centered-cards` and
  `centered-inset` exist, but no prop reaches them. Fix: expose them as `placement="sheet"` or delete
  them.
- low. Exit reverses for 280 ms. Fix: §1.9.
- low. The `media` thumbnail took radius `lg`. Fix (done): `md`, a tile inside a surface.

**Drawer**
- low. No footer slot or close button (Part 3).
- low. The handle is `border-muted`, at 1.43:1. Fix: `fg-disabled` at 40 % opacity, or `border-control`,
  so it is discoverable.
- Otherwise conforms: surface, radius, padding 20, backdrop.

**Empty**
- low. The icon tile is `bg-subtle` on white, at 1.07:1. Fix: `bg-muted`.
- low. Icon tiles were 36 / 44 / 52. Fix (done): the control scale, 32 / 40 / 48 for 16 / 20 / 24 icons.
- low. The heading is a `strong` with no heading semantics. Fix: `headingLevel`.
- low. The dropped `border: 'none'`. Fix: §2.0 row 18.

**Field**
- Fixed: pixel line heights, the required and optional markers, a dimmed disabled label, and one field
  system read by every control (§1.11).

**Fieldset**
- Fixed: legend padding 4 and margin −4 (the legend text sits on the 16 px content inset), gap 16, and a
  disabled fieldset dims its legend.

**Form**
- Conforms (gap 16). The actions row sits 24 below the last field (16 gap plus 8).

**Frame**
- medium. Padding and gap of 10 are off the grid. Fix: 8; the body radius becomes 8 (16 − 8).
- low. The outer frame vanishes on a `bg-subtle` stage. Fix: §2.1 M; the dropped border stays deleted
  (§2.0 row 1).

**Group**
- low. Its `variant="outline"` has no outline. Fix: rename to `raised` (`shadow-control`) and `flush`;
  keep `outline` as an alias.
- medium. Pills bulge past the shell corner. Fix: the shell takes control + 6 and every control inside,
  Buttons included, takes the control radius (§1.3): 10 inside 16 on a ladder, pills inside a pill at Round.

**Input** (Input and TextField)
- high. Field focus is an ink border plus the blue halo. Fix: the edge ring (§1.8).
- medium. Two systems: Input is 32 / 40 / 48 with padding 12 / 14 / 16 and the shared control styles;
  TextField is 48 with padding 15, 16 px text and the shared field styles; the notch variant was 52 with a
  32 % mix stroke. Fix: TextField becomes Field plus Input `size="xl"`; field insets per §1.2. The notch
  variant is fixed: 48 tall, `border-subtle` rest / `border-muted` hover / the focus ring on focus (see
  the signature components at the top).
- medium. Disabled is `bg-subtle` on Input and `bg-disabled` on TextField. Fix: §1.8.
- low. Input line height 22. Fix: 20.
- low. The docs hero shows the notch TextField rather than the base Input. Fix (docs): default example =
  `<Input>` in a Field, with notch as a further example.

**InputGroup**
- Fixed: a 40 px shell, 14/20 `fg-muted` addon text, the disabled swap, and the `bg-subtle` attached
  fill with a 1 px divider. Every inset is derived from the field inset, the icon gap and the inline-button
  inset per size, so its buttons line up with the other fields' (§1.2).

**Kbd**
- medium. In dark the keycap disappears: its fill equals the stage and the 0.5 px 6 % ring does not
  show. Fix: §1.1 dark `shadow-control`; the dropped border stays deleted.
- low. Two keycap styles: Kbd (24 px, borderless, shadow) and the menu and command shortcut key (20 px,
  1 px border). Fix: Kbd sizes `sm` 20 and `md` 24 (12/16, padding 0 4, radius 6), and use Kbd `sm`
  inside menus and the command footer.

**Label**
- Fixed: 14/20 pixel line height, the required and optional markers (weight 400) and the disabled
  presentation (§1.11).

**Menu**
- medium. The active item is `bg-subtle`. Fix: 2.1 C.
- medium. Items are weight 500. Fix: 400 (§1.4).
- medium. The submenu and selected marks are "›" and "✓" text. Fix: Icons 16 `fg-muted` at the end.
- low. The item gap is 4. Fix: 2.
- low. The separator margin 3 4 gives a 7 px band. Fix: `marginBlock: 4`.
- low. Shortcut keys. Fix: Kbd `sm`.
- low. Entry direction and exit. Fix: 2.1 I.

**Meter**
- Conforms: 6 px track in `bg-interactive-primary`, tones, tabular value.
- low. Use `bg-muted` as the track token for consistency with Progress.

**NumberField** (NumberField and ScrubStepper)
- high. The NumberField shell is 42 px. Fix: 2.1 B.
- medium. The steppers are "−" and "+" text glyphs in 32 × 36 buttons. Fix: `Icon` `minus` and `plus` 16
  in 32 × 32 buttons with radius 6, inset 4.
- medium. ScrubStepper's side buttons have no hover, disable at opacity .35, and focus with a second ring
  style (inset 2 px ink) next to a halo on the rail. Fix: hover `bg-interactive-primary`; disabled
  `fg-disabled`; one ring, inset on the side buttons and the outer ring on the rail.
- Done: the steppers are inline field buttons (§1.2) with the inset ring. ScrubStepper's rail is 48
  (control xl): 48 sides around a 56 value, icons 20, press .97 over `--os-motion-press`.

**OtpField**
- high. Cells are `bg-surface` with no edge, so on a white canvas they are invisible. Fix: cells get
  `boxShadow: inset 0 0 0 1px border-subtle`, `border-muted` on hover.
- medium. The active cell shows only the caret. Fix: the edge ring (§1.8) on the active cell; a selection
  range uses the same ring at 40 % opacity.
- medium. Invalid tints the cells. Fix: §1.8 Invalid (the ring in `border-error`, digits `fg-error`).
- low. Cell radius `calc(md + 2px)`. Fix (done): control + 2 (sm cells control).
- Done: md cells are 40 × 48 (control xl), 8 apart; sm 32 × 40, 6 apart; `lg` and `large` are deprecated
  aliases of md. A group break is 2 × gap + the 8 px dash.

**Pagination**
- high. The current page is `bg-subtle` plus `shadow-control`, lighter than hover on the other pages, and
  1.00:1 on a subtle stage in dark. Fix: §1.8 Selected 3.
- medium. No focus style; it falls back to the reset at offset 3. Fix: 2.1 A.
- medium. The ellipsis sits on the baseline, about 7 px below the numbers' center. Fix: make the item
  a grid with `place-items: center` and the item height.
- low. Items are 36. Fix: sm 32 with the §1.14 hit area.
- low. Inline chevrons. Fix: §1.15.
- Done: page numbers are square at one digit and grow by the size's icon gap (4 / 6 / 8 / 8 / 8); text
  Previous and Next take the rect padding with the shared icon-side maps.

**Popover**
- medium. The title is 18 px, the dialog size, in a 256 px popover. Fix: 14/20 500, description 13/18,
  padding 16, gap 12.
- low. Offset 8. Fix: 6.
- low. Motion. Fix: 2.1 I.

**PreviewCard** (PreviewCard and PeoplePreview)
- high. The face buttons show the UA `buttonface` gray. Fix: §2.0 row 20.
- medium. The profile card is a floating surface with no `shadow-popup` or border, so in dark and on
  canvas it has no edge. Fix: §1.9 surface.
- low. The Follow button shrinks on hover (scale .97). Fix: a hover fill step (`accent-bold`), and keep
  press .97.
- low. Bio text is a 72 % mix. Fix: `fg-muted`.
- Done: PreviewCard's default width is 256 (was 232). The profile card wears the §1.9 surface at radius
  `lg` (was `xl` 20) with padding 16; Follow is Button sm (primary, or secondary once
  followed); avatars are Avatar lg 48 and xs 24 with no scale tricks; the row is 48, max 320.

**Progress** (Progress and TaskChecklist)
- medium. The generic bar fills with the brand gradient. Fix: an `accent-moderate` fill by default and
  `tone="brand"` for the gradient.
- medium. The track is a 12 % mix, 8 px. Fix: `bg-muted`, 6 px; TaskChecklist keeps its 8.
- low. TaskChecklist rows use radius `calc(xl * .6)` = 12, where nesting gives 8 (20 − 12). Fix: 8.
- low. The check ring is a 32 % mix. Fix: `border-control`.
- low. The shine is `#ffffff8c`. Fix: 2.1 J.
- Done: the ring figure is a numeric display, 20/24 500 at −0.02em (§1.4), like ScrubStepper and OtpField.

**RadioGroup**
- high. The ring is 1 px at 28 % ink (1.86:1) while Checkbox's is 1.5 px. Fix: a 1.5 px `border-control`
  inset ring, matching Checkbox.
- medium. The error text is 12 px. Fix: 13/20.
- low. No horizontal orientation or per-option description (Part 3).

**ScrollArea**
- medium. `bordered` (default true) promises a border that never renders: the shared surface border is
  dropped. Fix: delete the shared border (§2.0 row 1); give ScrollArea its own longhand
  `borderWidth: 1, borderStyle: 'solid', borderColor: border-subtle` behind `bordered`, defaulting to
  `false` so today's look is kept.
- low. `tabIndex: 0` is applied even when nothing overflows. Fix: set it only when the content overflows.

**SegmentedControl**
- medium. `connected` items have a 31 px min height and padding 9 16. Fix: sm 32 items in a 40 px track,
  padding-inline 12.
- medium. `connected` uses a `bg-subtle` track with a `bg-surface` tile, which goes dark-on-darker in dark.
  Fix: 2.1 H.
- low. The `withSurface` radius is `calc(xl * 1.1)`. Fix (done): `radius-xl` with padding 16, the same
  card as Card size sm, and the label 8 above the track.
- Done: `elastic` chips are sm controls (32 tall, padding 12, 13/18 500) in a 40 tall row, with the pressed
  fill `accent-dim`; the `connected` tile settles over `--os-motion-layout` with ease-settle.
- low. The `withSurface` label is a 55 % mix. Fix: `fg-muted` 13/18.
- low. Dead `borderStyle` and `borderColor` declarations on the root. Fix: delete them.

**Select**
- high. The placeholder row renders in `fg-base`, so it reads like a chosen value. Fix: `fg-muted`.
- medium. The trigger has no hover. Fix: the `morph` surface takes `bg-interactive-primary` on hover.
- medium. A borderless 20-radius pill at 16 px text can't sit beside Input in a form. Fix: add
  `appearance: 'morph' | 'field'`. `field` is a §1.2 shell (40, radius 10, border, chevron) and should be
  the default inside Field.
- medium. Disabled at opacity .4, and invalid tints the fill. Fix: 2.1 D and 2.1 E.
- low. A fixed 196 px width. Fix (done): fluid with a default `maxWidth` of 256 and `fullWidth`.
- Done: the `morph` no longer bounces (`springs.surfaceOpen` 520/39 and `surfaceClose` 420/35, under 1 %
  overshoot, about as quick as before). Its rows are comfortable 40 rows 2 apart, 14/20 at 400 with text
  16 from the surface edge; the chosen row is 500 with a 16 px `fg-base` check; the chevron sits 16 from
  the end and the closed value stops 8 short of it. The `morph` is always md (40).

**Separator**
- Conforms.
- low. The dropped `border: 0`. Fix: §2.0 row 12.

**Sheet**
- low. Width 376. Fix: 384.
- low. Title 18/1.3. Fix: 18/24.
- low. Exit reverses for 360 ms. Fix: 240 ms with `ease-exit`.
- low. No close button or footer (Part 3).

**Skeleton** (Skeleton and SkeletonReveal)
- medium. Rectangles are fixed sizes (361 × 72 / 34 / 14, a 160 px button). Fix: `width` and `height`
  props, defaulting to 100 % × line height.
- low. The SkeletonReveal default radius is 7. Fix: `radius-sm`.
- low. Verify in the docs that SkeletonReveal bars reach opacity 0. A faint block was visible behind the
  bio in the light baseline crop, probably caught mid-transition.
- Done: circles match Avatar (24 / 32 / 40 / 48 / 64 / 80); the revealed content rises 8 px.

**Slider**
- medium. Unfilled ticks are a 32 % mix (2.05:1). Fix: `border-control`.
- medium. The `rail` knob focus is a halo. Fix: 2.1 A.
- low. The value label is a 72 % mix with line height 21. Fix: `fg-muted` 14/20.
- low. `tickRoot` has `maxWidth: 323.1`. Fix: remove it.
- low. The ticks are the default appearance. Fix: consider `rail` as the default for form use and keep
  `ticks` as the showcase appearance.

**Spinner**
- high. It is invisible. Fix: §2.0 row 6.
- low. The period is 700 against Button's 800. Fix: `--os-motion-spin`.
- low. Ring width 2 at 32 px. Fix: 2.5 px at lg.

**Switch** (compact and stretch)
- medium. Compact hover moves the off track toward canvas: `#efefef` → `#f7f7f6` in light, darker in
  dark. Fix: off track `accent-muted`, hover `accent-dim`.
- medium. The stretch off track is `bg-surface`, so it is invisible on canvas. Fix: `bg-muted`.
- medium. Stretch disabled at opacity .4. This is allowed, but the label must use `fg-disabled` rather
  than opacity.
- low. Focus offset 3. Fix: 2.1 A.
- Done: compact tracks 32 × 20, 40 × 24 and 48 × 28 with 2 px padding (thumbs 16 / 20 / 24, travel 12 / 16
  / 20); stretch tracks 64 × 32, 80 × 40 and 96 × 48 with a 4 px thumb inset; the off knob is `accent-dim`.

**Table**
- medium. The header-to-body boundary is gone. Fix: §2.0 row 7 (header only).
- medium. Rows are 46 and the header 38, off the grid. Fix: 48 and 40 comfortable, 36 and 32 compact
  (§1.12).
- medium. The sort button has no hover or focus style, is 18 px tall, and uses arrow text. Fix: inline-flex
  with gap 4, hover `fg-base`, the ring, icons (§1.15), and the §1.14 hit area.
- low. `whiteSpace: nowrap` on every cell. Fix: §1.12.
- low. Edge cells use 12 px padding inside a 16-radius wrapper. Fix: 16.

**Tabs** (Tabs and ExpandingTabs)
- high. The selected tile must never leave its track. React Aria's SelectionIndicator animates from viewport
  coordinates, so when the panel's height changes and the row moves, the tile flew in from 26 px below. Fix (done):
  `TabIndicator` measures against the tab list and slides only along the row (column when vertical).
- high. Keyboard focus changes the tab's radius to 6. Fix: 2.1 A, inset ring, radius unchanged.
- medium. The 13 % ink track is heavier than every other track, and the tile is darker than the track in
  dark. Fix (done): 2.1 H. Tabs and ExpandingTabs use the standard track: `bg-muted`, padding 4, gap 2, radius
  control + 6, tile control + 2, and ExpandingTabs's tile spring settles at damping ratio .8.
- medium. Unselected tabs have no hover. Fix: `fg-muted` → `fg-base`.
- low. The icon-to-label gap is 6. Fix: 8.
- low. The panel `minHeight` is 78. Fix: remove it.
- low. Line height 21. Fix: 20.

**Textarea**
- medium. Focus uses `:focus` (not `:focus-visible`) with the halo. Fix: the edge ring.
- medium. Text is 15 px, the minimum height 82, padding 14 16. Fix (done): md 14/20, min-height 80
  (twice the control height), padding 9 13 (insets 10 / 14), from the shared `fieldInputSizeStyles`, so
  Input and Textarea share one field system.
- medium. Invalid tints the fill. Fix: 2.1 D.
- low. A built-in default placeholder ("Write a note"). Fix: no default.

**Toast**
- high. The front toast has `boxShadow: none` and no border, so on a white canvas it has no edge. Fix:
  §1.9 surface (`shadow-popup` plus `border-subtle`); the stacked back cards keep their 6 % fill.
- medium. The description is single-line `nowrap` with an ellipsis, which drops content. Fix: clamp to two
  lines.
- low. Status icons are inline SVGs at stroke 2. Fix: §1.15.
- low. Actions are 28 px. Fix: keep 28 with the §1.14 hit area (the ToastRegion stack is kept as it is).
- Done: AnchoredToast has min-height 40 with padding 8 block / 12 inline from the outer edge (was
  10 / 12 / 14). ToastRegion's paddings, gaps and insets are tokens with the same values.

**Toggle**
- medium. The selected fill is `fg-base` / `bg-surface`. Fix: `accent-moderate` / `accent-on-accent`.
- medium. Height 38. Fix: md 40, with sizes in Part 3.
- medium. Hover is `bg-subtle` and disabled is opacity .5. Fix: 2.1 C and 2.1 E.
- low. Focus offset 3. Fix: 2.1 A.

**ToggleGroup** (ToggleGroup and FormatToggles)
- medium. Pill items have no hover: the background and color stay put. Fix: `fg-muted` → `fg-base`.
- medium. Items are 32 × 30 in a 3 px track. Fix: 32 × 32 in a 4 px track (40 total).
- medium. The dark selected pill is darker than the track. Fix: 2.1 H.
- low. `variant="outline"` has no outline. Fix: rename it as for Group.
- low. FormatToggles alignment radios have no hover. Fix: as the pills.
- Done: FormatToggles is a card with padding 20 and radius `xl`, two 40 px tracks 12 apart (32 px tiles on the
  standard 4 px track), and its thumb and words settle at damping ratio .8. ToggleGroupSeparator is half
  the item height, like GroupSeparator and ToolbarSeparator.

**Toolbar** (Toolbar and ToolPalette)
- high. A vertical Toolbar's separator is an `<hr>` showing the UA groove. Fix: §2.0 row 13.
- high. ToolPalette's flyout affordance is not drawn, and its notch is a 9 × 9 target. Fix: §2.0 rows
  16–17 and the §1.14 hit area.
- medium. The ToolPalette flyout is a radius-20 surface with no shadow or border. Fix: §1.9 surface.
- medium. ToolbarButton radius 16 inside a 16-radius, 6 px-padded group. Fix: 10, by nesting.
- low. Raw `#fff` twice. Fix: 2.1 J.
- low. Hover is `bg-subtle` in ToolPalette. Fix: 2.1 C.
- Done: ToolPalette tools move from 38 to md 40 at the control radius with 16 px glyphs at stroke 1.7;
  the rail takes control + 6 and `shadow-control` like Toolbar; the flyout is a radius-`lg` popup; the
  separator matches ToolbarSeparator (half the tool height, 4 px margins).

**Tooltip**
- medium. The default `subtle` tone is `bg-subtle` on canvas (1.07:1 light, 1.14:1 dark) and relies on a
  shadow that does not show in dark. Fix: default `tone="contrast"` (inverse), or add the §1.9 hairline
  to `subtle`.
- low. Padding 7 11 with 12/18 type. Fix (done): min-height 32, padding 8 12 from the outer edge (the same
  as the AvatarGroup name tip and the chart readout), 12/16 500, radius `md`. The exit is 120 ms
  (`--os-motion-press`).
- low. The demo trigger is `bg-subtle` on a `bg-subtle` stage (2.1 M).

### 2.3 Customization prerequisites (fixed 2026-11-12)

The theme builder (§1.17) needed every component to read its tokens. Each row is fixed in code; the token
audit keeps them fixed.

| ID | Component | Was | Now |
|---|---|---|---|
| A1 | Toggle | selected state outside the accent | `accent-moderate` fill, `accent-on-accent`, hover `accent-bold` |
| A2 | Tabs, Slider, Avatar, Progress, PreviewCard, Accordion, Composer | focus in `accent-moderate`, or the `--os-focus-shadow` halo | the §1.8 2px `focus-ring` outline |
| A3 | PreviewCard follow button, Avatar name tip | a `fg-base` / `bg-surface` inversion | `bg-contrast` / `fg-on-contrast` (the follow button is now the primary fill) |
| A4 | TaskChecklist shine | `#ffffff8c` | `color-mix(in srgb, fg-static-light 55%, transparent)` |
| B1 | Inline field button | `radius-sm` | `max(radius-sm, md − 4)`, so Soft gives a 10px button in a 14px shell |
| B2 | Checkbox | `sm × .96` | `radius-sm` |
| B3 | Frame body, popup items, Tabs tiles | `lg − inset` with no floor | `max(radius-sm, lg − inset)` |
| B4 | ExpandingTabs, Select `morph` row, TaskChecklist rows, SegmentedControl `elastic`, OtpField | `max(6px, xl − 5)`, `xl − 12`, `min(18px, xl)`, `md + 2` | `max(radius-sm, xl − 5)`, `max(radius-sm, xl − 12)`, `max(radius-sm, 2xl − 6)`, `max(radius-sm, lg − 4)`; identical at Standard |
| C1 | Status tokens | dark `fg-error` on `bg-error` 6.99:1; dark `fg-static-dark` on `bg-warning-contrast` 4.28:1 | dark `fg-error` `#ff9c91` (7.03:1); dark `bg-warning-contrast` `#aa7628` (4.51:1) |
| C2 | `--os-gradient-progress` | stops `#ff4fa0`, `#ff9f3a` at 2.38 and 1.59:1 on the light track | `#e9388e`, `#be6d00` (3.02 and 3.05:1 light; 3.61 and 3.58:1 dark) |
| C3 | StretchSwitch track, PeoplePreview faces, Avatar tip timing | user-agent button text color; a literal 160ms | `color: inherit`; `--os-motion-hover` |

Remaining exceptions, by rule: none for radii (Composer's 3px level bars are pills now, and ToggleGroup's
vertical track takes control + 6 like every track). Reduced-motion branches write the §1.10 120 ms ceiling
as `--os-motion-press`.

---

## Part 3: Missing API surface


### 3.0 Library-wide conventions (apply to every component)

- **Passthrough.** Every component accepts `className`, `style` and `ref`, forwarded to its outermost
  element. React 19 `ref`-as-prop works through `ComponentPropsWithRef`.
  - **Missing today:** Accordion, AlertDialog, Avatar, AvatarGroup, Badge, Breadcrumb, Calendar,
    Checkbox, CheckboxGroup, Combobox and Autocomplete (they also have no `ref`), Command, Composer,
    DatePicker, Dialog, Drawer, ScrubStepper, Field, StretchSwitch, Menu, NumberField, OtpField, Popover,
    PreviewCard, Progress, TaskChecklist, RadioGroup, SegmentedControl, Select, Separator, Sheet,
    Skeleton, Slider, Switch, Tabs, ToastRegion, Tooltip.
  - **Partial:** components built on RAC with `className` in `Omit` accept neither a string nor a function.
- **Names.**
  - Sizes: `size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'`, with legacy `'small' | 'medium' | 'large'` as aliases.
  - Validation: `isInvalid` plus `errorMessage`, keeping today's `error` as an alias. Today the library
    mixes `error`, `isInvalid`, `invalid` and `aria-invalid`.
  - Help text: `description`, which replaces `hint`.
  - Booleans: `isDisabled` and `isReadOnly` (RAC style), with `disabled` and `readOnly` aliases on native
    wrappers.
- **Controlled and uncontrolled.** Every stateful component takes both `value` and `defaultValue` (or
  `selectedKey` / `defaultSelectedKey`, `isOpen` / `defaultOpen`, and so on).
  - **Controlled-only today:** Select, DatePicker, OtpField, Slider.
  - **Uncontrolled-only today:** Dialog (it has `onOpenChange` but no `isOpen`).
- **Forms.** Every input-like component takes `name`, `value` (for choices), `form`, `isRequired`,
  participates in native reset, and reads Field context.
  - **No `name` today:** Composer (its textarea has none), DatePicker, Slider and RadioGroup options
    (they rely on the group).
  - **No `value` today:** Checkbox and Switch, so they always submit `"on"`.
- **States.** Disabled, invalid, read-only and loading on every control where they make sense, rendered
  per §1.8. Read-only has no styling anywhere today.

### 3.1 Per component

Gaps are named by example and part.

| Component | Missing |
|---|---|
| Accordion | `isDisabled` per item; `headingLevel`; className, style and ref; multiple mode documented (AccordionGroup takes `allowsMultipleExpanded`, but there is no example); controlled group (`expandedKeys`) example; separate Item, Trigger and Panel parts for custom content. |
| Alert | `action` slot ("With Icon and Action Buttons"); `title` and `description` parts; `onDismiss` with a close button; `variant` filled/outline. |
| AlertDialog | `onCancel`; async `onConfirm` with a loading confirm button; `isDismissable` (default false); `size`; custom footer ("Bare Footer"); close-confirmation pattern; className. |
| Autocomplete | `size`; `isLoading` (async search); clear button; start addon; sections and groups; `limit`; `autoHighlight`; inline completion; read-only styling; className and ref. |
| Avatar | `shape`/`radius` ("Different Radius"); `status` dot; className, style and ref. AvatarGroup: `max` with a "+N" count, `size`, `lastOnTop`. |
| Badge | `variant: 'neutral' \| 'secondary' \| 'outline' \| 'destructive' \| status`; `size: 'sm' \| 'md' \| 'lg'`; count badge; `href` or link rendering; className and ref; optional `status`. |
| Breadcrumb | `separator` prop; `maxItems` with an ellipsis menu; router link component (`linkAs` or RAC `Breadcrumbs`); className. |
| Button | Sizes xs and xl; `appearance: 'destructive-outline' \| 'link'`; link rendering (`href` → `<a>`, or a render prop); `aria-pressed` styling; icon sizes tied to `size`. |
| Calendar | Month/year dropdown navigation; `visibleDuration` (multiple months, omitted today); cell `size`; `isDisabled` styling for the whole grid; className. |
| Card | `variant: 'filled' \| 'outline'`; header `action` slot (CardAction); `padding` / `size`; `headingLevel`; panel slot ("CardPanel" for tables). |
| Checkbox | `value`; `description`; `isReadOnly`; `size`; `variant="card"`; className and ref; `inputRef`; `form`; `autoFocus`. |
| CheckboxGroup | Per-option `description`; parent "select all" with indeterminate state ("Parent Checkbox", "Nested"); `variant="card"`; className. |
| Collapsible | `variant: 'filled' \| 'outline' \| 'plain'` (plain = unstyled trigger and panel); custom trigger (`trigger` render); `headingLevel`. |
| Combobox | `size`; multiple selection with chips; sections and groups; clear button; start addon; `isLoading`; input-inside-popup mode; select-like button trigger; read-only styling; className and ref. |
| Command | Groups with labels; separators; standalone (non-dialog) Command; item `description`; custom footer; `isLoading`; className. |
| Composer | `name` and form integration; `fullWidth`; attachments (chips or tokens); `status` (streaming) with a stop button; `isLoading`; `maxRows`; className; `onKeyDown` passthrough. |
| ContextMenu | Checkbox and radio item visuals; link item; switch item; group label example. Shares Menu's gaps. |
| DatePicker | `defaultValue`; `maxValue`; `isDateUnavailable`; `isInvalid` / `errorMessage` / `description`; `name`; `isRequired`; `granularity` (date-time); `size`; range picker ("Date Range Picker"); presets; `shouldCloseOnSelect`; className. |
| Dialog | `isOpen` / `defaultOpen` (controlled); `size`; close button; `children` as plain nodes (only a function is accepted today); footer slot; `isKeyboardDismissDisabled`; nested dialogs example; scrollable body; className. |
| Drawer | Footer slot; close button; `size`; inset and straight variants; nested drawers; DrawerMenu items; className. |
| Empty | `headingLevel`; `size`; `variant="dashed"`; media slot ("EmptyMedia"). |
| Field | `isInvalid` without a message; FieldDescription and FieldError as parts; validity render prop; `orientation="horizontal"`; className; context consumed by every control (§1.11). |
| Fieldset | `description`; `errorMessage`; `variant="plain"` (legend only, no border). |
| Form | `validationErrors` example; actions row helper. |
| Frame | Multiple panels ("Separated Panels"); `title` and `description` parts; `variant: 'filled' \| 'outline'`. |
| Group | `size`; GroupSeparator; GroupText ("Start Labeled Text", "End Text"); nested groups; rename the `outline` variant. |
| Input | `isReadOnly` styling; file input styling ("File"); TextField `size`; className on TextField's root (it is applied to the input today); `description` naming. |
| InputGroup | `isDisabled`; `size`; button, icon-button, Kbd and badge addons ("With Icon Button", "With Keyboard Shortcut"); inner label; `isLoading`; Textarea and NumberField inside; InputGroupText part. |
| Kbd | `size: 'sm' \| 'md'`; KbdGroup. |
| Label | `isRequired` marker; `isDisabled` styling; use with Checkbox ("With Checkbox"). |
| Menu | Checkbox items, radio groups and switch items with visuals; link item visual; `openOn="hover"`; `closeOnSelect`; className; MenuShortcut as a Kbd part; destructive item hover tint. |
| Meter | `size` (track height); `hideLabel` (the label is required today); `valueLabel` override. |
| NumberField | `size`; read-only styling; `hideStepper`; className. ScrubStepper: `size`, `isReadOnly`, `isInvalid`, className. |
| OtpField | `defaultValue` (uncontrolled); `type: 'numeric' \| 'alphanumeric'`; separator; `placeholder` hints; `size`; custom normalization; lengths other than 4 and 6; className. |
| Pagination | `size`; `siblingCount`; first/last buttons; text Previous/Next ("PaginationPrevious/Next"); `labels` for i18n. |
| Popover | `width` / `size`; close button; arrow ("Tooltip Style"); non-dialog role for menus; className. |
| PreviewCard | `width`; className. PeoplePreview has no generic API, so it is a showcase rather than a library primitive. |
| Progress | `minValue` / `maxValue`; `isIndeterminate`; `size`; `tone`; visible label and value parts ("With Label and Value"); `formatOptions`. |
| RadioGroup | `orientation`; per-option `description`; `description`; `isReadOnly`; `variant="card"`; className; Radio as its own export for custom layouts. |
| ScrollArea | `orientation: 'vertical' \| 'horizontal' \| 'both'`; scroll fade; `bordered` default false (§2.2); viewport padding. |
| SegmentedControl | `size: 'sm' \| 'md' \| 'lg'`; icon options; navigation mode (links, `aria-current`); className. |
| Select | `defaultValue` (uncontrolled); `appearance: 'morph' \| 'field'`; `size`; sections, groups and separators; multiple selection; `isReadOnly`; `description`; className. |
| Separator | className, style and ref. |
| Sheet | `size`; close button; footer slot; inset variant ("Sheet with Inset"); className. |
| Skeleton | Free `width`, `height` and `radius`; `className`; text-line helper with `lines`. |
| Slider | `defaultValue`; `name` and `form`; `orientation="vertical"`; `onChangeEnd`; `formatOptions`; marks and labels; `size`; className. |
| Spinner | Conforms. Optional `tone`. |
| Switch | `description`; `value`; `isReadOnly`; `isInvalid`; `isRequired`; `size` on the stretch appearance; `variant="card"`; className. |
| Table | `density: 'comfortable' \| 'compact'`; TableFooter; row selection; `wrap` per column; card-style wrapper variant; sticky header. |
| Tabs | `variant: 'tile' \| 'underline'`; `orientation="vertical"`; `size`; `disabledKeys` with styling; panels decoupled from `items` (TabList and TabPanel parts); className. |
| Textarea | `size`; auto-resize (`minRows` and `maxRows`); Field context; `isReadOnly` styling; character count. |
| Toast | `kind: 'loading'` and promise toasts; update in place (upsert); anchored toasts; `placement`; per-toast `timeout` defaults by kind; className. |
| Toggle | `size`; `variant: 'ghost' \| 'outline'`; icon-only square sizing. |
| ToggleGroup | `size`; ToggleGroupSeparator; `isDisabled` example; tooltips; rename the `outline` variant. |
| Toolbar | ToolbarLink; toggle buttons inside a toolbar (ToggleButton with the toolbar style); `size`. |
| Tooltip | `delay` and `closeDelay`; `isOpen` / `defaultOpen`; `isDisabled`; `offset`; className; shared delay group ("Grouped Tooltips"). |
