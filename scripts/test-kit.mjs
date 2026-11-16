#!/usr/bin/env node
// End-to-end test of the kit in a brand-new app, the way someone would use it:
//   create a Vite + React app → --help, --version, a bad option and a --dir outside the app write nothing →
//   install the kit (npx otherstates-ui init app) → build → run the check → scaffold a component → build again →
//   install again (must be a no-op) → a file the user edited survives an upgrade → in a second project, a rerun
//   without --dir upgrades an install in lib/ui, and a --dir naming another folder stops.
//
//   npm run kit && node scripts/test-kit.mjs [--keep]
//
// The kit runs from its npm pack tarball through npx, so the test covers the package strangers download, not the
// folder it is packed from. Needs network access for `npm create vite` and `npm install`. The app is made in
// output/kit-test/.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kitDir = path.join(root, 'output/otherstates-ui');
const work = path.join(root, 'output/kit-test');
const app = path.join(work, 'app');
if (!fs.existsSync(path.join(kitDir, 'package.json'))) throw new Error('Build the kit first: npm run kit');
const kitVersion = JSON.parse(fs.readFileSync(path.join(kitDir, 'kit.json'), 'utf8')).version;

let failures = 0;
const step = (name, fn) => {
  process.stdout.write(`• ${name} … `);
  try { const detail = fn(); console.log(`ok${detail ? ` (${detail})` : ''}`); }
  catch (error) { failures += 1; console.log('FAILED'); console.log(String(error.stdout ?? '') + String(error.stderr ?? '') || error.message); }
};
const sh = (command, args, options = {}) => execFileSync(command, args, { cwd: app, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...options });
const json = (args) => { try { return JSON.parse(sh('node', args)); } catch (error) { return JSON.parse(error.stdout); } };

fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });
const tarball = packKit(kitDir, work);
// `npx otherstates-ui [args]`, from the tarball (npx runs a bare file path as a command, hence --package).
const kit = (args, options) => sh('npx', ['--yes', `--package=${tarball}`, 'otherstates-ui', ...args], options);

step('create a Vite + React app', () => { sh('npx', ['-y', 'create-vite@latest', 'app', '--template', 'react-ts', '--no-interactive'], { cwd: work }); return JSON.parse(fs.readFileSync(path.join(app, 'package.json'), 'utf8')).devDependencies.typescript; });
step('--help and --version exit 0 and write nothing', () => {
  const before = snapshot(app);
  const help = kit(['--help']);
  if (!help.includes('Usage: npx otherstates-ui') || !help.includes('--keep-starter')) throw new Error(help);
  const version = kit(['init', '-v']).trim();
  if (version !== kitVersion) throw new Error(`printed ${version}, expected ${kitVersion}`);
  const changed = changedFiles(before, snapshot(app));
  if (changed.length) throw new Error(`changed: ${changed.join(', ')}`);
  return `${version}, nothing written`;
});
step('a bad option exits 1 and writes nothing', () => {
  const before = snapshot(app);
  for (const [args, needle] of [[['--bogus'], 'Unknown option --bogus'], [['-x', '--force'], 'Unknown option -x'], [['--dir'], '--dir needs']]) {
    let code = 0;
    let stderr = '';
    try { kit(args); } catch (error) { code = error.status; stderr = String(error.stderr); }
    if (code !== 1 || !stderr.includes(needle) || !stderr.includes('--help')) throw new Error(`${args.join(' ')}: exit ${code}\n${stderr}`);
  }
  const changed = changedFiles(before, snapshot(app));
  if (changed.length) throw new Error(`changed: ${changed.join(', ')}`);
  return 'unknown options, --dir without a folder';
});
step('a --dir outside the project exits 1 and writes nothing', () => {
  const before = snapshot(app);
  for (const dir of [path.join(work, 'absolute-ui'), '../ui', '.', 'src/..']) {
    let code = 0;
    let stderr = '';
    try { kit(['--dir', dir, '--skip-install']); } catch (error) { code = error.status; stderr = String(error.stderr); }
    if (code !== 1 || !stderr.includes('--dir must be a folder inside the project')) throw new Error(`--dir ${dir}: exit ${code}\n${stderr}`);
  }
  const changed = changedFiles(before, snapshot(app));
  if (changed.length) throw new Error(`changed: ${changed.join(', ')}`);
  for (const outside of ['absolute-ui', 'ui']) if (fs.existsSync(path.join(work, outside))) throw new Error(`wrote ${outside} outside the app`);
  return 'absolute, outside, the project itself';
});
step('install the kit (init app, from the parent folder)', () => kit(['init', 'app'], { cwd: work }).split('\n').filter(line => line.includes('✓')).length + ' steps');
step('the system carries its MIT license', () => { if (!fs.readFileSync(path.join(app, 'src/ui/LICENSE'), 'utf8').startsWith('MIT License')) throw new Error('src/ui/LICENSE is not the MIT license'); return 'src/ui/LICENSE'; });
step('build (tsc -b && vite build)', () => { sh('npm', ['run', 'build']); return fs.readdirSync(path.join(app, 'dist/assets')).filter(name => name.endsWith('.css')).join(', '); });
step('the built CSS holds the system', () => {
  const css = fs.readdirSync(path.join(app, 'dist/assets')).filter(name => name.endsWith('.css')).map(name => fs.readFileSync(path.join(app, 'dist/assets', name), 'utf8')).join('\n');
  for (const needle of ['--os-color-accent-moderate', '@layer legacy', 'Inter Variable']) if (!css.includes(needle)) throw new Error(`missing ${needle}`);
  return `${Math.round(css.length / 1024)} KB`;
});
step('the system passes the check', () => { const report = json(['src/ui/agent/check.mjs', 'src/ui', '--json']); if (report.errors) throw new Error(JSON.stringify(report.findings.slice(0, 5), null, 1)); return `${report.files} files`; });
step('the Vite starter became the Otherstates starter', () => { if (!fs.readFileSync(path.join(app, 'src/App.tsx'), 'utf8').includes('Otherstates UI is ready')) throw new Error('App.tsx not replaced'); if (fs.existsSync(path.join(app, 'src/App.css'))) throw new Error('App.css left behind'); return 'App.tsx, index.css'; });
step('the whole app passes the check', () => { const report = json(['src/ui/agent/check.mjs', 'src', '--json']); if (report.errors) throw new Error(JSON.stringify(report.findings.slice(0, 5), null, 1)); return `${report.files} files, 0 errors`; });
step('the agent catalog is current', () => { sh('node', ['src/ui/agent/build-docs.mjs', '--check']); if (!fs.existsSync(path.join(app, 'llms.txt'))) throw new Error('no llms.txt'); return 'llms.txt + manifest'; });
step('the hook rejects an off-system edit', () => {
  const file = path.join(app, 'src/Bad.tsx');
  fs.writeFileSync(file, "import * as stylex from '@stylexjs/stylex';\nconst s = stylex.create({ x: { padding: 13, color: '#123456' } });\nexport const Bad = () => <button {...stylex.props(s.x)}>x</button>;\n");
  let code = 0;
  try { execFileSync('node', ['src/ui/agent/check.mjs', '--hook'], { cwd: app, input: JSON.stringify({ tool_input: { file_path: file } }), stdio: ['pipe', 'pipe', 'pipe'] }); } catch (error) { code = error.status; }
  fs.rmSync(file);
  if (code !== 2) throw new Error(`exit ${code}, expected 2`);
  return 'exit 2';
});
step('scaffold a control and a display component', () => { sh('node', ['src/ui/agent/new-component.mjs', 'chip-toggle', '--kind', 'control']); sh('node', ['src/ui/agent/new-component.mjs', 'status-note', '--kind', 'display']); return 'chip-toggle, status-note'; });
step('use them from app code and build again', () => {
  fs.writeFileSync(path.join(app, 'src/Demo.tsx'), "import * as stylex from '@stylexjs/stylex';\nimport { Button, Card, ChipToggle, StatusNote } from '@/ui/components';\nimport { tokens as t } from '@/ui/tokens.stylex';\n\nconst s = stylex.create({ row: { display: 'flex', gap: t['--os-space-3'] } });\n\nexport function Demo() {\n  return (\n    <Card heading=\"Kit test\">\n      <div {...stylex.props(s.row)}>\n        <Button>Save</Button>\n        <ChipToggle>Filter</ChipToggle>\n        <StatusNote>Ready</StatusNote>\n      </div>\n    </Card>\n  );\n}\n");
  // The app renders the demo and three of the templates, so the build bundles (not only type-checks) them.
  fs.writeFileSync(path.join(app, 'src/App.tsx'), "import Overview from './ui/templates/overview'\nimport Projects from './ui/templates/projects'\nimport Settings from './ui/templates/settings'\nimport { Demo } from './Demo'\n\nconst screens = { overview: Overview, projects: Projects, settings: Settings, demo: Demo }\n\nexport default function App() {\n  const Screen = screens[location.hash.slice(1) as keyof typeof screens] ?? Overview\n  return <Screen />\n}\n");
  sh('npm', ['run', 'build']);
  const css = fs.readdirSync(path.join(app, 'dist/assets')).filter(name => name.endsWith('.css')).map(name => fs.statSync(path.join(app, 'dist/assets', name)).size).reduce((a, b) => a + b, 0);
  if (css < 60000) throw new Error(`only ${css} bytes of CSS: the components' styles are missing`);
  const report = json(['src/ui/agent/check.mjs', 'src/Demo.tsx', '--json']);
  if (report.errors) throw new Error(JSON.stringify(report.findings, null, 1));
  return `aliases and tokens resolve, ${Math.round(css / 1024)} KB of CSS`;
});
step('the scaffold leaves the docs unfinished until written', () => { try { sh('node', ['src/ui/agent/build-docs.mjs', '--check']); } catch { return 'build-docs --check fails on TODO'; } throw new Error('expected a failure'); });
step('installing again changes nothing', () => {
  const out = kit(['--skip-install']);
  if (/vite\.config|main\.tsx|index\.css|tsconfig|settings\.json/.test(out)) throw new Error(out);
  return 'no wiring repeated';
});
step('an edited system file survives an upgrade', () => {
  const file = path.join(app, 'src/ui/components/badge.tsx');
  fs.appendFileSync(file, '\n// local change\n');
  const out = kit(['--skip-install']);
  if (!fs.readFileSync(file, 'utf8').includes('// local change')) throw new Error('overwritten');
  if (!/Kept 1 file/.test(out)) throw new Error(out);
  return 'kept and reported';
});
// A second, bare project: an install in a folder of its own is found again without --dir.
const moved = path.join(work, 'moved');
const quick = ['--skip-install', '--no-agents'];
step('a rerun without --dir upgrades an install in lib/ui', () => {
  fs.mkdirSync(moved, { recursive: true });
  fs.writeFileSync(path.join(moved, 'package.json'), JSON.stringify({ name: 'moved', private: true, type: 'module', dependencies: { react: '^19.2.0', 'react-dom': '^19.2.0' }, devDependencies: { vite: '^8.0.0' } }, null, 2) + '\n');
  kit(['--dir', 'lib/ui', ...quick], { cwd: moved });
  const out = kit(quick, { cwd: moved });
  if (fs.existsSync(path.join(moved, 'src/ui'))) throw new Error('copied a second system into src/ui');
  if (!out.includes('lib/ui is up to date')) throw new Error(out);
  return 'lib/ui is up to date, no src/ui';
});
step('a --dir naming another folder than the install exits 1 and writes nothing', () => {
  const before = snapshot(moved);
  let code = 0;
  let stderr = '';
  try { kit(['--dir', 'src/ui', ...quick], { cwd: moved }); } catch (error) { code = error.status; stderr = String(error.stderr); }
  if (code !== 1 || !stderr.includes('already installed in lib/ui')) throw new Error(`exit ${code}\n${stderr}`);
  const changed = changedFiles(before, snapshot(moved));
  if (changed.length) throw new Error(`changed: ${changed.join(', ')}`);
  return 'points at lib/ui';
});

dropNpxInstall(tarball);
console.log(failures ? `\n${failures} step(s) failed. The app is in ${path.relative(root, app)}.` : `\nAll steps passed.${process.argv.includes('--keep') ? ` The app is in ${path.relative(root, app)}.` : ''}`);
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
      if (['node_modules', 'dist', '.next', '.git'].includes(entry.name)) continue;
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
