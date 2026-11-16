---
name: otherstates-ui
description: Build UI with the Otherstates design system. Use for any screen, component, layout, style or chart in a project that has src/ui/tokens.stylex.ts — look up existing components and templates first, compose them with tokens, scaffold a new component only when nothing fits, and run the design-system check before finishing. Never use another UI kit, utility classes or raw values.
---

# Otherstates UI

The design system lives in `src/ui/`. Its rules are in `src/ui/AGENTS.md`; read that file once per task
before writing UI code. This skill is the workflow and the commands.

## 1. Find what exists

Search the catalog before building anything:

```bash
# components whose name, description or exports match a word
node -e "const m=require('./src/ui/agent/manifest.json');const q=process.argv[1].toLowerCase();for(const c of m.components)if([c.id,c.title,c.description,...c.exports].join(' ').toLowerCase().includes(q))console.log(c.id.padEnd(20),c.description)" toggle
```

Then read `src/ui/agent/components/<id>.md` for the props and the full code of every example, and copy the
closest example. For a whole screen, start from a template in `src/ui/catalog/templates/` (agent chat,
agent dashboard, analytics dashboard, projects list, settings page). Look for a variant or prop before deciding something is missing.

## 2. Compose

- Import components from `@/ui/components` and tokens with `import { tokens as t } from '@/ui/tokens.stylex'`.
- Lay out with `stylex.create` on tokens: `gap: t['--os-space-4']`, `paddingBlock: t['--os-space-6']`.
- Space has three tiers: 8 inside a group, 20 between fields and rows, 32 between sections.
- A screen's outer element gets `backgroundColor: t['--os-color-bg-subtle']`, so `filled` cards show their edge.
  On a white page, use `Card variant="outline"`.
- Colors by role (`fg-base`, `fg-muted`, `bg-surface`, `border-subtle`, `accent-moderate`…). Dark mode and
  the corner setting follow automatically; never branch on them.
- In Next.js, pages and layouts stay Server Components. A file that uses hooks, handlers or React Aria, or
  passes a function or a date to a component, starts with `'use client'`. Never read the clock, `Math.random()`
  or `window` while rendering (see "Server rendering" in `src/ui/AGENTS.md`); the check flags all of these.
- Agent UI (runs, approvals, tasks, costs) starts from the Agents category: `StatusBadge`, `AgentIdentity`,
  `Steps`, `FileChanges`, `UsageBar`, `ApprovalCard`, `DecisionCard`. Never draw a new status color or agent tile.

## 3. Build only when nothing fits

```bash
node src/ui/agent/new-component.mjs status-dot --kind display   # static
node src/ui/agent/new-component.mjs chip-toggle --kind control  # interactive
```

This writes `src/ui/components/<name>.tsx`, a docs page in `src/ui/catalog/docs/<name>/` and the export.
Build on `components/internal/` (size scale, states, surfaces, overlays, choice rows) and React Aria
Components for behavior. Fill in the docs page, then run `node src/ui/agent/build-docs.mjs`.

If you need a value the tokens don't have, stop and ask the person to add a token or change the spec.
Don't approximate it.

## 4. Check

```bash
node src/ui/agent/check.mjs            # whole project; or pass the files you changed
```

In Claude Code the check also runs after every edit and reports violations back. Fix each one with the
suggested token or component. A real gap gets `// os-allow <rule>: <reason>` on the line above, and you tell
the person about the gap.

Done means: 0 check errors, the docs catalog up to date (`node src/ui/agent/build-docs.mjs --check`), and the
UI checked in light and dark, at every corner setting, by keyboard and at 375px wide.
