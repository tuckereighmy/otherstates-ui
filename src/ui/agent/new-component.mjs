#!/usr/bin/env node
// Scaffolds a new Otherstates UI component that is on-system from its first line: built on the shared size
// scale, states and tokens, with a docs page (which feeds the catalog agents search) and its export.
//
//   node src/ui/agent/new-component.mjs <kebab-name> --kind control|display [--category Forms|Layout|Navigation|Overlays|Feedback]
//
// control   interactive: a React Aria button on the control size scale, radius, focus ring and states
// display   static: a token-styled element
// Overlays (popover, menu, dialog, sheet) are composed from the existing overlay components, not scaffolded.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const ui = path.resolve(here, '..');
const args = process.argv.slice(2);
const name = args.find(arg => !arg.startsWith('--') && args[args.indexOf(arg) - 1] !== '--kind' && args[args.indexOf(arg) - 1] !== '--category');
const flag = key => { const index = args.indexOf(`--${key}`); return index >= 0 ? args[index + 1] : undefined; };
const kind = flag('kind') ?? 'display';
const categories = ['Forms', 'Layout', 'Navigation', 'Overlays', 'Feedback'];
const category = flag('category') ?? (kind === 'control' ? 'Forms' : 'Feedback');

const fail = message => { console.error(message); process.exit(1); };
if (!name || !/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) fail('Usage: new-component.mjs <kebab-name> --kind control|display [--category …]');
if (!['control', 'display'].includes(kind)) fail('--kind must be control or display. Compose overlays from Popover, Menu, Dialog or Sheet.');
if (!categories.includes(category)) fail(`--category must be one of ${categories.join(', ')}`);

const pascal = name.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('');
const title = name.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join(' ');
const componentFile = path.join(ui, 'components', `${name}.tsx`);
// Docs pages live in catalog/docs in this repo and in docs/ in an installed product.
const docsRoot = fs.existsSync(path.join(ui, 'catalog/docs')) ? path.join(ui, 'catalog/docs') : path.join(ui, 'docs');
const docsDir = path.join(docsRoot, name);
const componentsImport = path.relative(docsDir, path.join(ui, 'components')).split(path.sep).join('/');
if (fs.existsSync(componentFile) || fs.existsSync(docsDir)) fail(`${name} already exists. Extend it with a variant instead of adding a second one.`);

// Interactive components run in the browser, so a control starts with 'use client' (the check requires it).
const control = `'use client';

import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import { gapStyles, heightStyles, normalizeSize, pillPaddingStyles, radiusStyles, textStyles, type ControlSizeProp } from './internal/size';
import { disabledStyles, focusStyles, hoverStyles, pressStyles, transitionStyles } from './internal/states';

// ${pascal}. Size, radius, focus ring, hover, press and disabled come from the shared parts in ./internal, so it
// lines up with Button and Input at every size and follows the corner setting. Add a DESIGN_SPEC section
// before shipping, and restyle through tokens, never with new values.

const s = stylex.create({
  root: {
    boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    borderWidth: 0, fontFamily: t['--os-font-family'], color: t['--os-color-fg-base'], cursor: 'pointer', whiteSpace: 'nowrap',
  },
});

export type ${pascal}Props = Omit<AriaButtonProps, 'className' | 'style' | 'children'> & {
  children: ReactNode;
  /** Control height: xs 24, sm 32, md 40, lg 48, xl 56. */
  size?: ControlSizeProp;
  className?: string;
};

export function ${pascal}({ children, size: sizeProp, className, ...props }: ${pascal}Props) {
  const size = normalizeSize(sizeProp);
  return (
    <AriaButton
      {...props}
      className={({ isDisabled }) => withClassName(stylex.props(
        s.root, heightStyles[size], pillPaddingStyles[size], gapStyles[size], textStyles[size], radiusStyles[size],
        transitionStyles.colorsAndPress, hoverStyles.neutral, pressStyles.scaleActive, focusStyles.ringVisible,
        isDisabled && disabledStyles.filled,
      ), className)}
    >
      {children}
    </AriaButton>
  );
}
`;

const display = `import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode } from 'react';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';

// ${pascal}. Every value is a token, so it follows the theme, dark mode and the corner setting. Add a
// DESIGN_SPEC section before shipping, and restyle through tokens, never with new values.

const s = stylex.create({
  root: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minWidth: 0,
    fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    color: t['--os-color-fg-base'],
  },
});

export type ${pascal}Props = Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> & {
  children?: ReactNode;
  className?: string;
};

export function ${pascal}({ children, className, ...props }: ${pascal}Props) {
  return <div {...props} className={withClassName(stylex.props(s.root), className)}>{children}</div>;
}
`;

const doc = `import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';

export default defineDoc({
  id: '${name}',
  title: '${title}',
  category: '${category}',
  description: 'TODO: one sentence on what it is for.',
  source: ['components/${name}.tsx', 'components/internal/class-name.ts'${kind === 'control' ? ", 'components/internal/size.ts', 'components/internal/states.ts'" : ''}, 'tokens.stylex.ts'],
  exports: ['${pascal}'],
  usage: \`import { ${pascal} } from '@/ui/components';

<${pascal}>${title}</${pascal}>\`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
  ],
  api: [
    {
      name: '${pascal}',
      description: 'TODO: what it renders.',${kind === 'control' ? "\n      extends: 'React Aria ButtonProps'," : ''}
      props: [
        { name: 'children', type: 'ReactNode', ${kind === 'control' ? 'required: true, ' : ''}description: 'TODO' },${kind === 'control' ? "\n        { name: 'size', type: \"'xs' | 'sm' | 'md' | 'lg' | 'xl'\", default: \"'md'\", description: 'Control height: 24, 32, 40, 48 or 56 px.' }," : ''}
        { name: 'className', type: 'string', description: 'A class for the outer element.' },
      ],
    },
  ],
  accessibility: [
    'TODO: keyboard and screen-reader behavior, one point per line.',
  ],
});
`;

const example = `import { ${pascal} } from '${componentsImport}';

export default function ${pascal}Default() {
  return <${pascal}>${title}</${pascal}>;
}
`;

fs.writeFileSync(componentFile, kind === 'control' ? control : display);
fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(docsDir, 'index.ts'), doc);
fs.writeFileSync(path.join(docsDir, 'default.tsx'), example);

// Export, kept in alphabetical order. In an installed product the kit owns index.ts, so a product's own
// components are exported from components/local.ts instead, which upgrades never touch.
const installedProduct = fs.existsSync(path.join(ui, '.otherstates.json'));
const indexFile = path.join(ui, installedProduct ? 'components/local.ts' : 'components/index.ts');
const lines = fs.readFileSync(indexFile, 'utf8').split('\n');
const exportLine = `export * from './${name}';`;
const exportsAt = lines.map((line, index) => ({ line, index })).filter(item => item.line.startsWith("export * from './") && !item.line.includes("'./local'"));
const after = exportsAt.filter(item => item.line.localeCompare(exportLine) < 0).pop() ?? { index: exportsAt.length ? exportsAt[0].index - 1 : lines.length - 1 };
lines.splice(after.index + 1, 0, exportLine);
fs.writeFileSync(indexFile, lines.join('\n'));

const relative = file => path.relative(process.cwd(), file);
console.log(`Created ${pascal} (${kind}):
  ${relative(componentFile)}
  ${relative(docsDir)}/index.ts and default.tsx
  export added to ${relative(indexFile)}

Next:
  1. Build it on components/internal/ and React Aria; use tokens only. Hooks, React Aria and event handlers
     need 'use client' as the first line; the check says when.
  2. Replace every TODO on the docs page and add one example per variant.
  3. node src/ui/agent/check.mjs ${relative(componentFile)} ${relative(docsDir)}
  4. node src/ui/agent/build-docs.mjs   (fails --check while a TODO is left)`);

try { execFileSync('node', [path.join(here, 'check.mjs'), componentFile, docsDir], { stdio: 'inherit' }); } catch { process.exitCode = 1; }
