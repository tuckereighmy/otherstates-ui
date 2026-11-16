import type { CSSProperties } from 'react';
import { CodeBlock } from '../CodeBlock';
import { Heading } from '../PageParts';
import { Caption, px, shortName, Specimen, TokenName, tokensByValue, tokensWithPrefix, useTokens } from './shared';
import type { TokenTable } from './shared';

// The body of #docs/typography. Sizes, weights, line heights, tracking and the family are read
// from the tokens, so a step added to the contract shows up here by itself. The roles and the
// notes are guidance written here, after the design spec (§1.4).

const path = 'docs/typography';

const sizePrefix = '--os-font-size-';
const weightPrefix = '--os-font-weight-';
const lineHeightPrefix = '--os-line-height-';
const trackingPrefix = '--os-tracking-';

// Which line height goes with which size: 16 for 12px text, 18 for 13px, 20 for 14 and 15px, 24 for
// 16 and 18px. The fallbacks stand in until a token file has the line-height steps.
const leading = [
  { upTo: 12, key: 'xs', fallback: 16 },
  { upTo: 13, key: 'sm', fallback: 18 },
  { upTo: 15, key: 'md', fallback: 20 },
  { upTo: 18, key: 'lg', fallback: 24 },
];

/** The line height for a size: a token where the scale has one, else a whole multiple of 4. */
function lineHeightFor(size: number, values: TokenTable): { px: number; css: string } {
  const step = leading.find(entry => size <= entry.upTo);
  if (!step) {
    const larger = Math.round((size * 1.25) / 4) * 4;
    return { px: larger, css: `${larger}px` };
  }
  const token = `${lineHeightPrefix}${step.key}`;
  const value = values.number(token);
  return value === null ? { px: step.fallback, css: `${step.fallback}px` } : { px: value, css: `var(${token})` };
}

/** Tracking by size: none at 12px and below, tight from 13 to 18px, a little tighter from 20px. */
function trackingFor(size: number): { css: string; label: string } {
  if (size <= 12) return { css: '0', label: '0' };
  if (size <= 18) return { css: 'var(--os-tracking-tight, -0.01em)', label: 'tight' };
  return { css: '-0.02em', label: '-0.02em' };
}

const sizeNotes: Record<string, { use: string; sample: string }> = {
  xs: { use: 'Badges, tooltips, group labels, table headers and captions.', sample: 'Edited 4 minutes ago by Noor' },
  caption: { use: 'Help and error text, small controls, table cells and secondary lines.', sample: 'Used to sign in and for receipts.' },
  sm: { use: 'Body text, labels, medium controls and menu items.', sample: 'Share with people in your workspace' },
  md: { use: 'Large controls, and the reading text of these docs.', sample: 'Your changes are saved as you type, and anyone with the link can view them.' },
  body: { use: 'Extra-large controls, card and empty-state headings, and field values on touch screens.', sample: 'Storage almost full' },
  lg: { use: 'Titles of dialogs, sheets and drawers.', sample: 'Delete this project?' },
  xl: { use: 'Section headings on a page.', sample: 'Notification settings' },
  '2xl': { use: 'Page titles. One per page.', sample: 'Quarterly planning' },
};

const weightNotes: Record<string, string> = {
  regular: 'Values, list items, body text and descriptions.',
  medium: 'Labels, buttons, tabs, headings and the selected option.',
  semibold: 'Docs headings and numeric emphasis. Components do not use it.',
  bold: 'Rarely: a single figure that has to lead.',
};

const lineHeightNotes: Record<string, { use: string; size: number }> = {
  xs: { use: 'For 12px text.', size: 12 },
  sm: { use: 'For 13px text.', size: 13 },
  md: { use: 'For 14 and 15px text.', size: 14 },
  lg: { use: 'For 16 and 18px text.', size: 16 },
};

const trackingNotes: Record<string, string> = {
  tight: 'Interface text from 13 to 18px: labels, values, controls and titles.',
};

// Roles as a component or a page uses them: a size key (with the px it stands for until the token
// exists), a weight key, and where a role departs from the defaults above, its own line height or tracking.
type Role = { role: string; size: string; fallback: number; weight: string; sample: string; lineHeight?: number; tracking?: string; muted?: boolean };
const roles: Role[] = [
  { role: 'Page title', size: '2xl', fallback: 29, weight: 'semibold', sample: 'Quarterly planning' },
  { role: 'Section heading', size: 'xl', fallback: 22, weight: 'semibold', sample: 'Team members' },
  { role: 'Overlay title', size: 'lg', fallback: 18, weight: 'medium', tracking: '-0.02em', sample: 'Delete this project?' },
  { role: 'Card heading', size: 'body', fallback: 16, weight: 'medium', sample: 'Storage almost full' },
  { role: 'Body', size: 'sm', fallback: 14, weight: 'regular', sample: 'Invite people to edit this page. They get an email with a link.' },
  { role: 'Label', size: 'sm', fallback: 14, weight: 'medium', sample: 'Email address' },
  { role: 'Help text', size: 'caption', fallback: 13, weight: 'regular', lineHeight: 20, muted: true, sample: 'Used to sign in and for receipts.' },
  { role: 'Caption', size: 'xs', fallback: 12, weight: 'regular', muted: true, sample: 'Edited 4 minutes ago' },
];

const figures = ['1,111.10', '48.00', '907.25', '11.11', '3,480.76'];

const tabularCode = `const styles = stylex.create({
  total: { fontVariantNumeric: 'tabular-nums' },
});`;

export default function Typography() {
  const values = useTokens();
  const sizes = tokensByValue(sizePrefix, values);
  const weights = tokensWithPrefix(weightPrefix);
  const lineHeights = tokensByValue(lineHeightPrefix, values);
  const trackings = tokensWithPrefix(trackingPrefix);
  const family = values.value('--os-font-family');
  const firstFamily = family.split(',')[0]?.trim().replace(/^["']|["']$/g, '') || 'Inter';

  const weightOf = (key: string) => values.value(`${weightPrefix}${key}`) || '400';

  return (
    <>
      <Heading level={2} id="typeface" path={path}>Typeface</Heading>
      <p>
        Every component sets its text in one family, from <code>--os-font-family</code>. Inter is drawn for screens: open shapes, a
        tall x-height and figures that hold up at small sizes.
      </p>
      <Specimen id="typeface" align="start" className="pg-face-specimen">
        <div className="pg-face">
          <p className="pg-face-sample">{firstFamily}</p>
          <p className="pg-face-glyphs">
            {/* On a narrow screen each alphabet breaks once, in the middle, rather than wherever it runs out of room. */}
            ABCDEFGHIJKLM<wbr />NOPQRSTUVWXYZ
            <br />
            abcdefghijklm<wbr />nopqrstuvwxyz
            <br />
            0123456789 &amp; @ ? ! % ( ) → ·
          </p>
        </div>
      </Specimen>
      <ul className="pg-rows" role="list" data-docs-raw="">
        <li className="pg-row pg-token-row">
          <TokenName name="--os-font-family" />
          <span className="pg-value">{family}</span>
        </li>
      </ul>

      <Heading level={2} id="size-scale" path={path}>Size scale</Heading>
      <p>
        Most interface text is 13 or 14px; the larger steps are for titles and the structure of a page. Nothing is set smaller than
        12px. After each size come its line height and its tracking.
      </p>
      <ul className="pg-rows pg-type-rows" role="list" data-docs-raw="">
        {sizes.map(name => {
          const key = shortName(name, sizePrefix);
          const size = values.number(name) ?? 16;
          const lineHeight = lineHeightFor(size, values);
          const tracking = trackingFor(size);
          const note = sizeNotes[key];
          const style = { fontSize: `var(${name})`, lineHeight: lineHeight.css, letterSpacing: tracking.css } as CSSProperties;
          return (
            <li key={name} className="pg-row pg-type-row">
              <div className="pg-type-meta">
                <TokenName name={name} />
                <span className="pg-value">{px(size)} / {lineHeight.px}px · {tracking.label}</span>
                {note && <span className="pg-use">{note.use}</span>}
              </div>
              <p className="pg-type-sample" style={style}>{note?.sample ?? 'Your invoice for March is ready to download'}</p>
            </li>
          );
        })}
      </ul>

      {lineHeights.length > 0 && (
        <>
          <Heading level={2} id="line-heights" path={path}>Line heights</Heading>
          <p>
            Every line height is a whole number of pixels, picked by the size of the text, so rows of text never sit on half pixels.
            Components use only these steps. A unitless value such as 1.4 is not used: it gives fractional boxes.
          </p>
          <ul className="pg-rows" role="list" data-docs-raw="">
            {lineHeights.map(name => {
              const note = lineHeightNotes[shortName(name, lineHeightPrefix)];
              const size = note?.size ?? 14;
              const style = { fontSize: `${size}px`, lineHeight: `var(${name})`, letterSpacing: trackingFor(size).css } as CSSProperties;
              return (
                <li key={name} className="pg-row pg-leading-row">
                  <TokenName name={name} />
                  <span className="pg-value">{values.value(name)}</span>
                  <span className="pg-leading-cell"><span className="pg-leading-sample" style={style}>Invoice 2041 is due on Friday</span></span>
                  <span className="pg-use">{note?.use ?? ''}</span>
                </li>
              );
            })}
          </ul>
          <p>The shaded band is the line box: the height one line of that text takes up.</p>
        </>
      )}

      <Heading level={2} id="weights" path={path}>Weights</Heading>
      <p>
        Components use two: regular for what a reader reads, medium for what names or labels it. Use weight before size to set a label
        apart from its value.
      </p>
      <ul className="pg-weights" role="list" data-docs-raw="">
        {weights.map(name => {
          const key = shortName(name, weightPrefix);
          return (
            <li key={name} className="pg-weight">
              <span className="pg-weight-sample" style={{ fontWeight: `var(${name})` } as CSSProperties} aria-hidden="true">Ag</span>
              <TokenName name={name} />
              <span className="pg-value">{values.value(name)}</span>
              {weightNotes[key] && <span className="pg-use">{weightNotes[key]}</span>}
            </li>
          );
        })}
      </ul>

      {trackings.length > 0 && (
        <>
          <Heading level={2} id="tracking" path={path}>Tracking</Heading>
          <p>
            Inter's own spacing suits body sizes. Interface text from 13 to 18px tightens by a hair. Text of 12px and smaller keeps the
            font's spacing, and text of 20px and up tightens a little more, by <code>-0.02em</code>.
          </p>
          <ul className="pg-rows" role="list" data-docs-raw="">
            {trackings.map(name => (
              <li key={name} className="pg-row pg-tracking-row">
                <TokenName name={name} />
                <span className="pg-value">{values.value(name)}</span>
                <span className="pg-tracking-pair" aria-hidden="true">
                  <span style={{ letterSpacing: `var(${name})` } as CSSProperties}>Billing settings</span>
                  <span className="pg-tracking-plain">Billing settings</span>
                </span>
                <span className="pg-use">{trackingNotes[shortName(name, trackingPrefix)] ?? ''}</span>
              </li>
            ))}
          </ul>
          <p>Both samples are set at 15px: the first with the token, the second with no tracking.</p>
        </>
      )}

      <Heading level={2} id="roles" path={path}>Headings, body and labels</Heading>
      <p>
        A short hierarchy reads faster than a long one. These are the roles the components and the docs use. The two largest belong to
        pages, which is why only they are set in semibold.
      </p>
      <ul className="pg-rows pg-roles" role="list" data-docs-raw="">
        {roles.map(role => {
          const sizeToken = `${sizePrefix}${role.size}`;
          const size = values.number(sizeToken) ?? role.fallback;
          const lineHeight = role.lineHeight ?? lineHeightFor(size, values).px;
          const style = {
            fontSize: `var(${sizeToken}, ${role.fallback}px)`,
            fontWeight: `var(${weightPrefix}${role.weight})`,
            lineHeight: `${lineHeight}px`,
            letterSpacing: role.tracking ?? trackingFor(size).css,
            color: role.muted ? 'var(--os-color-fg-muted)' : undefined,
          } as CSSProperties;
          return (
            <li key={role.role} className="pg-row">
              <span className="pg-role-name">{role.role}</span>
              <p className="pg-role-sample" style={style}>{role.sample}</p>
              <span className="pg-value pg-role-spec">
                {role.size} · {weightOf(role.weight)} · {size}/{lineHeight}
              </span>
            </li>
          );
        })}
      </ul>

      <Heading level={2} id="tabular-numerals" path={path}>Tabular numerals</Heading>
      <p>
        By default each figure in Inter has its own width, which reads well in a sentence. Wherever a number changes in place or lines
        up in a column, such as a value, a counter, a page number, a timer or a column of prices, turn on tabular figures so every
        digit takes the same width.
      </p>
      <Specimen id="tabular" label="Proportional and tabular figures">
        <div className="pg-figures">
          <div className="pg-figure">
            <Caption>Proportional</Caption>
            <ul className="pg-figure-list" role="list">
              {figures.map(figure => <li key={figure}>{figure}</li>)}
            </ul>
          </div>
          <div className="pg-figure">
            <Caption>Tabular</Caption>
            <ul className="pg-figure-list" data-tabular="" role="list">
              {figures.map(figure => <li key={figure}>{figure}</li>)}
            </ul>
          </div>
        </div>
      </Specimen>
      <CodeBlock code={tabularCode} label="Tabular figures in StyleX" />
    </>
  );
}
