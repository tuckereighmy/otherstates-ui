import { useId, type ReactNode, type RefObject } from 'react';
import { CodeBlock } from './CodeBlock';
import type { ComponentDocData } from './docs/types';
import { Heading, inlineCode, PageHead, Pager, slug } from './PageParts';
import { PreviewStage } from './PreviewStage';
import { PropsTable } from './PropsTable';
import { pageHref } from './route';

type ComponentDocProps = {
  doc: ComponentDocData;
  titleRef: RefObject<HTMLHeadingElement | null>;
};

// Section ids on every component page. An example that happens to share one gets a prefix.
const sectionIds = new Set(['installation', 'usage', 'examples', 'api-reference', 'accessibility']);
const exampleAnchor = (id: string) => (sectionIds.has(id) ? `example-${id}` : id);

// "React Aria ButtonProps" or "<input> attributes": the type or the element is set as code.
function extendsLine(text: string): ReactNode {
  if (text.includes('`')) return inlineCode(text);
  return text.split(/(\b[A-Z][A-Za-z0-9]*(?:Props|Attributes)\b|<[a-z][a-z0-9-]*>)/).map((part, index) => (index % 2 === 1 ? <code key={index}>{part}</code> : part));
}

export function ComponentDoc({ doc, titleRef }: ComponentDocProps) {
  const titleId = useId();
  const path = `component/${doc.id}`;
  const [hero, ...examples] = doc.examples;
  const files = doc.source.map(file => `src/ui/${file}`);
  const notes = doc.accessibility ?? [];

  return (
    <article className="docs-prose" aria-labelledby={titleId}>
      <PageHead eyebrow={doc.category} title={doc.title} lead={doc.description} titleId={titleId} titleRef={titleRef} />

      {hero && (
        <div className="docs-hero">
          <PreviewStage example={hero} label={`${doc.title} example`} hero />
        </div>
      )}

      <Heading level={2} id="installation" path={path}>Installation</Heading>
      <ol className="docs-steps" role="list">
        <li>
          <p>Copy {files.length === 1 ? 'this file' : 'these files'} into your project, keeping the same folders.</p>
          <CodeBlock code={files.join('\n')} language="text" label="Files to copy" />
        </li>
        <li>
          <p>
            Make sure the tokens, the theme and <code>base.css</code> are in place. <a href={pageHref('get-started')}>Get started</a> covers that setup, which you do once.
          </p>
        </li>
      </ol>

      <Heading level={2} id="usage" path={path}>Usage</Heading>
      <CodeBlock code={doc.usage} label={`${doc.title} usage`} />

      {examples.length > 0 && (
        <>
          <Heading level={2} id="examples" path={path}>Examples</Heading>
          {examples.map(example => (
            <section key={example.id} className="docs-section">
              <Heading level={3} id={exampleAnchor(example.id)} path={path}>{example.title}</Heading>
              {example.description && <p>{inlineCode(example.description)}</p>}
              <PreviewStage example={example} label={`${doc.title}: ${example.title}`} />
            </section>
          ))}
        </>
      )}

      {doc.api.length > 0 && (
        <>
          <Heading level={2} id="api-reference" path={path}>API reference</Heading>
          {doc.api.map(api => (
            <section key={api.name} className="docs-section">
              <Heading level={3} id={`api-${slug(api.name)}`} path={path}><code>{api.name}</code></Heading>
              {api.description && <p>{inlineCode(api.description)}</p>}
              {api.extends && <p className="docs-extends">Extends {extendsLine(api.extends.replace(/\.$/, ''))}.</p>}
              {api.props.length > 0 && <PropsTable name={api.name} props={api.props} />}
            </section>
          ))}
        </>
      )}

      {notes.length > 0 && (
        <>
          <Heading level={2} id="accessibility" path={path}>Accessibility</Heading>
          <ul>
            {notes.map(note => <li key={note}>{inlineCode(note)}</li>)}
          </ul>
        </>
      )}

      <Pager path={path} />
    </article>
  );
}
