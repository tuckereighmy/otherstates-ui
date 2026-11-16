# Otherstates UI kit

The whole Otherstates UI design system, ready to drop into a React project: its components, tokens and
theme builder, plus the tools that keep every agent on-system.

## Install

In a Vite + React project, or a Next.js 16 project on the App Router (React 19 or newer either way), run this
in the app's folder:

```bash
npx otherstates-ui
```

Starting from scratch:

```bash
npm create vite@latest my-app -- --template react-ts    # or: npx create-next-app@latest my-app
cd my-app
npx otherstates-ui
npm run dev
```

`npx otherstates-ui init` is the same command, and either form takes the app's folder instead of the current
one: `npx otherstates-ui init ./my-app`. It needs Node.js 20.9 or newer (Vite 8 itself needs 20.19 or 22.12).

Options:

- `--dir <path>`: where the system goes, a folder inside the app. By default a rerun finds the existing
  install by its `.otherstates.json` (in `src/ui`, `ui`, or the folder the `ui:check` and `ui:docs` scripts
  run from), so `--dir` is only needed the first time. A new install goes in `src/ui`; in a Next.js app whose
  App Router is `app/` at the project root it goes in `ui`, unless `tsconfig.json` points `@/*` at `./src/*`.
  An absolute path, the app's own folder or one outside it stops the run.
- `--dry-run`: print every change and write nothing.
- `--skip-install`: edit `package.json` but don't run the package manager.
- `--force`: replace system files you changed since the last install, install into a non-empty folder, and
  install a second copy when `--dir` names another folder than the existing install (which otherwise stops
  the run).
- `--files-only`: copy the system and the agent kit and add their dependencies and scripts; wire the build
  yourself (see "Other frameworks").
- `--no-agents`: skip the Claude Code skill, the hook and the `AGENTS.md` / `CLAUDE.md` notes.
- `--keep-starter`: keep an untouched Vite or create-next-app starter instead of replacing it.
- `-h`, `--help`: print the options. `-v`, `--version`: print the kit's version.

An option it doesn't know stops it before anything is written.

### From source

```bash
git clone https://github.com/tuckereighmy/otherstates-ui.git
cd otherstates-ui
npm install
npm run kit                                          # builds output/otherstates-ui/
node output/otherstates-ui/install.mjs ../my-app     # the app's folder, then any of the options above
```

The installer, in any project:

- copies the system, with its MIT `LICENSE`, into `src/ui/` (in a Next.js app whose App Router is `app/` at
  the project root, `ui/`, unless `@/*` points at `./src/*`; choose another folder with `--dir`);
- adds the pinned dependencies and runs your package manager;
- moves your global stylesheets' plain rules into the lowest CSS layer, so they keep styling your own markup
  but can never override a component. Imports and Tailwind 4's directives stay on top; delete the
  `@layer legacy { … }` wrapper to undo;
- replaces an untouched starter (Vite's counter, create-next-app's page) with the Otherstates starter screen
  (`--keep-starter` keeps it);
- installs the Claude Code skill and a hook that runs the design-system check after every edit, and adds a
  short design-system section to `AGENTS.md` and `CLAUDE.md`;
- adds `ui:check`, `ui:docs` and `ui:new` scripts, generates the agent catalog (`llms.txt`,
  `src/ui/agent/`) and checks the result;
- records what your existing code already breaks (its Tailwind classes, a shadcn import, a raw `<button>`)
  in `agent/baseline.json`, so the check fails only on new findings. See "An app that already has a UI".

In a Vite project it adds StyleX to `vite.config`, an `@` alias for `src` with the matching TypeScript path,
and imports the font and the reset first in your entry file.

In a Next.js project it adds:

- `babel.config.js` (`babel.config.cjs` in an ESM package) with the StyleX Babel plugin, and the StyleX
  PostCSS plugin first in `postcss.config.mjs` (created if you have none; a Tailwind setup keeps working
  after it). Both are shown under "Next.js" below;
- `app/stylex.css`, the one line (`@stylex;`) the PostCSS plugin fills with every compiled style;
- in `app/layout.tsx`: the font, `base.css` and `stylex.css` before any other CSS, and a script in `<head>`
  that applies light or dark before the first paint (with `suppressHydrationWarning` on `<html>`);
- the `@/*` path in `tsconfig.json` if it is missing.

`--dry-run` shows every change without writing anything. Running it again (`npx otherstates-ui`, no `--dir`
needed) finds the install, upgrades it in place, skips what is already wired, and leaves any system file you
changed alone unless you pass `--force`.

## Next.js

Built and tested with Next.js 16.4 on Turbopack, the default bundler, with Cache Components on (as
create-next-app sets it up), with and without Tailwind. `npm run kit:test:next` in the Otherstates repo
builds both from scratch and prerenders every docs example and template from a Server Component.

- **Server and client.** Every component file that needs the browser starts with `'use client'`, so pages
  and layouts stay Server Components and import from `@/ui/components` directly. The formatters
  (`formatTokens`, `formatCost`, `formatDuration`, `formatWait`, `describeUndo`) and `rulesFor` run on the
  server too. Your own interactive pieces go in their own `'use client'` file, like the starter's
  `theme-switch.tsx`. Functions and `@internationalized/date` values can't be passed from a Server
  Component to a client one: create them in the client file.
- **Dates.** React Aria's calendars and date fields read today's date as they render, which a prerendered
  page refuses. Calendar, DatePicker and DateRangePicker render a placeholder of their size on the server
  and become interactive once hydrated. For "from today" props use `useToday()` (null until then), and give
  presets a function: `{ label: 'Today', value: () => today(getLocalTimeZone()) }`.
- **Light and dark.** `colorSchemeScript()` in `<head>` sets the scheme before paint and follows the system;
  call `applyColorScheme('light' | 'dark' | 'system')` from client code to change it.
- **Sidebar.** A `persistKey` is read from localStorage after hydration. To render the saved state on the
  server too, keep it in a cookie and pass `collapsed` or `defaultCollapsed`.
- **webpack.** The setup is for Turbopack. With `next build --webpack`, Babel replaces SWC for the whole app:
  builds get slower and `next/font` stops working.
- The check enforces the server rules in the system's own files: `use-client`, `client-export`,
  `clock-in-render`, `browser-global` and `server-snapshot`.
- **PostCSS.** The installer creates this `postcss.config.mjs`, or puts its `@stylexjs/postcss-plugin` entry
  first in the `plugins` of yours. It reuses the plugin from the Babel config the installer wrote (in an ESM
  package, `require('./babel.config.cjs')`). Any other PostCSS config (TypeScript, JSON, YAML, `.postcssrc`,
  a `package.json` field, or plugins written as an array) gets a to-do instead: add the same entry first in
  its plugins.

  ```js
  import { createRequire } from 'node:module';

  const require = createRequire(import.meta.url);

  const config = {
    plugins: {
      // Otherstates UI: writes every StyleX rule into the @stylex line of stylex.css, with the plugin from babel.config.js.
      '@stylexjs/postcss-plugin': {
        babelConfig: { babelrc: false, configFile: false, parserOpts: { plugins: ['typescript', 'jsx'] }, plugins: require('./babel.config.js').plugins },
        useCSSLayers: true,
      },
    },
  };

  export default config;
  ```

- **Your own Babel config.** If the project has one, the installer leaves it alone and asks you to add the
  StyleX plugin (a JSON `.babelrc` has to become `babel.config.js`). With `@/*` pointing at `./src/*`:

  ```js
  const path = require('node:path');
  // Turbopack loads this from the PostCSS config with __dirname under a virtual '/ROOT/'.
  const here = __dirname.startsWith('/ROOT') ? process.cwd() : __dirname;

  module.exports = {
    presets: [['next/babel', { 'preset-env': { targets: 'chrome 111, edge 111, firefox 111, safari 16.4' } }]],
    plugins: [['@stylexjs/babel-plugin', {
      dev: process.env.NODE_ENV !== 'production',
      runtimeInjection: false,
      enableInlinedConditionalMerge: true,
      treeshakeCompensation: true,
      aliases: { '@/*': [path.join(here, 'src/*')] },
      unstable_moduleResolution: { type: 'commonJS' },
    }]],
  };
  ```

  A Babel config the installer didn't write may not be one it can require (a `.babelrc`, a function config),
  so the PostCSS plugin gets the same options inline instead:

  ```js
  import path from 'node:path';

  const config = {
    plugins: {
      // Otherstates UI: writes every StyleX rule into the @stylex line of stylex.css.
      '@stylexjs/postcss-plugin': {
        babelConfig: { babelrc: false, configFile: false, parserOpts: { plugins: ['typescript', 'jsx'] }, plugins: [['@stylexjs/babel-plugin', {
          dev: process.env.NODE_ENV !== 'production',
          runtimeInjection: false,
          enableInlinedConditionalMerge: true,
          treeshakeCompensation: true,
          // The '@' alias from tsconfig.json, so imports of the .stylex.ts token files resolve.
          aliases: { '@/*': [path.join(process.cwd(), 'src/*')] },
          unstable_moduleResolution: { type: 'commonJS' },
        }]] },
        useCSSLayers: true,
      },
    },
  };

  export default config;
  ```

## An app that already has a UI

Installing into an app built with Tailwind, shadcn/ui or its own CSS keeps all of it working:

- **CSS.** `base.css` declares the layers in order: your old global CSS (`legacy`), the reset, Tailwind 4's
  `theme`, `base`, `components` and `utilities`, then the components. Tailwind utilities keep beating the
  reset, so screens styled with them keep their look. What does change is the page's font, which the reset
  sets on `body`; your own `body` background and text color still apply. Nothing from Tailwind or your
  globals can override a component. Layout utilities on a component (`className="mt-4"`) still apply where the component sets
  nothing. Tailwind 3 isn't layered and its preflight overrides components: the installer warns about it.
- **The check.** Your existing utility classes, foreign UI imports and raw controls are recorded in
  `agent/baseline.json` at install. They stay listed as known; anything new fails, in the hook too. Move a
  screen over to the system, then record the smaller set with `npm run ui:check -- --baseline`, so the
  fixed findings can't come back. `npm run ui:check -- --all` shows everything.

## Use

```tsx
import { Button, Card } from '@/ui/components';
import { tokens as t } from '@/ui/tokens.stylex';
```

- Look components up in `llms.txt` or `src/ui/agent/components/<name>.md` (props and full examples).
- Whole screens to start from: `src/ui/templates/` (agent chat, agent dashboard, analytics, projects and
  settings).
- The rules: `src/ui/AGENTS.md`. The source of truth for every value: `src/ui/DESIGN_SPEC.md`.
- `npm run ui:check` fails on raw colors, off-scale spacing, other UI kits, utility classes and
  hand-made controls, and on code in the system (components, docs examples, templates) that can't render on a
  server. In your own code, Next.js reports that at build time. `npm run ui:new -- <name> --kind control|display` scaffolds an on-system component.
- Brand it within the system's bounds with the theme builder in `src/ui/customize/`
  (`deriveTheme`, `applyTheme`).

## Other frameworks

The automatic build setup covers Vite and Next.js (App Router). For anything else, including the Next.js
Pages Router, `--files-only` copies the system and the agent kit; then compile StyleX with
`@stylexjs/unplugin` for your bundler (webpack, rspack, esbuild, rollup and more) using
`{ useCSSLayers: true, unstable_moduleResolution: { type: 'commonJS' } }`, import
`@fontsource-variable/inter` and `src/ui/base.css` before any other CSS, and call
`applyColorScheme('system')` from `src/ui/color-scheme` (or render `colorSchemeScript()` in `<head>` if the
framework renders on a server).

## License

MIT, copyright (c) 2026 Tucker Eighmy. The installer puts the `LICENSE` in the system's folder (`src/ui/LICENSE`),
so the notice stays with the code wherever it is copied. Source and issues:
https://github.com/tuckereighmy/otherstates-ui
