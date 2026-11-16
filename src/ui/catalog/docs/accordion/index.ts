import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Multiple from './multiple';
import multipleCode from './multiple.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import Card from './card';
import cardCode from './card.tsx?raw';
import Chevron from './chevron';
import chevronCode from './chevron.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import CustomContent from './custom-content';
import customContentCode from './custom-content.tsx?raw';

const itemProps = [
  { name: 'id', type: 'Key', description: 'Identifies the item in the group’s `expandedKeys`.' },
  { name: 'appearance', type: "'list' | 'card'", default: "'list'", description: '`list` separates items with a hairline; `card` puts each item on its own surface, 8px apart. Defaults to the group’s.' },
  { name: 'icon', type: "'plus' | 'chevron'", default: "'plus'", description: 'The trigger icon: a plus that turns into a cross, or a chevron that turns over. Defaults to the group’s.' },
  { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: 'The heading element around the trigger. Defaults to the group’s.' },
  { name: 'isExpanded', type: 'boolean', description: 'Whether the item is open (controlled). Inside a group, use the group’s `expandedKeys`.' },
  { name: 'defaultExpanded', type: 'boolean', default: 'false', description: 'Whether the item starts open (uncontrolled).' },
  { name: 'onExpandedChange', type: '(isExpanded: boolean) => void', description: 'Called when the item opens or closes.' },
  { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Blocks the trigger and dims its label and icon.' },
  { name: 'className', type: 'string', description: 'Added to the item’s root element.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styles for the item’s root element.' },
  { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The item’s root element.' },
];

export default defineDoc({
  id: 'accordion',
  title: 'Accordion',
  category: 'Layout',
  description: 'Reveal related sections one at a time.',
  source: [
    'components/accordion.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Accordion', 'AccordionGroup', 'AccordionItem', 'AccordionTrigger', 'AccordionPanel'],
  usage: `import { Accordion, AccordionGroup } from '@/ui/components';

<AccordionGroup defaultExpandedKeys={['access']}>
  <Accordion id="access" title="Who can see a workspace?">
    Only the people you invite.
  </Accordion>
  <Accordion id="roles" title="Can roles be changed later?">
    Owners and admins can change any role.
  </Accordion>
</AccordionGroup>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'multiple',
      title: 'Multiple',
      description: 'Set `allowsMultipleExpanded` to let several items stay open at once.',
      Component: Multiple,
      code: multipleCode,
      minHeight: 320,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Hold the open items in state with `expandedKeys` and `onExpandedChange`.',
      Component: Controlled,
      code: controlledCode,
      minHeight: 360,
    },
    {
      id: 'card',
      title: 'Cards',
      description: 'With `appearance="card"` each item sits on its own surface.',
      Component: Card,
      code: cardCode,
      minHeight: 300,
    },
    {
      id: 'chevron',
      title: 'Chevron icon',
      description: 'Use `icon="chevron"` for settings-style sections.',
      Component: Chevron,
      code: chevronCode,
    },
    {
      id: 'disabled',
      title: 'Disabled item',
      description: 'A disabled item keeps its place in the list but cannot be opened.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'custom-content',
      title: 'Custom content',
      description: 'Compose items from `AccordionItem`, `AccordionTrigger` and `AccordionPanel` to put any content in the trigger and panel.',
      Component: CustomContent,
      code: customContentCode,
      minHeight: 300,
    },
  ],
  api: [
    {
      name: 'AccordionGroup',
      description: 'Holds the items and decides which are open. One at a time unless `allowsMultipleExpanded` is set.',
      extends: 'React Aria DisclosureGroupProps',
      props: [
        { name: 'allowsMultipleExpanded', type: 'boolean', default: 'false', description: 'Lets more than one item be open at a time.' },
        { name: 'expandedKeys', type: 'Iterable<Key>', description: 'The ids of the open items (controlled).' },
        { name: 'defaultExpandedKeys', type: 'Iterable<Key>', description: 'The ids of the items open at first (uncontrolled).' },
        { name: 'onExpandedChange', type: '(keys: Set<Key>) => void', description: 'Called with the new set of open ids.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables every item.' },
        { name: 'appearance', type: "'list' | 'card'", default: "'list'", description: 'The default `appearance` of every item.' },
        { name: 'icon', type: "'plus' | 'chevron'", default: "'plus'", description: 'The default `icon` of every item.' },
        { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: 'The default heading level of every trigger.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The group element.' },
      ],
    },
    {
      name: 'Accordion',
      description: 'One item with a title and an answer, the common case. A string answer arrives word by word as the item opens.',
      extends: 'React Aria DisclosureProps',
      props: [
        { name: 'title', type: 'ReactNode', required: true, description: 'The question or section name in the trigger. It stays on one line and truncates.' },
        { name: 'children', type: 'ReactNode', required: true, description: 'The answer, set in 14/20 `fg-muted`.' },
        ...itemProps,
      ],
    },
    {
      name: 'AccordionItem',
      description: 'One item for custom content. Put an `AccordionTrigger` and an `AccordionPanel` inside it.',
      extends: 'React Aria DisclosureProps',
      props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'An `AccordionTrigger` followed by an `AccordionPanel`.' },
        ...itemProps,
      ],
    },
    {
      name: 'AccordionTrigger',
      description: 'The heading and button that open an item.',
      extends: '<h3> attributes',
      props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'The trigger’s label.' },
        { name: 'icon', type: "'plus' | 'chevron'", description: 'Overrides the item’s icon.' },
        { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', description: 'Overrides the item’s heading level.' },
      ],
    },
    {
      name: 'AccordionPanel',
      description: 'The content of an item. Its height animates as the item opens and closes.',
      extends: 'React Aria DisclosurePanelProps',
      props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'The panel content, set in 14/20 `fg-muted`.' },
        { name: 'className', type: 'string', description: 'Added to the panel element.' },
      ],
    },
  ],
  accessibility: [
    'Each trigger is a `button` inside a heading (h3 by default), with `aria-expanded` and `aria-controls` pointing at its panel.',
    'Tab moves between triggers; Enter and Space open and close the focused item. Disabled items are skipped.',
    'Choose `headingLevel` so the triggers fit the page’s heading outline.',
    'Panels have the `group` role and are hidden from assistive technology while closed.',
    'With reduced motion the panel, icon and word reveal change instantly.',
  ],
});
