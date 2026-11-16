import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Tones from './tones';
import tonesCode from './tones.tsx?raw';
import CustomIcon from './custom-icon';
import customIconCode from './custom-icon.tsx?raw';
import WithActions from './with-actions';
import withActionsCode from './with-actions.tsx?raw';
import Dismissible from './dismissible';
import dismissibleCode from './dismissible.tsx?raw';
import Outline from './outline';
import outlineCode from './outline.tsx?raw';
import Composed from './composed';
import composedCode from './composed.tsx?raw';
import Announced from './announced';
import announcedCode from './announced.tsx?raw';

export default defineDoc({
  id: 'alert',
  title: 'Alert',
  category: 'Feedback',
  description: 'Highlight a message in the flow of a page.',
  source: [
    'components/alert.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Alert', 'AlertTitle', 'AlertDescription'],
  usage: `import { Alert } from '@/ui/components';

<Alert tone="success" heading="Changes published">
  Your site is up to date.
</Alert>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode, stage: 'canvas' },
    {
      id: 'tones',
      title: 'Tones',
      description: 'Info, success, warning and error tint the container and color the status icon.',
      Component: Tones,
      code: tonesCode,
      minHeight: 360,
    },
    {
      id: 'custom-icon',
      title: 'Custom icon',
      description: 'Any `Icon` can replace the status icon; `icon={null}` removes it.',
      Component: CustomIcon,
      code: customIconCode,
    },
    {
      id: 'with-actions',
      title: 'With actions',
      description: 'The `action` slot sits at the end, and drops below the text when the alert is narrow.',
      Component: WithActions,
      code: withActionsCode,
    },
    {
      id: 'dismissible',
      title: 'Dismissible',
      description: '`onDismiss` adds a close button; the alert stays until you stop rendering it.',
      Component: Dismissible,
      code: dismissibleCode,
    },
    {
      id: 'outline',
      title: 'Outline',
      description: 'A bg-surface fill with a hairline, for alerts inside cards and dense layouts.',
      Component: Outline,
      code: outlineCode,
      stage: 'canvas',
    },
    {
      id: 'composed',
      title: 'Composed content',
      description: 'Use `AlertTitle` and `AlertDescription` as children when the body needs its own markup.',
      Component: Composed,
      code: composedCode,
    },
    {
      id: 'announced',
      title: 'Announced',
      description: 'An alert that appears after an action sets `announce` so screen readers read it out.',
      Component: Announced,
      code: announcedCode,
    },
  ],
  api: [
    {
      name: 'Alert',
      description: 'A tinted container with a status icon, a title, a description and optional actions.',
      extends: '<div> attributes',
      props: [
        { name: 'heading', type: 'ReactNode', description: 'The title line, 14/20 at weight 500.' },
        { name: 'description', type: 'ReactNode', description: 'Supporting text under the title, in `fg-muted`.' },
        { name: 'children', type: 'ReactNode', description: 'Rendered as the description, or as is when it contains `AlertTitle` or `AlertDescription`.' },
        { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'error'", default: "'neutral'", description: 'Colors the fill and picks the status icon.' },
        { name: 'variant', type: "'filled' | 'outline'", default: "'filled'", description: '`filled` tints the container; `outline` uses bg-surface with a 1px `border-subtle` hairline.' },
        { name: 'icon', type: 'ReactNode', description: 'Replaces the status icon. Pass `null` for no icon.' },
        { name: 'action', type: 'ReactNode', description: 'Buttons at the end of the alert, usually `Button size="sm"`.' },
        { name: 'onDismiss', type: '() => void', description: 'Shows a close button and calls this when it is pressed.' },
        { name: 'dismissLabel', type: 'string', default: "'Dismiss'", description: 'The accessible name of the close button.' },
        { name: 'announce', type: "'polite' | 'assertive'", description: '`polite` sets `role="status"`, `assertive` sets `role="alert"`, so the alert is read when it appears.' },
      ],
    },
    {
      name: 'AlertTitle',
      description: 'The title line, for composing the content by hand.',
      extends: '<div> attributes',
      props: [],
    },
    {
      name: 'AlertDescription',
      description: 'The supporting text, for composing the content by hand.',
      extends: '<div> attributes',
      props: [],
    },
  ],
  accessibility: [
    'An Alert is static content and takes no focus; its close button and actions are in the normal tab order.',
    'Set `announce` only on alerts that appear in response to something. `assertive` interrupts the screen reader, so keep it for errors.',
    'The status icon is decorative. Say the status in the title, for example "Payment failed", not with color alone.',
    'The close button is named "Dismiss" by default; pass `dismissLabel` to name what it closes.',
    'Text keeps at least 4.5:1 against every tint in both themes.',
  ],
});
