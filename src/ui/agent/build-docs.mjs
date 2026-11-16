#!/usr/bin/env node
// Generates the agent-facing catalog from the source of truth, so it can never drift from the code:
//   src/ui/agent/manifest.json        every component (exports, props, examples, a11y), token, template and spec section
//   src/ui/agent/components/<id>.md   one page per component, with the full code of every example
//   src/ui/agent/tokens.md            every token with its light and dark value
//   llms.txt                          the index, in llms.txt format, at the project root
//
//   node src/ui/agent/build-docs.mjs          write the files
//   node src/ui/agent/build-docs.mjs --check  exit 1 if they are out of date (for CI and pre-commit)
//
// Reads the docs pages (catalog/docs/<id>/index.ts), the template registry, tokens.stylex.ts, theme.ts and
// DESIGN_SPEC.md as text; nothing is executed, so it needs no bundler.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const ui = path.resolve(here, '..');
// The project root is the nearest folder with a package.json, so the system can live anywhere (src/ui, app/ui…).
let root = path.dirname(ui);
while (!fs.existsSync(path.join(root, 'package.json')) && root !== path.dirname(root)) root = path.dirname(root);
// This repo keeps docs pages and templates under catalog/ (the docs site); an installed product has them
// directly under the system root.
const docsDir = fs.existsSync(path.join(ui, 'catalog/docs')) ? path.join(ui, 'catalog/docs') : path.join(ui, 'docs');
const templatesDir = fs.existsSync(path.join(ui, 'catalog/templates')) ? path.join(ui, 'catalog/templates') : path.join(ui, 'templates');
const require = createRequire(path.join(root, 'package.json'));
const ts = loadTypeScript(require);
const checkOnly = process.argv.includes('--check');

const read = file => fs.readFileSync(file, 'utf8');
const rel = file => path.relative(root, file).split(path.sep).join('/');
const uiRel = rel(ui);

// ---------- Docs pages -> components ----------
const components = fs.readdirSync(docsDir)
  .filter(id => fs.existsSync(path.join(docsDir, id, 'index.ts')))
  .sort()
  .map(id => parseDoc(path.join(docsDir, id, 'index.ts')));

function parseDoc(file) {
  const source = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const imports = new Map();
  let doc;
  const visit = node => {
    if (ts.isImportDeclaration(node) && node.importClause?.name && ts.isStringLiteral(node.moduleSpecifier)) {
      imports.set(node.importClause.name.text, node.moduleSpecifier.text);
    }
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'defineDoc' && node.arguments[0]) doc = literal(node.arguments[0], imports, file);
    ts.forEachChild(node, visit);
  };
  visit(source);
  if (!doc) throw new Error(`No defineDoc() in ${rel(file)}`);
  doc.examples = (doc.examples ?? []).map(example => {
    const spec = example.code?.$import;
    const exampleFile = spec ? path.resolve(path.dirname(file), spec.replace(/\?raw$/, '')) : null;
    return {
      id: example.id, title: example.title, description: example.description,
      file: exampleFile ? rel(exampleFile) : undefined,
      code: exampleFile && fs.existsSync(exampleFile) ? read(exampleFile).trimEnd() : undefined,
    };
  });
  return doc;
}

/** A TS object literal as plain data. Identifiers bound to imports become { $import: specifier }. */
function literal(node, imports, file) {
  if (ts.isObjectLiteralExpression(node)) {
    const out = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const key = property.name.getText().replace(/^['"]|['"]$/g, '');
      const value = literal(property.initializer, imports, file);
      if (value !== undefined) out[key] = value;
    }
    return out;
  }
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(element => literal(element, imports, file)).filter(value => value !== undefined);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isTemplateExpression(node)) return node.getText().slice(1, -1);
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isIdentifier(node) && imports.has(node.text)) return { $import: imports.get(node.text) };
  return undefined;
}

// ---------- Templates ----------
const templateFile = path.join(templatesDir, 'registry.ts');
const templates = [];
if (fs.existsSync(templateFile)) {
  const source = ts.createSourceFile(templateFile, read(templateFile), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const visit = node => {
    if (ts.isVariableDeclaration(node) && node.name.getText() === 'templates' && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      for (const element of node.initializer.elements) {
        const data = literal(element, new Map(), templateFile);
        templates.push({ id: data.id, title: data.title, summary: data.summary, description: data.description, components: data.components, file: rel(path.join(templatesDir, data.id, 'index.tsx')) });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

// ---------- Tokens ----------
function parseTokens(file) {
  const out = {};
  let note = [];
  for (const line of read(file).split('\n')) {
    const comment = line.match(/^\s*\/\/\s?(.*)$/);
    if (comment) { note.push(comment[1]); continue; }
    const entry = line.match(/^\s*"(--os-[a-z0-9-]+)":\s*"([^"]*)"/);
    if (entry) { out[entry[1]] = { value: entry[2], note: note.join(' ').trim() || undefined }; note = []; continue; }
    if (line.trim() === '') note = [];
  }
  return out;
}
const light = parseTokens(path.join(ui, 'tokens.stylex.ts'));
const dark = parseTokens(path.join(ui, 'theme.ts'));
const tokenGroups = {};
for (const [name, { value, note }] of Object.entries(light)) {
  const group = name.replace(/^--os-/, '').replace(/^(color-chart|color|space|radius|font-size|font-weight|font-family|line-height|shadow|motion|ease|z|size|tracking|stroke).*$/, '$1');
  const known = /^(color-chart|color|space|radius|font-size|font-weight|font-family|line-height|shadow|motion|ease|z|size|tracking|stroke)$/.test(group) ? group : 'other';
  (tokenGroups[known] ??= []).push({ name, light: value, dark: dark[name]?.value, note });
}

// ---------- Spec ----------
const specFile = path.join(ui, 'DESIGN_SPEC.md');
const spec = read(specFile).split('\n')
  .map((line, index) => ({ line: index + 1, match: line.match(/^###\s+(\d+\.\d+)\s+(.*)$/) }))
  .filter(item => item.match)
  .map(item => ({ section: item.match[1], title: item.match[2], line: item.line }));

// ---------- Write ----------
const pkg = JSON.parse(read(path.join(root, 'package.json')));
const manifest = {
  name: 'Otherstates UI',
  version: pkg.version,
  generatedBy: `${uiRel}/agent/build-docs.mjs — do not edit by hand`,
  importFrom: '@/ui/components',
  rules: `${uiRel}/AGENTS.md`,
  spec: { file: `${uiRel}/DESIGN_SPEC.md`, sections: spec },
  components: components.map(doc => ({
    id: doc.id, title: doc.title, category: doc.category, description: doc.description, exports: doc.exports,
    doc: `${uiRel}/agent/components/${doc.id}.md`, source: (doc.source ?? []).map(file => `${uiRel}/${file}`), usage: doc.usage,
    examples: doc.examples.map(({ id, title, description, file }) => ({ id, title, description, file })),
    api: doc.api, accessibility: doc.accessibility,
  })),
  templates,
  tokens: { doc: `${uiRel}/agent/tokens.md`, groups: tokenGroups },
};

const outputs = new Map();
outputs.set(path.join(here, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
for (const doc of components) outputs.set(path.join(here, 'components', `${doc.id}.md`), componentPage(doc));
outputs.set(path.join(here, 'tokens.md'), tokensPage());
outputs.set(path.join(root, 'llms.txt'), llmsTxt());

let stale = 0;
const expected = new Set(outputs.keys());
for (const [file, content] of outputs) {
  const current = fs.existsSync(file) ? read(file) : null;
  if (current === content) continue;
  stale += 1;
  if (!checkOnly) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); }
}
// Pages for components that no longer exist.
const pageDir = path.join(here, 'components');
for (const name of fs.existsSync(pageDir) ? fs.readdirSync(pageDir) : []) {
  const file = path.join(pageDir, name);
  if (expected.has(file)) continue;
  stale += 1;
  if (!checkOnly) fs.rmSync(file);
}
// A docs page with a TODO left in it (from the scaffold) is not finished: the catalog would teach it.
const unfinished = components.filter(doc => JSON.stringify(doc).includes('TODO')).map(doc => doc.id);
if (unfinished.length) { console.error(`Docs pages with a TODO left: ${unfinished.join(', ')}`); if (checkOnly) process.exitCode = 1; }
if (checkOnly && stale) { console.error(`Agent docs are out of date (${stale} file(s)). Run: node ${uiRel}/agent/build-docs.mjs`); process.exitCode = 1; }
else console.log(`${checkOnly ? 'Agent docs up to date' : `Wrote agent docs (${stale} changed)`} · ${components.length} components · ${templates.length} templates · ${Object.keys(light).length} tokens`);

function componentPage(doc) {
  const out = [];
  out.push(`# ${doc.title}`, '', `${doc.description}`, '', `Category: ${doc.category} · Exports: ${doc.exports.map(name => `\`${name}\``).join(', ')}`, '');
  out.push(`Generated from the docs page by ${uiRel}/agent/build-docs.mjs. Rules: ${uiRel}/AGENTS.md.`, '');
  out.push('## Usage', '', '```tsx', doc.usage.trim(), '```', '');
  for (const part of doc.api ?? []) {
    out.push(`## ${part.name}`, '');
    if (part.description) out.push(part.description, '');
    if (part.extends) out.push(`Extends: ${part.extends}`, '');
    if (part.props?.length) {
      out.push('| Prop | Type | Default | Description |', '| --- | --- | --- | --- |');
      for (const prop of part.props) {
        out.push(`| \`${prop.name}\`${prop.required ? ' (required)' : ''} | \`${String(prop.type).replace(/\|/g, '\\|')}\` | ${prop.default ? `\`${prop.default}\`` : ''} | ${String(prop.description).replace(/\|/g, '\\|')} |`);
      }
      out.push('');
    }
  }
  if (doc.accessibility?.length) out.push('## Accessibility', '', ...doc.accessibility.map(item => `- ${item}`), '');
  out.push('## Examples', '');
  for (const example of doc.examples) {
    out.push(`### ${example.title}`, '');
    if (example.description) out.push(example.description, '');
    if (example.code) out.push(`\`${example.file}\``, '', '```tsx', example.code, '```', '');
  }
  return out.join('\n').trimEnd() + '\n';
}

function tokensPage() {
  const out = ['# Tokens', '', 'Every value in Otherstates UI. Reference them as `t[\'--os-…\']` after `import { tokens as t } from \'@/ui/tokens.stylex\'`.', `Dark values come from theme.ts; a blank dark cell means the light value applies. Generated by ${uiRel}/agent/build-docs.mjs.`, ''];
  for (const [group, list] of Object.entries(tokenGroups)) {
    out.push(`## ${group}`, '', '| Token | Light | Dark | Note |', '| --- | --- | --- | --- |');
    for (const token of list) out.push(`| \`${token.name}\` | \`${token.light}\` | ${token.dark ? `\`${token.dark}\`` : ''} | ${(token.note ?? '').replace(/\|/g, '\\|')} |`);
    out.push('');
  }
  return out.join('\n').trimEnd() + '\n';
}

function llmsTxt() {
  const out = ['# Otherstates UI', '', `> A React design system on StyleX tokens and React Aria. Agents compose these components and tokens only: read ${uiRel}/AGENTS.md first, look up a component here before building one, and run \`node ${uiRel}/agent/check.mjs\` before finishing.`, ''];
  out.push('## Rules', '', `- [Agent guide](${uiRel}/AGENTS.md): the workflow and the rules every change follows`, `- [Design spec](${uiRel}/DESIGN_SPEC.md): the source of truth for every pixel decision`, `- [Tokens](${uiRel}/agent/tokens.md): every color, space, radius, type and motion value`, `- [Manifest](${uiRel}/agent/manifest.json): all of the above as JSON`, '');
  const byCategory = {};
  for (const doc of components) (byCategory[doc.category] ??= []).push(doc);
  for (const [category, list] of Object.entries(byCategory).sort()) {
    out.push(`## ${category}`, '');
    for (const doc of list) out.push(`- [${doc.title}](${uiRel}/agent/components/${doc.id}.md): ${doc.description}`);
    out.push('');
  }
  out.push('## Templates', '', ...templates.map(template => `- [${template.title}](${template.file}): ${template.summary}`), '');
  return out.join('\n').trimEnd() + '\n';
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
