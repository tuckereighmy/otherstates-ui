import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, SegmentedControl, Select } from '../../components';
import { tokens } from '../../tokens.stylex';
import { CodeBlock } from '../CodeBlock';
import { Heading } from '../PageParts';
import { pageHref } from '../route';
import { useRecipe } from '../customize/RecipeProvider';
import { pagesById } from './registry';
import { Caption, tokenNames, useThemeName, useTokens } from './shared';

// The body of #docs/styling. The shell renders the title and the description above it.

const path = 'docs/styling';

// A real theme, made the way a reader would make one. The demo below applies it to one panel.
// Its values are written out again in `themeCode`; keep the two the same.
const squareTheme = stylex.createTheme(tokens, {
  '--os-radius-sm': '3px',
  '--os-radius-md': '5px',
  '--os-radius-lg': '8px',
  '--os-radius-xl': '10px',
  '--os-color-accent-moderate': 'var(--os-color-fg-info)',
  '--os-color-accent-bold': 'color-mix(in oklab, var(--os-color-fg-info) 88%, var(--os-color-fg-base))',
  '--os-color-accent-strong': 'color-mix(in oklab, var(--os-color-fg-info) 76%, var(--os-color-fg-base))',
});

const themeCode = `import * as stylex from '@stylexjs/stylex';
import { tokens } from '@/ui/tokens.stylex';

// Tighter corners, and the info blue as the accent.
export const squareTheme = stylex.createTheme(tokens, {
  '--os-radius-sm': '3px',
  '--os-radius-md': '5px',
  '--os-radius-lg': '8px',
  '--os-radius-xl': '10px',
  '--os-color-accent-moderate': 'var(--os-color-fg-info)',
  '--os-color-accent-bold':
    'color-mix(in oklab, var(--os-color-fg-info) 88%, var(--os-color-fg-base))',
  '--os-color-accent-strong':
    'color-mix(in oklab, var(--os-color-fg-info) 76%, var(--os-color-fg-base))',
});

// Anywhere in your app:
<div {...stylex.props(squareTheme)}>…</div>`;

const useCode = `import * as stylex from '@stylexjs/stylex';
import { tokens } from '@/ui/tokens.stylex';

const styles = stylex.create({
  panel: {
    padding: tokens['--os-space-4'],
    borderRadius: tokens['--os-radius-lg'],
    backgroundColor: tokens['--os-color-bg-subtle'],
    color: tokens['--os-color-fg-base'],
  },
});`;

const cssCode = `/* The same variables, in plain CSS */
.panel {
  padding: var(--os-space-4);
  border-radius: var(--os-radius-lg);
  background: var(--os-color-bg-subtle);
}`;

const classCode = `/* app.css: outside any layer, so it ranks above the components' styles */
.checkout-button { min-width: 160px; }

<Button className="checkout-button">Pay now</Button>`;

const motionCode = `const styles = stylex.create({
  panel: {
    transitionProperty: 'opacity, transform',
    transitionDuration: {
      default: tokens['--os-motion-popup'],
      '@media (prefers-reduced-motion: reduce)': '0ms',
    },
    transitionTimingFunction: tokens['--os-ease-settle'],
  },
});`;

// What each part of the contract covers, by name prefix, and the Foundations page that shows it.
// The page titles come from the page registry; the counts come from the contract itself.
const groups = [
  { page: 'colors', prefixes: ['--os-color-', '--os-button-', '--os-gradient-'] },
  { page: 'typography', prefixes: ['--os-font-'] },
  { page: 'spacing-and-sizing', prefixes: ['--os-space-', '--os-size-', '--os-stroke'] },
  { page: 'radius', prefixes: ['--os-radius-'] },
  { page: 'elevation', prefixes: ['--os-shadow-', '--os-focus-'] },
  { page: 'motion', prefixes: ['--os-motion-', '--os-ease-'] },
];

const inGroup = (name: string, prefixes: string[]) => prefixes.some(prefix => name.startsWith(prefix));

const roles = [
  { id: 'viewer', label: 'Viewer' },
  { id: 'editor', label: 'Editor' },
  { id: 'owner', label: 'Owner' },
];

const ranges = ['Day', 'Week', 'Month'].map(range => ({ value: range, label: range }));

function ThemeSample({ name }: { name: string }) {
  const [role, setRole] = useState<string | null>('editor');
  return (
    <>
      <Select label={`Role (${name})`} hideLabel options={roles} value={role} onChange={setRole} />
      <SegmentedControl label={`Range (${name})`} defaultValue="Week" options={ranges} />
      <div className="pg-theme-row">
        <Button size="medium" appearance="secondary">Cancel</Button>
        <Button size="medium">Publish</Button>
      </div>
    </>
  );
}

const squareClass = stylex.props(squareTheme).className ?? '';

export default function Styling() {
  const values = useTokens();
  const theme = useThemeName();
  const { customized, showOriginal } = useRecipe();
  const recipeOn = customized && !showOriginal;
  // Anything the groups above do not cover still gets a row, so the counts always add up.
  const uncovered = tokenNames.filter(name => !groups.some(group => inGroup(name, group.prefixes)));
  // The excerpt is built from the live values, so it always matches tokens.stylex.ts.
  const excerptNames = ['--os-radius-md', '--os-space-4', '--os-font-size-sm', '--os-motion-press'].filter(name => tokenNames.includes(name));
  const excerpt = `import * as stylex from '@stylexjs/stylex';

export const tokens = stylex.defineVars({
${excerptNames.map(name => `  '${name}': '${values.value(name)}',`).join('\n')}
  // …and every other token in the contract
});`;

  return (
    <>
      <Heading level={2} id="tokens" path={path}>The token contract</Heading>
      <p>
        <code>tokens.stylex.ts</code> calls <code>stylex.defineVars</code> once. Each key is a CSS custom property and each value is
        its default, which is the light theme. The keys start with <code>--</code>, so StyleX keeps those exact names, and the same
        variables work in plain CSS.
      </p>
      <CodeBlock code={excerpt} label="tokens.stylex.ts, an excerpt" />
      <p>
        Components get their colors, typeface, corner radii, shadows and shared timings from these tokens. Measurements and motion
        that belong to one component, like the length of a switch track or the feel of a spring, stay in its file. Your own styles
        can read the same tokens.
      </p>
      <CodeBlock code={useCode} label="Using tokens in StyleX" />
      <CodeBlock code={cssCode} language="text" label="Using tokens in CSS" />

      <p>The contract by name prefix, with the page that shows each part of it:</p>
      <table>
        <thead>
          <tr><th>Page</th><th>Prefix</th><th>Tokens</th></tr>
        </thead>
        <tbody>
          {groups.map(group => (
            <tr key={group.page}>
              <th scope="row"><a href={pageHref(group.page)}>{pagesById.get(group.page)?.title ?? group.page}</a></th>
              <td><span className="pg-prefixes">{group.prefixes.map(prefix => <code key={prefix}>{prefix}</code>)}</span></td>
              <td className="pg-num">{tokenNames.filter(name => inGroup(name, group.prefixes)).length}</td>
            </tr>
          ))}
          {uncovered.length > 0 && (
            <tr>
              <th scope="row">Other</th>
              <td><span className="pg-prefixes">{uncovered.map(name => <code key={name}>{name}</code>)}</span></td>
              <td className="pg-num">{uncovered.length}</td>
            </tr>
          )}
        </tbody>
      </table>

      <Heading level={2} id="themes" path={path}>Themes</Heading>
      <p>
        <code>stylex.createTheme</code> takes the contract and new values for any of its tokens, and returns a class. Put the class
        on an element and everything inside it uses the new values. <code>darkTheme</code> is made this way.
      </p>
      <CodeBlock code={themeCode} label="A theme of your own" />
      <p>The same components with and without that theme:</p>
      <div className="pg-theme-demo" data-docs-raw="" data-example="theme">
        <div className="pg-theme-pane">
          <div className="pg-theme-stage">
            <ThemeSample name="default" />
          </div>
          <Caption>Without squareTheme</Caption>
        </div>
        <div className="pg-theme-pane">
          <div className={`pg-theme-stage ${squareClass}`}>
            <ThemeSample name="squareTheme" />
          </div>
          <Caption>{recipeOn ? 'With squareTheme, which resets your customization inside its panel' : theme === 'dark' ? 'With squareTheme, back on the light defaults' : 'With squareTheme'}</Caption>
        </div>
      </div>
      <p>
        A theme class sets every token: the ones you list, and all the others back to their defaults, which are the light values.
        {theme === 'dark'
          ? ' That is why the second panel is light while this page is dark.'
          : ' Switch this page to dark and the second panel stays light.'}{' '}
        Themes do not stack either: <code>stylex.props</code> keeps only the last theme of a contract. For a change that should hold
        in both light and dark, such as corner radius or the typeface, edit <code>tokens.stylex.ts</code> itself. It is your copy.
      </p>
      <p>
        A theme reaches only what renders inside its element. Menus, popovers and dialogs render in a portal at the end of{' '}
        <code>&lt;body&gt;</code>, so a theme meant for the whole app belongs on <code>&lt;html&gt;</code>.
      </p>
      <p>
        To choose an accent, neutrals, corners and a typeface with every value checked for you, use{' '}
        <a href={pageHref('customize')}>Customize</a>. It writes its values inline on <code>&lt;html&gt;</code>, on top of whichever
        theme class is there, so they hold in light and dark and reach every portal. Unlike <code>createTheme</code>, those values
        do not reset the tokens they leave out, so the dark theme keeps supplying the rest. An element inside the page that carries
        its own theme class, like the squareTheme panel above, still resets to the stock values within it.
      </p>

      <Heading level={2} id="one-component" path={path}>Changing one component</Heading>
      <p>
        Start with props. Most components have <code>appearance</code>, <code>size</code>, <code>tone</code> or similar props for the
        variations they support, and each component page lists them.
      </p>
      <p>
        Components that render a single element, such as Button, Card, Alert, Table and its parts, Kbd, Group, Frame and Meter, also
        take <code>className</code> and <code>style</code> and pass other attributes through to that element. Give them a class from
        your own stylesheet: CSS outside any layer ranks above the StyleX layers, so your rule wins.
      </p>
      <CodeBlock code={classCode} label="A class on Button" />
      <p>
        A class made with StyleX does not merge with a component's own StyleX styles, so which one wins is not defined. OverlayButton
        is the exception: its <code>appearanceStyles</code> prop takes StyleX styles and applies them after its own.
      </p>
      <p>
        Composite controls such as Select, Slider, Switch and Tabs take no <code>className</code>. Change them with tokens, with a
        theme on the part of the page they sit in, or in their file. It is your copy.
      </p>

      <Heading level={2} id="dark-mode" path={path}>Dark mode</Heading>
      <p>
        <code>darkTheme</code> in <code>theme.ts</code> is a theme of the same contract. It changes the colors, the shadows and the
        focus halo; sizes, radii, type and motion stay as they are. Put it on <code>&lt;html&gt;</code>, as{' '}
        <a href={`#docs/get-started/dark-theme`}>Get started</a> shows, and switch it with the reader's choice or the system
        setting. This site does both: a saved choice wins, and a first visit follows the system.
      </p>
      <p>
        Components never check which theme is on; they only read tokens. Another theme, such as a high-contrast one, is one more{' '}
        <code>createTheme</code> call. Start from a copy of <code>darkTheme</code> and change its values.
      </p>

      <Heading level={2} id="reduced-motion" path={path}>Reduced motion</Heading>
      <p>
        The motion tokens keep their values when the reader asks for less motion. Each component checks{' '}
        <code>prefers-reduced-motion</code> itself: transitions drop to zero, entrance animations are left out, and springs jump to
        where they would settle. The state still changes. A switch still switches; it just does not travel.
      </p>
      <p>Do the same in your own styles:</p>
      <CodeBlock code={motionCode} label="Reduced motion in StyleX" />
      <p>
        <a href={pageHref('motion')}>Motion</a> shows each token at work.
      </p>
    </>
  );
}
