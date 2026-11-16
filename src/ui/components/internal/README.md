# Internal helpers

Shared building blocks for the components in `src/ui/components/`. Nothing here is re-exported from
the public barrel. `DESIGN_SPEC.md` is the source of truth; these files encode its Part 1 so a
component does not restate it. Import from `./internal/<file>`.

## Read first: four StyleX facts

1. **Longhands only.** `border`, `borderTop…`, `borderInline…`, `borderBlock…`, `background`,
   `animation` and `all` compile to nothing in StyleX 0.19 (spec 1.0).
2. **Whole-property merge.** In `stylex.props(a, b)`, if `b` sets `borderColor` it replaces every
   condition of `a.borderColor` (default, `:hover`, media). State helpers own complete properties and
   go last: base, size, state (hover/selected), invalid, disabled, read-only, focus.
3. **Focus loses to hover.** StyleX 0.19 emits `:focus-within` and `:focus-visible` rules *before*
   `:hover` rules. When hover and focus set the same property, write the hover as
   `':hover:not(:focus-within)'` (see `controlStyles.shell`).
4. **Render-prop classNames drop dynamic styles.** `className={(s) => stylex.props(...).className}`
   keeps only the class; a dynamic style function's inline CSS variables are lost. Use static styles
   inside React Aria render props (that is why `popupPlacement()` returns static styles).

## Size scale (spec 1.2) — `size.ts`

| Size | Height | Pill pad (icon side) | Rect pad (icon side) | Field inset¹ | Gap | Icon | Text | Radius (`radiusStyles`, Standard) |
|---|---|---|---|---|---|---|---|---|
| xs | 24 | 10 (8) | 8 (6) | 8 | 4 | 14 | 12/16 500 | control − md + sm (6) |
| sm | 32 | 12 (10) | 10 (8) | 12 | 6 | 16 | 13/18 500 | control (10) |
| **md** | 40 | 20 (16) | 12 (10) | 14 | 8 | 16 | 14/20 500 | control (10) |
| lg | 44 | 24 (20) | 16 (12) | 16 | 8 | 18 | 15/20 500 | control (10) |
| xl | 48 | 28 (24) | 16 (12) | 16 | 8 | 20 | 16/24 500 | control (10) |

¹ From the outer edge, border included: `paddingInline` = inset − 1. Field values are weight 400 and
16px on `@media (pointer: coarse)`. Rows inside surfaces: `rowHeights` compact 32, default 36,
comfortable 40, table body 48 (`rowHeights`; components write 36 as a literal and 32/40/48 as
`--os-size-sm/md/xl`). Inline buttons in a field are sm 32×32 from md up, centered in the shell (inset 4 / 6 / 8 at
md / lg / xl), 24 in an sm shell and 16 in an xs shell (inset 4), radius max(sm, control − 4): see
`fieldButtonSizeStyles` in `control.ts`.

| Export | What | Use |
|---|---|---|
| `ControlSize`, `LegacyControlSize`, `ControlSizeProp` | `'xs'…'xl'`, `'small' \| 'medium' \| 'large'`, their union | Type every public `size` prop as `ControlSizeProp`. |
| `normalizeSize(size, fallback = 'md')` | legacy → new name | First line of any component with a `size` prop. |
| `sizeScale[size]` | numbers above (`height`, `padPill`, `padPillIcon`, `padRect`, `padRectIcon`, `fieldInset`, `gap`, `icon`, `fontSize`, `lineHeight`, `fontWeight`, `radius`) | `<Icon size={sizeScale[size].icon}>`, spinner size, math. |
| `controlSizes` | `['xs','sm','md','lg','xl']` | Docs tables, loops. |
| `lineHeights`, `lineHeightFor(px)` | 16/18/20/24 | Pixel line height for a font size. |
| `rowHeights` | 32/36/40/48 | List and table rows. |
| `heightStyles[size]` | fixed `height` | The element that owns the height. |
| `squareStyles[size]` | width = height, padding 0 | Icon-only controls. |
| `pillPaddingStyles[size]`, `rectPaddingStyles[size]` | `paddingInline` | Pills vs rectangular controls. |
| `pillIconPaddingStartStyles[size]` / `pillIconPaddingEndStyles[size]`, `rectIconPaddingStartStyles[size]` / `rectIconPaddingEndStyles[size]` | `paddingInlineStart` / `paddingInlineEnd`: the icon side (pills 8/10/16/20/24, rects 6/8/10/12/12) | Compose after the size's padding, `Start` for a leading icon, `End` for a trailing one (Button, Toggle, Pagination). No component keeps its own copy of the table. |
| `gapStyles[size]` | icon-label gap | |
| `textStyles[size]` | size, px line height, 500, tracking | Control labels. |
| `radiusStyles[size]` | sm for xs, md otherwise | Rectangular controls. |
| `fieldInputSizeStyles[size]` | inner input inset, value text, block padding | Inner `<input>` of a bordered shell of that size. |
| `typeStyles.*` | `caption12`, `small13`, `help13`, `body14`, `body15`, `body16`, `title18` (tight tracking), `tabular` | Non-control text on the 1.4 scale. |

## States (spec 1.8) — `states.ts`

| Export | Keys | Use |
|---|---|---|
| `focusStyles` | `ring` (2px, offset 2), `ringInset` (offset −2), `ringVisible` / `ringInsetVisible` (same on native `:focus-visible`), `ringInsetOverlay` (inset ring on a `::before`, z 1, for controls whose positioned children cover an outline; sets `position: relative`), `none` | `ring` on RAC `isFocusVisible`. Inset only for neighbors < 4px away or `overflow: hidden` parents. Text-entry shells use the edge ring in `controlStyles.shell`. Virtual-focus items use the hover fill, no ring. Radius never changes on focus. |
| `transitionStyles` | `colors`, `colorsAndPress` | `--os-motion-hover` with ease-settle; reduced motion → 0. |
| `hoverStyles` | `fill` / `fillActive` (→ bg-interactive-primary), `row` / `rowActive` (→ bg-subtle), `neutral` (accent-subtle → muted → dim), `primary` (accent-moderate → bold → strong), `text` / `textActive` (fg-muted → fg-base) | Pseudo versions are wrapped in `@media (hover: hover)`; `*Active` versions go on RAC `isHovered`, or `isFocused` for menu/listbox/command/Select-morph items. |
| `pressStyles` | `scale` (.97, ≥24px), `scaleIndicator` (.9, ≤20px), `scaleActive` (native `:active`), `fill` (bg-interactive-secondary) | On RAC `isPressed`. No scale on list rows. |
| `disabledStyles` | `text` (transparent stays transparent), `filled` (bg-disabled), `shell` (border-disabled, no hover), `label`, `composite` (opacity .4, only StretchSwitch, Slider ticks, ToolPalette tools, avatars) | Color swap, never opacity on tokenized parts. Dim the label too. |
| `invalidStyles` | `shell` (1px border-error, focus edge in error, no tint), `borderless` (inset 1px ring), `indicator` (1.5px inset ring), `message` (13/20 fg-error) | Show on blur/submit. The message replaces the help text. |
| `readOnlyStyles` | `shell` (bg-subtle, border-subtle, focus edge kept), `hidden` | Hide steppers, chevrons, clear buttons; set `aria-readonly`. |
| `loadingStyles` | `control` (cursor progress), `label` (opacity 0, keeps layout), `spinner` (¾ ring, `--os-motion-spin`, static under reduced motion), `spinnerCentered`, `spinnerSize(px)` | Size the spinner with `sizeScale[size].icon`. `aria-busy`, ignore presses, keep the fill. |

## Fields — `control.ts`, `field-styles.ts`

`controlStyles` (Input, Combobox, Autocomplete, NumberField, InputGroup):

| Key | What |
|---|---|
| `stack` | label / control / message column, gap 8. |
| `label` | 14/20 500. |
| `description`, `error` | help 13/20 fg-muted; add `error` for the error line. |
| `shell` | bordered shell: border-subtle, hover border-muted, **edge ring** on every focus (focus-ring border + 1px inset shadow). No height of its own. |
| `invalid`, `invalidBorderless` | one invalid style for bordered shells; inset ring for borderless ones. |
| `disabled`, `readOnly` | color swap with no hover; read-only keeps the focus edge. |
| `row` | flex row for shell content. |
| `input` | md value text: inset 13 + 1, 14/20 at 400, 16px on coarse pointers, block padding 9 so a standalone input that is its own shell measures 40. No minHeight. |
| `inputInner` | inner input of a shell: no edge, no ring, stretches to the shell's height. |
| `fieldButton` | inline field button: radius max(sm, control − 4), icon fg-muted → fg-base and fill bg-interactive-primary on hover, bg-interactive-secondary + .97 pressed, no hover or press when disabled, hit area 24 (44 coarse). Compose `fieldButtonSizeStyles[size]` after it for its size and inset. Put `<Icon size={16}>` in it. |
| `popup` | anchored list popup: bg-elevated, hairline, shadow-popup, padding 6, explicit 14/20 type, `--trigger-width`. Remaps bg-surface to elevated inside. |
| `option`, `optionActive`, `optionSelected`, `optionDisabled` | 36px list rows, padding 10, radius 10; active = bg-interactive-primary; selected = 500 + 16px check, no fill. |
| `focus` | the 2px ring (same as `focusStyles.ring`). |
| `focusShell` | deprecated: the edge ring now lives in `shell`. |
| `iconButton`, `buttonInset` | legacy inline button (NumberField, Calendar). New work uses `fieldButton`. |

`controlShellSizeStyles[size]` gives a shell its explicit height (24/32/40/44/48).
`fieldButtonSizeStyles[size]` sizes an inline field button for its shell: 16 / 24 / 32 / 32 / 32, marginInline
`calc(space-1 − 1px)` through md and `calc((shell − 32) / 2 − 1px)` at lg and xl. Combobox, Autocomplete, NumberField and
DatePicker use it; InputGroup's text buttons use the same insets.
`FieldContext`, `InputGroupContext`: the field context (`id`, `descriptionId`, `invalid`, `required`, `disabled`) and the "inside an InputGroup" flag.

Compose a field: `stylex.props(controlStyles.shell, controlStyles.row, controlShellSizeStyles[size], invalid && controlStyles.invalid, disabled && controlStyles.disabled, readOnly && controlStyles.readOnly)` on the shell (wrap it in RAC `Group` for comboboxes so the popup takes its width), and `stylex.props(controlStyles.input, fieldInputSizeStyles[size], controlStyles.inputInner)` on the input.

`fieldStyles` (TextField and DatePicker shells; label/help/error for Select, Textarea, OtpField, Slider):
`root`, `label` (14/20 500), `shell` (same rules as `controlStyles.shell`, **xl 48 by default**, padding on the shell), `invalid`, `invalidBorderless`, `disabled`, `readOnly`, `help` / `error` (13/20), `smallLabel` (floating label, 12/16 500, no margin). `fieldShellSizeStyles[size]` sets height, inset and value size for a `fieldStyles.shell` of another size.

## Surfaces — `surface.ts`

`surfaceStyles`: `surface` (fill bg-surface, radius lg, **no hairline**), `outline` (opt-in 1px border-subtle), `heading`, `description`, `copy`, `cardSurface`, `group` (raised group shell: shadow-control, padding 6, gap 2, radius control + 6), `vertical`, `flush`, `track` (bg-muted, padding 4, radius control + 6) + `trackPill` (deprecated, same radius), `tile` (selected tile: bg-raised + shadow-control, fg-base 500) + `tileIdle` (fg-muted → fg-base) + `tileRadius` (max(sm, control + 2)), `toggled` (accent-moderate / accent-on-accent, Selected 2), `current` (bg-interactive-primary, Selected 3), `control` (compact transparent control, hover bg-interactive-primary), `focus` (inset ring drawn on `::before`), `pressed` (.97), `disabled`, `selected` (deprecated legacy look; pick `tile`, `toggled` or `current`).

## Choices — `choice.tsx`

`ChoiceIndicator({ kind: 'checkbox' | 'radio' | 'switch', state, large? })` renders the indicator from
a RAC render-prop state (`ChoiceState`). Checkbox and radio rings are 1.5px inset shadows in
`border-control`; hover steps the ring to 60% ink with a bg-subtle fill; invalid → border-error;
disabled → border-disabled and bg-disabled; focus → 2px ring at offset 2. `choiceStyles` keeps the
row (`choice`: 32 tall, 14/20, gap 12), `field`, `labelText`, `disabledText`, `error` (13/20), the ring
keys (`ring`, `ringHovered`, `ringSelected`, `ringInvalid`, `ringDisabled`), `pressed` (.97) /
`pressedIndicator` (.9), `keyboardFocus` and the switch parts. `choiceClassName({ isDisabled })`,
`ToggleProps`, `ChoiceOption` are shared prop shapes.

## Overlays — `overlay.tsx`

| Export | What |
|---|---|
| `overlayStyles.surface` | bg-elevated, 1px border-subtle, shadow-popup, radius lg, explicit Inter 14/20 400 tight tracking. Remaps `--os-color-bg-surface` to the elevated fill inside, so content keeps its page relations. |
| `overlayStyles.overlay` + `animateIn` | modal backdrop (bg-overlay, `--os-z-modal`), fade in over `--os-motion-popup`. |
| `overlayStyles.popupMotion` + `popupPlacement(placement)` | anchored entry: 220ms ease-settle, opacity, scale .96, 4px **away from the trigger**, origin on the trigger side. `overlayStyles.origin(popupOrigin(p))` is the older spelling of the same. |
| `overlayStyles.windowMotion` / `windowMotionTop` | modal entry 280ms from translateY(+8px) / (−8px for Command), scale .98. |
| `overlayStyles.exit` | the one exit: plays whatever exit the entry style named (popups and windows fade + .98 over 160ms, backdrops fade, sheets slide to their edge over 240ms), ease-exit, never a reversed entry. Apply on `isExiting`, after the entry style. Reduced motion: 120ms fades. |
| `overlayStyles.dialog`, `heading`, `title` (18/24 500, tight tracking), `description` (14/20) | panel layout; padding 20, gap 16. |
| `overlayStyles.popup`, `menu`, `key`, `sheet`, `sheetContent`, `vertical`, `horizontal`, `top/right/bottom/left` | popup max width (no zIndex: RAC writes 100000), menu list, legacy shortcut key, sheet sizing and edges. `menu` remaps bg-subtle to bg-interactive-primary for legacy item styles. |
| `overlayItemStyles` | spec 1.9 rows: `list` (gap 2, padding 6), `item` (36, radius 10, padding 10, 14/20 400), `active` (hover and virtual focus), `pressed`, `selected` (500), `disabled`, `icon`, `end`, `groupLabel` (12/16 500), `separator`, `empty`. |
| `PanelHeading`, `MenuPopup` (`menuStyle`, `popoverStyle` extension props), `TriggeredMenu` | shared overlay parts. |
| `popupOrigin`, `popupPlacement` | placement → origin string / static placement style. |
| `overlayButtonAppearance`, `OverlayButtonTone` | the retired overlay button's tones mapped to Button appearances: neutral → tertiary, primary → primary, danger → destructive (size md in overlay footers). |
| `OpenProps`, `PortalProps`, `PanelProps`, `PlacementProps`, `MenuPopupProps`, `Edge` | shared prop types. |

## Others

- `suggestion-input.tsx`: `SuggestionInput` (body of Combobox and Autocomplete: md shell in a RAC
  Group, edge ring, `fieldButton` chevron, spec 1.9 list popup), `CatalogOption`, `ComboboxProps`.
- `spring.ts`: `useChoiceSpring`, `advanceChoiceSpring`, `useSurfaceSpring`, `advanceSurfaceSpring`
  (physics), `springs` (surface 380/34, surfaceOpen 520/39, surfaceClose 420/35: damping ratio .85 or more, so
  big things never bounce; tiles that travel use ratio .8), plus `motion` (ms: press 120, hover 160, popup 220, modal 280,
  sheet 360, sheetExit 240, layout 420, slow 600, spin 800, reduced 120), `easing` (settle, spring,
  exit) and `prefersReducedMotion()` for JS-driven animation.
- `class-name.ts`: `withClassName(stylexProps, className)` joins a StyleX class with a caller's class.

## Tokens added in this pass (spec 1.1)

`--os-color-focus-ring`, `--os-color-border-control`, `--os-color-bg-raised`, `--os-color-bg-elevated`;
`--os-space-0-5 / 1-5 / 5 / 10`; `--os-radius-xs / 2xl`; `--os-font-size-caption` (13) / `-body` (16);
`--os-line-height-xs / sm / md / lg` (16/18/20/24); `--os-tracking-tight`; `--os-motion-hover / modal /
sheet / layout / slow / spin` (popup is now 220); `--os-ease-spring`, `--os-ease-exit`;
`--os-z-modal / toast / tooltip`. Dark `--os-shadow-control` has a 1px 8% white ring.
`--os-focus-shadow` is deprecated: no new use.
