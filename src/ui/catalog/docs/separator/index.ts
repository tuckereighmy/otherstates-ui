import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Vertical from './vertical';
import verticalCode from './vertical.tsx?raw';
import Decorative from './decorative';
import decorativeCode from './decorative.tsx?raw';

export default defineDoc({
  id: 'separator',
  title: 'Separator',
  category: 'Layout',
  description: 'Make a clear break between groups of content.',
  source: ['components/separator.tsx', 'components/internal/class-name.ts', 'tokens.stylex.ts'],
  exports: ['Separator'],
  usage: `import { Separator } from '@/ui/components';

<Separator />`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'vertical',
      title: 'Vertical',
      description: 'In a flex row, a vertical separator stretches to the height of the row.',
      Component: Vertical,
      code: verticalCode,
    },
    {
      id: 'decorative',
      title: 'Decorative',
      description: 'Between items of metadata the line is visual only, so `decorative` hides it from assistive tech.',
      Component: Decorative,
      code: decorativeCode,
    },
  ],
  api: [
    {
      name: 'Separator',
      description: 'A 1px line in `border-subtle`, full width or full height.',
      extends: '<div> attributes',
      props: [
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: 'The direction of the line. A vertical separator stretches to the height of its flex row.',
        },
        {
          name: 'decorative',
          type: 'boolean',
          default: 'false',
          description: 'Hides the separator from assistive tech when it only decorates.',
        },
      ],
    },
  ],
  accessibility: [
    'Renders `role="separator"` with `aria-orientation`, so screen readers announce the break between groups.',
    'With `decorative`, it renders `role="none"` and is skipped.',
    'It is not focusable and has no keyboard interaction.',
  ],
});
