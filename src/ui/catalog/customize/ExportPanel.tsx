import { useMemo, useState } from 'react';
import { Collapsible, SegmentedControl, Select, Switch, Tabs } from '../../components';
import { cssVariables, dtcgTokens, patchTokenSources, recipeSnippet, themeFile, type CssOptions } from '../../customize';
import { CodeBlock } from '../CodeBlock';
import { Heading } from '../PageParts';
import { BASE_VALUES, SOURCES, labelOf, useRecipe } from './RecipeProvider';

// "Get the code": four ways to take the theme home, each a static literal that StyleX
// accepts. Every code block is the docs' own CodeBlock, so each one copies.

const path = 'docs/customize';
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

/** A code block with its file name above it; the name also labels the block's copy button. */
function File({ name, code, text = false }: { name: string; code: string; text?: boolean }) {
  return (
    <figure className="cz-file">
      <figcaption className="cz-file-name">{name}</figcaption>
      <CodeBlock code={code} language={text ? 'text' : 'tsx'} label={name} />
    </figure>
  );
}

function EditFiles() {
  const { theme } = useRecipe();
  const patch = useMemo(() => patchTokenSources(theme, SOURCES), [theme]);
  const { light, dark } = patch.changed;
  const label = labelOf(theme.recipe);

  if (theme.identity) {
    return <p className="cz-export-lead">Nothing to change: this is the shipped theme.</p>;
  }
  return (
    <div className="cz-export-body">
      <p className="cz-export-lead">
        {label} changes {plural(light.length, 'light token')} and {plural(dark.length, 'dark token')}. Replace both files with these
        versions; comments and order stay as they were.
      </p>
      <Collapsible title="Show the changes" variant="plain">
        <ul className="cz-changes">
          {[...light.map(change => ({ ...change, scheme: 'Light' })), ...dark.map(change => ({ ...change, scheme: 'Dark' }))].map(change => (
            <li key={`${change.scheme}${change.token}`}>
              <span className="cz-change-scheme">{change.scheme}</span>
              <code>{change.token}</code>
              <span className="cz-num">{change.from ?? 'new'} → {change.to}</span>
            </li>
          ))}
        </ul>
      </Collapsible>
      <File name="tokens.stylex.ts" code={patch.tokens} />
      <File name="theme.ts" code={patch.theme} />
    </div>
  );
}

function ThemeFile() {
  const { theme } = useRecipe();
  const code = useMemo(() => themeFile(theme, { base: BASE_VALUES, themeSrc: SOURCES.themeSrc }), [theme]);
  return (
    <div className="cz-export-body">
      <p className="cz-export-lead">
        Keep the library files as they ship and add this one. Put its light or dark class on <code>&lt;html&gt;</code> in place of{' '}
        <code>darkTheme</code>, never together with it.
      </p>
      <File name="otherstates-theme.ts" code={code} />
    </div>
  );
}

const darkOptions = [
  { id: 'attribute', label: '[data-theme="dark"]' },
  { id: 'class', label: '.dark' },
  { id: 'media', label: 'prefers-color-scheme' },
];

function CssFile() {
  const { theme } = useRecipe();
  const [dark, setDark] = useState<NonNullable<CssOptions['dark']>>('attribute');
  const [full, setFull] = useState(false);
  const code = useMemo(() => cssVariables(theme, { dark, light: full ? 'full' : 'owned' }), [theme, dark, full]);
  return (
    <div className="cz-export-body">
      <p className="cz-export-lead">Plain custom properties for any stack. Load them after <code>base.css</code>, instead of the dark theme class.</p>
      <div className="cz-export-options">
        <Select label="Dark selector" value={dark} options={darkOptions} onChange={value => { if (value) setDark(value as NonNullable<CssOptions['dark']>); }} />
        <Switch size="sm" label="Every token in the light block" isSelected={full} onChange={setFull} />
      </div>
      <File name="otherstates-theme.css" code={code} text />
    </div>
  );
}

function RecipeFile() {
  const { theme } = useRecipe();
  const [format, setFormat] = useState('recipe');
  const snippet = useMemo(() => recipeSnippet(theme), [theme]);
  const light = useMemo(() => (format === 'tokens' ? dtcgTokens(theme, 'light') : ''), [theme, format]);
  const dark = useMemo(() => (format === 'tokens' ? dtcgTokens(theme, 'dark') : ''), [theme, format]);
  return (
    <div className="cz-export-body">
      <SegmentedControl
        label="Format"
        value={format}
        onChange={setFormat}
        options={[{ value: 'recipe', label: 'Recipe' }, { value: 'tokens', label: 'Design tokens' }]}
      />
      {format === 'recipe' ? (
        <>
          <p className="cz-export-lead">
            The recipe is all a theme needs. Derive it at runtime with the customize module, which also checks every value.
          </p>
          <File name="theme-recipe.ts" code={snippet} />
        </>
      ) : (
        <>
          <p className="cz-export-lead">Both schemes in the design tokens format, for design tools. Every token names its CSS variable.</p>
          <File name="otherstates.light.tokens.json" code={light} text />
          <File name="otherstates.dark.tokens.json" code={dark} text />
        </>
      )}
    </div>
  );
}

export function ExportPanel() {
  return (
    <>
      <Heading level={2} id="get-the-code" path={path}>Get the code</Heading>
      <p>
        Each version holds static values, as StyleX requires, and starts with a comment that names the theme. Paste that line into
        Open a saved theme to come back to it.
      </p>
      <div className="cz-export" data-docs-raw="">
        <Tabs
          label="Export format"
          items={[
            { id: 'files', label: 'Edit your files', content: <EditFiles /> },
            { id: 'theme', label: 'Theme file', content: <ThemeFile /> },
            { id: 'css', label: 'CSS', content: <CssFile /> },
            { id: 'recipe', label: 'Recipe', content: <RecipeFile /> },
          ]}
        />
      </div>
    </>
  );
}
