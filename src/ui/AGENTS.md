# Otherstates UI: rules for agents

This folder is the whole design system. Everything a product shows is built from it: its components, its
tokens and its patterns. Nothing on screen comes from anywhere else. A change that steps outside the system
is a bug, even if it looks right.

## The workflow, for every UI task

1. **Look before you build.** Search `src/ui/agent/manifest.json`, or read `llms.txt` at the project root,
   for a component that does the job. Each component has a page in `src/ui/agent/components/<id>.md` with
   its props, accessibility notes and the full code of every example. Full screens to copy from are in
   `src/ui/catalog/templates/` (agent chat, an agent dashboard, an analytics dashboard, a projects list and a settings page).
2. **Check the props before deciding something is missing.** Most "new" needs are a variant that already
   exists: `Switch variant="row"` for settings lists, `Button appearance="link"`, `RadioGroup variant="card"`,
   `Card footer`, `BarChart highlight`.
3. **Compose.** Import from `@/ui/components`. Lay out with StyleX on the tokens:
   `import { tokens as t } from '@/ui/tokens.stylex'`, then `gap: t['--os-space-4']`.
4. **Build only when nothing fits.** Scaffold with `node src/ui/agent/new-component.mjs <name>` and follow
   "Building a new component" below. Give it a docs page; the page is how the next agent finds it.
5. **Never invent a value.** If you need a color, space, size, radius or duration the tokens don't have,
   stop and propose a token or a spec change to the person you are working with. Don't approximate it inline.
6. **Check.** Run `node src/ui/agent/check.mjs`. In Claude Code it also runs after every edit and reports
   back. Done means 0 errors. Findings the product's code had before it adopted the system (its Tailwind,
   say) can sit in `src/ui/agent/baseline.json`: the check lists them as known and fails only on new ones.
   Never add to the baseline to get past a finding in code you wrote; when you replace old code with system
   components, rerun with `--baseline` so the fixed findings can't come back.

## Styling rules

- **Space:** `--os-space-*` only: 2 4 6 8 12 16 20 24 32 40 48 56 px (`0-5 1 1-5 2 3 4 5 6 8 10 12 14`).
  Three tiers: 8 inside a group (label to control), 20 between fields and rows, 32 between sections.
- **Surfaces:** a screen sits on `bg-subtle` (set `backgroundColor: t['--os-color-bg-subtle']` on its outer
  element) and cards on it are `filled`. On a white `bg-canvas` page, use `Card variant="outline"`: a filled
  card on canvas has no visible edge in light mode.
- **Color:** tokens by role, never a hex or rgb value. Text uses `fg-base`, `fg-muted`, `fg-subtle` or
  `fg-disabled`. Surfaces use `bg-surface` (cards) on `bg-subtle` (pages). Lines use `border-subtle` or
  `border-muted`. Status colors (`fg-success`, `bg-error`…) carry meaning only, never decoration. Dark mode
  comes free from the tokens: never branch on the theme.
- **Corners:** controls take `--os-radius-control` (it follows the corner setting, a pill at Round).
  Surfaces take `--os-radius-lg` or `--os-radius-xl`. Nested shapes subtract their inset (spec 1.3).
- **Type:** `--os-font-size-*`, `--os-line-height-*`, `--os-font-weight-*`, `--os-tracking-tight`.
  Sentence case everywhere, no all-caps labels.
- **Elevation and motion:** `--os-shadow-control`, `--os-shadow-popup`; `--os-motion-*` durations with
  `--os-ease-*` curves; honor `prefers-reduced-motion`.
- **StyleX:** longhands only. `border`, `background`, `animation` and the other shorthands in spec 1.0 are
  silently dropped. Write `borderWidth`/`borderStyle`/`borderColor`, `backgroundColor`, `animationName`…
- **Never:** utility classes (`className="p-4"`), other UI kits or icon sets, raw stylesheets, inline
  `style` with literal values, or a hand-made `<button>`, `<input>`, `<select>`, `<textarea>`, `<table>`
  or `<dialog>` when the component exists.

## Server rendering (Next.js)

The same code renders on a server (Next.js Server Components, prerendering) and in the browser. The check
enforces the first four in the system's own files; follow all of them everywhere.

- **'use client' first** in any file that uses hooks, context, React Aria, event handlers, or passes a
  function (`onPress`, `format={formatCost}`, `actions={[{ onAction }]}`, a render-prop child) or a date from
  `@internationalized/date` to a component. Pages and layouts stay Server Components: put the interactive
  part in its own 'use client' file (the starter's `theme-switch.tsx` is the pattern).
- **A 'use client' file exports components and hooks only.** A plain function exported from one reaches a
  Server Component as a reference it can't call. Formatters live in `agent-format.ts` (`formatTokens`,
  `formatCost`, `formatDuration`, `formatWait`, `describeUndo`), permission rules in `permission-presets.ts`;
  call them anywhere.
- **No clock or randomness while rendering:** no `Date.now()`, `new Date()`, `Math.random()`, `today()` or
  `date.toDate()` in a component's body or a `useState` initializer. A prerendered Next.js page fails to
  build, and a server-rendered one keeps the day it was built. Read them in an event handler or effect; take
  "from today" dates from `useToday()` (null until the browser runs); give presets a function value
  (`{ label: 'Today', value: () => today(getLocalTimeZone()) }`); use fixed dates in examples.
- **No browser globals while rendering:** `window`, `document`, `localStorage` and `matchMedia` only in
  effects, handlers or `useSyncExternalStore`, and every `useSyncExternalStore` gets a server value (its
  third argument).
- Calendar, DatePicker and DateRangePicker read the clock inside React Aria, so on a server they render a
  placeholder of their size and become interactive once hydrated. That is expected, not a bug.

## Patterns

The spec is the source of truth (`src/ui/DESIGN_SPEC.md`). The ones that come up most:

- **Forms (1.11):** labels, help text and errors start at the field's outer edge at every corner setting.
- **Settings pages (1.11):** one card per section, 32 apart; switches as `Switch variant="row"` rows with
  hairlines; typed fields save from the card footer (hint on the start side, one small button on the end).
- **Cards:** `filled` on `bg-subtle` pages, `outline` on canvas. Tables and lists inside run edge to edge
  through `CardPanel`.
- **Charts (1.18):** `LineChart`, `BarChart`, `Sparkline`. One series uses the accent; several use
  `--os-color-chart-1…5` in order. A comparison series is `muted`. Never a second y axis.
- **Focus (1.8):** one ring: 2px `focus-ring` outline, offset 2. Comes with the components.
- **Chat (1.20):** a conversation is `ChatThread` (one 720 px column, pinned to the newest text, sticky
  `Composer variant="outline"`), `ChatMessage` (a person's bubble, or an assistant's reply as prose) with
  `MessageActions`, replies written with `Markdown`, thinking with `Reasoning`, and `PromptSuggestions` for
  an empty thread. Copy the Agent chat template (`src/ui/catalog/templates/chat/`) for a whole screen.
- **Agent interfaces (1.19):** build from the agent parts, never around them. States with `StatusBadge` and
  `StatusDot` (`AgentState`), risk with `RiskBadge`, agents with `AgentIdentity` and `AgentGlyph` (squares;
  people are circles), runs with `Steps`, changes with `FileChanges`, `DiffStat` and `DiffView`, budgets with
  `UsageBar` and `ContextWindow`, figures with `RollingNumber`, numbers with `formatTokens`, `formatCost` and
  `formatDuration`. A new agent card follows the card language in spec 1.19: one object, a head row, one
  hero, washes not lines, point to inspect, actions at the foot; reuse `internal/agent-parts.tsx`. For a run in a message use `RunBlock` (with `ToolCall` per step); steer it with `Composer` `onSteer`/`onQueue`/`onStop`; review its edits with `ChangeReview`; restore with `CheckpointList` or `CheckpointMarker`. For a person's decision use
  `ApprovalCard` or `DecisionCard`; for queues `AgentInbox`, `ReviewQueue` and `ApprovalGates`; for
  permissions `PermissionRules` (allow, ask or deny per tool).
- **Dashboards (1.21):** a number that matters is a `Stat` (figure, plus a change, limit or trend; give it
  `onPress` to open the work behind it). An agent dashboard leads with `HandoffList` (what waits on a
  person, longest first, decided in place), then the runs, each opening to a `RunTimeline` (steps on one
  time axis, waiting time in amber), then spend in a `UsageBar`. Copy the Agent dashboard template
  (`src/ui/catalog/templates/agents/`) for a whole screen.

## Building a new component

1. `node src/ui/agent/new-component.mjs <name> --kind control|display` writes the component, a docs page and
   the export. Pick `control` for anything interactive and `display` for anything static.
2. Build on the shared parts in `components/internal/`, never around them:
   - `size.ts`: the size scale (`heightStyles`, `pillPaddingStyles`, `gapStyles`, `textStyles`,
     `radiusStyles`), so a new control lines up with Button and Input at every size.
   - `states.ts`: `focusStyles`, `transitionStyles`, `hoverStyles`, `pressStyles`, `disabledStyles`.
   - `surface.ts`: card and panel surfaces. `overlay.tsx`: popover, menu and sheet surfaces.
   - `control.ts` and `field-styles.ts`: text-entry shells. `choice.tsx`: checkbox, radio and switch rows.
3. Behavior comes from React Aria Components (keyboard, focus, ARIA). Don't hand-roll it. Anything
   interactive starts with `'use client'` (the control scaffold does); see "Server rendering" above.
4. Fill in the docs page: a hero example, one example per variant, the props table and accessibility notes.
   Then run `node src/ui/agent/build-docs.mjs` so the catalog lists it.
5. Check light and dark, every corner setting (Tight, Standard, Soft, Round), keyboard focus, reduced
   motion and a 375px-wide screen.

## Exceptions

When the system truly lacks something, mark the line and say why, so the gap stays visible and reviewable:

```tsx
{/* os-allow native-control: a row title that opens the project; the system has no Link component yet */}
```

The rule name comes from the check's output (`raw-space`, `raw-color`, `native-control`…). An exception
without a reason is not allowed. Raise the gap with the person you are working with; it usually means the
system needs a new token, variant or component.

## Definition of done

- `node src/ui/agent/check.mjs` reports 0 errors.
- No new value exists outside the tokens.
- New components have a docs page, and `node src/ui/agent/build-docs.mjs --check` passes.
- It works in light and dark, at every corner setting, by keyboard, and at 375px.
