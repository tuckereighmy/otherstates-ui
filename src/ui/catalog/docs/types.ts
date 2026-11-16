import type { ComponentType } from 'react';

// The contract for one component page in the Otherstates UI docs.
//
// The authoring guide for these pages, with the rules every page follows, is README.md in this folder.
//
// Each component has a folder: src/ui/catalog/docs/<id>/
//   index.ts        default-exports defineDoc({...})
//   default.tsx     the hero example (default export, self-contained)
//   <example>.tsx   one file per further example
//
// Every example is a real module. The page renders its default export in the
// Preview tab and shows the same file (imported with ?raw) in the Code tab, so
// the code a reader copies is always the code that is on screen.

export const docCategories = ['Forms', 'Layout', 'Navigation', 'Overlays', 'Feedback', 'Chat', 'Agents'] as const;
export type DocCategory = typeof docCategories[number];

export type DocExample = {
  /** kebab-case, unique on the page, and the file name: ./<id>.tsx */
  id: string;
  /** Short heading: "Default", "Sizes", "Disabled", "With icon" */
  title: string;
  /** One sentence saying what this example shows. Omit for the hero. */
  description?: string;
  Component: ComponentType;
  /** The example file's own source: import code from './<id>.tsx?raw' */
  code: string;
  /** How the preview stage places the example. Default 'center'. */
  align?: 'center' | 'start' | 'stretch';
  /** Minimum stage height in px, for examples that open popovers or need room. */
  minHeight?: number;
  /**
   * The stage's fill. Default 'subtle' (bg-subtle). Use 'canvas' (bg-canvas with a border-subtle
   * hairline) when a part of the example is itself filled with bg-subtle and would vanish.
   */
  stage?: 'subtle' | 'canvas';
};

export type DocProp = {
  name: string;
  /** TypeScript type as a reader would write it: "'small' | 'medium' | 'large'" */
  type: string;
  default?: string;
  required?: boolean;
  description: string;
};

export type DocApi = {
  /** Exported component name: "Button", "MenuItem" */
  name: string;
  description?: string;
  /** What the component extends, if anything: "React Aria ButtonProps", "<input> attributes" */
  extends?: string;
  props: DocProp[];
};

export type ComponentDocData = {
  /** kebab-case route id: #component/<id> */
  id: string;
  title: string;
  category: DocCategory;
  /** One sentence, shown under the title. */
  description: string;
  /** Files a consumer copies for this component, relative to src/ui/. */
  source: string[];
  /** Named exports from the component entry point that this page documents. */
  exports: string[];
  /** Minimal usage snippet shown under "Usage" (import line + JSX). */
  usage: string;
  /** The first example is the hero at the top of the page. */
  examples: DocExample[];
  api: DocApi[];
  /** Keyboard and screen-reader notes, one per bullet. */
  accessibility?: string[];
};

export const defineDoc = (doc: ComponentDocData): ComponentDocData => doc;
