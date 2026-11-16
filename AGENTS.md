# Working in this repo

This repo holds the Otherstates UI design system (`src/ui/`), its docs site (`/ui/`, from `src/ui/catalog/`)
and its homepage (`/`, from `src/ui/catalog/home/`). The design system's rules for any agent live in
[`src/ui/AGENTS.md`](src/ui/AGENTS.md); read them before touching UI code.

## Commands

- `npm run dev` serves the homepage at http://127.0.0.1:5180/ and the docs at http://127.0.0.1:5180/ui/
  (components, templates, Customize).
- `npm run check` runs the design-system check on `src/ui`. It must report 0 errors.
- `npm run agent:docs` regenerates the agent catalog (`src/ui/agent/`, `llms.txt`) from the docs pages.
  Run it after changing a component's docs page; `npm run agent:docs -- --check` fails when it is stale.
- `npm run new -- <name> --kind control|display` scaffolds a component, its docs page and its export.
- `npm run typecheck`, `node scripts/verify-theme.mjs`, `node scripts/verify-export.mjs` for types and the
  theme builder.
- `npm run kit` packs the drop-in kit into `output/otherstates-ui/` (+ a .tgz): the system, the agent tools,
  the skill and the installer (`kit/install.mjs`). It fails if the system doesn't compile under a fresh Vite
  app's settings (`tsconfig.kit.json`) or fails its own check.
- `npm run kit:test` creates a brand-new Vite app, installs the kit and checks build, rendering CSS, the
  check, the hook, scaffolding, re-install and upgrades (needs network). Run it before handing out a kit.
- `npm run kit:test:next` does the same in two fresh Next.js apps (create-next-app's defaults with Tailwind,
  and a src folder without), and prerenders every docs example and template from a Server Component, so a
  component or example that can't render on a server fails it. Takes a few minutes; needs network.
- `npm run visual` screenshots every docs example and template (light, dark, phone) from a fresh build on
  port 5199 and compares them with the saved baseline; `npm run visual:report` shows each difference side
  by side. `npm run visual:baseline` saves a new baseline: run it from a clean commit once a change is
  accepted. Everything lands in `.visual/` (ignored by git); the test and config are in `visual/`.
- Don't run `npm run build` unless asked: it overwrites `dist/`.

## Library work

- `src/ui/DESIGN_SPEC.md` is the source of truth for every pixel decision. Change the spec with the code.
- Every component has a docs page in `src/ui/catalog/docs/<id>/` (contract: `catalog/docs/README.md`).
  The page feeds the docs site, the catalog agents search and `llms.txt`.
- Adding a token means updating `tokens.stylex.ts`, `theme.ts` (dark), `customize/base-values.ts` and the
  token counts in `scripts/verify-theme.mjs` and `scripts/verify-export.mjs`.
- `src/ui/catalog/` is the docs site; it never ships to a product.
