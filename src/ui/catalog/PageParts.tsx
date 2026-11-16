import { Component, type ReactNode, type RefObject } from 'react';
import { DocsIcon } from './icons';
import { neighbors } from './nav';

// The pieces every docs page shares: the title block, linkable headings, and previous / next.

type PageHeadProps = {
  eyebrow: string;
  title: string;
  lead: string;
  titleId: string;
  /** The shell moves focus here after a route change. */
  titleRef: RefObject<HTMLHeadingElement | null>;
};

export function PageHead({ eyebrow, title, lead, titleId, titleRef }: PageHeadProps) {
  return (
    <header className="docs-page-head">
      <p className="docs-eyebrow">{eyebrow}</p>
      <h1 className="docs-title" id={titleId} ref={titleRef} tabIndex={-1}>{title}</h1>
      <p className="docs-lead">{lead}</p>
    </header>
  );
}

type HeadingProps = {
  level: 2 | 3;
  /** Unique on the page. The heading is reachable at #<path>/<id>. */
  id: string;
  /** The page's hash path: "component/button". */
  path: string;
  children: ReactNode;
};

export function Heading({ level, id, path, children }: HeadingProps) {
  const Tag = level === 2 ? 'h2' : 'h3';
  return (
    <Tag id={id}>
      <a className="docs-anchor" href={`#${path}/${id}`}>{children}</a>
    </Tag>
  );
}

export function Pager({ path }: { path: string }) {
  const { previous, next } = neighbors(path);
  if (!previous && !next) return null;
  return (
    <nav className="docs-pager" aria-label="Previous and next page">
      {previous && (
        <a className="docs-pager-link" data-direction="previous" href={previous.href} rel="prev">
          <span className="docs-pager-label">Previous</span>
          <span className="docs-pager-title"><DocsIcon name="arrowLeft" size={14} />{previous.title}</span>
        </a>
      )}
      {next && (
        <a className="docs-pager-link" data-direction="next" href={next.href} rel="next">
          <span className="docs-pager-label">Next</span>
          <span className="docs-pager-title">{next.title}<DocsIcon name="arrowRight" size={14} /></span>
        </a>
      )}
    </nav>
  );
}

type BoundaryProps = { fallback: ReactNode; children: ReactNode };

/** Keeps one broken example or page from taking the whole site down. Remount it (change its key) to retry. */
export class Boundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Short doc text with code in it: a name between backticks is set as code. Used for example and
 * API descriptions, prop descriptions and accessibility notes, which are plain strings.
 */
export function inlineCode(text: string): ReactNode {
  if (!text.includes('`')) return text;
  return text.split(/`([^`]+)`/).map((part, index) => (index % 2 === 1 ? <code key={index}>{part}</code> : part));
}

export function slug(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
