import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Pressable from './pressable';
import pressableCode from './pressable.tsx?raw';
import Limit from './limit';
import limitCode from './limit.tsx?raw';

export default defineDoc({
  id: "stat",
  title: "Stat",
  category: 'Feedback',
  description: "Show one number that matters, with the change, limit or trend that gives it meaning.",
  source: ["components/stat.tsx", "components/Icon.tsx", "components/chart.tsx", "components/internal/class-name.ts", "components/internal/sr-only.tsx", "components/internal/states.ts", "components/internal/surface.ts", "components/rolling-number.tsx", "tokens.stylex.ts"],
  exports: ["Stat"],
  usage: `import { Stat } from '@/ui/components';

<Stat label="Spend today" value="$18.40" unit="of $40" limit={{ value: 18.4, max: 40 }} />`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, align: "stretch", stage: "subtle" },
    { id: "pressable", title: "Opens the work", description: "With `onPress` the whole stat is a button, and an arrow shows it leads somewhere. Point the number at the list it counts.", Component: Pressable, code: pressableCode, align: "stretch", stage: "subtle" },
    { id: "limit", title: "Near a limit", description: "The limit bar turns amber past 80% and red at 100%. Say what happens next in the caption.", Component: Limit, code: limitCode, align: "stretch", stage: "subtle" },
  ],
  api: [
    {
      name: "Stat",
      description: "One dashboard number: a label, the figure, and what gives it meaning.",
      props: [
        { name: "label", type: "ReactNode", required: true, description: "What it counts: \"Waiting on you\"." },
        { name: "value", type: "string", required: true, description: "The figure as it should read: \"4\", \"$18.40\", \"94%\". It changes through RollingNumber." },
        { name: "unit", type: "ReactNode", description: "Text after the figure: \"of $40\", \"runs\"." },
        { name: "change", type: "{ label: ReactNode; direction: 'up' | 'down' | 'flat'; good?: boolean; against?: string }", description: "The change since the last period, green when good and red when not. Up is good unless `good` says otherwise." },
        { name: "caption", type: "ReactNode", description: "One quiet line in the foot." },
        { name: "trend", type: "number[]", description: "Oldest first, drawn as a sparkline." },
        { name: "trendLabel", type: "string", description: "Describes the trend for assistive tech." },
        { name: "limit", type: "{ value: number; max: number }", description: "Use of a limit as a thin bar: amber past 80%, red at 100%." },
        { name: "tone", type: "'neutral' | 'warning' | 'error' | 'success'", default: "'neutral'", description: "A dot before the label for a number that needs attention." },
        { name: "onPress", type: "() => void", description: "Makes the whole stat a button that opens the work behind the number." },
        { name: "variant", type: "'filled' | 'outline'", default: "'filled'", description: "`filled` on a bg-subtle section, `outline` on canvas." },
      ],
    },
  ],
  accessibility: [
    "The figure is read once as text; the counting animation is hidden from assistive tech.",
    "With `onPress` the stat is one native button whose name is its whole content, so \"Running, 4 runs, 1 queued\" is read together.",
    "The change is written in words and with an arrow, so it never relies on green and red alone. Use `against` to say what it is compared with.",
    "The limit bar is decorative: write the limit in `unit` or `caption` too.",
  ],
});
