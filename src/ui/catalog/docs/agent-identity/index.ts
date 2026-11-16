import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithState from './with-state';
import withStateCode from './with-state.tsx?raw';
import Colors from './colors';
import colorsCode from './colors.tsx?raw';
import Glyphs from './glyphs';
import glyphsCode from './glyphs.tsx?raw';
import Small from './small';
import smallCode from './small.tsx?raw';

export default defineDoc({
  id: "agent-identity",
  title: "Agent identity",
  category: 'Agents',
  description: "Show which agent is acting: its tile, name and model.",
  source: ["components/agent-identity.tsx", "components/Icon.tsx", "components/agent-status.tsx", "components/badge.tsx", "components/internal/class-name.ts", "components/internal/sr-only.tsx", "components/internal/states.ts", "tokens.stylex.ts"],
  exports: ["AgentIdentity", "AgentGlyph", "AgentColor"],
  usage: `import { AgentIdentity } from '@/ui/components';

<AgentIdentity name="Researcher" model="Standard model" />`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode },
    { id: "with-state", title: "With state and trailing content", description: "`state` puts a dot on the tile; `end` holds a badge, a cost or a menu.", Component: WithState, code: withStateCode },
    { id: "colors", title: "Colors", description: "When several agents share a view, `color` tells them apart with the chart palette, in order.", Component: Colors, code: colorsCode },
    { id: "glyphs", title: "Glyph sizes", description: "`AgentGlyph` alone at 20, 24, 32 and 40 px, with an initial or an icon.", Component: Glyphs, code: glyphsCode },
    { id: "small", title: "Small", description: "`size=\"sm\"` sets a 24 px tile beside the name alone, for dense rows.", Component: Small, code: smallCode },
  ],
  api: [
    {
      name: "AgentIdentity",
      description: "An agent's tile, name and model on one row.",
      extends: "<div> attributes",
      props: [
        { name: "name", type: "string", required: true, description: "The agent's name." },
        { name: "model", type: "ReactNode", description: "The model or role under the name. Hidden at `sm`." },
        { name: "icon", type: "IconName", description: "A glyph from the icon set instead of the initial." },
        { name: "color", type: "1 | 2 | 3 | 4 | 5", description: "A chart color for the tile, when several agents share a view." },
        { name: "size", type: "'sm' | 'md'", default: "'md'", description: "`sm`: a 24 px tile beside one line. `md`: a 32 px tile beside the name and model." },
        { name: "state", type: "AgentState", description: "Puts a state dot on the tile and adds the state to the name for screen readers." },
        { name: "end", type: "ReactNode", description: "Trailing content: a StatusBadge, a cost, a menu." },
      ],
    },
    {
      name: "AgentGlyph",
      description: "An agent's tile: a rounded square with an initial or a glyph.",
      extends: "<span> attributes",
      props: [
        { name: "name", type: "string", required: true, description: "The source of the initial and the accessible name." },
        { name: "icon", type: "IconName", description: "A glyph instead of the initial." },
        { name: "color", type: "1 | 2 | 3 | 4 | 5", description: "A chart color. Default neutral." },
        { name: "size", type: "'xs' | 'sm' | 'md' | 'lg'", default: "'sm'", description: "20, 24, 32 or 40 px." },
        { name: "state", type: "AgentState", description: "A state dot at the bottom end." },
        { name: "decorative", type: "boolean", default: "false", description: "Hides the tile from assistive tech when the name is written next to it." },
      ],
    },
  ],
  accessibility: [
    "Agents are squares and people are circles, so the two never read as the same thing.",
    "`AgentGlyph` is an image named after the agent (and its state), unless it is `decorative`.",
    "In `AgentIdentity` the tile is decorative and the written name carries the identity and the state.",
    "Agent colors come from the chart palette, which is checked for color-vision differences; the name is always written too.",
  ],
});
