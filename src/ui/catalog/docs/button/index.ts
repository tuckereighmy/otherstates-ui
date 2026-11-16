import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Secondary from './secondary';
import secondaryCode from './secondary.tsx?raw';
import Tertiary from './tertiary';
import tertiaryCode from './tertiary.tsx?raw';
import Text from './text';
import textCode from './text.tsx?raw';
import Destructive from './destructive';
import destructiveCode from './destructive.tsx?raw';
import DestructiveOutline from './destructive-outline';
import destructiveOutlineCode from './destructive-outline.tsx?raw';
import Link from './link';
import linkCode from './link.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import IconOnly from './icon-only';
import iconOnlyCode from './icon-only.tsx?raw';
import IconOnlySizes from './icon-only-sizes';
import iconOnlySizesCode from './icon-only-sizes.tsx?raw';
import WithIcon from './with-icon';
import withIconCode from './with-icon.tsx?raw';
import WithLink from './with-link';
import withLinkCode from './with-link.tsx?raw';
import Loading from './loading';
import loadingCode from './loading.tsx?raw';
import LoadingCustom from './loading-custom';
import loadingCustomCode from './loading-custom.tsx?raw';
import Pressed from './pressed';
import pressedCode from './pressed.tsx?raw';
import InAForm from './in-a-form';
import inAFormCode from './in-a-form.tsx?raw';

export default defineDoc({
  id: 'button',
  title: 'Button',
  category: 'Forms',
  description: 'Run an action or submit a form.',
  source: [
    'components/button.tsx',
    'components/Icon.tsx',
    'components/internal/overlay.tsx',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Button', 'OverlayButton'],
  usage: `import { Button } from '@/ui/components';

<Button onClick={() => console.log('Saved')}>Save changes</Button>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'secondary',
      title: 'Secondary',
      description: 'A neutral fill for the actions beside the primary one.',
      Component: Secondary,
      code: secondaryCode,
    },
    {
      id: 'tertiary',
      title: 'Tertiary',
      description: 'Transparent with a hairline outline, for a quieter action that still reads as a button.',
      Component: Tertiary,
      code: tertiaryCode,
    },
    {
      id: 'text',
      title: 'Text',
      description: 'No fill until hover, for low-emphasis actions and toolbars.',
      Component: Text,
      code: textCode,
    },
    {
      id: 'destructive',
      title: 'Destructive',
      description: 'White text on the danger fill, for the one action that deletes or cannot be undone.',
      Component: Destructive,
      code: destructiveCode,
    },
    {
      id: 'destructive-outline',
      title: 'Destructive outline',
      description: 'Error-colored text on a transparent fill, for a destructive action that is not the main one.',
      Component: DestructiveOutline,
      code: destructiveOutlineCode,
    },
    {
      id: 'link',
      title: 'Link',
      description: 'Looks like a text link and keeps button semantics; it underlines on hover.',
      Component: Link,
      code: linkCode,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Heights of 24, 32, 40, 44 and 48 px. `md` is the default and lines up with fields.',
      Component: Sizes,
      code: sizesCode,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'Filled buttons take the disabled fill; transparent ones stay transparent.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'icon-only',
      title: 'Icon only',
      description: 'A square button with one icon. Give it an `aria-label`.',
      Component: IconOnly,
      code: iconOnlyCode,
    },
    {
      id: 'icon-only-sizes',
      title: 'Icon-only sizes',
      description: 'Squares of 24 to 48 px. An `Icon` without a size takes 14, 16, 16, 18 or 20 px to match.',
      Component: IconOnlySizes,
      code: iconOnlySizesCode,
    },
    {
      id: 'with-icon',
      title: 'With icon',
      description: '`leadingIcon` and `trailingIcon` place an icon beside the label and tighten the padding on that side.',
      Component: WithIcon,
      code: withIconCode,
    },
    {
      id: 'with-link',
      title: 'With link',
      description: 'With `href`, the button renders an `<a>` that keeps the button look.',
      Component: WithLink,
      code: withLinkCode,
    },
    {
      id: 'loading',
      title: 'Loading',
      description: 'Press it: `isLoading` swaps the label for a spinner, keeps the size and fill, and ignores presses.',
      Component: Loading,
      code: loadingCode,
    },
    {
      id: 'loading-custom',
      title: 'Loading with a label',
      description: 'A `Spinner` in the leading slot keeps the label visible while the work runs.',
      Component: LoadingCustom,
      code: loadingCustomCode,
    },
    {
      id: 'pressed',
      title: 'Pressed state',
      description: '`aria-pressed` on a `tertiary` or `text` button shows the toggled fill. For most on and off controls, use Toggle.',
      Component: Pressed,
      code: pressedCode,
    },
    {
      id: 'in-a-form',
      title: 'In a form',
      description: 'A full-width submit button under a field.',
      Component: InAForm,
      code: inAFormCode,
      minHeight: 240,
    },
  ],
  api: [
    {
      name: 'Button',
      description: 'A `<button>` in the shared control shape (a pill by default), or an `<a>` when it has an `href`.',
      extends: '<button> attributes',
      props: [
        {
          name: 'appearance',
          type: "'primary' | 'secondary' | 'tertiary' | 'text' | 'destructive' | 'destructive-outline' | 'link'",
          default: "'primary'",
          description: 'The visual style.',
        },
        {
          name: 'size',
          type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large'",
          default: "'md'",
          description: 'Height, padding, text and icon size from the control scale. `small`, `medium` and `large` are aliases of `sm`, `md` and `lg`.',
        },
        { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches the button to the width of its container.' },
        { name: 'isLoading', type: 'boolean', default: 'false', description: 'Shows a centered spinner in place of the label, sets `aria-busy` and ignores presses.' },
        { name: 'loading', type: 'boolean', description: 'Deprecated alias of `isLoading`.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables the button. Same as the native `disabled`.' },
        { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Makes the button square for a single icon child. Give it an `aria-label`.' },
        { name: 'leadingIcon', type: 'ReactNode', description: 'An icon before the label. An `Icon` without a size takes the control\'s icon size.' },
        { name: 'trailingIcon', type: 'ReactNode', description: 'An icon after the label. An `Icon` without a size takes the control\'s icon size.' },
        { name: 'href', type: 'string', description: 'Renders an `<a>` with the button look. A disabled link drops its `href` and sets `aria-disabled`.' },
        { name: 'target', type: 'string', description: 'The link\'s `target`, used with `href`.' },
        { name: 'rel', type: 'string', description: 'The link\'s `rel`, used with `href`.' },
        { name: 'download', type: 'boolean | string', description: 'The link\'s `download`, used with `href`.' },
        { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'The native button type. Set `submit` for the main action of a form.' },
      ],
    },
    {
      name: 'OverlayButton',
      description: 'Deprecated. A React Aria button with the Button look at size `md`, kept for one release where a React Aria trigger needs a pressable child.',
      extends: 'React Aria ButtonProps',
      props: [
        {
          name: 'tone',
          type: "'neutral' | 'primary' | 'danger'",
          default: "'neutral'",
          description: 'Maps to a Button appearance: `neutral` to `tertiary`, `primary` to `primary`, `danger` to `destructive`.',
        },
        { name: 'appearanceStyles', type: 'stylex.StyleXStyles', description: 'Extra StyleX styles, merged last.' },
      ],
    },
  ],
  accessibility: [
    'Renders a native `button`, so Enter and Space activate it and it joins the tab order. With `href` it renders a link, which Enter follows.',
    'The focus ring shows for keyboard focus only: 2px in the focus-ring color, 2px outside the button.',
    'An icon-only button needs an `aria-label`; icons inside buttons are hidden from assistive tech.',
    'While loading, the button sets `aria-busy` and `aria-disabled` and keeps its accessible name, because the label stays in the layout.',
    'An invisible hit area extends the target to at least 24px, and 44px on touch screens, without changing its size.',
    'With reduced motion, the press scale is off and the loading spinner stops turning.',
  ],
});
