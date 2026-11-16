import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithLabel from './with-label';
import withLabelCode from './with-label.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import Tones from './tones';
import tonesCode from './tones.tsx?raw';
import InInputGroup from './input-group';
import inputGroupCode from './input-group.tsx?raw';
import InButton from './button';
import buttonCode from './button.tsx?raw';

export default defineDoc({
  id: 'spinner',
  title: 'Spinner',
  category: 'Feedback',
  description: 'Show that work is underway.',
  source: ['components/spinner.tsx', 'components/internal/class-name.ts', 'tokens.stylex.ts'],
  exports: ['Spinner'],
  usage: `import { Spinner } from '@/ui/components';

<Spinner label="Syncing files" />`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'with-label',
      title: 'With label',
      description: '`label` shows text beside the ring and names the status for assistive tech.',
      Component: WithLabel,
      code: withLabelCode,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Rings of 16, 24 and 32 px. `md` is the default.',
      Component: Sizes,
      code: sizesCode,
    },
    {
      id: 'tones',
      title: 'Tones',
      description: '`default` draws the arc in the accent, `muted` in secondary text, and `current` follows the color around it.',
      Component: Tones,
      code: tonesCode,
      align: 'center',
    },
    {
      id: 'input-group',
      title: 'In an input group',
      description: 'A small muted spinner in the trailing addon while a value is checked. InputGroup\'s `isLoading` does the same for you.',
      Component: InInputGroup,
      code: inputGroupCode,
    },
    {
      id: 'button',
      title: 'In a button',
      description: 'With `tone="current"`, a spinner in the leading slot takes the button\'s text color. Button\'s `isLoading` replaces the label instead.',
      Component: InButton,
      code: buttonCode,
    },
  ],
  api: [
    {
      name: 'Spinner',
      description: 'A ring with a turning arc, and optional text beside it.',
      extends: '<span> attributes',
      props: [
        { name: 'label', type: 'string', description: 'Visible text beside the ring. It also names the status for assistive tech.' },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'",
          default: "'md'",
          description: 'A ring of 16, 24 or 32 px; the stroke is 2 px, and 2.5 px at `lg`. `small`, `medium` and `large` are aliases.',
        },
        {
          name: 'tone',
          type: "'default' | 'muted' | 'current'",
          default: "'default'",
          description: 'The arc color: the accent, secondary text, or the surrounding text color.',
        },
      ],
    },
  ],
  accessibility: [
    'With `label` or `aria-label`, the spinner renders `role="status"`, so screen readers announce it without moving focus.',
    'Without either, it is hidden from assistive tech. Use that only where the surrounding control already says it is busy, such as a button with `aria-disabled` and a visible label.',
    'The arc turns once every 800 ms. With reduced motion it stops and shows a still three-quarter ring.',
    'The track and arc are decorative; the label carries the meaning.',
  ],
});
