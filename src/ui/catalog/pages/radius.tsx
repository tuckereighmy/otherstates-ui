import { useState } from 'react';
import type { CSSProperties } from 'react';
import { SegmentedControl } from '../../components';
import { Heading } from '../PageParts';
import { Caption, px, shortName, Specimen, TokenName, tokensWithPrefix, useTokens } from './shared';

// The body of #docs/radius. Shapes are drawn with var(--os-radius-…); the nesting demo works the
// rule out from the live outer radius and the padding the reader picks.

const path = 'docs/radius';
const prefix = '--os-radius-';
const outerToken = '--os-radius-lg';
const floorToken = '--os-radius-sm';

const notes: Record<string, string> = {
  none: 'Edges that meet another surface, such as table rows and full-bleed media.',
  xs: 'Date segments and inline code.',
  sm: 'Checkboxes, keys and menu shortcuts. Also the smallest inner radius, and extra-small controls on a corner ladder.',
  md: 'List items and tooltips. On a corner ladder the control radius equals it.',
  lg: 'Popups, dialogs, sheets, fieldsets, calendar panels and table wrappers. Group shells and tracks take control + 6, which is lg on a corner ladder.',
  xl: 'Cards, empty states and toasts.',
  '2xl': 'The composer, and a segmented control on its own surface.',
  full: 'Shapes that are always round: switches, radios, avatars, sliders, spinners and progress bars.',
  control: 'The one corner every control shares: buttons, toggles, field shells, badges, pagination and calendar days. A pill by default; a corner ladder sets it to md.',
};

// The insets components really use inside a 16px surface: a tab track (4), a popup list (6), a frame (8).
const paddings = [4, 6, 8, 12];

export default function Radius() {
  const values = useTokens();
  const [padding, setPadding] = useState(8);
  // Smallest first, whatever order the contract declares them in.
  const radii = tokensWithPrefix(prefix).slice().sort((a, b) => (values.number(a) ?? 0) - (values.number(b) ?? 0));

  const outer = values.number(outerToken) ?? 0;
  const floor = values.number(floorToken) ?? 0;
  const inner = Math.max(floor, outer - padding);
  const nestStyle = { '--pg-outer': `var(${outerToken})`, '--pg-pad': `${padding}px`, '--pg-floor': `var(${floorToken})` } as CSSProperties;

  return (
    <>
      <Heading level={2} id="scale" path={path}>Scale</Heading>
      <p>
        Radius grows with the size of the surface. Small parts get small corners, surfaces that hold other things get larger ones,
        and shapes that are always round take <code>full</code>. Controls share one corner, <code>control</code>: a pill by default,
        and equal to <code>md</code> on a corner ladder, so buttons and fields always match.
      </p>
      <ul className="pg-shapes" role="list" data-docs-raw="">
        {radii.map(name => {
          const key = shortName(name, prefix);
          return (
            <li key={name} className="pg-shape">
              <span className="pg-shape-box" style={{ '--pg-radius': `var(${name})` } as CSSProperties} aria-hidden="true" />
              <TokenName name={name} />
              <span className="pg-value">{px(values.number(name))}</span>
              {notes[key] && <span className="pg-use">{notes[key]}</span>}
            </li>
          );
        })}
      </ul>

      <Heading level={2} id="nesting" path={path}>Nesting</Heading>
      <p>
        When a rounded shape sits inside another, give the inner one the outer radius minus the padding between them, but never less
        than <code>sm</code>. The two curves then share a center and the gap stays even all the way round. With the same radius on
        both, the gap pinches at the corners. A container of controls works the rule the other way: a Group shell or a track
        takes the control radius plus its padding, so pills sit in a pill and 10px fields in a 16px shell.
      </p>
      <Specimen id="nesting" label="Nested radius">
        <div className="pg-nest">
          <div className="pg-nest-control">
            <Caption>Padding</Caption>
            <SegmentedControl
              label="Padding"
              value={String(padding)}
              onChange={value => setPadding(Number(value))}
              options={paddings.map(value => ({ value: String(value), label: `${value}px` }))}
            />
          </div>
          <div className="pg-nest-pair" style={nestStyle}>
            <figure className="pg-nest-figure">
              <div className="pg-nest-outer">
                <div className="pg-nest-inner" data-same="" />
              </div>
              <figcaption>
                <span className="pg-nest-title">Same radius</span>
                <Caption>{px(outer)} inside {px(outer)}</Caption>
              </figcaption>
            </figure>
            <figure className="pg-nest-figure">
              <div className="pg-nest-outer">
                <div className="pg-nest-inner" />
              </div>
              <figcaption>
                <span className="pg-nest-title">Outer minus padding</span>
                <Caption>
                  {px(outer)} − {px(padding)} = {px(outer - padding)}
                  {inner !== outer - padding && <> → {px(inner)}</>}
                </Caption>
              </figcaption>
            </figure>
          </div>
        </div>
      </Specimen>
      <p>
        The outer shape here uses <code>{outerToken}</code>. Components follow the same rule: a popup at 16px with 6px of padding gives
        10px items, a tab track with 4px of padding gives 12px tabs, and a frame with 8px of padding gives an 8px body. Write it as{' '}
        <code>calc(outer - inset)</code> rather than a literal, so it follows the tokens. A state never changes a radius.
      </p>
    </>
  );
}
