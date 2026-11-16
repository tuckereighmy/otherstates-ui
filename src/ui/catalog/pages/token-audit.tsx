import { useMemo, useState } from 'react';
import { docs } from '../docs/registry';
import { Boundary } from '../PageParts';
import { applyLitmus, classifyFocus, litmusTheme, sweep } from '../../customize/litmus';
import type { Finding, LitmusContext, LitmusPass, LitmusTheme, Report } from '../../customize/litmus';
import type { Scheme } from '../../customize/types';

// Token audit (dev only, route #docs/token-audit, unlisted): the Litmus stress sweep.
// It mounts every example from the docs registry, applies a stress theme where every token has a
// unique value, and classifies computed styles. The Playwright runner drives it through
// window.__osLitmus; the table below shows the last run. Registered in pages/registry.ts behind
// import.meta.env.DEV, so the production bundle never contains it.

type LitmusApi = {
  /** Applies the stress theme for a pass and scheme to <html>. */
  apply(pass: LitmusPass, scheme: Scheme): void;
  /** Removes every stress value. */
  reset(): void;
  /** Sweeps every example (or the given nodes, under one group) with the applied theme. */
  run(options?: { nodes?: Element[]; group?: string }): Report;
  /** Checks the focused element's ring. */
  focus(): Finding[];
  /** Examples whose stage holds a trigger: [selectorIndex, group]. Marks each with data-litmus-trigger. */
  triggers(): { index: number; group: string }[];
};

declare global {
  interface Window { __osLitmus?: LitmusApi }
}

const groupOf = (el: Element) => el.closest('[data-litmus-example]')?.getAttribute('data-litmus-example') ?? 'shell';

export default function TokenAudit() {
  const [report, setReport] = useState<Report | null>(null);
  const state = useMemo(() => ({ theme: null as LitmusTheme | null, scheme: 'light' as Scheme, cleanup: null as null | (() => void) }), []);

  useMemo(() => {
    const ctx = (): LitmusContext => {
      if (!state.theme) throw new Error('Call apply(pass, scheme) first.');
      return { theme: state.theme, scheme: state.scheme, groupOf };
    };
    window.__osLitmus = {
      apply(pass, scheme) {
        state.cleanup?.();
        state.theme = litmusTheme(pass);
        state.scheme = scheme;
        state.cleanup = applyLitmus(state.theme[scheme]);
      },
      reset() { state.cleanup?.(); state.cleanup = null; state.theme = null; },
      run(options = {}) {
        const c = ctx();
        const roots = options.nodes ?? [document.querySelector('[data-litmus-examples]')!];
        const next = sweep(roots, options.group ? { ...c, groupOf: () => options.group! } : c);
        if (!options.nodes) setReport(next);
        return next;
      },
      focus() { const el = document.activeElement; return el && el !== document.body ? classifyFocus(el, ctx()) : []; },
      triggers() {
        const found: { index: number; group: string }[] = [];
        document.querySelectorAll('[data-litmus-example] :is([aria-haspopup]:not([aria-haspopup="false"]), [aria-expanded="false"])').forEach((el, index) => {
          el.setAttribute('data-litmus-trigger', String(index));
          found.push({ index, group: groupOf(el) });
        });
        return found;
      },
    };
  }, [state]);

  const examples = docs.flatMap(doc => doc.examples.map(example => ({ doc, example })));
  return (
    <div>
      <p>
        Every example from the component pages ({examples.length} in all), for the stress sweep. Run it with the
        Playwright runner; the last run is listed here.
      </p>
      <div data-litmus-ignore data-docs-raw>
        {report && (
          <>
            <p>{report.pass} pass, {report.scheme}: {report.elements} elements, {report.totals.error} errors, {report.totals.warning} warnings, {report.totals.info} notes.</p>
            <table>
              <thead><tr><th>Severity</th><th>Group</th><th>Property</th><th>Value</th><th>Detail</th></tr></thead>
              <tbody>
                {report.findings.slice(0, 300).map((f, i) => (
                  <tr key={i}><td>{f.severity}</td><td>{f.group}</td><td>{f.property}</td><td>{f.value}</td><td>{f.detail} ({f.count})</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      <div data-litmus-examples style={{ display: 'grid', gap: 16 }}>
        {examples.map(({ doc, example }) => {
          const Example = example.Component;
          return (
            <div
              key={`${doc.id}/${example.id}`}
              className="docs-stage"
              data-litmus-example={`${doc.id}/${example.id}`}
              data-align={example.align ?? 'center'}
              data-stage={example.stage ?? 'subtle'}
              style={{ minHeight: example.minHeight ?? 120 }}
            >
              <Boundary fallback={<p role="status">{doc.id}/{example.id} could not be rendered.</p>}>
                <Example />
              </Boundary>
            </div>
          );
        })}
      </div>
    </div>
  );
}
