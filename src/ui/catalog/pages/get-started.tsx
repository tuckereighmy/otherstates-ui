import { CodeBlock } from '../CodeBlock';
import { docsById } from '../docs/registry';
import { DocsIcon } from '../icons';
import { Heading } from '../PageParts';
import { componentHref, pageHref } from '../route';

// The body of #docs/get-started. The shell renders the title and the description above it.
// Every fact here is checked against this repo: vite.config.ts, ui/index.html, catalog/main.tsx,
// base.css and the imports at the top of the component files. The Next.js part matches what
// kit/install.mjs writes into a create-next-app project, which npm run kit:test:next builds.

const path = 'docs/get-started';

const install = `npm install @stylexjs/stylex react-aria-components \\
  @internationalized/date @outpacelabs/avatars @fontsource-variable/inter

# Vite
npm install --save-dev @stylexjs/unplugin
# Next.js
npm install --save-dev @stylexjs/babel-plugin @stylexjs/postcss-plugin`;

// What kit/install.mjs writes for Next.js, for a project whose '@/*' alias points at the project root
// (create-next-app's default without a src folder).
const nextBabelConfig = `const path = require('node:path');

// Turbopack loads this file from postcss.config.mjs with __dirname under a virtual
// '/ROOT/'. There, the folder next runs in is the project.
const here = __dirname.startsWith('/ROOT') ? process.cwd() : __dirname;

module.exports = {
  // Modern targets, so StyleX can still read stylex.create calls.
  presets: [['next/babel', { 'preset-env': { targets: 'chrome 111, edge 111, firefox 111, safari 16.4' } }]],
  plugins: [['@stylexjs/babel-plugin', {
    dev: process.env.NODE_ENV !== 'production',
    runtimeInjection: false,
    enableInlinedConditionalMerge: true,
    treeshakeCompensation: true,
    // The same '@' alias as tsconfig.json, so the token files resolve.
    aliases: { '@/*': [path.join(here, '*')] },
    unstable_moduleResolution: { type: 'commonJS' },
  }]],
};`;

const nextPostcssConfig = `import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export default {
  plugins: {
    '@stylexjs/postcss-plugin': {
      babelConfig: {
        babelrc: false,
        configFile: false,
        parserOpts: { plugins: ['typescript', 'jsx'] },
        plugins: require('./babel.config.js').plugins,
      },
      useCSSLayers: true,
    },
  },
};`;

const nextStylesheet = `/* The PostCSS plugin replaces this line with every compiled style. */
@stylex;`;

const nextLayout = `import '@fontsource-variable/inter';
import '@/ui/base.css';
import './stylex.css';
import { colorSchemeScript } from '@/ui/color-scheme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorSchemeScript() }} />
      </head>
      <body>{children}</body>
    </html>
  );
}`;

// vite.config.ts in this repo, without the parts that only serve this site (a redirect for the
// docs' address and a second entry page).
const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: true,
      unstable_moduleResolution: { type: 'commonJS' },
    }),
    react(),
  ],
});`;

const foundationFiles = `src/ui/tokens.stylex.ts
src/ui/theme.ts
src/ui/base.css
src/ui/color-scheme.ts`;

const componentFiles = `src/ui/components/select.tsx
src/ui/components/internal/
src/ui/components/Icon.tsx
src/ui/components/index.ts`;

const entry = `// main.tsx, or wherever your app starts
import '@fontsource-variable/inter';
import '@/ui/base.css';`;

const darkMode = `import * as stylex from '@stylexjs/stylex';
import { darkTheme } from '@/ui/theme';

// The class names StyleX generated for the dark theme.
const darkClasses = (stylex.props(darkTheme).className ?? '').split(' ').filter(Boolean);

export function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;
  for (const name of darkClasses) root.classList.toggle(name, theme === 'dark');
  // Native scrollbars and form controls follow too.
  root.style.colorScheme = theme;
}`;

const layers = `<!-- First thing in <head>, before any stylesheet -->
<style>
  @layer legacy, reset, theme, base, components, utilities,
    priority1, priority2, priority3, priority4, priority5,
    priority6, priority7, priority8, priority9;
</style>`;

export default function GetStarted() {
  const select = docsById.get('select');
  const button = docsById.get('button');

  return (
    <>
      <Heading level={2} id="install" path={path}>Install with the kit</Heading>
      <p>
        In your app's folder, run the installer. It copies the system into your project, installs the dependencies, sets up StyleX
        for Vite or Next.js 16, and adds the skill, catalog and check for your coding agent. Run it again later to upgrade: it keeps
        the files you edited and tells you which ones.
      </p>
      <CodeBlock code="npx otherstates-ui" language="text" label="Install with the kit" />
      <p>
        <code>npx otherstates-ui --help</code> lists the options. To set things up by hand instead, follow the rest of this page.
      </p>

      <Heading level={2} id="requirements" path={path}>Requirements</Heading>
      <ul>
        <li>React 19 and React DOM 19.</li>
        <li>
          A build step that compiles StyleX: Vite with the StyleX plugin, as this site uses, or Next.js 16 on the App Router with
          StyleX's Babel and PostCSS plugins (see <a href={`#${path}/nextjs`}>Next.js</a>). StyleX has plugins for other bundlers too.
        </li>
        <li>React Aria Components, which supplies the behavior, and a few small packages that only some components use.</li>
      </ul>
      <CodeBlock code={install} language="text" label="Install the dependencies" />
      <p>
        <code>@internationalized/date</code> is for Calendar and Date Picker, and <code>@outpacelabs/avatars</code> draws the gradient
        fallback in Avatar. Skip them if you do not copy those. Toast also imports <code>react-aria</code>, which comes with React Aria
        Components; list it in your own dependencies if your package manager does not hoist packages.
      </p>

      <Heading level={2} id="installation" path={path}>Installation</Heading>
      <ol className="docs-steps pg-steps" role="list">
        <li>
          <Heading level={3} id="stylex" path={path}>Set up StyleX</Heading>
          <p>
            Add the StyleX plugin to your bundler. This is the Vite config this site runs on, cut down to what the components need.
            In Next.js, set up StyleX as in <a href={`#${path}/nextjs`}>Next.js</a> below instead, then carry on with step 2.
          </p>
          <CodeBlock code={viteConfig} label="vite.config.ts" />
          <ul>
            <li><code>useCSSLayers</code> puts component styles in cascade layers, so they sit in a known place against your own CSS. See <a href={`#${path}/css-layers`}>CSS layers</a>.</li>
            <li><code>unstable_moduleResolution</code> lets the compiler resolve <code>tokens.stylex.ts</code> when a component or a theme imports it.</li>
            <li>This repo also sets <code>cssInjectionTarget</code>, because it builds two pages with separate stylesheets. A single app can leave it out.</li>
          </ul>
          <p>In development the plugin adds its stylesheet to your HTML for you.</p>
        </li>
        <li>
          <Heading level={3} id="tokens" path={path}>Copy the tokens, theme and reset</Heading>
          <p>
            <code>tokens.stylex.ts</code> defines every <code>--os-*</code> variable with its light value. <code>theme.ts</code> exports{' '}
            <code>darkTheme</code>, which changes the colors and shadows. <code>base.css</code> is a short reset in a layer named{' '}
            <code>reset</code>: box sizing, form control defaults, the page colors and a focus ring. <code>color-scheme.ts</code> switches
            between light and dark, and in Next.js writes the script that sets it before the first paint. To start from your own accent,
            neutrals, corners or typeface, make the theme on <a href={pageHref('customize')}>Customize</a> and copy the edited files instead.
          </p>
          <CodeBlock code={foundationFiles} language="text" label="Foundation files" />
        </li>
        <li>
          <Heading level={3} id="components" path={path}>Copy the components you need</Heading>
          <p>
            Each component is one file in <code>components/</code>, named on its page under Installation. Keep that folder next to{' '}
            <code>tokens.stylex.ts</code>: the components import it as <code>../tokens.stylex</code>.
          </p>
          <p>
            Most components also use shared styles and hooks from <code>components/internal/</code>, and many draw icons with{' '}
            <code>components/Icon.tsx</code>. Copy both with your first component. A few build on another component, as Toast does
            on Button; the imports at the top of a file show what else it needs. For{' '}
            {select ? <a href={componentHref(select.id)}>Select</a> : 'Select'}, that is:
          </p>
          <CodeBlock code={componentFiles} language="text" label="Files for Select" />
          <p>
            <code>components/index.ts</code> re-exports every component, the tokens and the dark theme. Keep it and delete the lines
            for files you did not copy, or import each file directly. The examples in these docs import from{' '}
            <code>@/ui/components</code>; point that alias at your copy, or use a relative path.
          </p>
        </li>
        <li>
          <Heading level={3} id="font" path={path}>Load the font</Heading>
          <p>
            The type token starts with <code>"Inter Variable"</code>, the family that <code>@fontsource-variable/inter</code> registers.
            Import it once where your app starts, with the reset.
          </p>
          <CodeBlock code={entry} label="Entry imports" />
          <p>
            If you load Inter another way, keep that family name or change <code>--os-font-family</code>. Without the font, the stack
            falls back to Inter, then Helvetica Neue, Helvetica and Arial.
          </p>
        </li>
      </ol>

      <Heading level={2} id="nextjs" path={path}>Next.js</Heading>
      <p>
        Next.js 16 on the App Router compiles StyleX with two plugins: the Babel plugin turns <code>stylex.create</code> into class
        names, and the PostCSS plugin writes every style into one stylesheet. Next.js picks up <code>babel.config.js</code> on its own.
        The setup is for Turbopack, the default: with <code>--webpack</code>, Babel replaces SWC for the whole app, builds get slower
        and <code>next/font</code> stops working. The kit's installer writes these files for you; this is what it writes, for a
        project whose <code>@/*</code> alias points at the project root.
      </p>
      <p>
        Without a <code>src</code> folder, copy the system into <code>ui/</code> at the project root, so it imports as{' '}
        <code>@/ui/…</code>; the installer does the same. With one, use <code>src/ui/</code> and point <code>aliases</code> at{' '}
        <code>src/*</code>. If <code>package.json</code> has <code>"type": "module"</code>, name the Babel file{' '}
        <code>babel.config.cjs</code> and require that from <code>postcss.config.mjs</code>.
      </p>
      <p><code>babel.config.js</code>, in the project root:</p>
      <CodeBlock code={nextBabelConfig} label="babel.config.js" />
      <p><code>postcss.config.mjs</code>, next to it, which reuses that Babel plugin:</p>
      <CodeBlock code={nextPostcssConfig} label="postcss.config.mjs" />
      <p><code>app/stylex.css</code>, where the styles end up:</p>
      <CodeBlock code={nextStylesheet} language="text" label="app/stylex.css" />
      <p>
        In the root layout, import the font, then <code>base.css</code> before any other stylesheet, so its layer order is declared
        first, then <code>stylex.css</code>. The script in <code>&lt;head&gt;</code> puts the light or dark classes on{' '}
        <code>&lt;html&gt;</code> before the first paint, so a visitor in dark mode never sees a light frame.
        <code> suppressHydrationWarning</code> is there because the script changes <code>&lt;html&gt;</code> before React hydrates.
      </p>
      <CodeBlock code={nextLayout} label="app/layout.tsx" />
      <ul>
        <li>
          Components that need the browser start with <code>'use client'</code>, so your pages stay Server Components and import them
          directly. Helpers such as <code>formatWait</code> work on the server too.
        </li>
        <li>
          Tailwind 4 can stay. <code>base.css</code> declares Tailwind's layers below the components', so its utilities keep styling
          your own markup but never a component.
        </li>
      </ul>

      <Heading level={2} id="dark-theme" path={path}>Dark theme</Heading>
      <p>
        Light is the tokens' own default and needs no setup. For dark, put the classes of <code>darkTheme</code> on{' '}
        <code>&lt;html&gt;</code>. Dialogs, menus, popovers and toasts render in a portal at the end of <code>&lt;body&gt;</code>,
        outside your app's root element. On <code>&lt;html&gt;</code>, the theme reaches them too.
      </p>
      <CodeBlock code={darkMode} label="Apply the dark theme" />
      <p>
        <code>base.css</code> paints <code>&lt;html&gt;</code> with <code>--os-color-bg-canvas</code>, so the page background changes
        with the theme. <a href={pageHref('styling')}>Styling</a> covers themes of your own.
      </p>

      <Heading level={2} id="css-layers" path={path}>CSS layers</Heading>
      <p>
        <code>base.css</code> puts its rules in a layer named <code>reset</code>, and StyleX puts component styles in layers named{' '}
        <code>priority1</code>, <code>priority2</code> and up, one for each selector priority it uses (the components reach{' '}
        <code>priority9</code>). Layers rank in the order they are first declared, and StyleX declares any it adds later after the
        last one, so they still rank in order. <code>base.css</code>{' '}
        declares its own order first: <code>legacy</code> for your app's older global CSS, then the reset, then Tailwind 4's layers.
        In Next.js it loads before StyleX, so that order holds. In Vite's development server StyleX can add its styles before{' '}
        <code>base.css</code> loads, which ranks the reset above the components. Declare the order yourself:
      </p>
      <CodeBlock code={layers} language="text" label="Layer order" />
      <p>
        CSS outside any layer ranks above all of them, so a class from your own stylesheet still wins over a component's styles.
        This site adds a <code>docs</code> layer after <code>reset</code> for its own pages.
      </p>

      <div className="docs-actions">
        <a className="docs-button" data-variant="primary" href={pageHref('styling')}>
          Styling <DocsIcon name="arrowRight" size={14} />
        </a>
        {button && (
          <a className="docs-button" data-variant="secondary" href={componentHref(button.id)}>
            Open {button.title}
          </a>
        )}
      </div>
    </>
  );
}
