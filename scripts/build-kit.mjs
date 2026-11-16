#!/usr/bin/env node
// Packs Otherstates UI into a drop-in kit: output/otherstates-ui/, the npm package `npx otherstates-ui` runs, and
// its npm pack tarball next to it (output/otherstates-ui-<version>.tgz, the file npm publish would upload).
//
//   npm run kit
//
// The kit holds exactly what ships to a product, never the docs site (src/ui/catalog/ chrome):
//   files/ui/       the system: components, customize, tokens, theme, base.css, color-scheme.ts, the agent
//                   tools, AGENTS.md, DESIGN_SPEC.md, the docs pages and examples (docs/) and the templates
//                   (templates/), with their imports rewritten for the flatter layout, and the MIT LICENSE
//   files/claude/   the Claude Code skill
//   install.mjs     the installer (the package's bin); README.md; LICENSE; package.json; kit.json (version,
//                   pinned dependencies, file hashes)

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ui = path.join(root, 'src/ui');
const out = path.join(root, 'output/otherstates-ui');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = (name) => JSON.parse(fs.readFileSync(path.join(root, 'node_modules', name, 'package.json'), 'utf8')).version;

fs.rmSync(out, { recursive: true, force: true });
const files = {};
const put = (rel, content) => {
  const file = path.join(out, 'files/ui', rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  files[rel] = crypto.createHash('sha256').update(content).digest('hex');
};
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
const copyTree = (from, to, transform = content => content) => {
  for (const file of walk(from)) {
    if (path.basename(file) === '.DS_Store') continue;
    const rel = path.join(to, path.relative(from, file)).split(path.sep).join('/');
    const content = fs.readFileSync(file);
    put(rel, /\.(tsx?|mjs|md|css|json)$/.test(file) ? transform(content.toString('utf8')) : content);
  }
};
// catalog/docs/<id>/ and catalog/templates/<id>/ sit one folder deeper than docs/<id>/ and templates/<id>/.
const flatten = text => text.replaceAll("'../../../components'", "'../../components'").replaceAll("'../../../tokens.stylex'", "'../../tokens.stylex'")
  .replaceAll("'../../../theme'", "'../../theme'").replaceAll("'../../../customize'", "'../../customize'");

// The system.
copyTree(path.join(ui, 'components'), 'components');
// components/local.ts belongs to the product (its own components' exports): the installer creates it once.
delete files['components/local.ts'];
fs.rmSync(path.join(out, 'files/ui/components/local.ts'));
// The theme builder imports its modules with their .ts extension, so Node can run it directly here (the verify
// scripts do). Products only bundle it, and a fresh Next.js tsconfig rejects those extensions: the kit drops them.
copyTree(path.join(ui, 'customize'), 'customize', text => text.replace(/(from\s+'\.{1,2}\/[^']+)\.tsx?'/g, "$1'"));
// Guides name this repo's layout (catalog/docs, catalog/templates); a product has docs/ and templates/.
const productPaths = text => text.replaceAll('src/ui/catalog/templates/', 'src/ui/templates/').replaceAll('src/ui/catalog/docs/', 'src/ui/docs/');
for (const name of ['tokens.stylex.ts', 'theme.ts', 'base.css', 'color-scheme.ts', 'DESIGN_SPEC.md']) put(name, fs.readFileSync(path.join(ui, name)));
put('AGENTS.md', productPaths(fs.readFileSync(path.join(ui, 'AGENTS.md'), 'utf8')));
// The MIT notice travels with the copied code, so every install carries it (the check reads only .ts files).
put('LICENSE', fs.readFileSync(path.join(root, 'LICENSE')));
for (const name of ['check.mjs', 'build-docs.mjs', 'new-component.mjs']) put(`agent/${name}`, fs.readFileSync(path.join(ui, 'agent', name)));

// Docs pages and examples: the catalog's source, and code agents copy from.
const docsRoot = path.join(ui, 'catalog/docs');
put('docs/types.ts', fs.readFileSync(path.join(docsRoot, 'types.ts')));
put('docs/code-imports.d.ts', fs.readFileSync(path.join(docsRoot, 'code-imports.d.ts')));
for (const id of fs.readdirSync(docsRoot)) {
  if (fs.existsSync(path.join(docsRoot, id, 'index.ts'))) copyTree(path.join(docsRoot, id), `docs/${id}`, flatten);
}
// Templates: whole screens built from the components. Only the screens and their data, not the docs pages.
const templatesRoot = path.join(ui, 'catalog/templates');
put('templates/registry.ts', fs.readFileSync(path.join(templatesRoot, 'registry.ts')));
for (const id of fs.readdirSync(templatesRoot)) {
  const dir = path.join(templatesRoot, id);
  if (fs.statSync(dir).isDirectory()) copyTree(dir, `templates/${id}`, flatten);
}

// Nothing from the docs site chrome may leak in.
const leaked = Object.keys(files).filter(rel => /catalog\//.test(fs.readFileSync(path.join(out, 'files/ui', rel), 'utf8')) && /\.(tsx?)$/.test(rel) && /from ['"][^'"]*catalog\//.test(fs.readFileSync(path.join(out, 'files/ui', rel), 'utf8')));
if (leaked.length) throw new Error(`Kit files import the docs site: ${leaked.join(', ')}`);

// The Claude Code skill, the installer and its readme.
const skillOut = path.join(out, 'files/claude/skills/otherstates-ui');
fs.mkdirSync(skillOut, { recursive: true });
for (const name of fs.readdirSync(path.join(root, '.claude/skills/otherstates-ui'))) {
  fs.writeFileSync(path.join(skillOut, name), productPaths(fs.readFileSync(path.join(root, '.claude/skills/otherstates-ui', name), 'utf8')));
}
fs.copyFileSync(path.join(root, 'kit/install.mjs'), path.join(out, 'install.mjs'));
fs.copyFileSync(path.join(root, 'kit/README.md'), path.join(out, 'README.md'));
fs.copyFileSync(path.join(root, 'LICENSE'), path.join(out, 'LICENSE'));
fs.cpSync(path.join(root, 'kit/starter'), path.join(out, 'starter'), { recursive: true, filter: from => path.basename(from) !== '.DS_Store' });

const kit = {
  name: 'otherstates-ui',
  version: pkg.version,
  // Pinned to the versions the system is built and verified with.
  dependencies: {
    '@stylexjs/stylex': version('@stylexjs/stylex'),
    'react-aria-components': version('react-aria-components'),
    'react-aria': version('react-aria'),
    '@internationalized/date': version('@internationalized/date'),
    '@outpacelabs/avatars': version('@outpacelabs/avatars'),
    '@fontsource-variable/inter': version('@fontsource-variable/inter'),
  },
  devDependencies: {
    '@stylexjs/unplugin': version('@stylexjs/unplugin'),
    // The agent tools' parser, under a private name so it never fights the project's own TypeScript (7 has no JS API).
    '@otherstates/typescript': `npm:typescript@${version('typescript')}`,
  },
  // Next.js compiles StyleX with its Babel and PostCSS plugins, released in step with @stylexjs/stylex. The
  // Next.js kit test (npm run kit:test:next) builds a fresh app with them.
  nextDevDependencies: {
    '@stylexjs/babel-plugin': version('@stylexjs/stylex'),
    '@stylexjs/postcss-plugin': version('@stylexjs/stylex'),
  },
  files: Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b))),
};
fs.writeFileSync(path.join(out, 'kit.json'), JSON.stringify(kit, null, 2) + '\n');

// The npm package. install.mjs uses Node's own modules only, so it has no dependencies; `files` is what it reads
// next to itself at run time.
const repo = 'https://github.com/tuckereighmy/otherstates-ui';
const manifest = {
  name: 'otherstates-ui',
  version: pkg.version,
  description: 'Installs Otherstates UI into a Vite or Next.js app: React components with every state designed, and the tools that keep coding agents on the system.',
  keywords: ['react', 'design-system', 'components', 'ui', 'stylex', 'react-aria', 'nextjs', 'vite', 'ai-agents', 'cli'],
  homepage: 'https://otherstates.com',
  bugs: { url: `${repo}/issues` },
  repository: { type: 'git', url: `git+${repo}.git` },
  license: 'MIT',
  author: 'Tucker Eighmy',
  bin: { 'otherstates-ui': 'install.mjs' },
  files: ['install.mjs', 'kit.json', 'files', 'starter', 'README.md', 'LICENSE'],
  // The floor of the frameworks it sets up: Next.js 16 needs 20.9 (Vite 8 needs 20.19 or 22.12 and checks that
  // itself). The installer alone would run on less.
  engines: { node: '>=20.9.0' },
};
fs.writeFileSync(path.join(out, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');

// It must compile under a fresh Vite app's settings (unused code, DOM without DOM.Iterable…).
execFileSync('npx', ['tsc', '-p', 'tsconfig.kit.json'], { cwd: root, stdio: 'inherit' });

// The shipped system must pass its own check.
execFileSync('node', [path.join(out, 'files/ui/agent/check.mjs'), path.join(out, 'files/ui')], { cwd: root, stdio: 'inherit' });

// The tarball strangers download. npm pack drops some files silently (nested .gitignore, package-lock.json…) and
// adds others, so it must hold exactly what the kit folder does.
const [packed] = JSON.parse(execFileSync('npm', ['pack', '--json', '--pack-destination', path.dirname(out)], { cwd: out, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
const shipped = packed.files.map(file => file.path);
const expected = walk(out).filter(file => path.basename(file) !== '.DS_Store').map(file => path.relative(out, file).split(path.sep).join('/'));
const missing = expected.filter(rel => !shipped.includes(rel));
const extra = shipped.filter(rel => !expected.includes(rel));
if (missing.length || extra.length) throw new Error(`npm pack: missing ${missing.join(', ') || 'nothing'}; unexpected ${extra.join(', ') || 'nothing'}`);
console.log(`Kit: ${path.relative(root, out)} (${Object.keys(files).length} system files) and ${path.relative(root, path.join(path.dirname(out), packed.filename))} (npm pack, ${shipped.length} files)`);
