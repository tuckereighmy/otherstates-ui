import type { CSSProperties } from 'react';
import { Button, TextField } from '../../components';
import baseCss from '../../base.css?raw';
import { CodeBlock } from '../CodeBlock';
import { Heading } from '../PageParts';
import { shortName, Specimen, TokenName, tokensByValue, tokensWithPrefix, useThemeName, useTokens } from './shared';

// The body of #docs/elevation. Each sample surface is lit with var(--os-shadow-…) and painted with
// var(--os-color-bg-…), values are read from the document, and the focus rule is read from base.css
// itself, so nothing here can drift from the contract.

const path = 'docs/elevation';

const shadowNotes: Record<string, string> = {
  control: 'A raised part inside a group: the selected tile on a track, a keycap, the shell of a group.',
  popup: 'Anything that floats over the page: menus, popovers, dialogs, sheets and toasts. Always with a hairline.',
};

// The surface levels, each on the level it usually sits on (design spec §1.6).
type Level = { token: string; on?: string; use: string; shadow?: string; hairline?: boolean };
const levels: Level[] = [
  { token: '--os-color-bg-canvas', use: 'The page.' },
  { token: '--os-color-bg-subtle', on: '--os-color-bg-canvas', use: 'Sunken sections, the docs stage and card footers.' },
  { token: '--os-color-bg-surface', on: '--os-color-bg-subtle', use: 'Cards, fields and tiles. On the canvas it needs a hairline.' },
  { token: '--os-color-bg-muted', on: '--os-color-bg-canvas', use: 'Tracks, icon tiles and keycaps.' },
  { token: '--os-color-bg-raised', on: '--os-color-bg-muted', use: 'The selected tile on a track.', shadow: '--os-shadow-control' },
  { token: '--os-color-bg-elevated', on: '--os-color-bg-canvas', use: 'Popups, dialogs, sheets, drawers and toasts.', shadow: '--os-shadow-popup', hairline: true },
];

const layerNotes: Record<string, string> = {
  modal: 'Modal layers that React Aria does not place itself.',
  toast: 'The toast region, above any modal.',
  tooltip: 'Tooltips, and floating layers that are not React Aria popovers. The Select morph and Composer suggestions sit 10 below it.',
};

/** The :focus-visible rule from base.css, one declaration per line. */
function focusRule(css: string) {
  const match = css.match(/:focus-visible\s*\{([^}]*)\}/);
  if (!match) return null;
  const declarations = match[1].split(';').map(part => part.trim()).filter(Boolean);
  return `/* base.css */\n:focus-visible {\n${declarations.map(line => `  ${line};`).join('\n')}\n}`;
}

const ringCode = focusRule(baseCss);

/** A shadow value, one layer per line: "0 1px 2px rgb(…)," never breaks inside a layer. */
function ShadowValue({ value }: { value: string }) {
  const layers: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '(') depth++;
    else if (value[i] === ')') depth--;
    else if (value[i] === ',' && depth === 0) { layers.push(value.slice(start, i + 1).trim()); start = i + 1; }
  }
  layers.push(value.slice(start).trim());
  return (
    <span className="pg-value pg-value-block">
      {layers.filter(Boolean).map((layer, index) => <span key={index} className="pg-layer">{layer}</span>)}
    </span>
  );
}

export default function Elevation() {
  const values = useTokens();
  const theme = useThemeName();
  const shadows = tokensWithPrefix('--os-shadow-');
  const shownLevels = levels.filter(level => values.color(level.token) !== null);
  const layers = tokensByValue('--os-z-', values);
  const hasRing = values.value('--os-color-focus-ring') !== '';
  const hasHalo = values.value('--os-focus-shadow') !== '';

  return (
    <>
      <Heading level={2} id="shadows" path={path}>Shadows</Heading>
      <p>
        Most surfaces are flat: a change of fill separates them. A shadow says that something sits above the page and can be moved,
        dismissed or pressed. A surface uses one shadow or none, and a control never uses a shadow and a border together as its edge.
      </p>
      <ul className="pg-levels" role="list" data-docs-raw="">
        <li className="pg-level">
          <span className="pg-level-stage" aria-hidden="true">
            <span className="pg-level-card" data-flat="" />
          </span>
          <span className="pg-level-name">None</span>
          <span className="pg-use">Cards, panels and fields. The surface and its fill do the work.</span>
        </li>
        {shadows.map(name => {
          const key = shortName(name, '--os-shadow-');
          const note = shadowNotes[key];
          return (
            <li key={name} className="pg-level">
              <span className="pg-level-stage" aria-hidden="true">
                <span className="pg-level-card" data-hairline={key === 'popup' || undefined} style={{ '--pg-shadow': `var(${name})` } as CSSProperties} />
              </span>
              <TokenName name={name} />
              {note && <span className="pg-use">{note}</span>}
              <ShadowValue value={values.value(name)} />
            </li>
          );
        })}
      </ul>
      <p>
        {theme === 'dark' ? 'You are looking at the dark theme. ' : 'In the dark theme, '}
        a shadow barely shows on a dark page, so every elevated surface keeps a 1px <code>--os-color-border-subtle</code> hairline as its
        edge, and the control shadow adds a faint light ring.
      </p>

      {shownLevels.length > 0 && (
        <>
          <Heading level={2} id="surfaces" path={path}>Surfaces</Heading>
          <p>
            Surfaces stack in levels, each on the one it usually sits on. In the dark theme a higher level is lighter, so a popup or a
            selected tile reads as raised rather than as a hole. In the light theme several levels are white, and a hairline or a
            shadow tells them apart. Never place a component on its own fill.
          </p>
          <ul className="pg-levels pg-surfaces" role="list" data-docs-raw="">
            {shownLevels.map(level => {
              const stage = { '--pg-stage': `var(${level.on ?? level.token})` } as CSSProperties;
              const card = { '--pg-fill': `var(${level.token})`, '--pg-shadow': level.shadow ? `var(${level.shadow})` : 'none' } as CSSProperties;
              return (
                <li key={level.token} className="pg-level">
                  <span className="pg-level-stage" data-fill="" style={stage} aria-hidden="true">
                    {level.on && <span className="pg-level-card" data-fill="" data-hairline={level.hairline || undefined} style={card} />}
                  </span>
                  <TokenName name={level.token} />
                  <span className="pg-use">
                    {level.use}
                    {level.on && <> On <code className="pg-inline-code">{shortName(level.on, '--os-color-')}</code>.</>}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <Heading level={2} id="focus" path={path}>Focus</Heading>
      <p>
        Keyboard focus is always visible, and it is one ring everywhere: a 2px outline in {hasRing ? <code>--os-color-focus-ring</code> : 'the focus color'},
        2px outside the element, following its own radius. It appears for keyboard focus only, not for a click. It is placed in
        one of three ways.
      </p>
      <ul className="pg-focus" role="list" data-docs-raw="">
        <li className="pg-level">
          <span className="pg-level-stage" aria-hidden="true">
            <span className="pg-ring-sample">Continue</span>
          </span>
          <span className="pg-level-name">Ring</span>
          <span className="pg-use">The default, for buttons, checkboxes, links and every other control.</span>
        </li>
        <li className="pg-level">
          <span className="pg-level-stage" aria-hidden="true">
            <span className="pg-edge-sample">name@example.com</span>
          </span>
          <span className="pg-level-name">Edge</span>
          <span className="pg-use">Text fields: the border takes the ring color and thickens to 2px. It shows on every focus, as the caret does.</span>
        </li>
        <li className="pg-level">
          <span className="pg-level-stage" aria-hidden="true">
            <span className="pg-inset-track">
              <span className="pg-inset-tile" data-selected="">Week</span>
              <span className="pg-inset-tile" data-focused="">Month</span>
            </span>
          </span>
          <span className="pg-level-name">Inset</span>
          <span className="pg-use">Inside the edge, for items packed closer than 4px or inside a clipped parent: tabs, pills, toolbar tools, table cells.</span>
        </li>
      </ul>
      <p>
        Lists that keep focus in their field, such as menus, list boxes and the command list, mark the current item with the hover fill
        instead of a ring.
      </p>
      {(hasRing || hasHalo) && (
        <ul className="pg-rows" role="list" data-docs-raw="">
          {hasRing && (
            <li className="pg-row pg-token-row">
              <TokenName name="--os-color-focus-ring" />
              <span className="pg-use">The ring's color: {values.color('--os-color-focus-ring')?.label ?? values.value('--os-color-focus-ring')}. Theme it to a brand color if you like, as long as it keeps 3:1 against the canvas.</span>
            </li>
          )}
          {hasHalo && (
            <li className="pg-row pg-token-row">
              <TokenName name="--os-focus-shadow" />
              <span className="pg-use">Deprecated. No component uses it, and it goes in the next major version.</span>
            </li>
          )}
        </ul>
      )}
      <p>Press Tab to move into the panel below and see the ring and the edge on real components.</p>
      <Specimen id="focus-try" label="Try keyboard focus">
        <form className="pg-try" onSubmit={event => event.preventDefault()}>
          <TextField label="Email" type="email" placeholder="name@example.com" autoComplete="off" />
          <Button size="medium" type="submit" fullWidth>Continue</Button>
        </form>
      </Specimen>
      {ringCode && (
        <>
          <p>Anything the library does not style itself falls back to the rule in <code>base.css</code>:</p>
          <CodeBlock code={ringCode} language="text" label="The focus ring in base.css" />
        </>
      )}

      {layers.length > 0 && (
        <>
          <Heading level={2} id="layers" path={path}>Layers</Heading>
          <p>
            React Aria places its own popovers above the page, with an inline <code>z-index</code>, so never give one a{' '}
            <code>zIndex</code>. These tokens are only for layers it does not place.
          </p>
          <ul className="pg-rows" role="list" data-docs-raw="">
            {layers.map(name => (
              <li key={name} className="pg-row pg-layer-row">
                <TokenName name={name} />
                <span className="pg-value">{values.value(name)}</span>
                <span className="pg-use">{layerNotes[shortName(name, '--os-z-')] ?? ''}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
