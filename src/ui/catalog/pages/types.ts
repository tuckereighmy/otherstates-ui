import type { ComponentType } from 'react';

// The contract for a non-component page in the docs (route: #docs/<id>).
// pages/registry.ts exports `pages: DocPage[]` in sidebar order.

export const pageSections = ['Overview', 'Foundations'] as const;
export type PageSection = typeof pageSections[number];

export type DocPage = {
  /** kebab-case route id: #docs/<id> */
  id: string;
  title: string;
  section: PageSection;
  /** One sentence, shown under the title. */
  description: string;
  Component: ComponentType;
  /** `wide`: no "On this page" column; the page spans both columns, up to 1200px. */
  layout?: 'wide';
  /** Left out of the sidebar, the search palette and the pager; reachable by its address. */
  unlisted?: boolean;
};
