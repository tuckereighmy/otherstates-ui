import { useRef, type ReactNode } from 'react';
import type { DocProp } from './docs/types';
import { inlineCode } from './PageParts';
import { useScrollsSideways } from './useScrollable';

type PropsTableProps = {
  /** The component the props belong to; names the table for assistive tech. */
  name: string;
  props: DocProp[];
};

// A type too long for its column wraps at a space or after an opening bracket,
// so `(event: MouseEvent<HTMLButtonElement>) => void` never splits in the middle of a name.
// In a union the bar stays with the member before it, so every wrapped line ends in "|".
function withBreaks(type: string): ReactNode[] {
  const out: ReactNode[] = [];
  type.replace(/ \| /g, ' | ').split(/([(<[])/).forEach((part, index) => {
    if (!part) return;
    out.push(part);
    if (index % 2 === 1) out.push(<wbr key={index} />);
  });
  return out;
}

// A long prop name wraps where its words meet: shouldCloseOn|InteractOutside, not mid-word.
function nameWithBreaks(name: string): ReactNode[] {
  return name.split(/(?=[A-Z][a-z])/).flatMap((part, index) => (index === 0 ? [part] : [<wbr key={index} />, part]));
}

export function PropsTable({ name, props }: PropsTableProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrolls = useScrollsSideways(wrapRef);
  return (
    // The wrapper scrolls sideways only if a column cannot fit; while it does, it is a tab stop.
    // Below 560px the rows stack instead (see "Props table" in catalog.css).
    <div className="docs-table-wrap" ref={wrapRef} tabIndex={scrolls ? 0 : undefined} role="group" aria-label={`${name} props`}>
      <table className="docs-table">
        {/* Fixed columns: every table on a page lines up with the one above it. */}
        <colgroup>
          <col className="docs-table-col-prop" />
          <col className="docs-table-col-type" />
          <col className="docs-table-col-default" />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map(prop => (
            <tr key={prop.name}>
              <th scope="row">
                {/* The badge sits beside a short name and wraps under a long one, flush with it. */}
                <span className="docs-table-name">
                  <code>{nameWithBreaks(prop.name)}</code>
                  {prop.required && <span className="docs-table-required">Required</span>}
                </span>
              </th>
              <td data-label="Type"><code className="docs-table-type">{withBreaks(prop.type)}</code></td>
              <td data-label="Default" data-empty={prop.default ? undefined : ''}>
                {prop.default
                  ? <code>{withBreaks(prop.default)}</code>
                  : <span className="docs-table-none"><span aria-hidden="true">–</span><span className="docs-sr">None</span></span>}
              </td>
              <td>{inlineCode(prop.description)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
