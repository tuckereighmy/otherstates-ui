import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Outline from './outline';
import outlineCode from './outline.tsx?raw';
import Plain from './plain';
import plainCode from './plain.tsx?raw';
import DefaultExpanded from './default-expanded';
import defaultExpandedCode from './default-expanded.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import CustomTrigger from './custom-trigger';
import customTriggerCode from './custom-trigger.tsx?raw';

export default defineDoc({
  id: 'collapsible',
  title: 'Collapsible',
  category: 'Layout',
  description: 'Show or hide content with a single trigger.',
  source: [
    'components/collapsible.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/states.ts',
    'components/internal/surface.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Collapsible'],
  usage: `import { Collapsible } from '@/ui/components';

<Collapsible title="Sharing settings">
  Everyone in the workspace can view this page.
</Collapsible>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'outline',
      title: 'Outline',
      description: 'A 1px hairline gives the surface an edge on a canvas background.',
      Component: Outline,
      code: outlineCode,
      stage: 'canvas',
    },
    {
      id: 'plain',
      title: 'Plain',
      description: 'No surface: an inline text trigger with the panel straight below it.',
      Component: Plain,
      code: plainCode,
    },
    {
      id: 'default-expanded',
      title: 'Open by default',
      description: 'Set `defaultExpanded` to start open and let the trigger take over.',
      Component: DefaultExpanded,
      code: defaultExpandedCode,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Drive the panel from your own state with `isExpanded` and `onExpandedChange`.',
      Component: Controlled,
      code: controlledCode,
      minHeight: 240,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'A disabled trigger keeps its place but cannot be opened.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'custom-trigger',
      title: 'Custom trigger',
      description: 'Pass `trigger` to lay out the trigger yourself. A function receives the expanded state.',
      Component: CustomTrigger,
      code: customTriggerCode,
    },
  ],
  api: [
    {
      name: 'Collapsible',
      description: 'A trigger that shows and hides one panel of content.',
      extends: 'React Aria DisclosureProps',
      props: [
        { name: 'title', type: 'ReactNode', description: 'The trigger’s label. The chevron follows it.' },
        { name: 'children', type: 'ReactNode', required: true, description: 'The panel content, set in 14/20 `fg-muted`.' },
        { name: 'variant', type: "'filled' | 'outline' | 'plain'", default: "'filled'", description: '`filled` for bg-subtle sections, `outline` adds a 1px hairline for canvas, `plain` has no surface.' },
        { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', description: 'Wraps the trigger in a heading element. Without it the trigger is a plain button.' },
        { name: 'trigger', type: 'ReactNode | ((state: CollapsibleTriggerState) => ReactNode)', description: 'Replaces the trigger’s content (title and chevron). A function receives `isExpanded` and `isDisabled`.' },
        { name: 'isExpanded', type: 'boolean', description: 'Whether the panel is open (controlled).' },
        { name: 'defaultExpanded', type: 'boolean', default: 'false', description: 'Whether the panel starts open (uncontrolled).' },
        { name: 'onExpandedChange', type: '(isExpanded: boolean) => void', description: 'Called when the trigger opens or closes the panel.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Blocks the trigger and dims its label.' },
        { name: 'className', type: 'string', description: 'Added to the root element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the root element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The root element.' },
      ],
    },
  ],
  accessibility: [
    'The trigger is a `button` with `aria-expanded` and `aria-controls` pointing at the panel.',
    'Enter and Space open and close the panel; a disabled trigger is skipped by Tab.',
    'Set `headingLevel` when the trigger names a section, so screen readers can jump to it.',
    'A custom `trigger` still renders inside the button: give it visible text, not just an icon.',
    'With reduced motion the panel and chevron change instantly.',
  ],
});
