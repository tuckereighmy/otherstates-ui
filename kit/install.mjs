#!/usr/bin/env node
// Otherstates UI installer. Drops the whole design system into a React project and wires it up, so the
// first component import just works and every agent that touches the project stays on-system. Sets up Vite and
// Next.js (App Router, Turbopack) projects; anything else gets the files and wires its own build.
//
//   npx otherstates-ui [init] [project] [options]
//   node path/to/otherstates-ui/install.mjs [init] [project] [options]     (from a clone, after npm run kit)
//
// USAGE below is the one list of options; --help prints it.
//
// Safe to run again: it upgrades the system in place, leaves files you edited alone (unless --force) and
// skips every wiring step that is already done.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const kitDir = path.dirname(fileURLToPath(import.meta.url));
const kit = JSON.parse(fs.readFileSync(path.join(kitDir, 'kit.json'), 'utf8'));

const USAGE = `Otherstates UI ${kit.version}

Usage: npx otherstates-ui [init] [project] [options]

Copies the Otherstates UI design system into a React 19 app (Vite, or Next.js 16 on the App Router) and wires
up its build, dependencies and agent rules. Run it again to upgrade in place.

  project          the app's folder (default: the current folder)
  --dir <path>     where the system goes, a folder inside the project. Default: the folder of an
                   existing install (it finds its .otherstates.json), else src/ui; in a Next.js app
                   whose App Router is app/ at the project root, ui, unless "@/*" points at ./src/*
  --dry-run        print what would change and write nothing
  --skip-install   edit package.json but don't run the package manager
  --force          replace system files you changed since the last install, install into a non-empty
                   folder, and install a second copy when --dir names another folder than the install
  --files-only     copy the system and the agent kit and add their dependencies and scripts; wire the
                   build yourself (any framework)
  --no-agents      skip the Claude Code skill, the hook and the AGENTS.md / CLAUDE.md notes
  --keep-starter   keep an untouched starter (Vite's App.tsx and CSS, or create-next-app's page and
                   globals.css) instead of replacing it
  -h, --help       print this help
  -v, --version    print the kit's version

Examples:
  npx otherstates-ui                        set up the app in this folder
  npx otherstates-ui init ./web --dry-run   show what setting up ./web would change

Docs: https://otherstates.com/ui/#docs/get-started`;

// ---------- Arguments ----------
// Every option is known up front, so a typo stops the run before anything is read or written instead of being
// ignored (or taken for the project folder).
const SWITCHES = ['dry-run', 'skip-install', 'force', 'files-only', 'no-agents', 'keep-starter'];
const VALUES = { dir: 'a folder, like --dir src/ui' };
const argv = process.argv.slice(2);
const flags = new Set();
const values = {};
const positional = [];
const problems = [];
for (let index = 0; index < argv.length; index += 1) {
  const arg = argv[index];
  if (arg === '--') { positional.push(...argv.slice(index + 1)); break; }
  if (arg === '-h' || arg === '--help') flags.add('help');
  else if (arg === '-v' || arg === '--version') flags.add('version');
  else if (!arg.startsWith('-')) positional.push(arg);
  else {
    const [, name, inline] = arg.match(/^--([^=]+)(?:=(.*))?$/s) ?? [];
    if (SWITCHES.includes(name)) { if (inline === undefined) flags.add(name); else problems.push(`--${name} takes no value.`); }
    else if (Object.hasOwn(VALUES, name)) {
      const value = inline ?? (argv[index + 1]?.startsWith('-') ? undefined : argv[(index += 1)]);
      if (value) values[name] = value;
      else problems.push(`--${name} needs ${VALUES[name]}.`);
    } else problems.push(`Unknown option ${arg.split('=')[0]}.`);
  }
}
if (flags.has('help')) { console.log(USAGE); process.exit(0); }
if (flags.has('version')) { console.log(kit.version); process.exit(0); }
// init is the only command, so it is optional: `npx otherstates-ui` and `npx otherstates-ui init` are the same
// (a folder named init is ./init).
if (positional[0] === 'init') positional.shift();
if (positional.length > 1) problems.push(`Expected one project folder, got ${positional.length}: ${positional.join(' ')}.`);
const target = path.resolve(positional[0] ?? '.');
// --dir names a folder inside the project: never an absolute path (it would nest under the project), the project
// itself or anything above it (which would write outside the project, or with --force over its own LICENSE).
if (values.dir !== undefined && (path.isAbsolute(values.dir) || !projectFolder(values.dir))) problems.push('--dir must be a folder inside the project, like src/ui.');
if (problems.length) { console.error(`\n✗ ${problems.join('\n✗ ')}\n  Run npx otherstates-ui --help for the options.\n`); process.exit(1); }
const flag = name => flags.has(name);
const option = name => values[name];

const dryRun = flag('dry-run');
const force = flag('force');
const filesOnly = flag('files-only');
const agents = !flag('no-agents');

const done = [];
const warnings = [];
const manual = [];
const note = (list, text) => list.push(text);
const read = file => fs.readFileSync(file, 'utf8');
const exists = file => fs.existsSync(file);
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const write = (file, content) => { if (dryRun) return; fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); };
const relTarget = file => path.relative(target, file).split(path.sep).join('/');
const fail = message => { console.error(`\n✗ ${message}\n`); process.exit(1); };

console.log(`\nOtherstates UI ${kit.version} → ${target}${dryRun ? ' (dry run: nothing is written)' : ''}\n`);

// ---------- Preflight ----------
const pkgFile = path.join(target, 'package.json');
if (!exists(pkgFile)) fail(`No package.json in ${target}. Run this in a React project (for a new one: npm create vite@latest my-app -- --template react-ts).`);
const pkg = JSON.parse(read(pkgFile));
const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
const framework = allDeps.next ? 'next' : (allDeps.vite || ['ts', 'mts', 'js', 'mjs'].some(ext => exists(path.join(target, `vite.config.${ext}`)))) ? 'vite' : 'unknown';
const reactMajor = Number(String(allDeps.react ?? '').match(/\d+/)?.[0] ?? 0);
if (!allDeps.react) fail('This project has no react dependency. Otherstates UI is a React design system.');
if (reactMajor && reactMajor < 19) fail(`Otherstates UI needs React 19 or newer; this project has react ${allDeps.react}.`);
if (!exists(path.join(target, 'tsconfig.json'))) warnings.push('No tsconfig.json: the system is written in TypeScript and is checked with it. Add TypeScript to get type errors and editor help.');
if (framework === 'unknown' && !filesOnly) {
  fail('No Vite or Next.js setup found. The automatic setup supports Vite + React and Next.js. Use --files-only to copy the system and wire StyleX into your bundler yourself (README: "Other frameworks").');
}
// Next.js: the App Router's folder, and a version whose Turbopack runs a Babel config (16 and newer).
// Next.js uses app/ when both exist.
const appDir = framework === 'next' ? ['app', 'src/app'].find(dir => ['tsx', 'jsx', 'ts', 'js'].some(ext => exists(path.join(target, dir, `layout.${ext}`)))) : undefined;
if (framework === 'next' && !filesOnly) {
  const installedNext = path.join(target, 'node_modules/next/package.json');
  const nextVersion = exists(installedNext) ? JSON.parse(read(installedNext)).version : String(allDeps.next);
  const nextMajor = Number(nextVersion.match(/\d+/)?.[0] ?? 0);
  if (nextMajor && nextMajor < 16) fail(`The Next.js setup needs Next.js 16 or newer (its Turbopack runs the StyleX Babel config); this project has next ${nextVersion}. Upgrade, or use --files-only and wire StyleX yourself.`);
  if (!appDir) fail('No App Router layout found (app/layout.tsx or src/app/layout.tsx). The Next.js setup wires the App Router; for the Pages Router use --files-only and wire StyleX yourself (README: "Other frameworks").');
  if (Object.values(pkg.scripts ?? {}).some(script => /\bnext\s+(dev|build)\b[^&|;]*--webpack/.test(script))) warnings.push('Your scripts build with webpack (--webpack). The setup is made and tested for Turbopack, the default: with webpack, Babel replaces SWC, builds are slower and next/font stops working.');
}
// Next.js: the '@/*' alias. An existing mapping is kept as it is; the system is imported through it when it sits
// under it ('@/ui/components', as the docs write it), and by relative path otherwise.
const nextTsconfig = path.join(target, 'tsconfig.json');
const tsconfigText = framework === 'next' && exists(nextTsconfig) ? read(nextTsconfig) : '';
const existingAlias = tsconfigText.match(/"@\/\*"\s*:\s*\[\s*"([^"]+)"/)?.[1];
const existingAliasRoot = existingAlias?.replace(/\*$/, '').replace(/^(?!\.\/)/, './').replace(/\/?$/, '/');
// The system's folder. A rerun finds the install it upgrades by its record (.otherstates.json) in src/ui, ui or
// the folder package.json's ui:check and ui:docs scripts run from, so --dir is only needed the first time. A new
// install goes in src/ui; in a Next.js app whose App Router is app/ at the project root it goes in ui, so it
// imports as '@/ui', unless "@/*" points at ./src/*, where src/ui is what '@/ui' means.
const recordName = '.otherstates.json';
const scriptDirs = ['ui:check', 'ui:docs'].map(name => String(pkg.scripts?.[name] ?? '').match(/(?:^|[\s"'])([^\s"']+?)\/agent\/(?:check|build-docs)\.mjs\b/)?.[1]);
const installs = [...new Set(['src/ui', 'ui', ...scriptDirs].filter(Boolean).map(projectFolder).filter(Boolean))]
  .filter(dir => exists(path.join(target, dir, recordName)));
let dirRel;
if (option('dir')) {
  dirRel = projectFolder(option('dir'));
  if (!exists(path.join(target, dirRel, recordName)) && installs.length && !force) {
    fail(installs.length === 1
      ? `Otherstates UI is already installed in ${installs[0]}, not ${dirRel}. Run without --dir to upgrade it in place, or pass --force to install a second copy in ${dirRel}.`
      : `Otherstates UI is already installed in ${installs.join(' and ')}, not ${dirRel}. Pass --dir with the one to upgrade, or --force to install another copy in ${dirRel}.`);
  }
} else if (installs.length > 1) {
  fail(`Found Otherstates UI installs in ${installs.join(' and ')}. Pass --dir with the one to upgrade.`);
} else if (installs.length === 1) {
  // The folder the record sits in, which is where its files are even if the folder was moved since.
  dirRel = installs[0];
} else {
  dirRel = framework === 'next' && appDir === 'app' && existingAliasRoot !== './src/' ? 'ui' : 'src/ui';
}
const uiDir = path.join(target, dirRel);
const aliasRoot = existingAliasRoot ?? (dirRel.startsWith('src/') ? './src/' : './');
const underAlias = path.posix.relative(aliasRoot, `./${dirRel}`);
const uiImport = underAlias.startsWith('..') ? null : `@/${underAlias}`;
const pm = exists(path.join(target, 'pnpm-lock.yaml')) ? 'pnpm' : exists(path.join(target, 'yarn.lock')) ? 'yarn'
  : (exists(path.join(target, 'bun.lockb')) || exists(path.join(target, 'bun.lock'))) ? 'bun' : 'npm';
const kits = Object.keys(allDeps).filter(name => /^(@radix-ui\/|@mui\/|antd$|@chakra-ui\/|@mantine\/|@headlessui\/|tailwindcss$|styled-components$|@emotion\/)/.test(name));
if (kits.length) warnings.push(`Other UI libraries are installed (${kits.join(', ')}). They keep working, but the check flags their use in your code so screens can move over one at a time.`);

// ---------- 1. The system ----------
const recordFile = path.join(uiDir, recordName);
const record = exists(recordFile) ? JSON.parse(read(recordFile)) : null;
if (!record && exists(uiDir) && fs.readdirSync(uiDir).length && !force) {
  fail(`${dirRel} already exists and is not an Otherstates install. Choose another folder with --dir, or pass --force to install into it.`);
}
const filesRoot = path.join(kitDir, 'files/ui');
const installed = {};
let copied = 0;
const kept = [];
// Guides and scripts name the system's folder; when it isn't src/ui, they are rewritten to the real one.
const contentOf = rel => {
  const buffer = fs.readFileSync(path.join(filesRoot, rel));
  return dirRel !== 'src/ui' && /\.(md|mjs)$/.test(rel) ? Buffer.from(buffer.toString('utf8').replaceAll('src/ui/', `${dirRel}/`)) : buffer;
};
const hashOf = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
for (const rel of Object.keys(kit.files)) {
  const content = contentOf(rel);
  const hash = hashOf(content);
  const to = path.join(uiDir, rel);
  if (exists(to)) {
    const current = sha(to);
    const before = record?.files?.[rel];
    if (current === hash) { installed[rel] = hash; continue; }
    if (before && current !== before && !force) { kept.push(rel); installed[rel] = before; continue; }
  }
  write(to, content);
  installed[rel] = hash;
  copied += 1;
}
// Files an older version shipped that this one no longer does: removed unless edited.
for (const rel of Object.keys(record?.files ?? {})) {
  if (kit.files[rel]) continue;
  const file = path.join(uiDir, rel);
  if (!exists(file)) continue;
  if (sha(file) === record.files[rel] || force) { if (!dryRun) fs.rmSync(file); }
  else kept.push(rel);
}
write(recordFile, JSON.stringify({ name: 'otherstates-ui', version: kit.version, dir: dirRel, files: installed }, null, 2) + '\n');
// The product's own component exports: created once, never touched again.
const localFile = path.join(uiDir, 'components/local.ts');
if (!exists(localFile)) write(localFile, "// Components this product adds itself: `npm run ui:new` writes their exports here. The kit never ships or\n// overwrites this file, so upgrading the system keeps them exported from '@/ui/components'.\nexport {};\n");
note(done, !record ? `Copied the system into ${dirRel} (${Object.keys(kit.files).length} files)`
  : copied === 0 ? `${dirRel} is up to date (${kit.version})`
  : record.version === kit.version ? `Updated ${copied} file(s) in ${dirRel}`
  : `Upgraded ${dirRel} from ${record.version} to ${kit.version}: ${copied} file(s) updated`);
if (kept.length) warnings.push(`Kept ${kept.length} file(s) you changed since the last install (pass --force to replace them): ${kept.slice(0, 6).join(', ')}${kept.length > 6 ? '…' : ''}`);

// ---------- 2. Dependencies and scripts ----------
const nextPkg = JSON.parse(JSON.stringify(pkg));
nextPkg.dependencies ??= {};
nextPkg.devDependencies ??= {};
const depChanges = [];
const setDep = (group, name, version) => {
  const present = nextPkg.dependencies[name] ?? nextPkg.devDependencies[name];
  if (present === version) return;
  delete nextPkg.dependencies[name];
  delete nextPkg.devDependencies[name];
  nextPkg[group][name] = version;
  depChanges.push(present ? `${name} ${present} → ${version}` : `${name}@${version}`);
};
for (const [name, version] of Object.entries(kit.dependencies)) setDep('dependencies', name, version);
for (const [name, version] of Object.entries(kit.devDependencies)) {
  // The bundler plugin is Vite's; Next.js compiles StyleX with Babel and PostCSS instead. --files-only: you wire it.
  if (name === '@stylexjs/unplugin' && (filesOnly || framework !== 'vite')) continue;
  setDep('devDependencies', name, version);
}
if (framework === 'next' && !filesOnly) for (const [name, version] of Object.entries(kit.nextDevDependencies)) setDep('devDependencies', name, version);
nextPkg.scripts ??= {};
const scripts = {
  'ui:check': `node ${dirRel}/agent/check.mjs ${dirRel.split('/')[0] === dirRel ? '.' : dirRel.split('/')[0]}`,
  'ui:docs': `node ${dirRel}/agent/build-docs.mjs`,
  'ui:new': `node ${dirRel}/agent/new-component.mjs`,
};
const scriptChanges = [];
for (const [name, command] of Object.entries(scripts)) {
  if (nextPkg.scripts[name] === command) continue;
  if (nextPkg.scripts[name]) { warnings.push(`package.json already has a "${name}" script; left it alone. The command is: ${command}`); continue; }
  nextPkg.scripts[name] = command;
  scriptChanges.push(name);
}
if (depChanges.length || scriptChanges.length) {
  const sort = object => Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)));
  nextPkg.dependencies = sort(nextPkg.dependencies);
  nextPkg.devDependencies = sort(nextPkg.devDependencies);
  write(pkgFile, JSON.stringify(nextPkg, null, 2) + '\n');
  if (depChanges.length) note(done, `package.json: ${depChanges.join(', ')}`);
  if (scriptChanges.length) note(done, `package.json scripts: ${scriptChanges.join(', ')}`);
}

// ---------- 3. Build wiring (Vite) ----------
if (framework === 'vite' && !filesOnly) {
  const configFile = ['ts', 'mts', 'js', 'mjs'].map(ext => path.join(target, `vite.config.${ext}`)).find(exists);
  if (!configFile) manual.push('Add the StyleX plugin to your Vite config: stylex.vite({ useCSSLayers: true, unstable_moduleResolution: { type: \'commonJS\' } }) before react().');
  else {
    let config = read(configFile);
    const before = config;
    const lastImport = text => { const all = [...text.matchAll(/^import[^\n]*\n/gm)]; const last = all[all.length - 1]; return last ? last.index + last[0].length : 0; };
    const useAlias = dirRel.startsWith('src/');
    const addUrlImport = () => {
      if (config.includes("from 'node:url'")) return;
      const at = lastImport(config);
      config = `${config.slice(0, at)}import { fileURLToPath } from 'node:url'\n${config.slice(at)}`;
    };
    if (!config.includes('@stylexjs/unplugin')) {
      const pluginsAt = config.search(/plugins\s*:\s*\[/);
      if (pluginsAt < 0) manual.push(`Add stylex.vite({ useCSSLayers: true, unstable_moduleResolution: { type: 'commonJS' } }) to the plugins in ${relTarget(configFile)}.`);
      else {
        const at = lastImport(config);
        config = `${config.slice(0, at)}import { unplugin as stylex } from '@stylexjs/unplugin'\n${config.slice(at)}`;
        // StyleX resolves imports of .stylex.ts files itself, so it gets the '@' alias too.
        const aliases = useAlias ? ", aliases: { '@/*': [`${fileURLToPath(new URL('./src', import.meta.url))}/*`] }" : '';
        if (useAlias) addUrlImport();
        config = config.replace(/plugins\s*:\s*\[/, match => `${match}\n    // Otherstates UI: compiles the components' StyleX into one stylesheet, in CSS layers so they win over\n    // global CSS in the legacy layer.\n    stylex.vite({ useCSSLayers: true, unstable_moduleResolution: { type: 'commonJS' }${aliases} }),`);
      }
    }
    // The '@' alias the docs use (@/ui/components), when the system lives under src/.
    if (useAlias && !/['"]@['"]\s*:/.test(config) && !/alias\s*:/.test(config)) {
      const defineAt = config.search(/defineConfig\(\s*\{/);
      if (defineAt < 0) manual.push(`Add a resolve alias '@' → ./src in ${relTarget(configFile)} so '@/ui/components' resolves.`);
      else {
        addUrlImport();
        config = config.replace(/defineConfig\(\s*\{/, match => `${match}\n  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },`);
      }
    }
    if (config !== before) { write(configFile, config); note(done, `${relTarget(configFile)}: StyleX plugin${dirRel.startsWith('src/') ? ' and the @ alias' : ''}`); }
  }

  // TypeScript paths for the alias.
  const tsconfigFile = ['tsconfig.app.json', 'tsconfig.json'].map(name => path.join(target, name)).find(file => exists(file) && /"compilerOptions"\s*:\s*\{/.test(read(file)));
  if (dirRel.startsWith('src/') && tsconfigFile) {
    const text = read(tsconfigFile);
    if (!/"paths"\s*:/.test(text)) {
      write(tsconfigFile, text.replace(/"compilerOptions"\s*:\s*\{/, match => `${match}\n    "paths": { "@/*": ["./src/*"] },`));
      note(done, `${relTarget(tsconfigFile)}: "@/*" path`);
    } else if (!text.includes('"@/*"')) manual.push(`Add "@/*": ["./src/*"] to compilerOptions.paths in ${relTarget(tsconfigFile)}.`);
  }

  // The entry: the font, the reset, and light/dark following the system.
  const html = path.join(target, 'index.html');
  const entryRel = exists(html) ? read(html).match(/<script[^>]+type="module"[^>]+src="\/?([^"]+)"/)?.[1] : undefined;
  const entry = entryRel ? path.join(target, entryRel) : ['src/main.tsx', 'src/main.ts', 'src/main.jsx', 'src/index.tsx'].map(file => path.join(target, file)).find(exists);
  if (!entry || !exists(entry)) manual.push(`Import '@fontsource-variable/inter' and '${dirRel}/base.css' first in your entry file, then call applyColorScheme('system') from '${dirRel}/color-scheme'.`);
  else {
    const text = read(entry);
    if (!text.includes('color-scheme')) {
      let fromEntry = path.relative(path.dirname(entry), uiDir).split(path.sep).join('/');
      if (!fromEntry.startsWith('.')) fromEntry = `./${fromEntry}`;
      const block = `// Otherstates UI: the font, the reset (first, so its CSS layer order holds), and light/dark following the system.\nimport '@fontsource-variable/inter'\nimport '${fromEntry}/base.css'\nimport { applyColorScheme } from '${fromEntry}/color-scheme'\n`;
      const all = [...text.matchAll(/^import[^\n]*\n/gm)];
      const last = all[all.length - 1];
      const at = last ? last.index + last[0].length : 0;
      const updated = `${block}${text.slice(0, at)}\napplyColorScheme('system')\n${text.slice(at)}`;
      write(entry, updated);
      note(done, `${relTarget(entry)}: font, base.css, applyColorScheme('system')`);
    }
    // An untouched Vite starter is demo code whose global CSS centers text and boxes #root, which would leak into
    // every component through inheritance. Like shadcn's init, replace it, but only when it is provably pristine.
    const appFile = path.join(path.dirname(entry), 'App.tsx');
    const appText = exists(appFile) ? read(appFile) : '';
    const pristine = appText.length < 6000 && /import viteLogo from '[^']*vite\.svg'/.test(appText) && appText.includes('setCount((count) => count + 1)');
    if (pristine && !flag('keep-starter')) {
      let uiImport = dirRel.startsWith('src/') ? `@/${dirRel.slice(4)}` : path.relative(path.dirname(appFile), uiDir).split(path.sep).join('/');
      if (!uiImport.startsWith('@') && !uiImport.startsWith('.')) uiImport = `./${uiImport}`;
      write(appFile, read(path.join(kitDir, 'starter/App.tsx')).replaceAll('__UI__', uiImport).replaceAll('__DIR__', dirRel));
      const replaced = ['App.tsx'];
      const appCss = path.join(path.dirname(entry), 'App.css');
      if (exists(appCss) && /\.(counter|logo|hero)\b/.test(read(appCss))) { if (!dryRun) fs.rmSync(appCss); replaced.push('App.css (removed)'); }
      const indexCss = path.join(path.dirname(entry), 'index.css');
      if (exists(indexCss) && /#root\s*\{[^}]*text-align:\s*center/.test(read(indexCss))) {
        write(indexCss, '/* Your app\'s global CSS. Element styles (body, a, button…) go inside @layer legacy, so they can never\n   override the design system\'s components. Style everything else with StyleX on the tokens. */\n@layer legacy {\n}\n');
        replaced.push('index.css');
      }
      note(done, `Replaced the untouched Vite starter (${replaced.join(', ')}) with the Otherstates starter screen`);
    }
    // Global stylesheets the app imports: moved into the lowest layer so they can't override components.
    const sheets = [];
    const scan = (file, depth) => {
      if (!exists(file) || depth > 1) return;
      for (const match of read(file).matchAll(/^import\s+['"](\.[^'"]+\.css)['"]/gm)) {
        const sheet = path.resolve(path.dirname(file), match[1]);
        if (!sheet.startsWith(uiDir) && exists(sheet) && !sheets.includes(sheet)) sheets.push(sheet);
      }
      const app = path.join(path.dirname(file), 'App.tsx');
      if (depth === 0) scan(app, 1);
    };
    scan(entry, 0);
    layerSheets(sheets);
  }
}

// ---------- 3. Build wiring (Next.js: App Router, Turbopack) ----------
// StyleX's Next.js setup: its Babel plugin compiles stylex.create in your code and the system's, and its PostCSS
// plugin writes every rule into the @stylex line of one stylesheet the root layout imports.
if (framework === 'next' && !filesOnly) {
  const esm = pkg.type === 'module';
  // tsconfig: the '@' alias the docs and the Babel config use. Added only where it can't shadow anything: a file
  // with no "paths" of its own that extends nothing (a child's paths replace every path its base defines).
  let aliasReady = !!existingAlias && !!uiImport;
  if (tsconfigText && !existingAlias) {
    if (/"compilerOptions"\s*:\s*\{/.test(tsconfigText) && !/"paths"\s*:/.test(tsconfigText) && !/"extends"\s*:/.test(tsconfigText)) {
      write(nextTsconfig, tsconfigText.replace(/"compilerOptions"\s*:\s*\{/, match => `${match}\n    "paths": { "@/*": ["${aliasRoot}*"] },`));
      note(done, 'tsconfig.json: "@/*" path');
      aliasReady = !!uiImport;
    } else manual.push(`Add "@/*": ["${aliasRoot}*"] to compilerOptions.paths in tsconfig.json (alongside any paths it inherits), so '@/${underAlias}/components' resolves. Until then the layout imports the system by relative path.`);
  }
  if (existingAlias && !uiImport) warnings.push(`${dirRel} is outside "@/*" (${existingAlias}), so the layout imports it by relative path. The docs write '@/ui/components'.`);
  else if (uiImport && uiImport !== '@/ui') warnings.push(`The system is imported as '${uiImport}/components' here; the docs and examples write '@/ui/components'.`);

  // Babel: the StyleX plugin, on Next's own preset. Turbopack keeps SWC for everything else.
  const babelNames = ['.babelrc', '.babelrc.json', '.babelrc.js', '.babelrc.cjs', '.babelrc.mjs', '.babelrc.cts', 'babel.config.js', 'babel.config.cjs', 'babel.config.mjs', 'babel.config.json', 'babel.config.cts'];
  const babelFiles = babelNames.map(name => path.join(target, name)).filter(exists);
  const babelFile = path.join(target, esm ? 'babel.config.cjs' : 'babel.config.js');
  // The PostCSS plugin reuses the Babel config's StyleX plugin only when the installer wrote that config; with the
  // project's own Babel config it gets the options inline (a .babelrc or a function config can't be required).
  let ownBabel = false;
  // Its to-do waits for the PostCSS step, which decides whether the PostCSS config already has the options.
  let babelTodo = null;
  let postcssTodo = null;
  if (babelFiles.length) {
    ownBabel = true;
    if (!babelFiles.some(file => read(file).includes('@stylexjs/babel-plugin'))) babelTodo = `Add the StyleX Babel plugin to ${relTarget(babelFiles[0])}${/\.babelrc(\.json)?$|\.json$/.test(babelFiles[0]) ? ' (a JSON config has to become babel.config.js first)' : ''}: kit README, "Next.js", shows the plugin and its options.`;
  } else {
    write(babelFile, nextBabelConfig(aliasRoot));
    note(done, `${relTarget(babelFile)}: the StyleX Babel plugin`);
  }
  const babelName = path.basename(babelFile);

  // PostCSS: the StyleX plugin first. A Tailwind setup (its PostCSS plugin or Turbopack loader) keeps working after it.
  const postcssNames = ['postcss.config.mjs', 'postcss.config.js', 'postcss.config.cjs', 'postcss.config.ts', 'postcss.config.mts', 'postcss.config.cts', 'postcss.config.json', '.postcssrc', '.postcssrc.json', '.postcssrc.js', '.postcssrc.cjs', '.postcssrc.mjs', '.postcssrc.ts', '.postcssrc.yaml', '.postcssrc.yml'];
  const postcssFile = postcssNames.map(name => path.join(target, name)).find(exists) ?? (pkg.postcss ? pkgFile : undefined);
  const entry = indent => stylexPostcssEntry(ownBabel ? null : babelName, aliasRoot, indent);
  if (!postcssFile) {
    write(path.join(target, 'postcss.config.mjs'), nextPostcssConfig(entry('    ')));
    note(done, 'postcss.config.mjs: the StyleX PostCSS plugin');
  } else if (!read(postcssFile).includes('@stylexjs/postcss-plugin')) {
    const text = read(postcssFile);
    const name = path.basename(postcssFile);
    const editable = /^postcss\.config\.(mjs|js|cjs)$/.test(name) && /plugins\s*:\s*\{/.test(text);
    if (!editable) postcssTodo = `Add '@stylexjs/postcss-plugin' first in the plugins of ${relTarget(postcssFile)}, with the options postcss.config.mjs gets in kit README, "Next.js"${ownBabel ? ' (the inline version, for a project with its own Babel config)' : ''}.`;
    else {
      const isEsm = name.endsWith('.mjs') || (name.endsWith('.js') && esm);
      let updated = text.replace(/plugins\s*:\s*\{/, match => `${match}\n${entry('    ')}`);
      if (isEsm && !/createRequire/.test(updated) && /require\(/.test(entry(''))) updated = `import { createRequire } from 'node:module';\n\nconst require = createRequire(import.meta.url);\n\n${updated}`;
      if (ownBabel && !/node:path/.test(updated)) updated = `${isEsm ? "import path from 'node:path';" : "const path = require('node:path');"}\n${updated}`;
      write(postcssFile, updated);
      note(done, `${relTarget(postcssFile)}: the StyleX PostCSS plugin, first`);
    }
  }
  if (babelTodo) manual.push(`${babelTodo}${postcssTodo ? '' : ' The PostCSS config already has them.'}`);
  if (postcssTodo) manual.push(postcssTodo);

  // The stylesheet StyleX fills.
  const appPath = path.join(target, appDir);
  const stylexSheet = path.join(appPath, 'stylex.css');
  if (!exists(stylexSheet)) {
    write(stylexSheet, "/* Otherstates UI: the StyleX PostCSS plugin replaces the line below with every compiled style, the components'\n   and your app's, in CSS layers that win over global CSS. The root layout imports it after base.css. */\n@stylex;\n");
    note(done, `${relTarget(stylexSheet)}: where StyleX writes its rules`);
  }

  // The root layout: font, reset and layer order before any other CSS; the StyleX sheet; dark mode before paint.
  const layoutFile = ['tsx', 'jsx', 'ts', 'js'].map(ext => path.join(appPath, `layout.${ext}`)).find(exists);
  let layout = read(layoutFile);
  const layoutBefore = layout;
  const fromLayout = specifier => {
    if (aliasReady) return `${uiImport}/${specifier}`;
    const relative = path.relative(path.dirname(layoutFile), path.join(uiDir, specifier)).split(path.sep).join('/');
    return relative.startsWith('.') ? relative : `./${relative}`;
  };
  const imported = specifier => new RegExp(`^\\s*import\\s+(?:[^'"]*from\\s+)?['"]${specifier.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}['"]`, 'm').test(layout);
  const needed = [
    ["import '@fontsource-variable/inter';", '@fontsource-variable/inter'],
    [`import '${fromLayout('base.css')}';`, fromLayout('base.css')],
    ["import './stylex.css';", './stylex.css'],
  ].filter(([, specifier]) => !imported(specifier)).map(([line]) => line);
  const code = maskComments(layout);
  const needsScript = !code.includes('colorSchemeScript()');
  if (needsScript && !/\bcolorSchemeScript\b[^\n]*from/.test(code)) needed.push(`import { colorSchemeScript } from '${fromLayout('color-scheme')}';`);
  if (needed.length) {
    // After a 'use client' / 'use server' directive, which has to stay first.
    const directive = layout.match(/^\s*(['"])use (client|server)\1;?[^\n]*\n/)?.[0] ?? '';
    layout = `${directive}// Otherstates UI: the font, then the reset (before any other CSS, so its layer order holds), then every StyleX\n// style, and the script that sets light or dark before the first paint.\n${needed.join('\n')}\n${layout.slice(directive.length)}`;
  }
  if (needsScript) {
    const masked = maskComments(layout);
    const html = masked.search(/<html[\s>]/);
    if (html < 0) manual.push(`Render <script dangerouslySetInnerHTML={{ __html: colorSchemeScript() }} /> in <head> in ${relTarget(layoutFile)}, with suppressHydrationWarning on <html>.`);
    else {
      if (!/suppressHydrationWarning/.test(masked.slice(html, tagEnd(masked, html) + 1))) layout = `${layout.slice(0, html + 5)} suppressHydrationWarning${layout.slice(html + 5)}`;
      const after = maskComments(layout);
      const indent = layout.slice(layout.lastIndexOf('\n', html) + 1, html).match(/^\s*/)[0] + '  ';
      const script = `<script dangerouslySetInnerHTML={{ __html: colorSchemeScript() }} />`;
      const head = after.search(/<head(\s[^>]*)?>/);
      if (head >= 0) {
        const at = tagEnd(after, head) + 1;
        layout = `${layout.slice(0, at)}\n${indent}  ${script}${layout.slice(at)}`;
      } else {
        const at = tagEnd(after, after.search(/<html[\s>]/)) + 1;
        layout = `${layout.slice(0, at)}\n${indent}<head>\n${indent}  {/* Otherstates UI: light or dark before the first paint. */}\n${indent}  ${script}\n${indent}</head>${layout.slice(at)}`;
      }
    }
  }
  if (layout !== layoutBefore) { write(layoutFile, layout); note(done, `${relTarget(layoutFile)}: font, base.css, stylex.css and the color scheme script`); }

  // An untouched create-next-app starter: its demo page and globals.css (whose body font and colors would leak into
  // every component) give way to the Otherstates starter, like the Vite starter does.
  const pageFile = ['tsx', 'jsx'].map(ext => path.join(appPath, `page.${ext}`)).find(exists);
  const pageText = pageFile ? read(pageFile) : '';
  const globalsFile = path.join(appPath, 'globals.css');
  const replaced = [];
  if (!flag('keep-starter') && pageText.length < 8000 && pageText.includes('src="/next.svg"') && pageText.includes('To get started, edit the')) {
    write(pageFile, read(path.join(kitDir, 'starter/next/page.tsx')).replaceAll('__UI__', fromLayout('').replace(/\/$/, '')).replaceAll('__DIR__', dirRel));
    write(path.join(appPath, 'theme-switch.tsx'), read(path.join(kitDir, 'starter/next/theme-switch.tsx')).replaceAll('__UI__', fromLayout('').replace(/\/$/, '')));
    replaced.push(`${path.basename(pageFile)}, theme-switch.tsx`);
    const globals = exists(globalsFile) ? read(globalsFile) : '';
    if (globals.includes('--background: #ffffff;') && globals.includes('font-family: Arial, Helvetica, sans-serif;') && globals.length < 2000) {
      const tailwind = /@import\s+["']tailwindcss["'];/.test(globals) ? '@import "tailwindcss";\n\n' : '';
      write(globalsFile, `${tailwind}/* Your app's global CSS. Element styles (body, a, button…) go inside @layer legacy, so they can never\n   override the design system's components. Style everything else with StyleX on the tokens. */\n@layer legacy {\n}\n`);
      replaced.push('globals.css');
    }
    note(done, `Replaced the untouched create-next-app starter (${replaced.join(', ')}) with the Otherstates starter screen`);
  }

  // Global stylesheets the layout imports: their plain rules move into the lowest layer.
  const sheets = [...read(layoutFile).matchAll(/^import\s+['"](\.[^'"]+\.css)['"]/gm)]
    .map(match => path.resolve(path.dirname(layoutFile), match[1]))
    .filter(sheet => sheet !== stylexSheet && !sheet.startsWith(uiDir) && exists(sheet) && !replaced.includes(path.basename(sheet)));
  layerSheets(sheets);
}

// ---------- 4. Agents ----------
if (agents) {
  const skillFrom = path.join(kitDir, 'files/claude/skills/otherstates-ui');
  const skillTo = path.join(target, '.claude/skills/otherstates-ui');
  let skillChanged = false;
  for (const name of fs.readdirSync(skillFrom)) {
    const to = path.join(skillTo, name);
    const content = read(path.join(skillFrom, name)).replaceAll('src/ui/', `${dirRel}/`);
    if (exists(to) && read(to) === content) continue;
    write(to, content);
    skillChanged = true;
  }
  if (skillChanged) note(done, '.claude/skills/otherstates-ui: the skill agents follow');

  const settingsFile = path.join(target, '.claude/settings.json');
  let settings = {};
  let settingsOk = true;
  if (exists(settingsFile)) { try { settings = JSON.parse(read(settingsFile)); } catch { settingsOk = false; } }
  if (!settingsOk) warnings.push('.claude/settings.json is not valid JSON, so the check hook was not added. Add a PostToolUse hook on Edit|Write|MultiEdit that runs: node "$CLAUDE_PROJECT_DIR/' + dirRel + '/agent/check.mjs" --hook');
  else if (!JSON.stringify(settings).includes('agent/check.mjs')) {
    settings.hooks ??= {};
    settings.hooks.PostToolUse ??= [];
    settings.hooks.PostToolUse.push({ matcher: 'Edit|Write|MultiEdit', hooks: [{ type: 'command', command: `node "$CLAUDE_PROJECT_DIR/${dirRel}/agent/check.mjs" --hook` }] });
    write(settingsFile, JSON.stringify(settings, null, 2) + '\n');
    note(done, '.claude/settings.json: the check runs after every edit');
  }

  const start = '<!-- otherstates-ui:start -->';
  const end = '<!-- otherstates-ui:end -->';
  const block = `${start}\n## Design system\n\nEvery screen and component in this project is built from Otherstates UI in \`${dirRel}/\`, and nothing else.\nBefore any UI work, read \`${dirRel}/AGENTS.md\`. Look a component up in \`llms.txt\` or\n\`${dirRel}/agent/manifest.json\` before building one, and run \`npm run ui:check\` before finishing.\n${end}\n`;
  const upsert = (file, content, label) => {
    const text = exists(file) ? read(file) : '';
    const pattern = new RegExp(`${start}[\\s\\S]*?${end}\\n?`);
    const next = pattern.test(text) ? text.replace(pattern, content) : `${text}${text && !text.endsWith('\n\n') ? (text.endsWith('\n') ? '\n' : '\n\n') : ''}${content}`;
    if (next !== text) { write(file, next); note(done, label); }
  };
  upsert(path.join(target, 'AGENTS.md'), block, 'AGENTS.md: the design-system rule for any agent');
  const claudeFile = path.join(target, 'CLAUDE.md');
  const claude = exists(claudeFile) ? read(claudeFile) : '';
  if (!claude.includes('@AGENTS.md') && !claude.includes(start)) upsert(claudeFile, `${start}\n@AGENTS.md\n${end}\n`, 'CLAUDE.md: points Claude Code at AGENTS.md');
}

// ---------- 5. Install, generate the agent catalog, check ----------
let installedOk = true;
if (!dryRun && depChanges.length && !flag('skip-install')) {
  console.log(`Installing dependencies with ${pm}…`);
  const result = spawnSync(pm, ['install'], { cwd: target, stdio: 'inherit', shell: process.platform === 'win32' });
  installedOk = result.status === 0;
  if (installedOk) note(done, `Installed dependencies with ${pm}`);
  else warnings.push(`${pm} install failed. Fix the error above, run ${pm} install, then npm run ui:docs.`);
}
if (!dryRun && !record && flag('skip-install')) note(manual, `After installing dependencies, run npm run ui:docs, then npm run ui:check -- --baseline once, so your existing code's findings are recorded and only new ones fail.`);
const run = (script, args) => {
  try { return { ok: true, out: execFileSync('node', [path.join(uiDir, 'agent', script), ...args], { cwd: target, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) }; }
  catch (error) { return { ok: false, out: `${error.stdout ?? ''}${error.stderr ?? ''}` }; }
};
if (!dryRun && installedOk && !flag('skip-install')) {
  const docs = run('build-docs.mjs', []);
  if (docs.ok) note(done, `Agent catalog: ${docs.out.trim().split('·').slice(1).join('·').trim()}, plus llms.txt`);
  else warnings.push(`Could not generate the agent catalog (npm run ui:docs): ${docs.out.trim().split('\n').pop()}`);
  const system = run('check.mjs', [uiDir, '--json']);
  try {
    const report = JSON.parse(system.out);
    if (report.errors) warnings.push(`The system itself has ${report.errors} check error(s): run npm run ui:check.`);
    else note(done, `Check: ${dirRel} passes (${report.files} files, 0 errors)`);
  } catch { warnings.push('Could not run the check. Run npm run ui:check.'); }
  // The product's own code: what it already breaks is recorded once, so the check fails only on new findings and
  // screens move over one at a time (Tailwind, shadcn and plain CSS keep working meanwhile).
  const codeDir = dirRel.includes('/') ? path.join(target, dirRel.split('/')[0]) : target;
  const baselineFile = path.join(uiDir, 'agent/baseline.json');
  if (exists(codeDir)) {
    const app = run('check.mjs', [codeDir, '--json']);
    try {
      const report = JSON.parse(app.out);
      const own = report.findings.filter(item => !item.file.startsWith(uiDir + path.sep));
      if (own.length && !exists(baselineFile)) {
        const recorded = run('check.mjs', [codeDir, '--baseline']);
        if (recorded.ok) note(done, `Check baseline: ${own.length} finding(s) your code already had are recorded in ${relTarget(baselineFile)}. They stay listed as known; anything new fails`);
        else warnings.push(`Could not record the check baseline: ${recorded.out.trim().split('\n').pop()}`);
      } else if (own.length) warnings.push(`Your code has ${own.length} new finding(s) against the system since the baseline. See them with npm run ui:check.`);
    } catch { /* reported above */ }
  }
}

// ---------- Report ----------
for (const item of done) console.log(`  ✓ ${item}`);
for (const item of manual) console.log(`  → To do: ${item}`);
for (const item of warnings) console.log(`  ! ${item}`);
const importFrom = framework === 'next' ? (uiImport ?? `./${dirRel}`) : dirRel.startsWith('src/') ? `@/${dirRel.slice(4)}` : dirRel;
console.log(`
Next:
  import { Button } from '${importFrom}/components'
  Components, props and examples: llms.txt and ${dirRel}/agent/components/
  Rules for agents (and people): ${dirRel}/AGENTS.md
  npm run ui:check   · npm run ui:new -- <name> --kind control|display   · npm run ui:docs
`);

// ---------- Helpers ----------

/** `value` as a folder inside the project ('./src/ui/' → 'src/ui'), or null when it is the project itself or
 *  lies outside it. */
function projectFolder(value) {
  const rel = path.relative(target, path.resolve(target, value));
  return rel && !path.isAbsolute(rel) && rel.split(path.sep)[0] !== '..' ? rel.split(path.sep).join('/') : null;
}

/** Moves each global stylesheet's plain rules into @layer legacy, below every component. Imports, Tailwind's
 *  directives and other at-rules that must stay at the top level stay where they are. */
function layerSheets(sheets) {
  for (const sheet of sheets) {
    const css = read(sheet);
    if (/^\s*@layer\s+legacy\b/m.test(css)) continue;
    const result = layerGlobalCss(css, sheet);
    if (result.tailwind3) warnings.push(`${relTarget(sheet)} uses Tailwind 3 (@tailwind), whose styles are not in CSS layers: its preflight overrides components. Tailwind 4 puts them in layers below the components.`);
    if (!result.changed) continue;
    write(sheet, result.css);
    note(done, result.moved ? `${relTarget(sheet)}: plain rules moved into @layer legacy, so they can't override components (imports and Tailwind directives stay on top)` : `${relTarget(sheet)}: its imported stylesheets go into @layer legacy`);
  }
}

function layerGlobalCss(css, file) {
  // At-rules that stay at the top level: they configure, import or define rather than style elements.
  const TOP_LEVEL = /^@(import|charset|namespace|use|forward|tailwind|theme|plugin|source|config|custom-variant|variant|utility|layer|font-face|property|keyframes|counter-style|font-feature-values|font-palette-values|stylex)\b/;
  const TAILWIND = /@(utility|custom-variant|variant|theme|plugin|source|config|tailwind|apply)\b|@import\s+["']tailwindcss/;
  const kept = [];
  const wrapped = [];
  let tailwind3 = false;
  let rewritten = false;
  for (const statement of topLevelStatements(css)) {
    const head = statement.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (!head) { kept.push(statement); continue; }
    if (/^@tailwind\b/.test(head)) tailwind3 = true;
    // The app's own plain stylesheets, imported by relative path, go into the same layer. Packages style their own
    // classes and are left alone, and so is any file Tailwind reads (it can't nest @utility or @theme in a layer).
    const relative = head.match(/^@import\s+(?:url\(\s*)?["']?(\.[^"')\s]+)["']?\s*\)?/)?.[1];
    if (relative && !/layer\(/.test(head)) {
      const target = file ? path.resolve(path.dirname(file), relative) : '';
      if (target && exists(target) && !TAILWIND.test(read(target))) {
        kept.push(statement.replace(/(@import\s+(?:url\([^)]*\)|"[^"]*"|'[^']*'))/, '$1 layer(legacy)'));
        rewritten = true;
        continue;
      }
    }
    if (TOP_LEVEL.test(head)) kept.push(statement);
    else wrapped.push(statement);
  }
  if (!wrapped.length && !rewritten) return { css, changed: false, tailwind3, moved: false };
  const body = wrapped.map(item => item.replace(/^\n+/, '')).join('\n').replace(/\s+$/, '');
  const top = kept.join('').replace(/\s+$/, '');
  const layer = wrapped.length ? `/* Otherstates UI: this file's plain rules sit in the lowest CSS layer, so they keep styling your own markup but\n   can't override the design system. Delete the wrapper to undo. */\n@layer legacy {\n${body}\n}\n` : '';
  return { css: `${top ? `${top}\n${layer ? '\n' : ''}` : ''}${layer}`, changed: true, tailwind3, moved: wrapped.length > 0 };
}

/** A stylesheet's top-level statements, each with the comments and whitespace before it. */
function topLevelStatements(css) {
  const out = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < css.length; i += 1) {
    const char = css[i];
    if (char === '/' && css[i + 1] === '*') { const end = css.indexOf('*/', i + 2); i = end < 0 ? css.length : end + 1; continue; }
    if (char === '"' || char === "'") { for (i += 1; i < css.length && css[i] !== char; i += 1) if (css[i] === '\\') i += 1; continue; }
    if (char === '(') { let parens = 1; for (i += 1; i < css.length && parens; i += 1) { if (css[i] === '(') parens += 1; else if (css[i] === ')') parens -= 1; } i -= 1; continue; }
    if (char === '{') depth += 1;
    else if (char === '}') { depth -= 1; if (depth === 0) { out.push(css.slice(start, i + 1)); start = i + 1; } }
    else if (char === ';' && depth === 0) { out.push(css.slice(start, i + 1)); start = i + 1; }
  }
  if (css.slice(start).trim()) out.push(css.slice(start));
  return out;
}

/** The index of the `>` that closes the JSX opening tag starting at `from`, skipping {expressions}. */
function tagEnd(text, from) {
  let depth = 0;
  for (let i = from; i < text.length; i += 1) {
    const char = text[i];
    if (char === '{') depth += 1;
    else if (char === '}') depth -= 1;
    else if (char === '>' && depth === 0 && text[i - 1] !== '=') return i;
  }
  return text.length - 1;
}

/** The source with comments and string contents blanked out (same length), for finding JSX tags in code only. */
function maskComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|(["'`])(?:\\.|(?!\1)[^\\\n])*\1/g, match => match.replace(/[^\n]/g, ' '));
}

function stylexOptionsSource(base, indent) {
  return `{
${indent}  dev: process.env.NODE_ENV !== 'production',
${indent}  runtimeInjection: false,
${indent}  enableInlinedConditionalMerge: true,
${indent}  treeshakeCompensation: true,
${indent}  // The '@' alias from tsconfig.json, so imports of the .stylex.ts token files resolve.
${indent}  aliases: { '@/*': [path.join(here, '${base === './' ? '' : base.slice(2)}*')] },
${indent}  unstable_moduleResolution: { type: 'commonJS' },
${indent}}`;
}

// Turbopack evaluates the PostCSS config (and anything it loads) with __dirname under a virtual '/ROOT/', its
// project root (a monorepo's top folder if there is one); there the folder next runs in stands in.
function hereLine() {
  return `const here = __dirname.startsWith('/ROOT') ? process.cwd() : __dirname;`;
}

function nextBabelConfig(base) {
  return `// Otherstates UI: compiles StyleX (the components' styles and yours) at build time. Turbopack runs this config
// on your code and keeps SWC for the rest; postcss.config.mjs reuses the plugin to write the stylesheet.
const path = require('node:path');

// Turbopack evaluates postcss.config.mjs, which loads this file, with __dirname under a virtual '/ROOT/' (its
// project root, a monorepo's top folder if there is one); there the folder next runs in stands in.
${hereLine()}

module.exports = {
  // Modern targets: StyleX evaluates stylex.create itself, and can't once arrow functions are compiled away.
  presets: [['next/babel', { 'preset-env': { targets: 'chrome 111, edge 111, firefox 111, safari 16.4' } }]],
  plugins: [['@stylexjs/babel-plugin', ${stylexOptionsSource(base, '  ')}]],
};
`;
}

/** The PostCSS plugin entry: the Babel config's StyleX plugin when the installer wrote that config, or the same
 *  options inline when the project has its own Babel config. */
function stylexPostcssEntry(babelName, base, indent) {
  const plugins = babelName ? `require('./${babelName}').plugins` : `[['@stylexjs/babel-plugin', ${stylexOptionsSource(base, `${indent}  `).replace(/path\.join\(here,/, "path.join(process.cwd(),")}]]`;
  return `${indent}// Otherstates UI: writes every StyleX rule into the @stylex line of stylex.css${babelName ? `, with the plugin from ${babelName}` : ''}.
${indent}'@stylexjs/postcss-plugin': {
${indent}  babelConfig: { babelrc: false, configFile: false, parserOpts: { plugins: ['typescript', 'jsx'] }, plugins: ${plugins} },
${indent}  useCSSLayers: true,
${indent}},`;
}

function nextPostcssConfig(entry) {
  const needsRequire = /require\(/.test(entry);
  const needsPath = /path\.join/.test(entry);
  return `${needsRequire ? "import { createRequire } from 'node:module';\n" : ''}${needsPath ? "import path from 'node:path';\n" : ''}${needsRequire || needsPath ? '\n' : ''}${needsRequire ? 'const require = createRequire(import.meta.url);\n\n' : ''}const config = {
  plugins: {
${entry}
  },
};

export default config;
`;
}
