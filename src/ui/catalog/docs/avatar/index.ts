import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import Fallbacks from './fallbacks';
import fallbacksCode from './fallbacks.tsx?raw';
import Shapes from './shapes';
import shapesCode from './shapes.tsx?raw';
import Status from './status';
import statusCode from './status.tsx?raw';
import Group from './group';
import groupCode from './group.tsx?raw';
import Stacking from './stacking';
import stackingCode from './stacking.tsx?raw';

export default defineDoc({
  id: 'avatar',
  title: 'Avatar',
  category: 'Layout',
  description: 'Represent a person with an image or initials.',
  source: ['components/avatar.tsx', 'components/Icon.tsx', 'components/internal/states.ts', 'tokens.stylex.ts'],
  exports: ['Avatar', 'AvatarGroup'],
  usage: `import { Avatar, AvatarGroup } from '@/ui/components';

<Avatar name="Hana Sato" src="/people/hana.jpg" />

<AvatarGroup
  label="Workspace members"
  max={3}
  items={[{ name: 'Hana Sato' }, { name: 'Dele Adeyemi', fallback: 'gradient' }]}
/>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Six diameters from 24 to 80 px (24, 32, 40, 48, 64, 80); the initial scales with them on the type scale.',
      Component: Sizes,
      code: sizesCode,
    },
    {
      id: 'fallbacks',
      title: 'Fallback only',
      description: 'Without an image, or when it fails to load, an avatar shows an initial, a gradient seeded by the name, or a person glyph.',
      Component: Fallbacks,
      code: fallbacksCode,
    },
    {
      id: 'shapes',
      title: 'Shapes',
      description: '`shape="square"` rounds the corners by size: 6, 10 or 16 px here.',
      Component: Shapes,
      code: shapesCode,
    },
    {
      id: 'status',
      title: 'Status',
      description: 'A presence dot at the bottom end; its word is added to the accessible name.',
      Component: Status,
      code: statusCode,
    },
    {
      id: 'group',
      title: 'Group',
      description: '`AvatarGroup` overlaps faces with a surface ring, lifts the one under the pointer or focus, and folds the rest into a count with `max`.',
      Component: Group,
      code: groupCode,
    },
    {
      id: 'stacking',
      title: 'Stacking order',
      description: 'Later faces sit on top by default; `lastOnTop={false}` puts the first face on top.',
      Component: Stacking,
      code: stackingCode,
    },
  ],
  api: [
    {
      name: 'Avatar',
      description: 'A round or square image of a person, with a fallback.',
      extends: '<span> attributes',
      props: [
        { name: 'name', type: 'string', description: 'The person\'s name: the accessible name and the source of the initial.' },
        { name: 'src', type: 'string', description: 'Image URL. The fallback shows while it is missing or if it fails to load.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", default: "'md'", description: '24, 32, 40, 48, 64 or 80 px. `small`, `medium` and `large` are aliases of `sm`, `md` and `lg`.' },
        { name: 'shape', type: "'circle' | 'square'", default: "'circle'", description: 'A square\'s radius follows the size, from `radius-sm` to `radius-xl`.' },
        { name: 'fallback', type: "'initial' | 'icon' | 'gradient'", default: "'initial'", description: 'What shows without an image: the first initial on bg-muted, a person glyph, or a gradient seeded by `name`.' },
        { name: 'status', type: "'online' | 'away' | 'busy' | 'offline'", description: 'Shows a presence dot and adds its word to the accessible name.' },
        { name: 'statusLabel', type: 'string', description: 'Replaces the status word in the accessible name.' },
        { name: 'decorative', type: 'boolean', default: 'false', description: 'Hides the avatar from assistive tech when the name is written next to it.' },
        { name: 'colors', type: 'string[]', description: 'Colors for the `gradient` fallback.' },
      ],
    },
    {
      name: 'AvatarGroup',
      description: 'Overlapping avatars, each reachable by keyboard, with a name tip on hover and focus.',
      extends: '<div> attributes',
      props: [
        { name: 'items', type: 'AvatarProps[]', required: true, description: 'The people, in order. Each takes the Avatar props.' },
        { name: 'label', type: 'string', default: "'People'", description: 'Names the group for assistive tech.' },
        { name: 'max', type: 'number', description: 'Shows at most this many faces, then a "+N" count that names the rest.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", description: 'One size for every face, overriding each item\'s own. The overlap scales with it: about a fifth of the diameter, 8 px at `md`.' },
        { name: 'lastOnTop', type: 'boolean', default: 'true', description: 'Later faces overlap earlier ones; set false to stack the first face on top.' },
      ],
    },
  ],
  accessibility: [
    'An Avatar is an `img` named by `name` (plus its status). Set `decorative` when the name is already written beside it.',
    'In a group, every face is a focusable `img` with its name, so Tab walks the people; the count names everyone it hides.',
    'The name tip shows on hover and on keyboard focus. It repeats the accessible name, so it is hidden from assistive tech.',
    'Status is never color alone: the word is part of the accessible name.',
    'Under reduced motion the lift and tip slide are off; the tip only fades.',
  ],
});
