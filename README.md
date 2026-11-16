# Otherstates UI

React components with every state already designed: loading, empty, failed, disabled and waiting on a
person, for products with agents in them. Built on React Aria and StyleX. A kit installs the system into
your Vite or Next.js app and teaches your coding agent to stay on it.

**Docs and live examples: [otherstates.com](https://otherstates.com)**

## Install

In your app's folder:

```sh
npx otherstates-ui
```

The installer copies the components into your project, so the code is yours to read and edit. It sets up
StyleX for Vite or Next.js 16 (App Router), and adds a skill, a component catalog and a design-system
check for your coding agent. In Claude Code, a hook runs the check after every edit. Run
`npx otherstates-ui --help` for the options; [kit/README.md](kit/README.md) has the details.

- **Needs:** React 19, and Vite or Next.js 16 on the App Router.
- **Tailwind 4 apps work.** Tailwind sits in a CSS layer below the components, so it can't restyle them.
- **Prefer to copy files by hand?** The Get started page in the docs shows how.

## What's inside

- **82 components**, including agent ones: RunBlock, ApprovalCard, HandoffList, ContextWindow, UsageBar,
  Composer and ChatThread. Each ships its other states, documented with live examples.
- **5 templates:** agent chat, agent dashboard, analytics, projects and settings.
- **Customize:** build a theme for light and dark together, and copy it into your project.
- **For your agent:** a skill, a catalog (`llms.txt` and a JSON manifest) and the check. The check flags
  raw colors, off-scale spacing and type, raw radii and shadows, utility classes, other UI kits and
  hand-rolled controls, and keeps the system safe to render on a server.

## Why "Otherstates"

A mockup shows a component in its default state. Everything else is the other states: hover, loading,
empty, failed, disabled, waiting on a person. That is where products start to feel unfinished, and where
AI-written interfaces often cut corners. Agent products add new ones, like waiting on a person or running
over a limit, so Otherstates ships them with its components.

## Develop

```sh
npm install
npm run dev
```

- http://127.0.0.1:5180/ is the homepage.
- http://127.0.0.1:5180/ui/ is the docs: every component with live examples, the templates and Customize.

`npm run build` typechecks and writes the static site to `dist/`, with two pages (`index.html` and
`ui/index.html`). Docs routes are URL fragments, so the site needs no server routing.

Both pages share the same components. The StyleX plugin appends every compiled rule to one CSS file, so
`vite.config.ts` splits `src/ui/base.css` (imported by both pages) into its own chunk and points the plugin
at it. A new page should import `base.css` too.

### Checks

- `npm run check` runs the design-system check on `src/ui`. It must report 0 errors.
- `npm run typecheck` checks types.
- `npm run kit` builds the kit into `output/otherstates-ui/`. `npm run kit:test` and
  `npm run kit:test:next` install it into fresh Vite and Next.js apps (Next.js with and without
  Tailwind) and check them end to end.
- `npm run visual:baseline` screenshots every docs example and template in light, dark and at phone
  width. `npm run visual` compares the current code with those screenshots, and `npm run visual:report`
  shows the differences. Screenshots live in `.visual/`, outside git.

`src/ui/AGENTS.md` is the workflow every change follows, and `src/ui/DESIGN_SPEC.md` is the source of
truth for design decisions.

## License

[MIT](LICENSE) © Tucker Eighmy
