import type { ComponentDocData } from './types';

// Every folder in docs/ with an index.ts is a component page. Nothing else registers them.
const modules = import.meta.glob<{ default: ComponentDocData }>('./*/index.ts', { eager: true });

export const docs: ComponentDocData[] = Object.values(modules)
  .map(module => module.default)
  .sort((a, b) => a.title.localeCompare(b.title, 'en'));

export const docsById: ReadonlyMap<string, ComponentDocData> = new Map(docs.map(doc => [doc.id, doc]));
