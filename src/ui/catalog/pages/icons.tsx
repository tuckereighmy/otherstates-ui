import { useDeferredValue, useId, useState } from 'react';
import { Icon, iconNames } from '../../components/Icon';
import type { IconName } from '../../components/Icon';
import { CodeBlock } from '../CodeBlock';
import { DocsIcon } from '../icons';
import type { DocProp } from '../docs/types';
import { Heading } from '../PageParts';
import { PropsTable } from '../PropsTable';
import { Caption, Specimen, useCopy } from './shared';

// The body of #docs/icons. The grid is the icon set itself (iconNames from Icon.tsx), so a new
// glyph shows up here as soon as it is added.

const path = 'docs/icons';

const usage = `import { Icon } from '@/ui/components';

// Decorative: hidden from assistive tech. 20px unless you say otherwise.
<Icon name="search" />

// On its own, it needs a name.
<Icon name="trash" size={16} title="Delete" />`;

// The same reference every component page has. Defaults match Icon.tsx.
const iconProps: DocProp[] = [
  { name: 'name', type: 'IconName', required: true, description: 'Which glyph. One of the names below.' },
  { name: 'size', type: 'number', default: '20', description: 'Width and height in pixels.' },
  { name: 'strokeWidth', type: 'number', default: '1.7', description: 'Line weight in grid units. The grid is 24 units wide, so the line scales with the icon.' },
  { name: 'title', type: 'string', description: 'An accessible name. Without one the icon is decorative and hidden from assistive tech.' },
];

const snippet = (name: IconName) => `<Icon name="${name}" />`;

// Spaces and dashes are the same thing to someone searching: "arrow left" finds "arrow-left".
const normalize = (text: string) => text.toLowerCase().replace(/[\s_-]+/g, '');

export default function Icons() {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const { copied, copy } = useCopy(1600);
  const inputId = useId();
  const needle = normalize(deferred);
  const shown = needle ? iconNames.filter(name => normalize(name).includes(needle)) : iconNames;

  return (
    <>
      <Heading level={2} id="usage" path={path}>Usage</Heading>
      <p>
        Every glyph sits on a 24px grid and is drawn with lines, arcs and rounded rectangles. Stroke width, caps and joins are set
        once on the icon, so the whole set changes weight together. Icons take <code>currentColor</code>, so they follow the text
        around them.
      </p>
      <CodeBlock code={usage} label="Icon usage" />
      <Heading level={3} id="props" path={path}>Props</Heading>
      <PropsTable name="Icon" props={iconProps} />

      <Heading level={2} id="sizes" path={path}>Sizes</Heading>
      <p>Use 16px beside small text and in dense controls, 20px beside body text, and 24px where an icon stands alone.</p>
      <Specimen id="icon-sizes" label="Icon sizes">
        <div className="pg-icon-sizes">
          {[16, 20, 24].map(size => (
            <div key={size} className="pg-icon-size">
              <span className="pg-icon-size-row" aria-hidden="true">
                <Icon name="bell" size={size} />
                <Icon name="calendar" size={size} />
                <Icon name="settings" size={size} />
              </span>
              <Caption>{size}px</Caption>
            </div>
          ))}
        </div>
      </Specimen>

      <Heading level={2} id="all-icons" path={path}>All icons</Heading>
      <p>Click an icon to copy its JSX.</p>
      <div className="pg-filter" data-docs-raw="">
        <label className="docs-sr" htmlFor={inputId}>Filter icons</label>
        <div className="pg-filter-field">
          <DocsIcon name="search" size={16} />
          <input
            id={inputId}
            className="pg-filter-input"
            type="search"
            placeholder="Filter icons"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </div>
        <span className="pg-filter-count" role="status">
          {shown.length === iconNames.length ? `${iconNames.length} icons` : `${shown.length} of ${iconNames.length}`}
        </span>
      </div>

      {shown.length > 0 ? (
        <ul className="pg-icons" role="list" data-docs-raw="" data-example="icon-grid">
          {shown.map(name => {
            const done = copied === name;
            return (
              <li key={name}>
                <button type="button" className="pg-icon" data-copied={done || undefined} aria-label={`Copy ${snippet(name)}`} onClick={() => copy(snippet(name), name)}>
                  <span className="pg-icon-glyph" aria-hidden="true">
                    <Icon name={name} size={24} />
                  </span>
                  <span className="pg-icon-name" aria-hidden="true">{done ? 'Copied' : name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="pg-empty" data-docs-raw="">No icon matches “{query}”.</p>
      )}
      <span className="docs-sr" role="status">{copied ? `Copied ${snippet(copied as IconName)}.` : ''}</span>
    </>
  );
}
