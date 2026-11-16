import { createElement, lazy, Suspense } from 'react';
import { docs } from '../docs/registry';
import Colors from './colors';
import Customize from './customize';
import Elevation from './elevation';
import GetStarted from './get-started';
import Icons from './icons';
import Introduction from './introduction';
import Motion from './motion';
import Radius from './radius';
import SpacingAndSizing from './spacing-and-sizing';
import Styling from './styling';
import Typography from './typography';
import type { DocPage } from './types';
import './pages.css';

// Dev only: the token audit (stress sweep). Vite replaces import.meta.env.DEV with false in
// production builds, so the dynamic import below and everything behind it leave the bundle.
const TokenAudit = import.meta.env.DEV ? lazy(() => import('./token-audit')) : null;
const devPages: DocPage[] = TokenAudit
  ? [{
      id: 'token-audit',
      title: 'Token audit',
      section: 'Foundations',
      description: 'Development only. Every example under a stress theme, to prove each component reads its tokens.',
      layout: 'wide',
      unlisted: true,
      Component: () => createElement(Suspense, { fallback: null }, createElement(TokenAudit)),
    }]
  : [];

// Non-component pages, in sidebar order. Route: #docs/<id>.
// The shell renders the section, title and description; Component renders the body.
// To add a page: write pages/<id>.tsx with a default export, then add an entry here.
//
// Writing a page body:
// - Plain h2, h3, p, ul, ol, a, code, kbd, hr and table are styled as prose (see "Prose" in
//   catalog.css). Every h2 and h3 is listed under "On this page"; ids are added for you.
// - Wrap anything that should not get prose styles or a place in that list in data-docs-raw.
// - Shared pieces: CodeBlock (../CodeBlock), Heading for a heading that links to itself
//   (../PageParts), and the classes docs-actions, docs-button, docs-cards, docs-card and
//   docs-note in catalog.css. Parts only these pages use live in ./shared.tsx and ./pages.css.
export const pages: DocPage[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    section: 'Overview',
    description: `Otherstates UI is a set of ${docs.length} React components, built on React Aria and styled with StyleX. You copy the source into your project and change it like any other code you own.`,
    Component: Introduction,
  },
  {
    id: 'get-started',
    title: 'Get started',
    section: 'Overview',
    description: 'Install everything with one command, or set it up by hand: compile StyleX, copy the tokens and the components you need, and load the typeface.',
    Component: GetStarted,
  },
  {
    id: 'styling',
    title: 'Styling',
    section: 'Overview',
    description: 'Every component reads one set of tokens. Change them for the whole app, for one part of it, or for dark mode.',
    Component: Styling,
  },
  {
    id: 'customize',
    title: 'Customize',
    section: 'Overview',
    description: 'Choose an accent, neutrals, corners and a typeface. Every page of this site follows along in light and dark, and you leave with code to paste.',
    layout: 'wide',
    Component: Customize,
  },
  {
    id: 'colors',
    title: 'Colors',
    section: 'Foundations',
    description: 'Every color token in the contract, grouped by job, with the value it has in the theme on screen.',
    Component: Colors,
  },
  {
    id: 'typography',
    title: 'Typography',
    section: 'Foundations',
    description: 'One typeface, a short size scale and a few weights, tuned for dense interfaces.',
    Component: Typography,
  },
  {
    id: 'spacing-and-sizing',
    title: 'Spacing and sizing',
    section: 'Foundations',
    description: 'The space scale for gaps and padding, and the heights that controls are built on.',
    Component: SpacingAndSizing,
  },
  {
    id: 'radius',
    title: 'Radius',
    section: 'Foundations',
    description: 'Corner radii from small parts to full pills, and how to nest one rounded shape inside another.',
    Component: Radius,
  },
  {
    id: 'elevation',
    title: 'Elevation',
    section: 'Foundations',
    description: 'Shadows for surfaces that sit above the page, and the ring that shows keyboard focus.',
    Component: Elevation,
  },
  {
    id: 'motion',
    title: 'Motion',
    section: 'Foundations',
    description: 'The duration and easing tokens, what each is for, and what changes when a reader asks for less motion.',
    Component: Motion,
  },
  {
    id: 'icons',
    title: 'Icons',
    section: 'Foundations',
    description: 'The icon set, drawn on a 24px grid with a single stroke. Click any icon to copy it.',
    Component: Icons,
  },
  ...devPages,
];

export const pagesById: ReadonlyMap<string, DocPage> = new Map(pages.map(page => [page.id, page]));
