import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Placement from './placement';
import placementCode from './placement.tsx?raw';
import Width from './width';
import widthCode from './width.tsx?raw';
import PeoplePreviewExample from './people-preview';
import peoplePreviewCode from './people-preview.tsx?raw';

export default defineDoc({
  id: 'preview-card',
  title: 'Preview Card',
  category: 'Overlays',
  description: 'A card that previews a link when it is hovered or focused.',
  source: [
    'components/preview-card.tsx',
    'components/avatar.tsx',
    'components/button.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/overlay.tsx',
    'components/internal/size.ts',
    'components/internal/spring.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['PreviewCard', 'PeoplePreview', 'PreviewProfile'],
  usage: `import { PreviewCard } from '@/ui/components';

<PreviewCard href="/handbook" trigger="Release handbook">
  Steps, owners and rollback plans for every release.
</PreviewCard>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    { id: 'placement', title: 'Placement and delay', description: 'Open below the link, and tune how long the pointer must rest and how long the card lingers.', Component: Placement, code: placementCode },
    { id: 'width', title: 'Width', description: 'Set `width` for richer content; the card never exceeds the viewport less 24px.', Component: Width, code: widthCode, minHeight: 320 },
    { id: 'people-preview', title: 'People preview', description: 'A composite showcase: one shared card that follows the pointer across a row of faces.', Component: PeoplePreviewExample, code: peoplePreviewCode, minHeight: 400 },
  ],
  api: [
    {
      name: 'PreviewCard',
      description: 'A link and the card it shows on hover or focus.',
      props: [
        { name: 'href', type: 'string', required: true, description: 'Where the link goes.' },
        { name: 'trigger', type: 'ReactNode', required: true, description: 'The link text.' },
        { name: 'children', type: 'ReactNode', required: true, description: 'The card content. Keep it non-interactive.' },
        { name: 'placement', type: 'Placement', default: "'top'", description: 'The side of the link the card opens on. It flips when there is no room.' },
        { name: 'offset', type: 'number', default: '6', description: 'Distance from the link in px.' },
        { name: 'crossOffset', type: 'number', description: 'Shift along the link’s edge, in px.' },
        { name: 'width', type: 'number | string', default: '256', description: 'Card width in px or any CSS length. The default is the popover width.' },
        { name: 'delay', type: 'number', description: 'Milliseconds of hover before the card opens. Focus opens it at once.' },
        { name: 'closeDelay', type: 'number', description: 'Milliseconds before it closes after the pointer leaves.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Never show the card; the link still works.' },
        { name: 'isOpen', type: 'boolean', description: 'Whether the card is open, controlled.' },
        { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the card starts open, uncontrolled.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the card opens or closes.' },
        { name: 'portalContainer', type: 'Element', default: 'document.body', description: 'Where the card renders.' },
        { name: 'className', type: 'string', description: 'Classes for the card surface.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the card surface.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The card surface element.' },
      ],
    },
    {
      name: 'PeoplePreview',
      description: 'A showcase: a 48 px row of faces that share one profile card, up to 320 px wide.',
      props: [
        { name: 'profiles', type: 'PreviewProfile[]', required: true, description: 'The people, in order. Each has an id, name, handle, bio, counts and optional mutual followers.' },
        { name: 'summary', type: 'string', required: true, description: 'The line beside the faces.' },
        { name: 'caption', type: 'string', default: "'liked your post'", description: 'The muted line under the summary.' },
        { name: 'delay', type: 'number', default: '400', description: 'Milliseconds of hover before the first card opens.' },
        { name: 'followedIds', type: 'readonly string[]', description: 'The followed profiles, controlled.' },
        { name: 'defaultFollowedIds', type: 'readonly string[]', default: '[]', description: 'The followed profiles at the start, uncontrolled.' },
        { name: 'onFollowChange', type: '(ids: string[]) => void', description: 'Called with every follow or unfollow.' },
        { name: 'className', type: 'string', description: 'Classes for the root.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the root.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The root element.' },
      ],
    },
  ],
  accessibility: [
    'The trigger is a real link: Enter follows it, and the card is extra context for sighted pointer and keyboard users.',
    'The card opens on hover after `delay` and at once on keyboard focus, and closes on blur, pointer leave or Escape.',
    'Screen readers do not reach the card, so never put information or actions only there.',
    'In PeoplePreview each face is a button with `aria-expanded`; Escape closes the card and Follow is a toggle with `aria-pressed`.',
    'Under reduced motion the cards only fade.',
  ],
});
