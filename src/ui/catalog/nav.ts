import { docs } from './docs/registry';
import { pages } from './pages/registry';
import { pageSections } from './pages/types';
import { componentHref, pageHref, templateHref } from './route';
import { templates } from './templates/registry';

// One navigation model for the sidebar, the phone sheet, the command palette and the pager.

export type NavItem = {
  /** The hash path without #: "docs/introduction", "component/button", "templates/overview". */
  path: string;
  href: string;
  title: string;
  /** Shown beside the title in the palette: the component's category. */
  hint?: string;
};

export type NavGroup = { label: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  ...pageSections.map(section => ({
    label: section as string,
    items: pages
      .filter(page => page.section === section && !page.unlisted)
      .map(page => ({ path: `docs/${page.id}`, href: pageHref(page.id), title: page.title })),
  })),
  {
    label: 'Templates',
    items: [
      { path: 'templates', href: templateHref(), title: 'All templates' },
      ...templates.map(template => ({ path: `templates/${template.id}`, href: templateHref(template.id), title: template.title, hint: 'Template' })),
    ],
  },
  {
    label: 'Components',
    items: docs.filter(doc => doc.category !== 'Agents' && doc.category !== 'Chat').map(doc => ({ path: `component/${doc.id}`, href: componentHref(doc.id), title: doc.title, hint: doc.category })),
  },
  // Chat and agent interfaces get their own groups, so the core components stay one short list.
  {
    label: 'Chat',
    items: docs.filter(doc => doc.category === 'Chat').map(doc => ({ path: `component/${doc.id}`, href: componentHref(doc.id), title: doc.title, hint: doc.category })),
  },
  {
    label: 'Agents',
    items: docs.filter(doc => doc.category === 'Agents').map(doc => ({ path: `component/${doc.id}`, href: componentHref(doc.id), title: doc.title, hint: doc.category })),
  },
].filter(group => group.items.length > 0);

/** Every page in reading order, for previous and next links. */
export const navSequence: NavItem[] = navGroups.flatMap(group => group.items);

export function neighbors(path: string): { previous?: NavItem; next?: NavItem } {
  const index = navSequence.findIndex(item => item.path === path);
  if (index < 0) return {};
  return { previous: navSequence[index - 1], next: navSequence[index + 1] };
}
