import { useRef } from 'react';
import type { CSSProperties } from 'react';
import { Button } from '../../components';
import { Heading } from '../PageParts';
import { Caption, px, shortName, Specimen, TokenName, tokensByValue, tokensWithPrefix, useElementSize, useTokens } from './shared';

// The body of #docs/spacing-and-sizing. Bars and boxes are drawn with var(--os-…), values are read
// from the document, and the button heights are measured from real buttons.

const path = 'docs/spacing-and-sizing';

const spaceNotes: Record<string, string> = {
  '0-5': 'Gaps inside tracks, groups and toolbars.',
  '1': 'Between lines in a tight group, or an icon and a short label.',
  '1-5': 'Padding inside a popup list; gaps in extra-small and small controls.',
  '2': 'Between controls in a group, and between a label and its control.',
  '3': 'Padding inside small surfaces; between rows in a list.',
  '4': 'Padding in popovers; between fields in a form.',
  '5': 'Padding in cards, dialogs and sheets.',
  '6': 'Between the sections of a form or a card.',
  '8': 'Padding of a large panel; between page sections.',
  '10': 'Section rhythm in the docs and in empty states.',
  '12': 'Between the major parts of a page.',
  '14': 'The largest step, for the top and bottom of a page.',
};

const sizeNotes: Record<string, string> = {
  '2xs': 'Icons beside text, and the smallest spinner.',
  xs: 'Keyboard keys and badges.',
  sm: 'Small buttons, options inside a 40px track, page numbers and the buttons inside a field.',
  md: 'The default: buttons, fields, selects, toggles and tab rows.',
  lg: 'Large buttons, and the smallest comfortable touch target.',
  xl: 'Extra-large fields, and one prominent action on a phone screen.',
};

const strokeNotes: Record<string, string> = {
  '--os-stroke': 'Hairlines and control borders.',
  '--os-stroke-2': 'Focus outlines and a selected edge.',
};

function MeasuredButton({ size, label }: { size: 'small' | 'medium' | 'large'; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const box = useElementSize(ref);
  return (
    <div className="pg-measured">
      <div ref={ref} className="pg-measured-target">
        <Button size={size}>{label}</Button>
      </div>
      <Caption>
        <code className="pg-inline-code">size="{size}"</code> {box ? px(box.height) : '–'}
      </Caption>
    </div>
  );
}

export default function SpacingAndSizing() {
  const values = useTokens();
  const spaces = tokensByValue('--os-space-', values);
  const sizes = tokensByValue('--os-size-', values);
  const strokes = tokensWithPrefix('--os-stroke');

  return (
    <>
      <Heading level={2} id="space" path={path}>Space</Heading>
      <p>
        Gaps and padding come from one scale on a 4px base, with a 2px and a 6px step for the insides of dense controls, and steps
        left out where they are not needed. Keep related things close and unrelated things apart: 8px or less inside a group, 16 to
        24px between groups.
      </p>
      <ul className="pg-rows" role="list" data-docs-raw="">
        {spaces.map(name => {
          const key = shortName(name, '--os-space-');
          return (
            <li key={name} className="pg-row pg-space-row">
              <TokenName name={name} />
              <span className="pg-value">{px(values.number(name))}</span>
              <span className="pg-bar-track" aria-hidden="true">
                <span className="pg-bar" style={{ '--pg-size': `var(${name})` } as CSSProperties} />
              </span>
              <span className="pg-use">{spaceNotes[key] ?? ''}</span>
            </li>
          );
        })}
      </ul>

      <Heading level={2} id="control-sizes" path={path}>Control sizes</Heading>
      <p>
        Controls are built on a few fixed heights, so a button, a field and a select placed in one row share the same edges. Medium,
        40px, is the default. Pick one height for a row and keep to it. A height is the outer height: borders are inside it.
      </p>
      <ul className="pg-rows" role="list" data-docs-raw="">
        {sizes.map(name => {
          const key = shortName(name, '--os-size-');
          return (
            <li key={name} className="pg-row pg-size-row">
              <span className="pg-size-cell" aria-hidden="true">
                <span className="pg-size-box" style={{ '--pg-size': `var(${name})` } as CSSProperties} />
              </span>
              <TokenName name={name} />
              <span className="pg-value">{px(values.number(name))}</span>
              <span className="pg-use">{sizeNotes[key] ?? ''}</span>
            </li>
          );
        })}
      </ul>
      <p>Button reads three of these. The heights below are measured from the buttons on screen.</p>
      <Specimen id="button-sizes" label="Button heights">
        <div className="pg-measured-row">
          <MeasuredButton size="small" label="Small" />
          <MeasuredButton size="medium" label="Medium" />
          <MeasuredButton size="large" label="Large" />
        </div>
      </Specimen>

      <Heading level={2} id="strokes" path={path}>Strokes</Heading>
      <p>Use a line only where it explains a boundary. Space, or a change of surface, usually does the job.</p>
      <ul className="pg-rows" role="list" data-docs-raw="">
        {strokes.map(name => (
          <li key={name} className="pg-row pg-stroke-row">
            <TokenName name={name} />
            <span className="pg-value">{px(values.number(name))}</span>
            <span className="pg-stroke-track" aria-hidden="true">
              <span className="pg-stroke" style={{ '--pg-size': `var(${name})` } as CSSProperties} />
            </span>
            <span className="pg-use">{strokeNotes[name] ?? ''}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
