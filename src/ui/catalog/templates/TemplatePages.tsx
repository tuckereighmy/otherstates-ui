import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { CodeBlock } from '../CodeBlock';
import { docsById } from '../docs/registry';
import { DocsIcon } from '../icons';
import { Boundary, Heading, PageHead, Pager } from '../PageParts';
import { displaySource } from '../PreviewStage';
import { componentHref, previewHref, templateHref } from '../route';
import { templates, templatesById } from './registry';
import './templates.css';

// The docs pages for templates (#templates, #templates/<id>) and the screen on its own (#preview/<id>).
//
// A template is framed as an iframe of its #preview route, laid out at a desktop size and scaled down
// to the column. Inside the frame the window is 1280 px wide, so the Sidebar's media query and every
// overlay behave as they would in a real app. The frame shares this origin's localStorage, and main.tsx
// and the RecipeProvider follow the `storage` event, so the theme and a Customize recipe stay in step.

const frame = { width: 1280, height: 800 };

type TemplateRouteProps = { id: string; path: string; titleRef: RefObject<HTMLHeadingElement | null> };

/** #templates (empty id) or #templates/<id>, inside the docs shell. */
export function TemplateRoute({ id, path, titleRef }: TemplateRouteProps) {
  return id ? <TemplateView id={id} path={path} titleRef={titleRef} /> : <TemplateGallery path={path} titleRef={titleRef} />;
}

function TemplateGallery({ path, titleRef }: Omit<TemplateRouteProps, 'id'>) {
  const titleId = useId();
  return (
    <article className="docs-prose" aria-labelledby={titleId}>
      <PageHead
        eyebrow="Templates"
        title="Templates"
        lead="Whole screens built only from the library’s components. Open one to try it at full size, read its code, and copy it as a starting point."
        titleId={titleId}
        titleRef={titleRef}
      />
      <ul className="tpl-grid" data-docs-raw>
        {templates.map(template => (
          <li key={template.id} className="tpl-card">
            <TemplateFrame id={template.id} title={`${template.title} template thumbnail`} thumbnail />
            <div className="tpl-card-body">
              <a className="tpl-card-title" href={templateHref(template.id)}>{template.title}</a>
              <p className="tpl-card-text">{template.summary}</p>
            </div>
          </li>
        ))}
      </ul>
      <Pager path={path} />
    </article>
  );
}

function TemplateView({ id, path, titleRef }: TemplateRouteProps) {
  const titleId = useId();
  const template = templatesById.get(id);
  if (!template) return null;
  return (
    <article className="docs-prose" aria-labelledby={titleId}>
      <PageHead eyebrow="Templates" title={template.title} lead={template.description} titleId={titleId} titleRef={titleRef} />
      <Tabs className="docs-example tpl-example" defaultSelectedKey="preview">
        <div className="tpl-bar" data-docs-raw>
          <TabList className="docs-tabs" aria-label={`${template.title} template`}>
            <Tab id="preview" className="docs-tab">Preview</Tab>
            <Tab id="code" className="docs-tab">Code</Tab>
          </TabList>
          <a className="tpl-open" href={previewHref(template.id)} target="_blank" rel="noopener">
            Open full screen
            <DocsIcon name="arrowRight" size={14} />
          </a>
        </div>
        <TabPanel id="preview" className="docs-tabpanel">
          <TemplateFrame id={template.id} title={`${template.title} template`} />
        </TabPanel>
        <TabPanel id="code" className="docs-tabpanel">
          <CodeBlock code={displaySource(template.code)} label={`${template.title} template source`} />
        </TabPanel>
      </Tabs>

      <Heading level={2} id="components" path={path}>Components used</Heading>
      <p>Every part of the screen is one of these, laid out with StyleX and the tokens. Nothing else is imported.</p>
      <ul className="tpl-chips" data-docs-raw>
        {template.components.map(component => (
          <li key={component}><a className="tpl-chip" href={componentHref(component)}>{docsById.get(component)?.title ?? component}</a></li>
        ))}
      </ul>

      <Heading level={2} id="files" path={path}>Files</Heading>
      <p>
        The template lives in <code>catalog/templates/{template.id}/</code>. <code>index.tsx</code> is the screen,
        shown under Code; <code>data.ts</code> holds its sample data. Code shows the imports as <code>@/ui/components</code>,
        the alias a project would use. The screen fills its parent, so give that parent a height, such as the full window.
      </p>
      <Pager path={path} />
    </article>
  );
}

// Frames load one at a time. Each is a whole copy of the app, and the dev server serves that as
// hundreds of modules: three at once run the browser out of connections.
let frameQueue: Promise<void> = Promise.resolve();

function useFrameTurn(url: string) {
  const [src, setSrc] = useState<string>();
  const release = useRef<() => void>(() => {});
  useEffect(() => {
    let alive = true;
    frameQueue = frameQueue.then(() => new Promise<void>(resolve => {
      if (!alive) return resolve();
      release.current = resolve;
      setSrc(url);
      // A frame that never finishes loading does not hold up the others.
      window.setTimeout(resolve, 8000);
    }));
    return () => {
      alive = false;
      release.current();
    };
  }, [url]);
  return { src, onLoad: () => release.current() };
}

type TemplateFrameProps = { id: string; title: string; thumbnail?: boolean };

/** The template's #preview route at 1280 × 800, scaled to the width it is given. */
function TemplateFrame({ id, title, thumbnail = false }: TemplateFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const turn = useFrameTurn(`${location.pathname}${previewHref(id)}`);

  useLayoutEffect(() => {
    const box = ref.current;
    if (!box) return;
    const measure = () => { if (box.clientWidth > 0) setScale(Math.min(1, box.clientWidth / frame.width)); };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const style = { '--tpl-scale': scale, '--tpl-width': `${frame.width}px`, '--tpl-height': `${frame.height}px` } as CSSProperties;
  return (
    <div ref={ref} className="tpl-frame" data-thumbnail={thumbnail || undefined} data-ready={scale > 0 || undefined} style={style}>
      <iframe
        src={turn.src}
        onLoad={turn.onLoad}
        title={title}
        width={frame.width}
        height={frame.height}
        tabIndex={thumbnail ? -1 : undefined}
        aria-hidden={thumbnail || undefined}
      />
    </div>
  );
}

/** #preview/<id>: the template alone, filling the window. */
export function TemplateFullScreen({ id }: { id: string }) {
  const template = templatesById.get(id);
  useLayoutEffect(() => {
    if (template) document.title = `${template.title} template — Otherstates UI`;
  }, [template]);
  if (!template) return null;
  const Screen = template.Component;
  return (
    <div className="tpl-fullscreen">
      <Boundary fallback={<p className="tpl-error" role="status">This template could not be rendered.</p>}>
        <Screen />
      </Boundary>
    </div>
  );
}
