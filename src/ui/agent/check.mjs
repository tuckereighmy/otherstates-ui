#!/usr/bin/env node
// Otherstates UI design-system check. Fails on anything that steps outside the system, so an agent (or a
// person) cannot ship a raw color, an off-scale space, a dropped StyleX shorthand, a utility class, a
// hand-rolled control or a foreign UI kit.
//
//   node src/ui/agent/check.mjs [paths…]     check files or folders (default: the project's src folder, or the
//                                            whole project when it has none)
//   node src/ui/agent/check.mjs --json       machine-readable report
//   node src/ui/agent/check.mjs --hook       Claude Code PostToolUse hook: reads the edited file from stdin,
//                                            prints violations to stderr and exits 2 so the agent fixes them
//   node src/ui/agent/check.mjs --baseline   records what product code already breaks (agent/baseline.json),
//                                            so later runs fail only on new findings
//   node src/ui/agent/check.mjs --all        ignores the baseline and reports everything
//
// Profiles, by where a file sits relative to the system root (the folder holding tokens.stylex.ts):
//   app     product code, templates and docs examples: every rule
//   system  the library itself (components and internals): colors, shorthands, imports, and the raw-space,
//           raw-radius, raw-type and raw-shadow rules. Formula values (spec 1.2 insets, 1.9 item padding) carry an
//           os-allow comment. Native controls, utility classes and stylesheets stay app-only rules.
//   tokens  tokens.stylex.ts, theme.ts, studio.stylex.ts and customize/: colors and shorthands are theirs to define
//   skip    the docs site chrome, which never ships to a product
//
// Server rendering (Next.js and other React Server Components setups): every component file, docs example and
// template that uses hooks, context, React Aria or event handlers starts with 'use client', and a 'use client'
// component file exports only components and hooks, because a Server Component that imports a plain function
// from one gets a reference it can't call.
//
// Existing product code: an app adopting the system mid-way (Tailwind, shadcn, its own CSS) records what it
// already has with --baseline. Those findings stay listed as known and stop failing; anything new still fails,
// so screens move over one at a time. Code inside the system is never baselined.
//
// A deliberate exception is written next to the line, with a reason:  // os-allow <rule>: <why>

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const ts = loadTypeScript(require);

// This file sits in <system>/agent/. The baseline lives next to it and names files from the project root.
const systemDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baselineFile = path.join(systemDir, 'agent', 'baseline.json');
const projectDir = (() => {
  for (let dir = path.dirname(systemDir); dir !== path.dirname(dir); dir = path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
  }
  return process.cwd();
})();
// Real paths on both sides, so a project reached through a symlink still matches its baseline entries.
const realProjectDir = fs.realpathSync(projectDir);
const fromProject = file => path.relative(realProjectDir, fs.existsSync(file) ? fs.realpathSync(file) : file).split(path.sep).join('/');

const SPACE = { 2: '0-5', 4: '1', 6: '1-5', 8: '2', 12: '3', 16: '4', 20: '5', 24: '6', 32: '8', 40: '10', 48: '12', 56: '14' };
const FONT_SIZE = { 12: 'xs', 13: 'caption', 14: 'sm', 15: 'md', 16: 'body', 18: 'lg', 22: 'xl', 29: '2xl' };
const FONT_WEIGHT = { 400: 'regular', 500: 'medium', 600: 'semibold', 700: 'bold' };
const SHORTHANDS = new Set(['all', 'animation', 'background', 'border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
  'borderInline', 'borderInlineStart', 'borderInlineEnd', 'borderBlock', 'borderBlockStart', 'borderBlockEnd', 'borderStart',
  'borderEnd', 'borderHorizontal', 'borderVertical']);
const SPACING = /^(gap|rowGap|columnGap|(padding|margin|scrollPadding|scrollMargin)(Top|Right|Bottom|Left|Block|Inline|BlockStart|BlockEnd|InlineStart|InlineEnd)?|inset(Block|Inline)?(Start|End)?)$/;
const RADIUS = /^border(Top|Bottom)?(Left|Right)?(Start|End)?(Start|End)?Radius$|^borderRadius$/;
const COLOR_LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/i;
const COLOR_PROPS = /color$|^(fill|stroke|backgroundColor|boxShadow|textShadow|outlineColor|caretColor|accentColor|stopColor|floodColor|lightingColor|textDecorationColor|columnRuleColor|backgroundImage)$/i;
const NAMED_COLORS = /^(white|black|red|green|blue|gray|grey|orange|yellow|purple|pink|silver|navy|teal|maroon|olive|lime|aqua|fuchsia)$/i;
const FOREIGN_UI = /^(@radix-ui\/|@mui\/|@material-ui\/|antd|@chakra-ui\/|@headlessui\/|@mantine\/|@nextui-org\/|@heroui\/|daisyui|flowbite|primereact|react-bootstrap|lucide-react|react-icons|@heroicons\/|@phosphor-icons\/|@tabler\/icons|class-variance-authority|tailwind-merge|tailwindcss|styled-components|@emotion\/|recharts|chart\.js|react-chartjs-2|@nivo\/|victory|@visx\/|@\/components\/ui\/|~\/components\/ui\/)/;
const NATIVE = { button: 'Button', input: 'Input', select: 'Select', textarea: 'Textarea', dialog: 'Dialog', table: 'Table', progress: 'Progress', meter: 'Meter' };
// Files a product renders from its own code: the components (not their internals, which only components import),
// the theme builder's components, docs examples and template screens.
const RENDERED = /^((catalog\/)?(docs|templates)\/[^/]+\/[^/]+|components\/[^/]+|customize\/[^/]+)\.tsx$/;
// Where 'use client' files may export only components and hooks: the library's own modules.
const LIBRARY_MODULE = /^(components|customize)\/[^/]+\.tsx$/;
// Internal modules already parsed: whether each needs the browser.
const internalReasons = new Map();
// Modules parsed while following imports.
const parsed = new Map();
// Globals a server doesn't have.
const BROWSER_GLOBALS = new Set(['window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'matchMedia', 'getComputedStyle',
  'requestAnimationFrame', 'cancelAnimationFrame', 'location', 'history', 'screen', 'innerWidth', 'innerHeight', 'devicePixelRatio',
  'ResizeObserver', 'IntersectionObserver', 'MutationObserver', 'HTMLElement', 'customElements']);
// Array methods whose callbacks run right away, so a callback inside a component's body runs while it renders.
const EAGER_CALLBACKS = new Set(['map', 'flatMap', 'filter', 'reduce', 'reduceRight', 'forEach', 'some', 'every', 'find', 'findIndex', 'findLast', 'findLastIndex', 'sort', 'toSorted', 'from']);

const args = process.argv.slice(2);
const json = args.includes('--json');
const hook = args.includes('--hook');
const recordBaseline = args.includes('--baseline');
const useBaseline = !recordBaseline && !args.includes('--all');
let targets = args.filter(arg => !arg.startsWith('--'));

if (hook) {
  const input = fs.readFileSync(0, 'utf8');
  let file;
  try { file = JSON.parse(input)?.tool_input?.file_path; } catch { process.exit(0); }
  if (!file || !/\.(tsx?|mts|cts)$/.test(file) || file.includes('node_modules')) process.exit(0);
  targets = [file];
}
if (targets.length === 0) targets = [fs.existsSync(path.join(projectDir, 'src')) ? path.join(projectDir, 'src') : projectDir];

// Overlapping targets (src and src/ui) would check a file twice and double its findings.
const files = [...new Set(targets.flatMap(target => walk(path.resolve(target))))];
const all = [];
for (const file of files) checkFile(file);

if (recordBaseline) {
  saveBaseline();
} else {
  const { known, fixed } = useBaseline ? applyBaseline() : { known: 0, fixed: 0 };
  const findings = all.filter(item => !item.known);
  const errors = findings.filter(item => item.level === 'error');
  const baselineRel = fromProject(baselineFile);
  if (json) {
    console.log(JSON.stringify({ files: files.length, errors: errors.length, warnings: findings.length - errors.length, known, fixed, findings }, null, 2));
  } else if (hook) {
    if (findings.length) {
      console.error(`Otherstates UI check: ${errors.length} error(s), ${findings.length - errors.length} warning(s). Fix them with system tokens and components (see src/ui/AGENTS.md):`);
      for (const item of findings) console.error(format(item));
    }
  } else {
    for (const item of findings) console.log(format(item));
    console.log(`\notherstates check: ${files.length} files · ${errors.length} errors · ${findings.length - errors.length} warnings${known ? ` · ${known} known (${baselineRel})` : ''}`);
    if (fixed) console.log(`${fixed} known finding(s) are fixed. Record that with --baseline, so they can't come back.`);
  }
  // exitCode, not exit(): a piped stdout flushes asynchronously and exit() would cut a long report short.
  process.exitCode = errors.length ? (hook ? 2 : 1) : 0;
}

/** Product code (outside the system) is all the baseline ever covers. */
function baselined(item) {
  return !item.inSystem;
}

function readBaseline() {
  if (!fs.existsSync(baselineFile)) return null;
  try { return JSON.parse(fs.readFileSync(baselineFile, 'utf8')); } catch { return null; }
}

/** Marks findings the baseline already holds as known. Matching is per file, by rule and the offending code, so
 *  moving lines around keeps them known; a finding beyond the recorded count is new and fails. */
function applyBaseline() {
  const baseline = readBaseline();
  if (!baseline?.files) return { known: 0, fixed: 0 };
  let known = 0;
  let fixed = 0;
  for (const file of files) {
    const recorded = baseline.files[fromProject(file)];
    if (!recorded) continue;
    const seen = {};
    for (const item of all) {
      if (item.file !== file || !baselined(item)) continue;
      seen[item.key] = (seen[item.key] ?? 0) + 1;
      if (seen[item.key] <= (recorded[item.key] ?? 0)) { item.known = true; known += 1; }
    }
    for (const [key, count] of Object.entries(recorded)) fixed += Math.max(0, count - (seen[key] ?? 0));
  }
  return { known, fixed };
}

/** Records today's product-code findings for the files checked, keeping entries for files not checked. */
function saveBaseline() {
  const baseline = readBaseline() ?? {};
  const entries = { ...baseline.files };
  let count = 0;
  for (const file of files) {
    const rel = fromProject(file);
    const recorded = {};
    for (const item of all) {
      if (item.file !== file || !baselined(item)) continue;
      recorded[item.key] = (recorded[item.key] ?? 0) + 1;
      count += 1;
    }
    if (Object.keys(recorded).length) entries[rel] = Object.fromEntries(Object.entries(recorded).sort(([a], [b]) => a.localeCompare(b)));
    else delete entries[rel];
  }
  const sorted = Object.fromEntries(Object.entries(entries).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(baselineFile, JSON.stringify({
    about: 'What this product\'s own code broke when it adopted Otherstates UI. The check lists these as known instead of failing, and fails on anything new. Fix them as you touch each screen, then run the check with --baseline to record the smaller set.',
    files: sorted,
  }, null, 2) + '\n');
  const inside = all.filter(item => !baselined(item));
  for (const item of inside) console.log(format(item));
  console.log(`Recorded ${count} finding(s) in ${Object.keys(sorted).length} file(s) to ${fromProject(baselineFile)}.${inside.length ? ` ${inside.length} finding(s) inside the system can't be baselined: fix them.` : ''}`);
  process.exitCode = inside.some(item => item.level === 'error') ? 1 : 0;
}

function format(item) {
  return `${path.relative(process.cwd(), item.file)}:${item.line}:${item.column}  ${item.level}  ${item.rule}  ${item.message}${item.fix ? `  → ${item.fix}` : ''}`;
}

function walk(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return /\.(tsx?|mts|cts)$/.test(target) && !target.endsWith('.d.ts') ? [target] : [];
  return fs.readdirSync(target).flatMap(name => (name === 'node_modules' || name === 'dist' || name.startsWith('.')) ? [] : walk(path.join(target, name)));
}

/** The folder holding tokens.stylex.ts above `file`, or null for code outside the system. */
function systemRoot(file) {
  let dir = path.dirname(file);
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'tokens.stylex.ts'))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

function profileOf(root, rel) {
  if (!root) return 'app';
  // Docs examples and templates are what agents copy, so they meet the product rules. In this repo they sit
  // under catalog/; in an installed product, directly under the system root.
  if (/^(catalog\/)?templates\/[^/]+\/.+\.tsx?$/.test(rel)) return 'app';
  if (/^(catalog\/)?docs\/[^/]+\/(?!index\.ts$).+\.tsx$/.test(rel)) return 'app';
  if (rel.startsWith('catalog/') || /^(docs|templates)\//.test(rel)) return 'skip';
  if (/^(tokens\.stylex|theme|studio\.stylex)\.ts$/.test(rel) || rel.startsWith('customize/')) return 'tokens';
  return 'system';
}

function checkFile(file) {
  const root = systemRoot(file);
  const rel = root ? path.relative(root, file).split(path.sep).join('/') : '';
  const profile = profileOf(root, rel);
  if (profile === 'skip') return;
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const app = profile === 'app';

  const report = (node, level, rule, message, fix, keyText) => {
    const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source));
    const allow = new RegExp(`os-allow\\s+${rule}\\s*:`);
    if (allow.test(lines[line] ?? '') || allow.test(lines[line - 1] ?? '')) return;
    // The baseline matches a finding by its rule and the code it points at, not its line, so edits elsewhere in
    // the file keep it matched.
    const key = `${rule} ${(keyText ?? node.getText(source)).replace(/\s+/g, ' ').slice(0, 160)}`;
    all.push({ file, line: line + 1, column: character + 1, level, rule, message, fix, profile, key, inSystem: root !== null });
  };

  // Code that runs on a server too: every file of the system (internals and plain modules included).
  if (root) {
    // Without a server snapshot, useSyncExternalStore throws as soon as it renders on a server.
    const missingServerSnapshot = node => {
      if (ts.isCallExpression(node) && node.arguments.length < 3 && ((ts.isIdentifier(node.expression) && node.expression.text === 'useSyncExternalStore') || (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'useSyncExternalStore'))) {
        report(node, 'error', 'server-snapshot', 'useSyncExternalStore without getServerSnapshot throws when the component renders on a server.', 'pass a third argument: the value to render on the server and while hydrating');
      }
      ts.forEachChild(node, missingServerSnapshot);
    };
    missingServerSnapshot(source);
    for (const node of browserGlobalsInRender(source)) report(node, 'error', 'browser-global', `Uses ${node.getText(source)} at module level or while rendering, where a server has no browser: server rendering (Next.js) throws.`, 'read it in an effect or event handler, or through useSyncExternalStore with a server value');
    for (const node of clockReadsInRender(source)) report(node, 'error', 'clock-in-render', 'Reads the clock while rendering (toDate() counts too): a prerendered page (Next.js Cache Components) fails to build, and a server-rendered one keeps the day it was built.', 'read it in an event handler or effect, take dates from useToday(), or use a fixed value');
  }

  if (root && RENDERED.test(rel)) {
    const first = source.statements[0];
    const isClient = !!first && ts.isExpressionStatement(first) && ts.isStringLiteral(first.expression) && first.expression.text === 'use client';
    if (!isClient) {
      const reasons = clientReasons(source);
      if (reasons.length) report(first ?? source, 'error', 'use-client', `Uses ${reasons.join(', ')} without 'use client', so a Server Component (Next.js) can't render it.`, "make 'use client'; the first line");
    } else if (LIBRARY_MODULE.test(rel)) {
      for (const [node, name] of valueExports(source)) {
        if (name !== 'default' && !/^(use[A-Z0-9]|[A-Z])/.test(name)) report(node, 'error', 'client-export', `${name} is a plain value exported from a 'use client' file: a Server Component that imports it gets a reference it can't call.`, "move it to a file without 'use client' (agent-format.ts holds the formatters) and import it here");
      }
    }
  }

  const checkValue = (key, value, conditions) => {
    if (conditions.some(condition => condition.includes('forced-colors'))) return;
    if (ts.isParenthesizedExpression(value)) return checkValue(key, value.expression, conditions);
    if (ts.isObjectLiteralExpression(value)) {
      for (const property of value.properties) {
        if (ts.isPropertyAssignment(property)) checkValue(key, property.initializer, [...conditions, nameOf(property.name)]);
      }
      return;
    }
    if (ts.isConditionalExpression(value)) { checkValue(key, value.whenTrue, conditions); checkValue(key, value.whenFalse, conditions); return; }
    const number = numberOf(value);
    const string = ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value) ? value.text
      : ts.isTemplateExpression(value) ? null : undefined;
    const templateText = ts.isTemplateExpression(value) ? [value.head.text, ...value.templateSpans.map(span => span.literal.text)].join(' ') : '';

    // Colors: every profile except the token files themselves.
    if (profile !== 'tokens') {
      const literal = string ?? templateText;
      if (literal && COLOR_LITERAL.test(literal)) report(value, 'error', 'raw-color', `Raw color in ${key}.`, 'use a --os-color-* token');
      else if (string && COLOR_PROPS.test(key) && NAMED_COLORS.test(string.trim())) report(value, 'error', 'raw-color', `Named color "${string}" in ${key}.`, 'use a --os-color-* token');
    }
    // The raw-space, raw-radius, raw-type and raw-shadow rules hold for the library too (its components are on the
    // spacing, radius and type scales since the standard pass); the token files define the values, so they skip them.
    if (profile === 'tokens') return;

    const px = number ?? (string && /^-?\d+(\.\d+)?px$/.test(string.trim()) ? parseFloat(string) : undefined);
    if (SPACING.test(key) && px !== undefined && Math.abs(px) > 1) {
      const token = SPACE[Math.abs(px)];
      report(value, 'error', 'raw-space', `${key}: ${px} is a raw space.`, token ? `t['--os-space-${token}']${px < 0 ? ' (negated with calc)' : ''}` : 'not on the spacing scale (2 4 6 8 12 16 20 24 32 40 48 56): pick a step');
    }
    if (RADIUS.test(key) && px !== undefined && px !== 0) report(value, 'error', 'raw-radius', `${key}: ${px} is a raw radius.`, 'use --os-radius-control for controls, --os-radius-sm…2xl for surfaces');
    if (key === 'fontSize' && px !== undefined) report(value, 'error', 'raw-type', `fontSize: ${px} is a raw size.`, FONT_SIZE[px] ? `t['--os-font-size-${FONT_SIZE[px]}']` : 'not on the type scale: use a --os-font-size-* token');
    if (key === 'fontWeight' && number !== undefined) report(value, 'error', 'raw-type', `fontWeight: ${number} is a raw weight.`, FONT_WEIGHT[number] ? `t['--os-font-weight-${FONT_WEIGHT[number]}']` : 'use a --os-font-weight-* token');
    if (key === 'lineHeight' && px !== undefined && px > 3) report(value, 'error', 'raw-type', `lineHeight: ${px} is a raw line height.`, 'use a --os-line-height-* token');
    if (key === 'boxShadow' && string && string !== 'none') report(value, 'error', 'raw-shadow', 'Raw shadow.', 'use --os-shadow-control or --os-shadow-popup');
  };

  const checkStyleObject = (object, conditions = []) => {
    for (const property of object.properties) {
      if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property)) continue;
      const key = nameOf(property.name);
      if (SHORTHANDS.has(key)) report(property.name, 'error', 'stylex-shorthand', `"${key}" is a shorthand StyleX silently drops.`, 'write longhands (spec 1.0)');
      if (ts.isPropertyAssignment(property)) {
        if (key.startsWith(':') || key.startsWith('@') || key.startsWith('[')) {
          if (ts.isObjectLiteralExpression(property.initializer)) checkStyleObject(property.initializer, [...conditions, key]);
          continue;
        }
        checkValue(key, property.initializer, conditions);
      }
    }
  };

  const visit = node => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const from = node.moduleSpecifier.text;
      if (FOREIGN_UI.test(from)) report(node, 'error', 'foreign-ui', `Imports "${from}", outside the system.`, 'use the Otherstates component, Icon or chart instead; propose a new component if none fits', from);
      else if (app && /\.(css|scss|sass|less)$/.test(from) && !/\/base\.css$/.test(from) && !inLegacyLayer(file, from)) report(node, 'warning', 'raw-css', `Imports a stylesheet (${from}).`, 'style with StyleX on the tokens, or keep global element styles inside @layer legacy', from);
    }
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.expression.getText(source) === 'stylex') {
      const method = node.expression.name.text;
      const [first] = node.arguments;
      if (first && ts.isObjectLiteralExpression(first) && (method === 'create' || method === 'keyframes')) {
        for (const namespace of first.properties) {
          if (!ts.isPropertyAssignment(namespace)) continue;
          let body = namespace.initializer;
          if (ts.isArrowFunction(body)) body = ts.isParenthesizedExpression(body.body) ? body.body.expression : body.body;
          if (ts.isObjectLiteralExpression(body)) checkStyleObject(body);
        }
      }
    }
    if (ts.isJsxAttribute(node) && node.initializer) {
      const name = node.name.getText(source);
      if (name === 'style' && ts.isJsxExpression(node.initializer) && node.initializer.expression && ts.isObjectLiteralExpression(node.initializer.expression)) {
        checkStyleObject(node.initializer.expression);
      }
      if (app && name === 'className' && ts.isStringLiteral(node.initializer) && node.initializer.text.trim()) {
        report(node, 'error', 'utility-class', `className="${node.initializer.text.slice(0, 40)}" styles outside the system.`, 'use stylex.props with tokens, or a component prop');
      }
    }
    if (app && (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ts.isIdentifier(node.tagName)) {
      const tag = node.tagName.text;
      if (NATIVE[tag]) report(node, 'error', 'native-control', `<${tag}> hand-rolls a control the system already has.`, `use <${NATIVE[tag]}>`);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

/** Why a file can only run in the browser: hooks, context, React Aria, event handlers or functions handed to JSX.
 *  Server Components can do none of these, and can't pass functions to a Client Component either. Components
 *  imported from ./internal count too: internals carry no 'use client', so they run wherever they're rendered. */
function clientReasons(source) {
  const reasons = new Set();
  const visit = node => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text.startsWith('.')) {
      const bindings = node.importClause?.isTypeOnly ? undefined : node.importClause?.namedBindings;
      const components = bindings && ts.isNamedImports(bindings) ? bindings.elements.filter(element => !element.isTypeOnly && /^[A-Z]/.test(element.name.text)) : [];
      const target = components.length ? resolveLocal(source.fileName, node.moduleSpecifier.text) : null;
      if (target && /[\\/]internal[\\/]/.test(target) && clientInternal(target)) reasons.add(`client internals (${components.map(element => element.name.text).join(', ')})`);
    }
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) && /^(react-aria-components|react-aria|@react-aria\/|@react-stately\/)/.test(node.moduleSpecifier.text)) {
      const clause = node.importClause;
      const bindings = clause?.namedBindings;
      if (clause && !clause.isTypeOnly && (clause.name || (bindings && (ts.isNamespaceImport(bindings) || bindings.elements.some(element => !element.isTypeOnly))))) reasons.add('React Aria');
    }
    if (ts.isCallExpression(node)) {
      const callee = ts.isIdentifier(node.expression) ? node.expression.text : ts.isPropertyAccessExpression(node.expression) ? node.expression.name.text : '';
      if (/^use[A-Z0-9]/.test(callee)) reasons.add('hooks');
      if (callee === 'createContext') reasons.add('context');
      // Prerendering (Next.js Cache Components) refuses the current time and randomness in a Server Component.
      const owner = ts.isPropertyAccessExpression(node.expression) ? node.expression.expression.getText(source) : '';
      if ((owner === 'Date' && callee === 'now') || (owner === 'Math' && callee === 'random') || (owner === 'crypto' && /^(randomUUID|getRandomValues)$/.test(callee)) || (!owner && callee === 'Date')) reasons.add('the current time or randomness');
    }
    if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'Date' && !node.arguments?.length) reasons.add('the current time or randomness');
    // Its dates are class instances, which can't be passed from a Server Component, and today() reads the clock.
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text === '@internationalized/date') {
      const clause = node.importClause;
      const bindings = clause?.namedBindings;
      if (clause && !clause.isTypeOnly && (clause.name || (bindings && (ts.isNamespaceImport(bindings) || bindings.elements.some(element => !element.isTypeOnly))))) reasons.add('dates from @internationalized/date');
    }
    if (ts.isJsxAttribute(node) && node.initializer && ts.isJsxExpression(node.initializer) && node.initializer.expression) {
      if (/^on[A-Z]/.test(node.name.getText(source))) reasons.add('event handlers');
      else if (holdsFunction(source, node.initializer.expression)) reasons.add('function props');
    }
    if (ts.isJsxSpreadAttribute(node) && holdsFunction(source, node.expression)) reasons.add('function props');
    if (ts.isJsxExpression(node) && node.expression && ts.isJsxElement(node.parent) && holdsFunction(source, node.expression)) reasons.add('function children');
    ts.forEachChild(node, visit);
  };
  visit(source);
  return [...reasons];
}

/** Clock and randomness reads that run while a component renders: in a component's body (a capitalized or
 *  default-exported function), in a useState or useMemo initializer, or at module level. Reads in event handlers,
 *  effects and other callbacks run later, in the browser, and are fine (performance.now() always is). */
function clockReadsInRender(source) {
  const dateNames = new Set();
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier) || statement.moduleSpecifier.text !== '@internationalized/date') continue;
    const bindings = statement.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) for (const element of bindings.elements) if (['today', 'now'].includes((element.propertyName ?? element.name).text)) dateNames.add(element.name.text);
  }
  const isRead = node => {
    if (ts.isNewExpression(node)) return ts.isIdentifier(node.expression) && node.expression.text === 'Date' && !node.arguments?.length;
    if (!ts.isCallExpression(node)) return false;
    const callee = node.expression;
    if (ts.isIdentifier(callee)) return dateNames.has(callee.text) || callee.text === 'Date';
    // @internationalized/date's toDate() builds its Date with new Date(), which Next.js counts as a clock read.
    if (ts.isPropertyAccessExpression(callee) && callee.name.text === 'toDate') return true;
    return ts.isPropertyAccessExpression(callee) && ts.isIdentifier(callee.expression)
      && ((callee.expression.text === 'Date' && callee.name.text === 'now') || (callee.expression.text === 'Math' && callee.name.text === 'random')
        || (callee.expression.text === 'crypto' && /^(randomUUID|getRandomValues)$/.test(callee.name.text)));
  };
  const found = [];
  const visit = node => {
    if (isRead(node) && renderTime(node)) found.push(node);
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

/** Whether code at `node` runs as the module loads or as a component renders: at module level, in a component's
 *  body (a capitalized or default-exported function) or in a useState/useMemo initializer. Event handlers, effects
 *  and other callbacks run later, in the browser. */
function renderTime(node) {
  let fn = node.parent;
  while (fn && !ts.isFunctionLike(fn)) fn = fn.parent;
  if (!fn) return true;
  const named = name => /^[A-Z]/.test(name) || /^use[A-Z0-9]/.test(name);
  if (ts.isArrowFunction(fn) || ts.isFunctionExpression(fn)) {
    const call = fn.parent;
    if (ts.isCallExpression(call)) {
      const callee = ts.isIdentifier(call.expression) ? call.expression.text : ts.isPropertyAccessExpression(call.expression) ? call.expression.name.text : '';
      // A hook's initializer runs as the component renders (useReducer's is its third argument).
      if (['useState', 'useMemo'].includes(callee) && call.arguments[0] === fn) return true;
      if (callee === 'useReducer' && call.arguments[2] === fn) return true;
      // memo(() => …) and forwardRef(…) wrap components; items.map(item => …) runs where it is called.
      if (['memo', 'forwardRef'].includes(callee)) return true;
      if (EAGER_CALLBACKS.has(callee) && call.arguments.includes(fn)) return renderTime(call);
    }
    // An inline call: (() => …)().
    if (ts.isParenthesizedExpression(call) && ts.isCallExpression(call.parent) && call.parent.expression === call) return renderTime(call.parent);
    const declaration = fn.parent;
    if (ts.isVariableDeclaration(declaration) && ts.isIdentifier(declaration.name)) {
      if (named(declaration.name.text) && ts.isSourceFile(declaration.parent.parent.parent)) return true;
      // A helper declared inside a component and called in its body runs while it renders.
      const outer = enclosingRenderFunction(declaration);
      if (outer && calledIn(outer, declaration.name.text)) return true;
    }
    return false;
  }
  if (ts.isFunctionDeclaration(fn)) {
    if (ts.isSourceFile(fn.parent)) {
      const isDefault = ts.getModifiers(fn)?.some(modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword);
      return isDefault || named(fn.name?.text ?? '');
    }
    const outer = enclosingRenderFunction(fn);
    return !!(outer && fn.name && calledIn(outer, fn.name.text));
  }
  return false;
}

/** The function enclosing `node`, when that function runs as a component renders. */
function enclosingRenderFunction(node) {
  let fn = node.parent;
  while (fn && !ts.isFunctionLike(fn)) fn = fn.parent;
  if (!fn || !fn.body) return null;
  return renderTime(fn.body) ? fn : null;
}

/** Whether `name` is called in `fn`'s own body, outside nested functions. */
function calledIn(fn, name) {
  let found = false;
  const visit = node => {
    if (found || ts.isFunctionLike(node)) return;
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === name) { found = true; return; }
    ts.forEachChild(node, visit);
  };
  if (fn.body) ts.forEachChild(fn.body, visit);
  return found;
}

/** Browser-only globals touched where a server runs them too (see renderTime). A typeof check guards them. */
function browserGlobalsInRender(source) {
  const guarded = node => {
    for (let at = node.parent; at && !ts.isFunctionLike(at) && !ts.isSourceFile(at); at = at.parent) {
      const test = ts.isIfStatement(at) ? at.expression : ts.isConditionalExpression(at) ? at.condition
        : ts.isBinaryExpression(at) && [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(at.operatorToken.kind) ? at.left : null;
      if (test && new RegExp(`typeof\\s+(${[...BROWSER_GLOBALS].join('|')})\\b`).test(test.getText(source))) return true;
    }
    return false;
  };
  const found = [];
  const declared = name => !!findDeclaration(source, name) || hasBinding(source, name);
  const visit = node => {
    // Types, interfaces and type aliases never run.
    if (ts.isTypeNode(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) return;
    if (ts.isIdentifier(node) && BROWSER_GLOBALS.has(node.text)) {
      const parent = node.parent;
      const isName = (ts.isPropertyAccessExpression(parent) && parent.name === node) || ts.isJsxAttribute(parent)
        || ((ts.isPropertyAssignment(parent) || ts.isPropertySignature(parent) || ts.isPropertyDeclaration(parent) || ts.isMethodDeclaration(parent)
          || ts.isEnumMember(parent) || ts.isGetAccessor(parent) || ts.isSetAccessor(parent) || ts.isVariableDeclaration(parent)
          || ts.isParameter(parent) || ts.isBindingElement(parent) || ts.isFunctionDeclaration(parent)) && parent.name === node)
        || ts.isImportSpecifier(parent) || ts.isImportClause(parent) || ts.isNamespaceImport(parent) || ts.isExportSpecifier(parent)
        || ts.isTypeOfExpression(parent) || ts.isQualifiedName(parent);
      if (!isName && !declared(node.text) && renderTime(node) && !guarded(node)) found.push(node);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

/** Whether the file binds `name` itself (a parameter or destructured name), so it isn't the browser global. */
function hasBinding(source, name) {
  let found = false;
  const visit = node => {
    if (found) return;
    if ((ts.isParameter(node) || ts.isBindingElement(node)) && ts.isIdentifier(node.name) && node.name.text === name) { found = true; return; }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

/** Whether a JSX value hands over a function: directly, inside object or array literals (actions={[{ onAction }]}),
 *  or through a constant declared in the same file. Calls are not followed: items.map(item => …) runs here. */
function holdsFunction(source, expression, seen = new Set()) {
  const walk = node => {
    if (!node) return false;
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node) || ts.isMethodDeclaration(node)) return true;
    if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isNonNullExpression(node) || ts.isSpreadElement(node) || ts.isSpreadAssignment(node)) return walk(node.expression);
    if (ts.isConditionalExpression(node)) return walk(node.whenTrue) || walk(node.whenFalse);
    if (ts.isBinaryExpression(node)) return walk(node.left) || walk(node.right);
    if (ts.isArrayLiteralExpression(node)) return node.elements.some(walk);
    if (ts.isObjectLiteralExpression(node)) return node.properties.some(property => ts.isPropertyAssignment(property) ? walk(property.initializer) : walk(property));
    if (ts.isShorthandPropertyAssignment(node)) return walk(node.name);
    if (ts.isIdentifier(node) && !seen.has(node.text)) {
      seen.add(node.text);
      const declaration = findDeclaration(source, node.text);
      if (!declaration) return importsFunction(source, node.text);
      if (ts.isFunctionDeclaration(declaration)) return true;
      return walk(declaration.initializer);
    }
    return false;
  };
  return walk(expression);
}

/** Whether `name` is a function imported from a local module (formatCost from the components barrel, say). */
function importsFunction(source, name) {
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier) || !statement.moduleSpecifier.text.startsWith('.')) continue;
    const bindings = statement.importClause?.isTypeOnly ? undefined : statement.importClause?.namedBindings;
    const element = bindings && ts.isNamedImports(bindings) ? bindings.elements.find(item => !item.isTypeOnly && item.name.text === name) : undefined;
    if (!element) continue;
    const target = resolveLocal(source.fileName, statement.moduleSpecifier.text);
    return target ? exportsFunction(target, (element.propertyName ?? element.name).text, 0) : false;
  }
  return false;
}

function exportsFunction(file, name, depth) {
  if (depth > 3) return false;
  if (!parsed.has(file)) parsed.set(file, ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS));
  for (const statement of parsed.get(file).statements) {
    const exported = ts.canHaveModifiers(statement) && ts.getModifiers(statement)?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
    if (exported && ts.isFunctionDeclaration(statement) && statement.name?.text === name) return true;
    if (exported && ts.isVariableStatement(statement)) {
      const declaration = statement.declarationList.declarations.find(item => ts.isIdentifier(item.name) && item.name.text === name);
      if (declaration) return !!declaration.initializer && (ts.isArrowFunction(declaration.initializer) || ts.isFunctionExpression(declaration.initializer));
    }
    if (ts.isExportDeclaration(statement) && !statement.isTypeOnly && statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
      const named = statement.exportClause && ts.isNamedExports(statement.exportClause) ? statement.exportClause.elements.find(item => item.name.text === name) : undefined;
      if (statement.exportClause && !named) continue;
      const target = resolveLocal(file, statement.moduleSpecifier.text);
      if (target && exportsFunction(target, named ? (named.propertyName ?? named.name).text : name, depth + 1)) return true;
    }
  }
  return false;
}

/** A const, let or function of this name declared anywhere in the file (scopes aren't told apart). */
function findDeclaration(source, name) {
  let found = null;
  const visit = node => {
    if (found) return;
    if ((ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === name && node.initializer) || (ts.isFunctionDeclaration(node) && node.name?.text === name)) { found = node; return; }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

function resolveLocal(from, specifier) {
  const base = path.resolve(path.dirname(from), specifier.replace(/\.(tsx?|jsx?)$/, ''));
  return ['.tsx', '.ts', '/index.tsx', '/index.ts'].map(ext => base + ext).find(candidate => fs.existsSync(candidate)) ?? null;
}

function clientInternal(file) {
  if (!internalReasons.has(file)) {
    internalReasons.set(file, false); // a cycle back to this file adds nothing
    const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    internalReasons.set(file, clientReasons(source).length > 0);
  }
  return internalReasons.get(file);
}

/** Every value (not type) a module exports by name, with the node that names it. */
function valueExports(source) {
  const names = [];
  for (const statement of source.statements) {
    const exported = ts.canHaveModifiers(statement) && ts.getModifiers(statement)?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
    const isDefault = exported && ts.getModifiers(statement)?.some(modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword);
    if (exported && !isDefault && (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) && statement.name) names.push([statement.name, statement.name.text]);
    if (exported && ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) if (ts.isIdentifier(declaration.name)) names.push([declaration.name, declaration.name.text]);
    }
    if (ts.isExportDeclaration(statement) && !statement.isTypeOnly && !statement.moduleSpecifier && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) if (!element.isTypeOnly) names.push([element, element.name.text]);
    }
  }
  return names;
}

/** A stylesheet with no unlayered rules can't override the system: its rules sit in @layer legacy (the installer
 *  puts app CSS there) or another layer, and the rest is imports into layers, Tailwind 4's configuration or the
 *  @stylex line. */
function inLegacyLayer(file, from) {
  if (!from.startsWith('.')) return false;
  const sheet = path.resolve(path.dirname(file), from);
  if (!fs.existsSync(sheet)) return false;
  const css = fs.readFileSync(sheet, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const statements = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < css.length; i += 1) {
    if (css[i] === '"' || css[i] === "'") { const quote = css[i]; for (i += 1; i < css.length && css[i] !== quote; i += 1) if (css[i] === '\\') i += 1; continue; }
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}') { depth -= 1; if (depth === 0) { statements.push(css.slice(start, i + 1).trim()); start = i + 1; } }
    else if (css[i] === ';' && depth === 0) { statements.push(css.slice(start, i + 1).trim()); start = i + 1; }
  }
  if (css.slice(start).trim()) statements.push(css.slice(start).trim());
  return statements.filter(Boolean).every(statement =>
    // A relative import of the app's own CSS needs a layer; a package's stylesheet styles its own classes.
    /^@import\s/.test(statement) ? /layer\(/.test(statement) || !/^@import\s+(url\(\s*)?["']?\./.test(statement)
      : /^@(layer|theme|plugin|source|config|custom-variant|variant|utility|font-face|property|keyframes|charset|stylex)\b/.test(statement));
}

function nameOf(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  if (ts.isComputedPropertyName(name)) {
    const inner = name.expression;
    if (ts.isStringLiteral(inner)) return inner.text;
    return `[${inner.getText()}]`;
  }
  return name.getText();
}

function numberOf(node) {
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(node.operand)) return -Number(node.operand.text);
  return undefined;
}

// The agent tools parse with TypeScript's compiler API. TypeScript 7 (the native compiler new projects get) has
// no JavaScript API, so the kit installs TypeScript 5 under a private name and the tools prefer it.
function loadTypeScript(require) {
  for (const name of ['@otherstates/typescript', 'typescript']) {
    try { const ts = require(name); if (typeof ts.createSourceFile === 'function') return ts; } catch { /* try the next */ }
  }
  console.error('Otherstates UI tools need the TypeScript 5 compiler API. Install it with:\n  npm install -D "@otherstates/typescript@npm:typescript@5.9.3"');
  process.exit(1);
}
