import type { CSSProperties } from 'react';
import { Badge } from '../../components';
import { Heading } from '../PageParts';
import { labelOf, useRecipe } from '../customize/RecipeProvider';
import { contrastRatio, Specimen, TokenName, tokenNames, useThemeName, useTokens } from './shared';
import type { TokenTable } from './shared';

// The body of #docs/colors. Every swatch is painted with var(--os-…) and every value is read from
// the document, so the page shows whichever theme is on and cannot drift from tokens.stylex.ts.

const path = 'docs/colors';

type GroupId = 'foreground' | 'background' | 'border' | 'accent' | 'status' | 'other';

const tones = ['error', 'danger', 'info', 'success', 'warning', 'notification'] as const;
type Tone = typeof tones[number];
const toneOf = (name: string): Tone | undefined => tones.find(tone => name.includes(`-${tone}`));

const groups: { id: GroupId; title: string; use: string }[] = [
  {
    id: 'foreground',
    title: 'Foreground',
    use: 'Text and icons. Base is primary text, muted is secondary, subtle is for hints and placeholders, disabled is for controls that cannot be used, and link is for links. On-contrast sits on the contrast fill; the static pair stays the same in both themes.',
  },
  {
    id: 'background',
    title: 'Background',
    use: 'Surfaces, in levels. Canvas is the page and subtle is a sunken section. Surface holds cards, fields and tiles. Muted is the track under a set of options, and raised is the selected tile on it. Elevated is the surface of popups, dialogs, sheets and toasts, and in dark it is lighter than everything below it. The interactive fills step a control from rest to hover to pressed. Disabled fills a control that cannot be used, contrast is the solid fill under on-contrast text, and overlay dims the page behind a dialog.',
  },
  {
    id: 'border',
    title: 'Border',
    use: 'Hairlines, only where they explain a boundary. Subtle divides areas and outlines a field at rest, muted is the field on hover, interactive marks a field that is in use, and disabled outlines one that cannot be used. Control is the ring of an unselected checkbox or radio: it shows state, so it reaches 3:1. Focus ring is the one keyboard focus outline, in every component.',
  },
  {
    id: 'accent',
    title: 'Accent',
    use: 'The primary action and selected states. Moderate at rest, bold on hover, strong when pressed, and intense is the deepest step. On-accent is text on an accent fill. Subtle, muted and dim are the quiet fills of secondary actions, in the same three steps.',
  },
  {
    id: 'status',
    title: 'Status',
    use: 'Feedback only. Foreground is for text and icons, background for a tinted surface, contrast for a solid fill. Error and danger share values: error names a problem, danger a destructive action.',
  },
  {
    id: 'other',
    title: 'Other',
    use: 'Selection is the bright blue that marks a picked tool or object, as in Toolbar. Button active text is the label of a hovered or pressed primary button. The gradient fills Progress.',
  },
];

function groupOf(name: string): GroupId {
  if (toneOf(name)) return 'status';
  if (name === '--os-color-focus-ring') return 'border';
  if (name.startsWith('--os-color-fg-')) return 'foreground';
  if (name.startsWith('--os-color-bg-')) return 'background';
  if (name.startsWith('--os-color-border-')) return 'border';
  if (name.startsWith('--os-color-accent-')) return 'accent';
  return 'other';
}

/** The color a text token is meant to sit on, for a contrast figure. Null where a figure would mislead. */
function backgroundFor(name: string): { token: string; label: string } | null {
  if (name === '--os-color-fg-on-contrast') return { token: '--os-color-bg-contrast', label: 'contrast' };
  if (name === '--os-color-accent-on-accent') return { token: '--os-color-accent-moderate', label: 'accent' };
  if (name === '--os-button-active-text') return { token: '--os-color-accent-bold', label: 'accent bold' };
  if (/^--os-color-fg-(base|muted|subtle|disabled|link)$/.test(name)) return { token: '--os-color-bg-canvas', label: 'canvas' };
  // Lines that carry state (a selection ring, the focus ring) are held to 3:1 against the page.
  if (name === '--os-color-border-control' || name === '--os-color-focus-ring') return { token: '--os-color-bg-canvas', label: 'canvas' };
  const tone = name.startsWith('--os-color-fg-') ? toneOf(name) : undefined;
  if (tone === 'error' || tone === 'danger') return { token: '--os-color-bg-error', label: 'its background' };
  if (tone) return { token: `--os-color-bg-${tone}`, label: 'its background' };
  return null;
}

/** Within a tone: text first, then its surface, then solid fills, then the border. */
function roleRank(name: string) {
  if (name.includes('-fg-')) return 0;
  if (name.includes('-border-')) return 3;
  const tone = toneOf(name);
  return tone && name.endsWith(`-${tone}`) ? 1 : 2;
}

const isColorToken = (name: string, values: TokenTable) => values.color(name) !== null || name.startsWith('--os-gradient-');

function Swatch({ name, values }: { name: string; values: TokenTable }) {
  const color = values.color(name);
  const pair = backgroundFor(name);
  const backing = pair ? values.color(pair.token) : null;
  const ratio = color && backing ? contrastRatio(color, backing) : null;
  const paint = { '--pg-color': `var(${name})` } as CSSProperties;

  return (
    <li className="pg-swatch">
      <span className="pg-swatch-chip" data-kind={color ? 'color' : 'paint'} style={paint} aria-hidden="true" />
      <span className="pg-swatch-text">
        <TokenName name={name} />
        <span className="pg-value">
          {color ? color.label : values.value(name)}
          {ratio !== null && pair && (
            <span className="pg-ratio" title={`Contrast against --os-color-${pair.token.replace('--os-color-', '')}`}>
              {ratio.toFixed(1)}:1 on {pair.label}
            </span>
          )}
        </span>
      </span>
    </li>
  );
}

const toneLabels: Record<Tone, string> = {
  error: 'Error',
  danger: 'Danger',
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  notification: 'Notification',
};

export default function Colors() {
  const values = useTokens();
  const theme = useThemeName();
  const { recipe, customized, showOriginal } = useRecipe();
  const custom = customized && !showOriginal ? `, customized: ${labelOf(recipe) === 'Custom mix' ? 'custom mix' : labelOf(recipe)}` : '';
  const colorTokens = tokenNames.filter(name => isColorToken(name, values));

  return (
    <>
      <p className="pg-theme-note" data-docs-raw="" role="status">
        <span className="pg-theme-dot" data-theme={theme} aria-hidden="true" />
        Values for the {theme} theme{custom}
      </p>
      <p>
        Switch themes in the header to compare. Click a token name to copy it. Contrast figures use the WCAG formula against the surface each text color is meant for. Body
        text needs 4.5:1; large text, icons and the rings that show a state need 3:1.
      </p>

      {groups.map(group => {
        const members = colorTokens.filter(name => groupOf(name) === group.id);
        if (members.length === 0) return null;

        if (group.id === 'status') {
          const byTone = tones
            .map(tone => ({ tone, names: members.filter(name => toneOf(name) === tone).sort((a, b) => roleRank(a) - roleRank(b)) }))
            .filter(entry => entry.names.length > 0);
          return (
            <section key={group.id} className="pg-color-group">
              <Heading level={2} id={group.id} path={path}>{group.title}</Heading>
              <p>{group.use}</p>
              <Specimen id="status-in-use" label="Status colors in use">
                <div className="pg-badges">
                  <Badge status="success" withIcon>Paid</Badge>
                  <Badge status="info" withIcon>Scheduled</Badge>
                  <Badge status="warning" withIcon>Expiring</Badge>
                  <Badge status="error" withIcon>Failed</Badge>
                </div>
                <div className="pg-badges">
                  <Badge status="success" contrast="high">Paid</Badge>
                  <Badge status="info" contrast="high">Scheduled</Badge>
                  <Badge status="warning" contrast="high">Expiring</Badge>
                  <Badge status="error" contrast="high">Failed</Badge>
                </div>
              </Specimen>
              <div className="pg-tones" data-docs-raw="">
                {byTone.map(entry => (
                  <div key={entry.tone} className="pg-tone">
                    <h3 className="pg-tone-label">{toneLabels[entry.tone]}</h3>
                    <ul className="pg-swatches" role="list">
                      {entry.names.map(name => <Swatch key={name} name={name} values={values} />)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        return (
          <section key={group.id} className="pg-color-group">
            <Heading level={2} id={group.id} path={path}>{group.title}</Heading>
            <p>{group.use}</p>
            <ul className="pg-swatches" role="list" data-docs-raw="">
              {members.map(name => <Swatch key={name} name={name} values={values} />)}
            </ul>
          </section>
        );
      })}
    </>
  );
}
