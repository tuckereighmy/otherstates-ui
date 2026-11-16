import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Group from './group';
import groupCode from './group.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import InInputGroup from './input-group';
import inputGroupCode from './input-group.tsx?raw';

export default defineDoc({
  id: 'kbd',
  title: 'Kbd',
  category: 'Navigation',
  description: 'Display the keys for a shortcut.',
  source: ['components/kbd.tsx', 'components/internal/class-name.ts', 'tokens.stylex.ts'],
  exports: ['Kbd', 'KbdGroup'],
  usage: `import { Kbd, KbdGroup } from '@/ui/components';

<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'group',
      title: 'Key combination',
      description: '`KbdGroup` holds the keys of one shortcut, 4px apart. Text between keys, such as "+", is muted.',
      Component: Group,
      code: groupCode,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: '`sm` is 20px, for menus and command footers; `md` is 24px. A size on the group reaches every key in it.',
      Component: Sizes,
      code: sizesCode,
    },
    {
      id: 'input-group',
      title: 'In an input group',
      description: 'A shortcut hint at the end of a search field.',
      Component: InInputGroup,
      code: inputGroupCode,
    },
  ],
  api: [
    {
      name: 'Kbd',
      description: 'One keycap: a `<kbd>` on a muted fill with a soft edge, in 12/16 Inter.',
      extends: '<kbd> attributes',
      props: [
        {
          name: 'size',
          type: "'sm' | 'md' | 'small' | 'medium'",
          default: "'md'",
          description: '20 or 24 px tall. Inside a `KbdGroup` with a size, the group\'s size is the default. `small` and `medium` are aliases.',
        },
      ],
    },
    {
      name: 'KbdGroup',
      description: 'A key combination: a `<kbd>` that holds `Kbd` keys in a row.',
      extends: '<kbd> attributes',
      props: [
        {
          name: 'size',
          type: "'sm' | 'md' | 'small' | 'medium'",
          description: 'The size of every `Kbd` inside that sets none.',
        },
      ],
    },
  ],
  accessibility: [
    'Renders `<kbd>`, which marks keyboard input. A `KbdGroup` nests the keys in an outer `<kbd>`, the HTML pattern for a key combination.',
    'Kbd is not interactive and takes no focus.',
    'Symbols such as ⌘ and ⌥ are read differently by each screen reader. Spell out keys where you can, or say the shortcut in visible text nearby.',
    'A shortcut hint does not create the shortcut: register the key handler yourself, and keep a visible control for the same action.',
  ],
});
