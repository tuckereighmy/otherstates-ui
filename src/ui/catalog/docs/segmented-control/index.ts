import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import Navigation from './navigation';
import navigationCode from './navigation.tsx?raw';
import NavigationSizes from './navigation-sizes';
import navigationSizesCode from './navigation-sizes.tsx?raw';
import WithIcons from './with-icons';
import withIconsCode from './with-icons.tsx?raw';
import IconOnly from './icon-only';
import iconOnlyCode from './icon-only.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import InAForm from './in-a-form';
import inAFormCode from './in-a-form.tsx?raw';
import WithSurface from './with-surface';
import withSurfaceCode from './with-surface.tsx?raw';
import Elastic from './elastic';
import elasticCode from './elastic.tsx?raw';

export default defineDoc({
  id: 'segmented-control',
  title: 'Segmented Control',
  category: 'Forms',
  description: 'Switch between a short row of related choices, views or pages.',
  source: [
    'components/segmented-control.tsx',
    'components/internal/choice.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/size.ts',
    'components/internal/spring.ts',
    'components/internal/states.ts',
    'components/internal/surface.ts',
    'tokens.stylex.ts',
  ],
  exports: ['SegmentedControl'],
  usage: `import { SegmentedControl } from '@/ui/components';

<SegmentedControl
  label="View"
  defaultValue="list"
  options={[
    { value: 'list', label: 'List' },
    { value: 'board', label: 'Board' },
  ]}
/>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'sizes',
      title: 'Sizes',
      description: '`size` sets the segment height on the control scale: `xs` 24, `sm` 32 (the default) and `md` 40, each inside a 4px track.',
      Component: Sizes,
      code: sizesCode,
    },
    {
      id: 'navigation',
      title: 'Navigation',
      description: 'Give every option an `href` and the control becomes a row of links, with `aria-current` on the current page.',
      Component: Navigation,
      code: navigationCode,
    },
    {
      id: 'navigation-sizes',
      title: 'Navigation sizes',
      description: 'Links take the same sizes as the radio group.',
      Component: NavigationSizes,
      code: navigationSizesCode,
    },
    {
      id: 'with-icons',
      title: 'With icons',
      description: 'An option can carry an `icon` before its label.',
      Component: WithIcons,
      code: withIconsCode,
    },
    {
      id: 'icon-only',
      title: 'Icon only',
      description: 'With `hideLabel` a segment shows only its icon and turns square; the label stays its accessible name.',
      Component: IconOnly,
      code: iconOnlyCode,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'Disable one option with `disabled`, or the whole control with `isDisabled`.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Pass `value` and `onChange` to own the selection.',
      Component: Controlled,
      code: controlledCode,
    },
    {
      id: 'in-a-form',
      title: 'In a form',
      description: 'With `name`, the selected value is submitted with the form like a radio group.',
      Component: InAForm,
      code: inAFormCode,
      minHeight: 240,
    },
    {
      id: 'with-surface',
      title: 'With surface',
      description: '`withSurface` wraps the control in a labeled panel.',
      Component: WithSurface,
      code: withSurfaceCode,
    },
    {
      id: 'elastic',
      title: 'Elastic',
      description: '`appearance="elastic"` draws separate chips that stretch and settle on a spring as the selection moves.',
      Component: Elastic,
      code: elasticCode,
      minHeight: 240,
    },
  ],
  api: [
    {
      name: 'SegmentedControl',
      description: 'A radio group drawn as segments on a track, or a row of links when every option has an `href`.',
      props: [
        { name: 'label', type: 'string', required: true, description: 'Names the group for assistive tech. It is shown above the control with `withSurface`.' },
        { name: 'options', type: 'SegmentedOption[]', required: true, description: 'The segments: `{ value, label, icon?, hideLabel?, href?, disabled? }`.' },
        { name: 'value', type: 'string', description: 'The selected value (controlled). In navigation mode, the current page.' },
        { name: 'defaultValue', type: 'string', description: 'The value selected at first (uncontrolled). Defaults to the first enabled option.' },
        { name: 'onChange', type: '(value: string) => void', description: 'Called with the value of the segment the user picks.' },
        { name: 'appearance', type: "'connected' | 'elastic'", default: "'connected'", description: '`connected`: segments on a `bg-muted` track with a raised tile. `elastic`: separate 32 px chips with a spring.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'Segment height on the control scale; the track adds 4px around the segments. Ignored by `elastic`.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables every segment.' },
        { name: 'disabled', type: 'boolean', description: 'Deprecated alias of `isDisabled`.' },
        { name: 'name', type: 'string', description: 'The form field name for the selected value.' },
        { name: 'form', type: 'string', description: 'The id of a `<form>` to submit with when the control sits outside it.' },
        { name: 'withSurface', type: 'boolean', default: 'false', description: 'Wraps the control in a panel with its label shown.' },
        { name: 'wobble', type: 'number', default: '67', description: 'How much the `elastic` chips stretch, from 0 to 100.' },
        { name: 'className', type: 'string', description: 'A class added to the outermost element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles on the outermost element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'A ref to the outermost element.' },
      ],
    },
  ],
  accessibility: [
    'By default the control is a `radiogroup`: Tab focuses the selected segment, and the arrow keys move and select.',
    'In navigation mode it is a `<nav>` of links: each link is its own tab stop, and the current one has `aria-current="page"`.',
    '`label` names the group or the navigation landmark; icon-only segments use their `label` as the accessible name.',
    'Disabled segments are skipped by the arrow keys and are not announced as selectable.',
    'The tile slides and settles without overshoot, and the `elastic` chips stretch on a spring; with reduced motion both move instantly.',
  ],
});
