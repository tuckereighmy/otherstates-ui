import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { CodeBlock } from './CodeBlock';
import type { DocExample } from './docs/types';
import { Boundary } from './PageParts';

type PreviewStageProps = {
  example: DocExample;
  /** Names the tabs for assistive tech: "Button: Sizes". */
  label: string;
  /** The first example on a page gets a taller stage. */
  hero?: boolean;
};

// The example files import from the library by relative path. Readers copy them into their own
// project, so the Code tab shows the alias a project would use. Display only.
export function displaySource(code: string) {
  return code.replace(/(['"])\.\.\/\.\.\/\.\.\/(components|tokens\.stylex)(?=['"/])/g, '$1@/ui/$2');
}

// A link inside a live example is part of the demo. The docs are routed by hash, so following
// href="#" would leave the page the reader is on. React delivers the click here even when the
// link sits in a popover that renders outside the stage.
function stayOnPage(event: MouseEvent<HTMLElement>) {
  const link = (event.target as Element).closest?.('a[href]');
  if (link?.getAttribute('href')?.startsWith('#')) event.preventDefault();
}

// The stage's height, kept while the Code tab is open (the preview panel unmounts then), so the
// code block can be at least as tall and the page below does not move when the tabs switch.
function useStageHeight() {
  const [height, setHeight] = useState<number>();
  const observer = useRef<ResizeObserver | null>(null);
  useEffect(() => () => observer.current?.disconnect(), []);
  const ref = useCallback((stage: HTMLDivElement | null) => {
    observer.current?.disconnect();
    observer.current = null;
    if (!stage) return;
    // A detached or hidden stage measures 0: keep the last real height.
    const measure = () => { if (stage.offsetHeight > 0) setHeight(stage.offsetHeight); };
    measure();
    observer.current = new ResizeObserver(measure);
    observer.current.observe(stage);
  }, []);
  return { height, ref };
}

export function PreviewStage({ example, label, hero = false }: PreviewStageProps) {
  const Example = example.Component;
  const stage = useStageHeight();
  const style = stage.height ? ({ '--docs-stage-height': `${stage.height}px` } as CSSProperties) : undefined;
  return (
    <Tabs className="docs-example" defaultSelectedKey="preview" style={style}>
      <TabList className="docs-tabs" aria-label={label}>
        <Tab id="preview" className="docs-tab">Preview</Tab>
        <Tab id="code" className="docs-tab">Code</Tab>
      </TabList>
      <TabPanel id="preview" className="docs-tabpanel">
        {/* The stage wraps the example directly: the screenshot harness crops by data-example. */}
        <div
          ref={stage.ref}
          className="docs-stage"
          data-example={example.id}
          data-align={example.align ?? 'center'}
          data-stage={example.stage ?? 'subtle'}
          onClick={stayOnPage}
          style={{ minHeight: example.minHeight ?? (hero ? 280 : 200) }}
        >
          <Boundary key={example.code} fallback={<p className="docs-stage-error" role="status">This example could not be rendered.</p>}>
            <Example />
          </Boundary>
        </div>
      </TabPanel>
      <TabPanel id="code" className="docs-tabpanel">
        <CodeBlock code={displaySource(example.code)} label={`${label} source`} />
      </TabPanel>
    </Tabs>
  );
}
