import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Small from './small';
import smallCode from './small.tsx?raw';

export default defineDoc({
  id: "markdown",
  title: "Markdown",
  category: 'Chat',
  description: "Render an assistant's reply as prose: lists, code, tables and links, built as React elements.",
  source: ["components/markdown.tsx", "components/Icon.tsx", "components/button.tsx", "components/internal/class-name.ts", "components/internal/overlay.tsx", "components/internal/size.ts", "components/internal/states.ts", "tokens.stylex.ts"],
  exports: ["Markdown", "CodeBlock"],
  usage: `import { Markdown } from '@/ui/components';

<Markdown>{reply}</Markdown>`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, align: "stretch", minHeight: 420, stage: "canvas" },
    { id: "small", title: "Small", description: "`size=\"sm\"` sets 14/20 text with 12 px between blocks, for side panels and cards.", Component: Small, code: smallCode, align: "stretch", minHeight: 200, stage: "canvas" },
  ],
  api: [
    {
      name: "Markdown",
      description: "Markdown as prose in the system's type, built as React elements.",
      extends: "<div> attributes",
      props: [
        { name: "children", type: "string", required: true, description: "The Markdown text. It may be partial while it streams." },
        { name: "size", type: "'md' | 'sm'", default: "'md'", description: "16/24 text with 16 px between blocks, or 14/20 with 12." },
      ],
    },
    {
      name: "CodeBlock",
      description: "A fenced code block on its own: the language and Copy on top.",
      props: [
        { name: "code", type: "string", required: true, description: "The code." },
        { name: "language", type: "string", description: "Shown in the header. Default \"Code\"." },
      ],
    },
  ],
  accessibility: [
    "It renders real elements (headings, lists, tables, code), never an HTML string, so a reply cannot inject markup.",
    "Links open in a new tab only when they leave the site, and only http, https, mailto and in-page links are kept.",
    "Code blocks are focusable regions, so keyboard users can scroll them; Copy says \"Copied\" when it works.",
    "Headings in a reply start at level 3, under the page and the thread.",
  ],
});
