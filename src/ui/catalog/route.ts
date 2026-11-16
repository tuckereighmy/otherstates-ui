import { docsById } from './docs/registry';
import { pagesById } from './pages/registry';
import { templatesById } from './templates/registry';

// Hash routes:
//   #docs/<pageId>            a page from pages/registry
//   #component/<id>           a component page from docs/registry
//   #templates                the template gallery
//   #templates/<id>           one template, framed, with its code
//   #preview/<id>             a template alone, with no docs chrome (main.tsx renders it; the frames load it)
//   …/<anchor>                optional third segment: a heading id on that page
// #catalog and #usage are older links and stay as aliases.

export type Route =
  | { kind: 'page'; id: string; anchor?: string }
  | { kind: 'component'; id: string; anchor?: string }
  /** `id` is empty for the gallery. */
  | { kind: 'template'; id: string; anchor?: string }
  | { kind: 'missing' };

export const homePageId = 'introduction';

const aliases: Record<string, string> = {
  '': `docs/${homePageId}`,
  catalog: `docs/${homePageId}`,
  usage: 'docs/get-started',
};

/** The current address for an older link, or null when the hash is not one of them. */
export function canonicalHash(hash: string): string | null {
  const raw = safeDecode(hash.replace(/^#\/?/, ''));
  return raw && Object.hasOwn(aliases, raw) ? `#${aliases[raw]}` : null;
}

export function parseRoute(hash: string): Route {
  const raw = safeDecode(hash.replace(/^#\/?/, ''));
  const [scope, id = '', anchor] = (Object.hasOwn(aliases, raw) ? aliases[raw] : raw).split('/');
  if (scope === 'docs' && pagesById.has(id)) return { kind: 'page', id, anchor: anchor || undefined };
  if (scope === 'component' && docsById.has(id)) return { kind: 'component', id, anchor: anchor || undefined };
  if (scope === 'templates' && (id === '' || templatesById.has(id))) return { kind: 'template', id, anchor: (id && anchor) || undefined };
  return { kind: 'missing' };
}

/** The template id in a #preview/<id> address, or null when the hash is something else. */
export function parsePreview(hash: string): string | null {
  const [scope, id = ''] = safeDecode(hash.replace(/^#\/?/, '')).split('/');
  return scope === 'preview' && templatesById.has(id) ? id : null;
}

/** "docs/introduction", "component/button", "templates/overview": the hash without # and without an anchor. */
export function routePath(route: Route): string {
  if (route.kind === 'component') return `component/${route.id}`;
  if (route.kind === 'template') return route.id ? `templates/${route.id}` : 'templates';
  return `docs/${route.kind === 'page' ? route.id : homePageId}`;
}

export const pageHref = (id: string) => `#docs/${id}`;
export const componentHref = (id: string) => `#component/${id}`;
export const templateHref = (id?: string) => (id ? `#templates/${id}` : '#templates');
export const previewHref = (id: string) => `#preview/${id}`;

function safeDecode(value: string) {
  try { return decodeURIComponent(value); }
  catch { return value; }
}
