import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Units from './units';
import unitsCode from './units.tsx?raw';

export default defineDoc({
  id: "rolling-number",
  title: "Rolling number",
  category: 'Agents',
  description: "Show a figure that counts its way to a new value.",
  source: ["components/rolling-number.tsx", "components/internal/class-name.ts", "components/internal/sr-only.tsx", "tokens.stylex.ts"],
  exports: ["RollingNumber"],
  usage: `import { RollingNumber } from '@/ui/components';

<RollingNumber value="$1.62" />`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode },
    { id: "units", title: "When the unit changes", description: "The number counts while the words around it stay the same (24.4k to 102.6k to 980k). When they change (980k to 1.3M), the figure swaps at once, since counting across units would show values that never existed.", Component: Units, code: unitsCode },
  ],
  api: [
    {
      name: "RollingNumber",
      description: "A figure that counts to its new value.",
      extends: "<span> attributes",
      props: [
        { name: "value", type: "string", required: true, description: "The figure as it should read: \"175.6k\", \"$1.62\", \"74%\"." },
        { name: "direction", type: "'up' | 'down'", description: "Deprecated, no effect: the figure counts toward its new value." },
        { name: "stagger", type: "number", description: "Deprecated, no effect." },
      ],
    },
  ],
  accessibility: [
    "The final value is read as one piece of visually hidden text; the counting figure is hidden from assistive tech, so only the value it lands on is announced.",
    "Put it inside a live region (or one you already have) when a change should be announced.",
    "The count takes `--os-motion-layout` on `--os-ease-settle`, read from the theme. Under reduced motion the figure swaps without counting.",
  ],
});
