#!/usr/bin/env node
// End-to-end test of the kit in brand-new Next.js apps, the way someone would use it. Two apps from
// create-next-app's defaults: one with Tailwind and no src folder (create-next-app --yes), one with a src folder
// and no Tailwind. For each:
//   --help, --version and a bad option write nothing → install the kit (npx otherstates-ui; init in the plain app)
//   → next build (Turbopack, Cache Components on) → the CSS layers come out in order → the check passes (an app's
//   own Tailwind is in the baseline) → every docs example and template prerenders from a Server Component page,
//   and the plain helpers run on the server → scaffold components and render them from a server page → the hook
//   rejects an off-system edit, new Tailwind fails while baselined Tailwind passes → installing again changes
//   nothing → a file the user edited survives an upgrade.
//
//   npm run kit && node scripts/test-kit-next.mjs [--keep] [--only tailwind|plain]
//
// The kit runs from its npm pack tarball through npx, so the test covers the package strangers download, not the
// folder it is packed from. Needs network access for create-next-app and npm install. The apps are made in
// output/kit-test-next/.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kitDir = path.join(root, 'output/otherstates-ui');
const work = path.join(root, 'output/kit-test-next');
if (!fs.existsSync(path.join(kitDir, 'package.json'))) throw new Error('Build the kit first: npm run kit');
const kitVersion = JSON.parse(fs.readFileSync(path.join(kitDir, 'kit.json'), 'utf8')).version;
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;

const variants = [
  { name: 'tailwind', args: ['--yes'], appDir: 'app', ui: 'ui', install: [] },
  { name: 'plain', args: ['--ts', '--app', '--src-dir', '--no-tailwind', '--eslint', '--import-alias', '@/*', '--turbopack', '--yes'], appDir: 'src/app', ui: 'src/ui', install: ['init'] },
].filter(variant => !only || variant.name === only);

let failures = 0;
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });
const tarball = packKit(kitDir, work);

for (const variant of variants) {
  const app = path.join(work, variant.name);
  const appDir = path.join(app, variant.appDir);
  const ui = path.join(app, variant.ui);
  const sh = (command, args, options = {}) => execFileSync(command, args, { cwd: app, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024, ...options });
  const check = (args) => { try { return JSON.parse(sh('node', [path.join(ui, 'agent/check.mjs'), ...args, '--json'])); } catch (error) { return JSON.parse(error.stdout); } };
  const build = () => sh('npx', ['next', 'build']);
  // `npx otherstates-ui [args]`, from the tarball (npx runs a bare file path as a command, hence --package).
  const kit = args => sh('npx', ['--yes', `--package=${tarball}`, 'otherstates-ui', ...args]);
  const step = (name, fn) => {
    process.stdout.write(`• [${variant.name}] ${name} … `);
    try { const detail = fn(); console.log(`ok${detail ? ` (${detail})` : ''}`); }
    catch (error) { failures += 1; console.log('FAILED'); console.log((String(error.stdout ?? '') + String(error.stderr ?? '')).slice(-4000) || error.message); }
  };
  const html = route => fs.readFileSync(path.join(app, '.next/server/app', `${route}.html`), 'utf8');
  // The home page's stylesheets in the order it loads them: the first declaration of a layer fixes its place.
  const builtCss = () => [...html('index').matchAll(/<link rel="stylesheet" href="\/_next\/([^"]+\.css)"/g)]
    .map(match => fs.readFileSync(path.join(app, '.next', match[1]), 'utf8')).join('\n');

  step('create-next-app', () => { sh('npx', ['-y', 'create-next-app@latest', variant.name, ...variant.args], { cwd: work }); return JSON.parse(fs.readFileSync(path.join(app, 'package.json'), 'utf8')).dependencies.next; });
  step('--help and --version exit 0 and write nothing', () => {
    const before = snapshot(app);
    const help = kit(['init', '--help']);
    if (!help.includes('Usage: npx otherstates-ui') || !help.includes('--keep-starter')) throw new Error(help);
    const version = kit(['--version']).trim();
    if (version !== kitVersion) throw new Error(`printed ${version}, expected ${kitVersion}`);
    const changed = changedFiles(before, snapshot(app));
    if (changed.length) throw new Error(`changed: ${changed.join(', ')}`);
    return `${version}, nothing written`;
  });
  step('a bad option exits 1 and writes nothing', () => {
    const before = snapshot(app);
    for (const [args, needle] of [[['--no-agent'], 'Unknown option --no-agent'], [['init', '--dir', '--force'], '--dir needs']]) {
      let code = 0;
      let stderr = '';
      try { kit(args); } catch (error) { code = error.status; stderr = String(error.stderr); }
      if (code !== 1 || !stderr.includes(needle) || !stderr.includes('--help')) throw new Error(`${args.join(' ')}: exit ${code}\n${stderr}`);
    }
    const changed = changedFiles(before, snapshot(app));
    if (changed.length) throw new Error(`changed: ${changed.join(', ')}`);
    return 'a misspelled option, --dir without a folder';
  });
  step(`install the kit (npx otherstates-ui${variant.install.map(arg => ` ${arg}`).join('')})`, () => kit(variant.install).split('\n').filter(line => line.includes('✓')).length + ' steps');
  step('the system carries its MIT license', () => { if (!fs.readFileSync(path.join(ui, 'LICENSE'), 'utf8').startsWith('MIT License')) throw new Error(`${variant.ui}/LICENSE is not the MIT license`); return `${variant.ui}/LICENSE`; });
  step('next build', () => { build(); return 'Turbopack'; });
  step('the built CSS holds the system, in layer order', () => {
    const css = builtCss();
    for (const needle of ['--os-color-accent-moderate', 'Inter Variable']) if (!css.includes(needle)) throw new Error(`missing ${needle}`);
    const order = [...css.matchAll(/@layer\s+([\w-]+(?:\s*,\s*[\w-]+)*)\s*[;{]/g)].flatMap(match => match[1].split(/\s*,\s*/));
    const first = name => order.indexOf(name);
    const sequence = ['legacy', 'reset', 'priority1'];
    if (variant.name === 'tailwind') sequence.splice(2, 0, 'base', 'utilities');
    for (let i = 1; i < sequence.length; i += 1) if (first(sequence[i - 1]) < 0 || first(sequence[i - 1]) > first(sequence[i])) throw new Error(`layer ${sequence[i - 1]} must come before ${sequence[i]}: ${[...new Set(order)].join(', ')}`);
    return `${Math.round(css.length / 1024)} KB, ${sequence.join(' < ')}`;
  });
  step('the starter page renders on the server, dark mode before paint', () => {
    const page = html('index');
    if (!page.includes('Otherstates UI is ready')) throw new Error('starter page not rendered');
    if (!page.includes('__otherstatesColorScheme')) throw new Error('no color scheme script');
    return 'page.tsx + theme-switch.tsx';
  });
  step('the system and the app pass the check', () => {
    const report = check([variant.ui.includes('/') ? variant.ui.split('/')[0] : '.']);
    if (report.errors) throw new Error(JSON.stringify(report.findings.slice(0, 5), null, 1));
    return `${report.files} files, ${report.known} known`;
  });
  step('the agent catalog is current', () => { sh('node', [path.join(ui, 'agent/build-docs.mjs'), '--check']); return 'llms.txt + manifest'; });
  step('every docs example and template prerenders from a Server Component', () => {
    const imports = [];
    const uses = [];
    let index = 0;
    for (const id of fs.readdirSync(path.join(ui, 'docs')).sort()) {
      const dir = path.join(ui, 'docs', id);
      if (!fs.statSync(dir).isDirectory()) continue;
      for (const file of fs.readdirSync(dir).sort()) {
        if (!file.endsWith('.tsx')) continue;
        imports.push(`import E${index} from '@/ui/docs/${id}/${file.slice(0, -4)}';`);
        uses.push(`<section data-example="${id}/${file}"><E${index} /></section>`);
        index += 1;
      }
    }
    const templates = fs.readdirSync(path.join(ui, 'templates')).filter(id => fs.existsSync(path.join(ui, 'templates', id, 'index.tsx')));
    templates.forEach((id, i) => { imports.push(`import T${i} from '@/ui/templates/${id}';`); uses.push(`<section data-template="${id}"><T${i} /></section>`); });
    fs.mkdirSync(path.join(appDir, 'os-examples'), { recursive: true });
    fs.writeFileSync(path.join(appDir, 'os-examples/page.tsx'), `${imports.join('\n')}\nimport { describeUndo, formatCost, formatDuration, formatTokens, formatWait, iconNames, rulesFor } from '@/ui/components';\n\n// Server helpers: these must run here, not come back as client references.\nconst helpers = [formatWait(840_000), formatDuration(126_000), formatTokens(1284), formatCost(1.62), describeUndo({ files: 3 }), JSON.stringify(rulesFor('risky', [{ id: 'bash', label: 'Bash', risk: 'medium' }])), String(iconNames.length)].join(' | ');\n\nexport default function Examples() {\n  return <main><p id="helpers">{helpers}</p>\n${uses.join('\n')}\n</main>;\n}\n`);
    build();
    const page = html('os-examples');
    for (const needle of ['14m', '2m 06s', '1.3k', '$1.62', 'This undoes 3 file changes made after it.', '&quot;bash&quot;:&quot;ask&quot;']) if (!page.includes(needle)) throw new Error(`helper output missing: ${needle}`);
    if (!/\| [1-9]\d* <\/p>|\| [1-9]\d*<\/p>/.test(page)) throw new Error('iconNames came back empty');
    return `${index} examples, ${templates.length} templates`;
  });
  step('scaffold a control and a display component and render them from a server page', () => {
    sh('node', [path.join(ui, 'agent/new-component.mjs'), 'chip-toggle', '--kind', 'control']);
    sh('node', [path.join(ui, 'agent/new-component.mjs'), 'status-note', '--kind', 'display']);
    fs.mkdirSync(path.join(appDir, 'scaffold'), { recursive: true });
    fs.writeFileSync(path.join(appDir, 'scaffold/page.tsx'), "import * as stylex from '@stylexjs/stylex';\nimport { Card, ChipToggle, StatusNote } from '@/ui/components';\nimport { tokens as t } from '@/ui/tokens.stylex';\n\nconst s = stylex.create({ row: { display: 'flex', gap: t['--os-space-3'] } });\n\nexport default function Scaffold() {\n  return (\n    <Card heading=\"Kit test\">\n      <div {...stylex.props(s.row)}>\n        <ChipToggle>Filter</ChipToggle>\n        <StatusNote>Ready</StatusNote>\n      </div>\n    </Card>\n  );\n}\n");
    build();
    if (!html('scaffold').includes('Filter')) throw new Error('scaffold page not rendered');
    const report = check([path.join(appDir, 'scaffold'), path.join(ui, 'components/chip-toggle.tsx'), path.join(ui, 'components/status-note.tsx')]);
    if (report.errors) throw new Error(JSON.stringify(report.findings, null, 1));
    return 'chip-toggle (use client), status-note';
  });
  step('the hook rejects an off-system edit', () => {
    const file = path.join(appDir, 'Bad.tsx');
    fs.writeFileSync(file, "import * as stylex from '@stylexjs/stylex';\nconst s = stylex.create({ x: { padding: 13, color: '#123456' } });\nexport const Bad = () => <button {...stylex.props(s.x)}>x</button>;\n");
    let code = 0;
    try { execFileSync('node', [path.join(ui, 'agent/check.mjs'), '--hook'], { cwd: app, input: JSON.stringify({ tool_input: { file_path: file } }), stdio: ['pipe', 'pipe', 'pipe'] }); } catch (error) { code = error.status; }
    fs.rmSync(file);
    if (code !== 2) throw new Error(`exit ${code}, expected 2`);
    return 'exit 2';
  });
  step('baselined code passes; new utility classes fail until recorded', () => {
    const file = path.join(appDir, 'legacy-card.tsx');
    fs.writeFileSync(file, 'export function LegacyCard() {\n  return <div className="rounded-lg border p-4">Old card</div>;\n}\n');
    const before = check([file]);
    if (before.errors !== 1) throw new Error(`expected 1 new finding, got ${before.errors}`);
    sh('node', [path.join(ui, 'agent/check.mjs'), file, '--baseline']);
    const after = check([file]);
    if (after.errors || after.known !== 1) throw new Error(JSON.stringify(after));
    fs.writeFileSync(file, 'export function LegacyCard() {\n  return <div className="rounded-lg border p-4">Old card <span className="text-sm">and a new line</span></div>;\n}\n');
    const added = check([file]);
    if (added.errors !== 1 || added.known !== 1) throw new Error(JSON.stringify(added));
    fs.rmSync(file);
    return 'known 1, new 1';
  });
  step('installing again changes nothing', () => {
    // Every project file, before and after a full second run (dependencies are in, so it runs the catalog, the
    // check and the baseline step too).
    sh('node', [path.join(ui, 'agent/build-docs.mjs')]); // settle the catalog after the scaffold step
    const before = snapshot(app);
    const out = kit([]);
    const after = snapshot(app);
    const changed = changedFiles(before, after);
    if (changed.length) throw new Error(`changed: ${changed.slice(0, 10).join(', ')}\n${out}`);
    const lines = out.split('\n').filter(line => line.includes('✓'));
    if (lines.some(line => !/is up to date|Agent catalog|Check: /.test(line))) throw new Error(out);
    return `${Object.keys(before).length} files unchanged`;
  });
  step('an edited system file survives an upgrade', () => {
    const file = path.join(ui, 'components/badge.tsx');
    fs.appendFileSync(file, '\n// local change\n');
    const out = kit(['--skip-install']);
    if (!fs.readFileSync(file, 'utf8').includes('// local change')) throw new Error('overwritten');
    if (!/Kept 1 file/.test(out)) throw new Error(out);
    return 'kept and reported';
  });
}

dropNpxInstall(tarball);
console.log(failures ? `\n${failures} step(s) failed. The apps are in ${path.relative(root, work)}.` : `\nAll steps passed.${process.argv.includes('--keep') ? ` The apps are in ${path.relative(root, work)}.` : ''}`);
if (!failures && !process.argv.includes('--keep')) fs.rmSync(work, { recursive: true, force: true });
process.exitCode = failures ? 1 : 0;

/** The kit's npm pack tarball, in `into`. Its name carries a hash of its content: npx reuses an install it already
 *  has for the same path, which would run an older build. */
function packKit(from, into) {
  const [{ filename }] = JSON.parse(execFileSync('npm', ['pack', '--json', '--pack-destination', into], { cwd: from, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
  const file = path.join(into, filename);
  const named = file.replace(/\.tgz$/, `-${crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 12)}.tgz`);
  fs.renameSync(file, named);
  return named;
}

/** npx keeps what it installs in npm's cache; this run's copy of the kit goes when the test ends. */
function dropNpxInstall(spec) {
  const cache = path.join(execFileSync('npm', ['config', 'get', 'cache'], { encoding: 'utf8' }).trim(), '_npx');
  for (const dir of fs.existsSync(cache) ? fs.readdirSync(cache) : []) {
    try { if (JSON.parse(fs.readFileSync(path.join(cache, dir, 'package.json'), 'utf8'))._npx?.packages?.includes(spec)) fs.rmSync(path.join(cache, dir), { recursive: true, force: true }); }
    catch { /* not an npx install */ }
  }
}

/** A hash of every file in the app, outside node_modules and build output. */
function snapshot(dir) {
  const hashes = {};
  const walk = folder => {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) walk(file);
      else hashes[path.relative(dir, file)] = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    }
  };
  walk(dir);
  return hashes;
}

function changedFiles(before, after) {
  return [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(file => before[file] !== after[file]);
}
